import polka from 'polka'
import { routes } from './build/generated.js'

const api = polka()

console.log('Adding routes:')

routes.forEach(({ handler, exports, method, pathAlt }) => {
	// here you have access to everything exported in the file, so you
	// could use that to e.g. secure routes
	console.log(' - ', method.toUpperCase(), pathAlt, '\n   ', exports.summary)
	api[method](pathAlt, handler)
})

api.listen(3000, () => {
	console.log('API running on port 3000, try opening: http://localhost:3000/api/v1/tasks/9001')
})
