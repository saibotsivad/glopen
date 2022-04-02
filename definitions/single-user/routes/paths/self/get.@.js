export const summary = 'Get User'

export const description = `
Fetch the logged-in user's \`user\` resource, authenticating with the session cookie.
`

export const tags = [ 'singleUser' ]

export const security = [
	{ cookie: [] },
	{ api: [] },
]

export const responses = {
	200: {
		description: 'The fetched user object, if the request is correctly authenticated.',
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						data: {
							$ref: '#/components/schemas/user',
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
	const { user } = await request.controller.user.getSelf(request)
	return {
		status: 200,
		body: { data: user },
	}
}
