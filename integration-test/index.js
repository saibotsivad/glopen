import { mongodbDataApi } from '@saibotsivad/glopen-mongodb-data-api-httpie'
import * as assert from 'uvu/assert'
import { waitToStart } from './src/wait-to-start.js'

const start = Date.now()
const time = () => `${Math.round((Date.now() - start) / 10) / 100}s`

let apiUrl = process.env.API_URL
if (apiUrl.endsWith('/')) apiUrl.slice(0, -1)

const orderedTestSuites = [
	'basic-user-create',
]

const mongodb = mongodbDataApi({
	apiKey: process.env.MONGODB_API_KEY,
	apiUrl: process.env.MONGODB_API_URL,
	cluster: 'Cluster0',
	database: 'example',
	collection: 'example',
})

console.log('Waiting for the MongoDB Data API and API to start...')
await waitToStart({ apiUrl, mongodb })

const state = {}

// Note the reference to `globalThis.UVU_*` is to manage suite
// flow, since `uvu` doesn't fully support that yet.
// More info: https://github.com/lukeed/uvu/issues/113
globalThis.UVU_DEFER = 1
const uvu = await import('uvu')
for (const suiteName of orderedTestSuites) {
	console.log('Starting test suite:', suiteName)
	const test = uvu.suite(suiteName)
	const count = globalThis.UVU_QUEUE.push([suiteName])
	globalThis.UVU_INDEX = count - 1
	const run = await import(`./suite/${suiteName}.js`)
	run.default({
		test,
		assert,
		state,
		apiUrl,
		mongodb,
		isStatus: (response, expected, message) => {
			if (response.statusCode !== expected) {
				let responseBody = typeof response.data === 'object'
					? JSON.stringify(response.data, undefined, 2)
					: response.data
				if (typeof response.data === 'string') {
					try {
						responseBody = JSON.stringify(JSON.parse(response.data), undefined, 2)
					} catch (error) {
						console.log('body was string but not valid json')
					}
				}
				assert.snapshot(responseBody, '!', `[BAD STATUS CODE: expected=${expected}, actual=${response.statusCode}] ${message}`)
			}
			assert.is(response.statusCode, expected, message)
		},
	})
	test.run()
}
await uvu.exec()

// `uvu` doesn't return the test suite statuses with `exec` but it
// does set `process.exitCode` so we can use that here
// More info: https://github.com/lukeed/uvu/issues/113
console.log(`Completed ${process.exitCode ? 'with failing tests' : 'successfully'} after ${time()}`)
process.exit(process.exitCode)
