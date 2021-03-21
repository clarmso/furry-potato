import { Router } from "express";

export type Controller = {
  router: Router;
};

export interface ErrorResponse {
  error: string;
}

export type Mode = "production" | "development";

export interface Product {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  description: string;
  id: number;
  imgUrl: string;
  inventory: number;
  name: string;
  price: number;
}
