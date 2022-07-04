# Glopen Request Parser

Parse a [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object into the OpenAPI defined parameters.

## Install

The usual way:

```shell
npm install glopen-request-parser
```

## Using

If you're use this with a router that supports normal `(req, res, next)` middleware, like [Polka](https://github.com/lukeed/polka) / Express / Koa, you would do something like this:

```js
import polka from 'polka'
import { routerRequestParser } from 'glopen-request-parser'
import { definition } from './openapi-definition.js'

const api = polka() // or express or koa or ...

api.use(routerRequestParser({ definition }))

api.add('/users/:id', (req, res) => {
	console.log(req.openapi) // => { path, query, header, cookie }
})
```

Different routers may put the path parameters on a different property name, so you can pass that in. For example, Polka uses `params`:

```js
api.use(routerRequestParser({
	definition,
	pathParametersKey: 'params',
}))
```

> The default is actually `params`, so you wouldn't need to do that if you were using Polka.

You'll also need to provide the original path string (e.g. the OpenAPI formatted `/users/{id}` string) to the request parser. If you're using a router with middleware, you'll need the middleware that sets the path string to run before the one that parses the request.

You can set the name of that request property name with the `pathPatternKey`, which defaults to `"pathPattern"`.

For example: in Polka, at least, there's not a convenient way to do this with the traditional `use` function, so you have to set the middle on each request:

```js
import polka from 'polka'
import { routerRequestParser } from 'glopen-request-parser'
import { definition, routes } from './generated-openapi.js'

const api = polka()

const pathPatternKey = 'myOriginalPathString'

const middlewareForAllRoutes = [
	routerRequestParser({
		definition,
		pathPatternKey,
	}),
]

const addOriginalPathPattern = pathPattern => (req, res, next) => {
	req[pathPatternKey] = pathPattern
	next()
}

routes.forEach(({ handler, exports, method, path, pathAlt }) => {
	// here "path" is the Polka format "/users/:id"
	// whereas "pathAlt" is the OpenAPI format "/users/{id}"
	api[method](
		pathAlt,
		addOriginalPathPattern(path),
		...middlewareForAllRoutes,
		handler,
	)
})
```

## Alternate Use

If your router doesn't work like the normal `request` + `response` + `next` routers, you can still make use of the parser using the exported `coreRequestParser` method, which just takes all properties in at once and returns a `Promise` with the OpenAPI object:

```js
import { coreRequestParser } from 'glopen-request-parser'
import { definition } from './generated-openapi.js'

const http = instantiate_http_server()

http.on('request', (request, response) => {
	const { pattern, parameters } = your_path_parser(request, definition)
	request.my_pattern = pattern
	request.my_params = parameters
	coreRequestParser({
		definition,
		pathPatternKey: 'my_pattern,
		pathParametersKey: 'my_params',
		request,
	}).then(openapi => {
		console.log(openapi) // => { path, query, header, cookie }
		// do something and then set a response, like normal
	})
})
```

## License

This software and all included resources are published and released under the
[Very Open License](http://veryopenlicense.com).
