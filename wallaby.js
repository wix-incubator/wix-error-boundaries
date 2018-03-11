module.exports = function(wallaby) {
	return {
		files: ['index.js'],

		tests: ['test/*.test.js'],

		env: {
			type: 'node',
			runner: 'node'
		},

		testFramework: 'jest',

		compilers: {
			'**/*.js': wallaby.compilers.babel()
		}
	}
}
