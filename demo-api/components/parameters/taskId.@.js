export default {
	name: 'taskId',
	in: 'path',
	required: true,
	description: 'The `taskId` is a global parameter, whereas the `userId` is path specific.',
	schema: {
		type: 'string',
	}
}
