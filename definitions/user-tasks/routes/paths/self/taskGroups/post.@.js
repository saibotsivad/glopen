export const summary = 'Create User Task Group'

export const description = 'Create a task grouping that is owned by a single user.'

export const tags = [ 'userTasks' ]

export const security = [
	{ cookie: [] },
	{ api: [] },
]

export const requestBody = {
	description: 'Create a task grouping.',
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
}

export const responses = {
	201: {
		description: 'The task grouping was created successfully',
		headers: {
			Location: {
				description: 'The canonical URL to the created task grouping resource.',
				schema: { type: 'string' },
			},
		},
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
	const { taskGroup } = await request.controller.taskGroup.create(request)
	return {
		status: 201,
		body: { data: taskGroup },
	}
}
