import { join, sep } from 'node:path'
import { readdir, readFile } from 'node:fs/promises'
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

	const groupedOpenapi = openapi.reduce((map, o) => {
		map[o.grouping] = map[o.grouping] || []
		map[o.grouping].push(o)
		return map
	}, {})
	const openapiString = 'The OpenAPI parts are:\n\n' + Object
		.keys(groupedOpenapi)
		.sort()
		.map(g => groupedOpenapi[g]
			.map(o => `- [\`${g}: ${o.name}\`](./${o.file})`)
			.join('\n')
		)
		.join('\n')

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

	const finalString = openapiString + '\n\n' + routesString
	console.log('----------------------', dir)
	console.log(finalString)
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


openapi/components/parameters/apiTokenId.@.js
openapi/components/schemas/apiToken.@.js
openapi/tags.@.js

*/
