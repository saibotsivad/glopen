import user from '../../../../single-user/openapi/components/schemas/user.@.js'

user.properties.relationships = user.properties.relationships || {
	type: 'object',
	properties: {},
}

user.properties.relationships.properties.teams = {
	description: 'Teams that a user is a member of.',
	type: 'array',
	items: {
		type: 'object',
		properties: {
			id: {
				type: 'string',
			},
			type: {
				type: 'string',
				enum: [ 'team' ],
			},
		},
	},
}

export default user
