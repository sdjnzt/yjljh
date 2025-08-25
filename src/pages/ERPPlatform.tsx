import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/erp-platform.css';
import {
  Row,
  Col,
  Card,
  Tabs,
  Table,
  Button,
  Select,
  Input,
  Space,
  Avatar,
  Tag,
  Badge,
  Statistic,
  Progress,
  Timeline,
  Modal,
  Form,
  DatePicker,
  TreeSelect,
  Tooltip,
  Divider,
  Alert,
  message,
  Descriptions,
  Switch,
  Radio,
  Carousel,
  List,
  Empty,
  Drawer,
  Steps,
  Result,
  Popconfirm,
  Upload,
  Spin,
  Cascader
} from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  SettingOutlined,
  UserOutlined,
  ClusterOutlined,
  MonitorOutlined,
  ScheduleOutlined,
  FileTextOutlined,
  BarChartOutlined,
  BellOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FilterOutlined,
  ExportOutlined,
  ImportOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  CarOutlined,
  ToolOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  FireOutlined,
  WarningOutlined,
  CalendarOutlined,
  HomeOutlined,
  ShopOutlined,
  BankOutlined,
  RocketOutlined,
  CrownOutlined,
  StarOutlined,
  TrophyOutlined,
  GiftOutlined,
  HeartOutlined,
  LikeOutlined,
  DislikeOutlined,
  CommentOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  UploadOutlined,
  PrinterOutlined,
  CopyOutlined,
  ScissorOutlined,
  PaperClipOutlined,
  FolderOutlined,
  FileOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  CodeOutlined,
  BugOutlined,
  BuildOutlined,
  RobotOutlined,
  ThunderboltFilled,
  FireFilled,
  StarFilled,
  HeartFilled
} from '@ant-design/icons';
import { organizationUnits, users, devices, commands, safetyEvents } from '../data/mockData';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Step } = Steps;

// 地图可视化组件
const MapVisualization: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [mapView, setMapView] = useState<'devices' | 'personnel' | 'tasks' | 'emergencies'>('devices');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // 模拟地图数据
  const mapData = {
    devices: devices.map(device => ({
      ...device,
      x: Math.random() * 800 + 100,
      y: Math.random() * 400 + 100,
      region: ['生产厂区A区', '生产厂区B区', '行政楼', '研发楼', '安全楼'][Math.floor(Math.random() * 5)]
    })),
    personnel: users.slice(0, 20).map(user => ({
      ...user,
      x: Math.random() * 800 + 100,
      y: Math.random() * 400 + 100,
      currentTask: ['设备维护', '安全巡检', '质量检测', '生产监控', '会议中'][Math.floor(Math.random() * 5)],
      region: ['生产厂区A区', '生产厂区B区', '行政楼', '研发楼', '安全楼'][Math.floor(Math.random() * 5)]
    })),
    tasks: [
      { id: 'task001', title: '设备维护检查', assignee: '刘维护', status: 'in_progress', priority: 'high', x: 200, y: 150, region: '生产厂区A区' },
      { id: 'task002', title: '安全巡检', assignee: '孙管理', status: 'pending', priority: 'medium', x: 400, y: 200, region: '安全楼' },
      { id: 'task003', title: '质量检测', assignee: '陈质检', status: 'completed', priority: 'low', x: 600, y: 250, region: '生产厂区A区' },
      { id: 'task004', title: '系统升级', assignee: '韩开发', status: 'in_progress', priority: 'urgent', x: 300, y: 300, region: '研发楼' },
      { id: 'task005', title: '培训准备', assignee: '刘招聘', status: 'pending', priority: 'medium', x: 500, y: 180, region: '行政楼' }
    ],
    emergencies: [
      { id: 'em001', type: 'fire', location: '生产厂区A区1号车间', status: 'active', level: 'high', x: 250, y: 200, time: '2025-08-05 14:30' },
      { id: 'em002', type: 'equipment', location: '生产厂区B区仓库', status: 'investigating', level: 'medium', x: 450, y: 320, time: '2025-08-05 15:15' },
      { id: 'em003', type: 'safety', location: '研发楼实验室', status: 'resolved', level: 'low', x: 650, y: 180, time: '2025-08-05 13:45' }
    ]
  };

  // 实时刷新处理函数
  const handleRefresh = () => {
    setIsRefreshing(true);
    message.loading('正在刷新地图数据...');
    setTimeout(() => {
      setIsRefreshing(false);
      message.success('地图数据刷新完成');
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      online: '#52c41a',
      offline: '#ff4d4f',
      warning: '#faad14',
      active: '#ff4d4f',
      pending: '#faad14',
      in_progress: '#1890ff',
      completed: '#52c41a',
      resolved: '#52c41a',
      investigating: '#722ed1'
    };
    return colors[status as keyof typeof colors] || '#d9d9d9';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: '#52c41a',
      medium: '#faad14',
      high: '#ff7a45',
      urgent: '#ff4d4f'
    };
    return colors[priority as keyof typeof colors] || '#d9d9d9';
  };

  const handleMapClick = (item: any) => {
    setSelectedLocation(item);
  };

  const renderMapItems = () => {
    const currentData = mapData[mapView];
    
    return currentData.map((item: any, index: number) => (
      <div
        key={index}
        style={{
          position: 'absolute',
          left: item.x,
          top: item.y,
          width: 20,
          height: 20,
          borderRadius: '50%',
          backgroundColor: getStatusColor(item.status || item.priority),
          border: '2px solid #fff',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 1000
        }}
        onClick={() => handleMapClick(item)}
      >
        <Tooltip title={item.name || item.title || item.type}>
          <div style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
        </Tooltip>
      </div>
    ));
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <span>地图视图：</span>
          <Radio.Group value={mapView} onChange={(e) => setMapView(e.target.value)}>
            <Radio.Button value="devices">设备分布</Radio.Button>
            <Radio.Button value="personnel">人员位置</Radio.Button>
            <Radio.Button value="tasks">任务分配</Radio.Button>
            <Radio.Button value="emergencies">应急事件</Radio.Button>
          </Radio.Group>
          <Button 
            type="primary" 
            icon={<SyncOutlined spin={isRefreshing} />} 
            size="small"
            onClick={handleRefresh}
            loading={isRefreshing}
          >
            实时刷新
          </Button>
        </Space>
      </div>

      <div style={{ position: 'relative', width: '100%', height: 500, border: '1px solid #d9d9d9', borderRadius: 8, overflow: 'hidden' }}>
        {/* 地图背景 */}
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'linear-gradient(45deg, #f0f2f5 25%, transparent 25%), linear-gradient(-45deg, #f0f2f5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f2f5 75%), linear-gradient(-45deg, transparent 75%, #f0f2f5 75%)',
          backgroundSize: '20px 20px'
        }}>
          {/* 区域划分 */}
          <div style={{ position: 'absolute', top: 50, left: 50, width: 200, height: 150, border: '2px dashed #1890ff', borderRadius: 8 }}>
            <div style={{ padding: 8, background: 'rgba(24, 144, 255, 0.1)', borderRadius: 6 }}>
              <span style={{ fontSize: 12, color: '#1890ff', fontWeight: 'bold' }}>生产厂区A区</span>
            </div>
          </div>
          <div style={{ position: 'absolute', top: 50, right: 50, width: 180, height: 120, border: '2px dashed #52c41a', borderRadius: 8 }}>
            <div style={{ padding: 8, background: 'rgba(82, 196, 26, 0.1)', borderRadius: 6 }}>
              <span style={{ fontSize: 12, color: '#52c41a', fontWeight: 'bold' }}>生产厂区B区</span>
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: 50, left: 50, width: 150, height: 100, border: '2px dashed #722ed1', borderRadius: 8 }}>
            <div style={{ padding: 8, background: 'rgba(114, 46, 209, 0.1)', borderRadius: 6 }}>
              <span style={{ fontSize: 12, color: '#722ed1', fontWeight: 'bold' }}>行政楼</span>
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: 50, right: 50, width: 160, height: 110, border: '2px dashed #fa8c16', borderRadius: 8 }}>
            <div style={{ padding: 8, background: 'rgba(250, 140, 22, 0.1)', borderRadius: 6 }}>
              <span style={{ fontSize: 12, color: '#fa8c16', fontWeight: 'bold' }}>研发楼</span>
            </div>
          </div>
        </div>

        {/* 地图项目 */}
        {renderMapItems()}
      </div>

      {/* 详情面板 */}
      {selectedLocation && (
        <div style={{ marginTop: 16 }}>
          <Card size="small" title="详细信息">
            <Descriptions column={2} size="small">
              <Descriptions.Item label="名称">{selectedLocation.name || selectedLocation.title || selectedLocation.type}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Badge status={selectedLocation.status === 'online' || selectedLocation.status === 'completed' ? 'success' : 
                              selectedLocation.status === 'warning' || selectedLocation.status === 'pending' ? 'warning' : 'error'} 
                       text={selectedLocation.status} />
              </Descriptions.Item>
              <Descriptions.Item label="位置">{selectedLocation.location || selectedLocation.region}</Descriptions.Item>
              <Descriptions.Item label="负责人">{selectedLocation.assignee || '未分配'}</Descriptions.Item>
              {selectedLocation.priority && (
                <Descriptions.Item label="优先级">
                  <Tag color={getPriorityColor(selectedLocation.priority)}>{selectedLocation.priority}</Tag>
                </Descriptions.Item>
              )}
              {selectedLocation.time && (
                <Descriptions.Item label="时间">{selectedLocation.time}</Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </div>
      )}
    </div>
  );
};

// 智能调度组件
const IntelligentScheduling: React.FC = () => {
  const [scheduleData, setScheduleData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    // 模拟调度数据
    const mockScheduleData = [
      {
        id: 'sch001',
        title: '设备维护计划',
        type: 'maintenance',
        assignee: '刘维护',
        department: '生产制造部',
        priority: 'high',
        startTime: '2025-08-05 09:00',
        endTime: '2025-08-05 12:00',
        status: 'in_progress',
        location: '生产厂区A区1号车间',
        description: '对1号生产线进行定期维护检查',
        resources: ['维护工具', '备件库存', '技术人员']
      },
      {
        id: 'sch002',
        title: '安全巡检任务',
        type: 'inspection',
        assignee: '孙管理',
        department: '安全环保部',
        priority: 'medium',
        startTime: '2025-08-05 14:00',
        endTime: '2025-08-05 16:00',
        status: 'pending',
        location: '全厂区',
        description: '日常安全巡检，检查消防设施和安全隐患',
        resources: ['巡检设备', '安全检查表', '通讯设备']
      },
      {
        id: 'sch003',
        title: '质量检测',
        type: 'quality',
        assignee: '陈质检',
        department: '生产制造部',
        priority: 'urgent',
        startTime: '2025-08-05 10:30',
        endTime: '2025-08-05 11:30',
        status: 'completed',
        location: '质检中心',
        description: '对新生产的批次进行质量检测',
        resources: ['检测设备', '检测标准', '样品']
      },
      {
        id: 'sch004',
        title: '系统升级',
        type: 'upgrade',
        assignee: '韩开发',
        department: '信息技术部',
        priority: 'high',
        startTime: '2025-08-05 20:00',
        endTime: '2025-07-16 02:00',
        status: 'scheduled',
        location: '机房',
        description: '生产管理系统升级，需要停机维护',
        resources: ['服务器', '备份设备', '技术支持']
      },
      {
        id: 'sch005',
        title: '员工培训',
        type: 'training',
        assignee: '刘招聘',
        department: '人力资源部',
        priority: 'medium',
        startTime: '2025-07-16 09:00',
        endTime: '2025-07-16 17:00',
        status: 'scheduled',
        location: '培训室',
        description: '新员工安全培训和操作规程培训',
        resources: ['培训材料', '多媒体设备', '培训师']
      }
    ];
    setScheduleData(mockScheduleData);
    setFilteredData(mockScheduleData);
  }, []);

  // 搜索处理
  const handleSearch = (value: string) => {
    setSearchText(value);
    filterData(value, statusFilter, dateRange);
  };

  // 状态筛选处理
  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    filterData(searchText, value, dateRange);
  };

  // 日期范围筛选处理
  const handleDateFilter = (dates: any, dateStrings: [string, string]) => {
    setDateRange(dates);
    filterData(searchText, statusFilter, dates);
  };

  // 数据筛选函数
  const filterData = (search: string, status: string, dates: any[]) => {
    let filtered = scheduleData;

    // 搜索筛选
    if (search) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.assignee.toLowerCase().includes(search.toLowerCase()) ||
        item.department.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 状态筛选
    if (status !== 'all') {
      filtered = filtered.filter(item => item.status === status);
    }

    // 日期筛选
    if (dates && dates.length === 2) {
      filtered = filtered.filter(item => {
        const itemDate = dayjs(item.startTime);
        return itemDate.isAfter(dates[0]) && itemDate.isBefore(dates[1]);
      });
    }

    setFilteredData(filtered);
  };

  // 编辑处理
  const handleEdit = (record: any) => {
    setEditingSchedule(record);
    editForm.setFieldsValue({
      ...record,
      startTime: dayjs(record.startTime),
      endTime: dayjs(record.endTime),
      resources: record.resources
    });
    setIsEditModalVisible(true);
  };

  // 删除处理
  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除任务"${record.title}"吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        const newData = scheduleData.filter(item => item.id !== record.id);
        setScheduleData(newData);
        setFilteredData(newData.filter(item => {
          let match = true;
          if (searchText) {
            match = match && (
              item.title.toLowerCase().includes(searchText.toLowerCase()) ||
              item.assignee.toLowerCase().includes(searchText.toLowerCase()) ||
              item.department.toLowerCase().includes(searchText.toLowerCase())
            );
          }
          if (statusFilter !== 'all') {
            match = match && item.status === statusFilter;
          }
          return match;
        }));
        message.success('删除成功');
      }
    });
  };

  // 编辑提交
  const handleEditSubmit = () => {
    editForm.validateFields().then(values => {
      const updatedData = scheduleData.map(item => 
        item.id === editingSchedule.id 
          ? {
              ...item,
              ...values,
              startTime: values.startTime.format('YYYY-MM-DD HH:mm'),
              endTime: values.endTime.format('YYYY-MM-DD HH:mm')
            }
          : item
      );
      setScheduleData(updatedData);
      filterData(searchText, statusFilter, dateRange);
      setIsEditModalVisible(false);
      editForm.resetFields();
      message.success('修改成功');
    });
  };

  const handleScheduleSubmit = () => {
    form.validateFields().then(values => {
      const newSchedule = {
        id: `sch${Date.now()}`,
        ...values,
        startTime: values.startTime.format('YYYY-MM-DD HH:mm'),
        endTime: values.endTime.format('YYYY-MM-DD HH:mm'),
        status: 'pending'
      };
      const newData = [...scheduleData, newSchedule];
      setScheduleData(newData);
      setFilteredData(newData);
      message.success('调度计划创建成功');
      setIsScheduleModalVisible(false);
      form.resetFields();
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'orange',
      in_progress: 'blue',
      completed: 'green',
      scheduled: 'purple',
      cancelled: 'red'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'green',
      medium: 'orange',
      high: 'red',
      urgent: 'magenta'
    };
    return colors[priority as keyof typeof colors] || 'default';
  };

  const scheduleColumns = [
    {
      title: '任务信息',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: any) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>ID: {record.id}</div>
        </div>
      )
    },
    {
      title: '负责人',
      dataIndex: 'assignee',
      key: 'assignee',
      render: (text: string, record: any) => (
        <div>
          <div>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.department}</div>
        </div>
      )
    },
    {
      title: '时间安排',
      key: 'time',
      render: (record: any) => (
        <div>
          <div>{record.startTime}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>至 {record.endTime}</div>
        </div>
      )
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>{priority}</Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      )
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location'
    },
    {
      title: '操作',
      key: 'action',
      render: (record: any) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} size="small" onClick={() => setSelectedSchedule(record)}>
            查看
          </Button>
          <Button type="text" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="text" icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Search 
            placeholder="搜索任务或负责人" 
            style={{ width: 200 }} 
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Select 
            value={statusFilter} 
            style={{ width: 120 }}
            onChange={handleStatusFilter}
          >
            <Option value="all">全部状态</Option>
            <Option value="pending">待执行</Option>
            <Option value="in_progress">进行中</Option>
            <Option value="completed">已完成</Option>
            <Option value="scheduled">已计划</Option>
          </Select>
          <RangePicker onChange={handleDateFilter} />
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsScheduleModalVisible(true)}>
          创建调度
        </Button>
      </div>

      <Table
        dataSource={filteredData}
        columns={scheduleColumns}
        pagination={{ pageSize: 10 }}
        size="middle"
      />

      {/* 创建调度模态框 */}
      <Modal
        title="创建调度计划"
        visible={isScheduleModalVisible}
        onOk={handleScheduleSubmit}
        onCancel={() => {
          setIsScheduleModalVisible(false);
          form.resetFields();
        }}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="title" label="任务标题" rules={[{ required: true, message: '请输入任务标题' }]}>
                <Input placeholder="请输入任务标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="任务类型" rules={[{ required: true, message: '请选择任务类型' }]}>
                <Select placeholder="请选择任务类型">
                  <Option value="maintenance">维护</Option>
                  <Option value="inspection">检查</Option>
                  <Option value="quality">质检</Option>
                  <Option value="upgrade">升级</Option>
                  <Option value="training">培训</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="assignee" label="负责人" rules={[{ required: true, message: '请选择负责人' }]}>
                <Select placeholder="请选择负责人">
                  {users.map(user => (
                    <Option key={user.id} value={user.name}>{user.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label="优先级" rules={[{ required: true, message: '请选择优先级' }]}>
                <Select placeholder="请选择优先级">
                  <Option value="low">低</Option>
                  <Option value="medium">中</Option>
                  <Option value="high">高</Option>
                  <Option value="urgent">紧急</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="startTime" label="开始时间" rules={[{ required: true, message: '请选择开始时间' }]}>
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endTime" label="结束时间" rules={[{ required: true, message: '请选择结束时间' }]}>
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="location" label="执行地点" rules={[{ required: true, message: '请输入执行地点' }]}>
                <Input placeholder="请输入执行地点" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="department" label="所属部门" rules={[{ required: true, message: '请选择所属部门' }]}>
                <Select placeholder="请选择所属部门">
                  {organizationUnits.map(unit => (
                    <Option key={unit.id} value={unit.name}>{unit.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="任务描述">
            <TextArea rows={3} placeholder="请输入任务描述" />
          </Form.Item>
          <Form.Item name="resources" label="所需资源">
            <Select mode="tags" placeholder="请输入所需资源">
              <Option value="人员">人员</Option>
              <Option value="设备">设备</Option>
              <Option value="工具">工具</Option>
              <Option value="材料">材料</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑调度模态框 */}
      <Modal
        title="编辑调度计划"
        visible={isEditModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => {
          setIsEditModalVisible(false);
          editForm.resetFields();
        }}
        width={800}
      >
        <Form form={editForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="title" label="任务标题" rules={[{ required: true, message: '请输入任务标题' }]}>
                <Input placeholder="请输入任务标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="任务类型" rules={[{ required: true, message: '请选择任务类型' }]}>
                <Select placeholder="请选择任务类型">
                  <Option value="maintenance">维护</Option>
                  <Option value="inspection">检查</Option>
                  <Option value="quality">质检</Option>
                  <Option value="upgrade">升级</Option>
                  <Option value="training">培训</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="assignee" label="负责人" rules={[{ required: true, message: '请选择负责人' }]}>
                <Select placeholder="请选择负责人">
                  {users.map(user => (
                    <Option key={user.id} value={user.name}>{user.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label="优先级" rules={[{ required: true, message: '请选择优先级' }]}>
                <Select placeholder="请选择优先级">
                  <Option value="low">低</Option>
                  <Option value="medium">中</Option>
                  <Option value="high">高</Option>
                  <Option value="urgent">紧急</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="startTime" label="开始时间" rules={[{ required: true, message: '请选择开始时间' }]}>
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endTime" label="结束时间" rules={[{ required: true, message: '请选择结束时间' }]}>
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="location" label="执行地点" rules={[{ required: true, message: '请输入执行地点' }]}>
                <Input placeholder="请输入执行地点" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="department" label="所属部门" rules={[{ required: true, message: '请选择所属部门' }]}>
                <Select placeholder="请选择所属部门">
                  {organizationUnits.map(unit => (
                    <Option key={unit.id} value={unit.name}>{unit.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="任务描述">
            <TextArea rows={3} placeholder="请输入任务描述" />
          </Form.Item>
          <Form.Item name="resources" label="所需资源">
            <Select mode="tags" placeholder="请输入所需资源">
              <Option value="人员">人员</Option>
              <Option value="设备">设备</Option>
              <Option value="工具">工具</Option>
              <Option value="材料">材料</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 任务详情抽屉 */}
      <Drawer
        title="任务详情"
        placement="right"
        width={500}
        visible={!!selectedSchedule}
        onClose={() => setSelectedSchedule(null)}
      >
        {selectedSchedule && (
          <div>
            <Descriptions title={selectedSchedule.title} bordered column={1}>
              <Descriptions.Item label="任务ID">{selectedSchedule.id}</Descriptions.Item>
              <Descriptions.Item label="任务类型">{selectedSchedule.type}</Descriptions.Item>
              <Descriptions.Item label="负责人">{selectedSchedule.assignee}</Descriptions.Item>
              <Descriptions.Item label="所属部门">{selectedSchedule.department}</Descriptions.Item>
              <Descriptions.Item label="优先级">
                <Tag color={getPriorityColor(selectedSchedule.priority)}>{selectedSchedule.priority}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={getStatusColor(selectedSchedule.status)}>{selectedSchedule.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="开始时间">{selectedSchedule.startTime}</Descriptions.Item>
              <Descriptions.Item label="结束时间">{selectedSchedule.endTime}</Descriptions.Item>
              <Descriptions.Item label="执行地点">{selectedSchedule.location}</Descriptions.Item>
              <Descriptions.Item label="任务描述">{selectedSchedule.description}</Descriptions.Item>
              <Descriptions.Item label="所需资源">
                {selectedSchedule.resources?.map((resource: string, index: number) => (
                  <Tag key={index} color="blue">{resource}</Tag>
                ))}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Drawer>
    </div>
  );
};

// 综合管理面板
const ComprehensiveManagement: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const [kpiData, setKpiData] = useState<any>({});
  const [alertData, setAlertData] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [taskForm] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    // 模拟KPI数据
    setKpiData({
      totalEmployees: 312, // 固定显示为三百多人
      onlineEmployees: 287, // 固定显示在线人数
      totalDevices: devices.length,
      onlineDevices: devices.filter(d => d.status === 'online').length,
      activeAlerts: 3,
      completedTasks: 28,
      efficiency: 94.2,
      satisfaction: 96.8
    });

    // 模拟告警数据
    setAlertData([
      { id: 1, type: 'error', message: '设备离线警告', time: '2025-08-05 14:30', level: 'high' },
      { id: 2, type: 'warning', message: '人员未到岗', time: '2025-08-05 14:25', level: 'medium' },
      { id: 3, type: 'info', message: '任务即将到期', time: '2025-08-05 14:20', level: 'low' }
    ]);

    // 模拟最近活动
    setRecentActivities([
      { id: 1, user: '张伟民', action: '完成了设备维护任务', time: '2025-08-05 14:30' },
      { id: 2, user: '陈志远', action: '创建了新的研发项目', time: '2025-08-05 14:25' },
      { id: 3, user: '刘营销', action: '更新了客户信息', time: '2025-08-05 14:20' },
      { id: 4, user: '马安全', action: '处理了安全事件', time: '2025-08-05 14:15' },
      { id: 5, user: '孙人力', action: '审核了员工申请', time: '2025-08-05 14:10' }
    ]);
  }, []);

  // 快速操作处理函数
  const handleCreateTask = () => {
    setIsTaskModalVisible(true);
  };

  const handleScheduleArrangement = () => {
    // 切换到智能调度选项卡，而不是跳转页面
    setActiveTab('schedule');
  };

  const handlePersonnelManagement = () => {
    navigate('/organization');
  };

  const handleSystemSettings = () => {
    navigate('/system-settings');
  };

  const handleGenerateReport = () => {
    message.loading('正在生成报表...');
    setTimeout(() => {
      message.success('报表生成完成');
    }, 2000);
  };

  const handleExportData = () => {
    Modal.confirm({
      title: '导出数据',
      content: '确定要导出当前数据吗？',
      onOk() {
        message.loading('正在导出数据...');
        setTimeout(() => {
          message.success('数据导出完成');
        }, 1500);
      },
    });
  };

  const handleTaskSubmit = () => {
    taskForm.validateFields().then(values => {
      console.log('新任务:', values);
      message.success('任务创建成功');
      setIsTaskModalVisible(false);
      taskForm.resetFields();
    });
  };

  const getAlertIcon = (type: string) => {
    const icons = {
      error: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      warning: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      info: <CheckCircleOutlined style={{ color: '#52c41a' }} />
    };
    return icons[type as keyof typeof icons] || <ClockCircleOutlined />;
  };

  return (
    <div>
      {/* KPI指标 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总员工数"
              value={kpiData.totalEmployees}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线员工"
              value={kpiData.onlineEmployees}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Progress
              percent={Math.round((kpiData.onlineEmployees / kpiData.totalEmployees) * 100)}
              size="small"
              showInfo={false}
              strokeColor="#1890ff"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="设备在线率"
              value={Math.round((kpiData.onlineDevices / kpiData.totalDevices) * 100)}
              suffix="%"
              prefix={<MonitorOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="运营效率"
              value={kpiData.efficiency}
              suffix="%"
              prefix={<RocketOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="实时告警" size="small" style={{ height: 400 }}>
            <List
              dataSource={alertData}
              renderItem={(item: any) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={getAlertIcon(item.type)}
                    title={<span style={{ fontWeight: 'bold' }}>{item.message}</span>}
                    description={
                      <Space>
                        <span>{item.time}</span>
                        <Tag color={item.level === 'high' ? 'red' : item.level === 'medium' ? 'orange' : 'green'}>
                          {item.level}
                        </Tag>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="最近活动" size="small" style={{ height: 400 }}>
            <Timeline>
              {recentActivities.map((activity: any) => (
                <Timeline.Item key={activity.id}>
                  <div>
                    <strong>{activity.user}</strong> {activity.action}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{activity.time}</div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
      </Row>

      {/* 快速操作 */}
      <Card title="快速操作" style={{ marginTop: 16 }}>
        <Space size="large">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateTask}>
            创建任务
          </Button>
          <Button icon={<ScheduleOutlined />} onClick={handleScheduleArrangement}>
            安排调度
          </Button>
          <Button icon={<TeamOutlined />} onClick={handlePersonnelManagement}>
            人员管理
          </Button>
          <Button icon={<SettingOutlined />} onClick={handleSystemSettings}>
            系统设置
          </Button>
          <Button icon={<FileTextOutlined />} onClick={handleGenerateReport}>
            生成报表
          </Button>
          <Button icon={<ExportOutlined />} onClick={handleExportData}>
            导出数据
          </Button>
        </Space>
      </Card>

      {/* 创建任务模态框 */}
      <Modal
        title="创建新任务"
        visible={isTaskModalVisible}
        onOk={handleTaskSubmit}
        onCancel={() => {
          setIsTaskModalVisible(false);
          taskForm.resetFields();
        }}
        width={600}
      >
        <Form form={taskForm} layout="vertical">
          <Form.Item name="title" label="任务标题" rules={[{ required: true, message: '请输入任务标题' }]}>
            <Input placeholder="请输入任务标题" />
          </Form.Item>
          <Form.Item name="type" label="任务类型" rules={[{ required: true, message: '请选择任务类型' }]}>
            <Select placeholder="请选择任务类型">
              <Option value="maintenance">设备维护</Option>
              <Option value="inspection">安全检查</Option>
              <Option value="quality">质量控制</Option>
              <Option value="management">管理任务</Option>
              <Option value="development">开发任务</Option>
            </Select>
          </Form.Item>
          <Form.Item name="assignee" label="指派人员" rules={[{ required: true, message: '请选择指派人员' }]}>
            <Select placeholder="请选择指派人员">
              {users.map(user => (
                <Option key={user.id} value={user.name}>{user.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="priority" label="优先级" rules={[{ required: true, message: '请选择优先级' }]}>
            <Select placeholder="请选择优先级">
              <Option value="low">低</Option>
              <Option value="medium">中</Option>
              <Option value="high">高</Option>
              <Option value="urgent">紧急</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dueDate" label="截止时间" rules={[{ required: true, message: '请选择截止时间' }]}>
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="任务描述">
            <TextArea rows={4} placeholder="请输入任务描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const ERPPlatform: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  // 通知按钮处理
  const handleNotifications = () => {
    Modal.info({
      title: '系统通知',
      content: (
        <div>
          <p>• 设备离线警告 (2025-08-05 14:30)</p>
          <p>• 人员未到岗提醒 (2025-08-05 14:25)</p>
          <p>• 任务即将到期 (2025-08-05 14:20)</p>
        </div>
      ),
      onOk() {},
    });
  };

  // 同步数据处理
  const handleSyncData = () => {
    message.loading('正在同步数据...');
    setTimeout(() => {
      message.success('数据同步完成');
    }, 2000);
  };

  // 导航处理
  const handleGoToOrganization = () => {
    navigate('/organization');
  };

  const handleGoToDeviceMonitor = () => {
    navigate('/status-monitor');
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>ERP融合通信管理平台</h2>
        <Space>
          <Badge count={3} size="small">
            <Button icon={<BellOutlined />} onClick={handleNotifications} />
          </Badge>
          <Button type="primary" icon={<SyncOutlined />} onClick={handleSyncData}>
            同步数据
          </Button>
        </Space>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card" size="large">
        <TabPane tab={<span><DashboardOutlined />综合管理</span>} key="dashboard">
          <ComprehensiveManagement setActiveTab={setActiveTab} />
        </TabPane>
        
        <TabPane tab={<span><EnvironmentOutlined />地图调度</span>} key="map">
          <MapVisualization />
        </TabPane>
        
        <TabPane tab={<span><ScheduleOutlined />智能调度</span>} key="schedule">
          <IntelligentScheduling />
        </TabPane>
        
        <TabPane tab={<span><TeamOutlined />组织管理</span>} key="organization">
          <div style={{ textAlign: 'center', padding: 50 }}>
            <Result
              icon={<TeamOutlined />}
              title="组织架构管理"
              subTitle="此功能已集成到独立的组织管理页面"
              extra={<Button type="primary" onClick={handleGoToOrganization}>前往组织管理</Button>}
            />
          </div>
        </TabPane>
        
        <TabPane tab={<span><MonitorOutlined />设备监控</span>} key="devices">
          <div style={{ textAlign: 'center', padding: 50 }}>
            <Result
              icon={<MonitorOutlined />}
              title="设备状态监控"
              subTitle="此功能已集成到状态监控页面"
              extra={<Button type="primary" onClick={handleGoToDeviceMonitor}>前往设备监控</Button>}
            />
          </div>
        </TabPane>
        
        <TabPane tab={<span><FileTextOutlined />报表分析</span>} key="reports">
          <div style={{ textAlign: 'center', padding: 50 }}>
            <Result
              icon={<BarChartOutlined />}
              title="数据报表分析"
              subTitle="此功能已集成到数据分析页面"
              extra={<Button type="primary">前往数据分析</Button>}
            />
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ERPPlatform; 