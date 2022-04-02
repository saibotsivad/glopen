import { writeFileSync } from 'node:fs'
import { definition } from './build/generated.js'

// The `definition` export is the constructed OpenAPI object, so you can
// actually just JSON.stringify it:

writeFileSync('example/build/generated.json', JSON.stringify(definition, undefined, 2), 'utf8')
