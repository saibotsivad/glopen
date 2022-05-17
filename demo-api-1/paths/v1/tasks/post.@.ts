import { task as taskTag } from '../../../tags.@.js'

export const summary = 'Create a task.'

export const tags = [
	taskTag.name,
]

export const security = [
	// $NAME uses the securitySchemas/$NAME.security.js
	{ cookie: [] },
]

export const responses = {
	200: {
		description: 'The created task.',
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						data: {
							$ref: '#/components/schemas/task',
						},
					},
				},
			},
		},
	},
	default: {
		$ref: '#/components/responses/error',
	},
}

export const requestBody = {
	description: 'The task to create.',
	content: {
		'application/json': {
			schema: {
				type: 'object',
				properties: {
					data: {
						$ref: '#/components/schemas/task',
					},
				},
			},
		},
	},
}

export default async request => {
	// We're just demoing the validation technique shown in the advanced example.
	// Try POSTing a task with the 'type' as something other than 'task'.
	request.body.data.id = Math.random().toString().split('.').pop()
	return {
		status: 201,
		json: true,
		body: request.body,
	}
}
