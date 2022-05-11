import { get, post } from '../src/httpie.js'

const assertUserIsValid = (assert, user) => {
	assert.ok(user?.id)
	assert.equal(user?.type, 'user')
	assert.equal(user?.attributes?.name, 'Jacob Marly')
	assert.equal(user?.attributes?.email, 'me@site.com')
	const created = user?.meta?.created
	assert.ok(created)
	assert.not.ok(Number.isNaN(new Date(created).valueOf()))
}

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
		const user = response.data?.data || {}
		assertUserIsValid(assert, user)
		state.userId = user.id
	})
	// test('get the user fails without cookie', async () => {
	// 	const response = await get(apiUrl + '/self')
	// 	isStatus(response, 201, 'user was created')
	// })
	test('get the user succeeds with cookie', async () => {
		const response = await get(apiUrl + '/self')
		isStatus(response, 200, 'user is returned')
		const user = response.data?.data || {}
		assertUserIsValid(assert, user)
		assert.equal(user.id, state.userId)
	})
}
