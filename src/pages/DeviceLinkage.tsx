import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Switch, 
  Space, 
  Tag, 
  Row, 
  Col, 
  Statistic, 
  Alert, 
  Descriptions, 
  Tabs, 
  Divider,
  Badge,
  Tooltip,
  Progress,
  Typography
} from 'antd';
import { 
  ApiOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  PlayCircleOutlined, 
  EyeOutlined,
  ClockCircleOutlined,
  BulbOutlined,
  LockOutlined,
  SafetyOutlined,
  RobotOutlined,
  ThunderboltOutlined,
  SettingOutlined,
  CopyOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { deviceLinkages, DeviceLinkage, hotelRooms } from '../data/mockData';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

// 预设联动场景
const presetScenarios = [
  {
    name: '客人入住场景',
    description: '客人办理入住时自动开启房间设备',
    triggerType: 'guest_checkin',
    actions: [
      { deviceName: '中央空调', action: '开启', parameters: { temperature: 22, mode: 'auto' } },
      { deviceName: '智能照明', action: '开启', parameters: { brightness: 80, mode: 'warm' } },
      { deviceName: '智能电视', action: '开启', parameters: { volume: 30 } },
      { deviceName: '电动窗帘', action: '开启', parameters: { position: 'open' } }
    ]
  },
  {
    name: '客人退房场景',
    description: '客人退房后自动关闭设备并启动清洁模式',
    triggerType: 'guest_checkout',
    actions: [
      { deviceName: '中央空调', action: '关闭', parameters: {} },
      { deviceName: '智能照明', action: '关闭', parameters: {} },
      { deviceName: '智能电视', action: '关闭', parameters: {} },
      { deviceName: '电动窗帘', action: '关闭', parameters: { position: 'closed' } }
    ]
  },
  {
    name: '节能模式',
    description: '夜间自动降低设备功率以节省能源',
    triggerType: 'time_based',
    actions: [
      { deviceName: '中央空调', action: '调节', parameters: { temperature: 26, mode: 'eco' } },
      { deviceName: '智能照明', action: '调节', parameters: { brightness: 30, mode: 'night' } }
    ]
  },
  {
    name: '安全模式',
    description: '检测到异常时自动启动安全措施',
    triggerType: 'sensor_based',
    actions: [
      { deviceName: '门禁系统', action: '锁定', parameters: { level: 'emergency' } },
      { deviceName: '监控摄像头', action: '开启', parameters: { recording: true, motionDetection: true } },
      { deviceName: '消防系统', action: '准备', parameters: { status: 'standby' } }
    ]
  },
  {
    name: 'VIP服务场景',
    description: 'VIP客人入住时提供高级服务',
    triggerType: 'guest_checkin',
    actions: [
      { deviceName: '中央空调', action: '开启', parameters: { temperature: 20, mode: 'luxury' } },
      { deviceName: '智能照明', action: '开启', parameters: { brightness: 100, mode: 'luxury' } },
      { deviceName: '送餐机器人', action: '准备', parameters: { service: 'vip_welcome' } },
      { deviceName: '迷你吧', action: '补充', parameters: { items: 'premium' } }
    ]
  }
];

const DeviceLinkagePage: React.FC = () => {
  const [linkages, setLinkages] = useState<DeviceLinkage[]>(deviceLinkages);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [presetModalVisible, setPresetModalVisible] = useState(false);
  const [selectedLinkage, setSelectedLinkage] = useState<DeviceLinkage | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<any>(null);
  const [form] = Form.useForm();
  const [presetForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filterText, setFilterText] = useState('');

  // 统计数据
  const totalLinkages = linkages.length;
  const enabledLinkages = linkages.filter(l => l.isEnabled).length;
  const totalExecutions = linkages.reduce((sum, l) => sum + l.executionCount, 0);
  const recentExecutions = linkages.filter(l => l.lastExecuted && 
    new Date(l.lastExecuted).getTime() > Date.now() - 24 * 60 * 60 * 1000
  ).length;

  // 获取触发类型标签
  const getTriggerTypeTag = (type: string) => {
    const typeConfig = {
      manual: { color: 'blue', text: '手动触发', icon: <ThunderboltOutlined /> },
      time_based: { color: 'green', text: '定时触发', icon: <ClockCircleOutlined /> },
      sensor_based: { color: 'orange', text: '传感器触发', icon: <SafetyOutlined /> },
      guest_checkin: { color: 'purple', text: '入住触发', icon: <LockOutlined /> },
      guest_checkout: { color: 'cyan', text: '退房触发', icon: <LockOutlined /> }
    };
    const config = typeConfig[type as keyof typeof typeConfig];
    return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>;
  };

  // 获取设备类型图标
  const getDeviceIcon = (deviceType: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      air_conditioner: <SettingOutlined />,
      lighting: <BulbOutlined />,
      door_lock: <LockOutlined />,
      delivery_robot: <RobotOutlined />,
      access_control: <SafetyOutlined />,
      elevator: <SafetyOutlined />,
      fire_alarm: <SafetyOutlined />,
      cctv_camera: <SafetyOutlined />
    };
    return iconMap[deviceType] || <SettingOutlined />;
  };

  // 切换联动状态
  const toggleLinkage = (id: string, enabled: boolean) => {
    setLinkages(prev => prev.map(linkage => 
      linkage.id === id ? { ...linkage, isEnabled: enabled } : linkage
    ));
  };

  // 批量切换状态
  const batchToggleStatus = (enabled: boolean) => {
    setLinkages(prev => prev.map(linkage => 
      selectedRowKeys.includes(linkage.id) ? { ...linkage, isEnabled: enabled } : linkage
    ));
    setSelectedRowKeys([]);
  };

  // 批量删除
  const batchDelete = () => {
    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个联动规则吗？`,
      onOk: () => {
        setLinkages(prev => prev.filter(l => !selectedRowKeys.includes(l.id)));
        setSelectedRowKeys([]);
      }
    });
  };

  // 手动执行联动
  const executeLinkage = (linkage: DeviceLinkage) => {
    setLinkages(prev => prev.map(l => 
      l.id === linkage.id 
        ? { 
            ...l, 
            executionCount: l.executionCount + 1,
            lastExecuted: new Date().toLocaleString()
          }
        : l
    ));
    
    Modal.success({
      title: '联动执行成功',
      content: `${linkage.name} 已成功执行`,
      icon: <PlayCircleOutlined style={{ color: '#52c41a' }} />
    });
  };

  // 删除联动
  const deleteLinkage = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个联动规则吗？',
      onOk: () => {
        setLinkages(prev => prev.filter(l => l.id !== id));
      }
    });
  };

  // 复制联动规则
  const copyLinkage = (linkage: DeviceLinkage) => {
    const newLinkage: DeviceLinkage = {
      ...linkage,
      id: `linkage_${Date.now()}`,
      name: `${linkage.name} (副本)`,
      executionCount: 0,
      lastExecuted: undefined
    };
    setLinkages(prev => [newLinkage, ...prev]);
    
    Modal.success({
      title: '复制成功',
      content: '联动规则已复制'
    });
  };

  // 保存联动规则
  const saveLinkage = (values: any) => {
    const newLinkage: DeviceLinkage = {
      id: `linkage_${Date.now()}`,
      name: values.name,
      description: values.description,
      triggerType: values.triggerType,
      triggerCondition: values.triggerCondition,
      actions: values.actions || [],
      isEnabled: true,
      roomNumbers: values.roomNumbers || [],
      executionCount: 0
    };

    setLinkages(prev => [newLinkage, ...prev]);
    setModalVisible(false);
    form.resetFields();
  };

  // 应用预设场景
  const applyPreset = (preset: any) => {
    setSelectedPreset(preset);
    setPresetModalVisible(true);
  };

  // 保存预设场景
  const savePreset = (values: any) => {
    const newLinkage: DeviceLinkage = {
      id: `linkage_${Date.now()}`,
      name: values.name || selectedPreset.name,
      description: values.description || selectedPreset.description,
      triggerType: selectedPreset.triggerType,
      triggerCondition: values.triggerCondition || '预设场景触发',
      actions: selectedPreset.actions.map((action: any) => ({
        deviceId: `device_${Date.now()}_${Math.random()}`,
        ...action
      })),
      isEnabled: true,
      roomNumbers: values.roomNumbers || [],
      executionCount: 0
    };

    setLinkages(prev => [newLinkage, ...prev]);
    setPresetModalVisible(false);
    setSelectedPreset(null);
    presetForm.resetFields();
  };

  // 过滤联动规则
  const filteredLinkages = linkages.filter(linkage => {
    const matchesTab = activeTab === 'all' || linkage.triggerType === activeTab;
    const matchesFilter = !filterText || 
      linkage.name.toLowerCase().includes(filterText.toLowerCase()) ||
      linkage.description.toLowerCase().includes(filterText.toLowerCase());
    return matchesTab && matchesFilter;
  });

  // 表格列配置
  const columns = [
    {
      title: '联动规则',
      key: 'rule',
      width: 280,
      render: (record: DeviceLinkage) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 4, display: 'flex', alignItems: 'center' }}>
            {record.name}
            {record.executionCount > 100 && (
              <Badge count="热门" style={{ backgroundColor: '#f50', marginLeft: 8 }} />
            )}
          </div>
          <div style={{ color: '#666', fontSize: '12px' }}>{record.description}</div>
          <div style={{ marginTop: 4 }}>
                         <Space size="small">
               {record.roomNumbers.slice(0, 3).map(room => (
                 <Tag key={room}>房间 {room}</Tag>
               ))}
               {record.roomNumbers.length > 3 && (
                 <Tag>+{record.roomNumbers.length - 3}</Tag>
               )}
             </Space>
          </div>
        </div>
      ),
    },
    {
      title: '触发类型',
      dataIndex: 'triggerType',
      key: 'triggerType',
      width: 120,
      render: (type: string) => getTriggerTypeTag(type),
    },
    {
      title: '执行统计',
      key: 'stats',
      width: 150,
      render: (record: DeviceLinkage) => (
        <div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            执行: {record.executionCount} 次
          </div>
          <Progress 
            percent={Math.min(record.executionCount / 10, 100)} 
            size="small" 
            showInfo={false}
            strokeColor={record.executionCount > 50 ? '#52c41a' : '#1890ff'}
          />
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'isEnabled',
      key: 'isEnabled',
      width: 100,
      render: (enabled: boolean, record: DeviceLinkage) => (
        <div>
          <Switch
            checked={enabled}
            onChange={(checked) => toggleLinkage(record.id, checked)}
            checkedChildren="启用"
            unCheckedChildren="禁用"
          />
          {record.lastExecuted && (
            <div style={{ fontSize: '10px', color: '#999', marginTop: 4 }}>
              {dayjs(record.lastExecuted).fromNow()}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (record: DeviceLinkage) => (
        <Space>
          <Tooltip title="查看详情">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedLinkage(record);
                setDetailModalVisible(true);
              }}
            />
          </Tooltip>
          {record.isEnabled && (
            <Tooltip title="手动执行">
              <Button
                type="link"
                size="small"
                icon={<PlayCircleOutlined />}
                onClick={() => executeLinkage(record)}
              />
            </Tooltip>
          )}
          <Tooltip title="复制规则">
            <Button
              type="link"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => copyLinkage(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                // 编辑功能
              }}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => deleteLinkage(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="联动规则"
              value={totalLinkages}
              prefix={<ApiOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="启用中"
              value={enabledLinkages}
              suffix={`/ ${totalLinkages}`}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总执行次数"
              value={totalExecutions}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="24小时执行"
              value={recentExecutions}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 预设场景卡片 */}
      <Card 
        title="预设联动场景" 
        style={{ marginBottom: 16 }}
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            自定义联动
          </Button>
        }
      >
        <Row gutter={16}>
          {presetScenarios.map((preset, index) => (
            <Col span={8} key={index} style={{ marginBottom: 16 }}>
              <Card 
                size="small" 
                hoverable
                onClick={() => applyPreset(preset)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  {getDeviceIcon('air_conditioner')}
                  <Title level={5} style={{ margin: '0 0 0 8px' }}>{preset.name}</Title>
                </div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {preset.description}
                </Text>
                <div style={{ marginTop: 8 }}>
                  {getTriggerTypeTag(preset.triggerType)}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 联动列表 */}
      <Row gutter={16}>
        <Col span={24}>
          <Card
            title={
              <Space>
                <span>设备联动规则</span>
                {selectedRowKeys.length > 0 && (
                  <Badge count={selectedRowKeys.length} style={{ backgroundColor: '#1890ff' }} />
                )}
              </Space>
            }
            extra={
              <Space>
                <Input
                  placeholder="搜索联动规则"
                  prefix={<FilterOutlined />}
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  style={{ width: 200 }}
                />
                {selectedRowKeys.length > 0 && (
                  <>
                    <Button 
                      size="small" 
                      onClick={() => batchToggleStatus(true)}
                    >
                      批量启用
                    </Button>
                    <Button 
                      size="small" 
                      onClick={() => batchToggleStatus(false)}
                    >
                      批量禁用
                    </Button>
                    <Button 
                      size="small" 
                      danger 
                      onClick={batchDelete}
                    >
                      批量删除
                    </Button>
                  </>
                )}
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setModalVisible(true)}
                >
                  新建联动
                </Button>
              </Space>
            }
          >
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab}
              style={{ marginBottom: 16 }}
            >
              <TabPane tab="全部" key="all" />
              <TabPane tab="手动触发" key="manual" />
              <TabPane tab="定时触发" key="time_based" />
              <TabPane tab="传感器触发" key="sensor_based" />
              <TabPane tab="入住触发" key="guest_checkin" />
              <TabPane tab="退房触发" key="guest_checkout" />
            </Tabs>
            
            <Table
              columns={columns}
              dataSource={filteredLinkages}
              rowKey="id"
              rowSelection={{
                selectedRowKeys,
                onChange: (keys) => setSelectedRowKeys(keys),
              }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 个联动规则`,
              }}
            />
          </Card>
        </Col>
        

      </Row>

      {/* 新建联动弹窗 */}
      <Modal
        title="新建联动规则"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={saveLinkage}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="联动名称"
                rules={[{ required: true, message: '请输入联动名称' }]}
              >
                <Input placeholder="如：客人入住场景" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="triggerType"
                label="触发类型"
                rules={[{ required: true, message: '请选择触发类型' }]}
              >
                <Select placeholder="选择触发类型">
                  <Option value="manual">手动触发</Option>
                  <Option value="time_based">定时触发</Option>
                  <Option value="sensor_based">传感器触发</Option>
                  <Option value="guest_checkin">客人入住</Option>
                  <Option value="guest_checkout">客人退房</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <TextArea rows={2} placeholder="描述联动规则的作用" />
          </Form.Item>
          
          <Form.Item
            name="triggerCondition"
            label="触发条件"
            rules={[{ required: true, message: '请输入触发条件' }]}
          >
            <Input placeholder="如：房卡刷卡开门" />
          </Form.Item>
          
          <Form.Item
            name="roomNumbers"
            label="适用房间"
          >
            <Select mode="multiple" placeholder="选择适用房间">
              {hotelRooms.map(room => (
                <Option key={room.roomNumber} value={room.roomNumber}>
                  {room.roomNumber} ({room.type})
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                创建联动
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                form.resetFields();
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 预设场景弹窗 */}
      <Modal
        title="应用预设场景"
        open={presetModalVisible}
        onCancel={() => {
          setPresetModalVisible(false);
          setSelectedPreset(null);
          presetForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        {selectedPreset && (
          <Form
            form={presetForm}
            layout="vertical"
            onFinish={savePreset}
          >
            <Alert
              message={selectedPreset.name}
              description={selectedPreset.description}
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Form.Item
              name="name"
              label="联动名称"
              initialValue={selectedPreset.name}
            >
              <Input placeholder="联动名称" />
            </Form.Item>
            
            <Form.Item
              name="description"
              label="描述"
              initialValue={selectedPreset.description}
            >
              <TextArea rows={2} placeholder="描述" />
            </Form.Item>
            
            <Form.Item
              name="triggerCondition"
              label="触发条件"
              initialValue="预设场景触发"
            >
              <Input placeholder="触发条件" />
            </Form.Item>
            
            <Form.Item
              name="roomNumbers"
              label="适用房间"
            >
              <Select mode="multiple" placeholder="选择适用房间">
                {hotelRooms.map(room => (
                  <Option key={room.roomNumber} value={room.roomNumber}>
                    {room.roomNumber} ({room.type})
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            <Divider>执行动作</Divider>
            <Space direction="vertical" style={{ width: '100%' }}>
              {selectedPreset.actions.map((action: any, index: number) => (
                <Card key={index} size="small">
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                    {getDeviceIcon('air_conditioner')}
                    <strong style={{ marginLeft: 8 }}>{action.deviceName}</strong>
                  </div>
                  <div>动作: {action.action}</div>
                  <div>参数: {JSON.stringify(action.parameters)}</div>
                </Card>
              ))}
            </Space>
            
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  应用场景
                </Button>
                <Button onClick={() => {
                  setPresetModalVisible(false);
                  setSelectedPreset(null);
                  presetForm.resetFields();
                }}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* 联动详情弹窗 */}
      <Modal
        title="联动详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedLinkage && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="联动名称" span={2}>
              {selectedLinkage.name}
            </Descriptions.Item>
            <Descriptions.Item label="描述" span={2}>
              {selectedLinkage.description}
            </Descriptions.Item>
            <Descriptions.Item label="触发类型">
              {getTriggerTypeTag(selectedLinkage.triggerType)}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={selectedLinkage.isEnabled ? 'green' : 'red'}>
                {selectedLinkage.isEnabled ? '启用' : '禁用'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="触发条件" span={2}>
              {selectedLinkage.triggerCondition}
            </Descriptions.Item>
            <Descriptions.Item label="适用房间" span={2}>
              <Space>
                {selectedLinkage.roomNumbers.map(room => (
                  <Tag key={room}>房间 {room}</Tag>
                ))}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="执行次数">
              {selectedLinkage.executionCount}
            </Descriptions.Item>
            <Descriptions.Item label="最后执行">
              {selectedLinkage.lastExecuted ? dayjs(selectedLinkage.lastExecuted).fromNow() : '未执行'}
            </Descriptions.Item>
            <Descriptions.Item label="执行动作" span={2}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {selectedLinkage.actions.map((action, index) => (
                  <Card key={index} size="small">
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                      {getDeviceIcon('air_conditioner')}
                      <strong style={{ marginLeft: 8 }}>{action.deviceName}</strong>
                    </div>
                    <div>动作: {action.action}</div>
                    <div>参数: {JSON.stringify(action.parameters)}</div>
                  </Card>
                ))}
              </Space>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default DeviceLinkagePage; 