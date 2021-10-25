#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import mri from 'mri'
import { glopen } from './src/index.js'

const DEFAULT_CONFIG = './glopen.config.js'

const die = (message, arg) => {
	console.log(message)
	if (arg) console.log('  ', arg)
	process.exit(1)
}

let { json, c, config, dir, api, ext, out: output } = mri(process.argv.slice(2))
config = c || config
config = typeof config === 'boolean'
	? DEFAULT_CONFIG
	: config

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

if (!output) die('Cannot resolve paths in compiled code without output file/directory.')
output = output.startsWith('/')
	? output
	: path.resolve(output)

glopen({
	merge: merge.map(({ dir, api, ext }) => ({
		api,
		ext,
		dir: dir.startsWith('/')
			? dir
			: path.resolve(dir)
	}))
})
	.then(({ definition, routes }) => {
		if (output) return fs.writeFile(output, definition + '\n\n' + routes + '\n', 'utf8')
	})
	.then(() => {
		if (output) console.log(`Wrote to: ${output}`)
		process.exit(0)
	})
	.catch(error => {
		console.error('Failure when generating:', error)
		process.exit(1)
	})
