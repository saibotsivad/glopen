import { shared } from '@saibotsivad/glopen-definitions-shared'
import { teamTasks } from '@saibotsivad/glopen-definitions-team-tasks'
export default {
	merge: [
		...shared(),
		...teamTasks({
			api: '/api/v1' // optional
		})
	],
}
