import { shared } from '@saibotsivad/glopen-definition-shared'
import { userSession } from '@saibotsivad/glopen-definition-user-session'
export default {
    merge: [
        ...shared(),
        ...userSession({
            api: '/api/v1' // optional
        })
    ],
}
