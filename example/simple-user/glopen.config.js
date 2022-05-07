import { shared } from '@saibotsivad/glopen-definition-shared'
import { singleUser } from '@saibotsivad/glopen-definition-single-user'
import { userSession } from '@saibotsivad/glopen-definition-user-session'
export default {
    merge: [
        ...shared(),
        ...singleUser(),
        ...userSession(),
    ],
    output: './build/generated.js',
}
