export const summary = 'Update Team Task'

export const description = 'Toggle the task completion state, or update other properties. Requesting user must be a member of the team.'

export const tags = [ 'teamTasks' ]

import { parameters as _parameters } from '../../../../../../../user-tasks/routes/paths/self/tasks/{taskId}/patch.@.js'

export const parameters = [
	..._parameters,
	{ $ref: '#/components/parameters/teamId' },
]

export { default, security, requestBody, responses } from '../../../../../../../user-tasks/routes/paths/self/tasks/{taskId}/patch.@.js'
