export default {
	description: 'Create a new user.',
	content: {
		'application/json': {
			schema: {
				type: 'object',
				properties: {
					data: {
						type: 'object',
						properties: {
							$ref: '#/components/schemas/user',
						},
					},
				},
			},
		},
	},
}
