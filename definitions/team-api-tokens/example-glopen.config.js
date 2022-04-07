import { shared } from '@saibotsivad/glopen-definitions-shared'
import { teams } from '@saibotsivad/glopen-definitions-teams'
import { teamApiTokens } from '@saibotsivad/glopen-definitions-team-api-tokens'
export default {
	merge: [
		...shared(),
		...teams({
			api: '/api/v1' // optional
		}),
		...teamApiTokens({
			api: '/api/v1' // optional
		}),
	],
}
