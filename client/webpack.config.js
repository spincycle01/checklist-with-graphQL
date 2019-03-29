const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: ["@babel/polyfill", "./src/index.js"],
  output: {
    path: path.join(__dirname, "./public"),
    filename: "index_bundle.js",
    publicPath: "/"
  }, 
  module: {
    rules: [{
      test: /.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-react', 
            '@babel/preset-env',
            {
              plugins: [
              '@babel/plugin-proposal-class-properties'
              ]
            }
          ]
        }
      }
    }, 
    {
     test: /\.css$/,
     use: ['style-loader', 'css-loader']
    },
    {
      test: /\.(png|jpg|gif)$/,
      use: [
        {
          loader: 'file-loader'
        }
      ]
    }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, './public'),
    port: 8080
    
    // host: 'localhost',
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3000/',
    //     secure: false
    //   }
    // }
  }
}