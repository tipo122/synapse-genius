import React, { createContext, useState } from "react";
import "./Create.css";
import { Button, Input, Layout, Spin, Typography, message, theme } from "antd";
import { auth, db, functions } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { initialCanvasData } from "@hooks/useCanvasData";
import { addDoc, collection } from "firebase/firestore";
import { Route, Router, Routes, useNavigate } from "react-router";
import { CreateStart } from "./CreateStart";
import { CreateList } from "./CreateList";
import { httpsCallable } from "firebase/functions";

const { Header, Sider, Content } = Layout;
const { Text, Title, Link } = Typography;

interface CreateInterface {
  targetUrl: string;
  setTargetUrl: React.Dispatch<React.SetStateAction<string>>;
  handleStart: () => void;
  creatives: string[];
  creativeType: string;
  setCreativeType: React.Dispatch<React.SetStateAction<string>>;
}

export const CreateContext = createContext<CreateInterface>({} as never);

const Create = () => {
  const [user] = useAuthState(auth);
  const userId = user ? user.uid : "";
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [targetUrl, setTargetUrl] = useState<string>("" as never);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [creatives, setCreatives] = useState<string[]>([]);
  const [creativeType, setCreativeType] = useState<string>("");
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const urlPattern = /^https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+$/;

  const onAnalyzeProductInsight: (data: any) => Promise<{ data: any }> =
    httpsCallable(functions, "on_analyze_product_insight");

  const onSearchTemplate: ({ text_query, category }) => Promise<{ data: any }> =
    httpsCallable(functions, "on_search_template");

  const handleStart = async () => {
    if (!userId) return;
    if (!urlPattern.test(targetUrl)) {
      messageApi.open({
        type: "error",
        content: "URLを入力してください",
      });
      return;
    }
    if (!creativeType) {
      messageApi.open({
        type: "error",
        content: "作りたいクリエイティブのタイプを指定してください",
      });
      return;
    }
    setIsLoading(true);
    initialCanvasData.user_id = userId;
    const docRef = await addDoc(collection(db, "canvases"), initialCanvasData);
    const canvasId = docRef.id;
    const result = await onAnalyzeProductInsight({
      target_url: targetUrl,
      canvas_id: canvasId,
    });
    const list = await onSearchTemplate({
      text_query: "",
      category: creativeType,
    });
    setCreatives(list.data);
    setIsLoading(false);
    navigate(`/create/${docRef.id}`);
  };

  return (
    <CreateContext.Provider
      value={{
        targetUrl,
        setTargetUrl,
        handleStart,
        creatives,
        creativeType,
        setCreativeType,
      }}
    >
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <img src="/img/genius.png" height={50} />
        </Header>
        <Content>
          <center>
            <Spin tip="Loading..." spinning={isLoading}>
              {contextHolder}
              <Routes>
                <Route path="/" element={<CreateStart />} />
                <Route path="/:canvasId" element={<CreateList />} />
              </Routes>
            </Spin>
          </center>
        </Content>
      </Layout>
    </CreateContext.Provider>
  );
};

export default Create;
