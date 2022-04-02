export const summary = 'Update Team'

export const description = 'Sparse update of an identified team. The requesting user must be an admin of the team.'

export const tags = [ 'teams' ]

export const security = [
	{ cookie: [] },
	{ api: [] },
]

export const parameters = [
	{ $ref: '#/components/parameters/teamId' },
]

export const requestBody = {
	description: 'Update the specific team.',
	content: {
		'application/json': {
			schema: {
				type: 'object',
				properties: {
					data: {
						$ref: '#/components/schemas/team',
					},
				},
			},
		},
	},
}

export const responses = {
	200: {
		description: 'The team was updated, and the updated object is returned.',
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						data: {
							$ref: '#/components/schemas/team',
						},
					},
				},
			},
		},
	},
	403: {
		description: 'The requesting user is not an admin of the team, and therefore is not allowed to update this resource.',
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
	const { team } = await request.controller.team.sparseUpdate(request)
	return {
		status: 200,
		body: { data: team },
	}
}
