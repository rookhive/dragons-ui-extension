require('dotenv').config()

const path = require('path')

module.exports = {
    mode: process.env.NODE_ENV,
    entry: {
        core: path.join(__dirname, '../src/core/index')
    },
    output: {
        filename: '[name].js',
        publicPath: '/',
        path: path.resolve(__dirname, '../extension')
    },
    devtool: process.env.NODE_ENV === 'development'
        ? 'inline-source-map'
        : false,
    stats: {
        entrypoints: false,
        children: false,
        chunks: false,
        modules: false
    },
    resolve: {
        extensions: ['.js']
    }
}