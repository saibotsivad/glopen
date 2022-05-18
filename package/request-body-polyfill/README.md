# Request Body Polyfill

If the `.json()` and `.text()` methods are not available on the request, it'll add them.

## Install

The usual way:

```shell
npm install request-body-polyfill
```

## Using

If your router uses the normal `req, res, next` method of adding middleware, it's as simple as:

```js
import { requestBodyPolyfill } from 'request-body-polyfill'

const api = polka() // or express() or whatever else
api.use(requestBodyPolyfill)
```

You can also use the `streamToData` method directly, if you need more control:

```js
import { streamToData } from 'request-body-polyfill'
const api = polka() // or express() or whatever else
api.post('/notes', async (request) => {
	const body = await streamToData(request)
	// etc.
})
```

## License

This software and all included resources are published and released under the
[Very Open License](http://veryopenlicense.com).
