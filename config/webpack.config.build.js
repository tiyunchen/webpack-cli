const merge = require('webpack-merge');
const common = require('./webpack.config.common.js');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        // 压缩css
        new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.css\.*(?!.*map)/g,  // 注意不要写成 /\.css$/g
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                discardComments: { removeAll: true },
                // 避免 cssnano 重新计算 z-index
                safe: true,
                // 5.x 使用parser，不是safe，5有点问题，回退到4
                // parser: require('postcss-safe-parser'),
                // cssnano通过移除注释、空白、重复规则、过时的浏览器前缀以及做出其他的优化来工作，一般能减少至少 50% 的大小
                // cssnano 集成了autoprefixer的功能。会使用到autoprefixer进行无关前缀的清理。默认不兼容ios8，会去掉部分webkit前缀，比如flex
                // 所以这里选择关闭，使用postcss的autoprefixer功能
                autoprefixer: false
            },
            canPrint: true
        }),
    ],
});
