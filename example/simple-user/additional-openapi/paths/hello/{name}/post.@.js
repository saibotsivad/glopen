export const summary = 'Ping Pong'

export const parameters = [
	{ $ref: '#/components/parameters/name' },
]

export default async request => {
	return {
		status: 200,
		body: { pong: await request.json() },
	}
}
