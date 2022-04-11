export default {
	description: `
Token based access, usually used for programmatic access by other services
or tooling. Requires the user to create an API token and assign it roles.
	`,
	type: 'apiKey',
	name: 'x-api-key',
	in: 'header',
}
