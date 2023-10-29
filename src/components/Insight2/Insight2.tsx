import { Button, Input, Layout, Spin, message, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, functions } from "../../firebase";
import { httpsCallable } from "firebase/functions";

const Insight2 = () => {
  const [targetUrl, setTargetUrl] = useState<string>("" as never);

  const [user] = useAuthState(auth);
  const userId = user ? user.uid : "";
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const urlPattern = /^https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+$/;

  const onAnalyzeProductInsight2: (data: any) => Promise<{
    data: any;
  }> = httpsCallable(functions, "on_analyze_product_insight2");

  const handleStart = async () => {
    if (!userId) return;
    if (!urlPattern.test(targetUrl)) {
      messageApi.open({
        type: "error",
        content: "URLを入力してください",
      });
      return;
    }
    setIsLoading(true);
    const result = await onAnalyzeProductInsight2({
      target_url: targetUrl,
    });
    setIsLoading(false);
    // const result = await
  };

  return (
    <Layout>
      <Content>
        <center>
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
        </center>
      </Content>
    </Layout>
  );
};

export default Insight2;
