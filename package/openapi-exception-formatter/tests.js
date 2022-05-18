import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { formatException } from './index.js'

test('a basic exception with no stacktrace', async () => {
	const exception = new Error('Hello world!')
	const error = formatException(exception)
	assert.equal(error, {
		status: '500',
		code: 'UnexpectedException',
		title: 'Unexpected server exception',
		detail: 'Hello world!',
	})
})

test('if you rerun it, it is always the same', async () => {
	const exception = new Error('Hello world!')
	let error = formatException(exception)
	error = formatException(error)
	error = formatException(error)
	error = formatException(error)
	assert.equal(error, {
		status: '500',
		code: 'UnexpectedException',
		title: 'Unexpected server exception',
		detail: 'Hello world!',
	})
})

test('you can keep the stacktrace', async () => {
	const exception = new Error('Hello world!')
	const error = formatException(exception, true)
	assert.ok(error.meta.stacktrace.includes('at Object.handler'))
})

test.run()
