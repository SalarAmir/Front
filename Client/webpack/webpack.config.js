const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        background: './src/background.js',
        app: './src/content.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'production',
    watch: true,
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.html$/,
                use: 'html-loader',
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 8192
                    }
                },
                generator: {
                    filename: 'images/[name].[hash][ext]'
                }
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'static', to: 'static' },
                { from: 'manifest.json', to: 'manifest.json' },
            ],
        }),
    ],
    resolve: {
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
    optimization: {
        minimize: false
    },
    devtool: false,
};