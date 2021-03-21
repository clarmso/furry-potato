import { ErrorResponse, Product } from "../types";

export const createProduct = async (
  description: string,
  imgUrl: string,
  inventory: number,
  name: string,
  price: number
): Promise<Product | ErrorResponse> => {
  try {
    const response = await fetch("/products", {
      body: JSON.stringify({ description, imgUrl, inventory, name, price }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { error };
  }
};

export const deleteProduct = async (
  id: number
): Promise<void | ErrorResponse> => {
  try {
    await fetch(`/products/${id}`, {
      headers: { Accept: "application/json" },
      method: "DELETE",
    });
  } catch (error) {
    return { error };
  }
};

export const editProduct = async (
  description: string,
  id: number,
  imgUrl: string,
  inventory: number,
  name: string,
  price: number
): Promise<Product | ErrorResponse> => {
  try {
    const response = await fetch(`/products/${id}`, {
      body: JSON.stringify({ description, imgUrl, inventory, name, price }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
    });
    const data: Product = await response.json();
    return data;
  } catch (error) {
    return { error };
  }
};

export const getProducts = async (): Promise<Product[] | ErrorResponse> => {
  try {
    const response = await fetch("/products", {
      headers: { Accept: "application/json" },
      method: "GET",
    });
    const data: Product[] = await response.json();
    return data;
  } catch (error) {
    return { error };
  }
};
