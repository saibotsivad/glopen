import { openapiRequestSecurity } from 'openapi-request-security'

// TODO need to add these to the definition/controllers etc
// const securities = {
// 	api_key: async ({ request, scopes }) => {
// 		if (!request.headers.authentication.includes('battery-horse-staple')) {
// 			// To cause a failure, the function needs to throw.
// 			throw new Error('API token did not have super secret password!')
// 		}
// 	},
// }

export const security = ({ definition, securities }) => {
	const secure = openapiRequestSecurity({ definition, securities })
	return (request, response, next) => {
		// TODO get path from request.???
		// secure({ request, path: '/pets/{petId}' })
		// 	.then(() => {
		// 		next()
		// 	})
		// 	.catch(error => {
		// 		if (error.name === 'RequestNotSecured') {
		// 			// the request did not pass any of the Security Requirement definitions
		// 		}
		// 	})
		next()
	}
}
