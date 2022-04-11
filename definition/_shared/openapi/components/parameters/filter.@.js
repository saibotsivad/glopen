export default {
	description: 'Filter the list by some parameters, e.g. `filter[attributes.status]=ok`.',
	name: 'filter',
	in: 'query',
	// https://stackoverflow.com/questions/57808396/how-do-i-express-json-api-sparse-fieldsets-with-openapi-3-0
	style: 'deepObject',
	allowReserved: true,
	schema: {
		type: 'object',
		additionalProperties: {
			type: 'string',
		},
	},
	example: {
		'attributes.status': 'ok',
	},
}
