import { shared } from '@saibotsivad/glopen-definition-shared'
import { userTasks } from '@saibotsivad/glopen-definition-user-tasks'
export default {
    merge: [
        ...shared(),
        ...userTasks({
            api: '/api/v1' // optional
        })
    ],
}
