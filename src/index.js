import fs from 'node:fs/promises'
import path from 'node:path'

import tinyGlob from 'tiny-glob'
import toJsIdentifier from 'to-js-identifier'

const PATH_REPLACER = /{([^}]+)}/g
const NAMES_WITH_NO_DEFAULT = [ '_', 'tags', 'info' ]
const NAMES_REQUIRING_HANDLERS = [ 'get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace' ]

const quoteString = string => JSON.stringify(string)

const relativeModuleName = (pathPrefix, file) => quoteString(path.join(pathPrefix, file))

const loadMarkdownFile = directory => async file => fs
	.readFile(path.join(directory, file), 'utf8')
	.then(string => ({ file, string, id: toJsIdentifier(file) }))

const loadAllMarkdownFiles = async (directory, files) => Promise
	.all(files.map(loadMarkdownFile(directory)))
	.then(loaded => {
		const markdownDetails = {}
		const markdownImportLines = []
		if (loaded.length) markdownImportLines.push('// imported markdown files')
		for (const { file, id, string } of loaded) {
			const parts = file.split('/')
			const end = parts.pop()
			const [ filename, accessor ] = end.split('.')
			markdownDetails[[ ...parts, filename ].join('/')] = { accessor, id }
			markdownImportLines.push(`const ${id} = ${quoteString(string)}`)
		}
		if (loaded.length) markdownImportLines.push('')
		return { markdownImportLines, markdownDetails }
	})

const generateImportLines = (pathPrefix, javascriptDetails) => {
	const importLines = [ '// imported javascript files' ]
	for (const { file, name, id, path } of javascriptDetails) {
		if (NAMES_WITH_NO_DEFAULT.includes(name)) importLines.push(`import * as ${id} from ${relativeModuleName(pathPrefix, file)}`)
		else if (path.startsWith('paths/') && NAMES_REQUIRING_HANDLERS.includes(name)) importLines.push(`import ${id}_handler, * as ${id} from ${relativeModuleName(pathPrefix, file)}`)
		else importLines.push(`import ${id} from ${relativeModuleName(pathPrefix, file)}`)
	}
	importLines.push('')
	return importLines
}

const keyBy = (list, key) => list.reduce((map, item) => { map[item[key]] = item; return map }, {})

const generatePrintableComponentLines = javascriptDetails => {
	const componentDetails = javascriptDetails
		.filter(({ path }) => path.startsWith('components/'))
		.map(details => {
			const [ , component ] = details.path.split('/')
			details.component = component
			return details
		})
	if (!componentDetails.length) return []

	const components = componentDetails
		.reduce((map, { name, id, component }) => {
			map[component] = map[component] || []
			map[component].push(`${quoteString(name)}: ${id}`)
			return map
		}, {})

	return [
		'\tcomponents: {',
		...Object
			.keys(components)
			.map(type => {
				return [
					`\t\t${quoteString(type)}: {`,
					...components[type].map(line => `\t\t\t${line},`),
					'\t\t},'
				]
			})
			.flat(),
		'\t},'
	]
}

const generatePathParts = javascriptDetails => {
	const pathDetails = javascriptDetails
		.filter(({ path }) => path.startsWith('paths/'))
		.map(details => {
			const [ , ...pathKeys ] = details.path.split('/')
			details.pathKey = '/' + pathKeys.join('/')
			return details
		})
	if (!pathDetails.length) return []

	const pathObjectMap = {}
	const pathItemObjectMap = {}
	const routes = []
	for (const { name: method, file, id, pathKey, markdown } of pathDetails) {
		if (method === '_') {
			pathObjectMap[pathKey] = `...${id}`
		} else {
			// set up the path
			pathItemObjectMap[pathKey] = pathItemObjectMap[pathKey] || {}
			pathItemObjectMap[pathKey][method] = pathItemObjectMap[pathKey][method] || {}
			pathItemObjectMap[pathKey][method] = [
				`...${id},`,
				`operationId: ${quoteString(id)},`,
				markdown && `${markdown.accessor}: ${markdown.id},`
			].filter(Boolean)
			// set up the route
			routes.push([
				`filename: ${quoteString(file)},`,
				`handler: ${id}_handler,`,
				`exports: ${id},`,
				`method: ${quoteString(method)},`,
				`path: ${quoteString(pathKey)},`,
				`pathAlt: ${quoteString(pathKey.replaceAll(PATH_REPLACER, ':$1'))},`,
				`operationId: ${quoteString(id)}`
			])
		}
	}

	const definitionLines = [
		'\tpaths: {',
		...Object
			.keys(pathItemObjectMap)
			.map(path => {
				const lines = [ `\t\t${quoteString(path)}: {` ]
				if (pathObjectMap[path]) lines.push(`\t\t\t${pathObjectMap[path]},`)
				Object
					.keys(pathItemObjectMap[path])
					.map(method => {
						lines.push(`\t\t\t${method}: {`)
						lines.push(...pathItemObjectMap[path][method].map(l => `\t\t\t\t${l}`))
						lines.push('\t\t\t},')
					})
				lines.push('\t\t},')
				return lines
			})
			.flat(),
		'\t},'
	]

	const routeLines = routes
		.map(route => {
			const lines = [ '\t{' ]
			lines.push(...route.map(r => `\t\t${r}`))
			lines.push('\t},')
			return lines
		})
		.flat()

	return { definitionLines, routeLines }
}

const generateTagLines = async (directory, pathPrefix, javascriptNameToDetails) => {
	const tags = javascriptNameToDetails.tags && await import(path.join(directory, javascriptNameToDetails.tags.file))
	const tagLines = tags && Object
		.keys(tags)
		.map(tagName => {
			const lines = []
			if (tags[tagName].name) {
				lines.push(`\t\ttags[${quoteString(tagName)}],`)
			} else {
				lines.push('\t\t{')
				lines.push(`\t\t\tname: ${quoteString(tagName)},`)
				lines.push(`\t\t\t...tags[${quoteString(tagName)}],`)
				lines.push('\t\t},')
			}
			return lines
		})
		.flat()
	return tagLines && tagLines.length
		? [ '\ttags: [', ...tagLines, '\t],' ]
		: []
}

export const glopen = async ({ api: directory, pathPrefix, ext: filenameExtensionPrefix }) => {
	const lines = []

	// glob the api files
	const [ globbedJs, globbedMd ] = (await tinyGlob(`${directory}/**/*.${filenameExtensionPrefix}.{js,md}`, { cwd: directory }))
		.reduce(([ js, md ], file) => {
			if (file.endsWith('.js')) js.push(file)
			else md.push(file)
			return [ js, md ]
		}, [ [], [] ])

	const { markdownImportLines, markdownDetails } = await loadAllMarkdownFiles(directory, globbedMd)
	lines.push(...markdownImportLines)

	const javascriptDetails = globbedJs.map(file => {
		const parts = file.split('/')
		const filename = parts.pop()
		const name = filename.replace(`.${filenameExtensionPrefix}.js`, '')
		return {
			name,
			file,
			id: toJsIdentifier([ ...parts, name ].join('_')),
			path: parts.join('/'),
			markdown: markdownDetails[[ ...parts, name ].join('/')]
		}
	})
	const javascriptNameToDetails = keyBy(javascriptDetails, 'name')

	lines.push(...generateImportLines(pathPrefix, javascriptDetails))

	const pathParts = generatePathParts(javascriptDetails)

	lines.push('export const definition = {')
	if (javascriptNameToDetails._) lines.push('\t..._,')

	// if the root `info` has a `description` from markdown, we'll need to construct the object
	const infoMarkdown = globbedMd.find(file => file === `info.description.${filenameExtensionPrefix}.md`)
	if (infoMarkdown) {
		lines.push('\tinfo: {')
		if (javascriptNameToDetails.info) lines.push('\t\t...info,')
		lines.push(`\t\tdescription: ${toJsIdentifier(`info.description.${filenameExtensionPrefix}.md`)},`)
		lines.push('\t},')
	} else if (javascriptNameToDetails.info) {
		lines.push('\tinfo,')
	}

	lines.push(...(await generateTagLines(directory, pathPrefix, javascriptNameToDetails)))
	lines.push(...generatePrintableComponentLines(javascriptDetails))
	lines.push(...pathParts.definitionLines)
	lines.push('}')

	return {
		definition: lines.join('\n'),
		routes: 'export const routes = [\n' + pathParts.routeLines.join('\n') + '\n]\n'
	}
}
