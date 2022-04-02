export const summary = 'Delete User Task'

export const description = 'Fully delete a task by identifier.'

export const tags = [ 'userTasks' ]

export const security = [
	{ cookie: [] },
	{ api: [] },
]

export const parameters = [
	{ $ref: '#/components/parameters/taskId' },
]

export const responses = {
	204: {
		description: 'The task was fully deleted. No body is returned.',
	},
	default: {
		$ref: '#/components/responses/error',
	},
}

export default async request => {
	await request.controller.task.remove(request)
	return { status: 204 }
}
