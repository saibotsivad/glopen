export const summary = 'Delete Team API Token'

export const description = 'Fully delete an API token owned by a team.'

export const tags = [ 'teamApiTokens' ]

export const parameters = [
	{ $ref: '#/components/parameters/teamId' },
	{ $ref: '#/components/parameters/apiTokenId' },
]

export { default, security, responses } from '../../../../../../../user-api-tokens/routes/paths/self/apiTokens/{apiTokenId}/delete.@.js'
