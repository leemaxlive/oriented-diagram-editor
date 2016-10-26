var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    plugins:[
        new ExtractTextPlugin('[name].css')
    ],
    entry:{
        index:['./src/index'],
        app:['./src/d3app/app']
    },
    output: {
        path: './build',
        filename: '[name].js'
    },
    resolve: {
        extensions: ['','.js','.ts','.tsx']
    },
    module: {
        loaders: [
            { 
                test: /\.tsx?$/, 
                loader: 'ts' 
            },
            {
                test: /\.css$/,
                exclude: /^node_modules$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader')
            },
            { 
                test: /\.(png|jpg)$/, 
                loader: 'url?limit=20000&name=[name].[ext]' 
            },
            { 
                test:require.resolve('jquery'), 
                loader: 'expose?jQuery' 
            },
            {
                test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
                exclude: /^node_modules$/,
                loader: 'file?name=[name].[ext]' 
            }
        ]
    },
    devtool:'sourcemap',
    devServer: {
        colors: true,//终端中输出结果为彩色
        historyApiFallback: true,//不跳转
        inline: true//实时刷新
    }
}