export const summary = 'Revoke Session (Log Out)'

export const description = `
Logging out sets the \`session\` status as \`revoked\`, and returns a \`Set-Cookie\` header which
marks the cookie as expired and sets its content to empty.
`

export const tags = [ 'userSessions' ]

export const responses = {
	204: {
		description: 'The session associated with the provided cookie was revoked. No body is returned.',
		headers: {
			'Set-Cookie': {
				description: 'The cookie is set with empty content and marked as expired.',
				schema: { type: 'string' },
			},
		},
	},
	default: {
		$ref: '#/components/responses/error',
	},
}

export default async request => {
	const { cookie } = await request.controller.session.logout(request)
	return {
		status: 204,
		headers: {
			'Set-Cookie': cookie,
		},
	}
}
