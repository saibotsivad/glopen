export const summary = 'Get Team Task Group'

export const description = 'Get a single task group for a team.'

export const tags = [ 'teamTasks' ]

import { parameters as _parameters } from '../../../../../../../user-tasks/routes/paths/self/taskGroups/{taskGroupId}/get.@.js'

export const parameters = [
	..._parameters,
	{ $ref: '#/components/parameters/teamId' },
]

export { default, security, responses } from '../../../../../../../user-tasks/routes/paths/self/taskGroups/{taskGroupId}/get.@.js'
