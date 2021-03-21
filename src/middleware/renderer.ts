import { Request, Response } from "express";

interface AdjustedResponse extends Response {
  locals: {
    webpack: {
      devMiddleware: {
        readFileSync: (path: string) => string;
        stats: {
          toJson: () => {
            assetsByChunkName: string[][];
            outputPath: string;
          };
        };
      };
    };
  };
}

const parseLocals = (res: AdjustedResponse) => {
  const { devMiddleware } = res.locals.webpack;
  const outputFileSystem = devMiddleware;
  const jsonWebpackStats = devMiddleware.stats.toJson();
  const { assetsByChunkName, outputPath } = jsonWebpackStats;
  const chunkPaths: string[][] = Object.values(assetsByChunkName);
  const assets = chunkPaths.map((fileArr) => fileArr[0]);
  return { assets, outputFileSystem, outputPath };
};

const renderer = (req: Request, res: AdjustedResponse): AdjustedResponse => {
  const { assets, outputFileSystem, outputPath } = parseLocals(res);

  return res.send(`
    <html lang="en">
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Productotron 3000</title>
    <style>
    ${assets
      .filter((path) => path.endsWith(".css"))
      .map((path) =>
        outputFileSystem.readFileSync(path.concat(outputPath, path))
      )
      .join("\n")}
    </style>
    </head>
    <body>
    <div id="root"></div>
    ${assets
      .filter((path) => path.endsWith(".js"))
      .map((path) => `<script src="${path}"></script>`)
      .join("\n")}
    </body>
    </html>`);
};

export default renderer;
