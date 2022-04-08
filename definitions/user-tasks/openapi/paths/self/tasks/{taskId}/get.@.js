/*DOCS
@group: Tasks

Fetch a specific task by identifier, which is owned by the requesting user.

- `request.controller.task.get: (request: Request) => { task: Task }`

DOCS*/

export const summary = 'Get User Task'

export const description = 'Get a single task.'

export const tags = ['userTasks']

export const security = [
	{ cookie: [] },
	{ api: [] },
]

export const parameters = [
	{ $ref: '#/components/parameters/taskId' },
]

export const responses = {
	200: {
		description: 'The specified task.',
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
	const { task } = await request.controller.task.get(request)
	return {
		status: 200,
		body: { data: task },
	}
}
