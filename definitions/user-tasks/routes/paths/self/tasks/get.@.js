export const summary = 'Get User Task List'

export const description = `
Fetch the list of available tasks owned by the requesting user.
`

export const tags = [ 'userTasks' ]

export const security = [
	{ cookie: [] },
	{ api: [] },
]

export const parameters = [
	{ $ref: '#/components/parameters/filter' },
	{ $ref: '#/components/parameters/sort' },
]

export const responses = {
	200: {
		description: 'The filtered list of tasks.',
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						data: {
							type: 'array',
							items: {
								$ref: '#/components/schemas/task',
							},
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
	const { tasks } = await request.controller.task.list(request)
	return {
		status: 200,
		body: { data: tasks },
	}
}
