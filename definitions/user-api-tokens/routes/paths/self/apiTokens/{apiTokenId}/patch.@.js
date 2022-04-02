export const summary = 'Update User API Token'

export const description = `
This endpoint allows a user to update their API token secret, either by requesting
a new token, or updating the name, roles, or expiration date.

When the token secret is rotated, the user is not allowed to set the new secret, that
is handled by the backend.
`

export const tags = [ 'userApiTokens' ]

export const security = [
	{ cookie: [] },
	{ api: [] },
]

export const parameters = [
	{ $ref: '#/components/parameters/apiTokenId' },
]

export const requestBody = {
	description: 'Update a users API token. **Note:** the user is not allowed to set the token secret on this request.',
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
							rotate: {
								description: 'If set to true, the server will generate and set a new token secret, and return that secret on the response.',
								type: 'boolean',
							},
						},
					},
				},
			},
		},
	},
}

export const responses = {
	200: {
		description: 'The API token was successfully updated.',
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
									description: 'The token secret in plaintext, exactly as the user would place in their API requests. This property is **only** returned if the `PATCH` request indicated to rotate the secret.\n\n**Note:** this property is only available on the initial `POST` request, the user is expected to copy it to a password manager or to the application.',
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
		description: 'The requesting user does not have sufficient permission to create set the specified roles, i.e. a permission escalation error.',
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
	const { apiToken, secret } = await request.controller.apiToken.sparseUpdate(request)
	return {
		status: 200,
		body: {
			data: apiToken,
			meta: { secret },
		},
	}
}
