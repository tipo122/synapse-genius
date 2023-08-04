import React, { useState } from "react";
import { Layout, Menu, Button, theme } from "antd";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  UserOutlined,
  FormOutlined,
} from "@ant-design/icons";
import Canvas from "../../pages/Canvas";
import Home from "../../pages/Home";

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <HomeOutlined />,
              label: <Link to="/home">ホーム</Link>,
            },
            {
              key: "2",
              icon: <FormOutlined />,
              label: <Link to="/canvas">キャンバス</Link>,
            },
            {
              key: "3",
              icon: <UserOutlined />,
              label: "プロフィール",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/canvas" element={<Canvas />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};
export default Dashboard;
