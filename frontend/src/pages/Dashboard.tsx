import { Card, Row, Col, Statistic, Typography } from 'antd';
import { TeamOutlined, CalculatorOutlined, HistoryOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

const { Title } = Typography;

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPeople: 0,
    totalBills: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    // 从本地存储获取统计数据
    const people = JSON.parse(localStorage.getItem('billSplitter_people') || '[]');
    setStats({
      totalPeople: people.length,
      totalBills: 0, // 后续实现
      totalAmount: 0, // 后续实现
    });
  }, []);

  return (
    <div>
      <Title level={2}>仪表板</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="总人数"
              value={stats.totalPeople}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="账单数量"
              value={stats.totalBills}
              prefix={<CalculatorOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="总金额"
              value={stats.totalAmount}
              prefix={<HistoryOutlined />}
              valueStyle={{ color: '#cf1322' }}
              suffix="元"
            />
          </Card>
        </Col>
      </Row>
      
      <Card style={{ marginTop: 16 }} title="快速开始">
        <p>欢迎使用账单分割器！</p>
        <p>1. 首先在"人员管理"中添加参与账单分摊的人员</p>
        <p>2. 然后在"账单管理"中创建和管理账单</p>
        <p>3. 系统会自动计算每个人应该支付的金额</p>
      </Card>
    </div>
  );
};

export default Dashboard;