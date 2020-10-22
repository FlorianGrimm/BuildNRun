const path = require('path');
const webpack = require('webpack');

const mode = process.env.NODE_ENV || "development"

/*
const fileDep = path.resolve(__dirname, 'sample.txt');
new webpack.DefinePlugin({
  BUILT_AT: webpack.DefinePlugin.runtimeValue(Date.now, [fileDep])
});
*/

const config = {
    mode: mode,
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
        path: path.resolve(__dirname, '../wwwroot'),
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
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(mode),
            /* 'process.env.BUILD_VERSION': JSON.stringify(pkg.version) */
        })
    ]
};
module.exports = config