export const description = `
	Session-based authentication, typically browser based, which requires the user to
	authenticate using the \`POST /sessions\` route, and finalize with 2FA, if enabled.
`
export const type = 'apiKey'
export const name = 'SESSION'

const xin = 'cookie'
export { xin as in }

export default req => {
	//
}
