## User Tasks

These routes manage simple tasks (with names and long-form details) as well as task groups, which are all owned and managed by a single user.

To use in `glopen` (see [example config file](./example-glopen.config.js)):

```js
// glopen.config.js
import { shared } from '@saibotsivad/glopen-definitions-shared'
import { userTasks } from '@saibotsivad/glopen-definitions-user-tasks'
export default {
	merge: [
		...shared(),
		...userTasks({
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
- [`tag: userTasks`](./openapi/tags.@.js)
- [shared components](../_shared/README.md)

The routes are:

## Task Groups

#### [`GET /self/taskGroups`](openapi/paths/self/taskGroups/get.@.js)

Fetch the list of task groups owned by the requesting user.

- `request.controller.taskGroup.list: (request: Request) => { taskGroups: Array<TaskGroup> }`

#### [`POST /self/taskGroups`](openapi/paths/self/taskGroups/post.@.js)

Create a new task group owned by the requesting user.

- `request.controller.taskGroup.create: (request: Request) => { taskGroup: TaskGroup }`

#### [`DELETE /self/taskGroups/{taskGroupId}`](openapi/paths/self/taskGroups/{taskGroupId}/delete.@.js)

Delete a specific task group owned by the requesting user.

- `request.controller.taskGroup.remove: (request: Request) => null`

#### [`GET /self/taskGroups/{taskGroupId}`](openapi/paths/self/taskGroups/{taskGroupId}/get.@.js)

Fetch a specific task group by identifier, which is owned by the requesting user.

- `request.controller.taskGroup.get: (request: Request) => { taskGroup: TaskGroup }`

#### [`PATCH /self/taskGroups/{taskGroupId}`](openapi/paths/self/taskGroups/{taskGroupId}/patch.@.js)

Sparse update of a specific task group, which is owned by the requesting user.

- `request.controller.taskGroup.sparseUpdate: (request: Request) => { taskGroup: TaskGroup }`


## Tasks

#### [`GET /self/tasks`](openapi/paths/self/tasks/get.@.js)

Fetch the list of tasks owned by the requesting user.

- `request.controller.task.list: (request: Request) => { tasks: Array<Task> }`

#### [`POST /self/tasks`](openapi/paths/self/tasks/post.@.js)

Create a new task owned by the requesting user.

- `request.controller.task.create: (request: Request) => { task: Task }`

#### [`DELETE /self/tasks/{taskId}`](openapi/paths/self/tasks/{taskId}/delete.@.js)

Delete a specific task owned by the requesting user.

- `request.controller.task.remove: (request: Request) => null`

#### [`GET /self/tasks/{taskId}`](openapi/paths/self/tasks/{taskId}/get.@.js)

Fetch a specific task by identifier, which is owned by the requesting user.

- `request.controller.task.get: (request: Request) => { task: Task }`

#### [`PATCH /self/tasks/{taskId}`](openapi/paths/self/tasks/{taskId}/patch.@.js)

Sparse update of a specific task, which is owned by the requesting user.

- `request.controller.task.sparseUpdate: (request: Request) => { task: Task }`
