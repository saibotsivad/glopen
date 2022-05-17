export const summary = `Things about users.`

export const description = `
	This is a description of the path overall, the underscore path
	is the root one, so you can define common parameters in here
	instead of in the method or global.
`

export const parameters = [
	{
		name: 'userId',
		in: 'path',
		required: true,
		schema: {
			type: 'string',
		},
	},
]
