import React, { useState, useEffect, useContext, useRef } from "react";
import {
  FabricJSCanvas,
  useFabricJSEditor,
} from "../../hooks/useFabricJSEditor";
import { Button, Input, Spin } from "antd";
import { SketchPicker } from "react-color";
import "./CanvasPane.css";
import { CanvasContext } from "@pages/Canvas/Canvas";

const CanvasPane = () => {
  const alreadyIn = useRef<boolean>(false);
  const alreadyLoaded = useRef<boolean>(false);
  const saveTimer = useRef<NodeJS.Timeout | null | undefined>(undefined); // null as unknown as NodeJS.Timeout;
  const {
    canvasData,
    canvasImageData,
    saveCanvasImageData,
    saveThumbnail,
    editor,
    selectedObjects,
    onReady,
  } = useContext(CanvasContext);
  const [text, setText] = useState("");
  // ToDo: This doesn't work when clicking '新規作成'
  // const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleSaveData = () => {
    saveTimer.current && clearTimeout(saveTimer.current);
    saveTimer.current = null as unknown as NodeJS.Timeout;
    if (JSON.stringify(editor?.canvas) !== '{"version":"5.3.0","objects":[]}') {
      editor?.canvas && saveCanvasImageData(JSON.stringify(editor?.canvas));
      editor?.canvas && saveThumbnail(editor);
    }
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
    // if (!alreadyLoaded.current && editor) {
    //   loadTemplate(editor);
    //   alreadyLoaded.current = true;
    // }
    // if (
    //   typeof canvasImageData === "string" &&
    //   !canvasImageData.startsWith("https")
    // ) {
    // editor?.setCanvas(JSON.stringify(canvasImageData));
    // }
    // editor && saveThumbnail(editor);
    editor?.setCanvas(canvasImageData);
  }, [canvasImageData]);

  useEffect(() => {
    return () => {
      saveTimer.current && clearTimeout(saveTimer.current);
    };
  }, []);

  // ToDo: This doesn't work when clicking '新規作成'
  // useEffect(() => {
  //   if (canvasImageData !== "") setIsLoading(false);
  // }, [canvasImageData]);

  return (
    <>
      {editor ? <div></div> : <>Loading...</>}

      {/* ToDo: This doesn't work when clicking '新規作成'
      {isLoading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spin size="large" />
        </div>
      )} */}
      <FabricJSCanvas className="synapse-canvas" onReady={onReady} />
    </>
  );
};

export default CanvasPane;
