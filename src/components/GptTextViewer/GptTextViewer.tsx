import TextItem from "@components/TextItem";
import { CanvasContext } from "@pages/Canvas/Canvas";
import React, { useContext } from "react";

const GptTextViewer = () => {
  const { canvasData, saveCanvasData, editor, setDropItem } =
    useContext(CanvasContext);

  const handleDragStart = (e) => {
    setDropItem(e.target.innerText);
    console.log(editor);
  };

  const Tree = ({ data }) => (
    <ul>
      {data &&
        Object.keys(data).map((item, i) => {
          return (
            <li key={i}>
              {item} <br />{" "}
              <TextItem handleDragStart={handleDragStart} text={data[item]} />
              {typeof data[item] === "object" && <Tree data={data[item]} />}
            </li>
          );
        })}
    </ul>
  );

  return (
    <div>
      <Tree data={canvasData.embed_data} />
      <ul>
        {canvasData.copy_data?.length > 0 &&
          canvasData.copy_data.map((string, i) => {
            return (
              <li key={i}>
                <TextItem
                  handleDragStart={handleDragStart}
                  text={string.text}
                />
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default GptTextViewer;
