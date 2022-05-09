import { post } from '../src/httpie.js'

export default ({ test, assert, isStatus, apiUrl, state }) => {
	test('create the user', async () => {
		const response = await post(apiUrl + '/users', {
			body: {
				data: {
					type: 'user',
					attributes: {
						name: 'Jacob Marly',
						email: 'me@site.com',
					},
				},
			},
		})
		isStatus(response, 201, 'user was created')
		const data = response.data?.data || {}
		assert.ok(data?.id)
		assert.equal(data?.type, 'user')
		assert.equal(data?.attributes?.name, 'Jacob Marly')
		assert.equal(data?.attributes?.email, 'me@site.com')
		const created = data?.meta?.created
		assert.ok(created)
		assert.not.ok(Number.isNaN(new Date(created).valueOf()))
	})
}
