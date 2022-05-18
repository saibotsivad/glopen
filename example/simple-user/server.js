// The goal of this example is to show a realistic setup, which will
// have request parsing and a few other convenience libraries.
import { setup } from './src/server.js'

// These are the core stuff for this API, you'll need to make
// your own, but have a look at the different files to see how
// simple they are.
import { configurations } from './src/configurations.js'
import { services } from './src/services.js'
import { controllers } from './src/controllers.js'
import { security } from './src/security.js'

// The generated file has everything we'll need.
import { definition, routes, securities } from './build/generated.js'

const api = setup({ definition, routes, securities, configurations, services, controllers, security })

const port = parseInt(process.env.PORT || 3000, 10)

api.listen(port, () => {
	console.log('API running on port', port)
})
