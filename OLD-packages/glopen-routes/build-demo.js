#!/usr/bin/env node

import { join } from 'node:path'
import { readFile, writeFile } from 'node:fs/promises'
import { EOL } from 'node:os'
import { dump } from 'js-yaml'
import { compile } from 'ajv-openapi-compile'

const NAME = process.argv.slice(2)
const SWAGGER_HTML_FILE = './' + join('demo', `${NAME}-swagger.html`)
const REDOC_HTML_FILE = './' + join('demo', `${NAME}-redoc.html`)
const JS_FILE = './' + join('demo', `${NAME}.js`)
const JSON_FILE = './' + join('demo', `${NAME}.json`)
const YAML_FILE = './' + join('demo', `${NAME}.yaml`)
const AJV_FILE = './' + join('demo', `${NAME}-ajv.js`)

const lines = []

const htmlTemplate = ({ name }) => `<!DOCTYPE html>
<html lang="en-US">
<head>
	<title>Glopen Routes: ${name}</title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="description" content="Reference documentation and OpenAPI specification for the '${name}' portion of the Glopen Routes API." />
	<meta charset="utf-8" />
</head>
<body>
	<redoc spec-url="/all.yaml" hide-hostname="true" lazy-rendering></redoc>
	<script src="https://cdn.jsdelivr.net/npm/redoc@2.0.0-alpha.17/bundles/redoc.standalone.js"></script>
</body>
</html>
`

const writeGeneratedFiles = () => writeFile(JS_FILE, lines.join('\n'), 'utf8')
	.then(() => import(JS_FILE))
	.then(js => Promise.all([
		writeFile(JSON_FILE, JSON.stringify(js.definition, undefined, 4), 'utf8'),
		writeFile(YAML_FILE, dump(JSON.parse(JSON.stringify(js.definition))), 'utf8'),
		compile(js.definition).then(({ code }) => writeFile(AJV_FILE, code, 'utf8')),
	]))
	.then(() => readFile(join('demo', 'swagger', 'index.html'), 'utf8'))
	.then(html => writeFile(
		SWAGGER_HTML_FILE,
		html
			.replace(/\.\//g, './swagger/')
			.replace('dom_id:', `url: "./${NAME}.yaml",\n      dom_id:`),
		'utf8',
	))
	.then(() => writeFile(REDOC_HTML_FILE, htmlTemplate({ name: NAME }), 'utf8'))

process.stdin.setEncoding('utf8')
process.stdin.on('readable', () => {
	let chunk = process.stdin.read()
	if (chunk === null) return
	chunk = chunk.split(EOL)
	lines.push(...chunk)
})
process.stdin.on('end', writeGeneratedFiles)
