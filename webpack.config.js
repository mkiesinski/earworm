const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const dist = './dist';

module.exports = {
  mode: 'development',
  entry: {
    main: './src',
    playground: './src/playground',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Alerts",
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      title: "Playground",
      template: "src/playground/index.ejs",
      filename: "playground.html",
      chunks: ['playground']
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "media", to: "media" },
      ]
    })
  ]
};


