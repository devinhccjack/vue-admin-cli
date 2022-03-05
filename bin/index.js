#!/usr/bin/env node

// 请求 commander 库
const program = require('commander')
// 请求 lib/update.js
const updateChk = require('../bin/update')
// 请求 lib/mirror.js
const setMirror = require('./mirror')
// 请求 lib/download.js
const dlTemplate = require('./download')
// 请求 lib/init.js
const initProject = require('./init')


// 从 package.json 文件中请求 version 字段的值，-v和--version是参数
program.version(require('../package.json').version, '-v, --version')

// upgrade 检测更新
program
  // 声明的命令
  .command('upgrade')
  // 描述信息，在帮助信息时显示
  .description("Check the vue-admin-cli version.")
  .action(() => {
    // 执行 lib/update.js 里面的操作
    updateChk()
  })

  // mirror 切换镜像链接
program
.command('mirror <template_mirror>')
.description("Set the template mirror.")
.action((tplMirror) => {
  setMirror(tplMirror)
})

// template 下载/更新模板
program
  .command('template')
  .description("Download template from mirror.")
  .action(() => {
    dlTemplate()
  })

  // init 初始化项目
program
.name('vue-admin-cli')
.usage('<commands> [options]')
.command('init <project_name>')
.description('Create a javascript plugin project.')
.action(project => {
  initProject(project)
})


// 解析命令行参数
program.parse(process.argv)
