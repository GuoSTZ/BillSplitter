import { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Typography, message } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  CalculatorOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { logout, getUserInfo } from '../services/auth';
import type { MenuProps } from 'antd';
import '../styles/Layout.css';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

interface UserInfo {
  id: number;
  username: string;
  email: string;
  name: string;
}

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfo();
        setUserInfo(data);
      } catch (error) {
        console.error('获取用户信息失败', error);
      }
    };
    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    logout();
    message.success('已安全退出');
    navigate('/login');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
      onClick: () => navigate('/app/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  const sideMenuItems: MenuProps['items'] = [
    {
      key: '/app/dashboard',
      icon: <PieChartOutlined />,
      label: '仪表盘',
    },
    {
      key: '/app/people',
      icon: <TeamOutlined />,
      label: '人员管理',
    },
    {
      key: '/app/bills',
      icon: <CalculatorOutlined />,
      label: '账单管理',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div className="logo">
          <Title level={4} style={{ margin: '16px', color: '#1890ff' }}>
            {collapsed ? 'BS' : '账单分割器'}
          </Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={sideMenuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 16px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 48, height: 48 }}
          />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
              <Text strong>{userInfo?.name || userInfo?.username}</Text>
            </div>
          </Dropdown>
        </Header>
        <Content
          style={{
            height: 'calc( 100vh - 32px - 48px )',
            padding: 16,
            borderRadius: '8px',
          }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;