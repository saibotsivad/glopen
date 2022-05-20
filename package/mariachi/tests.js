import { test } from 'uvu'
import * as assert from 'uvu/assert'
import Mariachi from './index.js'

test('just making sure tests run', async () => {
	assert.type(new Mariachi(), 'object')
})

test.run()
