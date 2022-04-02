export default {
	type: 'object',
	properties: {
		id: {
			type: 'string',
		},
		type: {
			type: 'string',
			enum: [ 'user' ],
		},
		meta: {
			$ref: '#/components/schemas/meta',
		},
		attributes: {
			type: 'object',
			properties: {
				email: {
					description: 'The email address of the user.',
					type: 'string',
				},
				emailSecret: {
					description: 'The hashed and salted secret sent in the verification email as part of the link. This property **must not** be returned on any API calls. Can be removed after verification is completed.',
					type: 'string',
				},
				verificationExpires: {
					description: 'The ISO-8601 date+time after which the emailed verification link should be considered invalid, and a new secret generated and email sent. Can be removed after verification is completed.',
					type: 'string',
					format: 'date-time',
				},
				verified: {
					description: 'The date+time that the email address was verified, e.g. the user clicked an emailed link to verify ownership of that address.',
					type: 'string',
					format: 'date-time',
				},
				password: {
					description: 'The hashed and salted password, used to authenticate login requests. This property **must not** be returned on any API calls.\n\nNote that there is no universal standard, but most tooling will understand the format `$algorithm$parameters$salt$output`',
					type: 'string',
				},
				otpSecret: {
					description: 'The OTP secret used if 2FA is enabled. A suggested storage approach is to use the users password as a symmetric encryption key, which would require it once on initial login and once on OTP confirmation. Look at OWASP for guidelines on how to store this secret: https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html',
					type: 'string',
				},
				name: {
					description: 'The name used in website and email display areas. Can be a full given name, username, or similar.',
					type: 'string',
				},
			},
		},
	},
}
