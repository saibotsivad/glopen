/*DOCS
@group: Task Groups

Fetch a specific task group by identifier, which is owned by the path's team.

- `request.controller.taskGroup.get: (request: Request) => { taskGroup: TaskGroup }`

DOCS*/

export const summary = 'Get Team Task Group'

export const description = 'Get a single task group for a team.'

export const tags = ['teamTasks']

import { parameters as _parameters } from '../../../../../../../user-tasks/routes/paths/self/taskGroups/{taskGroupId}/get.@.js'

export const parameters = [
	..._parameters,
	{ $ref: '#/components/parameters/teamId' },
]

export { default, security, responses } from '../../../../../../../user-tasks/routes/paths/self/taskGroups/{taskGroupId}/get.@.js'
