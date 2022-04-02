import { join, sep } from 'node:path'
import { readdir, readFile } from 'node:fs/promises'
import glob from 'tiny-glob'

const start = Date.now()

// Example:
/*DOCS
@group: Task Groups

More words about it.
*/
const TOP_DOCS = /\/\*DOCS[\r\n]+(?:\@group:\s+([^\r\n]+)[\r\n]+)?(.+)[\r\n]+DOCS\*\//mgs
const getJavascriptDocsComment = string => {
	const match = TOP_DOCS.exec(string)
	if (!match) return {}
	return { grouping: match[1], description: match[2] }
}

const dirs = await readdir('./definitions', { withFileTypes: true })
	.then(list => list.filter(l => l.isDirectory()).map(l => l.name))

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
		if (file.startsWith('openapi')) {
			const [, things] = file.split(sep)
			openapi.push({
				things,
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

	const groupedRoutes = routes.reduce((map, r) => {
		const key = r.grouping || '0' // first in sort for well named groupings
		map[key] = map[key] || []
		map[key].push(r)
		return map
	}, {})
	const routesString = 'The routes are:\n\n' + Object
		.keys(groupedRoutes)
		.sort()
		.map(g =>
			(g === '0' ? '' : `## ${g}\n\n`) + groupedRoutes[g]
				.map(
					({ method, route, file, description }) => ([
						`#### [\`${method} /${route}\`](${file})`,
						'',
						description,
						'',
					].join('\n'))
				)
				.join('\n')
		).join('\n')

	console.log(dir, routesString)
}

console.log(`Build completed in ${Date.now() - start}ms`)


/*

##### [`POST /teams`](./routes/paths/teams/post.@.js)

Create a new team. The requesting must be made an admin of the created team, but other users could be added at creation as well.

- `request.controller.team.create: (request: Request) => { team: Team }`






openapi/components/parameters/apiTokenId.@.js
openapi/components/schemas/apiToken.@.js
openapi/tags.@.js

routes/paths/self/apiTokens/get.@.js
routes/paths/self/apiTokens/post.@.js

The components are:

- [`parameter: teamId`](./openapi/components/parameters/teamId.@.js)
- [`parameter: teamAdminId](./openapi/components/parameters/teamAdminId.@.js)
- [`schema: team`](./openapi/components/schemas/team.@.js)
- [`schema: teamRelationship`](./openapi/components/schemas/teamRelationship.@.js)
- [`schema: user`](./openapi/components/schemas/user.@.js) (modifies the single-user schema object)
- [`tag: teams`](./openapi/tags.@.js)
- [shared components](../_shared/README.md)

*/
