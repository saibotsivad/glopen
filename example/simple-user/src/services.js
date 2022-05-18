import { mongodbDataApi } from '@saibotsivad/glopen-mongodb-data-api-httpie'

export const services = (req, res, next) => {
	req.service = {
		database: mongodbDataApi({
			apiKey: req.configuration.service.database.apiKey,
			apiUrl: req.configuration.service.database.apiUrl,
			cluster: 'Cluster0',
			database: 'example',
			collection: 'example',
		}),
	}
	next()
}
