// 请求 download 库，用于下载模板
const download = require('download')
//下载git库
const downloads = require('download-git-repo')

// 请求 ora 库，用于实现等待动画
const ora = require('ora')
// 请求 chalk 库，用于实现控制台字符样式
const chalk = require('chalk')
// 请求 fs-extra 库，用于文件操作
const fse = require('fs-extra')
const path = require('path')

// 请求 config.js 文件
const defConfig = require('./config')

// 拼接 config.json 完整路径
const cfgPath = path.resolve(__dirname, '../config.json')
// 拼接 template 模板文件夹完整路径
const tplPath = path.resolve(__dirname, '../template')

async function dlTemplate(LCProjectName) {
  // 参考上方 mirror.js 主代码注释
  const exists = await fse.pathExists(cfgPath)
  if (exists) {
    // 这里记得加 await，在 init.js 调用时使用 async/await 生效
    await dlAction(LCProjectName)
  } else {
    await defConfig()
    // 同上
    await dlAction(LCProjectName)
  }
}

async function dlAction(LCProjectName) {
  // 清空模板文件夹的相关内容，用法见 fs-extra 的 README.md
  try {
    await fse.remove(tplPath)
  } catch (err) {
    console.error(err)
    process.exit()
  }

  // 读取配置，用于获取镜像链接
  // const jsonConfig = await fse.readJson(cfgPath)
  // Spinner 初始设置
  const dlSpinner = ora(chalk.cyan('Downloading template...'))

  // 开始执行等待动画
  dlSpinner.start()
  try {
    // 下载模板后解压
    // await download(jsonConfig.mirror + 'template.zip', path.resolve(__dirname, '../template/'), {
    //   extract: true
    // });
    // 模板文件
    const template = 'direct:https://github.com/hechongchong/vue_admin.git';

    const loading = ora("下载初始化模板中...")
    loading.start()
    // const _projectPath = path.join(process.cwd(),'../')
    // const _projectPaths = path.resolve(__dirname, '../template/');
    const _projectPaths = path.resolve(__dirname, `../${LCProjectName}/`);

    // 下载github模板
    downloads(template, _projectPaths, { clone: true }, err => {
      loading.stop()
      if (err) {
        // console.error(chalk.red('出错了' + err))
      } else {
        //将下载下来的模板的package名称替换掉
        // shell.sed('-i','app',dirname,_projectPath + '/package.json')
        console.log(chalk.green('项目创建成功'))
      }
    })

  } catch (err) {
    // 下载失败时提示
    dlSpinner.text = chalk.red(`Download template failed. ${err}`)
    // 终止等待动画并显示 X 标志
    dlSpinner.fail()
    process.exit()
  }
  // 下载成功时提示
  dlSpinner.text = 'Download template successful.'
  // 终止等待动画并显示 ✔ 标志
  dlSpinner.succeed()
}

// 将上面的 dlTemplate() 方法导出
module.exports = dlTemplate
