import React, { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Form,
  Input,
  Switch,
  Button,
  Select,
  Table,
  Modal,
  message,
  Row,
  Col,
  Divider,
  Typography,
  Space,
  Badge,
  Tag,
  Progress,
  Statistic,
  Alert,
  Upload,
  DatePicker,
  TimePicker,
  Radio,
  Checkbox,
  Slider,
  InputNumber,
  TreeSelect,
  Descriptions,
  List,
  Avatar,
  Popconfirm,
  Tooltip,
  Steps,
  Result
} from 'antd';
import {
  SettingOutlined,
  UserOutlined,
  SecurityScanOutlined,
  DatabaseOutlined,
  BellOutlined,
  GlobalOutlined,
  SafetyOutlined,
  ToolOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
  SyncOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  KeyOutlined,
  MonitorOutlined,
  FileTextOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CopyOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { users, organizationUnits } from '../data/mockData';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Step } = Steps;

// 用户管理组件
const UserManagement: React.FC = () => {
  const [userList, setUserList] = useState(users);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form] = Form.useForm();

  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleDeleteUser = (userId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该用户吗？此操作不可恢复。',
      onOk: () => {
        setUserList(userList.filter(u => u.id !== userId));
        message.success('用户删除成功');
      }
    });
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingUser) {
        // 编辑用户
        setUserList(userList.map(u => 
          u.id === editingUser.id ? { ...u, ...values } : u
        ));
        message.success('用户信息更新成功');
      } else {
        // 新增用户
        const newUser = {
          ...values,
          id: `user${Date.now()}`,
          avatar: '/api/placeholder/40/40'
        };
        setUserList([...userList, newUser]);
        message.success('用户创建成功');
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const columns = [
    {
      title: '用户信息',
      key: 'user',
      render: (record: any) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <div><strong>{record.name}</strong></div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.employeeId}</div>
          </div>
        </Space>
      )
    },
    {
      title: '部门职位',
      key: 'department',
      render: (record: any) => (
        <div>
          <div>{record.department}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.position}</div>
        </div>
      )
    },
    {
      title: '联系方式',
      key: 'contact',
      render: (record: any) => (
        <div>
          <div>{record.email}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.phone}</div>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'active' ? 'success' : status === 'inactive' ? 'error' : 'warning'} 
          text={status === 'active' ? '活跃' : status === 'inactive' ? '停用' : '待激活'} 
        />
      )
    },
    {
      title: '权限级别',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => (
        <Tag color={level === 'admin' ? 'red' : level === 'manager' ? 'orange' : 'blue'}>
          {level === 'admin' ? '管理员' : level === 'manager' ? '主管' : '普通用户'}
        </Tag>
      )
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (date: string) => date || '从未登录'
    },
    {
      title: '操作',
      key: 'action',
      render: (record: any) => (
        <Space>
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEditUser(record)}>
            编辑
          </Button>
          <Button type="text" size="small" icon={<EyeOutlined />}>
            详情
          </Button>
          <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDeleteUser(record.id)}>
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Input.Search placeholder="搜索用户" style={{ width: 200 }} />
          <Select defaultValue="all" style={{ width: 120 }}>
            <Option value="all">全部状态</Option>
            <Option value="active">活跃</Option>
            <Option value="inactive">停用</Option>
            <Option value="pending">待激活</Option>
          </Select>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser}>
          添加用户
        </Button>
      </div>

      <Table
        dataSource={userList}
        columns={columns}
        pagination={{ pageSize: 10 }}
        rowKey="id"
      />

      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="用户姓名" rules={[{ required: true, message: '请输入用户姓名' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="employeeId" label="员工编号" rules={[{ required: true, message: '请输入员工编号' }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email', message: '请输入有效邮箱' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="手机号" rules={[{ required: true, message: '请输入手机号' }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="department" label="部门" rules={[{ required: true, message: '请选择部门' }]}>
                <Select>
                  {organizationUnits.map(unit => (
                    <Option key={unit.id} value={unit.name}>{unit.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="position" label="职位" rules={[{ required: true, message: '请输入职位' }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="level" label="权限级别" rules={[{ required: true, message: '请选择权限级别' }]}>
                <Select>
                  <Option value="user">普通用户</Option>
                  <Option value="manager">主管</Option>
                  <Option value="admin">管理员</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
                <Select>
                  <Option value="active">活跃</Option>
                  <Option value="inactive">停用</Option>
                  <Option value="pending">待激活</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

// 系统配置组件
const SystemConfiguration: React.FC = () => {
  const [config, setConfig] = useState({
    systemName: '邹城市择邻山庄有限公司智慧酒店管理平台',
    version: 'v2.1.0',
    timezone: 'Asia/Shanghai',
    language: 'zh-CN',
    theme: 'light',
    autoBackup: true,
    backupInterval: 24,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    enableSSL: true,
    enableAuditLog: true,
    logRetentionDays: 90,
    maxFileSize: 100,
    allowedFileTypes: ['jpg', 'png', 'pdf', 'doc', 'xls'],
    enableNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    systemMaintenance: false
  });

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveConfig = () => {
    message.loading('正在保存配置...');
    setTimeout(() => {
      message.success('系统配置保存成功');
    }, 1500);
  };

  return (
    <div>
      <Row gutter={24}>
        <Col span={12}>
          <Card title="基本设置" size="small">
            <Form layout="vertical">
              <Form.Item label="系统名称">
                <Input 
                  value={config.systemName}
                  onChange={(e) => handleConfigChange('systemName', e.target.value)}
                />
              </Form.Item>
              <Form.Item label="系统版本">
                <Input value={config.version} disabled />
              </Form.Item>
              <Form.Item label="时区">
                <Select value={config.timezone} onChange={(value) => handleConfigChange('timezone', value)}>
                  <Option value="Asia/Shanghai">中国标准时间 (GMT+8)</Option>
                  <Option value="UTC">协调世界时 (UTC)</Option>
                  <Option value="America/New_York">美国东部时间</Option>
                </Select>
              </Form.Item>
              <Form.Item label="语言">
                <Select value={config.language} onChange={(value) => handleConfigChange('language', value)}>
                  <Option value="zh-CN">简体中文</Option>
                  <Option value="en-US">English</Option>
                </Select>
              </Form.Item>
              <Form.Item label="主题">
                <Radio.Group value={config.theme} onChange={(e) => handleConfigChange('theme', e.target.value)}>
                  <Radio value="light">浅色主题</Radio>
                  <Radio value="dark">深色主题</Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="安全设置" size="small">
            <Form layout="vertical">
              <Form.Item label="最大登录尝试次数">
                <InputNumber 
                  min={1} 
                  max={10} 
                  value={config.maxLoginAttempts}
                  onChange={(value) => handleConfigChange('maxLoginAttempts', value)}
                />
              </Form.Item>
              <Form.Item label="会话超时时间（分钟）">
                <InputNumber 
                  min={5} 
                  max={120} 
                  value={config.sessionTimeout}
                  onChange={(value) => handleConfigChange('sessionTimeout', value)}
                />
              </Form.Item>
              <Form.Item label="启用SSL加密">
                <Switch 
                  checked={config.enableSSL}
                  onChange={(checked) => handleConfigChange('enableSSL', checked)}
                />
              </Form.Item>
              <Form.Item label="启用审计日志">
                <Switch 
                  checked={config.enableAuditLog}
                  onChange={(checked) => handleConfigChange('enableAuditLog', checked)}
                />
              </Form.Item>
              <Form.Item label="日志保留天数">
                <Slider 
                  min={7} 
                  max={365} 
                  value={config.logRetentionDays}
                  onChange={(value) => handleConfigChange('logRetentionDays', value)}
                />
                <Text type="secondary">{config.logRetentionDays} 天</Text>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      <Row gutter={24} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="备份设置" size="small">
            <Form layout="vertical">
              <Form.Item label="自动备份">
                <Switch 
                  checked={config.autoBackup}
                  onChange={(checked) => handleConfigChange('autoBackup', checked)}
                />
              </Form.Item>
              <Form.Item label="备份间隔（小时）">
                <InputNumber 
                  min={1} 
                  max={168} 
                  value={config.backupInterval}
                  onChange={(value) => handleConfigChange('backupInterval', value)}
                  disabled={!config.autoBackup}
                />
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="文件上传设置" size="small">
            <Form layout="vertical">
              <Form.Item label="最大文件大小（MB）">
                <InputNumber 
                  min={1} 
                  max={1000} 
                  value={config.maxFileSize}
                  onChange={(value) => handleConfigChange('maxFileSize', value)}
                />
              </Form.Item>
              <Form.Item label="允许的文件类型">
                <Select 
                  mode="tags" 
                  value={config.allowedFileTypes}
                  onChange={(value) => handleConfigChange('allowedFileTypes', value)}
                >
                  <Option value="jpg">JPG</Option>
                  <Option value="png">PNG</Option>
                  <Option value="pdf">PDF</Option>
                  <Option value="doc">DOC</Option>
                  <Option value="xls">XLS</Option>
                  <Option value="zip">ZIP</Option>
                </Select>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      <Row gutter={24} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="通知设置" size="small">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="启用系统通知">
                  <Switch 
                    checked={config.enableNotifications}
                    onChange={(checked) => handleConfigChange('enableNotifications', checked)}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="邮件通知">
                  <Switch 
                    checked={config.emailNotifications}
                    onChange={(checked) => handleConfigChange('emailNotifications', checked)}
                    disabled={!config.enableNotifications}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="短信通知">
                  <Switch 
                    checked={config.smsNotifications}
                    onChange={(checked) => handleConfigChange('smsNotifications', checked)}
                    disabled={!config.enableNotifications}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Space>
          <Button type="primary" size="large" onClick={handleSaveConfig}>
            保存配置
          </Button>
          <Button size="large">
            重置为默认
          </Button>
          <Button size="large" danger>
            <WarningOutlined /> 系统维护模式
          </Button>
        </Space>
      </div>
    </div>
  );
};

// 数据备份组件
const DataBackup: React.FC = () => {
  const [backupHistory, setBackupHistory] = useState([
    { id: 1, name: 'auto_backup_20250115_140000', type: 'auto', size: '125.6 MB', date: '2025-08-05 14:00:00', status: 'success' },
    { id: 2, name: 'manual_backup_20250115_120000', type: 'manual', size: '124.2 MB', date: '2025-08-05 12:00:00', status: 'success' },
    { id: 3, name: 'auto_backup_20250115_020000', type: 'auto', size: '123.8 MB', date: '2025-08-05 02:00:00', status: 'success' },
    { id: 4, name: 'manual_backup_20250114_180000', type: 'manual', size: '122.4 MB', date: '2025-07-14 18:00:00', status: 'success' },
    { id: 5, name: 'auto_backup_20250114_140000', type: 'auto', size: '121.9 MB', date: '2025-07-14 14:00:00', status: 'failed' }
  ]);

  const handleCreateBackup = () => {
    Modal.confirm({
      title: '创建备份',
      content: '确定要创建系统备份吗？此过程可能需要几分钟时间。',
      onOk: () => {
        message.loading('正在创建备份...', 0);
        setTimeout(() => {
          message.destroy();
          const newBackup = {
            id: Date.now(),
            name: `manual_backup_${dayjs().format('YYYYMMDD_HHmmss')}`,
            type: 'manual',
            size: '126.8 MB',
            date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            status: 'success'
          };
          setBackupHistory([newBackup, ...backupHistory]);
          message.success('备份创建成功');
        }, 3000);
      }
    });
  };

  const handleRestoreBackup = (backup: any) => {
    Modal.confirm({
      title: '恢复备份',
      content: `确定要恢复到备份 "${backup.name}" 吗？此操作将覆盖当前数据，且不可撤销。`,
      okText: '确定恢复',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        message.loading('正在恢复备份...', 0);
        setTimeout(() => {
          message.destroy();
          message.success('备份恢复成功');
        }, 4000);
      }
    });
  };

  const handleDownloadBackup = (backup: any) => {
    message.info('开始下载备份文件...');
    // 这里可以实现实际的下载逻辑
  };

  const handleDeleteBackup = (backupId: number) => {
    Modal.confirm({
      title: '删除备份',
      content: '确定要删除这个备份吗？删除后无法恢复。',
      okType: 'danger',
      onOk: () => {
        setBackupHistory(backupHistory.filter(b => b.id !== backupId));
        message.success('备份删除成功');
      }
    });
  };

  const columns = [
    {
      title: '备份名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: any) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{name}</div>
          <Tag color={record.type === 'auto' ? 'blue' : 'green'}>
            {record.type === 'auto' ? '自动备份' : '手动备份'}
          </Tag>
        </div>
      )
    },
    {
      title: '文件大小',
      dataIndex: 'size',
      key: 'size'
    },
    {
      title: '创建时间',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'success' ? 'success' : 'error'} 
          text={status === 'success' ? '成功' : '失败'} 
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (record: any) => (
        <Space>
          <Button 
            type="text" 
            size="small" 
            icon={<SyncOutlined />}
            onClick={() => handleRestoreBackup(record)}
            disabled={record.status !== 'success'}
          >
            恢复
          </Button>
          <Button 
            type="text" 
            size="small" 
            icon={<DownloadOutlined />}
            onClick={() => handleDownloadBackup(record)}
            disabled={record.status !== 'success'}
          >
            下载
          </Button>
          <Button 
            type="text" 
            size="small" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteBackup(record.id)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Row gutter={24} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总备份数量"
              value={backupHistory.length}
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="成功备份"
              value={backupHistory.filter(b => b.status === 'success').length}
              valueStyle={{ color: '#3f8600' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总存储大小"
              value="623.9 MB"
              prefix={<CloudUploadOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="下次自动备份"
              value="2小时后"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateBackup}>
            创建备份
          </Button>
          <Button icon={<SyncOutlined />}>
            刷新列表
          </Button>
        </Space>
        <Space>
          <Button icon={<SettingOutlined />}>
            备份设置
          </Button>
          <Button icon={<CloudUploadOutlined />}>
            云端备份
          </Button>
        </Space>
      </div>

      <Table
        dataSource={backupHistory}
        columns={columns}
        pagination={{ pageSize: 10 }}
        rowKey="id"
      />
    </div>
  );
};

// 系统监控组件
const SystemMonitoring: React.FC = () => {
  const [systemStats, setSystemStats] = useState({
    cpuUsage: 45.2,
    memoryUsage: 68.5,
    diskUsage: 52.0,
    networkIn: 156.3,
    networkOut: 89.7,
    activeUsers: 156,
    totalRequests: 8964,
    errorRate: 0.02,
    responseTime: 245
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        cpuUsage: Math.round((Math.random() * 80 + 10) * 10) / 10,
        memoryUsage: Math.round((Math.random() * 90 + 10) * 10) / 10,
        networkIn: Math.round((Math.random() * 1000 + 100) * 10) / 10,
        networkOut: Math.round((Math.random() * 800 + 50) * 10) / 10,
        responseTime: Math.round(Math.random() * 300 + 100)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="CPU 使用率"
              value={systemStats.cpuUsage}
              precision={1}
              suffix="%"
              valueStyle={{ color: systemStats.cpuUsage > 80 ? '#cf1322' : '#3f8600' }}
            />
            <Progress percent={systemStats.cpuUsage} showInfo={false} strokeColor={systemStats.cpuUsage > 80 ? '#ff4d4f' : '#52c41a'} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="内存使用率"
              value={systemStats.memoryUsage}
              precision={1}
              suffix="%"
              valueStyle={{ color: systemStats.memoryUsage > 80 ? '#cf1322' : '#3f8600' }}
            />
            <Progress percent={systemStats.memoryUsage} showInfo={false} strokeColor={systemStats.memoryUsage > 80 ? '#ff4d4f' : '#52c41a'} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="磁盘使用率"
              value={systemStats.diskUsage}
              precision={1}
              suffix="%"
              valueStyle={{ color: systemStats.diskUsage > 80 ? '#cf1322' : '#3f8600' }}
            />
            <Progress percent={systemStats.diskUsage} showInfo={false} strokeColor={systemStats.diskUsage > 80 ? '#ff4d4f' : '#52c41a'} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线用户"
              value={systemStats.activeUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="网络入流量"
              value={systemStats.networkIn}
              precision={1}
              suffix="KB/s"
              prefix={<DownloadOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="网络出流量"
              value={systemStats.networkOut}
              precision={1}
              suffix="KB/s"
              prefix={<CloudUploadOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总请求数"
              value={systemStats.totalRequests}
              prefix={<GlobalOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均响应时间"
              value={systemStats.responseTime}
              precision={0}
              suffix="ms"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="系统告警" size="small">
            <List
              dataSource={[
                { type: 'warning', message: 'CPU使用率较高', time: '2025-08-05 14:30' },
                { type: 'info', message: '定时备份完成', time: '2025-08-05 14:00' },
                { type: 'error', message: '磁盘空间不足', time: '2025-08-05 13:45' }
              ]}
              renderItem={(item: any) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      item.type === 'error' ? <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} /> :
                      item.type === 'warning' ? <WarningOutlined style={{ color: '#faad14' }} /> :
                      <InfoCircleOutlined style={{ color: '#1890ff' }} />
                    }
                    title={item.message}
                    description={item.time}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="系统日志" size="small">
            <List
              dataSource={[
                { action: '用户登录', user: '张伟民', ip: '192.168.1.100', time: '2025-08-05 14:30' },
                { action: '创建备份', user: '系统', ip: 'localhost', time: '2025-08-05 14:00' },
                { action: '修改配置', user: '李管理', ip: '192.168.1.102', time: '2025-08-05 13:45' }
              ]}
              renderItem={(item: any) => (
                <List.Item>
                  <List.Item.Meta
                    title={`${item.action} - ${item.user}`}
                    description={`${item.ip} | ${item.time}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const SystemSettings: React.FC = () => {
  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <SettingOutlined /> 系统设置
        </Title>
        <Paragraph type="secondary">
          管理系统配置、用户权限、数据备份和系统监控
        </Paragraph>
      </div>

      <Tabs defaultActiveKey="config" type="card" size="large">
        <TabPane tab={<span><SettingOutlined />系统配置</span>} key="config">
          <SystemConfiguration />
        </TabPane>
        
        <TabPane tab={<span><UserOutlined />用户管理</span>} key="users">
          <UserManagement />
        </TabPane>
        
        <TabPane tab={<span><DatabaseOutlined />数据备份</span>} key="backup">
          <DataBackup />
        </TabPane>
        
        <TabPane tab={<span><MonitorOutlined />系统监控</span>} key="monitor">
          <SystemMonitoring />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SystemSettings; 