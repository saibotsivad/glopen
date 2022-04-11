/*DOCS

Create a new team. The requesting must be made an admin of the created team, but other users could be added at creation as well.

- `request.controller.team.create: (request: Request) => { team: Team }`

DOCS*/

export const summary = 'Create Team'

export const description = 'Create a team to manage services and resources.'

export const tags = ['teams']

export const security = [
	{ cookie: [] },
	{ api: [] },
]

export const requestBody = {
	description: 'Create a new team with a human readable name.',
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
		description: 'The newly created team.',
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
	default: {
		$ref: '#/components/responses/error',
	},
}

export default async request => {
	const { team } = await request.controller.team.create(request)
	return {
		status: 201,
		body: { data: team },
	}
}
