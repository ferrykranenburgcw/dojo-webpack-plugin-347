const DojoWebpackPlugin = require("dojo-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require("path");
const webpack = require("webpack");

module.exports = options => ({
  devtool: "",
  context: __dirname,
  target: ["web", "es5"],
  entry: ["ac_build_bootstrap"],
  output: {
    libraryTarget: "this",
    path: path.join(__dirname, "nl.c2c.ac.resources/web/webpack/dist"),
    publicPath: "/ac-resources/webpack/dist/",
    pathinfo: false,
    filename: "auditcase.js",
    chunkFilename: "auditcase.[name].js?chunkhash=[chunkhash]",
    clean: true
  },
  stats: {
    builtAt: true,
    errors: true,
    errorDetails: true
  },
  externals: [],
  performance: {
    hints: false
  },
  resolve: {
    extensions: [".ts", ".js", ".vue"],
    alias: {
      jquery: path.resolve(path.join(__dirname, "node_modules", "jquery")), //make sure only THIS version of jquery is used, not any other nested one..
      vue$: "vue/dist/vue.common.js",
      "css": path.resolve(path.join(__dirname, "nl.c2c.ac.resources/web/css")),
      "vuejs": path.resolve(path.join(__dirname, "nl.c2c.ac.resources/web/vuejs")),
      "@": path.resolve(path.join(__dirname, "nl.c2c.ac.resources/web/vuejs")),
      "#": path.resolve(path.join(__dirname, "nl.c2c.ac.resources/web/css"))
    }
  },
  resolveLoader: {
    alias: {
      "dojo/i18n": path.resolve(__dirname, "node_modules", "dojo-webpack-plugin", "loaders", "dojo", "i18n")
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.(j|t)s$/,
        include: [
          path.resolve(__dirname, "nl.c2c.ac.resources/web/vuejs"),
          path.resolve(__dirname, "nl.c2c.ac.resources/web/js"),
          path.resolve(__dirname, "nl.c2c.ac.resources/web/sources"),

          // The following list is needed to be parsed by Babel processor (we need this for IE11 support)
          path.resolve(__dirname, "node_modules/query-string"),
          path.resolve(__dirname, "node_modules/vuex-dot"),
          path.resolve(__dirname, "node_modules/@microsoft"),
          path.resolve(__dirname, "node_modules/@popperjs"),
          path.resolve(__dirname, "node_modules/vue-unique-id"),
          path.resolve(__dirname, "node_modules/split-on-first"),
          path.resolve(__dirname, "node_modules/strict-uri-encode"),
          path.resolve(__dirname, "node_modules/jodit"),
          path.resolve(__dirname, "js/mixins")
        ],
        use: [
          {
            loader: "babel-loader",
            options: {
              babelrc: false,
              configFile: path.resolve(__dirname, "babel.config.js"),
              compact: false,
              cacheDirectory: true,
              sourceMaps: false
            }
          }
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        include: [
          path.resolve(__dirname, "node_modules"),
          path.resolve(__dirname, "nl.c2c.ac.resources/web/css"),
          path.resolve(__dirname, "nl.c2c.ac.resources/web/vuejs"),
          path.resolve(__dirname, "nl.c2c.ac.resources/web/js"),
          path.resolve(__dirname, "nl.c2c.ac.resources/web/sources")
        ],
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              implementation: require("node-sass"),
              sassOptions: {
                includePaths: ["nl.c2c.ac.resources/web/css/"]
              }
            }
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/"
            }
          }
        ],
        type: "javascript/auto"
      },

      {
        test: /\.(png)|(gif)|(swf)|(xap)|(ico)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 100000
            }
          }
        ],
        type: "javascript/auto"
      },
      {
        test: /[\/]jquery\.js$/,
        use: "expose-loader?$!expose?jQuery"
      }
    ]
  },
  plugins: [

    // complete support for Dojo Toolkit
    new DojoWebpackPlugin({
      noConsole: true,
      loaderConfig: require("./ac_build_loaderConfig"),
      environment: {
        dojoRoot: "/ac-resources/webpack",
        auditCaseJSRoot: "/ac-resources/webpack/js",
        sourcesRoot: "/ac-resources/sources"
      }, // used at run time for non-packed resources (e.g. blank.gif)
      buildEnvironment: {
        dojoRoot: path.resolve(__dirname, "node_modules"),
        auditCaseJSRoot: path.resolve(__dirname, "nl.c2c.ac.resources/web/js"),
        sourcesRoot: path.resolve(__dirname, "nl.c2c.ac.resources/web/sources")
      }, // used at build time
      locales: ["nl"]
    }),

    // This is a 'fix' for Dojo...
    new webpack.NormalModuleReplacementPlugin(/^dojox\/gfx\/renderer!/, "dojox/gfx/canvas"),

    // fix dojo/domReady! problem... (problem described here https://github.com/OpenNTF/dojo-webpack-plugin/issues/167, solution described here https://www.sitepen.com/blog/2013/04/17/dojodomready-vs-dojoready/)
    new webpack.NormalModuleReplacementPlugin(/^dojo\/domReady!/, function(data) {
      data.request = data.request.replace(/^dojo\/domReady!/, "dojo/domReady");
    }),

    // for seperate CSS file with source map
    new MiniCssExtractPlugin({
      filename: "auditcase.css",
      ignoreOrder: true
    }),

    // "dojo.require!" is used by Xpages XSP libraries currently, so redirect it to our dummy xsp helper file. See the file itself why and how it works
    new webpack.NormalModuleReplacementPlugin(/^dojo\/require!/, function(data) {
      data.request = data.request.replace(/^dojo\/require!/, "!!raw-loader!");
      data.request = data.request.replace(/.*?[,].*?$/, "ac/dojo/utils/XspHelper");
    }),

    // do not set chunk count to less than 3, dev server won't start anymore with
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 3
    })
  ]
});
