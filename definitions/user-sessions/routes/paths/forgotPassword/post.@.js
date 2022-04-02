export const summary = 'Initiate Password Reset'

export const description = `
When a user forgets their login credentials, they initiate a password reset flow, which sends
a single-use secret token (as part of a link) to their account email address. Access to this
token verifies ownership of the email address.

This \`POST\` request should create a \`password-reset-request\` object in the database, associated
with the user of that username/email, and sends an email to that address, if the user exists.

To finalize the password reset, see the \`PATCH /forgotPassword\` request.
`

export const tags = [ 'userSessions' ]

export const requestBody = {
	description: 'Request a password reset email.',
	content: {
		'application/json': {
			schema: {
				type: 'object',
				required: [ 'meta' ],
				properties: {
					meta: {
						type: 'object',
						required: [ 'username' ],
						properties: {
							username: {
								type: 'string',
								description: 'The username or email address to send the password reset email to.',
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
		description: 'The password reset request was accepted, and an was email sent. No body is returned.',
	},
	default: {
		$ref: '#/components/responses/error',
	},
}

export default async request => {
	await request.controller.password.resetUnauthorized(request)
	return { status: 201 }
}
