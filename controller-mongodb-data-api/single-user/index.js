export const getSelf = async request => {
	const userId = request.TODO
	return {
		user: await request.service.database.getById(userId),
	}
}

export const sparseUpdate = async request => {
	return { user: {} }
}

export const create = async request => {
	const body = request.TODO
	const user = await request.service.database.create(body)
	const cookie = 'create this, then this property will be the cookie header string'
	return { user, cookie }
}
