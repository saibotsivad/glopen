import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { Polka } from './index.js'

test('just making sure tests run', async () => {
	assert.type(Polka, 'class')
})

test.run()
