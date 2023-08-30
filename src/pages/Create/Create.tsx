import React, { useState } from "react";
import "./Create.css";
import { Button, Input, Layout, Typography, theme } from "antd";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { initialCanvasData } from "@hooks/useCanvasData";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router";

const { Header, Sider, Content } = Layout;
const { Text, Title, Link } = Typography;
const Create = () => {
  const [user] = useAuthState(auth);
  const userId = user ? user.uid : "";
  const navigate = useNavigate();
  const [targetUrl, setTargetUrl] = useState<string>("" as never);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleClick = async () => {
    if (!userId) return;
    initialCanvasData.user_id = userId;
    const docRef = await addDoc(collection(db, "canvases"), initialCanvasData);
    navigate(`/create/${docRef.id}`);
    // const result = await
  };

  return (
    <Layout>
      <Header style={{ padding: 0, background: colorBgContainer }}>
        <img src="./img/genius.png" height={50} />
      </Header>
      <Content>
        <center>
          <Text style={{ fontSize: "80px" }}>ECのProduct Imageを</Text>
          <br />
          <Text style={{ fontSize: "80px" }}>一瞬で創作</Text>
          <p></p>
          <div style={{ width: "600px", textAlign: "left" }}>
            あなたの商品を出品しているECサイトのURLを入力して始める
            <br />
            <Input value={targetUrl} style={{ width: 600 }}></Input>
          </div>
          <div style={{ width: "600px", textAlign: "right" }}>
            <Button onClick={handleClick}>始める⇨</Button>
          </div>
        </center>
      </Content>
    </Layout>
  );
};

export default Create;
