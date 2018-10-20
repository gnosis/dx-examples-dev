const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (_, { mode }) => {
  // some code depends on it before process.env is inlined with DefinePlugin
  // like inline_render.js
  // and cache loader uses it as an identifier
  if (process.env.NODE_ENV === undefined) process.env.NODE_ENV = mode
  const prodBuild = mode === 'production'

  const output = {
    filename: prodBuild ? '[name].[chunkhash].js' : '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  }

  const plugins = [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      ETH_NETWORK: 'local',
    }),
  ]

  if (prodBuild) {
    plugins.push(new MiniCssExtractPlugin({
      filename: 'dxfrontend-[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }))
  }
  return {
    devtool: mode === 'development' && 'module-source-map',
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            prodBuild ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                minimize: prodBuild,
              },
            },
          ],
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: path.resolve(__dirname, './inline_render.js'),
          use: [
            'cache-loader',
            'html-loader',
            'val-loader',
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
    },
    plugins,
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
    output,
  }
}
