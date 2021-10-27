#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import mri from 'mri'
import { glopen } from './src/index.js'

const DEFAULT_CONFIG = './glopen.config.js'
const CWD = process.cwd()

const die = (message, arg) => {
	console.log(message)
	if (arg) console.log('  ', arg)
	process.exit(1)
}

let { json, c, config, dir, api, ext, out: output, openapi } = mri(process.argv.slice(2))
openapi = openapi || '3.0.2'
config = c || config
config = typeof config === 'boolean'
	? DEFAULT_CONFIG
	: config
if (config && !config.startsWith('/')) config = path.join(CWD, config)
if (output) {
	output = output.startsWith('/')
		? output
		: path.resolve(output)
}

let merge = []

let isSingle = dir || api || ext
let count = (isSingle && 1) + (json && 1) + (config && 1)
if (count > 1) die('Cannot specify multiple input methods at the same time.')

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
	let details
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

glopen({
	openapi,
	merge: merge.map(({ dir, api, ext }) => ({
		api,
		ext,
		dir: dir.startsWith('/')
			? dir
			: path.resolve(dir),
	})),
})
	.then(({ definition, routes }) => {
		const string = definition + '\n\n' + routes
		if (output) return fs.writeFile(output,  string, 'utf8')
		else console.log(string)
	})
	.then(() => {
		if (output) console.log(`Wrote to: ${output}`)
		process.exit(0)
	})
	.catch(error => {
		console.error('Failure when generating:', error)
		process.exit(1)
	})
