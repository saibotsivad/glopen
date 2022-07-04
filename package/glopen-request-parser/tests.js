import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { coreRequestParser, routerRequestParser } from './index.js'

test('just making sure tests run', () => {
	assert.type(routerRequestParser, 'function')
	assert.type(coreRequestParser, 'function')
})

class MockHeaders {
	constructor(mock) {
		this.map = {}
		for (const key in mock) this.map[key.toLowerCase()] = mock[key]
	}
	get(key) { return this.map[key.toLowerCase()] }
}

test('really simple request parsing with a cookie, header, path, and query param', async () => {
	const openapi = await coreRequestParser({
		definition: {
			paths: {
				'/users/{id}': {
					parameters: [
						{
							in: 'cookie',
							name: 'SESSID',
						},
						{
							in: 'header',
							name: 'X-App-ID',
						},
						{
							in: 'path',
							name: 'id',
						},
						{
							in: 'query',
							name: 'sort',
						},
					],
				},
			},
		},
		pathPatternKey: 'my_pattern',
		pathParametersKey: 'my_params',
		request: {
			method: 'GET',
			url: '/?sort=created',
			headers: new MockHeaders({
				'x-APP-id': 'app123',
				Cookie: 'SESSID=abc; CSRF=def; httpOnly'
			}),
			my_pattern: '/users/{id}',
			my_params: { id: '123' },
		},
	})
	assert.equal(openapi.cookie, { SESSID: 'abc' })
	assert.equal(openapi.header, { 'x-app-id': 'app123' })
	assert.equal(openapi.path.id, '123')
	assert.equal(openapi.query, { sort: 'created' })
})

// test('another simple request but the path is defined as a number so there is casting involved', async () => {
// 	const openapi = await coreRequestParser({
// 		definition: {
// 			paths: {
// 				'/users/{id}': {
// 					parameters: [
// 						{
// 							in: 'path',
// 							name: 'id',
// 							schema: {
// 								type: 'number',
// 							},
// 						},
// 					],
// 				},
// 			},
// 		},
// 		pathPatternKey: 'my_pattern',
// 		pathParametersKey: 'my_params',
// 		request: {
// 			method: 'GET',
// 			my_pattern: '/users/{id}',
// 			my_params: { id: '123' },
// 		},
// 	})
// 	assert.equal(openapi.path.id, 123)
// })

test.run()
