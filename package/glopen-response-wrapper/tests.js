import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { responseWrapper } from './index.js'

test('just making sure tests run', async () => {
	assert.type(responseWrapper, 'function')
})

test.run()
