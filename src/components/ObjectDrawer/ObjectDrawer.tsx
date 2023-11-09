import React, { useContext, useState } from "react";
import CanvasPane from "@components/CanvasPane";
import { CanvasContext } from "@pages/Canvas/Canvas";
import { Button, Input } from "antd";

const ObjectDrawer = () => {
  const { editor, selectedObjects } = useContext(CanvasContext);
  const [text, setText] = useState("");

  const onAddCircle = () => {
    editor?.addCircle();
  };
  const onAddRectangle = () => {
    editor?.addRectangle();
  };

  return (
    <div className="canvas-body-div">
      <Button onClick={onAddCircle}>Add circle</Button>
      <Button onClick={onAddRectangle}>Add Rectangle</Button>
    </div>
  );
};

export default ObjectDrawer;
