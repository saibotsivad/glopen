export const summary = 'Delete Team Task'

export const description = 'Fully delete a task by identifier if the requesting user is a member of the specified team.'

export const tags = [ 'teamTasks' ]

import { parameters as _parameters } from '../../../../../../../user-tasks/routes/paths/self/tasks/{taskId}/delete.@.js'

export const parameters = [
	..._parameters,
	{ $ref: '#/components/parameters/teamId' },
]

export { default, security, responses } from '../../../../../../../user-tasks/routes/paths/self/tasks/{taskId}/delete.@.js'
