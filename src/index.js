import fs from 'node:fs/promises'
import path from 'node:path'
import { dset } from 'dset'

import tinyGlob from 'tiny-glob'
import toJsIdentifier from 'to-js-identifier'

const DEFAULT_EXTENSION_PREFIX = '@'
const PATH_REPLACER = /{([^}]+)}/g
const NAMES_WITH_NO_DEFAULT = [ '_', 'tags', 'info' ]
const NAMES_REQUIRING_HANDLERS = [ 'get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace' ]

const quoteString = string => JSON.stringify(string)

const relativeModuleName = (pathPrefix, file) => quoteString(path.join(pathPrefix, file))

const loadMarkdownFile = async part => fs
	.readFile(part.abs, 'utf8')
	.then(string => Object.assign(part, { string }))

const loadAllMarkdownFiles = async files => Promise
	.all(files.map(loadMarkdownFile))
	.then(loaded => {
		const markdownDetails = {}
		const markdownImportLines = []
		if (loaded.length) markdownImportLines.push('// imported markdown files')
		for (const { dir, file, id, string } of loaded) {
			const parts = file.split('/')
			const end = parts.pop()
			const [ filename, accessor ] = end.split('.')
			markdownDetails[[ dir, ...parts, filename ].join('/')] = { accessor, id }
			markdownImportLines.push(`const ${id} = ${quoteString(string)}`)
		}
		if (loaded.length) markdownImportLines.push('')
		return { markdownImportLines, markdownDetails }
	})

const generateImportLines = globbedJs => {
	const importLines = [ '// imported javascript files' ]
	for (const part of globbedJs) {
		const importName = quoteString(path.join(part.dir, part.file))
		if (NAMES_WITH_NO_DEFAULT.includes(part.name)) importLines.push(`import * as ${part.id} from ${importName}`)
		else if (part.path.startsWith('paths/') && NAMES_REQUIRING_HANDLERS.includes(part.name)) importLines.push(`import ${part.id}_handler, * as ${part.id} from ${importName}`)
		else importLines.push(`import ${part.id} from ${importName}`)
	}
	importLines.push('')
	return importLines
}

const keyBy = (list, key) => list
	.reduce((map, item) => {
		// last one wins, if there are duplicate names
		map[item[key]] = item
		return map
	}, {})

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
			let prefix = details.api || '/'
			if (!prefix.endsWith('/')) prefix += '/'
			details.pathKey = prefix + pathKeys.join('/')
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

const generateTagLines = async javascriptDetails => {
	const tags = {}
	for (const part of javascriptDetails.filter(({ name }) => name === 'tags')) {
		const imported = await import(path.join(part.dir, part.file))
		for (const tag in imported) {
			tags[tag] = imported[tag]
			tags[tag]._part = part
		}
	}
	const tagLines = Object
		.keys(tags)
		.map(tagName => {
			const lines = []
			const id = tags[tagName]._part.id
			if (tags[tagName].name) {
				lines.push(`\t\t${id}[${quoteString(tagName)}],`)
			} else {
				lines.push('\t\t{')
				lines.push(`\t\t\tname: ${quoteString(tagName)},`)
				lines.push(`\t\t\t...${id}[${quoteString(tagName)}],`)
				lines.push('\t\t},')
			}
			return lines
		})
		.flat()
	return tagLines && tagLines.length
		? [ '\ttags: [', ...tagLines, '\t],' ]
		: []
}

const getAllGlobbed = async mergeList => {
	const globbed = []
	// we make a tree here so we can traverse it and find the most shallow root possible
	// if we didn't do this, our JS identifiers would get crazy long
	const globbedTree = {}
	for (const merge of mergeList) {
		const files = await tinyGlob(`${merge.dir}/**/*.${merge.ext || DEFAULT_EXTENSION_PREFIX}.{js,md}`, { cwd: merge.dir })
		for (const file of files) {
			const abs = path.join(merge.dir, file)
			const part = Object.assign({}, merge, { file }, { abs })
			globbed.push(part)
			dset(globbedTree, abs.split('/').join('.'), true)
		}
	}
	let commonRoot = []
	const recurse = obj => {
		let keys = Object.keys(obj)
		if (keys.length === 1) {
			commonRoot.push(keys[0])
			return recurse(obj[keys[0]])
		}
	}
	recurse(globbedTree)
	commonRoot = commonRoot.join('/')

	const globbedJs = []
	const globbedMd = []
	for (const part of globbed) {
		part.name = part.file.split('/').pop().split('.').slice(0, -2).join('.')
		part.id = toJsIdentifier(part.abs.split(commonRoot)[1].replace(/^\//, '').replace(new RegExp(`\.${part.ext}\.${part.file.split('.').pop()}$`), ''))
		if (part.file.endsWith('.js')) globbedJs.push(part)
		else globbedMd.push(part)
	}
	return { globbedJs, globbedMd }
}

export const glopen = async ({ merge }) => {
	if (!merge || !merge.length) throw new Error('No merge parts set.')
	if (merge.find(part => !part.dir)) throw new Error('No directory set on one or more parts.')

	const { globbedJs, globbedMd } = await getAllGlobbed(merge)

	const lines = []

	const { markdownImportLines, markdownDetails } = await loadAllMarkdownFiles(globbedMd)
	lines.push(...markdownImportLines)

	const javascriptDetails = globbedJs.map(part => {
		const pathPieces = part.file.split('/')
		const filename = pathPieces.pop()
		part.path = pathPieces.join('/')
		const name = filename.replace(`.${part.ext}.js`, '')
		part.markdown = markdownDetails[[ part.dir, ...pathPieces, name ].join('/')]
		return part
	})

	lines.push(...generateImportLines(javascriptDetails))

	lines.push('export const definition = {')
	const root = javascriptDetails.filter(part => part.name === '_').pop()
	if (root) lines.push(`\t...${root.id},`)

	// if the root `info` has a `description` from markdown, we'll need to construct the object
	const infoMarkdown = globbedMd.filter(part => part.file === `info.description.${part.ext}.md`).pop()
	const rootInfo = javascriptDetails.filter(part => part.name === 'info').pop()
	if (infoMarkdown) {
		lines.push('\tinfo: {')
		if (rootInfo) lines.push(`\t\t...${rootInfo.id},`)
		lines.push(`\t\tdescription: ${infoMarkdown.id},`)
		lines.push('\t},')
	} else if (rootInfo) {
		lines.push(`\t${rootInfo.id},`)
	}

	lines.push(...(await generateTagLines(javascriptDetails)))
	lines.push(...generatePrintableComponentLines(javascriptDetails))

	const pathParts = generatePathParts(javascriptDetails)
	lines.push(...pathParts.definitionLines)

	lines.push('}')

	return {
		definition: lines.join('\n'),
		routes: 'export const routes = [\n' + pathParts.routeLines.join('\n') + '\n]\n'
	}
}
