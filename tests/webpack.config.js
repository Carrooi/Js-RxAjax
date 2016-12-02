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
					'configFileName': __dirname + '/tsconfig.json'
				}
			}
		]
	}
};
