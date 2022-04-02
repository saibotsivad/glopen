# Single User

These are routes dealing with a users own self, as opposed to routes dealing with other users.

To use in `glopen`:

```js
// glopen.config.js
import { shared, singleUser } from '@saibotsivad/glopen-routes'
export default {
	merge: [
		...shared(),
		...singleUser({
			api: '/api/v1' // optional
		})
	],
}
```

The components are:

- [`schema: user`](./openapi/components/schemas/user.@.js)
- [`tag: singleUser`](./openapi/tags.@.js)
- [shared components](../_shared/README.md)

The routes are:

##### [`POST /user`](./routes/paths/user/post.@.js)

Create a new user.

- `request.controller.user.create: (request: Request) => { user: User, cookie?: String }`

##### [`GET /self`](./routes/paths/self/get.@.js)

Get the user object of the logged-in user.

- `request.controller.user.getSelf: (request: Request) => { user: User }`

##### [`PATCH /self`](./routes/paths/self/patch.@.js)

Sparse update of the logged-in users user object.

- `request.controller.user.sparseUpdate: (request: Request) => { user: User }`
