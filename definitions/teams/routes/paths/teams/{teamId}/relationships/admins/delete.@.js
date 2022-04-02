export const summary = 'Delete Team Admin'

export const description = 'Remove an admin from a team.'

export const tags = [ 'teams' ]

export const security = [
	{ cookie: [] },
	{ api: [] },
]

export const parameters = [
	{ $ref: '#/components/parameters/teamId' },
]

export const requestBody = {
	description: 'Remove one or more admins from a team using a list of JSON:API "relationship" objects. Every listed relationship will be removed.',
	content: {
		'application/json': {
			schema: {
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: {
							$ref: '#/components/schemas/userRelationship',
						},
					},
				},
			},
		},
	},
}

export const responses = {
	200: {
		description: 'The user was removed as an admin, and the remaining admins are returned on the response.',
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						data: {
							type: 'array',
							items: {
								$ref: '#/components/schemas/userRelationship',
							},
						},
					},
				},
			},
		},
	},
	403: {
		description: 'The requesting user is not an admin of the team, and therefore is not allowed to remove admins.',
		content: {
			'application/json': {
				schema: {
					$ref: '#/components/schemas/errorBody',
				},
			},
		},
	},
	default: {
		$ref: '#/components/responses/error',
	},
}

export default async request => {
	const { admins } = await request.controller.team.removeAdmins(request)
	return {
		status: 200,
		body: {
			data: admins,
		},
	}
}
