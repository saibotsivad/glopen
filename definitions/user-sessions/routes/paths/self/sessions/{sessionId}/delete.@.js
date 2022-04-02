export const summary = 'Delete Session'

export const description = 'Fully delete a session by identifier.'

export const tags = [ 'userSessions' ]

export const security = [
	{ cookie: [] },
	{ api: [] },
]

export const parameters = [
	{ $ref: '#/components/parameters/sessionId' },
]

export const responses = {
	204: {
		description: 'The session resource was fully deleted. No body is returned.',
	},
	default: {
		$ref: '#/components/responses/error',
	},
}

export default async request => {
	await request.controller.session.remove(request)
	return { status: 204 }
}
