export const summary = 'Get Team API Tokens'

export const description = `
Fetch the list of the team's API tokens, if the user is a member of that team.
`

export const tags = [ 'teamApiTokens' ]

import { parameters as _parameters } from '../../../../../../user-api-tokens/routes/paths/self/apiTokens/get.@.js'

export const parameters = [
	..._parameters,
	{ $ref: '#/components/parameters/teamId' },
]

export { default, security, responses } from '../../../../../../user-api-tokens/routes/paths/self/apiTokens/get.@.js'
