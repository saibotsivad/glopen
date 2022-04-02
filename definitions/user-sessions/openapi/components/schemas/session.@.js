export default {
	type: 'object',
	properties: {
		id: {
			type: 'string',
		},
		type: {
			type: 'string',
			enum: [ 'session' ],
		},
		meta: {
			$ref: '#/components/schemas/meta',
		},
		attributes: {
			type: 'object',
			properties: {
				status: {
					type: 'string',
					description: 'The status of the session. If the status is not `ok` requests made with this session token MUST NOT be treated as authenticated.',
					enum: [
						'wait', // When the session is initialized, but waiting for 2FA to complete. (Not always used.)
						'ok', // When the session is fully valid and approved.
						'revoked', // When the user has manually logged out of a session.
					],
				},
				secret: {
					type: 'string',
					description: 'The hashed and salted session password, used to authenticate every request.\n\nNote that there is no universal standard, but most tooling will understand the format `$algorithm$parameters$salt$output`',
				},
				otpExpiration: {
					type: 'string',
					format: 'date-time',
					description: 'The date+time after which 2FA completion requests MUST NOT be accepted. Only used if 2FA is enabled.',
				},
				ip: {
					type: 'string',
					description: 'The IP address used during session creation, if available.',
				},
				ua: {
					type: 'string',
					description: 'The User-Agent header used during session creation, if available.',
				},
				lat: {
					type: 'string',
					description: 'Latitude of the request creating the session, if available.',
				},
				long: {
					type: 'string',
					description: 'Longitude of the request creating the session, if available.',
				},
				region: {
					type: 'string',
					description: 'The [ISO-3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) code for the first-level region associated with the request creating the session, if available. E.g. `US-TX` for Texas.',
				},
			},
		},
	},
}
