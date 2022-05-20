import Router from 'trouter'
import { parse } from 'querystring'
import parser from '@polka/url'

function lead(x) {
	return x[0] === '/' ? x : ('/' + x)
}

function value(x) {
	let y = x.indexOf('/', 1)
	return y > 1 ? x.substring(0, y) : x
}

function mutate(str, req) {
	req.url = req.url.substring(str.length) || '/'
	req.path = req.path.substring(str.length) || '/'
}

function onError(err, req, res, next) {
	let code = (res.statusCode = err.code || err.status || 500)
	// TODO not handling buffers in
	if (typeof err === 'string' || Buffer.isBuffer(err)) res.end(err)
	else res.end(err.message || code.toString())
}

export default class Mariachi extends Router {
	constructor(options = {}) {
		super()
		this.apps = {}
		this.wares = []
		this.bwares = {}
		this.parse = parser
		this.handler = this.handler.bind(this)
		this.onError = options.onError || onError // catch-all handler
		this.onNoMatch = options.onNoMatch || this.onError.bind(null, { code: 404 })
	}

	add(method, pattern, ...fns) {
		let base = lead(value(pattern))
		if (this.apps[base] !== void 0) throw new Error(`Cannot mount ".${method.toLowerCase()}('${lead(pattern)}')" because a Polka application at ".use('${base}')" already exists! You should move this handler into your Polka application instead.`)
		return super.add(method, pattern, ...fns)
	}

	use(base, ...fns) {
		if (typeof base === 'function') {
			this.wares = this.wares.concat(base, fns)
		} else if (base === '/') {
			this.wares = this.wares.concat(fns)
		} else {
			base = lead(base)
			fns.forEach(fn => {
				if (fn instanceof Polka) {
					this.apps[base] = fn
				} else {
					let arr = this.bwares[base] || []
					arr.length > 0 || arr.push((r, _, nxt) => (mutate(base, r), nxt()))
					this.bwares[base] = arr.concat(fn)
				}
			})
		}
		return this // chainable
	}

	handler(req, res, info) {
		info = info || this.parse(req)
		let fns = [], arr = this.wares, obj = this.find(req.method, info.pathname)
		req.originalUrl = req.originalUrl || req.url
		let base = value(req.path = info.pathname)
		if (this.bwares[base] !== void 0) {
			arr = arr.concat(this.bwares[base])
		}
		if (obj) {
			fns = obj.handlers
			req.params = obj.params
		} else if (this.apps[base] !== void 0) {
			mutate(base, req); info.pathname = req.path //=> updates
			fns.push(this.apps[base].handler.bind(null, req, res, info))
		}
		fns.push(this.onNoMatch)
		// Grab addl values from `info`
		req.search = info.search
		req.query = parse(info.query)
		// Exit if only a single function
		let i = 0, len = arr.length, num = fns.length
		if (len === i && num === 1) return fns[0](req, res)
		// Otherwise loop thru all middlware
		let next = err => err ? this.onError(err, req, res, next) : loop()
		let loop = _ => res.finished || (i < len) && arr[i++](req, res, next)
		arr = arr.concat(fns)
		len += num
		loop() // init
	}
}
