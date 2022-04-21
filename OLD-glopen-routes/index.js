import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = join(dirname(fileURLToPath(import.meta.url)), 'definition')
const make = (name, options) => ([
	{
		dir: join(__dirname, name,'openapi'),
		ext: '@',
	},
	{
		dir: join(__dirname, name, 'routes'),
		ext: '@',
		api: options?.api,
	},
])

export const shared = () => [{ dir: join(__dirname, '_shared', 'openapi'), ext: '@' }]
export const singleUser = options => make('single-user', options)
export const teamApiTokens = options => make('team-api-tokens', options)
export const teamTasks = options => make('team-tasks', options)
export const teams = options => make('teams', options)
export const userApiTokens = options => make('user-api-tokens', options)
export const userManagement = options => make('user-management', options)
export const userSessions = options => make('user-sessions', options)
export const userTasks = options => make('user-tasks', options)

export const all = options => ([
	...shared(),
	...singleUser(options),
	...teamApiTokens(options),
	...teamTasks(options),
	...teams(options),
	...userApiTokens(options),
	...userManagement(options),
	...userSessions(options),
	...userTasks(options),
])

export const allNoTeams = options => ([
	...shared(),
	...singleUser(options),
	...userApiTokens(options),
	...userManagement(options),
	...userSessions(options),
	...userTasks(options),
])
