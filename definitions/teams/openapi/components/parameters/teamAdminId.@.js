export default {
	description: 'The identifier of the `user` who is related to a specific team as an admin.',
	name: 'teamAdminId',
	in: 'path',
	required: true,
	schema: {
		type: 'string',
	},
}
