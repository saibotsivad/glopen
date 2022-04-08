/*DOCS
@group: Tasks

Sparse update of a specific task, which is owned by the requesting user.

- `request.controller.task.sparseUpdate: (request: Request) => { task: Task }`

DOCS*/

export const summary = 'Update User Task'

export const description = 'Toggle the task completion state, or update other properties.'

export const tags = ['userTasks']

export const security = [
	{ cookie: [] },
	{ api: [] },
]

export const parameters = [
	{ $ref: '#/components/parameters/taskId' },
]

export const requestBody = {
	description: 'Update the task properties.',
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
	200: {
		description: 'The task was updated successfully.',
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
	const { task } = await request.controller.task.sparseUpdate(request)
	return {
		status: 200,
		body: { data: task },
	}
}
