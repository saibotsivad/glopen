import polka from 'polka'
import { responseWrapper } from 'glopen-response-wrapper'
import { requestParser } from 'glopen-request-parser'
import { requestBodyPolyfill } from 'request-body-polyfill'

const originalPatternKey = 'originalPattern'

export const setup = ({ definition, routes, securities, configurations, services, controllers, security }) => {
	const api = polka()

	// Polka is very similar to Express or Koa, but is even lighter. Unfortunately, it doesn't have
	// a way to expose the original path, e.g. "/users/:id", to the middleware if you do the normal
	// `api.use(middleware1) approach. Instead, for every request we'll set up the middleware as part
	// of the handlers list. This is a little hacky, but it will make it much easier to parse the
	// requests using the OpenAPI definitions.
	// More discussion available here: https://github.com/lukeed/trouter/issues/18
	const middleware = [

		// This one is just so you can run the server in NodeJS or in a Worker environment.
		requestBodyPolyfill,

		// First we'll want to parse the request, using the OpenAPI definition. This
		// turns path and query parameters into their correct form, and sets them on
		// a property on the request object. (See the library for more configuration details.)
		requestParser({
			definition,
			pathPatternKey: originalPatternKey,
			pathParametersKey: 'params',
		}),

		// Next we'll set up all the core stuff. Have a look at each file, they're simple
		// enough that we probably don't even need them pulled out, but it makes this code
		// tidier, so that's probably a good design decision.
		configurations,
		services,
		controllers,

		// Finally, we'll want to secure the routes, using the OpenAPI "securitySchemes", which
		// follow a very specific logic. Have a look at the "openapi-request-security" library[1]
		// for more details.
		// [1]: https://www.npmjs.com/package/openapi-request-security
		security({ definition, securities }),
	]

	// This middleware needs to run before the request parser, so that the
	// parser has access to it to look up the correct definitions.
	const addOriginalPattern = pattern => (req, res, next) => {
		req[originalPatternKey] = pattern
		next()
	}

	console.log('Adding routes:')

	routes.forEach(({ handler, exports, method, path, pathAlt }) => {
		// Here you have access to everything that's exported in each route file, so you
		// could use that to do extra prep work, or whatever you want. Here we're just going
		// to log things nicely.
		console.log('-', method.toUpperCase(), pathAlt, '\n  ⮑ ', exports.summary)

		// This response wrapper is not required, but it does make a lot of things tidier. Have
		// a look at its documentation to read more.
		api[method](pathAlt, addOriginalPattern(path), ...middleware, responseWrapper({
			handler,
			// You don't *need* a log function here, but it's usually pretty handy.
			log: ({ status, timing: { diff } }) => {
			// You can log to the console, or to another service, or whatever else makes sense.
				console.log(`[${new Date().toISOString()}] ${method.toUpperCase()} "${pathAlt}" ${status} ${diff}ms`)
			},
		}))
	})

	return api
}
