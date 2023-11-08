import React, { createContext, useEffect, useState } from "react";
import { Button, Drawer, Input, Layout, theme } from "antd";
import ChatArea from "@components/ChatArea";
import CanvasPane from "@components/CanvasPane";
import ItemProperty from "@components/ItemProperty";
import "./Canvas.css";
import { fabric } from "fabric";
import { CanvasDataInterface, useCanvasData } from "@hooks/useCanvasData";
import { useParams } from "react-router";
import { FabricJSEditor, useFabricJSEditor } from "@hooks/useFabricJSEditor";
import TextStyle from "@components/TextStyle/TextStyle";
import ImageUpload from "@components/ImageUpload/ImageUpload";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import NorthWestIcon from "@mui/icons-material/NorthWest";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";
import InterestsIcon from "@mui/icons-material/Interests";
import { SketchPicker } from "react-color";

import type { RadioChangeEvent } from "antd";
import { Radio } from "antd";
import { SvgIcon } from "@mui/material";

const { Header, Content, Footer, Sider } = Layout;

interface CanvasContexxtInterface extends CanvasDataInterface {
  editor: FabricJSEditor | undefined;
  selectedObjects: any;
  onReady: any;
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
    loadTemplate,
    error,
  } = useCanvasData(canvasIdParam ?? "");
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { selectedObjects, editor, onReady } = useFabricJSEditor();

  const [openDrawer, setOpenDrawer] = useState<DRAWER>(DRAWER.NONE);
  const [text, setText] = useState("");
  const [strokeColorPane, setStrokeColorPane] = useState<boolean>(false);
  const [strokeColor, setStrokeColor] = useState<string>("");
  const [fillColorPane, setFillColorPane] = useState<boolean>(false);
  const [fillColor, setFillColor] = useState<string>("");

  const onAddCircle = () => {
    editor?.addCircle();
  };
  const onAddRectangle = () => {
    editor?.addRectangle();
  };

  const onLoadSVG = (e) => {
    var url = URL.createObjectURL(e.target.files[0]);
    fabric.loadSVGFromURL(url, function (objects, options) {
      objects.forEach(function (svg) {
        editor?.canvas.add(svg).renderAll();
      });
    });
  };

  const onAddText = () => {
    if (selectedObjects?.length) {
      return editor?.updateText(text);
    }
    editor?.addText(text);
  };

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
        selectedObjects,
        editor,
        onReady,
      }}
    >
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <img src="/img/genius.png" height={50} />

          <Radio.Group
            size="large"
            value={openDrawer}
            onChange={(e) => {
              setOpenDrawer(e.target?.value);
            }}
          >
            <Radio.Button value={DRAWER.NONE}>
              <SvgIcon component={NorthWestIcon} />
            </Radio.Button>
            <Radio.Button value={DRAWER.TEXT}>
              <SvgIcon component={FormatSizeIcon} />
            </Radio.Button>
            <Radio.Button value={DRAWER.OBJECT}>
              <SvgIcon component={InterestsIcon} />
            </Radio.Button>
            <Radio.Button value={DRAWER.OTHER}>
              <SvgIcon component={DevicesOtherIcon} />
            </Radio.Button>
          </Radio.Group>

          <Button onClick={onDeleteSelected}>Delete Selected</Button>
          <Button onClick={onDeleteAll}>Delete All</Button>
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
            <div className="canvas-body-div">
              <Button onClick={onAddCircle}>Add circle</Button>
              <Button onClick={onAddRectangle}>Add Rectangle</Button>
            </div>
          </Sider>
          <Sider
            collapsed={openDrawer !== DRAWER.OTHER}
            collapsible
            defaultCollapsed
            collapsedWidth={0}
            title="Other Drawer"
            width={"25%"}
          >
            <div className="canvas-body-div">
              <Input type="file" onChange={onLoadSVG} />\{" "}
            </div>
          </Sider>
          <Sider
            collapsed={openDrawer !== DRAWER.TEXT}
            collapsible
            defaultCollapsed
            collapsedWidth={0}
            title="Text Drawer"
            width={"25%"}
          >
            <div className="canvas-body-div">
              <Button onClick={onAddText}>Add Text</Button>
              <Input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              {editor && <TextStyle editor={editor} />}
            </div>
          </Sider>
          <Sider
            collapsed={openDrawer !== DRAWER.IMAGE}
            collapsible
            defaultCollapsed
            collapsedWidth={0}
            title="Image Drawer"
            width={"25%"}
          >
            <div className="canvas-body-div">
              {editor && <ImageUpload editor={editor} />}
            </div>
          </Sider>
          <Content style={{ padding: "0 50px" }}>
            <Drawer title="Text Drawer" />
            <Drawer title="Image Drawer" placement="right" />
            <Drawer title="Other Drawer" placement="right" />
            <CanvasPane />
          </Content>
          {/* <Sider theme="light" width={"40%"}>
            <div className="canvas-body-div">
              <ItemProperty />
              <ChatArea />
            </div>
          </Sider> */}
        </Layout>
      </Layout>
    </CanvasContext.Provider>
  );
};

export default Canvas;
