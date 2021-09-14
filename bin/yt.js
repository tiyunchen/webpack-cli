#!/usr/bin/env node
const {spawn} = require('cross-spawn')
const path = require('path')
const args = process.argv.slice(2);

// process.cwd() 返回当前进程工作的目录
const result = spawn.sync('node', [`${path.resolve(__dirname, '../lib/webpack.js')}`, ...args], { stdio: 'inherit' })
