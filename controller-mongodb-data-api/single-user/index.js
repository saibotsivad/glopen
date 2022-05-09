import { BadRequest } from '@saibotsivad/glopen-controller-shared/exceptions'

export const create = async request => {
	const { email, name } = request.body?.data?.attributes || {}
	if (!email) throw new BadRequest('Must set an email on the request body.')
	const user = {
		type: 'user',
		attributes: { email, name },
		meta: {
			created: new Date().toISOString(),
		},
	}
	const { insertedId } = await request.service.database.insertOne({ document: user })
	user.id = insertedId
	const response = { user }
	if (request.configuration?.controller?.user?.create?.setCookie) {
		// TODO
		response.cookie = 'create and save, this string will be the header'
	}
	return response
}

export const getSelf = async request => {
	const userId = request.TODO
	return {
		user: await request.service.database.getById(userId),
	}
}

export const sparseUpdate = async request => {
	return { user: {} }
}
