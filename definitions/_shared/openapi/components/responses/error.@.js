export default {
	description: 'A list of one or more errors from the server.',
	content: {
		'application/json': {
			schema: {
				$ref: '#/components/schemas/errorBody',
			},
		},
	},
}
