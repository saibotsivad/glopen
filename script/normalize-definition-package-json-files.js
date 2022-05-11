import { readdir, readFile, writeFile } from 'node:fs/promises'
import { sep, join, resolve } from 'node:path'

const files = [
	'openapi',
	'example-glopen.config.js',
	'dist',
	'openapi',
	'package.json',
	'LICENSE.md',
	'README.md'
]

const repository = {
	"type": "git",
	"url": "git+https://github.com/saibotsivad/glopen.git"
}

const keywords = [
	"openapi",
	"glob",
	"generator",
	"glopen",
	"definitions",
	"openapi"
]

const author = {
	"name": "Tobias Davis",
	"email": "tobias@davistobias.com",
	"url": "https://davistobias.com"
}

const license = "SEE LICENSE IN LICENSE.md"

const bugs = {
	"url": "https://github.com/saibotsivad/glopen/issues"
}

const makeDefaultPackageJson = name => {
	return {
		name: `@saibotsivad/glopen-definition-${name}`,
		type: 'module',
		main: 'dist/index.js',
		repository,
		author,
		license,
		bugs,
		homepage: `https://github.com/saibotsivad/glopen/tree/main/definition/${name}`
	}
}

const orderedKeys = [
	'name',
	'description',
	'license',
	'type',
	'main',
	'exports',
	'files',
	'keywords',
	'author',
	'repository',
	'homepage',
	'bugs',
	'dependencies',
	'devDependencies',
]

const reorder = pkg => {
	const ordered = {}
	for (const key of orderedKeys) {
		if (pkg[key]) ordered[key] = pkg[key]
		delete pkg[key]
	}
	Object.keys(pkg).forEach(key => ordered[key] = pkg[key])
	delete ordered.scripts // TODO temporary
	return ordered
}

for (const name of await readdir('definition')) {
	const defaultJson = makeDefaultPackageJson(name)
	const dir = join(process.cwd(), 'definition', name)
	const template = JSON.parse(await readFile(join(dir, '.generator', '_package.json'), 'utf8'))
	const pkg = JSON.parse(await readFile(join(dir, 'package.json'), 'utf8'))
	const output = reorder(Object.assign({}, pkg, defaultJson, template))
	await writeFile(
		join(dir, 'package.json'),
		JSON.stringify(output, undefined, 2),
		'utf8',
	)
}
