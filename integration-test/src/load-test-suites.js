import globbedSuites from '../build/globbed-suites.js'

export const suiteNameToImport = globbedSuites
	.reduce((map, imp) => {
		map[imp.path.replace(/^suite\//, '').replace(/\.js$/, '')] = imp.export
		return map
	}, {})
