module.exports = {
  "presets": [
    [
      "@babel/preset-env", {
      useBuiltIns: "entry",
      corejs: {
        version: "3",
        proposals: true
      },
      targets: {
        browsers: [
          "edge >= 17",
          "ie >= 11"
        ]
      }
    }
    ],
    "@babel/preset-typescript",
  ],
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose": false }],
    ["@babel/plugin-proposal-private-methods", { "loose": false }],
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-transform-object-assign",
    "@babel/plugin-transform-arrow-functions",
    "@babel/plugin-syntax-dynamic-import",
    "@babel/transform-runtime"
  ]
};
