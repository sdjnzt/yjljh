import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Space, Table, Tag, Modal, Form, Input, Select, message, Typography, Avatar, Badge, Statistic, Tabs } from 'antd';
import { SecurityScanOutlined, UserOutlined, TeamOutlined, KeyOutlined, PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined, UnlockOutlined, CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title, Text } = Typography;
// const { DirectoryTree } = Tree;

/**
 * 权限管理页面
 * 管理用户权限、角色管理、权限分配等
 */
const PermissionManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [isPermissionModalVisible, setIsPermissionModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [editingPermission, setEditingPermission] = useState<any>(null);
  const [userForm] = Form.useForm();
  const [roleForm] = Form.useForm();
  const [permissionForm] = Form.useForm();

  // 模拟权限数据
  useEffect(() => {
    const now = dayjs().format('YYYY-MM-DD HH:mm');
    const mockUsers = [
      {
        id: 1,
        username: 'admin',
        name: '系统管理员',
        email: 'admin@yujiali.com',
        role: '超级管理员',
        status: 'active',
        lastLogin: now,
        permissions: ['all']
      },
      {
        id: 2,
        username: 'manager',
        name: '酒店经理',
        email: 'manager@yujiali.com',
        role: '酒店经理',
        status: 'active',
        lastLogin: now,
        permissions: ['hotel_ops', 'security', 'broadcast', 'reports']
      },
      {
        id: 3,
        username: 'security',
        name: '安防主管',
        email: 'security@yujiali.com',
        role: '安防主管',
        status: 'active',
        lastLogin: now,
        permissions: ['security', 'reports']
      },
      {
        id: 4,
        username: 'staff',
        name: '普通员工',
        email: 'staff@yujiali.com',
        role: '普通员工',
        status: 'inactive',
        lastLogin: now,
        permissions: ['basic']
      }
    ];

    const mockRoles = [
      {
        id: 1,
        name: '超级管理员',
        code: 'SUPER_ADMIN',
        description: '拥有系统所有权限',
        userCount: 1,
        permissions: ['all'],
        status: 'active'
      },
      {
        id: 2,
        name: '酒店经理',
        code: 'HOTEL_MANAGER',
        description: '酒店运营管理权限',
        userCount: 2,
        permissions: ['hotel_ops', 'security', 'broadcast', 'reports'],
        status: 'active'
      },
      {
        id: 3,
        name: '安防主管',
        code: 'SECURITY_MANAGER',
        description: '安防系统管理权限',
        userCount: 1,
        permissions: ['security', 'reports'],
        status: 'active'
      },
      {
        id: 4,
        name: '普通员工',
        code: 'STAFF',
        description: '基础操作权限',
        userCount: 5,
        permissions: ['basic'],
        status: 'active'
      }
    ];

    const mockPermissions = [
      {
        id: 1,
        name: '系统管理',
        code: 'SYSTEM_MANAGE',
        description: '系统配置和管理权限',
        category: 'system',
        status: 'active'
      },
      {
        id: 2,
        name: '酒店运营',
        code: 'HOTEL_OPS',
        description: '酒店日常运营管理权限',
        category: 'operations',
        status: 'active'
      },
      {
        id: 3,
        name: '安防管理',
        code: 'SECURITY_MANAGE',
        description: '安防系统管理权限',
        category: 'security',
        status: 'active'
      },
      {
        id: 4,
        name: '广播管理',
        code: 'BROADCAST_MANAGE',
        description: '广播系统管理权限',
        category: 'broadcast',
        status: 'active'
      },
      {
        id: 5,
        name: '数据查看',
        code: 'DATA_VIEW',
        description: '数据查看和报表权限',
        category: 'reports',
        status: 'active'
      }
    ];

    setUsers(mockUsers);
    setRoles(mockRoles);
    setPermissions(mockPermissions);
  }, []);

  // 处理用户表单提交
  const handleUserSubmit = async (values: any) => {
    try {
      const userData = {
        ...values,
        id: editingUser ? editingUser.id : Date.now(),
        lastLogin: editingUser ? editingUser.lastLogin : dayjs().format('YYYY-MM-DD HH:mm'),
        permissions: values.permissions || []
      };

      if (editingUser) {
        setUsers(prev => 
          prev.map(user => user.id === editingUser.id ? userData : user)
        );
        message.success('用户更新成功');
      } else {
        setUsers(prev => [userData, ...prev]);
        message.success('用户创建成功');
      }

      setIsUserModalVisible(false);
      setEditingUser(null);
      userForm.resetFields();
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 处理角色表单提交
  const handleRoleSubmit = async (values: any) => {
    try {
      const roleData = {
        ...values,
        id: editingRole ? editingRole.id : Date.now(),
        userCount: editingRole ? editingRole.userCount : 0,
        status: editingRole ? editingRole.status : 'active'
      };

      if (editingRole) {
        setRoles(prev => 
          prev.map(role => role.id === editingRole.id ? roleData : role)
        );
        message.success('角色更新成功');
      } else {
        setRoles(prev => [roleData, ...prev]);
        message.success('角色创建成功');
      }

      setIsRoleModalVisible(false);
      setEditingRole(null);
      roleForm.resetFields();
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 处理权限表单提交
  const handlePermissionSubmit = async (values: any) => {
    try {
      const permissionData = {
        ...values,
        id: editingPermission ? editingPermission.id : Date.now(),
        status: editingPermission ? editingPermission.status : 'active'
      };

      if (editingPermission) {
        setPermissions(prev => 
          prev.map(permission => permission.id === editingPermission.id ? permissionData : permission)
        );
        message.success('权限更新成功');
      } else {
        setPermissions(prev => [permissionData, ...prev]);
        message.success('权限创建成功');
      }

      setIsPermissionModalVisible(false);
      setEditingPermission(null);
      permissionForm.resetFields();
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 处理用户状态切换
  const handleUserStatusToggle = (userId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
    message.success(`用户已${newStatus === 'active' ? '启用' : '禁用'}`);
  };

  // 处理角色状态切换
  const handleRoleStatusToggle = (roleId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setRoles(prev => 
      prev.map(role => 
        role.id === roleId ? { ...role, status: newStatus } : role
      )
    );
    message.success(`角色已${newStatus === 'active' ? '启用' : '禁用'}`);
  };

  // 获取状态标签颜色
  const getStatusColor = (status: string) => {
    const statusMap: { [key: string]: string } = {
      active: 'green',
      inactive: 'red'
    };
    return statusMap[status] || 'default';
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      active: '启用',
      inactive: '禁用'
    };
    return statusMap[status] || status;
  };

  // 用户表格列定义
  const userColumns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (text: string, record: any) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
          {text}
        </Space>
      )
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => <Tag color="blue">{role}</Tag>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            type="link" 
            size="small"
            icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />}
            onClick={() => handleUserStatusToggle(record.id, record.status)}
          >
            {record.status === 'active' ? '禁用' : '启用'}
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => {
              setEditingUser(record);
              userForm.setFieldsValue(record);
              setIsUserModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            size="small" 
            danger 
            icon={<DeleteOutlined />}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 角色表格列定义
  const roleColumns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <TeamOutlined style={{ color: '#1890ff' }} />
          {text}
          <Tag color="blue">{record.code}</Tag>
        </Space>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '用户数量',
      dataIndex: 'userCount',
      key: 'userCount',
      render: (count: number) => (
        <Badge count={count} showZero style={{ backgroundColor: '#1890ff' }} />
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            type="link" 
            size="small"
            icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />}
            onClick={() => handleRoleStatusToggle(record.id, record.status)}
          >
            {record.status === 'active' ? '禁用' : '启用'}
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => {
              setEditingRole(record);
              roleForm.setFieldsValue(record);
              setIsRoleModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            size="small" 
            danger 
            icon={<DeleteOutlined />}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 权限表格列定义
  const permissionColumns = [
    {
      title: '权限名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <KeyOutlined style={{ color: '#1890ff' }} />
          {text}
          <Tag color="blue">{record.code}</Tag>
        </Space>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => {
        const categoryMap: { [key: string]: string } = {
          system: '系统',
          operations: '运营',
          security: '安防',
          broadcast: '广播',
          reports: '报表'
        };
        return <Tag color="green">{categoryMap[category] || category}</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => {
              setEditingPermission(record);
              permissionForm.setFieldsValue(record);
              setIsPermissionModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            size="small" 
            danger 
            icon={<DeleteOutlined />}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="permission-management">
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <SecurityScanOutlined style={{ marginRight: '8px' }} />
          权限管理
        </Title>
        <Text type="secondary">
          管理用户权限、角色管理、权限分配等系统安全功能
        </Text>
      </div>

      {/* 统计信息 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={users.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总角色数"
              value={roles.length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总权限数"
              value={permissions.length}
              prefix={<KeyOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃用户"
              value={users.filter(user => user.status === 'active').length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 操作按钮 */}
      <Card style={{ marginBottom: 24 }}>
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingUser(null);
              userForm.resetFields();
              setIsUserModalVisible(true);
            }}
          >
            新建用户
          </Button>
          <Button 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingRole(null);
              roleForm.resetFields();
              setIsRoleModalVisible(true);
            }}
          >
            新建角色
          </Button>
          <Button 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingPermission(null);
              permissionForm.resetFields();
              setIsPermissionModalVisible(true);
            }}
          >
            新建权限
          </Button>
        </Space>
      </Card>

      {/* 主体切换为 Tabs */}
      <Card>
        <Tabs defaultActiveKey="users" size="large" type="card">
          <Tabs.TabPane tab="用户管理" key="users">
            <Table 
              columns={userColumns} 
              dataSource={users} 
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="角色管理" key="roles">
            <Table 
              columns={roleColumns} 
              dataSource={roles} 
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="权限管理" key="perms">
            <Table 
              columns={permissionColumns} 
              dataSource={permissions} 
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>

      {/* 用户表单弹窗 */}
      <Modal
        title={editingUser ? '编辑用户' : '新建用户'}
        open={isUserModalVisible}
        onCancel={() => {
          setIsUserModalVisible(false);
          setEditingUser(null);
          userForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={userForm}
          layout="vertical"
          onFinish={handleUserSubmit}
          initialValues={{
            status: 'active'
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input placeholder="请输入用户名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="role"
                label="角色"
                rules={[{ required: true, message: '请选择角色' }]}
              >
                <Select placeholder="请选择角色">
                  {roles.map(role => (
                    <Option key={role.name} value={role.name}>
                      {role.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="permissions"
            label="权限"
          >
            <Select mode="multiple" placeholder="请选择权限">
              {permissions.map(permission => (
                <Option key={permission.code} value={permission.code}>
                  {permission.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingUser ? '更新用户' : '创建用户'}
              </Button>
              <Button onClick={() => {
                setIsUserModalVisible(false);
                setEditingUser(null);
                userForm.resetFields();
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 角色表单弹窗 */}
      <Modal
        title={editingRole ? '编辑角色' : '新建角色'}
        open={isRoleModalVisible}
        onCancel={() => {
          setIsRoleModalVisible(false);
          setEditingRole(null);
          roleForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={roleForm}
          layout="vertical"
          onFinish={handleRoleSubmit}
          initialValues={{
            status: 'active'
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="角色名称"
                rules={[{ required: true, message: '请输入角色名称' }]}
              >
                <Input placeholder="请输入角色名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="角色代码"
                rules={[{ required: true, message: '请输入角色代码' }]}
              >
                <Input placeholder="请输入角色代码" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="角色描述"
            rules={[{ required: true, message: '请输入角色描述' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入角色描述" />
          </Form.Item>

          <Form.Item
            name="permissions"
            label="权限"
          >
            <Select mode="multiple" placeholder="请选择权限">
              {permissions.map(permission => (
                <Option key={permission.code} value={permission.code}>
                  {permission.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingRole ? '更新角色' : '创建角色'}
              </Button>
              <Button onClick={() => {
                setIsRoleModalVisible(false);
                setEditingRole(null);
                roleForm.resetFields();
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 权限表单弹窗 */}
      <Modal
        title={editingPermission ? '编辑权限' : '新建权限'}
        open={isPermissionModalVisible}
        onCancel={() => {
          setIsPermissionModalVisible(false);
          setEditingPermission(null);
          permissionForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={permissionForm}
          layout="vertical"
          onFinish={handlePermissionSubmit}
          initialValues={{
            status: 'active'
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="权限名称"
                rules={[{ required: true, message: '请输入权限名称' }]}
              >
                <Input placeholder="请输入权限名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="权限代码"
                rules={[{ required: true, message: '请输入权限代码' }]}
              >
                <Input placeholder="请输入权限代码" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="权限分类"
                rules={[{ required: true, message: '请选择权限分类' }]}
              >
                <Select placeholder="请选择权限分类">
                  <Option value="system">系统</Option>
                  <Option value="operations">运营</Option>
                  <Option value="security">安防</Option>
                  <Option value="broadcast">广播</Option>
                  <Option value="reports">报表</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="权限描述"
            rules={[{ required: true, message: '请输入权限描述' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入权限描述" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingPermission ? '更新权限' : '创建权限'}
              </Button>
              <Button onClick={() => {
                setIsPermissionModalVisible(false);
                setEditingPermission(null);
                permissionForm.resetFields();
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PermissionManagement;
