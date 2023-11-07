import React, { createContext, useEffect } from "react";
import { Layout, theme } from "antd";
import ChatArea from "@components/ChatArea";
import CanvasPane from "@components/CanvasPane";
import ItemProperty from "@components/ItemProperty";
import "./Canvas.css";
import { CanvasDataInterface, useCanvasData } from "@hooks/useCanvasData";
import { useParams } from "react-router";

const { Header, Content, Footer, Sider } = Layout;

export const CanvasContext = createContext<CanvasDataInterface>({} as never);

const Canvas = () => {
  const { canvasId: canvasIdParam } = useParams();
  const {
    canvasId,
    canvasData,
    canvasImageData,
    saveCanvasData,
    saveCanvasImageData,
    saveThumbnail,
    loadTemplate,
    error,
  } = useCanvasData(canvasIdParam ?? "");
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <CanvasContext.Provider
      value={{
        canvasId,
        canvasData,
        canvasImageData,
        saveCanvasData,
        saveCanvasImageData,
        saveThumbnail,
        loadTemplate,
        error,
      }}
    >
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <img src="/img/genius.png" height={50} />
        </Header>
        <Layout>
          <Content style={{ padding: "0 50px" }}>
            <CanvasPane />
          </Content>
          <Sider theme="light" width={"40%"}>
            <div className="canvas-body-div">
              <ItemProperty />
              <ChatArea />
            </div>
          </Sider>
        </Layout>
      </Layout>
    </CanvasContext.Provider>
  );
};

export default Canvas;
