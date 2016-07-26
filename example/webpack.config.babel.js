import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  entry: {
    main: './app/scripts/app.js'
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.css'],
    alias: {
      'styles': __dirname + '/app/styles',
      'components': __dirname + '/app/scripts',
    }
  },
  module: {
    loaders: [
      {test: /\.scss$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')},
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
    new HtmlWebpackPlugin({
      hash: true,
      template: 'app/index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: false
      }
    })
  ]
}
