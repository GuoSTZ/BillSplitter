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
  Popconfirm,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import PeopleRatio from './components/peopleRatio';
import {
  createBill,
  getAllBills,
  updateBill,
  deleteBill,
} from '../services/bills';
import type {
  Bill,
  BillParticipant,
} from '../services/bills';
import type { Person } from '../services/people';
import { getAllPeople } from '../services/people';

const { Title } = Typography;

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
  const [people, setPeople] = useState<Omit<Person, 'email' | 'phone' | 'note' | 'createdAt' | 'updatedAt'>[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
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
  const peopleMap: Record<number, Omit<Person, 'email' | 'phone' | 'note' | 'createdAt' | 'updatedAt'>> = {};
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
      setPeople(peopleData.map(item => ({
        id: item.id,
        name: item.name
      })));
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
    try {
      const billData: any = {
        ...values,
        billItems: values.billItems?.map(item => ({
          ...item,
          participants: item.participants?.map(personId => ({ personId })) || []
        })) || []
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
    console.log(bill, '====bill')
    setEditingBill(bill);
    setSelectedParticipants(
      bill.participants.map(p => ({
        id: p.personId,
        name: peopleMap[p.personId]?.name || '',
        shareRatio: p.shareRatio,
      }))
    );
    const newBill = {
      ...bill,
      billItems: bill.billItems.map(item => ({
        ...item,
        participants: item.participants.map(p => p.personId)
      })),
      participants: bill.participants.map(item => {
        return {
          id: item.personId,
          shareRatio: item.shareRatio
        }
      })
    }
    form.setFieldsValue(newBill);
    setIsModalVisible(true);
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
      render: (_: any, record: Bill) => {
        const total = record.billItems?.reduce((total, item) => total + (Number(item.amount) || 0), 0) || 0;
        return `¥${total?.toFixed(2) || '0.00'}`;
      },
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
          <Tooltip title="编辑">
            <Typography.Link onClick={() => handleEdit(record)}>编辑</Typography.Link>
          </Tooltip>
          <Popconfirm
            title="确定要删除这个账单吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Typography.Link>删除</Typography.Link>
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
              name="id"
              hidden
            >
              <Input />
            </Form.Item>
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
    </div>
  );
};

export default BillManagement;