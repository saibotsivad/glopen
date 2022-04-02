export const summary = 'Get User Task Group'

export const description = 'Get a single task group for a user.'

export const tags = [ 'userTasks' ]

export const security = [
	{ cookie: [] },
	{ api: [] },
]

export const parameters = [
	{ $ref: '#/components/parameters/taskGroupId' },
]

export const responses = {
	200: {
		description: 'The specified task group.',
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						data: {
							$ref: '#/components/schemas/taskGroup',
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
	const { taskGroup } = await request.controller.taskGroup.get(request)
	return {
		status: 200,
		body: { data: taskGroup },
	}
}
