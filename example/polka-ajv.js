import polka from 'polka'
import bodyParser from 'body-parser'
import { default as schemas } from './build/schemas.cjs'
import { routes } from './build/generated.js'

const api = polka()

api.use(bodyParser.json())

console.log('Adding routes:')

const validateRequestBody = ({ request, exports, path }) => {
	const contentType = request.headers['content-type']
	const hasSchema = exports.requestBody?.content?.[contentType]?.schema
	if (contentType === 'application/json' && hasSchema) {
		const id = `#/request/${encodeURIComponent(path)}/${request.method.toLowerCase()}`
		const validate = schemas[id]
		if (validate) {
			const valid = validate(request.body)
			if (!valid) return validate.errors
		}
	}
	return undefined
}

const jsonApiWrapper = ({ handler, exports, method, path, pathAlt, operationId }) => (request, response) => {
	// On write requests, we can use the OpenAPI schema to validate requests. Try
	// sending a POST request to create a `task`, but set `type` to something else.
	const requestErrors = validateRequestBody({ request, exports, path })
	if (requestErrors) {
		response.statusCode = 400
		response.setHeader('Content-Type', 'application/json')
		response.end(JSON.stringify(requestErrors))
		return undefined
	}

	// You could do this different ways of course, but here we're just going to
	// put all the stuff on the request for the handlers to use as needed.
	request.openapi = { exports, method, path, pathAlt, operationId }

	// Now we set up a handy little transform, so our handlers don't need to
	// worry about transforming JSON.
	handler(request)
		.then(({ status, body, json }) => {
			response.statusCode = status || 500
			if (json) response.setHeader('Content-Type', 'application/json')
			response.end(
				typeof body === 'string'
					? body
					: JSON.stringify(body)
			)
		})
}

routes.forEach(route => {
	console.log(' - ', route.method.toUpperCase(), route.pathAlt, '\n   ', route.exports.summary)
	api[route.method](route.pathAlt, jsonApiWrapper(route))
})

api.listen(3000, () => {
	console.log('API running on port 3000, try opening: http://localhost:3000/api/v1/tasks/9001')
})
