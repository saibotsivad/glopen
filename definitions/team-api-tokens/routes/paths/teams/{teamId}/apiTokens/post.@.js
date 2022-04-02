export const summary = 'Create Team API Token'

export const description = `
Create an API token for the specified team. This will generate a named token, which
can be used for programmatic access to API endpoints.
`

export const tags = [ 'teamApiTokens' ]

export const requestBody = {
	description: 'Create an API token for use by a team.',
	content: {
		'application/json': {
			schema: {
				$ref: '#/components/schemas/apiToken',
			},
		},
	},
}

export const parameters = [
	{ $ref: '#/components/parameters/teamId' },
]

export { default, security, responses } from '../../../../../../user-api-tokens/routes/paths/self/apiTokens/post.@.js'
