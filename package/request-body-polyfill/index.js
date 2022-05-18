export const streamToData = async req => new Promise(resolve => {
	let data = ''
	req.on('data', chunk => data += chunk)
	req.on('end', () => resolve(data))
})

export const requestBodyPolyfill = (req, res, next) => {
	const needsText = typeof req.text !== 'function'
	const needsJson = typeof req.json !== 'function'
	let dataPromise = (needsText || needsJson) && streamToData(req)
	// TODO in web environment, calling .json() or .text() multiple times will throw, so that should happen here
	if (needsJson) req.json = async () => dataPromise.then(data => JSON.parse(data))
	if (needsText) req.text = async () => { return dataPromise }
	// TODO also support
	//  .arrayBuffer()
	//  .blob()
	//  .clone()
	//  .formData()
	//  https://developer.mozilla.org/en-US/docs/Web/API/Request/arrayBuffer
	next()
}
