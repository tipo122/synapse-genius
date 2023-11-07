import React, { useState, useEffect, useContext, useRef } from "react";
import {
  FabricJSCanvas,
  useFabricJSEditor,
} from "../../hooks/useFabricJSEditor";
import { Button, Input } from "antd";
import { SketchPicker } from "react-color";
import "./CanvasPane.css";
import { CanvasContext } from "@pages/Canvas/Canvas";
import { fabric } from "fabric";
import ImageUpload from "@components/ImageUpload/ImageUpload";
import TextStyle from "@components/TextStyle/TextStyle";

const CanvasPane = () => {
  const alreadyIn = useRef<boolean>(false);
  const alreadyLoaded = useRef<boolean>(false);
  const saveTimer = useRef<NodeJS.Timeout | null | undefined>(undefined); // null as unknown as NodeJS.Timeout;
  const {
    canvasData,
    canvasImageData,
    saveCanvasImageData,
    saveThumbnail,
    loadTemplate,
  } = useContext(CanvasContext);
  const onChange = (canvas_data: string) => {};
  const { selectedObjects, editor, onReady } = useFabricJSEditor({ onChange });
  const [text, setText] = useState("");
  const [strokeColorPane, setStrokeColorPane] = useState<boolean>(false);
  const [strokeColor, setStrokeColor] = useState<string>("");
  const [fillColorPane, setFillColorPane] = useState<boolean>(false);
  const [fillColor, setFillColor] = useState<string>("");

  const handleSaveData = () => {
    saveTimer.current && clearTimeout(saveTimer.current);
    saveTimer.current = null as unknown as NodeJS.Timeout;
    editor?.canvas &&
      saveCanvasImageData(JSON.stringify(editor?.canvas), editor);
    editor?.canvas && saveThumbnail(editor);
  };

  useEffect(() => {
    if (editor?.canvas && alreadyIn.current === false) {
      alreadyIn.current = true;
      handleSaveData();
    }
    // if (typeof saveTimer.current === "undefined") handleSaveData();
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null as unknown as NodeJS.Timeout;
    }
    saveTimer.current = setTimeout(handleSaveData, 2000);
  }, [editor]);

  useEffect(() => {
    if (!alreadyLoaded.current && editor) {
      loadTemplate(editor);
      alreadyLoaded.current = true;
    }
    if (
      typeof canvasImageData === "string" &&
      !canvasImageData.startsWith("https")
    ) {
      editor?.setCanvas(canvasImageData);
    }
    // editor && saveThumbnail(editor);
    // editor?.setCanvas(canvasImageData);
  }, [canvasImageData]);

  useEffect(() => {
    return () => {
      saveTimer.current && clearTimeout(saveTimer.current);
    };
  }, []);

  const onAddCircle = () => {
    editor?.addCircle();
  };
  const onAddRectangle = () => {
    editor?.addRectangle();
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
  const onLoadSVG = (e) => {
    var url = URL.createObjectURL(e.target.files[0]);
    fabric.loadSVGFromURL(url, function (objects, options) {
      objects.forEach(function (svg) {
        editor?.canvas.add(svg).renderAll();
      });
    });
  };
  const onSendBackwards = (e) => {
    editor?.sendBackwards();
  };
  const onBringForward = (e) => {
    editor?.bringForward();
  };
  return (
    <>
      {editor ? (
        <div>
          <Button onClick={onAddCircle}>Add circle</Button>
          <Button onClick={onAddRectangle}>Add Rectangle</Button>
          <Button onClick={onDeleteSelected}>Delete Selected</Button>
          <Button onClick={onDeleteAll}>Delete All</Button>
          <Input type="file" onChange={onLoadSVG} />
          <Input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button onClick={onAddText}>Add Text</Button>
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

          <TextStyle editor={editor} />

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

          <ImageUpload editor={editor} />
        </div>
      ) : (
        <>Loading...</>
      )}
      <FabricJSCanvas className="synapse-canvas" onReady={onReady} />
    </>
  );
};

export default CanvasPane;
