import webpack, { Configuration } from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const compiler = (): any => {
  const config: Configuration = {
    entry: "./src/client/index.tsx",
    mode: "development",
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.svg$/,
          type: "assets/inline",
        },
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: ["ts-loader"],
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    stats: "normal",
  };
  const compileInstance = webpack(config);

  return webpackDevMiddleware(compileInstance, {
    serverSideRender: true,
  });
};

export default compiler;
