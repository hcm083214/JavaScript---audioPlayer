const path = require('path');
const webpack = require("webpack");
// const NODE_ENV = 'demo'; //设置未演示环境，数据全部来源于本地，不需要部署后端接口
const NODE_ENV = 'development';
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, "dist"), // string
    },
    devtool: 'source-map',
    //设置环境变量
    plugins: [
        new webpack.DefinePlugin({
            "process.env":JSON.stringify(NODE_ENV)
        })
    ]
}
