import { shared } from '@saibotsivad/glopen-definition-shared'
import { userSession } from '@saibotsivad/glopen-definition-user-session'
import { userSessions } from '@saibotsivad/glopen-definition-user-sessions'
export default {
    merge: [
        ...shared(),
        ...userSession(),
        ...userSessions({
            api: '/api/v1' // optional
        })
    ],
}
