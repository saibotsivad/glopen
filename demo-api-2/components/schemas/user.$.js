export default {
	type: 'object',
	properties: {
		id: {
			type: 'string',
		},
		type: {
			type: 'string',
			enum: [ 'user' ]
		},
		meta: {
			$ref: '#/components/schemas/meta'
		},
		attributes: {
			type: 'object'
		}
	}
}
