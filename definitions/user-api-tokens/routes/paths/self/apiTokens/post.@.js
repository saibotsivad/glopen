export const summary = 'Create User API Token'

export const description = `
Create an API token for the currently logged-in user. This will generate a named token, which
can be used for programmatic access to API endpoints.
`

export const tags = [ 'userApiTokens' ]

export const security = [
	{ cookie: [] },
	{ api: [] },
]

export const requestBody = {
	description: 'Create an API token for use by a single user.',
	content: {
		'application/json': {
			schema: {
				$ref: '#/components/schemas/apiToken',
			},
		},
	},
}

export const responses = {
	201: {
		description: 'The API token was successfully created.',
		headers: {
			Location: {
				description: 'The canonical URL to the created API token.',
				schema: { type: 'string' },
			},
		},
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						data: {
							$ref: '#/components/schemas/apiToken',
						},
						meta: {
							type: 'object',
							properties: {
								secret: {
									description: 'The token secret in plaintext, exactly as the user would place in their API requests.\n\n**Note:** this property is only available on the initial `POST` request, the user is expected to copy it to a password manager or to the application.',
									type: 'string',
								},
							},
						},
					},
				},
			},
		},
	},
	403: {
		description: 'The requesting user does not have sufficient permission to create a token with the specified roles, i.e. a permission escalation error.',
		content: {
			'application/json': {
				schema: {
					$ref: '#/components/schemas/errorBody',
				},
			},
		},
	},
	default: {
		$ref: '#/components/responses/error',
	},
}

export default async request => {
	const { apiToken, secret } = await request.controller.apiToken.create(request)
	return {
		status: 201,
		body: {
			data: apiToken,
			meta: { secret },
		},
	}
}
