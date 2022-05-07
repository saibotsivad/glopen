import { shared } from '@saibotsivad/glopen-definition-shared'
import { teamTasks } from '@saibotsivad/glopen-definition-team-tasks'
export default {
    merge: [
        ...shared(),
        ...teamTasks({
            api: '/api/v1' // optional
        })
    ],
}
