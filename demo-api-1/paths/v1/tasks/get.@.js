import { task as taskTag } from '../../../tags.@.js'

export const summary = 'Fetch a list of tasks.'

export const tags = [
	taskTag.name,
	// or you could just do strings, e.g. `"task"`, and it'll get verified on build
]

export const security = [
	// $NAME uses the securitySchemas/$NAME.security.js
	{ cookie: [] },
]

export const responses = {
	200: {
		description: 'The fetched tasks.',
		// maybe something like `$openApiJsonList: 'task'` as a shortcut?
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						data: {
							type: 'array',
							items: {
								$ref: '#/components/schemas/task',
							},
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

export default async (request, response) => {
	console.log('Fetching task list')
	const { mockTaskListBody } = await import('./mock-task-list-body.js')

	if (request.openapi) {
		// The advanced example includes a home-built wrapper that maps returned
		// objects to their proper response.
		return {
			status: 200,
			json: true,
			body: mockTaskListBody,
		}
	} else {
		// For the simple example, it's the responsibility of the route handler
		// to set headers, etc.
		response.setHeader('Content-Type', 'application/json')
		response.end(JSON.stringify(mockTaskListBody))
	}
}
