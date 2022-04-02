# `Glopen-Routes` Available Definitions

Routes that fall under `/self/*` are for managing resources owned by the currently logged-in user. All other routes are meant to have access controlled by other role/permission configuration as your application requirements dictate.

## [Shared](./_shared/README.md) `export: shared`

Contains the OpenAPI components that are common to all definitions.

## Self-Owned Routes

### [Single User](./single-user/README.md) `export: singleUser`

Adds the ability to create a new user from an unsecured endpoint, and then fetch and update ones own user resource. *These routes do not provide session management.*

### [User Sessions](./user-sessions/README.md) `export: userSessions`

Adds the ability to create sessions via normal username+password login, routes for viewing and managing ones own sessions, and the normal "forgot my password" routes. Session creation also defines an optional 2FA flow.

### [User API Tokens](./user-api-tokens/README.md) `export: userApiTokens`

Adds the ability for a single user to create and manage API tokens which represent their own user when used. Tokens have an optional expiration date expired, so you can manage forced key rotation as your application requirements dictate.

### [User Tasks](./user-tasks/README.md) `export: userTasks`

Adds ability to create simple tasks (with names and long-form details) and task groupings that are owned and managed by a single user.

## Team Routes

### [Teams](./teams/README.md) `export: teams`

Adds the ability to create and edit teams, as well as assign or remove administrators from teams.

### [Team API Tokens](./team-api-tokens/README.md) `export: teamApiTokens`

Adds the ability for a team member to create and manage API tokens, which represent the team when used. Tokens have an optional expiration date expired, so you can manage forced key rotation as your application requirements dictate.

## Administrative Routes

### [User Management](./user-management/README.md) `export: userManagement`

Adds the ability to list and manage all users. Your application design will dictate role/permission requirements for these routes.

### [User Roles](./user-rules/README.md) `export: userRoles`

Adding roles is a complex security and design problem, so the user roles were extracted as their own opt-in schema modification to the main [single-user](./single-user/README.md) definitions.
