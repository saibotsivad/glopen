import { shared } from '@saibotsivad/glopen-definitions-shared'
import { teamApiTokens } from '@saibotsivad/glopen-definitions-team-api-tokens'
export default {
	merge: [
		...shared(),
		...teamApiTokens({
			api: '/api/v1' // optional
		})
	],
}
