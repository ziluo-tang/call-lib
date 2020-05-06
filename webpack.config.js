const path = require('path');
const webpack = require('webpack');
const UglifyESPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: "production",
    entry: './src/call.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'call-lib.js',
        library: 'Call', // 指定类库接口名，用于直接引用(比如script)
        libraryExport: "default", // 对外暴露default属性，就可以直接调用default里的属性
        globalObject: 'this', // 定义全局变量,兼容node和浏览器运行，避免出现"window is not defined"的情况
        libraryTarget: 'umd' // 定义打包方式Universal Module Definition,同时支持在CommonJS、AMD和全局变量使用
    },
    module: {
        rules: [{
            test: /\.js$/,
            include: [
                path.resolve(__dirname, 'src')
            ],
            exclude: '/node_modules',
            loader: "babel-loader",
        }]
    },
    plugins: [
        new webpack.ProvidePlugin({}),
        new UglifyESPlugin({
            // 多嵌套了一层
            uglifyOptions: {
              compress: {
                // 在UglifyJs删除没有用到的代码时不输出警告
                warnings: false,
                // 删除所有的 `console` 语句，可以兼容ie浏览器
                drop_console: true,
                // 内嵌定义了但是只用到一次的变量
                collapse_vars: true,
                // 提取出出现多次但是没有定义成变量去引用的静态值
                reduce_vars: true,
              },
              output: {
                // 最紧凑的输出
                beautify: false,
                // 删除所有的注释
                comments: false,
              }
            }
        })
    ]
}