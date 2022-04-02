## User Sessions

These routes manage a users sessions, e.g. when they log in via the webapp.

To use in `glopen`:

```js
// glopen.config.js
import { shared, userSessions } from '@saibotsivad/glopen-routes'
export default {
	merge: [
		...shared(),
		...userSessions({
			api: '/api/v1' // optional
		})
	],
}
```

The components are:

- [`parameter: sessionId`](./openapi/components/parameters/sessionId.@.js)
- [`schema: session`](./openapi/components/schemas/session.@.js)
- [`tag: userSessions`](./openapi/tags.@.js)
- [shared components](../_shared/README.md)

- The routes are:

##### [`POST /forgotPassword`](./routes/paths/forgotPassword/post.@.js)

Initiate a password reset request via sending an email.

- `request.controller.user.resetPasswordUnauthorized: (request: Request) => null`

##### [`PATCH /forgotPassword`](./routes/paths/forgotPassword/patch.@.js)

Use emailed single-use secret to finalize password reset.

- `request.controller.user.resetPasswordUnauthorizedFinalize: (request: Request) => { cookie?: String } | undefined`

##### [`GET /self/logout`](./routes/paths/self/logout/get.@.js)

Mark current cookie session as invalid.

- `request.controller.session.logout: (request: Request) => { cookie: String }`

##### [`POST /sessions`](./routes/paths/sessions/post.@.js)

Provide login information to create a new session.

- `request.controller.session.create: (request: Request) => { cookie: String, auth?: { href: String, meta: { expires: String } }`

##### [`GET /self/sessions`](./routes/paths/self/sessions/get.@.js)

Retrieve a list of the logged-in user's sessions.

- `request.controller.session.list: (request: Request) => { sessions: Array<Session> }`

##### [`DELETE /self/sessions/{sessionId}`](./routes/paths/self/sessions/{sessionId}/delete.@.js)

Mark specific cookie session as invalid.

- `request.controller.session.remove: (request: Request) => null`

##### [`PATCH /self/sessions/{sessionId}`](./routes/paths/self/sessions/{sessionId}/patch.@.js)

Finalize login flow when 2FA is enabled.

- `request.controller.session.finalize: (request: Request) => null`
