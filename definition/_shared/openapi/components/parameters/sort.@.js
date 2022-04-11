export default {
	description: 'Sort the list by some parameters, e.g. `sort=-meta.created`.',
	name: 'sort',
	in: 'query',
	allowReserved: true,
	schema: {
		type: 'string',
	},
}
