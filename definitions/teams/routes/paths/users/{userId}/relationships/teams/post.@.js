export const summary = 'Add User to Team'

export const description = 'Add one or more users as members of a team.'

export const tags = [ 'teams' ]

export const security = [
	{ cookie: [] },
	{ api: [] },
]

export const parameters = [
	{ $ref: '#/components/parameters/userId' },
]

export const requestBody = {
	description: 'Add one or more users as members of a team using a list of JSON:API "relationship" objects.',
	content: {
		'application/json': {
			schema: {
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: {
							$ref: '#/components/schemas/teamRelationship',
						},
					},
				},
			},
		},
	},
}

export const responses = {
	200: {
		description: 'The user was added as a member of the team, and the updated list of teams is returned.',
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						data: {
							type: 'array',
							items: {
								$ref: '#/components/schemas/teamRelationship',
							},
						},
					},
				},
			},
		},
	},
	403: {
		description: 'The requesting user is not an admin of the team, and therefore is not allowed to add members.',
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
	const { users } = await request.controller.team.addMembers(request)
	return {
		status: 201,
		body: { data: users },
	}
}
