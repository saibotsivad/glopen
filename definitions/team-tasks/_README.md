## User Tasks

These routes manage simple tasks (with names and long-form details) as well as task groups, which are all owned and managed by a single user.

To use in `glopen`:

```js
// glopen.config.js
import { shared, teamTasks } from '@saibotsivad/glopen-routes'
export default {
	merge: [
		...shared(),
		...teamTasks({
			api: '/api/v1' // optional
		})
	],
}
```

The components are:

- [`parameter: taskId`](./openapi/components/parameters/taskId.@.js)
- [`parameter: taskGroupId`](./openapi/components/parameters/taskGroupId.@.js)
- [`schema: task`](./openapi/components/schemas/task.@.js)
- [`schema: taskGroup`](./openapi/components/schemas/taskGroup.@.js)
- [`tag: teamTasks`](./openapi/tags.@.js)
- [shared components](../_shared/README.md)

The routes are:

## Tasks

For any operation, the requesting user **must** be a member or admin of the team.

##### [`POST /teams/{teamId}/tasks`](routes/paths/teams/tasks/post.@.js)

Create a new task owned by the path's team.

- `request.controller.task.create: (request: Request) => { task: Task }`

##### [`GET /teams/{teamId}/tasks`](routes/paths/teams/tasks/get.@.js)

Fetch the list of tasks owned by the path's team.

- `request.controller.task.list: (request: Request) => { tasks: Array<Task> }`

##### [`GET /teams/{teamId}/tasks/{taskId}`](routes/paths/teams/tasks/{taskId}/get.@.js)

Fetch a specific task by identifier, which is owned by the path's team.

- `request.controller.task.get: (request: Request) => { task: Task }`

##### [`PATCH /teams/{teamId}/tasks/{taskId}`](routes/paths/teams/tasks/{taskId}/patch.@.js)

Sparse update of a specific task, which is owned by the path's team.

- `request.controller.task.sparseUpdate: (request: Request) => { task: Task }`

##### [`DELETE /teams/{teamId}/tasks/{taskId}`](routes/paths/teams/tasks/{taskId}/delete.@.js)

Delete a specific task owned by the path's team.

- `request.controller.task.remove: (request: Request) => null`

## Task Groups

##### [`POST /teams/{teamId}/taskGroups`](routes/paths/teams/taskGroups/post.@.js)

Create a new task group owned by the path's team.

- `request.controller.taskGroup.create: (request: Request) => { taskGroup: TaskGroup }`

##### [`GET /teams/{teamId}/taskGroups`](routes/paths/teams/taskGroups/get.@.js)

Fetch the list of task groups owned by the path's team.

- `request.controller.taskGroup.list: (request: Request) => { taskGroups: Array<TaskGroup> }`

##### [`GET /teams/{teamId}/taskGroups/{taskGroupId}`](routes/paths/teams/taskGroups/{taskGroupId}/get.@.js)

Fetch a specific task group by identifier, which is owned by the path's team.

- `request.controller.taskGroup.get: (request: Request) => { taskGroup: TaskGroup }`

##### [`PATCH /teams/{teamId}/taskGroups/{taskGroupId}`](routes/paths/teams/taskGroups/{taskGroupId}/patch.@.js)

Sparse update of a specific task group, which is owned by the path's team.

- `request.controller.taskGroup.sparseUpdate: (request: Request) => { taskGroup: TaskGroup }`

##### [`DELETE /teams/{teamId}/taskGroups/{taskGroupId}`](routes/paths/teams/taskGroups/{taskGroupId}/delete.@.js)

Delete a specific task group owned by the path's team.

- `request.controller.taskGroup.remove: (request: Request) => null`
