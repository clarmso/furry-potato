import * as React from "react";
import { Form, Input, InputNumber } from "antd";
import { Product } from "../../types";

interface EditFormProps {
  description: string;
  imgUrl: string;
  inventory: number;
  name: string;
  price: number;
  setUpdatedProduct: (editProduct: Product | null) => void;
}

const EditForm: React.FunctionComponent<EditFormProps> = (
  props: EditFormProps
) => {
  const {
    description,
    imgUrl,
    inventory,
    name,
    price,
    setUpdatedProduct,
  } = props;
  return (
    <Form
      initialValues={{ description, imgUrl, inventory, name, price }}
      onFieldsChange={(changedFields, allFields) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setUpdatedProduct(
          allFields.reduce((previousValue: any, currentValue: any) => {
            previousValue[currentValue.name[0]] = currentValue.value;
            return previousValue;
          }, {})
        );
      }}
    >
      <Form.Item label="Name" name="name">
        <Input />
      </Form.Item>
      <Form.Item label="Description" name="description">
        <Input />
      </Form.Item>
      <Form.Item label="Image URL" name="imgUrl">
        <Input />
      </Form.Item>
      <Form.Item label="Price" name="price">
        <InputNumber
          formatter={(value) =>
            `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          min={0}
        />
      </Form.Item>
      <Form.Item label="Inventory" name="inventory">
        <InputNumber min={0} />
      </Form.Item>
    </Form>
  );
};

export default EditForm;
