export const summary = 'Create Session (Log In)'

export const description = `
Attempt to create a fully approved session using a provided username (which can be an email,
if the system allows) and a password. A successful response will also return a \`Set-Cookie\`
header. If 2FA is enabled, the response body will indicate that, and finalization will use
the \`PATCH /sessions/{sessionId}\` route.
`

export const tags = [ 'userSessions' ]

export const requestBody = {
	description: 'Create a session using a username/email and password.',
	content: {
		'application/json': {
			schema: {
				type: 'object',
				required: [ 'meta' ],
				properties: {
					meta: {
						type: 'object',
						required: [ 'username', 'password' ],
						properties: {
							username: {
								type: 'string',
								description: 'The username (or email address) associated with the user.',
							},
							password: {
								type: 'string',
								description: 'The password used to authenticate the request.',
							},
						},
					},
				},
			},
		},
	},
}

export const responses = {
	204: {
		description: 'The username/email and password were accepted, and a session was created. No body is returned.',
		headers: {
			'Set-Cookie': {
				description: 'The session cookie is returned.',
				schema: { type: 'string' },
			},
		},
	},
	202: {
		description: 'The username/email and password were accepted and a session was created in a `wait` state, but 2FA must be completed.',
		headers: {
			'Set-Cookie': {
				description: 'The session cookie is returned.',
				schema: { type: 'string' },
			},
		},
		content: {
			'application/json': {
				examples: {
					normal: {
						summary: 'A normal response when 2FA is required to continue.',
						value: {
							links: {
								auth: {
									href: 'https://example.com/sessions/1234',
									meta: {
										expires: '2021-10-26T18:06:15.470Z',
									},
								},
							},
						},
					},
				},
				schema: {
					type: 'object',
					properties: {
						links: {
							type: 'object',
							properties: {
								auth: {
									type: 'object',
									properties: {
										href: {
											type: 'string',
											description: 'The fully qualified URL to the `PATCH` request used to complete 2FA.',
										},
										meta: {
											type: 'object',
											properties: {
												expires: {
													type: 'string',
													description: 'The ISO-8601 formatted date at which 2FA for this session will not be accepted.',
												},
											},
										},
									},
								},
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
	const { cookie, auth } = await request.controller.session.create(request)
	const response = {
		status: auth
			? 202
			: 204,
		headers: {
			'Set-Cookie': cookie,
		},
	}
	if (auth) {
		response.body = { links: { auth } }
	}
	return response
}
