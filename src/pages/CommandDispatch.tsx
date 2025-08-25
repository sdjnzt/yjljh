import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Tag, 
  Space, 
  Avatar, 
  List, 
  Badge,
  Typography,
  Tabs,
  Radio,
  Progress,
  Timeline,
  Alert,
  Dropdown,
  Tooltip,
  Divider,
  Switch,
  Slider,
  message,
  notification
} from 'antd';
import { 
  PhoneOutlined, 
  VideoCameraOutlined, 
  SendOutlined,
  UserOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  GlobalOutlined,
  WifiOutlined,
  AudioOutlined,
  CameraOutlined,
  SettingOutlined,
  AlertOutlined,
  ThunderboltOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  SoundOutlined,
  DisconnectOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  FullscreenOutlined,
  MessageOutlined,
  BellOutlined,
  RadarChartOutlined,
  AimOutlined,
  NodeIndexOutlined,
  LinkOutlined,
  MonitorOutlined,
  RocketOutlined,
  FireOutlined
} from '@ant-design/icons';
import { commands, users, devices } from '../data/mockData';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface DevicePosition {
  id: string;
  name: string;
  x: number;
  y: number;
  status: 'online' | 'offline' | 'warning';
  type: 'camera' | 'sensor' | 'communication';
}

interface CallSession {
  id: string;
  userId: string;
  userName: string;
  type: 'voice' | 'video';
  status: 'connecting' | 'active' | 'ended';
  duration: number;
  startTime: string;
}

const CommandDispatch: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [form] = Form.useForm();
  const [mapScale, setMapScale] = useState(1);
  const [selectedDevice, setSelectedDevice] = useState<DevicePosition | null>(null);
  const [activeCalls, setActiveCalls] = useState<CallSession[]>([]);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [broadcastMode, setBroadcastMode] = useState(false);
  const [mapCenter, setMapCenter] = useState({ x: 50, y: 50 });

  // 模拟设备位置数据 - 基于真实地图布局
  const devicePositions: DevicePosition[] = [
    // A区设备
    { id: '1', name: 'CAM-A01', x: 14, y: 12, status: 'online', type: 'camera' },
    { id: '2', name: 'SEN-A01', x: 10, y: 20, status: 'online', type: 'sensor' },
    { id: '3', name: 'CAM-A02', x: 47, y: 15, status: 'warning', type: 'camera' },
    
    // B区设备
    { id: '4', name: 'COM-B01', x: 16, y: 45, status: 'online', type: 'communication' },
    { id: '5', name: 'CAM-B01', x: 12, y: 52, status: 'online', type: 'camera' },
    { id: '6', name: 'SEN-B01', x: 22, y: 48, status: 'offline', type: 'sensor' },
    
    // C区设备
    { id: '7', name: 'CAM-C01', x: 75, y: 20, status: 'online', type: 'camera' },
    { id: '8', name: 'COM-C01', x: 85, y: 25, status: 'online', type: 'communication' },
    { id: '9', name: 'SEN-C01', x: 80, y: 45, status: 'online', type: 'sensor' },
    { id: '10', name: 'CAM-C02', x: 90, y: 50, status: 'warning', type: 'camera' },
    
    // 道路监控点
    { id: '11', name: 'CAM-R01', x: 31, y: 30, status: 'online', type: 'camera' },
    { id: '12', name: 'CAM-R02', x: 62, y: 30, status: 'online', type: 'camera' },
    { id: '13', name: 'COM-R01', x: 50, y: 58, status: 'online', type: 'communication' },
    
    // 停车场监控
    { id: '14', name: 'CAM-P01', x: 60, y: 70, status: 'online', type: 'camera' },
  ];

  // 模拟通话计时器
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCalls(prev => 
        prev.map(call => 
          call.status === 'active' 
            ? { ...call, duration: call.duration + 1 }
            : call
        )
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSendCommand = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      console.log('发送指令:', values);
      message.success('指令发送成功！');
      setIsModalVisible(false);
      form.resetFields();
      
      // 发送通知
      notification.info({
        message: '指令已发送',
        description: `已向 ${values.receiver?.length || 0} 个目标发送 "${values.title}" 指令`,
        placement: 'topRight',
      });
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleVoiceCall = (userId: string, userName: string) => {
    const newCall: CallSession = {
      id: Date.now().toString(),
      userId,
      userName,
      type: 'voice',
      status: 'connecting',
      duration: 0,
      startTime: new Date().toLocaleTimeString()
    };
    
    setActiveCalls(prev => [...prev, newCall]);
    
    // 模拟连接过程
    setTimeout(() => {
      setActiveCalls(prev => 
        prev.map(call => 
          call.id === newCall.id 
            ? { ...call, status: 'active' }
            : call
        )
      );
      message.success(`与 ${userName} 的语音通话已建立`);
    }, 2000);
  };

  const handleVideoCall = (userId: string, userName: string) => {
    const newCall: CallSession = {
      id: Date.now().toString(),
      userId,
      userName,
      type: 'video',
      status: 'connecting',
      duration: 0,
      startTime: new Date().toLocaleTimeString()
    };
    
    setActiveCalls(prev => [...prev, newCall]);
    
    // 模拟连接过程
    setTimeout(() => {
      setActiveCalls(prev => 
        prev.map(call => 
          call.id === newCall.id 
            ? { ...call, status: 'active' }
            : call
        )
      );
      message.success(`与 ${userName} 的视频通话已建立`);
    }, 2000);
  };

  const handleEndCall = (callId: string) => {
    setActiveCalls(prev => 
      prev.map(call => 
        call.id === callId 
          ? { ...call, status: 'ended' as const }
          : call
      ).filter(call => call.status !== 'ended')
    );
    message.info('通话已结束');
  };

  const handleDeviceClick = (device: DevicePosition) => {
    setSelectedDevice(device);
  };

  const handleEmergencyBroadcast = () => {
    setEmergencyMode(!emergencyMode);
    if (!emergencyMode) {
      notification.warning({
        message: '紧急广播模式',
        description: '已启动紧急广播模式，所有人员将收到紧急通知',
        placement: 'topRight',
      });
    }
  };

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 获取设备图标
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'camera': return <CameraOutlined />;
      case 'sensor': return <RadarChartOutlined />;
      case 'communication': return <WifiOutlined />;
      default: return <MonitorOutlined />;
    }
  };

  // 获取设备颜色
  const getDeviceColor = (status: string) => {
    switch (status) {
      case 'online': return '#52c41a';
      case 'warning': return '#fa8c16';
      case 'offline': return '#ff4d4f';
      default: return '#d9d9d9';
    }
  };

  // 指令列表列定义
  const commandColumns = [
    {
      title: '指令标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => (
        <Text strong>{text}</Text>
      )
    },
    {
      title: '发送者',
      dataIndex: 'sender',
      key: 'sender',
    },
    {
      title: '接收者',
      dataIndex: 'receiver',
      key: 'receiver',
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const priorityConfig = {
          low: { color: 'default', text: '低' },
          medium: { color: 'warning', text: '中' },
          high: { color: 'error', text: '高' },
          urgent: { color: 'red', text: '紧急' },
        };
        const config = priorityConfig[priority as keyof typeof priorityConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          pending: { color: 'default', text: '待发送', icon: <ClockCircleOutlined /> },
          sent: { color: 'processing', text: '已发送', icon: <SendOutlined /> },
          received: { color: 'warning', text: '已接收', icon: <CheckCircleOutlined /> },
          completed: { color: 'success', text: '已完成', icon: <CheckCircleOutlined /> },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
  ];

  return (
    <div style={{ 
      background: '#f0f2f5',
      minHeight: '100%',
      padding: '24px'
    }}>
      {/* 顶部状态栏 */}
      <div style={{ 
        background: '#fff',
        borderRadius: '12px',
        padding: '20px 24px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space size="large">
    <div>
                <Title level={2} style={{ 
                  margin: 0, 
                  color: '#262626',
                  fontSize: '24px'
                }}>
                  <RocketOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                  智能指挥调度中心
                </Title>
                <Text style={{ 
                  fontSize: '14px', 
                  color: '#8c8c8c'
                }}>
                  统一调度 · 实时通信 · 协同作业
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Space size="middle">
              <Badge count={activeCalls.length} offset={[5, 0]}>
                <Button 
                  type={activeCalls.length > 0 ? "primary" : "default"}
                  icon={<PhoneOutlined />}
                  size="large"
                >
                  通话中
                </Button>
              </Badge>
              <Button 
                type={emergencyMode ? "primary" : "default"}
                danger={emergencyMode}
                icon={<AlertOutlined />}
                size="large"
                onClick={handleEmergencyBroadcast}
              >
                {emergencyMode ? '退出紧急模式' : '紧急广播'}
              </Button>
              <Switch 
                checked={broadcastMode}
                onChange={setBroadcastMode}
                checkedChildren="广播开"
                unCheckedChildren="广播关"
              />
            </Space>
          </Col>
        </Row>
      </div>

      {/* 紧急模式警告 */}
      {emergencyMode && (
        <Alert
          message="紧急广播模式已激活"
          description="当前处于紧急状态，所有通信将以最高优先级处理"
          type="error"
          showIcon
          banner
          style={{ marginBottom: '24px' }}
        />
      )}

      {/* 主要内容区域 */}
      <Row gutter={[24, 24]}>
        {/* 地图可视化 */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <GlobalOutlined style={{ color: '#1890ff' }} />
                <span>实时地图调度</span>
                <Badge status="processing" text="实时" />
              </Space>
            }
            extra={
              <Space>
                <Tooltip title="缩放">
                  <Slider
                    min={0.5}
                    max={2}
                    step={0.1}
                    value={mapScale}
                    onChange={setMapScale}
                    style={{ width: 100 }}
                  />
                </Tooltip>
                <Button size="small" icon={<FullscreenOutlined />}>全屏</Button>
                <Button size="small" icon={<ReloadOutlined />}>刷新</Button>
              </Space>
            }
            style={{ 
              borderRadius: '12px',
              height: '600px'
            }}
            bodyStyle={{ 
              padding: '20px',
              height: '540px',
              overflow: 'hidden'
            }}
          >
                         {/* 交互式地图区域 */}
             <div style={{
               position: 'relative',
               width: '100%',
               height: '100%',
               background: '#f0f4f8',
               borderRadius: '8px',
               border: '2px solid #e6f7ff',
               transform: `scale(${mapScale})`,
               transformOrigin: 'center center',
               transition: 'transform 0.3s ease',
               overflow: 'hidden'
             }}>
               {/* 地图背景 - 模拟真实地图 */}
               <svg 
                 style={{ 
                   position: 'absolute', 
                   top: 0, 
                   left: 0, 
                   width: '100%', 
                   height: '100%'
                 }}
                 viewBox="0 0 800 600"
               >
                 <defs>
                   {/* 道路渐变 */}
                   <linearGradient id="roadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                     <stop offset="0%" stopColor="#d4d4d8" />
                     <stop offset="50%" stopColor="#e4e4e7" />
                     <stop offset="100%" stopColor="#d4d4d8" />
                   </linearGradient>
                   
                   {/* 建筑物阴影 */}
                   <filter id="buildingShadow">
                     <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                   </filter>
                   
                   {/* 绿地纹理 */}
                   <pattern id="grassPattern" patternUnits="userSpaceOnUse" width="20" height="20">
                     <rect width="20" height="20" fill="#10b981"/>
                     <circle cx="5" cy="5" r="1" fill="#059669"/>
                     <circle cx="15" cy="10" r="1" fill="#059669"/>
                     <circle cx="10" cy="15" r="1" fill="#059669"/>
                   </pattern>
                 </defs>

                 {/* 地图底色 */}
                 <rect width="100%" height="100%" fill="#f8fafc"/>

                 {/* 绿地区域 */}
                 <ellipse cx="150" cy="120" rx="80" ry="60" fill="#10b981" opacity="0.3"/>
                 <ellipse cx="650" cy="400" rx="100" ry="80" fill="#10b981" opacity="0.3"/>
                 <rect x="300" y="450" width="200" height="100" rx="20" fill="#10b981" opacity="0.2"/>

                 {/* 主要道路 */}
                 <rect x="0" y="180" width="800" height="25" fill="url(#roadGradient)"/>
                 <rect x="0" y="190" width="800" height="5" fill="#fbbf24" opacity="0.8"/>
                 
                 <rect x="250" y="0" width="25" height="600" fill="url(#roadGradient)"/>
                 <rect x="260" y="0" width="5" height="600" fill="#fbbf24" opacity="0.8"/>
                 
                 <rect x="500" y="0" width="20" height="600" fill="url(#roadGradient)"/>
                 <rect x="505" y="0" width="5" height="600" fill="#fbbf24" opacity="0.8"/>

                 {/* 次要道路 */}
                 <rect x="0" y="350" width="800" height="15" fill="#e4e4e7"/>
                 <rect x="400" y="0" width="15" height="600" fill="#e4e4e7"/>

                 {/* 建筑物群 - A区域 */}
                 <g filter="url(#buildingShadow)">
                   <rect x="50" y="50" width="120" height="80" fill="#3b82f6" opacity="0.8" rx="5"/>
                   <text x="110" y="95" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">A区厂房</text>
                 </g>
                 
                 <g filter="url(#buildingShadow)">
                   <rect x="300" y="80" width="150" height="60" fill="#ef4444" opacity="0.8" rx="5"/>
                   <text x="375" y="115" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">生产车间</text>
                 </g>

                 {/* 建筑物群 - B区域 */}
                 <g filter="url(#buildingShadow)">
                   <rect x="80" y="250" width="100" height="70" fill="#8b5cf6" opacity="0.8" rx="5"/>
                   <text x="130" y="290" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">B区办公</text>
                 </g>
                 
                 <g filter="url(#buildingShadow)">
                   <rect x="320" y="280" width="80" height="50" fill="#f59e0b" opacity="0.8" rx="5"/>
                   <text x="360" y="310" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">仓库</text>
                 </g>

                 {/* 建筑物群 - C区域 */}
                 <g filter="url(#buildingShadow)">
                   <rect x="550" y="100" width="180" height="100" fill="#06b6d4" opacity="0.8" rx="5"/>
                   <text x="640" y="155" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">C区综合楼</text>
                 </g>

                 <g filter="url(#buildingShadow)">
                   <rect x="580" y="250" width="120" height="80" fill="#84cc16" opacity="0.8" rx="5"/>
                   <text x="640" y="295" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">研发中心</text>
                 </g>

                 {/* 停车场 */}
                 <rect x="450" y="400" width="100" height="60" fill="#64748b" opacity="0.3" rx="5"/>
                 <text x="500" y="435" textAnchor="middle" fill="#475569" fontSize="10">停车场</text>
                 
                 {/* 停车位标线 */}
                 <g stroke="#374151" strokeWidth="1" opacity="0.6">
                   <line x1="460" y1="410" x2="460" y2="450"/>
                   <line x1="480" y1="410" x2="480" y2="450"/>
                   <line x1="500" y1="410" x2="500" y2="450"/>
                   <line x1="520" y1="410" x2="520" y2="450"/>
                   <line x1="540" y1="410" x2="540" y2="450"/>
                 </g>

                 {/* 区域标识 */}
                 <circle cx="110" cy="30" r="15" fill="#1f2937" opacity="0.9"/>
                 <text x="110" y="35" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">A</text>
                 
                 <circle cx="130" cy="230" r="15" fill="#1f2937" opacity="0.9"/>
                 <text x="130" y="235" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">B</text>
                 
                 <circle cx="640" cy="80" r="15" fill="#1f2937" opacity="0.9"/>
                 <text x="640" y="85" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">C</text>

                 {/* 指北针 */}
                 <g transform="translate(750, 50)">
                   <circle cx="0" cy="0" r="25" fill="white" stroke="#374151" strokeWidth="2" opacity="0.9"/>
                   <polygon points="0,-15 5,5 0,0 -5,5" fill="#ef4444"/>
                   <polygon points="0,15 5,-5 0,0 -5,-5" fill="#6b7280"/>
                   <text x="0" y="35" textAnchor="middle" fontSize="8" fill="#374151">N</text>
                 </g>

                 {/* 比例尺 */}
                 <g transform="translate(50, 550)">
                   <rect x="0" y="0" width="100" height="20" fill="white" stroke="#374151" strokeWidth="1" opacity="0.9"/>
                   <line x1="0" y1="10" x2="25" y2="10" stroke="#374151" strokeWidth="2"/>
                   <line x1="25" y1="10" x2="50" y2="10" stroke="#374151" strokeWidth="2"/>
                   <line x1="50" y1="10" x2="75" y2="10" stroke="#374151" strokeWidth="2"/>
                   <line x1="75" y1="10" x2="100" y2="10" stroke="#374151" strokeWidth="2"/>
                   <text x="50" y="15" textAnchor="middle" fontSize="8" fill="#374151">100m</text>
                 </g>

                 {/* 图例 */}
                 <g transform="translate(600, 450)">
                   <rect x="0" y="0" width="180" height="120" fill="white" stroke="#374151" strokeWidth="1" opacity="0.95" rx="5"/>
                   <text x="90" y="15" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#374151">设备图例</text>
                   
                   {/* 摄像头图例 */}
                   <circle cx="15" cy="30" r="6" fill="#52c41a" opacity="0.3"/>
                   <rect x="12" y="27" width="6" height="6" fill="white" stroke="#52c41a" strokeWidth="1" rx="1"/>
                   <text x="10" y="35" fontSize="6" fill="#52c41a">📹</text>
                   <text x="25" y="34" fontSize="8" fill="#374151">摄像头</text>
                   
                   {/* 传感器图例 */}
                   <circle cx="15" cy="50" r="6" fill="#fa8c16" opacity="0.3"/>
                   <rect x="12" y="47" width="6" height="6" fill="white" stroke="#fa8c16" strokeWidth="1" rx="1"/>
                   <text x="10" y="55" fontSize="6" fill="#fa8c16">📡</text>
                   <text x="25" y="54" fontSize="8" fill="#374151">传感器</text>
                   
                   {/* 通信设备图例 */}
                   <circle cx="15" cy="70" r="6" fill="#1890ff" opacity="0.3"/>
                   <rect x="12" y="67" width="6" height="6" fill="white" stroke="#1890ff" strokeWidth="1" rx="1"/>
                   <text x="10" y="75" fontSize="6" fill="#1890ff">📶</text>
                   <text x="25" y="74" fontSize="8" fill="#374151">通信设备</text>
                   
                   {/* 状态图例 */}
                   <text x="95" y="34" fontSize="8" fill="#374151">状态:</text>
                   <circle cx="100" cy="45" r="3" fill="#52c41a"/>
                   <text x="108" y="48" fontSize="7" fill="#374151">在线</text>
                   <circle cx="100" cy="60" r="3" fill="#fa8c16"/>
                   <text x="108" y="63" fontSize="7" fill="#374151">警告</text>
                   <circle cx="100" cy="75" r="3" fill="#ff4d4f"/>
                   <text x="108" y="78" fontSize="7" fill="#374151">离线</text>
                   
                   {/* 覆盖范围说明 */}
                   <circle cx="140" cy="50" r="8" fill="none" stroke="#52c41a" strokeWidth="1" strokeDasharray="2,2" opacity="0.7"/>
                   <text x="120" y="70" fontSize="7" fill="#374151">通信覆盖范围</text>
                 </g>
               </svg>

                             {/* 设备点位 */}
               {devicePositions.map((device) => (
                 <Tooltip 
                   key={device.id}
                   title={
                     <div style={{ textAlign: 'center' }}>
                       <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{device.name}</div>
                       <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                         类型: {device.type === 'camera' ? '摄像头' : device.type === 'sensor' ? '传感器' : '通信设备'}
                       </div>
                       <div style={{ fontSize: '12px', color: getDeviceColor(device.status) }}>
                         状态: {device.status === 'online' ? '在线' : device.status === 'warning' ? '警告' : '离线'}
                       </div>
                     </div>
                   }
                   placement="top"
                 >
                   <div
                    style={{
                      position: 'absolute',
                       left: `${device.x}%`,
                       top: `${device.y}%`,
                       transform: 'translate(-50%, -50%)',
                       cursor: 'pointer',
                       transition: 'all 0.3s ease',
                       zIndex: 5
                     }}
                     onClick={() => handleDeviceClick(device)}
                   >
                     {/* 信号覆盖范围 - 仅在线设备显示 */}
                     {device.status === 'online' && device.type === 'communication' && (
                       <div style={{
                         position: 'absolute',
                         top: '50%',
                         left: '50%',
                         transform: 'translate(-50%, -50%)',
                         width: '100px',
                         height: '100px',
                         borderRadius: '50%',
                         background: `${getDeviceColor(device.status)}10`,
                         border: `1px dashed ${getDeviceColor(device.status)}`,
                         animation: 'pulse 3s infinite',
                         zIndex: 1
                       }} />
                     )}
                     
                     {/* 设备状态光圈 */}
                     <div style={{
                       position: 'absolute',
                       top: '50%',
                       left: '50%',
                       transform: 'translate(-50%, -50%)',
                       width: '32px',
                       height: '32px',
                      borderRadius: '50%',
                       background: `${getDeviceColor(device.status)}25`,
                       border: `2px solid ${getDeviceColor(device.status)}`,
                       animation: device.status === 'online' ? 'devicePulse 2s infinite' : 'none',
                       zIndex: 2
                     }} />
                     
                     {/* 设备图标容器 */}
                     <div style={{
                       position: 'relative',
                       zIndex: 3,
                       width: '20px',
                       height: '20px',
                       borderRadius: '3px',
                       background: '#fff',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       fontSize: '10px',
                       color: getDeviceColor(device.status),
                       boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                       border: `1px solid ${getDeviceColor(device.status)}`
                     }}>
                       {getDeviceIcon(device.type)}
                     </div>
                     
                     {/* 设备标签 */}
                     <div style={{
                       position: 'absolute',
                       top: '28px',
                       left: '50%',
                       transform: 'translateX(-50%)',
                       background: 'rgba(0,0,0,0.8)',
                       color: 'white',
                       padding: '2px 6px',
                       borderRadius: '10px',
                       fontSize: '8px',
                       fontWeight: 'bold',
                       whiteSpace: 'nowrap',
                       zIndex: 4,
                       opacity: 0.9
                     }}>
                       {device.name}
                     </div>
                   </div>
                 </Tooltip>
               ))}

              {/* 连接线（设备间通信线路） */}
              <svg style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%',
                pointerEvents: 'none'
              }}>
                {devicePositions.slice(0, -1).map((device, index) => {
                  const nextDevice = devicePositions[index + 1];
                  return (
                    <line
                      key={`connection-${device.id}-${nextDevice.id}`}
                      x1={`${device.x}%`}
                      y1={`${device.y}%`}
                      x2={`${nextDevice.x}%`}
                      y2={`${nextDevice.y}%`}
                      stroke="#1890ff"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      opacity="0.3"
                    />
                  );
                })}
              </svg>

              {/* 选中设备信息面板 */}
              {selectedDevice && (
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: '#fff',
                  padding: '16px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  minWidth: '200px',
                  zIndex: 10
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '12px'
                  }}>
                    <span style={{ 
                      fontSize: '16px', 
                      color: getDeviceColor(selectedDevice.status),
                      marginRight: '8px'
                    }}>
                      {getDeviceIcon(selectedDevice.type)}
                    </span>
                    <Text strong>{selectedDevice.name}</Text>
                  </div>
                  <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                    <div>类型: {selectedDevice.type}</div>
                                         <div>状态: <Tag color={getDeviceColor(selectedDevice.status)}>{selectedDevice.status}</Tag></div>
                    <div>位置: ({selectedDevice.x}, {selectedDevice.y})</div>
                  </div>
                  <Button 
                    type="primary" 
                    size="small" 
                    style={{ marginTop: '8px', width: '100%' }}
                    onClick={() => setSelectedDevice(null)}
                  >
                    关闭
                  </Button>
              </div>
              )}
            </div>
          </Card>
        </Col>

        {/* 通信控制面板 */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <TeamOutlined style={{ color: '#52c41a' }} />
                <span>通信控制</span>
              </Space>
            }
            style={{ 
              borderRadius: '12px',
              height: '600px'
            }}
            bodyStyle={{ 
              padding: '20px',
              height: '540px',
              overflow: 'auto'
            }}
          >
            <Tabs defaultActiveKey="users" size="small">
              <TabPane 
                tab={
                  <Space>
                    <UserOutlined />
                    在线人员
                    <Badge count={users.filter(u => u.status === 'online').length} />
                  </Space>
                } 
                key="users"
              >
            <List
                  size="small"
              dataSource={users}
              renderItem={(user) => (
                <List.Item
                      style={{
                        padding: '12px 0',
                        borderBottom: '1px solid #f0f0f0'
                      }}
                  actions={[
                        <Tooltip title="语音通话">
                    <Button 
                      type="text" 
                            size="small"
                      icon={<PhoneOutlined />}
                            onClick={() => handleVoiceCall(user.id, user.name)}
                            disabled={user.status === 'offline'}
                          />
                        </Tooltip>,
                        <Tooltip title="视频通话">
                    <Button 
                      type="text" 
                            size="small"
                      icon={<VideoCameraOutlined />}
                            onClick={() => handleVideoCall(user.id, user.name)}
                            disabled={user.status === 'offline'}
                          />
                        </Tooltip>,
                  ]}
                >
                  <List.Item.Meta
                        avatar={
                          <Badge 
                            status={
                              user.status === 'online' ? 'success' : 
                              user.status === 'busy' ? 'warning' : 'error'
                            }
                            dot
                          >
                            <Avatar size="small" icon={<UserOutlined />} />
                          </Badge>
                        }
                    title={
                          <div style={{ fontSize: '14px' }}>
                        {user.name}
                        <Tag 
                              color={
                                user.status === 'online' ? 'green' : 
                                user.status === 'busy' ? 'orange' : 'red'
                              }
                              style={{ marginLeft: '8px' }}
                            >
                              {
                                user.status === 'online' ? '在线' : 
                                user.status === 'busy' ? '忙碌' : '离线'
                              }
                        </Tag>
                          </div>
                        }
                        description={
                          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                            {user.department} - {user.role}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </TabPane>
              
              <TabPane 
                tab={
                  <Space>
                    <PhoneOutlined />
                    通话记录
                    <Badge count={activeCalls.length} />
                      </Space>
                    }
                key="calls"
              >
                {activeCalls.length === 0 ? (
                  <div style={{ 
                    textAlign: 'center', 
                    color: '#8c8c8c', 
                    padding: '40px 0' 
                  }}>
                    <PhoneOutlined style={{ fontSize: '32px', marginBottom: '16px' }} />
                    <div>暂无活动通话</div>
                  </div>
                ) : (
                  <List
                    size="small"
                    dataSource={activeCalls}
                    renderItem={(call) => (
                      <List.Item
                        style={{
                          padding: '12px 0',
                          borderBottom: '1px solid #f0f0f0'
                        }}
                        actions={[
                          <Button 
                            type="text" 
                            size="small"
                            danger
                            icon={<DisconnectOutlined />}
                            onClick={() => handleEndCall(call.id)}
                          >
                            挂断
                          </Button>
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar 
                              size="small"
                              icon={call.type === 'voice' ? <AudioOutlined /> : <VideoCameraOutlined />}
                              style={{
                                background: call.status === 'active' ? '#52c41a' : '#fa8c16'
                              }}
                            />
                          }
                          title={
                            <div style={{ fontSize: '14px' }}>
                              {call.userName}
                              <Tag 
                                color={call.status === 'active' ? 'green' : 'orange'}
                                style={{ marginLeft: '8px' }}
                              >
                                {call.status === 'connecting' ? '连接中' : '通话中'}
                              </Tag>
                            </div>
                          }
                          description={
                            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                              {call.type === 'voice' ? '语音通话' : '视频通话'} · 
                              {call.status === 'active' ? formatCallDuration(call.duration) : '连接中...'}
                            </div>
                          }
                  />
                </List.Item>
              )}
            />
                )}
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>

      {/* 指令管理 */}
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card 
            title={
              <Space>
                <SendOutlined style={{ color: '#722ed1' }} />
                <span>指令调度管理</span>
                <Badge count={commands.filter(c => c.status === 'pending').length} />
              </Space>
            }
            extra={
              <Space>
              <Button type="primary" icon={<SendOutlined />} onClick={handleSendCommand}>
                发送指令
              </Button>
                <Button icon={<MessageOutlined />}>群发消息</Button>
              </Space>
            }
            style={{ 
              borderRadius: '12px'
            }}
          >
            <Table
              dataSource={commands}
              columns={commandColumns}
              pagination={{ 
                pageSize: 8,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
              }}
              scroll={{ y: 300 }}
              size="middle"
            />
          </Card>
        </Col>
      </Row>

      {/* 发送指令模态框 */}
      <Modal
        title={
          <Space>
            <SendOutlined style={{ color: '#1890ff' }} />
            <span>发送调度指令</span>
          </Space>
        }
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={700}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
          <Form.Item
            name="title"
            label="指令标题"
            rules={[{ required: true, message: '请输入指令标题' }]}
          >
            <Input placeholder="请输入指令标题" />
          </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="优先级"
                rules={[{ required: true, message: '请选择优先级' }]}
              >
                <Select placeholder="请选择优先级">
                  <Option value="low">低优先级</Option>
                  <Option value="medium">中等优先级</Option>
                  <Option value="high">高优先级</Option>
                  <Option value="urgent">紧急优先级</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="receiver"
            label="接收对象"
            rules={[{ required: true, message: '请选择接收对象' }]}
          >
            <Select 
              placeholder="请选择接收对象" 
              mode="multiple"
              optionFilterProp="children"
              showSearch
            >
              {users.map(user => (
                <Option key={user.id} value={user.name}>
                  <Space>
                    <Badge 
                      status={
                        user.status === 'online' ? 'success' : 
                        user.status === 'busy' ? 'warning' : 'error'
                      }
                    />
                  {user.name} ({user.department})
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="content"
            label="指令内容"
            rules={[{ required: true, message: '请输入指令内容' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="请输入详细的指令内容..."
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item name="urgent" valuePropName="checked">
            <Space>
              <Switch />
              <span>紧急指令（立即推送）</span>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

             {/* CSS动画 */}
       <style>
         {`
           @keyframes pulse {
             0% {
               transform: translate(-50%, -50%) scale(1);
               opacity: 1;
             }
             50% {
               transform: translate(-50%, -50%) scale(1.2);
               opacity: 0.6;
             }
             100% {
               transform: translate(-50%, -50%) scale(1);
               opacity: 1;
             }
           }

           @keyframes devicePulse {
             0% {
               transform: translate(-50%, -50%) scale(1);
               opacity: 0.8;
             }
             50% {
               transform: translate(-50%, -50%) scale(1.15);
               opacity: 0.6;
             }
             100% {
               transform: translate(-50%, -50%) scale(1);
               opacity: 0.8;
             }
           }

           /* 设备标签悬停效果 */
           .device-label:hover {
             background: rgba(0,0,0,0.9) !important;
             opacity: 1 !important;
           }
         `}
       </style>
    </div>
  );
};

export default CommandDispatch; 