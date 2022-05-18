import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { requestParser } from './index.js'

test('just making sure tests run', async () => {
	assert.type(requestParser, 'function')
})

test.run()
