const path = require('path');

module.exports = {
    mode: "development",
    entry: './src/index.tsx',
    devtool: 'eval-source-map', // inline-source-map
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../wwwroot/js'),
    }
};