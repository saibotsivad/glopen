export const summary = 'Get User Task Group List'

export const description = `
Fetch the list of available task groups owned by the requesting user.
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
		description: 'The filtered list of task groups.',
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						data: {
							type: 'array',
							items: {
								$ref: '#/components/schemas/taskGroup',
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
	const { taskGroups } = await request.controller.taskGroup.list(request)
	return {
		status: 200,
		body: { data: taskGroups },
	}
}
