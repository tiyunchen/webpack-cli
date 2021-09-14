const path = require('path');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const publicPrefix = "{{publicPrefix}}";
const WebpackBar = require('webpackbar');
const TargetPath = process.cwd()
const {name, version} = require(TargetPath+'/package');



//默认输出路径
const fs = require('fs');
let outputPath = path.resolve(TargetPath, `./${name}`);
if (fs.existsSync(path.resolve(TargetPath, `./serverConfig.js`))) {
    //本地指定输出路径
    outputPath = require(path.resolve(TargetPath, `./serverConfig.js`)).outputPath;
}

const postConfig = function (rootValue = 100) {
    return {
        loader: require.resolve('postcss-loader'),
        options: {
            ident: 'postcss',
            plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                    overrideBrowserslist: [
                        'iOS >= 7',
                        'Android >= 4.1',
                    ],
                    // flexbox: 'no-2009',  加了低版本就没有 display: -webkit-box; 兼容写法
                }),
                pxtorem({rootValue, propWhiteList: []})
            ],
        },
    }
}

module.exports = {
    context: path.resolve(TargetPath, './'),
    entry: {
        bundle: path.resolve('src/index'),
    },
    output: {
        path: path.join(outputPath, `/${version}/build`),
        filename: '[name].js',
        chunkFilename: '[name].js?v=[chunkhash:8]'
    },
    externals: {
        'fastclick': 'FastClick',
        'react': 'React',
        'react-dom': 'ReactDOM',
        // 'react-router': 'ReactRouter'
    },
    resolve: {
        modules: [
            'node_modules',
            'src'
        ],
        extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.ts', '.tsx', '.js', '.jsx', '.json'],
        alias: {
            '@src': path.resolve('./src'),
            'bn.js': path.resolve(process.cwd(), 'node_modules', 'bn.js'),
        }
    },
    resolveLoader:{
        alias:{
            'layout':path.resolve(__dirname, 'loader/layout.js'),
            '@src': path.resolve(TargetPath, './src')
        }
    },
    module: {
        rules: [
            {
                test: /\.[jt]s[x]?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
                options: {
                    plugins: [
                        ["import", { libraryName: "antd-mobile", style: true }],
                        ["import", {
                            "libraryName": "@yt/watermelon",
                            "libraryDirectory": "lib",
                            "camel2DashComponentName": false
                        }, "@yt/watermelon"],
                        "@babel/plugin-transform-runtime",
                    ],
                    presets: ['@babel/preset-env','@babel/preset-react', "@babel/preset-typescript"],
                }
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,  // replace ExtractTextPlugin.extract({..})
                    "css-loader",
                    postConfig(),
                    {
                        loader: require.resolve('sass-loader'),
                        options: {
                        }
                    },
                    {
                        loader:'layout',
                        // options:{
                        //     MAXWIDTH:1000
                        // }
                    },
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: [
                                TargetPath+'/src/sass/index.scss',
                                TargetPath+'/node_modules/@yt/theme/theme.scss'
                            ]
                        }
                    }
                ],
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    postConfig(50),
                    // 适配antd-mobile 2.x  1--> 2
                    {loader: 'less-loader', options: { javascriptEnabled: true }},
                ],
                include: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,  // replace ExtractTextPlugin.extract({..})
                    "css-loader",
                    postConfig(),
                ]
            },
            {
                test: /\.module\.css$/,
                use: [
                    // MiniCssExtractPlugin.loader,  // replace ExtractTextPlugin.extract({..})
                    "css-loader",
                    postConfig(),
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                loader: 'url-loader?limit=8192'
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg)(\?\S*)?$/,
                loader: 'file-loader'
            }
        ],
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: "common",
                    chunks: "initial",
                    minChunks: 2
                }
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: '[name].css?v=[contenthash:8]'  // use contenthash *
        }),

        new HtmlWebpackPlugin({
            // filename:  path.resolve(__dirname, 'public/index.html'),
            filename: path.resolve(outputPath, `${version}/index.hbs`),
            template: TargetPath + '/src/template.hbs',
            inject: 'body',
            hash: true,
            publicPath: `${publicPrefix}build/`,
            minify: {
                removeComments: true,
                collapseWhitespace: false
            }
        }),
        new CopyPlugin([
            {from: 'public/images', to: path.join(outputPath, `${version}/images`)},
        ]),
        new WebpackBar({
            reporters: ['fancy']
        }),
    ],
    // 将一些在浏览器不起作用，但是引用到的库置空
    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
    },
    // Turn off performance hints during development because we don't do any
    // splitting or minification in interest of speed. These warnings become
    // cumbersome.
    performance: {
        hints: false,
    },
};
