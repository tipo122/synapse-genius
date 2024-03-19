import React, { createContext, useEffect, useState } from "react";
import { Button, Drawer, Input, Layout, theme } from "antd";
import ChatArea from "@components/ChatArea";
import CanvasPane from "@components/CanvasPane";
import ItemProperty from "@components/ItemProperty";
import "./Canvas.css";
import { CanvasDataInterface, useCanvasData } from "@hooks/useCanvasData";
import { useNavigate, useParams } from "react-router";
import { FabricJSEditor, useFabricJSEditor } from "@hooks/useFabricJSEditor";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import NorthWestIcon from "@mui/icons-material/NorthWest";
import InterestsIcon from "@mui/icons-material/Interests";
import { SketchPicker } from "react-color";
import type { MenuProps } from "antd";
import { Menu } from "antd";

import TextDrawer from "@components/TextDrawer";
import OtherDrawer from "@components/OtherDrawer";
import ObjectDrawer from "@components/ObjectDrawer";
import ImageDrawer from "@components/ImageDrawer";
import GptTextViewer from "@components/GptTextViewer";

const { Header, Content, Footer, Sider } = Layout;

interface CanvasContexxtInterface extends CanvasDataInterface {
  editor: FabricJSEditor | undefined;
  selectedObjects: any;
  onReady: any;
  handleDrop: (event: any) => void;
  setDropItem: (item: string) => void;
}

export const CanvasContext = createContext<CanvasContexxtInterface>(
  {} as never
);

const Canvas = () => {
  enum DRAWER {
    NONE,
    OBJECT,
    TEXT,
    IMAGE,
    OTHER,
  }

  const { canvasId: canvasIdParam } = useParams();
  const {
    canvasId,
    canvasData,
    canvasImageData,
    saveCanvasData,
    saveCanvasImageData,
    saveThumbnail,
    isLoading,
    error,
  } = useCanvasData(canvasIdParam ?? "");
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { selectedObjects, editor, onReady, handleDrop, setDropItem } =
    useFabricJSEditor({ onChange: saveCanvasImageData });

  const [openDrawer, setOpenDrawer] = useState<number>(DRAWER.NONE);
  const [strokeColorPane, setStrokeColorPane] = useState<boolean>(false);
  const [strokeColor, setStrokeColor] = useState<string>("");
  const [fillColorPane, setFillColorPane] = useState<boolean>(false);
  const [fillColor, setFillColor] = useState<string>("");
  const navigate = useNavigate();

  const onSetStrokeColor = (color) => {
    setStrokeColor(color.hex);
    editor?.setStrokeColor(color.hex);
  };
  const onSetFillColor = (color) => {
    setFillColor(color.hex);
    editor?.setFillColor(color.hex);
  };
  const onDeleteAll = () => {
    editor?.deleteAll();
  };
  const onDeleteSelected = () => {
    editor?.deleteSelected();
  };
  const onSendBackwards = (e) => {
    editor?.sendBackwards();
  };
  const onBringForward = (e) => {
    editor?.bringForward();
  };
  const size = "large";

  const items: MenuProps["items"] = [
    {
      label: "矢印",
      key: DRAWER.NONE,
      icon: <NorthWestIcon />,
    },
    {
      label: "TEXT",
      key: DRAWER.TEXT,
      icon: <FormatSizeIcon />,
    },
    {
      label: "図形の挿入",
      key: DRAWER.OBJECT,
      icon: <InterestsIcon />,
    },
    {
      label: "その他",
      key: DRAWER.OTHER,
      icon: <InterestsIcon />,
    },
  ];

  return (
    <CanvasContext.Provider
      value={{
        canvasId,
        canvasData,
        canvasImageData,
        saveCanvasData,
        saveCanvasImageData,
        saveThumbnail,
        isLoading,
        error,
        selectedObjects,
        editor,
        onReady,
        handleDrop,
        setDropItem,
      }}
    >
      <Layout style={{ height: "100vh" }}>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <img
            onClick={() => navigate("/home")}
            src="/img/genius.png"
            height={50}
            style={{ cursor: "pointer" }}
          />

          <Menu
            onClick={(value) => {
              parseInt(value.key) === openDrawer && setOpenDrawer(DRAWER.NONE);
            }}
            selectedKeys={[`${openDrawer}`]}
            mode="horizontal"
            items={items}
            onSelect={(value) =>
              setOpenDrawer(
                parseInt(value.key) === openDrawer
                  ? DRAWER.NONE
                  : parseInt(value.key)
              )
            }
          />

          <Button onClick={onDeleteSelected}>Delete Selected</Button>
          <Button
            style={{ backgroundColor: strokeColor }}
            onClick={() => setStrokeColorPane(!strokeColorPane)}
          >
            Stroke Color
          </Button>
          {strokeColorPane && (
            <div className="color-popover">
              <SketchPicker
                color={strokeColor}
                onChangeComplete={onSetStrokeColor}
              />
            </div>
          )}
          <Button
            style={{ backgroundColor: fillColor }}
            onClick={() => setFillColorPane(!fillColorPane)}
          >
            Fill Color
          </Button>

          {fillColorPane && (
            <div className="color-popover">
              <SketchPicker
                color={fillColor}
                onChangeComplete={onSetFillColor}
              />
            </div>
          )}
          <Button onClick={onSendBackwards}>Send to back</Button>
          <Button onClick={onBringForward}>Bring to front</Button>
        </Header>
        <Layout>
          <Sider
            collapsed={openDrawer !== DRAWER.OBJECT}
            collapsible
            defaultCollapsed
            collapsedWidth={0}
            title="Object Drawer"
            width={"25%"}
          >
            <ObjectDrawer />
          </Sider>
          <Sider
            collapsed={openDrawer !== DRAWER.OTHER}
            collapsible
            defaultCollapsed
            collapsedWidth={0}
            title="Other Drawer"
            width={"25%"}
          >
            <OtherDrawer />
          </Sider>
          <Sider
            collapsed={openDrawer !== DRAWER.TEXT}
            collapsible
            defaultCollapsed
            collapsedWidth={0}
            title="Text Drawer"
            width={"25%"}
          >
            <TextDrawer />
          </Sider>
          <Sider
            collapsed={openDrawer !== DRAWER.IMAGE}
            collapsible
            defaultCollapsed
            collapsedWidth={0}
            title="Image Drawer"
            width={"25%"}
          >
            <ImageDrawer />
          </Sider>
          <Content style={{ padding: "0 50px" }}>
            <Drawer title="Text Drawer" />
            <Drawer title="Image Drawer" placement="right" />
            <Drawer title="Other Drawer" placement="right" />
            <CanvasPane />
          </Content>
          <Sider theme="light" width={"20%"}>
            <div className="canvas-body-div">
              <ItemProperty />
              <GptTextViewer />
              {/* <ChatArea /> */}
            </div>
          </Sider>
        </Layout>
      </Layout>
    </CanvasContext.Provider>
  );
};

export default Canvas;
