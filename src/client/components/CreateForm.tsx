import * as React from "react";
import { Form, Input, InputNumber } from "antd";
import { Product } from "../../types";

interface CreateFormProps {
  setNewProduct: (newProduct: Product) => void;
}

const CreateForm: React.FunctionComponent<CreateFormProps> = (
  props: CreateFormProps
) => {
  const { setNewProduct } = props;
  return (
    <Form
      onFieldsChange={(changedFields, allFields) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setNewProduct(
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

export default CreateForm;
