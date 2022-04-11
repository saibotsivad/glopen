import { shared } from '@saibotsivad/glopen-definitions-shared'
import { userSessions } from '@saibotsivad/glopen-definitions-user-sessions'
export default {
	merge: [
		...shared(),
		...userSessions({
			api: '/api/v1' // optional
		})
	],
}
