import { user as userTag } from '../../../../tags.$.js'

export const summary = 'Fetch a single user.'

export const description = `
Here is a longer text about the specific method, instead of the whole
path. It can use \`markdown\` of course.
`

export const tags = [
	userTag.name,
	// You can also just do strings, like this, and it'll get verified on build:
	'demo'
]

export const parameters = [
	{
		name: 'include',
		in: 'query',
		schema: {
			type: 'string',
			enum: [
				'tasks'
			]
		}
	}
]

export const security = [
	// $NAME uses the securitySchemas/$NAME.security.js
	{ cookie: [] }
]

export const responses = {
	200: {
		description: 'The fetched user.',
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						data: {
							$ref: '#/components/schemas/user'
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
	console.log(`User ID: ${request.params.userId}`)
	const body = {
		data: {
			id: request.params.userId,
			type: 'user',
			attributes: {
				completed: false
			},
			links: {
				self: `http://localhost:3000/api/v1/users/${request.params.userId}`
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
