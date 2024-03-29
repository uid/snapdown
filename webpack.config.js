"use strict";

const path = require("path");

const webpack = require("webpack");

const pkg = require("./package.json");
const pkglock = require("./package-lock.json");
const repo = pkg.repository.replace("github:", "https://github.com/");

const abs = (f) => path.resolve(__dirname, f);

const banner = `${pkg.version}\n${pkg.homepage}\n${repo}`;

module.exports = [
  {
    entry: ["./src/index.js"],
    output: {
      path: abs("dist"),
      filename: "snapdown.js",
      library: "Snapdown",
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.js$/,
          include: /src/,
          use: {
            loader: "babel-loader",
            options: { presets: ["babel-preset-env", "react"] },
          },
        },
      ],
    },
    resolve: {
      alias: {
        elkjs: abs("node_modules/elkjs/lib/elk-api.js"),
        "js-yaml": abs("node_modules/js-yaml/dist/js-yaml.js"),
        "yaml-front-matter": abs(
          "node_modules/yaml-front-matter/dist/yamlFront.js"
        ),
        "snapdown-parser": abs("dist/snapdown-parser.js"),
      },
    },
    plugins: [
      new webpack.BannerPlugin(`Snapdown ${banner}`),
      new webpack.DefinePlugin({
        ELK_WORKER_URL: `"https://unpkg.com/elkjs@${pkglock.dependencies.elkjs.version}/lib/elk-worker.min.js"`,
      }),
    ],
  },
  {
    entry: ["./web/app.js"],
    output: {
      path: abs("static"),
      filename: "snapdown-app.js",
      library: "SnapdownWeb",
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.js$/,
          include: /web/,
          use: {
            loader: "babel-loader",
            options: { presets: ["babel-preset-env", "react"] },
          },
        },
      ],
    },
    resolve: {
      alias: {
        elkjs: abs("node_modules/elkjs/lib/elk-api.js"),
        "js-yaml": abs("node_modules/js-yaml/dist/js-yaml.js"),
        "yaml-front-matter": abs(
          "node_modules/yaml-front-matter/dist/yamlFront.js"
        ),
        "snapdown-parser": abs("dist/snapdown-parser.js"),
      },
    },
    plugins: [
      new webpack.BannerPlugin(`Snapdown App ${banner}`),
      new webpack.DefinePlugin({
        ELK_WORKER_URL: `"https://unpkg.com/elkjs@${pkglock.dependencies.elkjs.version}/lib/elk-worker.min.js"`,
      }),
    ],
  },
];
