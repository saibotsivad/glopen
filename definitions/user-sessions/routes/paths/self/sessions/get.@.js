export const summary = 'Get User Sessions'

export const description = `
Fetch the list of the logged-in user's sessions.
`

export const tags = [ 'userSessions' ]

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
		description: 'The filtered list of user sessions, for the logged-in user.',
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						data: {
							type: 'array',
							items: {
								$ref: '#/components/schemas/session',
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
	const { sessions } = await request.controller.session.list(request)
	return {
		status: 200,
		body: { data: sessions },
	}
}
