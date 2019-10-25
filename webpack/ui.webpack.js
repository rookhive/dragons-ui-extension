require('dotenv').config()

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isDev = process.env.NODE_ENV === 'development'

module.exports = {
    mode: process.env.NODE_ENV,
    entry: {
        popup: path.join(__dirname, '../src/popup/index')
    },
    output: {
        path: path.resolve(__dirname, '../extension/popup'),
        filename: '[name].js'
    },
    devtool: isDev
        ? 'inline-source-map'
        : false,
    stats: {
        entrypoints: false,
        children: false,
        modules: false
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.sass$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ],
    devServer: {
        port: 8080,
        contentBase: path.resolve(__dirname, '../extension/popup'),
        compress: true,
        hot: true
    }
}