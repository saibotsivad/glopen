import { shared } from '@saibotsivad/glopen-definitions-shared'
import { singleUser } from '@saibotsivad/glopen-definitions-single-user'
import { teams } from '@saibotsivad/glopen-definitions-teams'
export default {
	merge: [
		...shared(),
		...singleUser({
			api: '/api/v1' // optional
		}),
		...teams({
			api: '/api/v1' // optional
		}),
	],
}
