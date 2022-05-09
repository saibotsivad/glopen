import polka from 'polka'
import { mongodbDataApi } from '@saibotsivad/glopen-mongodb-data-api-httpie'
import * as singleUserCtrl from '@saibotsivad/glopen-controller-mongodb-data-api-single-user'
import * as userSessionCtrl from '@saibotsivad/glopen-controller-mongodb-data-api-user-session'

import { routes } from './build/generated.js'
import { exceptionToResult } from './exception-to-result.js'

const configurations = (req, res, next) => {
	req.configuration = {
		controller: {
			user: {
				create: {
					setCookie: true,
				},
			},
		},
	}
}

const services = (req, res, next) => {
	req.service = {
		database: mongodbDataApi({
			apiKey: process.env.MONGODB_API_KEY,
			apiUrl: `http://localhost:${process.env.MONGODB_API_PORT}`,
			cluster: 'Cluster0',
			database: 'example',
			collection: 'example',
		})
	}
	next()
}

const controllers = (req, res, next) => {
	req.controller = {
		user: {
			...singleUserCtrl,
			// You wouldn't need to use this rest-spread method here, but
			// it does mean you could add another controller easily, e.g.
			// ...otherUserCtrls
		},
		// The simpler way, without rest-spread
		session: userSessionCtrl,
	}
	next()
}

const parseBody = async req => new Promise(resolve => {
	let data = ''
	req.on('data', chunk => data += chunk)
	req.on('end', () => resolve(
		req.headers?.['content-type'] === 'application/json'
			? JSON.parse(data)
			: data
	))
})

const api = polka()
api.use(services)
api.use(controllers)

console.log('Adding routes:')

routes.forEach(({ handler, exports, method, pathAlt }) => {
	// here you have access to everything exported in the file, so you
	// could use that to e.g. secure routes
	console.log('-', method.toUpperCase(), pathAlt, '\n  ⮑ ', exports.summary)
	api[method](pathAlt, async (req, res) => {
		req.parameters = {
			path: req.params,
			query: req.query,
			header: { ...req.headers }, // TODO normalize
			cookie: 'TODO',
		}
		req.body = await parseBody(req)

		// this is just a little wrapper to let the handlers
		// return simple objects instead of mutating the response
		let result
		try {
			result = await handler(req)
		} catch (error) {
			result = exceptionToResult(error)
		}
		let { status, body, headers } = result
		headers = headers || {}
		if (typeof body === 'object') {
			body = JSON.stringify(body)
			headers['Content-Type'] = 'application/json'
		}
		res.writeHead(status || 200, headers)
		res.end(body)
	})
})

const port = parseInt(process.env.PORT || 3000, 10)
api.listen(port, () => {
	console.log('API running on port', port)
})
