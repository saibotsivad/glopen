# Glopen Response Tidier

Simple wrapper to make [Glopen](https://github.com/saibotsivad/glopen) handlers tidier.

## Install

The usual way:

```shell
npm install glopen-route-wrapper
```

## Using

If you use Glopen with a router like [Polka](https://github.com/lukeed/polka), you might do something like this:

```js
import polka from 'polka'
import { responseWrapper } from 'glopen-response-wrapper'
import { definition, routes, securities } from './build.js'

const api = polka()

routes.forEach(({ method, pathAlt, handler }) => {
	api[method](pathAlt, responseWrapper({ handler }))
})

api.listen(3000, () => {
	console.log('API running on port 3000')
})
```

## Handler Output

Basically, a Glopen handler is not very opinionated, so you could pass it a typical `req/res` input:

```js
export default (req, res) => {
	res.writeHead(200, { 'Content-Type': 'application/json' })
	res.end(JSON.stringify({ hello: 'world' }))
}
```

But obviously writing that same code everywhere gets tedious and error-prone.

If you use this library as a wrapper, you can instead return an object and it'll get auto-transformed to the correct `req`/`res` method calls:

```js
export default request => {
	return {
		status: 200,
		body: { hello: 'world' },
	}
}
```

### Response Options

All returned object properties are optional. Returning an object at all is optional.

#### `headers`

This is a flat key-value dictionary object of header values, e.g. things like this:

```js
const headers = {
	'Content-Type': 'text/plain'
}
```

If no headers are given, the correct `Content-Type` will be inferred by the `body` property and/or the `type` property.

#### `body`

The response to write out. Setting the `type` will force the `Content-Type` header and formatting of the body.

If no `type` is returned, the response will be transformed in this way:

1. If the `body` is a string and starts with `<!DOCTYPE html`, the `Content-Type` will be `text/html`.
2. Otherwise, if the `body` is a string, the `Content-Type` will be `text/plain`.
3. If the `body` is an object, the `Content-Type` will be `application/json` and the `body` will be turned into JSON.

Other complex types can be handled by the `type` property.

#### `status`

This is the response status, so it should be a [valid HTTP status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes).

If no status is returned:

* `204` if there is no body returned,
* `200` in all other cases.

#### `type`

This is used to auto-convert `body` values and set the `Content-Type` header.

Supported values are:

| `type` | `Content-Type`     | Transform                                             |
|--------| -------------------- | ------------------------------------------------------- |
| `json` | `application/json` | Native`JSON.stringify` function.                      |
| `html` | `text/html`        | If not already a string,`.toString()` will be called. |
| `text` | `text/plain`       | If not already a string,`.toString()` will be called. |

## License

This software and all included resources are published and released under the
[Very Open License](http://veryopenlicense.com).
