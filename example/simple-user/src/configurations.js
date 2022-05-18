export const configurations = (req, res, next) => {
	req.configuration = {
		controller: {
			user: {
				create: {
					setCookie: true,
				},
			},
		},
		service: {
			database: {
				apiKey: process.env.MONGODB_API_KEY,
				apiUrl: `http://localhost:${process.env.MONGODB_API_PORT}`,
			},
		},
	}
	next()
}
