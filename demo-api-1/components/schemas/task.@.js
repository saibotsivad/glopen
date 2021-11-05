export default {
	type: 'object',
	properties: {
		id: {
			type: 'string',
		},
		type: {
			type: 'string',
			enum: [ 'task' ],
		},
		meta: {
			$ref: '#/components/schemas/meta',
		},
		attributes: {
			type: 'object',
		},
	},
}
