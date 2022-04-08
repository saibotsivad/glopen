# User API Tokens

These routes manage tokens that are owned by a single user, as opposed to being owned by an organization or team.

To use in `glopen` (see [example config file](./example-glopen.config.js)):

```js
// glopen.config.js
import { shared } from '@saibotsivad/glopen-definitions-shared'
import { userApiTokens } from '@saibotsivad/glopen-definitions-user-api-tokens'
export default {
	merge: [
		...shared(),
		...userApiTokens({
			api: '/api/v1' // optional
		})
	],
}
```

The OpenAPI parts are:

- [`parameters: apiTokenId`](./openapi/components/parameters/apiTokenId.@.js)
- [`schemas: apiToken`](./openapi/components/schemas/apiToken.@.js)
- [`tag: userApiTokens`](./openapi/tags.@.js)
- [shared components](../_shared/README.md)

The routes are:

#### [`GET /self/apiTokens`](openapi/paths/self/apiTokens/get.@.js)

Fetch the list of API tokens owned by the requesting user.

- `request.controller.apiToken.list: (request: Request) => { apiTokens: Array<ApiTokens> }`

#### [`POST /self/apiTokens`](openapi/paths/self/apiTokens/post.@.js)

Create a new API token, which will be managed by the requesting user.

The token secret is generated by the server, and is returned as a separate property, visible only one time on this response.

- `request.controller.apiToken.create: (request: Request) => { apiToken: ApiToken, secret: String }`

#### [`DELETE /self/apiTokens/{apiTokenId}`](openapi/paths/self/apiTokens/{apiTokenId}/delete.@.js)

Delete an API token owned by the requesting user.

- `request.controller.apiToken.remove: (request: Request) => null`

#### [`PATCH /self/apiTokens/{apiTokenId}`](openapi/paths/self/apiTokens/{apiTokenId}/patch.@.js)

Sparse update to an API token owned by the requesting user.

The token secret is generated by the server, and is returned as a separate property, visible only one time on this response.

- `request.controller.apiToken.sparseUpdate: (request: Request) => { apiToken: ApiToken, secret: String }`