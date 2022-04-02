export const summary = 'Create User Task'

export const description = 'Create a task that is owned by a single user.'

export const tags = [ 'userTasks' ]

export const security = [
	{ cookie: [] },
	{ api: [] },
]

export const requestBody = {
	description: 'Create a task.',
	content: {
		'application/json': {
			schema: {
				type: 'object',
				properties: {
					data: {
						$ref: '#/components/schemas/task',
					},
				},
			},
		},
	},
}

export const responses = {
	201: {
		description: 'The task was created successfully',
		headers: {
			Location: {
				description: 'The canonical URL to the created task resource.',
				schema: { type: 'string' },
			},
		},
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						data: {
							$ref: '#/components/schemas/task',
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
	const { task } = await request.controller.task.create(request)
	return {
		status: 201,
		body: { data: task },
	}
}
