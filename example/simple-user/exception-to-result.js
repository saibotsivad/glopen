const formatError = error => {
	error = error || {}
	error.meta = error.meta || {}
	error.meta.stacktrace = error.meta && error.meta.stacktrace || error.stack
	return {
		status: error.status && error.status.toString() || '500',
		code: error.code || (error instanceof Error && error.constructor.name !== 'Error' && error.constructor.name) || 'UnexpectedException',
		title: error.title || 'Unexpected server exception',
		detail: error.message || error.detail || 'Unexpected server exception, please report to API maintainers.',
		source: error.source,
		meta: error.meta,
	}
}

export const exceptionToResult = error => {
	return {
		status: error.status || 500,
		body: {
			errors: [formatError(error)],
		},
	}
}
