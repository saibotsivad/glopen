## User Sessions

These routes manage a users sessions, e.g. when they log in via the webapp.

To use in `glopen` (see [example config file](./example-glopen.config.js)):

```js
// glopen.config.js
import { shared } from '@saibotsivad/glopen-definitions-shared'
import { userSessions } from '@saibotsivad/glopen-definitions-user-sessions'
export default {
	merge: [
		...shared(),
		...userSessions({
			api: '/api/v1' // optional
		})
	],
}
```

The OpenAPI parts are:

- [`parameters: sessionId`](./openapi/components/parameters/sessionId.@.js)
- [`schemas: session`](./openapi/components/schemas/session.@.js)
- [`tag: userSessions`](./openapi/tags.@.js)
- [shared components](../_shared/README.md)

The routes are:

#### [`PATCH /forgotPassword`](openapi/paths/forgotPassword/patch.@.js)

Use emailed single-use secret to finalize password reset.

- `request.controller.user.resetPasswordUnauthorizedFinalize: (request: Request) => { cookie?: String } | undefined`

#### [`POST /forgotPassword`](openapi/paths/forgotPassword/post.@.js)

Initiate a password reset request via sending an email.

- `request.controller.user.resetPasswordUnauthorized: (request: Request) => null`

#### [`GET /self/logout`](openapi/paths/self/logout/get.@.js)

Mark current cookie session as invalid.

- `request.controller.session.logout: (request: Request) => { cookie: String }`

#### [`GET /self/sessions`](openapi/paths/self/sessions/get.@.js)

Retrieve a list of the logged-in user's sessions.

- `request.controller.session.list: (request: Request) => { sessions: Array<Session> }`

#### [`DELETE /self/sessions/{sessionId}`](openapi/paths/self/sessions/{sessionId}/delete.@.js)

Mark specific cookie session as invalid.

- `request.controller.session.remove: (request: Request) => null`

#### [`PATCH /self/sessions/{sessionId}`](openapi/paths/self/sessions/{sessionId}/patch.@.js)

Finalize login flow when 2FA is enabled.

- `request.controller.session.finalize: (request: Request) => null`

#### [`POST /sessions`](openapi/paths/sessions/post.@.js)

Provide login information to create a new session.

- `request.controller.session.create: (request: Request) => { cookie: String, auth?: { href: String, meta: { expires: String } }`
