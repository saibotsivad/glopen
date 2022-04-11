export default {
	description: 'A task, owned by a single user, which can be part of a user-defined grouping, and can be transferred to another user.',
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
			properties: {
				name: {
					description: 'An optional short name for the task.',
					type: 'string',
				},
				detail: {
					description: 'The task specifics, aka the human-readable task details.',
					type: 'string',
				},
				completed: {
					description: 'The date+time that the task was marked as completed.',
					type: 'string',
					format: 'date-time',
				},
			},
		},
		relationships: {
			type: 'object',
			properties: {
				user: {
					description: 'The JSON:API "relationship" pointing to the user who owns the task.',
					type: 'object',
					properties: {
						data: {
							type: 'object',
							properties: {
								id: {
									description: 'The identifier of the user owning the task.',
									type: 'string',
								},
								type: {
									description: 'The resource type, aka `user`.',
									type: 'string',
									enum: [ 'user' ],
								},
							},
						},
					},
				},
				taskGroup: {
					description: 'The JSON:API "relationship" pointing to the group that the task is part of.',
					type: 'object',
					properties: {
						data: {
							type: 'object',
							properties: {
								id: {
									description: 'The identifier of the users task group.',
									type: 'string',
								},
								type: {
									description: 'The resource type, aka `taskGroup`.',
									type: 'string',
									enum: [ 'taskGroup' ],
								},
							},
						},
					},
				},
			},
		},
	},
}
