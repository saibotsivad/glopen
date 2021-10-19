/*
The tags go here. Note that the OpenAPI format is a list like:

	tags: [
		{ name: 'task', description: 'A thing that needs doing.' }
	]

Whereas here we're exporting const objects that are turned into that
format. The property name and `name` property are almost always going
to be the same, so if you omit the `name` than it'll get defined as
the exported `const` name.

E.g, this will map to `{ name: 'demo', description: 'Things happen.' }
*/
export const demo = {
	description: 'Things happen.'
}

export const task = {
	name: 'task',
	description: 'A thing that needs doing.'
}

export const user = {
	name: 'user',
	description: 'Owners of tasks.'
}
