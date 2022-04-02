export const summary = 'Finalize Session (2FA/OTP)'

export const description = `
If 2FA is enabled during login, the user must call this endpoint with the OTP digits. If the
implementation uses symmetric encryption of the 2FA secret, the users password must also be
provided. If this request is successful, the session \`status\` is marked \`ok\`.

Here is an example UX flow for using symmetric encryption of the 2FA secret:

1. The user enters their username/email and password in the login form and clicks a "Log In" button.
2. The webapp preserves the password in-memory and makes the \`POST /sessions\` request.
3. If 2FA is enabled, the \`POST\` request will return a body response with the \`/sessions/{sessionId}\` URL, which must be saved in-memory as well.
3. The webapp now shows a 2FA view, which shows the inputs for the 6-digit code.
4. The user enters the 2FA code and clicks a "Finish Logging In" button.
5. The webapp makes this \`PATCH\` request to the URL from the \`POST\` request, using the in-memory password and the user-supplied 2FA code.
6. If the response is a \`204\` status, the user is now fully authenticated.
`

export const tags = [ 'userSessions' ]

export const parameters = [
	{ $ref: '#/components/parameters/sessionId' },
]

export const requestBody = {
	description: 'Finalize a session using OTP digits and password.',
	content: {
		'application/json': {
			schema: {
				type: 'object',
				required: [ 'meta' ],
				properties: {
					meta: {
						type: 'object',
						required: [ 'otp', 'password' ],
						properties: {
							otp: {
								type: 'string',
								description: 'The OTP digits associated with the 2FA secret.',
							},
							password: {
								type: 'string',
								description: 'The password used to log in the user.',
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
		description: 'The OTP digits and password were accepted, and the session was marked as `ok`. No body is returned.',
	},
	default: {
		$ref: '#/components/responses/error',
	},
}

export default async request => {
	await request.controller.session.finalize(request)
	return { status: 204 }
}
