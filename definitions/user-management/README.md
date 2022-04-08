# User Management

Routes for the management of other users.

> **Note:** these routes make use of the [single-user `user` model](../single-user/openapi/components/schemas/user.@.js). This assumes that you will also be using those routes as well. If not, you'll need to do your own manual juggling to import only the `user` model.

To use in `glopen` (see [example config file](./example-glopen.config.js)):

```js
// glopen.config.js
import { shared } from '@saibotsivad/glopen-definitions-shared'
import { singleUser } from '@saibotsivad/glopen-definitions-single-user'
import { userManagement } from '@saibotsivad/glopen-definitions-user-management'
export default {
	merge: [
		...shared(),
		...singleUser({
			api: '/api/v1' // optional
		}),
		...userManagement({
			api: '/api/v1' // optional
		}),
	],
}
```

The OpenAPI parts are:

- [`parameters: userId`](./openapi/components/parameters/userId.@.js)
- [`tag: userManagement`](./openapi/tags.@.js)
- [shared components](../_shared/README.md)

The routes are:

#### [`GET /users`](openapi/paths/users/get.@.js)

Get a list of users.

- `request.controller.user.list: (request: Request) => { users: Array<User> }`

#### [`GET /users/{userId}`](openapi/paths/users/{userId}/get.@.js)

Get an individual user.

- `request.controller.user.get: (request: Request) => { user: User }`

#### [`PATCH /users/{userId}`](openapi/paths/users/{userId}/patch.@.js)

Sparse update of an individual user.

- `request.controller.user.sparseUpdate: (request: Request) => { user: User }`
