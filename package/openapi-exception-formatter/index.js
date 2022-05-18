export const formatException = (error, includeStacktrace) => {
	error = error || {}
	const out = {
		status: error.status && error.status.toString() || '500',
		code: error.code || (error instanceof Error && error.constructor.name !== 'Error' && error.constructor.name) || 'UnexpectedException',
		title: error.title || 'Unexpected server exception',
		detail: error.message || error.detail || 'Unexpected server exception, please report to API maintainers.',
	}
	if (error.source) out.source = error.source
	if (error.meta) out.meta = error.meta
	if (includeStacktrace) {
		out.meta = out.meta || {}
		out.meta.stacktrace = error.meta && error.meta.stacktrace || error.stack
	}
	return out
}
