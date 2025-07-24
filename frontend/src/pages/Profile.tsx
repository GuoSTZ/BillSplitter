import { useEffect, useState } from 'react';
import { Card, Avatar, Typography, Spin, Button, message } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { getUserInfo, logout } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const { Title, Text } = Typography;

interface UserInfo {
  id: number;
  username: string;
  email: string;
  name: string;
  createdAt: string;
}

const Profile = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfo();
        setUserInfo(data);
      } catch (error) {
        console.error('获取用户信息失败', error);
        message.error('获取用户信息失败');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    logout();
    message.success('已安全退出');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="center-spinner">
          <Spin size="large" tip="加载用户信息中..." />
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <Card className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <Avatar size={80} icon={<UserOutlined />} />
          </div>
          <Title level={2} className="profile-title">
            {userInfo?.name || userInfo?.username}
          </Title>
          <Text className="profile-subtitle">个人信息</Text>
        </div>
        
        <div className="profile-info">
          <div className="info-item">
            <span className="info-label">用户名</span>
            <span className="info-value">{userInfo?.username}</span>
          </div>
          <div className="info-item">
            <span className="info-label">姓名</span>
            <span className="info-value">{userInfo?.name || '未设置'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">邮箱</span>
            <span className="info-value">{userInfo?.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">用户ID</span>
            <span className="info-value">#{userInfo?.id}</span>
          </div>
          {userInfo?.createdAt && (
            <div className="info-item">
              <span className="info-label">注册时间</span>
              <span className="info-value">
                {new Date(userInfo.createdAt).toLocaleDateString('zh-CN')}
              </span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Profile;