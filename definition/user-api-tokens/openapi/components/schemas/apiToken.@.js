export default {
	// TODO when adding the account/team API token routes, need to update description
	description: 'A token used for programmatic access to the API. Tokens can be owned and managed by individual users.',
	type: 'object',
	properties: {
		id: {
			type: 'string',
		},
		type: {
			type: 'string',
			enum: [ 'apiToken' ],
		},
		meta: {
			$ref: '#/components/schemas/meta',
		},
		attributes: {
			type: 'object',
			properties: {
				secret: {
					description: `
The hashed and salted secret, used to authenticate the API requests. This
property **must not** be returned on any API calls, instead the plaintext
original secret is **only** returned on the \`meta\` property of the overall
request, either during the \`POST\` to create it, or the \`PATCH\` to update
it, when the update requests the secret to be rotated.

Note that there is no universal standard for the format, but most tooling
will understand the format \`$algorithm$parameters$salt$output\`.`,
					type: 'string',
				},
				name: {
					description: 'The name used in website display areas and audit logs.',
					type: 'string',
				},
				roles: {
					description: 'Roles granted to this API token.',
					type: 'array',
					items: {
						type: 'string',
					},
				},
				expiration: {
					description: 'The optional date+time after which this API token should not be considered valid.',
					type: 'string',
					format: 'date-time',
				},
			},
		},
		relationships: {
			type: 'object',
			properties: {
				user: {
					description: 'The JSON:API "relationship" pointing to the user who owns the token.',
					type: 'object',
					properties: {
						data: {
							type: 'object',
							properties: {
								id: {
									description: 'The identifier of the user owning the token.',
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
			},
		},
	},
}
