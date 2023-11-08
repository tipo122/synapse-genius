import { fabric } from "fabric";
import React, { useContext, useState } from "react";
import CanvasPane from "@components/CanvasPane";
import { CanvasContext } from "@pages/Canvas/Canvas";
import { Button, Input } from "antd";

const ObjectDrawer = () => {
  const { editor, selectedObjects } = useContext(CanvasContext);
  const [text, setText] = useState("");
  const onLoadSVG = (e) => {
    var url = URL.createObjectURL(e.target.files[0]);
    fabric.loadSVGFromURL(url, function (objects, options) {
      objects.forEach(function (svg) {
        editor?.canvas.add(svg).renderAll();
      });
    });
  };

  return (
    <div className="canvas-body-div">
      <Input type="file" onChange={onLoadSVG} />\{" "}
    </div>
  );
};

export default ObjectDrawer;
