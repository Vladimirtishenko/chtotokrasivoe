
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var poststylus = require('poststylus');
var rucksack = require('rucksack-css');
var stylusLoader = ExtractTextPlugin.extract("style-loader", "css-loader?minimize!stylus-loader");

module.exports = {
    entry: {
        app: './public/js/controller.js',
        manage: './public/js/manage/controller_manage.js'
    },
    output: {
        path: "./public/build/",
        filename: 'build.[name].js'
    },
    watch: true,
    watchOptions: {
        poll: true
    },
    module: {
        loaders: [
        {
            test: /\.styl$/,
            loader: stylusLoader
        },
        {
            test: /\.js?$/,
            exclude: /(node_modules)/,
            loader: "babel",
            query: {
                presets: ['es2015']
            }
        },
        {
            test: /\.(jpg|png|woff|woff2|eot|ttf|svg|otf)$/, 
            loader: 'url-loader?limit=100000'
        }
        ]
    },
    resolve: {
        modulesDirectories: ["node_modules"],
        extensions: ["", ".js", "css", "styl", "woff", "ttf", "otf", "jpg"]
	},
    stylus: {
	  use: [
	    poststylus(rucksack({
		  autoprefixer: true
		}))
	  ]
	},
    plugins: [
        new ExtractTextPlugin("build.[name].css")
    ]
}