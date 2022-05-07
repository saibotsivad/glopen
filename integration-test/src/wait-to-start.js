import timers from 'node:timers/promises'
import { get } from 'httpie'

const isApiRunning = async apiUrl => {
	try {
		const response = await get(apiUrl)
		return response.statusCode === 200
	} catch (error) {
		if (error.code === 'ECONNREFUSED') return false
		else throw error
	}
}

const isMongodbRunning = async db => {
	try {
		const { document } = await db.findOne({ filter: { anything: false } })
		return document !== undefined
	} catch (ignore) {
		return false
	}
}

export const waitToStart = async ({ apiUrl, mongodb }) => {
	let apiStarted
	while (!apiStarted) {
		apiStarted = await isApiRunning(apiUrl)
		if (!apiStarted) {
			console.log('Waiting for the API to start...')
			await timers.setTimeout(200)
		}
	}

	let mongodbStarted
	while (!mongodbStarted) {
		mongodbStarted = await isMongodbRunning(mongodb)
		if (!mongodbStarted) {
			console.log('Waiting for the MongoDB Data API to start...')
			await timers.setTimeout(200)
		}
	}
}
