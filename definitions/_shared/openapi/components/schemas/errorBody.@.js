export default {
	description: 'The response body when the only thing returned is one or more errors.',
	type: 'object',
	properties: {
		errors: {
			type: 'array',
			items: {
				$ref: '#/components/schemas/error',
			},
		},
	},
}
