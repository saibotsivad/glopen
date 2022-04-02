export default {
	description: 'A task grouping definition.',
	type: 'object',
	properties: {
		id: {
			type: 'string',
		},
		type: {
			type: 'string',
			enum: [ 'taskGroup' ],
		},
		meta: {
			$ref: '#/components/schemas/meta',
		},
		attributes: {
			type: 'object',
			properties: {
				name: {
					description: 'The human-readable name of the task grouping.',
					type: 'string',
				},
			},
		},
		relationships: {
			type: 'object',
			properties: {
				user: {
					description: 'The JSON:API "relationship" pointing to the user who owns the task group.',
					type: 'object',
					properties: {
						data: {
							type: 'object',
							properties: {
								id: {
									description: 'The identifier of the user owning the task group.',
									type: 'string',
								},
								type: {
									description: 'The resource type, aka `user`.',
									type: 'string',
									enum: [ 'user' ],
								},
							},
						},
					},
				},
			},
		},
	},
}
