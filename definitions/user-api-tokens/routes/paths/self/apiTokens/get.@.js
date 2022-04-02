export const summary = 'Get User API Tokens'

export const description = `
Fetch the list of the logged-in user's API tokens.
`

export const tags = [ 'userApiTokens' ]

export const security = [
	{ cookie: [] },
	{ api: [] },
]

export const parameters = [
	{ $ref: '#/components/parameters/filter' },
	{ $ref: '#/components/parameters/sort' },
]

export const responses = {
	200: {
		description: 'The filtered list of the API tokens.',
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						data: {
							type: 'array',
							items: {
								$ref: '#/components/schemas/apiToken',
							},
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
	const { apiTokens } = await request.controller.apiToken.list(request)
	return {
		status: 200,
		body: { data: apiTokens },
	}
}
