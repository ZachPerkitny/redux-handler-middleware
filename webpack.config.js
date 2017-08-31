const webpack = require('webpack');
const path = require('path');
const { NODE_ENV } = process.env;

const config = {
    entry: './src/index.js',
    output:{
        path: path.join(__dirname, 'lib'),
        filename:'index.js',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders:[
            {
                test:/(\.jsx|\.js)$/,
                loader:'babel-loader?presets[]=es2015',
                exclude: /(node_modules)/
            }
        ]
    },
    plugins:[]
};

if(NODE_ENV === 'production'){
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin()
    );
    config.plugins.push(
        new webpack.optimize.AggressiveMergingPlugin()
    )
}

module.exports = config;