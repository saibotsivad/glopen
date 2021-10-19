/*

One particular thing to note here is that this `info.@.js` file could just as well have been placed
in the `_.@.js` file and exported as `export const info = { title, ... }` because it's just placed
on the generated definition.

The only reason to put it in its own file, in this demo, is to show how you can specify markdown
files as properties using the `FILE.ACCESSOR.@.md` name format.

*/

/*
The `info` file is REQUIRED, and the properties `title` and `version` are also REQUIRED.
*/
export const title = 'API Demo'

/*
Note that you could also do:

	export { version } from './package.json'

Or whatever, but you would need your bundler to handle JSON files
and you wouldn't be able to run it in NodeJS natively.
*/
export const version = '1.0.0'

/*
You can place the API description in here, or you can create a file:

	info.description.@.md

And that'll get pulled in as a string into the generated output.

If you specify both, like in this demo, the file will override the exported constant.
*/
export const description = 'Demo of using the openapi thingy.'
