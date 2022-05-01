import { shared } from '@saibotsivad/glopen-definitions-shared'
import { userSession } from '@saibotsivad/glopen-definitions-user-session'
export default {
	merge: [
		...shared(),
		...userSession({
			api: '/api/v1' // optional
		})
	],
}
