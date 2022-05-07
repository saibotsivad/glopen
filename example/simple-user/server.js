import polka from 'polka'
import { mongodbDataApi } from '@saibotsivad/glopen-mongodb-data-api-httpie'
import * as singleUserCtrl from '@saibotsivad/glopen-controller-mongodb-data-api-single-user'
import * as userSessionCtrl from '@saibotsivad/glopen-controller-mongodb-data-api-user-session'

import { routes } from './build/generated.js'

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

const api = polka()
api.use(services)
api.use(controllers)

console.log('Adding routes:')

routes.forEach(({ handler, exports, method, pathAlt }) => {
	// here you have access to everything exported in the file, so you
	// could use that to e.g. secure routes
	console.log('-', method.toUpperCase(), pathAlt, '\n  ⮑ ', exports.summary)
	api[method](pathAlt, handler)
})

// Here we're just adding a simple "hello world" route so we
// can ping the server and make sure it's running.
api.get('/', (req, res) => {
	res.end('Hello world!')
})

const port = parseInt(process.env.PORT || 3000, 10)
api.listen(port, () => {
	console.log('API running on port', port)
})
