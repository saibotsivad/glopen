import { formatException } from 'openapi-exception-formatter'

// TODO make this actually behave like the README says
export const responseWrapper = ({ handler, log }) => async (req, res) => {
	const start = new Date().getTime()
	let result
	try {
		result = await handler(req)
	} catch (error) {
		const formatted = formatException(error, true)
		result = {
			status: formatted.status,
			body: {
				errors: [ formatted ],
			},
		}
	}
	let { status, body, headers } = (result || {})
	if (!headers) headers = {}
	if (!status) status = body ? 200 : 204
	if (typeof body === 'object') {
		body = JSON.stringify(body)
		// TODO make case insensitive
		headers['Content-Type'] = 'application/json'
	}
	if (log) {
		const end = new Date().getTime()
		log({ request: req, status, headers, body, timing: { start, end, diff: end - start } })
	}
	res.writeHead(status, headers)
	res.end(body)
}
