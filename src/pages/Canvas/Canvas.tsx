import React from "react";
import { Layout, Menu, Button, theme } from "antd";
import ChatArea from "@components/ChatArea";
import CanvasPane from "@components/CanvasPane";
import ItemProperty from "@components/ItemProperty";
import "./Canvas.css";

const { Header, Content, Footer, Sider } = Layout;

const Canvas = () => {
  return (
    <Layout style={{ minHeight: "80vh" }}>
      <Content>
        <CanvasPane />
      </Content>
      <Sider theme="light" width={"40%"}>
        <div className="canvas-body-div">
          <ItemProperty />
          <ChatArea />
        </div>
      </Sider>
    </Layout>
  );
};

export default Canvas;
