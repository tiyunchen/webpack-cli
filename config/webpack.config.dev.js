const merge = require('webpack-merge');
const vConsolePlugin = require('vconsole-webpack-plugin');
const common = require('./webpack.config.common.js');

module.exports = merge(common, {
    devtool: 'cheap-module-source-map',
    mode: 'development',
    plugins: [
        // 需要的时候再开启
        // new vConsolePlugin({enable: true})
    ]
});
