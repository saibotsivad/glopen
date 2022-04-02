export const summary = 'Create Team Task Group'

export const description = 'Create a task grouping that is owned by a team. Requesting user must be a member of the team.'

export const tags = [ 'teamTasks' ]

export const parameters = [
	{ $ref: '#/components/parameters/teamId' },
]
export { default, security, requestBody, responses } from '../../../../../../user-tasks/routes/paths/self/taskGroups/post.@.js'
