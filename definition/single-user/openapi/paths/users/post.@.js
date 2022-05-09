/*DOCS

Create a new user.

- `request.controller.user.create: (request: Request) => { user: User, cookie?: String }`

DOCS*/

export const summary = 'Create User'

export const description = `
Create a user by providing an email address. If the user already exists, return an error.
`

export const tags = ['singleUser']

export const requestBody = {
	$ref: '#/components/requestBodies/createUser',
}

export const responses = {
	201: {
		description: 'The user and session were created, and the user object and (optionally) session are returned.',
		headers: {
			'set-cookie': {
				description: 'The session cookie is set.',
				schema: { type: 'string' },
			},
			Location: {
				description: 'The canonical URL to the created user resource.',
				schema: { type: 'string' },
			},
		},
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						data: {
							$ref: '#/components/schemas/user',
						},
						included: {
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
	const { user, cookie } = await request.controller.user.create(request)
	const response = {
		status: 201,
		body: { data: user },
	}
	if (cookie) {
		response.headers = { 'Set-Cookie': cookie }
	}
	return response
}
