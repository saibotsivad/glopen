export const summary = 'Hello World!'

export const description = `
An example of an additional route, and also used by the integration
test suite to make sure the server is running. The path value is echoed
back on the response.
`

export const parameters = [
	{ $ref: '#/components/parameters/name' },
]

export const responses = {
	200: {
		description: 'A classic response.',
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						hello: {
							type: 'string',
						},
					},
				},
			},
		},
	},
	default: {
		$ref: '#/components/responses/error',
	},
}

export default async request => {
	return {
		status: 200,
		body: { hello: request.openapi.path.name },
	}
}
