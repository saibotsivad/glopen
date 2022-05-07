import { shared } from '@saibotsivad/glopen-definition-shared'
import { singleUser } from '@saibotsivad/glopen-definition-single-user'
import { teams } from '@saibotsivad/glopen-definition-teams'
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
