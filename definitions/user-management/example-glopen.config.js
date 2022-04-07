import { shared } from '@saibotsivad/glopen-definitions-shared'
import { userManagement } from '@saibotsivad/glopen-definitions-user-management'
export default {
	merge: [
		...shared(),
		...userManagement({
			api: '/api/v1' // optional
		})
	],
}
