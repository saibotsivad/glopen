import { send } from 'httpie'

function wrap(method, uri, opts = {}) {
	return send(method, uri, opts)
		.then(
			success => success,
			error => error
		)
}

export const get = wrap.bind(null, 'GET')
export const post = wrap.bind(null, 'POST')
export const patch = wrap.bind(null, 'PATCH')
export const del = wrap.bind(null, 'DELETE')
export const put = wrap.bind(null, 'PUT')
