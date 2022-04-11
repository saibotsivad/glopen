// This is a JSON:API error object. Description text lifted from https://jsonapi.org/format/#error-objects
// which is made available under the CC0 1.0 Universal.

export default {
	type: 'object',
	properties: {
		id: {
			description: 'A unique identifier for this particular occurrence of the problem.',
			type: 'string',
		},
		links: {
			type: 'object',
			description: 'A "links" object.',
			properties: {
				about: {
					description: 'A link that leads to further details about this particular occurrence of the problem.',
					type: 'string',
				},
			},
		},
		status: {
			description: 'The HTTP status code applicable to this problem, expressed as a string value.',
			type: 'string',
		},
		code: {
			description: 'An application-specific error code, expressed as a string value.',
			type: 'string',
		},
		title: {
			description: 'The short, human-readable summary of the problem that SHOULD NOT change from occurrence to occurrence of the problem, except for purposes of localization.',
			type: 'string',
		},
		detail: {
			description: 'A human-readable explanation specific to this occurrence of the problem. Like title, this field’s value can be localized.',
			type: 'string',
		},
		source: {
			description: 'An object containing references to the source of the error.',
			type: 'object',
			properties: {
				pointer: {
					description: 'A JSON Pointer [RFC-6901](https://datatracker.ietf.org/doc/html/rfc6901) to the associated entity in the request document. E.g. "/data" for a primary data object, or "/data/attributes/title" for a specific attribute.',
					type: 'string',
				},
				parameter: {
					description: 'A string indicating which URI query parameter caused the error.',
					type: 'string',
				},
			},
		},
		meta: {
			description: 'A meta object containing non-standard meta-information about the error.',
			type: 'object',
		},
	},
}
