# 速米服务器

## 安装
```bash
# 安装白名单插件
$ npm install egg-cors或者
$ yarn add egg-cors
# 安装支持PHP序列化插件
$ npm install locutus
# 安装request
$ npm install request
$ npm install iconv-lite
```

## 命令
```bash
# 正式环境启动，通过修改命令行参数修改端口
$ yarn start

# 调试环境启动
$ yarn dev

# 运行单元测试
$ yarn test
```

## 调试
```bash
# 1. 本地执行yarn debug
# 2. 在Controller的类中设置断点，在router.js中设置无效
# 3. 切换到VSCode的调试面板，选择Attach Worker调试方式，F5开始调试
```