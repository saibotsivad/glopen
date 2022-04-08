/*DOCS
@group: Tasks

Sparse update of a specific task, which is owned by the path's team.

- `request.controller.task.sparseUpdate: (request: Request) => { task: Task }`

DOCS*/

export const summary = 'Update Team Task'

export const description = 'Toggle the task completion state, or update other properties. Requesting user must be a member of the team.'

export const tags = ['teamTasks']

import { parameters as _parameters } from '../../../../../../../user-tasks/routes/paths/self/tasks/{taskId}/patch.@.js'

export const parameters = [
	..._parameters,
	{ $ref: '#/components/parameters/teamId' },
]

export { default, security, requestBody, responses } from '../../../../../../../user-tasks/routes/paths/self/tasks/{taskId}/patch.@.js'
