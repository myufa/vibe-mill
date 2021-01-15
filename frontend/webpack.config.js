const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
// const InterpolateHtmlPlugin = require('interpolate-html-plugin')
module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.tsx'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  devtool: "source-map",
  mode: "development",
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, 'dist'),
    port: 3000
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['ts-loader']
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]'
              }
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html/,
        use: ['html-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        exclude: /node_modules/,
        use: ['file-loader?name=[name].[ext]'] // ?name=[name].[ext] is only necessary to preserve the original file name
      },
      {
        test: /\.woff(2)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: './font/[hash].[ext]',
              mimetype: 'application/font-woff'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
      filename: './index.html',
      manifest: "./manifest.json",
      favicon: "./public/mill.svg",
    }),
    new WebpackManifestPlugin({
      publicPath:'public/',
      filter: (file) => !file.path.match(/\.map$/),
      map: (file) => {
        const extension = path.extname(file.name).slice(1)

        return {
          ...file,
          name: ['css', 'js'].includes(extension) ?
            `${extension}/${file.name}` :
             file.name
        }
      }
    })
    // new InterpolateHtmlPlugin({
    //   PUBLIC_URL: 'static' // can modify `static` to another name or get it from `process`
    // }),
  ]
};