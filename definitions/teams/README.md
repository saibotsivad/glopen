# Teams

These routes manage teams, which are things allowing shared ownership of some resources.

To use in `glopen` you **must** include [single-user](../single-user/README.md) *first*.

To use in `glopen` (see [example config file](./example-glopen.config.js)):

```js
// glopen.config.js
import { shared } from '@saibotsivad/glopen-definitions-shared'
import { singleUser } from '@saibotsivad/glopen-definitions-single-user'
import { teams } from '@saibotsivad/glopen-definitions-teams'
export default {
	merge: [
		...shared(),
		...singleUser({
			api: '/api/v1' // optional
		}),
		...teams({
			api: '/api/v1' // optional
		}),
	],
}
```

The OpenAPI parts are:

- [`parameters: teamAdminId`](./openapi/components/parameters/teamAdminId.@.js)
- [`parameters: teamId`](./openapi/components/parameters/teamId.@.js)
- [`schemas: team`](./openapi/components/schemas/team.@.js)
- [`schemas: teamRelationship`](./openapi/components/schemas/teamRelationship.@.js)
- [`schemas: user`](./openapi/components/schemas/user.@.js)
- [shared components](../_shared/README.md)

The routes are:

#### [`GET /teams`](openapi/paths/teams/get.@.js)

Fetch the list of teams the requesting user is allowed to see.

- `request.controller.team.list: (request: Request) => { teams: Array<Team> }`

#### [`POST /teams`](openapi/paths/teams/post.@.js)

Create a new team. The requesting must be made an admin of the created team, but other users could be added at creation as well.

- `request.controller.team.create: (request: Request) => { team: Team }`

#### [`GET /teams/{teamId}`](openapi/paths/teams/{teamId}/get.@.js)

Fetch a single team, if the requesting user is allowed to see it.

- `request.controller.team.get: (request: Request) => { team: Team }`

#### [`PATCH /teams/{teamId}`](openapi/paths/teams/{teamId}/patch.@.js)

Sparse update to a team, if the requesting user is an admin of the team.

- `request.controller.team.sparseUpdate: (request: Request) => { team: Team }`

#### [`DELETE /teams/{teamId}/relationships/admins`](openapi/paths/teams/{teamId}/relationships/admins/delete.@.js)

Remove one or more admins from a team, if the requesting user is an admin.

- `request.controller.team.removeAdmins: (request: Request) => { admins: Array<UserRelationship> }`

#### [`POST /teams/{teamId}/relationships/admins`](openapi/paths/teams/{teamId}/relationships/admins/post.@.js)

Add one or more admins to the team, if the requesting user also is an admin.

- `await request.controller.team.addAdmins: (request: Request) => { admins: Array<UserRelationship> }`

#### [`DELETE /users/{userId}/relationships/teams`](openapi/paths/users/{userId}/relationships/teams/delete.@.js)

Remove a user as a member of one or more team, if the requesting user is an admin of those teams.

- `request.controller.user.removeTeamMemberships: (request: Request) => { teams: Array<TeamRelationship> }`

#### [`POST /users/{userId}/relationships/teams`](openapi/paths/users/{userId}/relationships/teams/post.@.js)

Add a user as a member of one or more teams, if the requesting user is an admin of those teams.

- `await request.controller.user.addTeamMemberships: (request: Request) => { teams: Array<TeamRelationship> }`
