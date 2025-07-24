import { Card, Row, Col, Statistic, Typography } from 'antd';
import { TeamOutlined, CalculatorOutlined, DollarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { getAllPeople } from '../services/people';
import { getBillStatistics } from '../services/bills'; // 添加这行

const { Title } = Typography;

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPeople: 0,
    totalBills: 0,
    totalAmount: 0,
    settledBills: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [people, billStats] = await Promise.all([
          getAllPeople(),
          getBillStatistics(), // 添加这行
        ]);
        
        setStats({
          totalPeople: people.length,
          totalBills: billStats.totalBills,
          totalAmount: billStats.totalAmount,
          settledBills: billStats.settledBills,
        });
      } catch (error) {
        console.error('加载统计数据失败', error);
        // 如果获取账单统计失败，至少显示人员统计
        try {
          const people = await getAllPeople();
          setStats(prev => ({ ...prev, totalPeople: people.length }));
        } catch (peopleError) {
          console.error('加载人员数据失败', peopleError);
        }
      }
    };
    
    loadStats();
  }, []);

  return (
    <div>
      <Title level={2}>仪表板</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="总人数"
              value={stats.totalPeople}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="账单数量"
              value={stats.totalBills}
              prefix={<CalculatorOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="总金额"
              value={stats.totalAmount}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              suffix="元"
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="已结算"
              value={stats.settledBills}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>
      
      <Card style={{ marginTop: 16 }} title="快速开始">
        <p>欢迎使用账单分割器！</p>
        <p>1. 首先在"人员管理"中添加参与账单分摊的人员</p>
        <p>2. 然后在"账单管理"中创建和管理账单</p>
        <p>3. 系统会自动计算每个人应该支付的金额</p>
        <p>4. 可以标记参与者的支付状态，跟踪账单结算进度</p>
      </Card>
    </div>
  );
};

export default Dashboard;