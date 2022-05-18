const path = require("path");
const { NODE_ENV = "production" } = process.env;
const nodeExternals = require("webpack-node-externals");
const WebpackShellPlugin = require("webpack-shell-plugin-next");

const onBuildEnd = new WebpackShellPlugin({
  onBuildEnd: {
    scripts: ["yarn run:dev"],
    parallel: true,
  },
});

module.exports = {
  entry: "./src/index.ts",
  mode: NODE_ENV.trim(),
  devtool: "source-map",
  target: "node",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "index.js",
  },
  resolve: {
    alias: {
      "@core": path.resolve(__dirname, "src/core"),
      "@database": path.resolve(__dirname, "src/database"),
      "@databaseRedis": path.resolve(__dirname, "src/databaseRedis"),
      "@features": path.resolve(__dirname, "src/features"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@utils": path.resolve(__dirname, "src/utils"),
    },
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ["ts-loader"],
      },
    ],
  },
  externals: [nodeExternals()],
  watch: NODE_ENV.trim() === "development",
  plugins: NODE_ENV.trim() === "development" ? [onBuildEnd] : [],
};
