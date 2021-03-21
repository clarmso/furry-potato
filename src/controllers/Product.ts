import { Request, Response, Router } from "express";
import fse from "fs-extra";
import { productsFilePath } from "../constants";
import { Product } from "../types";

class ProductController {
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/products", async (req: Request, res: Response) => {
      try {
        const existingProducts: Product[] = await fse.readJSON(
          productsFilePath
        );

        const product: Product = {
          description: req.body.description,
          id: existingProducts.length + 1,
          imgUrl: req.body.imgUrl,
          inventory: req.body.inventory,
          name: req.body.name,
          price: req.body.price,
        };
        existingProducts.push(product);
        await fse.writeJSON(productsFilePath, existingProducts);
        return res.status(201).send(product);
      } catch (error) {
        console.error(error);
        return res.status(500).send({ error });
      }
    });
    this.router.get("/products", async (req: Request, res: Response) => {
      try {
        const existingProducts: Product[] = await fse.readJSON(
          productsFilePath
        );
        return res.send(existingProducts);
      } catch (error) {
        console.error(error);
        return res.status(500).send({ error });
      }
    });
    this.router.patch("/products/:id", async (req: Request, res: Response) => {
      try {
        const products: Product[] = await fse.readJSON(productsFilePath);
        const productIndex = products.findIndex(
          (product) => product.id === Number(req.params.id)
        );
        if (productIndex < 0) {
          return res.status(500).send({
            error: "No matching product!",
            products,
            id: req.params.id,
          });
        }
        const updatedProduct = { ...products[productIndex] };
        const updates = Object.keys(req.body);
        updates.forEach(
          (update) => (updatedProduct[update] = req.body[update])
        );
        products.splice(productIndex, 1, updatedProduct);
        await fse.writeJSON(productsFilePath, products);

        return res.send(products[productIndex]);
      } catch (error) {
        console.error(error);
        return res.status(500).send({ error });
      }
    });
    this.router.delete("/products/:id", async (req: Request, res: Response) => {
      try {
        const products: Product[] = await fse.readJSON(productsFilePath);
        const productIndex = products.findIndex(
          (product) => product.id === Number(req.params.id)
        );
        products.splice(productIndex, 1);
        await fse.writeJSON(productsFilePath, products);

        return res.send();
      } catch (error) {
        console.error(error);
        return res.status(500).send({ error });
      }
    });
  }
}

export default ProductController;
