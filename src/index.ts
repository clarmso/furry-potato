import Server from "./server";
import ProductController from "./controllers/Product";
import { Controller, Mode } from "./types";

const main = async (): Promise<void> => {
  try {
    let mode: Mode = "production";

    if (process.env.NODE_ENV && process.env.NODE_ENV === "development") {
      mode = "development";
    }

    const controllers: Controller[] = [new ProductController()];
    const server = new Server(controllers, mode, "3000");

    server.listen();
  } catch (error) {
    console.error(error);
  }
};

main();
