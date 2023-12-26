'use client'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
const { Header, Sider, Content } = Layout;

export default function Home() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  return (
      <Layout className="layout">
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo" />
          <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={['/']}
              onClick={(e) => router.push(e.key) }
              items={[
                {
                  key: '/',
                  icon: <UserOutlined />,
                  label: 'dashboard',
                },
                {
                  key: 'tasks',
                  icon: <VideoCameraOutlined />,
                  label: 'Danh sách công việc',
                },
                {
                  key: 'other',
                  icon: <UploadOutlined />,
                  label: 'Other',
                },
              ]}
          />
        </Sider>
        <Layout className="site-layout">
          <Header
              className="site-layout-background"
              style={{
                padding: 0,
              }}
          >
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            })}
          </Header>
          <Content
              className="site-layout-background"
              style={{
                margin: '24px 16px',
                padding: 24,
              }}
          >
            Report
          </Content>
        </Layout>
      </Layout>
  )
}