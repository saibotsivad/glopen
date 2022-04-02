export const summary = 'Delete Team Task Group'

export const description = 'Fully delete a task group by identifier. Requesting user must be a member of the team. If there are tasks with this group identifier, the relationship will be removed but the task will not be deleted.'

export const tags = [ 'teamTasks' ]

import { parameters as _parameters } from '../../../../../../../user-tasks/routes/paths/self/taskGroups/{taskGroupId}/delete.@.js'

export const parameters = [
	..._parameters,
	{ $ref: '#/components/parameters/teamId' },
]

export { default, security, responses } from '../../../../../../../user-tasks/routes/paths/self/taskGroups/{taskGroupId}/delete.@.js'
