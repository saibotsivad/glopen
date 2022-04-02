export const summary = 'Get Non-Self User'

export const description = `
Fetch the user object for an identified user. The requesting user must have appropriate permissions.
`

export const tags = [ 'userManagement' ]

export const security = [
	{ cookie: [] },
	{ api: [] },
]

export const parameters = [
	{ $ref: '#/components/parameters/userId' },
]

export { responses } from '../../../../../single-user/routes/paths/self/get.@.js'

export default async request => {
	const { user } = await request.controller.user.get(request)
	return {
		status: 200,
		body: { data: user },
	}
}
