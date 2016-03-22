module.exports = {
	devtool: 'source-map',
	debug: true,

	entry: {
		app: __dirname + '/index'
	},

	output: {
		path: __dirname + '/public',
		filename: 'tests.js',
		sourceMapFilename: 'tests.map'
	},

	resolve: {
		extensions: ['', '.ts', '.js', '.json']
	},

	module: {
		loaders: [
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				query: {
					'ignoreDiagnostics': [
						2403, // 2403 -> Subsequent variable declarations
						2300, // 2300 -> Duplicate identifier
						2374, // 2374 -> Duplicate number index signature
						2375  // 2375 -> Duplicate string index signature
					],
					'configFileName': './tsconfig.json'
				}
			}
		],
		noParse: []
	}
};
