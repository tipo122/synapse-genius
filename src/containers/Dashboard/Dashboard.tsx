import React, { useState } from "react";
import { Layout, Menu, Button, theme } from "antd";
import { Routes, Route, Link } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  UserOutlined,
  FormOutlined,
} from "@ant-design/icons";
import Canvas from "@pages/Canvas";
import Home from "@pages/Home";

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
          defaultSelectedKeys={[window.location.pathname]}
          // selectedKeys={[window.location.pathname]}
          items={[
            {
              key: "/home",
              icon: <HomeOutlined />,
              label: <Link to="/home">ホーム</Link>,
            },
            {
              key: "/canvas",
              icon: <FormOutlined />,
              label: <Link to="/canvas">キャンバス</Link>,
            },
            {
              key: "/profile",
              icon: <UserOutlined />,
              label: <Link to="/profile">プロフィール</Link>,
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
            <Route path="/*" element={<Canvas />} />
            <Route path="/profile" element={<h1>Profile</h1>} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};
export default Dashboard;
