export default {
	type: 'object',
	properties: {
		created: {
			description: 'The ISO-8601 formatted date+time that the resource was originally created.',
			type: 'string',
			format: 'date-time',
		},
		updated: {
			description: 'The ISO-8601 formatted date+time that the resource was most recently updated.',
			type: 'string',
			format: 'date-time',
		},
	},
}
