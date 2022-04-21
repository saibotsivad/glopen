import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

export const recursivelyGetAllFileNames = async (cwd, dir) => {
	const entries = await readdir(join(cwd, dir), { withFileTypes: true })
	const files = []
	const dirPromises = []
	for (const entry of entries) {
		if (entry.isDirectory()) dirPromises.push(recursivelyGetAllFileNames(cwd, join(dir, entry.name)))
		else files.push(join(dir, entry.name))
	}
	const dirResults = await Promise.all(dirPromises)
	files.push(...dirResults)
	return files.flat()
}
