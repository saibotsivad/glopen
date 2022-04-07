/*DOCS
@group: Tasks

Create a new task owned by the path's team.

- `request.controller.task.create: (request: Request) => { task: Task }`

DOCS*/

export const summary = 'Create Team Task'

export const description = 'Create a task that is owned by a team.'

export const tags = ['teamTasks']

export const parameters = [
	{ $ref: '#/components/parameters/teamId' },
]

export { default, security, requestBody, responses } from '../../../../../../user-tasks/routes/paths/self/tasks/post.@.js'
