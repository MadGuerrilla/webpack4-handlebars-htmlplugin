'use strict';
const webpack = require('webpack');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const styleLintPlugin = require('stylelint-webpack-plugin');
const uglifyJsPlugin = require('uglifyjs-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const optimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const compressionPlugin = require('compression-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: './app/app.js',
    optimization: {
        minimizer: [
            new uglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            }),
            new optimizeCSSAssetsPlugin(),
            new compressionPlugin({
                test: /\.(js|css)$/
            })
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            BROWSER_SUPPORTS_HTML5: true,
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV) || 'development'
            }
        }),
        new cleanWebpackPlugin('./dist'),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Tether: 'tether',
            'window.Tether': 'tether',
            Popper: ['popper.js', 'default'],
            Alert: 'exports-loader?Alert!bootstrap/js/dist/alert',
            Button: 'exports-loader?Button!bootstrap/js/dist/button',
            Carousel: 'exports-loader?Carousel!bootstrap/js/dist/carousel',
            Collapse: 'exports-loader?Collapse!bootstrap/js/dist/collapse',
            Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
            Modal: 'exports-loader?Modal!bootstrap/js/dist/modal',
            Popover: 'exports-loader?Popover!bootstrap/js/dist/popover',
            Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/dist/scrollspy',
            Tab: 'exports-loader?Tab!bootstrap/js/dist/tab',
            Tooltip: 'exports-loader?Tooltip!bootstrap/js/dist/tooltip',
            Util: 'exports-loader?Util!bootstrap/js/dist/util',
        }),
        new htmlWebpackPlugin({
            filename: 'index.html',
            inject: true,
            template: '!!handlebars-loader!./app/assets/hbs/index/index.hbs',
            templateParameters: require('./app/assets/hbs/index/index.json')
        }),
        new styleLintPlugin({
            failOnError: false,
            configFile: '.stylelintrc.json'
        }),
        new miniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'css/[id].css',
        })
    ],
    module: {
        rules: [{
            test: /\.(sa|sc|c)ss$/,
            use: [
                devMode ? 'style-loader' : miniCssExtractPlugin.loader,
                'css-loader',
                'postcss-loader',
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true
                    }
                }
            ]
        }]
    }
}
