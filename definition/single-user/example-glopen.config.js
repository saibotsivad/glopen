import { shared } from '@saibotsivad/glopen-definitions-shared'
import { singleUser } from '@saibotsivad/glopen-definitions-single-user'
export default {
	merge: [
		...shared(),
		...singleUser({
			api: '/api/v1' // optional
		})
	],
}
