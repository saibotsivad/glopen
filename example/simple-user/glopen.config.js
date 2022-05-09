import { shared } from '@saibotsivad/glopen-definition-shared'
import { singleUser } from '@saibotsivad/glopen-definition-single-user'
import { userSession } from '@saibotsivad/glopen-definition-user-session'
export default {
	merge: [
		...shared(),
		...singleUser(),
		...userSession(),
		{
			dir: './additional-openapi',
			ext: '@',
			api: '/',
		},
	],
	output: './build/generated.js',
}
