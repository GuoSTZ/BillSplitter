import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  message,
  Typography,
  Row,
  Col,
  Tag,
  Popconfirm,
  Checkbox,
  Tooltip,
  Slider,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import PeopleRatio from './components/peopleRatio';
import {
  createBill,
  getAllBills,
  updateBill,
  deleteBill,
  updateParticipantPayment,
} from '../services/bills';
import type {
  Bill,
  BillParticipant,
} from '../services/bills';
import type { Person } from '../services/people';
import { getAllPeople } from '../services/people';

const { Title, Text } = Typography;
const { Option } = Select;

interface BillFormData {
  billItems: {
    name: string;
    amount: number;
    payerId: number;
    participants: number[];
  }[];
}

const BillManagement: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [selectedParticipants, setSelectedParticipants] = useState<{
    id: number;
    name: string;
    shareRatio: number;
  }[]>([]);
  const [billMap, setBillMap] = useState<Map<number, {
    id: number;
    name: string;
    shareRatio: number;
    bill: number;
  }>>(new Map());
  const shareRatioMap: Record<number, number> = {};
  selectedParticipants.forEach(p => {
    shareRatioMap[p.id] = p.shareRatio;
  });
  const peopleMap: Record<number, Person> = {};
  people.forEach(p => {
    peopleMap[p.id] = p;
  })

  const [form] = Form.useForm();

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      const [billsData, peopleData] = await Promise.all([
        getAllBills(),
        getAllPeople(),
      ]);
      setBills(billsData);
      setPeople(peopleData);
    } catch (error) {
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 处理创建/编辑账单
  const handleSubmit = async (values: BillFormData) => {
    console.log(values, '=====values')
    return;
    try {
      const billData: any = {
        // title: values.title,
        // description: values.description,
        // totalAmount: values.totalAmount,
        // payerId: values.payerId,
        // participants: selectedParticipants,
      };

      if (editingBill) {
        await updateBill(editingBill.id, billData);
        message.success('账单更新成功');
      } else {
        await createBill(billData);
        message.success('账单创建成功');
      }

      setIsModalVisible(false);
      setEditingBill(null);
      form.resetFields();
      setSelectedParticipants([]);
      loadData();
    } catch (error) {
      message.error(editingBill ? '更新失败' : '创建失败');
    }
  };

  // 处理删除账单
  const handleDelete = async (id: number) => {
    try {
      await deleteBill(id);
      message.success('账单删除成功');
      loadData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 处理编辑
  const handleEdit = (bill: Bill) => {
    setEditingBill(bill);
    setSelectedParticipants(
      bill.participants.map(p => ({
        id: p.personId,
        name: p?.person?.name || '',
        shareRatio: p.shareRatio,
      }))
    );
    form.setFieldsValue({
      title: bill.title,
      description: bill.description,
      totalAmount: bill.totalAmount,
      payerId: bill.payerId,
    });
    setIsModalVisible(true);
  };

  // 处理查看详情
  const handleViewDetail = (bill: Bill) => {
    setSelectedBill(bill);
    setIsDetailModalVisible(true);
  };

  // 处理支付状态更新
  const handlePaymentStatusChange = async (
    billId: number,
    participantId: number,
    isPaid: boolean
  ) => {
    try {
      await updateParticipantPayment(billId, participantId, isPaid);
      message.success('支付状态更新成功');
      loadData();
    } catch (error) {
      message.error('更新支付状态失败');
    }
  };

  // 获取状态标签
  const getStatusTag = (status: string) => {
    switch (status) {
      case 'pending':
        return <Tag icon={<ClockCircleOutlined />} color="orange">待处理</Tag>;
      case 'settled':
        return <Tag icon={<CheckCircleOutlined />} color="green">已结算</Tag>;
      case 'cancelled':
        return <Tag icon={<StopOutlined />} color="red">已取消</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '账单标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Bill) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          {record.description && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '总金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
      sorter: (a: Bill, b: Bill) => a.totalAmount - b.totalAmount,
    },
    {
      title: '参与人数',
      dataIndex: 'participants',
      key: 'participantCount',
      render: (participants: BillParticipant[]) => participants.length,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: Bill, b: Bill) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: Bill) => (
        <Space>
          <Tooltip title="查看详情">
            {/* <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            /> */}
            <Typography.Link onClick={() => handleViewDetail(record)}>查看详情</Typography.Link>
          </Tooltip>
          <Tooltip title="编辑">
            {/* <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            /> */}
            <Typography.Link onClick={() => handleEdit(record)}>编辑</Typography.Link>
          </Tooltip>
          <Popconfirm
            title="确定要删除这个账单吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              {/* <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              /> */}
              <Typography.Link onClick={() => handleDelete(record.id)}>删除</Typography.Link>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>账单管理</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingBill(null);
            form.resetFields();
            setSelectedParticipants([]);
            setIsModalVisible(true);
          }}
        >
          新建账单
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={bills}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      {/* 创建/编辑账单模态框 */}
      <Modal
        title={editingBill ? '编辑账单' : '新建账单'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingBill(null);
          form.resetFields();
          setSelectedParticipants([]);
        }}
        maskClosable={false}
        footer={null}
        width={900}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={(values, allValues) => {
            const { billItems } = allValues;

            const newBillMap = new Map<number, {
              id: number;
              name: string;
              shareRatio: number;
              bill: number;
            }>();
            billItems?.forEach(item => {
              if (!item) {
                return;
              }
              const allShareRatio = item.participants.reduce((acc, cur) => acc + (shareRatioMap[cur] || 1), 0);
              const one = item.amount / allShareRatio;
              item.participants.forEach(personId => {
                let bill = one * (shareRatioMap[personId] || 1) * -1;
                if (personId === item.payerId) {
                  bill = one * (allShareRatio - (shareRatioMap[personId] || 1));
                }
                newBillMap.set(personId, {
                  id: personId,
                  name: peopleMap[personId].name,
                  shareRatio: shareRatioMap[personId] || 1,
                  bill,
                })
              })
            });
            setBillMap(newBillMap);
          }}
        >

          <Card title="基本信息" style={{ marginBottom: 24 }}>
            <Form.Item
              name="title"
              label="账单名称"
            >
              <Input placeholder='记录下账单名称吧，不填入就是默认日期' />
            </Form.Item>
            <Form.Item
              name="description"
              label="账单描述"
            >
              <Input placeholder='重要的信息可以记录一下' />
            </Form.Item>
          </Card>

          <Card title="参与者设置" style={{ marginBottom: 24 }}>
            <Form.Item
              name="participants"
              label="选择参与者并设置分摊比例"
            >
              <PeopleRatio
                people={people}
                onChange={value => {
                  setSelectedParticipants(value || []);
                }}
              />
            </Form.Item>
          </Card>

          <Card title="账单项目">
            <Form.List name="billItems">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card
                      key={key}
                      size="small"
                      style={{ marginBottom: 16 }}
                      title={`账单项目 ${name + 1}`}
                      extra={
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                        >
                          删除
                        </Button>
                      }
                    >
                      <Row gutter={16}>
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, 'title']}
                            label="账单描述"
                            rules={[{ required: true, message: '请输入账单描述' }]}
                          >
                            <Input placeholder="请输入账单描述" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, 'amount']}
                            label="账单金额"
                            rules={[{ required: true, message: '请输入账单金额' }]}
                          >
                            <InputNumber
                              style={{ width: '100%' }}
                              placeholder="请输入金额"
                              min={0}
                              precision={2}
                              addonAfter="元"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, 'payerId']}
                            label="付款人"
                            rules={[{ required: true, message: '请选择付款人' }]}
                          >
                            <Select
                              placeholder="请选择付款人"
                              options={people.map(item => ({
                                label: item.name,
                                value: item.id
                              }))}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, 'participants']}
                            label="参与人"
                            rules={[{ required: true, message: '请选择参与人' }]}
                            initialValue={selectedParticipants.map(item => item.id)}
                          >
                            <Select
                              placeholder="请选择参与人"
                              mode="multiple"
                              options={people.map(item => ({
                                label: item.name,
                                value: item.id
                              }))}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  ))}

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      添加账单项目
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>

          {/* 金额预览 */}
          {billMap?.size > 0 && (
            <Card title="分摊预览" style={{ marginTop: 24 }}>
              <Row gutter={[16, 8]}>
                {Array.from(billMap.values()).map(({ id, name, shareRatio, bill }) => (
                  <Col span={6} key={id}>
                    <div style={{ textAlign: 'center', padding: '8px', border: '1px solid #f0f0f0', borderRadius: '4px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{name}</div>
                      <div style={{ color: '#666', fontSize: '12px' }}>比例: {shareRatio}</div>
                      <div style={{ color: '#1890ff', fontSize: '16px', fontWeight: 'bold' }}>
                        ¥{bill.toFixed(2)}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          )}

          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>
                取消
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                disabled={selectedParticipants.length === 0}
              >
                {editingBill ? '更新' : '创建'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* 账单详情模态框 */}
      <Modal
        title="账单详情"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {selectedBill && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card size="small" title="基本信息">
                  <p><strong>标题：</strong>{selectedBill.title}</p>
                  <p><strong>描述：</strong>{selectedBill.description || '无'}</p>
                  <p><strong>总金额：</strong>¥{selectedBill.totalAmount.toFixed(2)}</p>
                  <p><strong>付款人：</strong>{selectedBill.payer?.username || '未知'}</p>
                  <p><strong>状态：</strong>{getStatusTag(selectedBill.status)}</p>
                  <p><strong>创建时间：</strong>{new Date(selectedBill.createdAt).toLocaleString()}</p>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="参与者详情">
                  {selectedBill.participants.map(participant => (
                    <div key={participant.id} style={{ marginBottom: 12, padding: 8, border: '1px solid #f0f0f0', borderRadius: 4 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{participant.person?.name}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            比例: {participant.shareRatio} | 金额: ¥{participant.shareAmount?.toFixed(2)}
                          </div>
                        </div>
                        <Checkbox
                          checked={participant.isPaid}
                          onChange={(e) => handlePaymentStatusChange(
                            selectedBill.id,
                            participant.id!,
                            e.target.checked
                          )}
                        >
                          已支付
                        </Checkbox>
                      </div>
                    </div>
                  ))}
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BillManagement;