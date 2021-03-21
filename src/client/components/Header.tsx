import * as React from "react";
import { Layout, Typography } from "antd";

const Header: React.FunctionComponent<unknown> = () => {
  return (
    <Layout.Header>
      <Typography.Title level={1}>Productotron 3000</Typography.Title>
    </Layout.Header>
  );
};

export default Header;
