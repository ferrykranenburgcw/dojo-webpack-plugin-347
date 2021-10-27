const webpack = require("webpack");
const WebpackBuildNotifierPlugin = require("webpack-build-notifier");
const { merge } = require("webpack-merge");

let fs = require("fs");

const commonConfig = require("./webpack.common.js");
const ENV = "development";

// This extends the DEV config!
module.exports = merge(commonConfig({ env: ENV }), {
  output: {
    hotUpdateChunkFilename: "hot/hot-update[id].[fullhash].js",
    hotUpdateMainFilename: "hot/[runtime].[fullhash]-hot-update.json"
  },
  devServer: {
    allowedHosts: "all",
    devMiddleware: {
      writeToDisk: true,
      stats: true
    },
    host: "0.0.0.0",
    port: 9010,
    client: {
      progress: true,
      logging: "info",
      overlay: {
        warnings: true,
        errors: true //display build errors in a overlay directly
      }
    }
  },

  plugins: [
    // notify of a build change / error
    new WebpackBuildNotifierPlugin({
      title: "AuditCase DEV Webpack",
      suppressSuccess: true,
      suppressWarning: true //Do NOT set this to false because it will break the build!
    }),


    // enable HMR
    new webpack.HotModuleReplacementPlugin()
  ],
  mode: "development",
  devtool: "source-map"
});
