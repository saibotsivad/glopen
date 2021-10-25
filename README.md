# glopen

GLobbify OPENapi: Glob folder structures into an OpenAPI definition and API driver.

The basic idea is that you create a folder structure to represent the final OpenAPI object, with some very light sugar, and use that to both generate the OpenAPI definition file and drive the API.

You can also merge multiple distinct folders together, into a single definition and driver, allowing API endpoint definitions to be published as discrete, reusable libraries.

## Install

The usual way:

```shell
npm install glopen
```

## Using

As part of the build process, for a single folder structure, simply do:

```shell
glopen --dir=./path/to/api/folder --out=./generated-file.js
```

The `--out` flag is optional, if not set the code will print, so you could also do:

```shell
glopen --dir=./path/to/api/folder > ./generated-file.js
```

For multiple merged folder structures, you can use multiple `--json` parameters, with each being a JSON object, or an array of objects:

```shell
glopen --json='{ "dir": "./path1", "api": "/api/v1" }' \
       --json='[ { "dir": "./path1", "api": "/api/v1" }, { "dir": "./path2", "api": "/api/v2" } ]' \
       --out=./generated-file.js
```

To use it in code, pass in `{ merge: Array<Part> }`:

```js
import { glopen } from 'glopen'
import { writeFile } from 'node:fs/promises'

const code = await glopen({
	merge: [
		{
			dir: './path/to/api/folder',
			api: '/api/v1/tasks',
			ext: '@'
		}
	]
})
await writeFile('./generated-file.js', code, 'utf8')
```

Lastly, you can use the `--config` (or `-c` alias) to point to a JavaScript file that exports a config object:

```js
export default {
	merge: [{
		dir: './path/to/api/folder',
		api: '/api/v1/tasks',
		ext: '@'
	}],
	output: './generated-file.js'
}
```

## Parts

Whether used in code, or in any of the modes, each API "part" has these parameters:

- `dir` *required* - The path to the API folder.
- `api` *optional* - The API path to prefix to the folder, e.g. if the folder is `/tasks` and `prefix` is `/api/v1` the API path becomes `/api/v1/tasks`.
- `ext` *optional* - The extension prefix used for auto-globbing, (Default: `@`, e.g. `get.@.js`)

For example, given this folder structure:

```
/demo
	/tasks
		/get.@.js
```

If, at the root, you used `glopen --dir=./demo` the OpenAPI operation would be `GET /tasks`.

However, if you used `glopen --dir=./demo --api=/v1` the OpenAPI operation would be `GET /v1/tasks`.

## API `glopen({ merge: Array<Part> })`

When used in code, the input is an object with a `merge` property, which is an ordered array of "part" objects.

```js
const code = await glopen({
	merge: [
		{
			dir: './path/to/users',
			api: '/api/v2/users',
			ext: '@'
		}
	],
})
```

## CLI

The different modes (single, json, and config) are not mixable, you must pick one or the other.

### Single Mode

In single mode, a single "part" is passed in as CLI args:

```shell
glopen --api=./path/to/users \
       --prefix=/api/v2/users \
       --suffix=@
```

### JSON Mode

In JSON mode, one or more "parts" are passed in as JSON strings, either as objects, arrays, or mixed:

```shell
glopen --json='{ "dir": "./path/to/users", "api": "/api/v2/users", "ext": "@" }' \
       --json='[ { "dir": "./path/to/tasks", "api": "/api/v2/tasks", "ext": "$" }, { "dir": "./path/to/cars", "api": "/api/v1/cars", "ext": "@" } ]'
```

The order of all JSON inputs is preserved, so the above example would be the same as:

```js
await glopen({
	merge: [
		{
			dir: './path/to/users',
			api: '/api/v2/users',
			ext: '@'
		},
		{
			dir: './path/to/tasks',
			api: '/api/v2/tasks',
			ext: '$'
		},
		{
			dir: './path/to/cars',
			api: '/api/v1/cars',
			ext: '$'
		},
	]
})
```

### Config Mode

Calling `glopen` with the `-c` or `--config` option will import the file specified, or `glopen.config.js` by default:

```shell
glopen -c # uses './glopen.config.js'
# or
glopen -c ./path/to/config.js
```

The config file must export a default object containing the following properties:

- `merge: Array<Part>` *required* - An array of "parts", e.g. `dir`, `api`, `ext`.
- `output: String` *optional* - The file path to write to.

## Merge Order

To be clear, all paths, components, and so on, will all be merged on top of each other, first to last. In other words, if there are overlapping paths, models, etc., the winning one will be the last.

This copies the `Object.assign` order, e.g.:

```js
Object.assign({}, { a: 1 }, { a: 2 })
// { a: 2 }
```

## Okay... Now What?

For example, an OpenAPI definition with a single path might look like:

```json
{
	"paths": {
		"/api/v1/tasks/{taskId}": {
			"get": {
				"description": "Get a single task."
			}
		}
	}
}
```

That translates to the folder+file structure:

```
/paths
	/api
		/v1
			/tasks
				/{taskId}
					/get.@.js
```

Note that the `.@.js` suffix is configurable, but it means that we can auto-glob the files together (the sugar) and put other files next to it, e.g.:

```
/paths
	/api
		/v1
			/tasks
				/{taskId}
					/get.@.js
					/get.test.js
					/some-utils.js
```

Inside each file, you just export named constants that match the OpenAPI property names, for example:

```js
// file: /paths/api/v1/tasks/{taskId}/get.@.js
export const summary = 'Get a single task.'
export const tags = [ 'task' ]
```

For methods, you would export a default function as a request handler. Since this generator is simply importing and exporting, the argument parameters can be whatever you'd like. Here we're using the normal Express-like `async (request, response)` signature, but you can use any signature you like:

```js
// same file
export default async (request, response) => {
	response.end(`Task ID: ${request.params.taskId}`)
}
```

## Generator Output

What comes out of the generator is a single JS file that imports and exports the folder+file tree
into something useful for generating the OpenAPI JSON object, as well as for passing into API frameworks
like Polka, Express, and so on:

```js
import GENERATED_ID_handler, * as GENERATED_ID from './paths/api/v1/tasks/{taskId}/get.@.js'

export const definition = {
	paths: {
		'/api/v1/tasks/{taskId}': {
			get: {
				...GENERATED_ID,
				operationId: 'GENERATED_ID_get',
			},
		},
	}
}

export const routes = [
		{
			handler: GENERATED_ID_handler,
			exports: GENERATED_ID,
			method: 'get',
			path: '/api/v1/tasks/{taskId}',
			// Because the `:`` prefix is so common, it is offered as an alternate
			// to the OpenAPI path syntax.
			pathAlt: '/api/v1/tasks/:taskId',
			operationId: 'GENERATED_ID_get',
		},
]
```

## Underscore Filename

The special exception to a named file matching an OpenAPI object is that you still need to define some properties at the root of an object. For example, the "Path Item Object" has a `description` property.

To resolve this, the underscore character is reserved as a file name. Simply place a file named `_.@.js` in the folder, and those properties will be merged, e.g. for this structure:

```
/paths
	/api
		/v1
			/tasks
				/{taskId}
					/_.@.js
					/get.@.js
```

The `_.@.js` file would be responsible for the "Path Item Object" properties, such as
the path parameter `{taskId}` definition. This looks the same as the other files:

```js
export const parameters = [
	{
		name: 'taskId',
		in: 'path',
		required: true,
		schema: {
			type: 'string'
		}
	}
]
```

The generated output would expand the exported properties from `_.@.js` to the Path Item Object:

```js
import * as GENERATED_ID0 from './paths/api/v1/tasks/{taskId}/_.@.js'
import GENERATED_ID1_handler, * as GENERATED_ID1 from './paths/api/v1/tasks/{taskId}/get.@.js'

export const definition = {
	paths: {
		'/api/v1/tasks/{taskId}': {
			...GENERATED_ID0,
			get: {
				...GENERATED_ID1,
				operationId: 'GENERATED_ID_get',
			},
		},
	}
}
```

## Output

The generator creates a file that exports two named properties:

- `definition` *Object* - The object containing the fully constructed OpenAPI definition.
- `routes` *Array<Object>* - A list of all routes, including the handler.

### Output: Definition

To get the OpenAPI JSON, you simply import and stringify:

```js
import { definition } from './generated-file.js'
console.log(JSON.stringify(definition, null, 2))
```

Would output:

```json
{
	"paths": {
		"/api/v1/tasks/{taskId}": {
			"parameters": [
				{
					"name": "taskId",
					"in": "path",
					"required": true,
					"schema": { "type": "string" }
				}
			],
			"get": {
				"summary": "Get a single task.",
				"tags": [ "task" ]
			}
		}
	}
}
```

### Output: Routes

To use the generated file in an API framework, like Polka, import the `routes` property:

```js
import polka from 'polka'
import { routes } from './generated-file.js'

const api = polka()

routes.forEach(({ handler, exports, method, path, pathAlt, operationId }) => {
	console.log(' - ', method.toUpperCase(), polkaPath, '\n   ', exports.summary)
	api[method](pathAlt, handler)
})

api.listen(3000, () => {
	console.log('API running on port 3000, try opening: http://localhost:3000/api/v1/tasks/9001')
})
```

Each route array element has the following properties:

- `handler` - The `default` export of the file.
- `exports` - Every named export of the file.
- `method` - The lower-cased method, which comes from the filename, e.g. `get.@.js` becomes `get`.
- `path` - The full OpenAPI path string, which comes from the folder paths.
- `pathAlt` - The `:` prefixed path syntax is so common, it is provided for your convenience.
- `operationId` - The generated identifier of the path+method.

You would use those to do things like secure the route, validate input against schemas, and so on.

## Importing Text

It is very convenient to be able to write longer descriptions in separate markdown files, so that you get the syntax highlighting, previews, etc. that you wouldn't get if you put it directly in the JavaScript file.

In other words, this isn't a very developer nice experience:

```js
export const description = `
This really long string will work just fine, so use this if you like.

Hoever, in most IDEs you won't get markdown syntax highlighting, and \`escaping\`
the template literals can get annoying.
`
```

Modern bundlers support importing string, so you could definitely do this:

```js
export { default as description } from './description.md'
```

One of the goals of this project is to output a generated file that doesn't require further bundling to function. To that end, if you name a markdown file appropriately, it'll get brought in as a string and exported, e.g. `get.description.@.md` will become:

```js
// file: generated-file.js
const GENERATED_ID_description = "The text gets placed here, since it can't be imported."
```

The naming convention is simply `FILENAME.PROPERTY.SUFFIX.md`:

- `FILENAME` - The filename to connect to, e.g. `get` or `_`.
- `PROPERTY` - The property name to connect to, e.g. `description`. (Note: the generator doesn't support nested text, sorry.)
- `SUFFIX` - By default it's `@`, but that's configurable.

## Schema References

These are handled the same way, so instead of `_.@.js` exporting the `taskId` parameter definition, it could export the parameter definition as a schema reference:

```js
export const parameters = [
	{
		$ref: '#/components/parameters/taskId'
	}
]
```

The generator will check that all `$ref` references that use a `#/` prefix are resolvable in the final OpenAPI object, and throw an error if not.

## License

This software and all example code are published to the public domain using the [Very Open License](https://veryopenlicense.com).
