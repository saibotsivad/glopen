#!/usr/bin/env node

import { GlopenConfiguration, GlopenMerge } from '../index.d'

import fs from 'node:fs/promises'
import path from 'node:path'
import { EventEmitter } from 'node:events'

import sade from 'sade'
import CheapWatch from 'cheap-watch'

import { glopen } from './index'

const DEFAULT_CONFIG = './glopen.config.js'
const CWD = process.cwd()

const die = (message: string, arg?: unknown) => {
	console.log(message)
	if (arg) console.log('  ', arg)
	process.exit(1)
}

const absResolve = (dir: string) => dir.startsWith('/') ? dir : path.resolve(dir)

sade('glopen', true)
	.version('0.0.0')
	.describe('Glob one or more folders into output for OpenAPI tools.')
	.option('--api', 'Specify the prefix to use for the API paths. (Single directory mode.)')
	.option('--dir', 'Specify the directory to glob. (Single directory mode.)')
	.option('--ext', 'Specify the filename extension prefix. (Single directory mode.)', '@')
	.option('--json', 'Specify one or more mergeable objects or arrays of them. (Multi-mode.)')
	.option('--openapi', 'Specify the version of OpenAPI output to generate.', '3.1.0')
	.option('-o, --output', 'The file to write the generated output to.')
	.option('-c, --config', 'Specify a configuration file to use.', 'glopen.config.{ts,js}')
	.option('-w, --watch', 'Run in watch mode, rebuilding all outputs on file changes.')
	.action(({ api, dir, ext, json, openapi, output, config, watch }) => {
		openapi = openapi || '3.0.2'
		config = typeof config === 'boolean'
			? DEFAULT_CONFIG
			: config
		if (config && !config.startsWith('/')) config = path.join(CWD, config)
		if (output) output = absResolve(output)
		
		let isSingle = dir || api || ext
		let count = (isSingle && 1) + (json && 1) + (config && 1)
		if (count > 1) die('Cannot specify multiple input methods at the same time.')

		async function setup () : Promise<Array<GlopenMerge>> {
			const merge = []
			if (isSingle) {
				merge.push({ dir, api, ext })
			} else if (json) {
				json = Array.isArray(json) ? json : [ json ]
				for (let args of json) {
					try {
						args = JSON.parse(args)
					} catch (ignore) {
						die('The provided "json" parameter was invalid JSON:', args)
					}
					if (Array.isArray(args)) merge.push(...args)
					else merge.push(args)
				}
			} else if (config) {
				let details: GlopenConfiguration
				try {
					details = await import(config)
				} catch (error) {
					if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error
					die('Could not locate config file:', config)
				}
				if (!details.default.merge || !details.default.merge.length) die('Could not find "merge" in config file, or had zero parts.')
				merge.push(...details.default.merge)
				if (!output && details.default.output) output = details.default.output
			}
			if (!output && watch) {
				console.log('Cannot safely run watch without an output file specified.')
				process.exit(1)
			}
			return merge
		}

		async function build (parts: Array<GlopenMerge>) {
			const { definition, routes } = await glopen({
				openapi,
				merge: parts.map(({ dir, api, ext }) => ({
					api,
					ext,
					dir: absResolve(dir),
				})),
			})
			const string = definition + '\n\n' + routes
			if (output) {
				const outdir = path.dirname(output)
				await fs.mkdir(outdir, { recursive: true })
				await fs.writeFile(output, string, 'utf8')
				console.log(`Wrote to: ${output}`)
			} else {
				console.log(string)
			}
		}

		if (watch) {
			console.log('Entering watch mode...')
			// if the config files is changed, reload it
			// then, watch the dirs
			const forever = new Promise(() => {
				const emitter = new EventEmitter()
				let parts: Array<GlopenMerge>
				emitter.on('restart', () => {
					setup().then(_parts => {
						parts = _parts
						_parts.forEach(p => {
							const watch = new CheapWatch({
								dir: absResolve(p.dir),
								filter: ({ path }) => path.endsWith(`.${p.ext}.js`),
							})
							watch.on('+', () => emitter.emit('rebuild'))
							watch.on('-', () => emitter.emit('rebuild'))
							watch.init()
						})
						emitter.emit('rebuild')
					})
				})
				emitter.on('rebuild', () => {
					if (parts) {
						console.log('Rebuilding...')
						build(parts)
							.then(() => console.log('Rebuild complete.'))
							.catch(error => {
								console.error('Failure on rebuild:', error)
							})
					}
				})
				if (config) {
					const configWatch = new CheapWatch({
						dir: path.dirname(config),
						filter: ({ path }) => path === config,
					})
					configWatch.on('-', () => emitter.emit('restart'))
					configWatch.init().then(() => emitter.emit('restart'))
				} else {
					emitter.emit('restart')
				}
			})
			forever.then(() => console.log('Watch completed.'))
		} else {
			setup()
				.then(parts => build(parts))
				.then(() => process.exit(0))
				.catch(error => {
					console.error('Failure when generating:', error)
					process.exit(1)
				})
		}
	})
	.parse(process.argv)
