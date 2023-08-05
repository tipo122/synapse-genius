import React from "react";
import { Layout, Menu, Button, theme } from "antd";
import ChatArea from "@components/ChatArea";

const { Header, Content, Footer, Sider } = Layout;

const Canvas = () => {
  return (
    <Layout style={{ minHeight: "80vh" }}>
      <Content>main content</Content>
      <Sider theme="light" width={"40%"}>
        <ChatArea />
      </Sider>
    </Layout>
  );
};

export default Canvas;
