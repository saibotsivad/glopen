import { join, sep } from 'node:path'
import { readdir, readFile, writeFile } from 'node:fs/promises'

const template = name => `import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const ${name} = options => ([
	{
		dir: join(__dirname, 'openapi'),
		ext: '@',
		api: options?.api,
	},
])
`

const dirs = await readdir('./definition', { withFileTypes: true })
	.then(list => list.filter(l => l.isDirectory()).map(l => l.name))

for (const dir of dirs) {
	const name = dir
		.split('-')
		.map((part, index) => {
			if (index > 0) return `${part[0].toUpperCase()}${part.slice(1)}`
			if (part === '_shared') return 'shared'
			return part
		})
		.join('')
	await writeFile(join('definition', dir, 'index.js'), template(name), 'utf8')
}
