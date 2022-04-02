export const summary = 'Get Team Task'

export const description = 'Get a single task if the requesting user is a member of this team.'

export const tags = [ 'teamTasks' ]

import { parameters as _parameters } from '../../../../../../../user-tasks/routes/paths/self/tasks/{taskId}/get.@.js'

export const parameters = [
	..._parameters,
	{ $ref: '#/components/parameters/teamId' },
]

export { default, security, responses } from '../../../../../../../user-tasks/routes/paths/self/tasks/{taskId}/get.@.js'
