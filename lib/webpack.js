const webpack = require('webpack');
const path = require('path')
const merge = require('webpack-merge');
const fs = require('fs')
const MODE_DEV = 'dev'
const MODE_BUILD = 'build'
const chalk =  require('chalk')
const args = process.argv.slice(2);
console.log('process.cwd()', process.cwd())

const rcFile = require(path.resolve(process.cwd(), './.ytrc.js'))



function initBuild(mode){
    if([MODE_DEV, MODE_BUILD].includes(mode)){
        initWebpack(mode)
    } else { // 未来有其他打包方式， 离线化的打包
        console.error('您似乎没有添加构建参数 ytFE dev or ytFE build')
    }

}

/**
 * webpack 打包
 * @param mode
 */
function initWebpack(mode){
    const configFile = path.resolve(__dirname, `../config/webpack.config.${mode}`)
    const oldConfig = require(configFile)
    const config = merge(oldConfig, rcFile)
    const compiler = webpack(config);
    if(mode === MODE_DEV){ // 开发环境
        compiler.watch({
            // watchOptions 示例
            aggregateTimeout: 300,
            poll: undefined
        }, (err, stats) => {
            // 在这里打印 watch/build 结果...
            console.log('watching...');
            if (err) {
                console.error(`[${chalk.grey(new Date().toLocaleString())}] ${chalk.red("webpack")}`, err);
                return;
            }
            if (stats.hasErrors()) {
                console.error(`[${chalk.grey(new Date().toLocaleString())}] ${chalk.red(stats.toJson().errors)}`);
                return;
            }
            console.log(`[${chalk.grey(new Date().toLocaleString())}] ${chalk.greenBright("构建完毕")} 耗时 ${chalk.magenta(`${stats.endTime-stats.startTime} ms`)}`);
        });

    } else if(mode === MODE_BUILD){ // 生产环境
        compiler.run((err, stats)=>{
            if(err){
                console.error(err)
            }
            // console.log('构建完毕', Object.keys())
            console.log(stats.toString({
                chunks: false,  // 使构建过程更静默无输出
                colors: true    // 在控制台展示颜色
            }));
        })
    }
}


console.log(__dirname, args)


initBuild(args[0])



