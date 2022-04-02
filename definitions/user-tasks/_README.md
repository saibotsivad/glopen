## User Tasks

These routes manage simple tasks (with names and long-form details) as well as task groups, which are all owned and managed by a single user.

To use in `glopen`:

```js
// glopen.config.js
import { shared, userTasks } from '@saibotsivad/glopen-routes'
export default {
	merge: [
		...shared(),
		...userTasks({
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
- [`tag: userTasks`](./openapi/tags.@.js)
- [shared components](../_shared/README.md)

The routes are:

## Tasks

##### [`POST /self/tasks`](./routes/paths/self/tasks/post.@.js)

Create a new task owned by the requesting user.

- `request.controller.task.create: (request: Request) => { task: Task }`

##### [`GET /self/tasks`](./routes/paths/self/tasks/get.@.js)

Fetch the list of tasks owned by the requesting user.

- `request.controller.task.list: (request: Request) => { tasks: Array<Task> }`

##### [`GET /self/tasks/{taskId}`](./routes/paths/self/tasks/{taskId}/get.@.js)

Fetch a specific task by identifier, which is owned by the requesting user.

- `request.controller.task.get: (request: Request) => { task: Task }`

##### [`PATCH /self/tasks/{taskId}`](./routes/paths/self/tasks/{taskId}/patch.@.js)

Sparse update of a specific task, which is owned by the requesting user.

- `request.controller.task.sparseUpdate: (request: Request) => { task: Task }`

##### [`DELETE /self/tasks/{taskId}`](./routes/paths/self/tasks/{taskId}/delete.@.js)

Delete a specific task owned by the requesting user.

- `request.controller.task.remove: (request: Request) => null`

## Task Groups

##### [`POST /self/taskGroups`](./routes/paths/self/taskGroups/post.@.js)

Create a new task group owned by the requesting user.

- `request.controller.taskGroup.create: (request: Request) => { taskGroup: TaskGroup }`

##### [`GET /self/taskGroups`](./routes/paths/self/taskGroups/get.@.js)

Fetch the list of task groups owned by the requesting user.

- `request.controller.taskGroup.list: (request: Request) => { taskGroups: Array<TaskGroup> }`

##### [`GET /self/taskGroups/{taskGroupId}`](./routes/paths/self/taskGroups/{taskGroupId}/get.@.js)

Fetch a specific task group by identifier, which is owned by the requesting user.

- `request.controller.taskGroup.get: (request: Request) => { taskGroup: TaskGroup }`

##### [`PATCH /self/taskGroups/{taskGroupId}`](./routes/paths/self/taskGroups/{taskGroupId}/patch.@.js)

Sparse update of a specific task group, which is owned by the requesting user.

- `request.controller.taskGroup.sparseUpdate: (request: Request) => { taskGroup: TaskGroup }`

##### [`DELETE /self/taskGroups/{taskGroupId}`](./routes/paths/self/taskGroups/{taskGroupId}/delete.@.js)

Delete a specific task group owned by the requesting user.

- `request.controller.taskGroup.remove: (request: Request) => null`
