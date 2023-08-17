import React, { createContext, useEffect } from "react";
import { Layout, Menu, Button, theme } from "antd";
import ChatArea from "@components/ChatArea";
import CanvasPane from "@components/CanvasPane";
import { CanvasDataInterface, useCanvasData } from "@hooks/useCanvasData";
import { useNavigate, useParams } from "react-router";

const { Header, Content, Footer, Sider } = Layout;

export const CanvasContext = createContext<CanvasDataInterface>({} as never);

const Canvas = () => {
  const navigate = useNavigate();
  const { canvasId: canvasIdParam } = useParams();
  const {
    canvasId,
    canvasData,
    canvasImageData,
    saveCanvasData,
    saveCanvasImageData,
    error,
  } = useCanvasData(canvasIdParam ?? "");

  useEffect(() => {
    navigate(`/canvas/${canvasId}`);
  }, [canvasId]);

  return (
    <CanvasContext.Provider
      value={{
        canvasId,
        canvasData,
        canvasImageData,
        saveCanvasData,
        saveCanvasImageData,
        error,
      }}
    >
      <Layout style={{ minHeight: "80vh" }}>
        <Content>
          <CanvasPane />
        </Content>
        <Sider theme="light" width={"40%"}>
          <ChatArea />
        </Sider>
      </Layout>
    </CanvasContext.Provider>
  );
};

export default Canvas;
