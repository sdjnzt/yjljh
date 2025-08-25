import React, { useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Tree, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Space, 
  Avatar, 
  Tag, 
  Descriptions,
  Statistic,
  Badge,
  Tooltip,
  Divider,
  Progress,
  Tabs,
  Timeline,
  Empty,
  message
} from 'antd';
import { 
  TeamOutlined, 
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  RiseOutlined,
  FallOutlined,
  HomeOutlined,
  SafetyOutlined,
  ExperimentOutlined,
  DollarOutlined,
  UserSwitchOutlined,
  FilterOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { organizationUnits, users } from '../data/mockData';

const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;

const OrganizationManagement: React.FC = () => {
  const [selectedUnit, setSelectedUnit] = useState<string>('dept002');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'unit' | 'user'>('unit');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isUserDetailVisible, setIsUserDetailVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAddUnit = () => {
    setModalType('unit');
    setIsModalVisible(true);
  };

  const handleAddUser = () => {
    setModalType('user');
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(() => {
      console.log('提交数据:', form.getFieldsValue());
      message.success(modalType === 'unit' ? '部门添加成功' : '人员添加成功');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleUserDetail = (user: any) => {
    setSelectedUser(user);
    setIsUserDetailVisible(true);
  };

  // 构建树形数据
  const buildTreeData = (units: any[]): any[] => {
    return units.map(unit => ({
      title: (
        <Space>
          <TeamOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontWeight: 'bold' }}>{unit.name}</span>
          <Badge count={unit.memberCount} style={{ backgroundColor: '#52c41a' }} />
        </Space>
      ),
      key: unit.id,
      children: unit.children ? buildTreeData(unit.children) : [],
    }));
  };

  const treeData = buildTreeData(organizationUnits);

  // 获取选中部门的详细信息
  const getSelectedUnitInfo = () => {
    const findUnit = (units: any[], targetId: string): any => {
      for (const unit of units) {
        if (unit.id === targetId) return unit;
        if (unit.children) {
          const found = findUnit(unit.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };
    return findUnit(organizationUnits, selectedUnit);
  };

  // 获取选中部门的用户
  const getSelectedUnitUsers = () => {
    const unitInfo = getSelectedUnitInfo();
    if (!unitInfo) return [];
    
    return users.filter(user => {
      const matchDept = user.department === unitInfo.name;
      const matchSearch = searchText === '' || 
        user.name.includes(searchText) || 
        user.role.includes(searchText) ||
        user.phone.includes(searchText) ||
        user.email?.includes(searchText);
      const matchStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchLevel = levelFilter === 'all' || user.level === levelFilter;
      
      return matchDept && matchSearch && matchStatus && matchLevel;
    });
  };

  // 统计数据
  const totalUsers = 312; // 固定显示为三百多人
  const onlineUsers = 287; // 固定显示在线人数
  const busyUsers = users.filter(u => u.status === 'busy').length;
  const offlineUsers = users.filter(u => u.status === 'offline').length;
  const totalUnits = organizationUnits.length + organizationUnits.reduce((sum, unit) => sum + (unit.children?.length || 0), 0);

  const selectedUnitInfo = getSelectedUnitInfo();
  const selectedUnitUsers = getSelectedUnitUsers();

  const userColumns = [
    {
      title: '员工信息',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="small" />
          <div>
            <div style={{ fontWeight: 'bold' }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>ID: {record.employeeId}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '职位',
      dataIndex: 'role',
      key: 'role',
      render: (text: string, record: any) => (
        <div>
          <div>{text}</div>
          <Tag color="blue">{record.level}</Tag>
        </div>
      ),
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      key: 'phone',
      render: (text: string, record: any) => (
        <div>
          <div><PhoneOutlined /> {text}</div>
          {record.email && <div style={{ fontSize: '12px', color: '#666' }}><MailOutlined /> {record.email}</div>}
        </div>
      ),
    },
    {
      title: '工作地点',
      dataIndex: 'workLocation',
      key: 'workLocation',
      render: (text: string) => (
        <div>
          <EnvironmentOutlined /> {text}
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          online: { color: 'green', text: '在线' },
          offline: { color: 'red', text: '离线' },
          busy: { color: 'orange', text: '忙碌' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Badge status={config.color as any} text={config.text} />;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<UserOutlined />} 
              size="small"
              onClick={() => handleUserDetail(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button type="text" icon={<EditOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="删除">
            <Button type="text" icon={<DeleteOutlined />} size="small" danger />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>组织架构管理</h2>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUnit}>
            新增部门
          </Button>
          <Button type="primary" icon={<UserAddOutlined />} onClick={handleAddUser}>
            添加人员
          </Button>
          <Button icon={<DownloadOutlined />}>
            导出数据
          </Button>
        </Space>
      </div>

      {/* 统计概览 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总员工数"
              value={totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线人数"
              value={onlineUsers}
              prefix={<Badge status="success" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="忙碌人数"
              value={busyUsers}
              prefix={<Badge status="warning" />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="组织单位"
              value={totalUnits}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={16}>
        {/* 组织架构树 */}
        <Col span={8}>
          <Card 
            title={
              <Space>
                <TeamOutlined />
                <span>组织架构</span>
              </Space>
            }
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                size="small"
                onClick={handleAddUnit}
              >
                新增部门
              </Button>
            }
            style={{ height: 700 }}
          >
            <Tree
              treeData={treeData}
              defaultSelectedKeys={[selectedUnit]}
              defaultExpandedKeys={['dept001', 'dept002', 'dept003']}
              onSelect={(keys) => {
                if (keys.length > 0) {
                  setSelectedUnit(keys[0] as string);
                }
              }}
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>

        {/* 部门详情和人员列表 */}
        <Col span={16}>
          <Card style={{ height: 700 }}>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab={<span><HomeOutlined />部门概览</span>} key="overview">
                {selectedUnitInfo ? (
                  <div>
                    <Descriptions title={selectedUnitInfo.name} bordered column={2}>
                      <Descriptions.Item label="部门类型">
                        <Tag color="blue">{selectedUnitInfo.type === 'department' ? '部门' : selectedUnitInfo.type === 'team' ? '团队' : '小组'}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="部门负责人">
              <Space>
                          <Avatar icon={<UserOutlined />} size="small" />
                          {selectedUnitInfo.manager}
              </Space>
                      </Descriptions.Item>
                      <Descriptions.Item label="联系电话">
                        <PhoneOutlined /> {selectedUnitInfo.managerPhone}
                      </Descriptions.Item>
                      <Descriptions.Item label="工作地点">
                        <EnvironmentOutlined /> {selectedUnitInfo.location}
                      </Descriptions.Item>
                      <Descriptions.Item label="成立时间">
                        <CalendarOutlined /> {selectedUnitInfo.establishedDate}
                      </Descriptions.Item>
                      <Descriptions.Item label="年度预算">
                        <DollarOutlined /> {selectedUnitInfo.budget ? `${(selectedUnitInfo.budget / 10000).toFixed(1)}万元` : '未设置'}
                      </Descriptions.Item>
                    </Descriptions>
                    
                    <div style={{ marginTop: 24 }}>
                      <h4>部门介绍</h4>
                      <p>{selectedUnitInfo.description}</p>
                    </div>

                    <Row gutter={16} style={{ marginTop: 24 }}>
                      <Col span={8}>
                        <Card>
                          <Statistic
                            title="总人数"
                            value={`${selectedUnitInfo.memberCount}（全司312人）`}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<UserOutlined />}
                          />
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card>
                          <Statistic
                            title="在线人数"
                            value={selectedUnitUsers.filter(u => u.status === 'online').length}
                            valueStyle={{ color: '#52c41a' }}
                            prefix={<Badge status="success" />}
                          />
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card>
                          <Statistic
                            title="出勤率"
                            value={selectedUnitUsers.length > 0 ? Math.round((selectedUnitUsers.filter(u => u.status !== 'offline').length / selectedUnitUsers.length) * 100) : 0}
                            suffix="%"
                            valueStyle={{ color: '#1890ff' }}
                            prefix={<RiseOutlined />}
                          />
                        </Card>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <Empty description="请选择部门查看详情" />
                )}
              </TabPane>

              <TabPane tab={<span><UserOutlined />人员管理</span>} key="personnel">
                <div style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Search
                        placeholder="搜索员工姓名、职位"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: '100%' }}
                      />
                </Col>
                    <Col span={4}>
                      <Select
                        placeholder="状态筛选"
                        value={statusFilter}
                        onChange={setStatusFilter}
                        style={{ width: '100%' }}
                      >
                        <Option value="all">全部状态</Option>
                        <Option value="online">在线</Option>
                        <Option value="busy">忙碌</Option>
                        <Option value="offline">离线</Option>
                      </Select>
                </Col>
                    <Col span={4}>
                      <Select
                        placeholder="级别筛选"
                        value={levelFilter}
                        onChange={setLevelFilter}
                        style={{ width: '100%' }}
                      >
                        <Option value="all">全部级别</Option>
                        <Option value="初级">初级</Option>
                        <Option value="中级">中级</Option>
                        <Option value="高级">高级</Option>
                        <Option value="专家">专家</Option>
                      </Select>
                </Col>
                <Col span={6}>
                      <Button type="primary" icon={<UserAddOutlined />} onClick={handleAddUser}>
                        添加人员
                      </Button>
                </Col>
              </Row>
            </div>

            <Table
                  dataSource={selectedUnitUsers}
              columns={userColumns}
                  pagination={{ pageSize: 10 }}
                  size="middle"
                  scroll={{ y: 400 }}
            />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>

      {/* 添加部门/用户模态框 */}
      <Modal
        title={modalType === 'unit' ? '新增部门' : '添加人员'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          {modalType === 'unit' ? (
            <>
              <Form.Item
                name="name"
                label="部门名称"
                rules={[{ required: true, message: '请输入部门名称' }]}
              >
                <Input placeholder="请输入部门名称" />
              </Form.Item>
              
              <Form.Item
                name="parentId"
                label="上级部门"
              >
                <Select placeholder="选择上级部门">
                  {organizationUnits.map(unit => (
                    <Option key={unit.id} value={unit.id}>
                      {unit.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="manager"
                label="部门负责人"
                rules={[{ required: true, message: '请输入负责人' }]}
              >
                <Input placeholder="请输入负责人姓名" />
              </Form.Item>

              <Form.Item
                name="managerPhone"
                label="负责人电话"
                rules={[{ required: true, message: '请输入负责人电话' }]}
              >
                <Input placeholder="请输入负责人电话" />
              </Form.Item>

              <Form.Item
                name="location"
                label="工作地点"
                rules={[{ required: true, message: '请输入工作地点' }]}
              >
                <Input placeholder="请输入工作地点" />
              </Form.Item>

              <Form.Item
                name="type"
                label="部门类型"
                rules={[{ required: true, message: '请选择部门类型' }]}
              >
                <Select placeholder="请选择部门类型">
                  <Option value="department">部门</Option>
                  <Option value="team">团队</Option>
                  <Option value="group">小组</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="description"
                label="部门描述"
              >
                <Input.TextArea rows={3} placeholder="请输入部门职责和描述" />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input placeholder="请输入姓名" />
              </Form.Item>

              <Form.Item
                name="employeeId"
                label="员工编号"
                rules={[{ required: true, message: '请输入员工编号' }]}
              >
                <Input placeholder="请输入员工编号" />
              </Form.Item>

              <Form.Item
                name="department"
                label="所属部门"
                rules={[{ required: true, message: '请选择部门' }]}
              >
                <Select placeholder="请选择部门">
                  {organizationUnits.map(unit => (
                    <Option key={unit.id} value={unit.name}>
                      {unit.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="role"
                label="职位"
                rules={[{ required: true, message: '请输入职位' }]}
              >
                <Input placeholder="请输入职位" />
              </Form.Item>

              <Form.Item
                name="level"
                label="级别"
                rules={[{ required: true, message: '请选择级别' }]}
              >
                <Select placeholder="请选择级别">
                  <Option value="初级">初级</Option>
                  <Option value="中级">中级</Option>
                  <Option value="高级">高级</Option>
                  <Option value="专家">专家</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="phone"
                label="联系电话"
                rules={[{ required: true, message: '请输入联系电话' }]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>

              <Form.Item
                name="email"
                label="邮箱"
                rules={[{ required: true, message: '请输入邮箱' }]}
              >
                <Input placeholder="请输入邮箱" />
              </Form.Item>

              <Form.Item
                name="workLocation"
                label="工作地点"
                rules={[{ required: true, message: '请输入工作地点' }]}
              >
                <Input placeholder="请输入工作地点" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>

      {/* 用户详情模态框 */}
      <Modal
        title="员工详细信息"
        visible={isUserDetailVisible}
        onCancel={() => setIsUserDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsUserDetailVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {selectedUser && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar size={64} icon={<UserOutlined />} style={{ marginBottom: 16 }} />
              <h3>{selectedUser.name}</h3>
              <Tag color="blue">{selectedUser.role}</Tag>
              <Badge status={selectedUser.status === 'online' ? 'success' : selectedUser.status === 'busy' ? 'warning' : 'error'} 
                     text={selectedUser.status === 'online' ? '在线' : selectedUser.status === 'busy' ? '忙碌' : '离线'} />
            </div>

            <Descriptions bordered column={2}>
              <Descriptions.Item label="员工编号">{selectedUser.employeeId}</Descriptions.Item>
              <Descriptions.Item label="职业级别">
                <Tag color="gold">{selectedUser.level}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="所属部门">{selectedUser.department}</Descriptions.Item>
              <Descriptions.Item label="直属上级">{selectedUser.supervisor}</Descriptions.Item>
              <Descriptions.Item label="联系电话">
                <PhoneOutlined /> {selectedUser.phone}
              </Descriptions.Item>
              <Descriptions.Item label="邮箱地址">
                <MailOutlined /> {selectedUser.email}
              </Descriptions.Item>
              <Descriptions.Item label="工作地点">
                <EnvironmentOutlined /> {selectedUser.workLocation}
              </Descriptions.Item>
              <Descriptions.Item label="入职时间">
                <CalendarOutlined /> {selectedUser.joinDate}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrganizationManagement; 