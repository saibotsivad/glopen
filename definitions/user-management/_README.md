# User Management

Routes for the management of other users.

> **Note:** these routes make use of the [single-user `user` model](../single-user/openapi/components/schemas/user.@.js). This assumes that you will also be using those routes as well. If not, you'll need to do your own manual juggling to import only the `user` model.

To use in `glopen`:

```js
// glopen.config.js
import { shared, userManagement } from '@saibotsivad/glopen-routes'
export default {
	merge: [
		...shared(),
		...userManagement({
			api: '/api/v1' // optional
		})
	],
}
```

The components are:

- [`parameter: userId`](./openapi/components/parameters/userId.@.js)
- [`tag: userManagement`](./openapi/tags.@.js)
- [shared components](../_shared/README.md)

The routes are:

##### [`GET /users`](./routes/paths/users/get.@.js)

Get a list of users.

- `request.controller.user.list: (request: Request) => { users: Array<User> }`

##### [`GET /users/{userId}`](./routes/paths/users/{userId}/get.@.js)

Get an individual user.

- `request.controller.user.get: (request: Request) => { user: User }`

##### [`PATCH /users/{userId}`](./routes/paths/users/{userId}/patch.@.js)

Sparse update of an individual user.

- `request.controller.user.sparseUpdate: (request: Request) => { user: User }`
