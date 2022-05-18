import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { streamToData } from './index.js'

test('just making sure tests run', async () => {
	assert.type(streamToData, 'function')
})

test.run()
