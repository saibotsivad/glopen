# Request Body Polyfill

A very simple polyfill to take NodeJS `http` request (probably an [IncomingMessage](https://nodejs.org/api/http.html#class-httpincomingmessage) or [ClientRequest](https://nodejs.org/api/http.html#class-httpclientrequest)) and add a few methods to make it act like the [Fetch API `Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request).

## Limitations

Note that this is **not** intended to be a complete polyfill, in fact it only adds these methods, if they do not exist:

- [arrayBuffer](https://developer.mozilla.org/en-US/docs/Web/API/Request/arrayBuffer) - A function that returns a `Promise`, which resolves with an [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).
- [json](https://developer.mozilla.org/en-US/docs/Web/API/Request/json) - A function that returns a `Promise`, which resolves with an object that is the body text run through `JSON.parse`.
- [text](https://developer.mozilla.org/en-US/docs/Web/API/Request/text) - A function that returns a `Promise`, which resolves with the text of the request body.

The following `Request` methods are not yet supported:

- [blob](https://developer.mozilla.org/en-US/docs/Web/API/Request/blob) - NodeJS added support for [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) only in [18.0.0](https://nodejs.org/api/globals.html#class-blob), so this will be added maybe once 18 becomes LTS.
- [clone](https://developer.mozilla.org/en-US/docs/Web/API/Request/clone) - There isn't a technical reason this isn't supported, it just doesn't seem very useful to me. Pull requests welcome.
- [formData](https://developer.mozilla.org/en-US/docs/Web/API/Request/formData) - NodeJS added support for [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) in [17.6.0](https://nodejs.org/api/globals.html#class-formdata) but it's still considered experimental, so this won't be supported directly for a bit longer.

## Install

The usual way:

```shell
npm install request-body-polyfill
```

## Using

If your router uses the normal `(req, res, next)` method of adding middleware, it's as simple as:

```js
import { requestBodyPolyfill } from 'request-body-polyfill'

const api = polka() // or express() or `koa()` or whatever else
api.use(requestBodyPolyfill)
```

If you need more control, you can also use the `streamToData` method directly:

```js
import http from 'node:http'
import { streamToData } from 'request-body-polyfill'
const server = http.createServer((req, res) => {
	streamToData(req)
	req.text().then(text => {
		// etc.
	})
})
```

## License

This software and all included resources are published and released under the
[Very Open License](http://veryopenlicense.com).
