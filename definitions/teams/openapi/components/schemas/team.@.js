export default {
	type: 'object',
	properties: {
		id: {
			type: 'string',
		},
		type: {
			type: 'string',
			enum: [ 'team' ],
		},
		meta: {
			$ref: '#/components/schemas/meta',
		},
		attributes: {
			type: 'object',
			properties: {
				name: {
					description: 'The human-readable name of the team.',
					type: 'string',
				},
			},
		},
		relationships: {
			description: 'The possible JSON:API relationships for the team resource.',
			type: 'object',
			properties: {
				admins: {
					description: 'Admins of a team are able to rename, as well as add or remove other members.',
					type: 'array',
					items: {
						$ref: '#/components/schemas/userRelationship',
					},
				},
			},
		},
	},
}
