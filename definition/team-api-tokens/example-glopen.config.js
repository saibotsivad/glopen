import { shared } from '@saibotsivad/glopen-definition-shared'
import { teams } from '@saibotsivad/glopen-definition-teams'
import { teamApiTokens } from '@saibotsivad/glopen-definition-team-api-tokens'
export default {
    merge: [
        ...shared(),
        ...teams({
            api: '/api/v1' // optional
        }),
        ...teamApiTokens({
            api: '/api/v1' // optional
        }),
    ],
}
