import * as React from "react";
import { Menu, message, Modal } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import CreateForm from "./CreateForm";
import { createProduct, getProducts } from "../api";
import { ErrorResponse, Product } from "../../types";

interface SidebarProps {
  setProducts: (products: Product[]) => void;
}

const Sidebar: React.FunctionComponent<SidebarProps> = (
  props: SidebarProps
) => {
  const { setProducts } = props;
  const [isCreating, setIsCreating] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [newProduct, setNewProduct] = React.useState<Product | null>(null);

  const handleCreate = async () => {
    setIsLoading(true);
    if (!newProduct) {
      setIsLoading(false);
      return message.error("No product");
    }
    const product = await createProduct(
      newProduct.description,
      newProduct.imgUrl,
      newProduct.inventory,
      newProduct.name,
      newProduct.price
    );
    if ((product as ErrorResponse).error) {
      setIsLoading(false);
      return message.error((product as ErrorResponse).error);
    }
    const products = await getProducts();
    if ((products as ErrorResponse).error) {
      setIsLoading(false);
      return message.error((product as ErrorResponse).error);
    }
    setProducts(products as Product[]);
    setIsLoading(false);
    setIsCreating(false);
    message.success(`Created ${newProduct.name} successfully!`);
  };

  return (
    <Menu theme="dark" mode="inline">
      <Menu.Item
        disabled={isCreating}
        icon={<PlusCircleOutlined />}
        onClick={() => setIsCreating(true)}
      >
        Create Product
      </Menu.Item>
      <Modal
        confirmLoading={isLoading}
        okText="Create"
        onCancel={() => setIsCreating(false)}
        onOk={handleCreate}
        title="Create Product"
        visible={isCreating}
      >
        <CreateForm setNewProduct={setNewProduct} />
      </Modal>
    </Menu>
  );
};

export default Sidebar;
