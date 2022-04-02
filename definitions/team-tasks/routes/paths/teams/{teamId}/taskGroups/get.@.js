export const summary = 'Get Team Task Group List'

export const description = `
Fetch the list of available task groups owned by team. Requesting user must be a member of the team.
`

export const tags = [ 'teamTasks' ]

import { parameters as _parameters } from '../../../../../../user-tasks/routes/paths/self/taskGroups/get.@.js'

export const parameters = [
	..._parameters,
	{ $ref: '#/components/parameters/teamId' },
]

export { default, security, responses } from '../../../../../../user-tasks/routes/paths/self/taskGroups/get.@.js'
