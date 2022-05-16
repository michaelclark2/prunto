const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    new HtmlWebpackPlugin({
      template: "public/index.html",
    }),
  ],
  resolve: {
    fallback: {
      url: require.resolve("url/"),
      os: require.resolve("os-browserify/"),
      https: require.resolve("https-browserify"),
      stream: require.resolve("stream-browserify"),
      http: require.resolve("stream-http"),
      crypto: require.resolve("crypto-browserify"),
      assert: require.resolve("assert"),
      buffer: require.resolve("buffer"),
      fs: false,
      net: false,
    },
  },
};
