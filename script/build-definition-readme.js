import { join, sep } from 'node:path'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import glob from 'tiny-glob'

const generateReadmeSuffix = dir => `
## License

This package and all documentation are made available under the
[Very Open License](http://veryopenlicense.com).

Commercial licenses and paid support are available at
[DavisTobias.com/contact](https://davistobias.com/contact?package=@saibotsivad/glopen-definition-${dir})
`

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

const dirs = await readdir('./definition', { withFileTypes: true })
	.then(list => list.filter(l => l.isDirectory()).map(l => l.name))
	.then(list => list.filter(l => l !== '_shared'))

console.log(`Generating documentation for ${dirs.length} directories:`)
for (const dir of dirs) {
	console.log(`- ${dir}`)
	const readme = await readFile(join('./definition', dir, '.generator', '_README.md'), 'utf8')
	const exampleConfig = await readFile(join('./definition', dir, 'example-glopen.config.js'), 'utf8')
	const files = await glob('**/*.@.js', { cwd: join('./definition', dir) })
	const openapi = []
	const routes = []
	for (const file of files) {
		if (file.startsWith('openapi') && !file.startsWith('openapi/paths') && file !== 'openapi/tags.@.js') {
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
			})
		} else if (file.startsWith('openapi/paths')) {
			const string = await readFile(join('./definition', dir, file), 'utf8')
			const { grouping, description } = getJavascriptDocsComment(string)
			if (!description) {
				console.log('Found a definition route file with no description.', { dir, file })
				process.exit(1)
			}
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
		const maybeTags = await import('..' + sep + join('definition', dir, 'openapi', 'tags.@.js'))
		tagList.push(...Object.keys(maybeTags))
	} catch (error) {
		if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error
	}

	const groupedOpenapi = openapi.reduce((map, o) => {
		map[o.grouping] = map[o.grouping] || []
		map[o.grouping].push(o)
		return map
	}, {})
	let openapiString = '## OpenAPI Definition\n\n' + Object
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
	const routesString = '## OpenAPI Routes\n\n' + Object
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
		+ generateReadmeSuffix(dir)
	await writeFile('.' + sep + join('definition', dir, 'README.md'), finalString, 'utf8')
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
