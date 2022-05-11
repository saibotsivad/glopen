import { join } from 'node:path'
import { readdir, readFile, writeFile } from 'node:fs/promises'

const LICENSE = await readFile('./LICENSE.md', 'utf8')

const getDirs = name => readdir(name, { withFileTypes: true })
	.then(dirEnts => dirEnts
		.filter(d => d.isDirectory())
		.map(d => join(name, d.name))
	)

const dirs = await Promise.all([
	getDirs('controller-mongodb-data-api'),
	getDirs('definition'),
	getDirs('example'),
	getDirs('package'),
]).then(all => all.flat())

dirs.push(...[
	'controller-shared',
	'integration-test',
])

for (const dir of dirs) {
	writeFile(join(dir, 'LICENSE.md'), LICENSE, 'utf8')
}
