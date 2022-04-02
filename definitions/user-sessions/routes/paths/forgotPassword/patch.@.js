export const summary = 'Finalize Password Reset'

export const description = `
To finalize the password reset, the new password and the single-use token from the email are
provided on this \`PATCH /forgotPassword\` request.

The provided token is verified against the secret in the \`password-reset-request\` object
using standard password quality hash+salt comparisons. If the hashes match, this is considered
proof that the reset request is from the owner of the email address, so the users password is
updated to the one on the request.

On finalization success, the API *may* also create a session and return a session cookie, such
that future requests are authenticated.
`

export const tags = [ 'userSessions' ]

export const requestBody = {
	description: 'Finalize a password reset request.',
	content: {
		'application/json': {
			schema: {
				type: 'object',
				required: [ 'meta' ],
				properties: {
					meta: {
						type: 'object',
						required: [ 'token', 'password' ],
						properties: {
							token: {
								type: 'string',
								description: 'The single-use token as sent in the email.',
							},
							password: {
								type: 'string',
								description: 'The new password to set for the user.',
							},
						},
					},
				},
			},
		},
	},
}

export const responses = {
	201: {
		description: 'The token and password were accepted, the password for the user was reset, and a session was created.',
		headers: {
			'Set-Cookie': {
				description: 'The session cookie is returned.',
				schema: { type: 'string' },
			},
		},
	},
	204: {
		description: 'The token and password were accepted, and the password for the user was reset. No body is returned and no header set: the user will need to log in again to create a session.',
	},
	default: {
		$ref: '#/components/responses/error',
	},
}

export default async request => {
	const result = await request.controller.password.resetUnauthorizedFinalize(request)
	const response = {
		status: result?.cookie
			? 201
			: 204,
	}
	if (result?.cookie) response.headers = { 'Set-Cookie': result.cookie }
	return response
}
