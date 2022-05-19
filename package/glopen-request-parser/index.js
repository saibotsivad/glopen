import { parse } from 'worktop/cookie'

class RequestParserError extends Error {
	constructor(message, meta) {
		super(message)
		this.name = 'RequestParserError'
		this.status = 500
		this.title = 'Error in the OpenAPI definition file.'
		this.detail = message
		if (meta) this.meta = meta
	}
}

// https://spec.openapis.org/oas/v3.1.0#fixed-fields-9
const ignoredHeaderNames = [ 'accept', 'content-type', 'authorization' ]

const parseRequest = async ({ definition, pathPatternKey, pathParametersKey, request }) => {

	const path = request[pathPatternKey]
	const parametersToCopy = {
		path: [],
		query: [],
		header: [],
		cookie: [],
	}

	let pathItemObject = definition.paths?.[path]
	if (pathItemObject?.$ref) {
		// TODO resolve to the $ref
	}
	if (pathItemObject?.parameters?.length) {
		for (let parameter of pathItemObject.parameters) {
			if (parameter.$ref) {
				// TODO resolve to the $ref
			}
			if (parametersToCopy[parameter.in]) parametersToCopy[parameter.in].push(parameter)
			else throw new RequestParserError('The "in" property of the Path Item Object parameter was invalid.', { parameter, path })
		}
	}

	const operationObject = pathItemObject?.[request.method.toLowerCase()]
	if (operationObject?.parameters?.length) {
		for (let parameter of operationObject.parameters) {
			if (parameter.$ref) {
				// TODO resolve to the $ref
			}
			if (parametersToCopy[parameter.in]) parametersToCopy[parameter.in].push(parameter)
			else throw new RequestParserError('The "in" property of the Operation Object parameter was invalid.', { parameter, path })
		}
	}

	const openapi = {
		path: {},
		query: {},
		cookie: {},
	}
	if (operationObject?.operationId) openapi.operationId = operationObject.operationId

	// Using a Proxy here to make case-insensitive getters/setters. Note that
	// the case is not preserved.
	const internalHeader = {}
	openapi.header = new Proxy(internalHeader, {
		get: (obj, prop) => obj[prop.toLowerCase()],
		set: (obj, prop, value) => {
			if (value) obj[prop.toLowerCase()] = value
			else delete obj[prop.toLowerCase()]
			return true
		},
	})

	const cookies = parametersToCopy.find(p => p.in === 'cookie')
		? parse(request.headers.cookie) // TODO???
		: {}

	for (const parameter of parametersToCopy) {
		if (parameter.in === 'path') {
			openapi.path[parameter.name] = request[pathParametersKey]?.[parameter.name]
			// TODO explode and such
		} else if (parameter.in === 'query') {
			// TODO explode and such
		} else if (parameter.in === 'header') {
			if (!ignoredHeaderNames.includes(parameter.name.toLowerCase())) {
				openapi.header[parameter.name] = request.headers[parameter.name]
			}
		} else if (parameter.in === 'cookie') {
			openapi.cookie[parameter.name] = cookies[parameter.name]
		}
	}

	return openapi
}

export const requestParser = ({ definition, pathPatternKey = 'pathPattern', pathParametersKey = 'params' }) => (request, response, next) => {
	parseRequest({ definition, pathPatternKey, pathParametersKey, request })
		.then(openapi => {
			request.openapi = openapi
			next()
		})
		.catch(error => {
			console.error('There was an error while parsing the request body!', error)
			next(error)
		})
}
