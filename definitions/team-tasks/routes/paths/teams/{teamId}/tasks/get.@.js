export const summary = 'Get Team Task List'

export const description = `
Fetch the list of available tasks owned by the team identified by the path parameter.
`

export const tags = [ 'teamTasks' ]

import { parameters as _parameters } from '../../../../../../user-tasks/routes/paths/self/tasks/get.@.js'

export const parameters = [
	..._parameters,
	{ $ref: '#/components/parameters/teamId' },
]

export { default, security, responses } from '../../../../../../user-tasks/routes/paths/self/tasks/get.@.js'
