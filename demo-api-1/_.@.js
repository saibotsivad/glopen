/*

This root-level `_.$PREFIX.js` file contains the root level 'openapi' values. You'll note
that we could export the `info` object from here, but if we do that we won't be able to use
the markdown import shortcut for the `info.description` property.

*/

// REQUIRED
export const openapi = '3.0.2'

// OPTIONAL
export const servers = [
	{
		url: 'https://development.gigantic-server.com/v1',
		description: 'An example development server.',
	},
]

// OPTIONAL
export const externalDocs = {
	url: 'https://site.com',
	description: 'Find more details here.',
}
