import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  FabricJSCanvas,
  useFabricJSEditor,
} from "../../hooks/useFabricJSEditor";
import { Button, Input } from "antd";
import { SketchPicker } from "react-color";
import "./CanvasPane.css";
import { useCanvasData, initialCanvasData } from "@hooks/useCanvasData";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { Canvas } from "@domain-types/canvas";

const CanvasPane = () => {
  const [user] = useAuthState(auth);
  const { canvasData, saveCanvasData } = useCanvasData({
    user_id: user?.uid || "",
  });
  const canvasRef = useRef<Canvas>(initialCanvasData);
  const onChange = useCallback(
    (string: string) => {
      saveCanvasData({ ...canvasRef.current, canvas_data: string });
    },
    [canvasData]
  );
  const { selectedObjects, editor, onReady } = useFabricJSEditor({
    onChange: onChange,
  });
  const [text, setText] = useState("");
  const [strokeColorPane, setStrokeColorPane] = useState<boolean>(false);
  const [strokeColor, setStrokeColor] = useState<string>("");
  const [fillColorPane, setFillColorPane] = useState<boolean>(false);
  const [fillColor, setFillColor] = useState<string>("");

  useEffect(() => {
    canvasRef.current = canvasData;
  }, [canvasData]);

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
  return (
    <>
      {editor ? (
        <div>
          <Button onClick={onAddCircle}>Add circle</Button>
          <Button onClick={onAddRectangle}>Add Rectangle</Button>
          <Button onClick={onDeleteSelected}>Delete Selected</Button>
          <Button onClick={onDeleteAll}>Delete All</Button>
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
          {fillColorPane && (
            <div className="color-popover">
              <SketchPicker
                color={fillColor}
                onChangeComplete={onSetFillColor}
              />
            </div>
          )}
        </div>
      ) : (
        <>Loading...</>
      )}
      <FabricJSCanvas className="synapse-canvas" onReady={onReady} />
    </>
  );
};

export default CanvasPane;
