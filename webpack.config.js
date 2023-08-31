const prod = process.env.NODE_ENV === "production";
const fs = require("fs");
const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

var dotenvFiles = [`./.env.local`, `./.env`].filter(Boolean);

dotenvFiles.forEach((dotenvFile) => {
  if (fs.existsSync(dotenvFile)) {
    require("dotenv").config({
      path: dotenvFile,
    });
  }
});

// require("dotenv").config({ path: "./.env.local" });

module.exports = {
  mode: prod ? "production" : "development",
  entry: "./src/index.tsx",
  output: {
    path: __dirname + "/dist/",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: [".ts", ".tsx", ".js", ".json"],
        },
        use: "ts-loader",
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
  },
  devtool: prod ? undefined : "source-map",
  plugins: [
    prod
      ? new CopyPlugin({
          patterns: [{ from: "public", to: "" }],
        })
      : new HtmlWebpackPlugin({
          template: "./public/index.html",
        }),
    new MiniCssExtractPlugin(),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
  ],
  resolve: {
    alias: {
      "@models": path.join(__dirname, "src/models"),
      "@domain-types": path.join(__dirname, "src/domain-types"),
      "@components": path.join(__dirname, "src/components"),
      "@containers": path.join(__dirname, "src/containers"),
      "@pages": path.join(__dirname, "src/pages"),
      "@hooks": path.join(__dirname, "src/hooks"),
    },
  },
};
