import { CanvasContext } from "@pages/Canvas/Canvas";
import React, { useContext } from "react";

const GptTextViewer = () => {
  const { canvasData, saveCanvasData } = useContext(CanvasContext);

  const Tree = ({ data }) => (
    <ul>
      {data &&
        Object.keys(data).map((item) => {
          return (
            <li>
              {item} <br /> {data[item]}
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
            return <li>{string.text}</li>;
          })}
      </ul>
    </div>
  );
};

export default GptTextViewer;
