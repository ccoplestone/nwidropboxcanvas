const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HTMLPlugin = require('html-webpack-plugin');

const Dotenv = require('dotenv-webpack');

const resourcesPath = path.join(__dirname, 'src');
const isProd = process.env.NODE_ENV === 'production';

// ------------------------------------------------------------------------------------
// Pages (with HTMLPlugin)
// ------------------------------------------------------------------------------------

const htmlMinifyConfig = {
    html5: true,
};

const plugins = [new HTMLPlugin({
    filename: 'index.html',
    minify: isProd ? htmlMinifyConfig : false,
    template: path.resolve(resourcesPath, 'index.html'),
})];

// ------------------------------------------------------------------------------------
// SASS (with ExtractTextPlugin if building for production)
// ------------------------------------------------------------------------------------

const sassLoader = {
    loader: 'sass-loader',
    options: {
        includePaths: [path.resolve(resourcesPath, 'utility/styles')],
    },
};

const localIdentName = '[name]__[local]--[hash:base64:5]';

const styleLoader = isProd ? ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [`css-loader?url=false&modules&localIdentName=${localIdentName}`, sassLoader],
}) : ['style-loader', `css-loader?url=false&modules&localIdentName=${localIdentName}`, sassLoader];

plugins.push(new ExtractTextPlugin('site.[md5:contenthash:hex:20].css'));

// ------------------------------------------------------------------------------------
// Definitions
// ------------------------------------------------------------------------------------

const env = require('env');

const envObj = Object.entries(env).reduce((acc, cur) => {
    const [key, value] = cur;
    acc[key] = JSON.stringify(value);

    return acc;
}, {});

plugins.push(new webpack.DefinePlugin(envObj));

// ------------------------------------------------------------------------------------
// Resolve
// ------------------------------------------------------------------------------------

const resolve = {
    alias: {
        ch: resourcesPath,
    },
    extensions: ['.js', '.scss'],
};

// ------------------------------------------------------------------------------------
// Config
// ------------------------------------------------------------------------------------

plugins.push(new Dotenv());

module.exports = {
    mode: isProd ? 'production' : 'development',
    entry: [
        path.resolve(resourcesPath),
    ],
    output: {
        path: path.resolve(__dirname, 'www'),
        publicPath: './',
        chunkFilename: '[name].bundle.js',
        filename: 'site.[hash].js',
    },
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.scss$/,
            exclude: /node_modules/,
            loader: styleLoader,
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env'],
                },
            },
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
        },
        {
            test: /\.svg$/,
            loaders: [
                'babel-loader',
                {
                    loader: 'react-svg-loader',
                    options: {
                        jsx: true,
                    },
                },
            ],
        }],
    },
    devServer: {
        contentBase: 'public',
        inline: false,
        historyApiFallback: true,
        publicPath: '/',
    },
    node: {
        fs: 'empty',
    },
    plugins,
    resolve,
};
