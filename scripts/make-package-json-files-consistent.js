import { readFile, writeFile } from 'node:fs/promises'
import { sep, join, resolve } from 'node:path'
import glob from 'tiny-glob'

const templatePaths = await glob('{controllers,definitions,packages}/*/.generator/_package.json', { dot: true })

const files = [
	"openapi",
	"example-glopen.config.js",
	"index.js",
	"openapi",
	"package.json",
	"LICENSE.md",
	"README.md"
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

const makeDefaultPackageJson = ([dir, name]) => {
	return {
		name: `@saibotsivad/glopen-${dir}-${name}`,
		type: 'module',
		repository,
		author,
		license,
		bugs,
		homepage: `https://github.com/saibotsivad/glopen/tree/main/${dir}/${name}`
	}
}

for (const templatePath of templatePaths) {
	const defaultJson = makeDefaultPackageJson(templatePath.split(sep))
	const template = JSON.parse(await readFile(templatePath, 'utf8'))
	const output = Object.assign({}, defaultJson, template)
	if (output.authors?.length) delete output.author
	output.files = [...new Set([...files, ...(output.files || [])])]
	output.keywords = [...new Set([...keywords, ...(output.keywords || [])])]
	await writeFile(
		join(resolve(templatePath, '..', '..'), 'package.json'),
		JSON.stringify(output, undefined, 2),
		'utf8',
	)
}
