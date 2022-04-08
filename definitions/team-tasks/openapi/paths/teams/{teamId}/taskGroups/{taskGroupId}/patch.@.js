/*DOCS
@group: Task Groups

Sparse update of a specific task group, which is owned by the path's team.

- `request.controller.taskGroup.sparseUpdate: (request: Request) => { taskGroup: TaskGroup }`

DOCS*/

export const summary = 'Update Team Task Group'

export const description = 'Update properties for the task group of a team.'

export const tags = ['teamTasks']

import { parameters as _parameters } from '../../../../../../../user-tasks/routes/paths/self/taskGroups/{taskGroupId}/patch.@.js'

export const parameters = [
	..._parameters,
	{ $ref: '#/components/parameters/teamId' },
]

export { default, security, responses } from '../../../../../../../user-tasks/routes/paths/self/taskGroups/{taskGroupId}/patch.@.js'
