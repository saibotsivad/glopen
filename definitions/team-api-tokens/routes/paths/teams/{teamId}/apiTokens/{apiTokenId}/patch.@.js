/*DOCS

Sparse update to an API token owned by the team, if the requesting user is a member.

The token secret is generated by the server, and is returned as a separate property, visible only one time on this response.

- `request.controller.apiToken.sparseUpdate: (request: Request) => { apiToken: ApiToken, secret: String }`

DOCS*/

export const summary = 'Update Team API Token'

export const description = `
This endpoint allows a user to update a team API token secret, if they are a member of
that team, either by requesting a new token, or updating the name, roles, or expiration date.

When the token secret is rotated, the user is not allowed to set the new secret, that
is handled by the backend.
`

export const tags = ['teamApiTokens']

export const parameters = [
	{ $ref: '#/components/parameters/teamId' },
	{ $ref: '#/components/parameters/apiTokenId' },
]

export { default, security, requestBody, responses } from '../../../../../../../user-api-tokens/routes/paths/self/apiTokens/{apiTokenId}/patch.@.js'
