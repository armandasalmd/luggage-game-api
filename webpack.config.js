const path = require("path");
const { NODE_ENV = "production" } = process.env;
const nodeExternals = require("webpack-node-externals");
const WebpackShellPlugin = require("webpack-shell-plugin-next");

module.exports = {
    entry: "./src/index.ts",
    mode: NODE_ENV.trim(),
    target: "node",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "index.js",
    },
    resolve: {
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
    plugins: [
        new WebpackShellPlugin({
            onBuildEnd: {
                scripts: ["yarn run:dev"],
                parallel: true,
            },
        }),
    ],
};
