import { post } from 'httpie'
import { mongodb } from '@saibotsivad/mongodb'

// A small shim to make `httpie` behave closer to `fetch`, see
// https://github.com/saibotsivad/mongodb/blob/main/demo.js#L4
const postFetchShim = response => ({
	status: response.statusCode,
	headers: response.headers,
	json: async () => {
		if (typeof response.data === 'string' && response.data.startsWith('{')) return JSON.parse(response.data)
		return response.data
	},
	text: async () => response.data,
})

export const mongodbDataApi = configuration => mongodb({
	...(configuration || {}),
	fetch: async (url, parameters) => post(url, parameters).then(postFetchShim, postFetchShim),
})
