/*DOCS

Fetch a single team, if the requesting user is allowed to see it.

- `request.controller.team.get: (request: Request) => { team: Team }`

DOCS*/

export const summary = 'Get Team'

export const description = `
Fetch the team object for an identified team. The requesting user must be a member of the team.
`

export const tags = ['teams']

export const security = [
	{ cookie: [] },
	{ api: [] },
]

export const parameters = [
	{ $ref: '#/components/parameters/teamId' },
]

export const responses = {
	200: {
		description: 'The single team.',
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
	const { team } = await request.controller.team.get(request)
	return {
		status: 200,
		body: { data: team },
	}
}
