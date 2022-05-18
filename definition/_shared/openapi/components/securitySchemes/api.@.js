export const description = `
	Token based access, usually used for programmatic access by other services
	or tooling. Requires the user to create an API token and assign it roles.
`
export const type = 'apiKey'
export const name = 'x-api-key'

const xin = 'header'
export { xin as in }

export default req => {
	//
}
