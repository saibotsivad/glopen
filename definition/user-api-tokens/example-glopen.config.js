import { shared } from '@saibotsivad/glopen-definition-shared'
import { userApiTokens } from '@saibotsivad/glopen-definition-user-api-tokens'
export default {
    merge: [
        ...shared(),
        ...userApiTokens({
            api: '/api/v1' // optional
        })
    ],
}
