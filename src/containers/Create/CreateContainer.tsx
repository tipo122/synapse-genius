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
  templates: string[];
  setTemplates: React.Dispatch<React.SetStateAction<string[]>>;
  templateType: string;
  setTemplateType: React.Dispatch<React.SetStateAction<string>>;
  searchTemplate: ({
    text_query,
    template_type,
  }: {
    text_query: string;
    template_type: string;
  }) => Promise<{ data: any }>;
}

export const CreateContext = createContext<CreateInterface>({} as never);

const Create = () => {
  const [user] = useAuthState(auth);
  const userId = user ? user.uid : "";
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [targetUrl, setTargetUrl] = useState<string>("" as never);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [templates, setTemplates] = useState<string[]>([]);
  const [templateType, setTemplateType] = useState<string>("");
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const urlPattern = /^https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+$/;

  const createTemplateElements: (data: any) => Promise<{ data: any }> =
    httpsCallable(functions, "on_create_template_elements");

  const searchTemplate: ({
    text_query,
    template_type,
  }) => Promise<{ data: any }> = httpsCallable(functions, "on_search_template");

  const handleStart = async () => {
    if (!userId) return;
    if (!urlPattern.test(targetUrl)) {
      messageApi.open({
        type: "error",
        content: "URLを入力してください",
      });
      return;
    }
    if (!templateType) {
      messageApi.open({
        type: "error",
        content: "作りたいクリエイティブのタイプを指定してください",
      });
      return;
    }
    try {
      setIsLoading(true);
      initialCanvasData.user_id = userId;
      const docRef = await addDoc(collection(db, "canvases"), {
        ...initialCanvasData,
        create_dt: new Date(),
      });
      const canvasId = docRef.id;
      const result = await createTemplateElements({
        target_url: targetUrl,
        template_type: templateType,
        canvas_id: canvasId,
      });
      const list = await searchTemplate({
        text_query: `instagram用の、${templateType}をプロモーションするに適切なテンプレート`,
        template_type: templateType,
      });

      // if (result["data"] === "error" || list["data"] === "error") {
      //   messageApi.open({
      //     type: "error",
      //     content: "エラーが発生",
      //   });
      //   return;
      // }

      setTemplates(list.data);
      setIsLoading(false);
      navigate(`/create/${docRef.id}`);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };

  return (
    <CreateContext.Provider
      value={{
        targetUrl,
        setTargetUrl,
        handleStart,
        templates,
        setTemplates,
        templateType,
        setTemplateType,
        searchTemplate,
      }}
    >
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <img
            onClick={() => navigate("/home")}
            src="/img/genius.png"
            height={50}
            style={{ cursor: "pointer" }}
          />
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
