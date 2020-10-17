const path = require('path');

module.exports = {
    mode: "development",
    /*
    entry: './src/index.tsx',
    */
    entry: {
        app: { 
                import: './src/index.tsx', 
                dependOn: ["vendor"],
                filename: 'app.js', 
             },
        serviceworker: { 
                import: './src/service-worker.ts', 
                dependOn: ["vendor"],
                filename: 'service-worker.js'
            },
        vendor: ['react', 'react-dom']
    },
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
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../wwwroot/js'),
        //chunkLoading: 'importScripts'
        //chunkFormat: 'commonjs'
        chunkFormat: 'array-push'
    },
    optimization: {
        splitChunks: {
            minSize: Infinity,
            cacheGroups: {
                vendor: {
                    //test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                    test: /[\\/]node_modules[\\/]([^/]+)[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                }
            }
        }
    },
    plugins: [
    ]
};