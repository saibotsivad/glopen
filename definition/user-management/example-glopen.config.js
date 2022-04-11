import { shared } from '@saibotsivad/glopen-definitions-shared'
import { singleUser } from '@saibotsivad/glopen-definitions-single-user'
import { userManagement } from '@saibotsivad/glopen-definitions-user-management'
export default {
	merge: [
		...shared(),
		...singleUser({
			api: '/api/v1' // optional
		}),
		...userManagement({
			api: '/api/v1' // optional
		}),
	],
}
