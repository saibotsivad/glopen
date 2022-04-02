export const summary = 'Update Non-Self User'

export const description = `
Sparse update of an identified user. The requesting user must have sufficient permissions
to update other users, and some properties are not allowed to be updated on this request,
for example \`attributes.verified\` and other security related properties.
`

export const tags = [ 'userManagement' ]

export const security = [
	{ cookie: [] },
	{ api: [] },
]

export const parameters = [
	{ $ref: '#/components/parameters/userId' },
]

export const requestBody = {
	description: 'Update the specific user.',
	content: {
		'application/json': {
			schema: {
				type: 'object',
				properties: {
					data: {
						$ref: '#/components/schemas/user',
					},
				},
			},
		},
	},
}

export { default, responses } from '../../../../../single-user/routes/paths/self/patch.@.js'
