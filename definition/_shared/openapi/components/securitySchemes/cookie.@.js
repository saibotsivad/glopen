export default {
	description: `
Session-based authentication, typically browser based, which requires the user to
authenticate using the \`POST /sessions\` route, and 2FA if enabled.
	`,
	type: 'apiKey',
	name: 'SESSION',
	in: 'cookie',
}
