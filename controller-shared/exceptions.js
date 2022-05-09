export class BadRequest extends Error {
	constructor(message, meta) {
		super(message)
		this.name = 'BadRequest'
		this.status = 400
		this.title = 'Incorrectly formed request, please check the OpenAPI definition.'
		this.detail = message
		this.meta = meta
	}
}
