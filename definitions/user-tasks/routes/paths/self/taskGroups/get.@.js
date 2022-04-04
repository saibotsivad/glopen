/*DOCS
@group: Task Groups

Fetch the list of task groups owned by the requesting user.

- `request.controller.taskGroup.list: (request: Request) => { taskGroups: Array<TaskGroup> }`

DOCS*/

export const summary = 'Get User Task Group List'

export const description = `
Fetch the list of available task groups owned by the requesting user.
`

export const tags = ['userTasks']

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

/**
 * @typedef {import('../../../../../_shared/types/controllers').GlopenCtrlTaskGroupList} ctrl1
 */

/**
 * @typedef {import('../../../../../_shared/types/controllers').GlopenCtrlUserGetSelf} ctrl2
 */

/**
 * Request handler
 * @param {ctrl1 & ctrl2} request - The request with all params.
 */
export default async request => {
	const { user } = await request.controller.user.getSelf(request)
	// TODO remove this
	console.log('the user is not needed in this route but it is here for me to test', user)
	const { taskGroups } = await request.controller.taskGroup.list(request)
	return {
		status: 200,
		body: { data: taskGroups },
	}
}
