import React, { useState, useEffect, useContext } from "react";
import {
  FabricJSCanvas,
  useFabricJSEditor,
} from "../../hooks/useFabricJSEditor";
import { Button, Input, Select } from "antd";
import { SketchPicker } from "react-color";
import "./CanvasPane.css";
import { FontFamilyList } from "@components/TextStyle/TextStyle";
import { CanvasContext } from "@pages/Canvas/Canvas";
import { fabric } from "fabric";
import { TEXT } from "../../types/defaultShapes";

const CanvasPane = () => {
  const { canvasImageData, saveCanvasImageData } = useContext(CanvasContext);
  const onChange = (canvas_data: string) => {
    saveCanvasImageData(canvas_data);
  };
  const { selectedObjects, editor, onReady } = useFabricJSEditor({ onChange });
  const [text, setText] = useState("");
  const [strokeColorPane, setStrokeColorPane] = useState<boolean>(false);
  const [strokeColor, setStrokeColor] = useState<string>("");
  const [fillColorPane, setFillColorPane] = useState<boolean>(false);
  const [fillColor, setFillColor] = useState<string>("");

  useEffect(() => {
    if (typeof canvasImageData === "string") editor?.setCanvas(canvasImageData);
  }, [canvasImageData]);

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
  
  const fontFamilyList = FontFamilyList;
  const handleFontChange = (fontFamily) => {
    editor?.changeTextFont(fontFamily)
  }
  const [textSize, setTextSize] = useState(TEXT.fontSize);
  const [isBold, setIsBold] = useState(true);
  const [isItalic, setIsItalic] = useState(true);
  const [isUnderLine, setIsUnderLine] = useState(true);
  const [isStrikethrough, setIsStrikethrough] = useState(true);
  const onChangeBoldFont = () => {
    editor?.changeBoldFont(isBold)
    setIsBold(!isBold)
  }
  const onChangeItalicFont = () => {
    editor?.changeItalicFont(isItalic)
    setIsItalic(!isItalic)
  }
  const onChangeUnderLineFont = () => {
    editor?.changeUnderLineFont(isUnderLine)
    setIsUnderLine(!isUnderLine)
  }
  const onChangeStrikethroughFont = () => {
    editor?.changeStrikethroughFont(isStrikethrough)
    setIsStrikethrough(!isStrikethrough)
  }

  useEffect(() => {
    editor?.changeTextSize(textSize)
  }, [textSize])
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
          <Select defaultValue={fontFamilyList[0]}
            style={{ width: 120 }}
            onChange={handleFontChange}
            options={fontFamilyList}>
          </Select>
          <div>
            <Button onClick={()=>{setTextSize(textSize - 1)}}>-</Button>
            <Input style={{ width: 50 }} value={textSize} onChange={(e)=>setTextSize(Number(e.target.value))}></Input>
            <Button onClick={()=>{setTextSize(textSize + 1)}}>+</Button>
          </div>
          <Button onClick={onChangeBoldFont}>bold</Button>
          <Button onClick={onChangeItalicFont}>Italic</Button>
          <Button onClick={onChangeUnderLineFont}>Under Line</Button>
          <Button onClick={onChangeStrikethroughFont}>strikethrough</Button>
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
        </div>
      ) : (
        <>Loading...</>
      )}
      <FabricJSCanvas className="synapse-canvas" onReady={onReady} />
    </>
  );
};

export default CanvasPane;
