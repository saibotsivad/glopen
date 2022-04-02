export const summary = 'Delete User Task Group'

export const description = 'Fully delete a task group by identifier. If there are tasks with this group identifier, the relationship will be removed but the task will not be deleted.'

export const tags = [ 'userTasks' ]

export const security = [
	{ cookie: [] },
	{ api: [] },
]

export const parameters = [
	{ $ref: '#/components/parameters/taskGroupId' },
]

export const responses = {
	204: {
		description: 'The task group was fully deleted. No body is returned.',
	},
	default: {
		$ref: '#/components/responses/error',
	},
}

export default async request => {
	await request.controller.taskGroup.remove(request)
	return { status: 204 }
}
