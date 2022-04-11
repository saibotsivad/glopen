import { shared } from '@saibotsivad/glopen-definitions-shared'
import { userApiTokens } from '@saibotsivad/glopen-definitions-user-api-tokens'
export default {
	merge: [
		...shared(),
		...userApiTokens({
			api: '/api/v1' // optional
		})
	],
}
