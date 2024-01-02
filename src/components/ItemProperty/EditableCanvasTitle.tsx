import React, { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { CanvasContext } from "@pages/Canvas/Canvas";
import EditableLabel from "@components/EditableLabel";

export const EditableCanvasTitle = () => {
  const { canvasId } = useParams();
  const { canvasData, saveCanvasData } = useContext(CanvasContext);

  // Check for updates in canvasData
  // useEffect(() => {
  //   console.log(`updated canvasData: ${canvasData.title}`);
  // }, [canvasData]);

  const saveCanvasTitle = (name: string) => {
    const updatedCanvasData = { ...canvasData, title: name };
    saveCanvasData(updatedCanvasData);
  };

  return (
    <div>
      <EditableLabel
        labelname={canvasData?.title}
        saveCanvasTitle={saveCanvasTitle}
      />
    </div>
  );
};

export default EditableCanvasTitle;
