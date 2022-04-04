import { join, sep, resolve } from 'node:path'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import glob from 'tiny-glob'

const start = Date.now()

// Example:
/*DOCS
@group: Task Groups

More words about it.
*/
const TOP_DOCS = /\/\*DOCS[\r\n]+(?:\@group:\s+([^\r\n]+)[\r\n]+)?(.+)[\r\n]+DOCS\*\//ms
const getJavascriptDocsComment = string => {
	const match = TOP_DOCS.exec(string)
	if (!match) return {}
	return { grouping: match[1], description: match[2] }
}

const dirs = await readdir('./definitions', { withFileTypes: true })
	.then(list => list.filter(l => l.isDirectory()).map(l => l.name))
	// temp
	.then(list => list.filter(l => l === 'user-tasks'))

for (const dir of dirs) {
	const readme = await readFile(join('./definitions', dir, '_README.md'), 'utf8')
	const exampleConfig = await readFile(join('./definitions', dir, 'example-glopen.config.js'), 'utf8')
	const files = await glob('**/*.@.js', { cwd: join('./definitions', dir) })
	const openapi = []
	const routes = []
	for (const file of files) {
		const string = await readFile(join('./definitions', dir, file), 'utf8')
		const { grouping, description } = getJavascriptDocsComment(string)
		if (!description) {
			// TODO every file should have some description, I think?
			// if so, exit here if one is not found
		}
		if (file === 'openapi/tags.@.js') {
			// TODO
		} else if (file.startsWith('openapi')) {
			let grouping
			let name
			if (file.startsWith('openapi/components')) {
				[, , grouping, name] = file.split('/')
				name = name.replace('.@.js', '')
			}
			else if (file !== 'openapi/_.@.js') {
				console.error('Unexpected "openapi" folder/file:', dir, file)
				process.exit(1)
			}
			openapi.push({
				grouping,
				name,
				file,
				description,
			})
		} else {
			const [, , ...route] = file.split(sep)
			const method = route.pop().replace('.@.js', '').toUpperCase()
			routes.push({
				method,
				route: route.join('/'),
				file,
				grouping,
				description,
			})
		}
	}

	const tagList = []
	try {
		const maybeTags = await import('..' + sep + join('definitions', dir, 'openapi', 'tags.@.js'))
		tagList.push(...Object.keys(maybeTags))
	} catch (error) {
		if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error
	}

	const groupedOpenapi = openapi.reduce((map, o) => {
		map[o.grouping] = map[o.grouping] || []
		map[o.grouping].push(o)
		return map
	}, {})
	let openapiString = 'The OpenAPI parts are:\n\n' + Object
		.keys(groupedOpenapi)
		.sort()
		.map(g => groupedOpenapi[g]
			.map(o => `- [\`${g}: ${o.name}\`](./${o.file})`)
			.join('\n')
		)
		.join('\n')
	if (tagList.length) {
		const suffix = tagList.length > 1 ? 's' : ''
		openapiString += (
			'\n' + `- [\`tag${suffix}: ${tagList.join(', ')}\`](./openapi/tags.@.js)`
		)
	}

	const groupedRoutes = routes.reduce((map, r) => {
		const key = r.grouping || '0' // first in sort for well named groupings
		map[key] = map[key] || []
		map[key].push(r)
		return map
	}, {})
	const routesString = 'The routes are:\n\n' + Object
		.keys(groupedRoutes)
		.sort()
		.map(g => {
			const prefix = g === '0'
				? ''
				: `## ${g}\n\n`
			return prefix + groupedRoutes[g]
				.map(
					({ method, route, file, description }) => ([
						`#### [\`${method} /${route}\`](${file})`,
						'',
						description,
					].join('\n'))
				)
				.join('\n')
		})
		.join('\n\n')

	const finalString = readme
		+ '\n'
		+ [
			'To use in `glopen` (see [example config file](./example-glopen.config.js)):',
			'',
			'```js',
			'// glopen.config.js',
			exampleConfig.trim(),
			'```',
		].join('\n')
		+ '\n\n'
		+ openapiString
		+ '\n'
		+ '- [shared components](../_shared/README.md)'
		+ '\n\n'
		+ routesString
	await writeFile('.' + sep + join('definitions', dir, 'README.md'), finalString, 'utf8')
	console.log('----------------------', dir)
}

console.log(`Build completed in ${Date.now() - start}ms`)


/*

The components are:

- [`parameter: taskId`](./openapi/components/parameters/taskId.@.js)
- [`parameter: taskGroupId`](./openapi/components/parameters/taskGroupId.@.js)
- [`schema: task`](./openapi/components/schemas/task.@.js)
- [`schema: taskGroup`](./openapi/components/schemas/taskGroup.@.js)
- [`tag: userTasks`](./openapi/tags.@.js)
- [shared components](../_shared/README.md)

- [`tag: userTasks`](./openapi/tags.@.js)
- [`tags: userTasks, fooBar`](./openapi/tags.@.js)


openapi/components/parameters/apiTokenId.@.js
openapi/components/schemas/apiToken.@.js
openapi/tags.@.js

*/
