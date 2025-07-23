import { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  Popconfirm,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getAllPeople, createPerson, updatePerson, deletePerson } from '../services/people';
import type { Person, CreatePersonDto, UpdatePersonDto } from '../services/people';

const { Title } = Typography;

const PeopleManagement = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  // 加载人员数据
  const loadPeople = async () => {
    setTableLoading(true);
    try {
      const data = await getAllPeople();
      setPeople(data);
    } catch (error) {
      message.error('加载人员数据失败');
      console.error('加载人员数据失败:', error);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    loadPeople();
  }, []);

  const handleAdd = () => {
    setEditingPerson(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (person: Person) => {
    setEditingPerson(person);
    form.setFieldsValue(person);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePerson(id);
      message.success('删除成功');
      loadPeople(); // 重新加载数据
    } catch (error) {
      message.error('删除失败');
      console.error('删除失败:', error);
    }
  };

  const handleSubmit = async (values: CreatePersonDto | UpdatePersonDto) => {
    setLoading(true);
    try {
      if (editingPerson) {
        // 编辑
        await updatePerson(editingPerson.id, values as UpdatePersonDto);
        message.success('更新成功');
      } else {
        // 新增
        await createPerson(values as CreatePersonDto);
        message.success('添加成功');
      }
      setIsModalVisible(false);
      form.resetFields();
      loadPeople(); // 重新加载数据
    } catch (error) {
      message.error('操作失败');
      console.error('操作失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<Person> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <Space>
          <UserOutlined />
          <span>{name}</span>
        </Space>
      ),
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => phone || '-',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => email || '-',
    },
    {
      title: '备注',
      dataIndex: 'note',
      key: 'note',
      render: (note: string) => note || '-',
    },
    {
      title: '添加时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个人员吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={3} style={{ margin: 0 }}>
              人员管理
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              添加人员
            </Button>
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={people}
          rowKey="id"
          loading={tableLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          locale={{
            emptyText: '暂无人员数据，点击上方"添加人员"按钮开始添加',
          }}
        />
      </Card>

      <Modal
        title={editingPerson ? '编辑人员' : '添加人员'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
            ]}
          >
            <Input placeholder="请输入手机号（可选）" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { type: 'email', message: '请输入正确的邮箱格式' },
            ]}
          >
            <Input placeholder="请输入邮箱（可选）" />
          </Form.Item>

          <Form.Item
            name="note"
            label="备注"
          >
            <Input.TextArea
              placeholder="请输入备注信息（可选）"
              rows={3}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                }}
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingPerson ? '更新' : '添加'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PeopleManagement;