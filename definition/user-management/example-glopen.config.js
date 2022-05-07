import { shared } from '@saibotsivad/glopen-definition-shared'
import { singleUser } from '@saibotsivad/glopen-definition-single-user'
import { userManagement } from '@saibotsivad/glopen-definition-user-management'
export default {
    merge: [
        ...shared(),
        ...singleUser({
            api: '/api/v1' // optional
        }),
        ...userManagement({
            api: '/api/v1' // optional
        }),
    ],
}
