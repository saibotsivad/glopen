import { waitToStart } from './src/wait-to-start.js'
import { mongodbDataApi } from '@saibotsivad/glopen-mongodb-data-api-httpie'

const apiUrl = process.env.API_URL

const mongodb = mongodbDataApi({
	apiKey: process.env.MONGODB_API_KEY,
	apiUrl: process.env.MONGODB_API_URL,
	cluster: 'Cluster0',
	database: 'example',
	collection: 'example',
})

console.log('Waiting for the MongoDB Data API and API to start...')
await waitToStart({ apiUrl, mongodb })
