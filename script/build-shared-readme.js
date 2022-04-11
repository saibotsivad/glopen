import { join } from 'node:path'
import { readFile, writeFile } from 'node:fs/promises'
import glob from 'tiny-glob'

const typeToName = {
	parameters: 'Parameters',
	responses: 'Responses',
	schemas: 'Schemas',
	securitySchemes: 'Security Schemes',
}

const files = await glob('**/*.@.js', { cwd: './definition/_shared' })
	.then(l => l.filter(f => f !== 'openapi/_.@.js'))

const typeToFile = files.reduce((map, file) => {
	const [, , folder, actualFile] = file.split('/')
	if (!typeToName[folder]) {
		console.log('Could not map shared folder to name.', { folder, file })
		process.exit(1)
	}
	map[folder] = map[folder] || []
	map[folder].push(actualFile.replace(/\.@\.js/, ''))
	return map
}, {})

const readme = await readFile(join('./definition', '_shared', '.generator', '_README.md'), 'utf8')

const string = readme + '\n' + Object
	.keys(typeToFile)
	.map(type => {
		const links = typeToFile[type]
			.sort()
			.map(name => `- [\`${name}\`](./components/${type}/${name}.@.js)`)
			.join('\n')
		return `#### ${typeToName[type]}\n\n${links}`
	})
	.join('\n\n')
	+ '\n'

await writeFile(join('./definition', '_shared', 'README.md'), string, 'utf8')
