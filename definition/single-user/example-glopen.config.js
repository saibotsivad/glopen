import { shared } from '@saibotsivad/glopen-definition-shared'
import { singleUser } from '@saibotsivad/glopen-definition-single-user'
export default {
    merge: [
        ...shared(),
        ...singleUser({
            api: '/api/v1' // optional
        })
    ],
}
