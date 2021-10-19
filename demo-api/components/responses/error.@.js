export default {
	description: 'Any formatted error from the server.',
	content: {
		'application/json': {
			schema: {
				type: 'object',
				properties: {
					error: {
						$ref: '#/components/schemas/error'
					}
				}
			}
		}
	}
}
