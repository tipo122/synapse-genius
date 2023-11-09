import React, { useContext, useState } from "react";
import CanvasPane from "@components/CanvasPane";
import { CanvasContext } from "@pages/Canvas/Canvas";
import { Button, Input } from "antd";
import TextStyle from "@components/TextStyle/TextStyle";

const TextDrawer = () => {
  const { editor, selectedObjects } = useContext(CanvasContext);
  const [text, setText] = useState("");

  const onAddText = () => {
    if (selectedObjects?.length) {
      return editor?.updateText(text);
    }
    editor?.addText(text);
  };

  return (
    <>
      <div className="canvas-body-div">
        <Button onClick={onAddText}>Add Text</Button>
        <Input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {editor && <TextStyle editor={editor} />}
      </div>
    </>
  );
};

export default TextDrawer;
