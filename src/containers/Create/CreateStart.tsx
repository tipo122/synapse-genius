import React, { useContext } from "react";
import { Button, Input, Layout, Typography, theme } from "antd";
import { CreateContext } from "./CreateContainer";

const { Text, Title, Link } = Typography;

export const CreateStart = () => {
  const { targetUrl, setTargetUrl, handleStart } = useContext(CreateContext);
  return (
    <>
      <Text style={{ fontSize: "80px" }}>ECのProduct Imageを</Text>
      <br />
      <Text style={{ fontSize: "80px" }}>一瞬で創作</Text>
      <p></p>
      <div style={{ width: "600px", textAlign: "left" }}>
        あなたの商品を出品しているECサイトのURLを入力して始める
        <br />
        <Input
          style={{ width: 600 }}
          onChange={(e) => {
            setTargetUrl(e.target.value);
          }}
          value={targetUrl}
        />
      </div>
      <div style={{ width: "600px", textAlign: "right" }}>
        <Button onClick={handleStart}>始める⇨</Button>
      </div>
    </>
  );
};
