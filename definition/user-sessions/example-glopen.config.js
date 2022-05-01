import { shared } from '@saibotsivad/glopen-definitions-shared'
import { userSession } from '@saibotsivad/glopen-definitions-user-session'
import { userSessions } from '@saibotsivad/glopen-definitions-user-sessions'
export default {
	merge: [
		...shared(),
		...userSession(),
		...userSessions({
			api: '/api/v1' // optional
		})
	],
}
