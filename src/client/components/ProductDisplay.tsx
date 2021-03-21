import * as React from "react";
import { Card, message, Modal, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ErrorResponse, Product } from "../../types";
import { deleteProduct, editProduct, getProducts } from "../api";
import EditForm from "./EditForm";

interface ProductDisplayProps {
  description: string;
  id: number;
  imgUrl: string;
  inventory: number;
  name: string;
  price: number;
  setProducts: (products: Product[]) => void;
}

const { Meta } = Card;

const ProductDisplay: React.FunctionComponent<ProductDisplayProps> = (
  props: ProductDisplayProps
) => {
  const {
    description,
    id,
    imgUrl,
    inventory,
    name,
    price,
    setProducts,
  } = props;
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [updatedProduct, setUpdatedProduct] = React.useState<Product | null>(
    null
  );

  const handleDelete = async () => {
    try {
      await deleteProduct(id);
      const products = await getProducts();
      if ((products as ErrorResponse).error) {
        console.error(products);
        message.error("Error while deleting product");
      } else {
        setProducts(products as Product[]);
        message.success("Product deleted successfully!");
      }
    } catch (error) {
      console.error(error);
      message.error("Error while deleting product");
    }
  };

  const handleEdit = async () => {
    try {
      setIsLoading(true);
      if (!updatedProduct) {
        return message.error("Product has not been updated!");
      }
      const editedProduct = await editProduct(
        updatedProduct.description,
        id,
        updatedProduct.imgUrl,
        updatedProduct.inventory,
        updatedProduct.name,
        updatedProduct.price
      );
      if ((editedProduct as ErrorResponse).error) {
        console.error((editedProduct as ErrorResponse).error);
        setIsLoading(false);
        return message.error("Error while editing product");
      }
      const products = await getProducts();

      if ((products as ErrorResponse).error) {
        console.error((products as ErrorResponse).error);
        setIsLoading(false);
        return message.error("Error while editing product");
      } else {
        setProducts(products as Product[]);
        message.success(
          `Successfully edited ${(editedProduct as Product).name}!`
        );
      }

      setIsEditing(false);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      message.error("Error while editing product");
    }
  };

  return (
    <>
      <Card
        actions={[
          <EditOutlined key="edit" onClick={() => setIsEditing(true)} />,
          <Popconfirm
            cancelText="No"
            key="delete"
            okText="Yes"
            onConfirm={handleDelete}
            title="Are you sure you'd like to delete this product?"
          >
            <DeleteOutlined />
          </Popconfirm>,
        ]}
        cover={<img alt="Product image" src={imgUrl} />}
      >
        <Meta
          description={
            <>
              <div>{description}</div>
              <div>
                <strong>Price: </strong>${price}
              </div>
              <div>
                <strong>Inventory: </strong>
                {inventory}
              </div>
            </>
          }
          title={name}
        />
      </Card>
      <Modal
        confirmLoading={isLoading}
        okText="Edit"
        onCancel={() => setIsEditing(false)}
        onOk={handleEdit}
        title="Edit Product"
        visible={isEditing}
      >
        <EditForm
          description={description}
          imgUrl={imgUrl}
          inventory={inventory}
          name={name}
          price={price}
          setUpdatedProduct={setUpdatedProduct}
        />
      </Modal>
    </>
  );
};

export default ProductDisplay;
