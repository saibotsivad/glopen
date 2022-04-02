export const summary = 'Update User Task Group'

export const description = 'Update properties for the task group.'

export const tags = [ 'userTasks' ]

export const security = [
	{ cookie: [] },
	{ api: [] },
]

export const parameters = [
	{ $ref: '#/components/parameters/taskGroupId' },
]

export const requestBody = {
	description: 'Update the task group properties.',
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
	200: {
		description: 'The task group was updated successfully.',
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
	const { taskGroup } = await request.controller.taskGroup.sparseUpdate(request)
	return {
		status: 200,
		body: { data: taskGroup },
	}
}
