export default {
	merge: [
		{
			dir: './demo-api-1',
			api: '/api',
			ext: '@',
		},
		{
			dir: './demo-api-2',
			api: '/api',
			ext: '$',
		},
	],
	output: 'example/build/generated.js',
}
