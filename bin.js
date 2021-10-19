#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import mri from 'mri'
import { glopen } from './src/index.js'

let { api: directory, out: outputFile, pathPrefix, ext: filenameExtensionPrefix } = mri(process.argv.slice(2))

// defaults
if (!directory) directory = process.cwd()
outputFile = outputFile || './generated.js'
pathPrefix = pathPrefix || './'
filenameExtensionPrefix = filenameExtensionPrefix || '@'
// fully resolve the api directory
if (!directory.endsWith('/')) directory = `${directory}/`
if (!directory.startsWith('/')) directory = path.resolve(directory)


glopen({ api: directory, pathPrefix, ext: filenameExtensionPrefix })
	.then(({ definition, routes }) => {
		return fs.writeFile(outputFile, definition + '\n\n' + routes + '\n', 'utf8')
	})
	.then(() => {
		console.log(`Wrote to: ${outputFile}`)
		process.exit(0)
	})
	.catch(error => {
		console.error('Failure when generating:', error)
		process.exit(1)
	})
