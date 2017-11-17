var path = require('path')
module.exports = {
    entry: "./src/index.ts",
    devtool: 'source-map',
    output: {
        filename: "dist/[name].js",
        library: 'react-jsonschema-crud',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        root: path.resolve('./src'),
        extensions: ["", ".ts", ".tsx", ".js"]
    },
    module: {
        loaders: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /\.tsx?$/, loaders: ['babel', 'ts'], exclude: /node_modules/ },
            { test: /\.json$/, loader: 'json-loader' },
        ]
    }
}