# OpenAPI Exception Formatter

Turn a JavaScript exception into an OpenAPI error.

## Install

The usual way:

```shell
npm install openapi-exception-formatter
```

## Using

Pass any exception in, and a formatted error comes out:

```js
import { formatException } from 'openapi-exception-formatter'
const exception = new Error('Hello world!')
const error = formatException(exception)
```

The output is an OpenAPI object:

```json
{
	"status": "500",
	"code": "UnexpectedException",
	"title": "Unexpected server exception",
	"detail": "Hello world!"
}
```

You can create custom exceptions and throw/format them:

```js
class BadRequest extends Error {
	constructor(message, meta) {
		super(message)
		this.name = 'BadRequest'
		this.status = 400
		this.title = 'Incorrectly formed request.'
		this.detail = message
		this.meta = meta
	}
}
const error = formatException(new BadRequest('Numbers are required.'))
```

The output would look like:

```json
{
	"status": "400",
	"code": "BadRequest",
	"title": "Incorrectly formed request.",
	"detail": "Numbers are required."
}
```

## License

This software and all included resources are published and released under the
[Very Open License](http://veryopenlicense.com).
