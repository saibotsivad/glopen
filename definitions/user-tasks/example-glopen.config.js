import { shared } from '@saibotsivad/glopen-definitions-shared'
import { userTasks } from '@saibotsivad/glopen-definitions-user-tasks'
export default {
	merge: [
		...shared(),
		...userTasks({
			api: '/api/v1' // optional
		})
	],
}
