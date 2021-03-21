import * as React from "react";
import { Layout } from "antd";
import { getProducts } from "./api";
import { ErrorResponse, Product } from "../types";
import Catalog from "./components/Catalog";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

const { Content, Sider } = Layout;

const App: React.FunctionComponent<unknown> = () => {
  const [products, setProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    getProducts()
      .then((products) => {
        if ((products as ErrorResponse).error) {
          console.error(products);
        } else {
          setProducts(products as Product[]);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <Layout>
      <Header />
      <Layout>
        <Sider>
          <Sidebar setProducts={setProducts} />
        </Sider>
        <Content style={{ padding: "25px" }}>
          <Catalog products={products} setProducts={setProducts} />
        </Content>
      </Layout>
      <Footer />
    </Layout>
  );
};

export default App;
