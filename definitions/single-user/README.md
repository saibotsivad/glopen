# Single User

These are routes dealing with a users own self, as opposed to routes dealing with other users.

To use in `glopen` (see [example config file](./example-glopen.config.js)):

```js
// glopen.config.js
import { shared } from '@saibotsivad/glopen-definitions-shared'
import { singleUser } from '@saibotsivad/glopen-definitions-single-user'
export default {
	merge: [
		...shared(),
		...singleUser({
			api: '/api/v1' // optional
		})
	],
}
```

The OpenAPI parts are:

- [`schemas: user`](./openapi/components/schemas/user.@.js)
- [`schemas: userRelationship`](./openapi/components/schemas/userRelationship.@.js)
- [`tag: singleUser`](./openapi/tags.@.js)
- [shared components](../_shared/README.md)

The routes are:

#### [`GET /self`](openapi/paths/self/get.@.js)

Get the user object of the logged-in user.

- `request.controller.user.getSelf: (request: Request) => { user: User }`

#### [`PATCH /self`](openapi/paths/self/patch.@.js)

Sparse update of the logged-in users user object.

- `request.controller.user.sparseUpdate: (request: Request) => { user: User }`

#### [`POST /users`](openapi/paths/users/post.@.js)

Create a new user.

- `request.controller.user.create: (request: Request) => { user: User, cookie?: String }`
