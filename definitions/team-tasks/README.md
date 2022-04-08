## User Tasks

These routes manage simple tasks (with names and long-form details) as well as task groups, which are all owned and managed by a single user.

For any task operation, the requesting user **must** be a member or admin of the team.

To use in `glopen` (see [example config file](./example-glopen.config.js)):

```js
// glopen.config.js
import { shared } from '@saibotsivad/glopen-definitions-shared'
import { teamTasks } from '@saibotsivad/glopen-definitions-team-tasks'
export default {
	merge: [
		...shared(),
		...teamTasks({
			api: '/api/v1' // optional
		})
	],
}
```

The OpenAPI parts are:

- [`parameters: taskGroupId`](./openapi/components/parameters/taskGroupId.@.js)
- [`parameters: taskId`](./openapi/components/parameters/taskId.@.js)
- [`schemas: task`](./openapi/components/schemas/task.@.js)
- [`schemas: taskGroup`](./openapi/components/schemas/taskGroup.@.js)
- [`tag: teamTasks`](./openapi/tags.@.js)
- [shared components](../_shared/README.md)

The routes are:

## Task Groups

#### [`GET /teams/{teamId}/taskGroups`](openapi/paths/teams/{teamId}/taskGroups/get.@.js)

Fetch the list of task groups owned by the path's team.

- `request.controller.taskGroup.list: (request: Request) => { taskGroups: Array<TaskGroup> }`

#### [`POST /teams/{teamId}/taskGroups`](openapi/paths/teams/{teamId}/taskGroups/post.@.js)

Create a new task group owned by the path's team.

- `request.controller.taskGroup.create: (request: Request) => { taskGroup: TaskGroup }`

#### [`DELETE /teams/{teamId}/taskGroups/{taskGroupId}`](openapi/paths/teams/{teamId}/taskGroups/{taskGroupId}/delete.@.js)

Delete a specific task group owned by the path's team.

- `request.controller.taskGroup.remove: (request: Request) => null`

#### [`GET /teams/{teamId}/taskGroups/{taskGroupId}`](openapi/paths/teams/{teamId}/taskGroups/{taskGroupId}/get.@.js)

Fetch a specific task group by identifier, which is owned by the path's team.

- `request.controller.taskGroup.get: (request: Request) => { taskGroup: TaskGroup }`

#### [`PATCH /teams/{teamId}/taskGroups/{taskGroupId}`](openapi/paths/teams/{teamId}/taskGroups/{taskGroupId}/patch.@.js)

Sparse update of a specific task group, which is owned by the path's team.

- `request.controller.taskGroup.sparseUpdate: (request: Request) => { taskGroup: TaskGroup }`


## Tasks

#### [`GET /teams/{teamId}/tasks`](openapi/paths/teams/{teamId}/tasks/get.@.js)

Fetch the list of tasks owned by the path's team.

- `request.controller.task.list: (request: Request) => { tasks: Array<Task> }`

#### [`POST /teams/{teamId}/tasks`](openapi/paths/teams/{teamId}/tasks/post.@.js)

Create a new task owned by the path's team.

- `request.controller.task.create: (request: Request) => { task: Task }`

#### [`DELETE /teams/{teamId}/tasks/{taskId}`](openapi/paths/teams/{teamId}/tasks/{taskId}/delete.@.js)

Delete a specific task owned by the path's team.

- `request.controller.task.remove: (request: Request) => null`

#### [`GET /teams/{teamId}/tasks/{taskId}`](openapi/paths/teams/{teamId}/tasks/{taskId}/get.@.js)

Fetch a specific task by identifier, which is owned by the path's team.

- `request.controller.task.get: (request: Request) => { task: Task }`

#### [`PATCH /teams/{teamId}/tasks/{taskId}`](openapi/paths/teams/{teamId}/tasks/{taskId}/patch.@.js)

Sparse update of a specific task, which is owned by the path's team.

- `request.controller.task.sparseUpdate: (request: Request) => { task: Task }`
