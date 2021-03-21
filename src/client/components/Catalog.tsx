import * as React from "react";
import { Col, Row, Typography } from "antd";
import ProductDisplay from "./ProductDisplay";
import { Product } from "../../types";

interface CatalogProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
}

const { Title } = Typography;

const Catalog: React.FunctionComponent<CatalogProps> = (
  props: CatalogProps
) => {
  const { products, setProducts } = props;
  return (
    <>
      <Title level={2}>Product Catalog</Title>
      <Row align="top" gutter={[16, 16]}>
        {products.map((product) => (
          <Col key={product.id} span={8}>
            <ProductDisplay {...product} setProducts={setProducts} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Catalog;
