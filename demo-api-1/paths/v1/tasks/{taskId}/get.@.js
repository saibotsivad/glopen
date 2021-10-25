import { task as taskTag } from '../../../../tags.@.js'

export const summary = 'Fetch a single task.'

export const description = `
Here is a longer text about the specific method, instead of the whole
path. It can use \`markdown\` of course.
`

export const tags = [
	taskTag.name
	// or you could just do strings, e.g. `"task"`, and it'll get verified on build
]

export const security = [
	// $NAME uses the securitySchemas/$NAME.security.js
	{ cookie: [] }
]

export const responses = {
	200: {
		description: 'The fetched task.',
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						data: {
							$ref: '#/components/schemas/task'
						}
					}
				}
			}
		}
	},
	default: {
		$ref: '#/components/responses/error'
	}
}

export default async (request, response) => {
	console.log(`Task ID: ${request.params.taskId}`)
	const body = {
		data: {
			id: request.params.taskId,
			type: 'task',
			attributes: {
				completed: false
			},
			links: {
				self: `http://localhost:3000/api/v1/tasks/${request.params.taskId}`
			}
		}
	}
	if (request.openapi) {
		// The advanced example includes a home-built wrapper that maps returned
		// objects to their proper response.
		return {
			status: 200,
			json: true,
			body
		}
	} else {
		// For the simple example, it's the responsibility of the route handler
		// to set headers, etc.
		response.setHeader('Content-Type', 'application/json')
		response.end(JSON.stringify(body))
	}
}
