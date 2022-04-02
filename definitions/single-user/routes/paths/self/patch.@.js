export const summary = 'Update User'

export const description = `
Sparse update of the logged in users own \`user\` resource. Some properties are not allowed to be
updated on this request, for example \`attributes.verified\` and other security related properties.
`

export const tags = [ 'singleUser' ]

export const security = [
	{ cookie: [] },
	{ api: [] },
]

export const requestBody = {
	description: 'Update the currently logged in user.',
	content: {
		'application/json': {
			schema: {
				type: 'object',
				properties: {
					data: {
						$ref: '#/components/schemas/user',
					},
				},
			},
		},
	},
}

export const responses = {
	200: {
		description: 'The user was updated, and the final user object is returned.',
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						data: {
							$ref: '#/components/schemas/user',
						},
					},
				},
			},
		},
	},
	403: {
		description: 'The request contained properties which the user is not authorized to update, e.g. `attributes.verified` cannot be updated by the user.',
		content: {
			'application/json': {
				schema: {
					$ref: '#/components/schemas/errorBody',
				},
			},
		},
	},
	default: {
		$ref: '#/components/responses/error',
	},
}

export default async request => {
	const { user } = await request.controller.user.sparseUpdate(request)
	return {
		status: 200,
		body: { data: user },
	}
}
