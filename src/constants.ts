import path from "path";
import { Product } from "./types";

export const productsFilePath = path.join(__dirname, "./db/products.json");

export const starterProducts: Product[] = [
  {
    id: 1,
    name: "Product A",
    description: "Probably the least reliable one on the list",
    price: 120,
    inventory: 10,
    imgUrl:
      "https://images.unsplash.com/photo-1584942368913-b98dd9983c7e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixlib=rb-1.2.1&q=80&w=400",
  },
  {
    id: 2,
    name: "Product B",
    description: "Solid and stable version of Product A",
    price: 10,
    inventory: 100,
    imgUrl:
      "https://images.unsplash.com/photo-1584559106175-85ba196ebe2c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixlib=rb-1.2.1&q=80&w=400",
  },
  {
    id: 3,
    name: "Product C",
    description: "Solid and stable version of Product B",
    price: 50,
    inventory: 0,
    imgUrl:
      "https://images.unsplash.com/photo-1586283970632-8264074606be?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixlib=rb-1.2.1&q=80&w=400",
  },
  {
    id: 4,
    name: "Product D",
    description: "Solid and stable version of Product C",
    price: 70,
    inventory: 15,
    imgUrl:
      "https://images.unsplash.com/photo-1585489869354-4ef071875398?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixlib=rb-1.2.1&q=80&w=400",
  },
  {
    id: 5,
    name: "Product E",
    description: "Better than most things in Walmart",
    price: 20,
    inventory: 10,
    imgUrl:
      "https://images.unsplash.com/photo-1586763209828-f0fa0773f19e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixlib=rb-1.2.1&q=80&w=400",
  },
  {
    id: 6,
    name: "Product F",
    description: "Too expensive, brand loyalty will burn a hole in your wallet",
    price: 100,
    inventory: 20,
    imgUrl:
      "https://images.unsplash.com/photo-1584466769623-4671db483b1a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixlib=rb-1.2.1&q=80&w=400",
  },
];
