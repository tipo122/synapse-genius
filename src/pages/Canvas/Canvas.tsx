import React, { createContext, useEffect } from "react";
import { Layout } from "antd";
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
    error,
  } = useCanvasData(canvasIdParam ?? "");

  return (
    <CanvasContext.Provider
      value={{
        canvasId,
        canvasData,
        canvasImageData,
        saveCanvasData,
        saveCanvasImageData,
        saveThumbnail,
        error,
      }}
    >
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
    </CanvasContext.Provider>
  );
};

export default Canvas;
