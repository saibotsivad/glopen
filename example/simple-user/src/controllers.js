import * as singleUserCtrl from '@saibotsivad/glopen-controller-mongodb-data-api-single-user'
import * as userSessionCtrl from '@saibotsivad/glopen-controller-mongodb-data-api-user-session'

export const controllers = (req, res, next) => {
	req.controller = {
		user: {
			...singleUserCtrl,
			// You wouldn't need to use this rest-spread method here, but
			// it does mean you could add another controller easily, e.g.
			// ...otherUserCtrls
		},
		// The simpler way, without rest-spread
		session: userSessionCtrl,
	}
	next()
}
