export const summary = 'Add Team Admins'

export const description = 'Add one or more admins to a team.'

export const tags = [ 'teams' ]

export const security = [
	{ cookie: [] },
	{ api: [] },
]

export const parameters = [
	{ $ref: '#/components/parameters/teamId' },
]

export const requestBody = {
	description: 'Add one or more admins to a team using a list of JSON:API "relationship" objects.',
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
		description: 'The user was added as an admin, and the updated list of admin relationships is returned.',
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
		description: 'The requesting user is not an admin of the team, and therefore is not allowed to add admins.',
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
	const { admins } = await request.controller.team.addAdmins(request)
	return {
		status: 201,
		body: { data: admins },
	}
}
