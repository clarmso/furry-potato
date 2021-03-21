import express, { Application } from "express";
import fse from "fs-extra";
import morgan from "morgan";
import path from "path";
import compiler from "./middleware/compiler";
import renderer from "./middleware/renderer";
import { productsFilePath, starterProducts } from "./constants";
import { Controller, Mode } from "./types";

class Server {
  public app: Application;
  public mode: Mode;
  public port: string;

  constructor(controllers: Controller[], mode: Mode, port: string) {
    this.app = express();
    this.mode = mode;
    this.port = port;

    this.initializeJsonDb();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeRenderer();
  }

  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller) => this.app.use("/", controller.router));
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(morgan("dev"));
  }

  private async initializeJsonDb(): Promise<void> {
    await fse.ensureFile(productsFilePath);
    await fse.writeJSON(productsFilePath, starterProducts);
  }

  private initializeRenderer(): void {
    if (this.mode === "development") {
      this.app.use(compiler());
      this.app.use(renderer);
    } else {
      const clientPath = path.join(__dirname, "./dist");
      this.app.use(express.static(clientPath));
    }
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`\nServer Mode: ${this.mode}`);
      console.log(`Server is listening on port: ${this.port}\n`);
    });
  }
}

export default Server;
