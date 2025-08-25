import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Switch, 
  Slider, 
  Progress, 
  Tag, 
  Space, 
  Modal, 
  message, 
  Input, 
  Select, 
  Badge,
  Tooltip,
  Divider,
  Timeline,
  Alert,
  Tabs,
  Statistic,
  Popconfirm,
  InputNumber,
  Radio,
  Table,
  Form,
  List,
  Avatar,
  Typography
} from 'antd';
import { 
  ControlOutlined, 
  PoweroffOutlined, 
  SettingOutlined,
  ThunderboltOutlined,
  BulbOutlined,
  ExclamationCircleOutlined,
  VideoCameraOutlined,
  LockOutlined,
  UnlockOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  EyeOutlined,
  HistoryOutlined,
  SafetyOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SoundOutlined,
  WifiOutlined,
  BellOutlined,
  FileTextOutlined,
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  HomeOutlined,
  UserOutlined,
  CalendarOutlined,
  CloudOutlined,
  KeyOutlined,
  CoffeeOutlined,
  SafetyCertificateOutlined,
  RobotOutlined,
  IdcardOutlined,
  VerticalAlignTopOutlined,
  FireOutlined,
  CameraOutlined
} from '@ant-design/icons';
import { hotelDevices, hotelRooms, HotelDevice, HotelRoom } from '../data/mockData';

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

interface ControlOperation {
  id: string;
  timestamp: string;
  device: string;
  roomNumber: string;
  action: string;
  value: any;
  operator: string;
  status: 'success' | 'failed' | 'pending';
}

interface RoomScene {
  id: string;
  name: string;
  description: string;
  icon: string;
  actions: Array<{
    deviceType: string;
    action: string;
    value: any;
  }>;
}

interface DeviceControl {
  deviceId: string;
  roomNumber: string;
  deviceName: string;
  deviceType: string;
  currentValue: any;
  isOnline: boolean;
  lastUpdate: string;
}

const RemoteControl: React.FC = () => {
  const [controlValues, setControlValues] = useState<{[key: string]: any}>({});
  const [isSecurityModalVisible, setIsSecurityModalVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState<any>(null);
  const [operationHistory, setOperationHistory] = useState<ControlOperation[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('rooms');
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [deviceCurrentPage, setDeviceCurrentPage] = useState(1);
  const [devicePageSize, setDevicePageSize] = useState(8);

  // 房间场景预设
  const [roomScenes] = useState<RoomScene[]>([
    {
      id: 'welcome',
      name: '欢迎模式',
      description: '客人入住时的舒适环境设置',
      icon: 'HomeOutlined',
      actions: [
        { deviceType: 'air_conditioner', action: 'temperature', value: 22 },
        { deviceType: 'lighting', action: 'brightness', value: 80 },
        { deviceType: 'curtain', action: 'open', value: true },
        { deviceType: 'tv', action: 'power', value: true }
      ]
    },
    {
      id: 'sleep',
      name: '睡眠模式',
      description: '夜间休息时的安静环境设置',
      icon: 'ClockCircleOutlined',
      actions: [
        { deviceType: 'air_conditioner', action: 'temperature', value: 24 },
        { deviceType: 'lighting', action: 'brightness', value: 20 },
        { deviceType: 'curtain', action: 'close', value: true },
        { deviceType: 'tv', action: 'power', value: false }
      ]
    },
    {
      id: 'away',
      name: '外出模式',
      description: '客人外出时的节能设置',
      icon: 'UserOutlined',
      actions: [
        { deviceType: 'air_conditioner', action: 'temperature', value: 26 },
        { deviceType: 'lighting', action: 'brightness', value: 0 },
        { deviceType: 'curtain', action: 'close', value: true },
        { deviceType: 'tv', action: 'power', value: false }
      ]
    },
    {
      id: 'cleaning',
      name: '清洁模式',
      description: '房间清洁时的通风设置',
      icon: 'SafetyOutlined',
      actions: [
        { deviceType: 'air_conditioner', action: 'temperature', value: 20 },
        { deviceType: 'lighting', action: 'brightness', value: 100 },
        { deviceType: 'curtain', action: 'open', value: true },
        { deviceType: 'tv', action: 'power', value: false }
      ]
    }
  ]);

  // 获取楼层列表
  const getFloors = () => {
    const floors = Array.from(new Set(hotelRooms.map(room => room.floor))).sort();
    return floors;
  };

  // 获取可选择的房间列表
  const getAvailableRooms = () => {
    if (selectedFloor === 'all') {
      return hotelRooms;
    }
    return hotelRooms.filter(room => room.floor === parseInt(selectedFloor));
  };

  // 获取房间列表
  const getRooms = () => {
    let filteredRooms = hotelRooms;
    
    // 楼层筛选
    if (selectedFloor !== 'all') {
      filteredRooms = filteredRooms.filter(room => room.floor === parseInt(selectedFloor));
    }
    
    // 房间筛选
    if (selectedRoom !== 'all') {
      filteredRooms = filteredRooms.filter(room => room.roomNumber === selectedRoom);
    }
    
    return filteredRooms;
  };

  // 获取房间设备
  const getRoomDevices = (roomNumber: string) => {
    return hotelDevices.filter(device => device.roomNumber === roomNumber);
  };

  // 获取可控设备
  const getControllableDevices = () => {
    const rooms = getRooms();
    const devices: DeviceControl[] = [];
    
    rooms.forEach(room => {
      const roomDevices = getRoomDevices(room.roomNumber);
      roomDevices.forEach(device => {
        if (device.type !== 'sensor') { // 传感器不可控
          devices.push({
            deviceId: device.id,
            roomNumber: room.roomNumber,
            deviceName: device.name,
            deviceType: device.type,
            currentValue: controlValues[device.id] || getDefaultValue(device.type),
            isOnline: device.status === 'online',
            lastUpdate: device.lastUpdate
          });
        }
      });
    });
    
    return devices;
  };

  // 获取设备默认值
  const getDefaultValue = (deviceType: string) => {
    switch (deviceType) {
      case 'air_conditioner': return { temperature: 22, power: false };
      case 'lighting': return { brightness: 50, power: false };
      case 'curtain': return { open: false };
      case 'tv': return { power: false, volume: 30 };
      case 'door_lock': return { locked: true };
      case 'mini_bar': return { power: false, temperature: 4 };
      case 'safe_box': return { locked: true };
      case 'delivery_robot': return { status: 'idle', battery: 85 };
      case 'access_control': return { accessLevel: 'guest', lastAccess: '' };
      case 'elevator': return { currentFloor: 1, direction: 'idle' };
      case 'fire_alarm': return { status: 'normal', lastTest: '' };
      case 'cctv_camera': return { recording: false, motionDetection: true };
      default: return null;
    }
  };

  // 安全验证
  const performSecurityCheck = (action: any) => {
    if (action.critical) {
      setPendingAction(action);
      setIsSecurityModalVisible(true);
    } else {
      executeAction(action);
    }
  };

  // 执行控制操作
  const executeAction = (action: any) => {
    const operation: ControlOperation = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      device: action.deviceName,
      roomNumber: action.roomNumber,
      action: action.type,
      value: action.value,
      operator: '酒店管理员',
      status: 'success'
    };

    setOperationHistory(prev => [operation, ...prev.slice(0, 49)]);
    setControlValues(prev => ({
      ...prev,
      [action.deviceId]: action.value
    }));

    message.success(`${action.deviceName} ${action.type}控制指令已发送`);
  };

  // 应用房间场景
  const applyRoomScene = (scene: RoomScene, roomNumber: string) => {
    Modal.confirm({
      title: `确认应用场景：${scene.name}`,
      content: `将为房间 ${roomNumber} 应用 ${scene.description}`,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        const roomDevices = getRoomDevices(roomNumber);
        scene.actions.forEach(sceneAction => {
          const device = roomDevices.find(d => d.type === sceneAction.deviceType);
          if (device) {
        executeAction({
          deviceId: device.id,
          deviceName: device.name,
              roomNumber: roomNumber,
              type: sceneAction.action,
              value: sceneAction.value,
          critical: false
        });
      }
    });
        message.success(`房间 ${roomNumber} 场景 "${scene.name}" 应用成功`);
      }
    });
  };

  // 批量控制
  const handleBatchControl = (action: string, value: any) => {
    const devices = getControllableDevices();
    const targetDevices = selectedRoom === 'all' 
      ? devices 
      : devices.filter(d => d.roomNumber === selectedRoom);
    
    targetDevices.forEach(device => {
      if (device.isOnline) {
          executeAction({
          deviceId: device.deviceId,
          deviceName: device.deviceName,
          roomNumber: device.roomNumber,
          type: action,
          value: value,
            critical: false
          });
      }
    });
    message.success(`批量${action}操作完成`);
  };

  // 紧急停止
  const handleEmergencyStop = () => {
    performSecurityCheck({
      deviceId: 'all',
      deviceName: '所有设备',
      roomNumber: 'all',
      type: '紧急停止',
      value: false,
      critical: true
    });
  };

  // 实时更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 楼层变化时重置房间选择
  useEffect(() => {
    setSelectedRoom('all');
    setCurrentPage(1);
  }, [selectedFloor]);

  // 房间选择变化时重置分页
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRoom]);

  const rooms = getRooms();
  const controllableDevices = getControllableDevices();

  // 系统状态统计
  const systemStats = {
    totalRooms: rooms.length,
    occupiedRooms: rooms.filter(r => r.status === 'occupied').length,
    totalDevices: controllableDevices.length,
    onlineDevices: controllableDevices.filter(d => d.isOnline).length,
    controlledDevices: Object.keys(controlValues).length,
    recentOperations: operationHistory.length
  };

  // 分页计算
  const totalRooms = rooms.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentRooms = rooms.slice(startIndex, endIndex);
  
  const totalDevices = controllableDevices.length;
  const deviceStartIndex = (deviceCurrentPage - 1) * devicePageSize;
  const deviceEndIndex = deviceStartIndex + devicePageSize;
  const currentDevices = controllableDevices.slice(deviceStartIndex, deviceEndIndex);

  // 操作历史表格列
  const operationColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150
    },
    {
      title: '房间',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
      width: 80
    },
    {
      title: '设备',
      dataIndex: 'device',
      key: 'device',
      width: 150
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 100
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value',
      width: 100,
      render: (value: any) => {
        if (typeof value === 'boolean') {
          return value ? '开启' : '关闭';
        }
        if (typeof value === 'object') {
          return JSON.stringify(value);
        }
        return value;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => {
        const statusConfig = {
          success: { color: 'green', text: '成功' },
          failed: { color: 'red', text: '失败' },
          pending: { color: 'orange', text: '执行中' }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    }
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>远程控制中心</Title>
        <Space>
          <Switch
            checked={isEmergencyMode}
            onChange={setIsEmergencyMode}
            checkedChildren={<FireOutlined />}
            unCheckedChildren={<SafetyOutlined />}
          />
          <span>紧急模式</span>
          <Button 
            type="primary" 
            danger={isEmergencyMode}
            icon={<PoweroffOutlined />}
            onClick={handleEmergencyStop}
          >
            紧急停止
          </Button>
        </Space>
      </div>

      {/* 系统状态概览 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="房间总数"
              value={260}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="已入住"
              value={140}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix={`/ ${260}`}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="设备总数"
              value={systemStats.totalDevices}
              prefix={<ControlOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="在线设备"
              value={systemStats.onlineDevices}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix={`/ ${systemStats.totalDevices}`}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="受控设备"
              value={systemStats.controlledDevices}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="操作记录"
              value={systemStats.recentOperations}
              prefix={<HistoryOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
      </Card>
        </Col>
      </Row>

      {/* 紧急告警 */}
      {isEmergencyMode && (
        <Alert
          message="紧急模式已激活"
          description="当前处于紧急模式，所有控制操作将需要额外验证"
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
          action={
            <Button 
              size="small" 
              onClick={() => setIsEmergencyMode(false)}
            >
              退出紧急模式
            </Button>
          }
        />
      )}

      {/* 主控制面板 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={<span><HomeOutlined />房间控制</span>} key="rooms">
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <Space>
                  <span>楼层:</span>
                  <Select
                    value={selectedFloor}
                    onChange={setSelectedFloor}
                    style={{ width: 120 }}
                  >
                    <Option value="all">全部楼层</Option>
                    {getFloors().map(floor => (
                      <Option key={floor} value={floor.toString()}>
                        {floor}层
                      </Option>
                    ))}
                  </Select>
                </Space>
              </Col>
              <Col span={8}>
                <Space>
                  <span>房间:</span>
                  <Select
                    value={selectedRoom}
                    onChange={setSelectedRoom}
                    style={{ width: 120 }}
                  >
                    <Option value="all">全部房间</Option>
                    {getAvailableRooms().map(room => (
                      <Option key={room.roomNumber} value={room.roomNumber}>
                        {room.roomNumber}
                      </Option>
                    ))}
                  </Select>
                </Space>
              </Col>
              <Col span={8}>
                <Space style={{ float: 'right' }}>
                  <Button 
                    icon={<BulbOutlined />}
                    onClick={() => handleBatchControl('power', true)}
                  >
                    批量开启
                  </Button>
                  <Button 
                    icon={<PoweroffOutlined />}
                    onClick={() => handleBatchControl('power', false)}
                  >
                    批量关闭
                  </Button>
                </Space>
              </Col>
            </Row>

      <Row gutter={16}>
              {currentRooms.map(room => (
                <Col span={8} key={room.id} style={{ marginBottom: 16 }}>
            <Card
              title={
                <Space>
                        <HomeOutlined />
                        房间 {room.roomNumber}
                        <Tag color={room.status === 'occupied' ? 'green' : 'blue'}>
                          {room.status === 'occupied' ? '已入住' : '空闲'}
                        </Tag>
                </Space>
              }
              extra={
                      <Space>
                        <Badge 
                          status={room.onlineDeviceCount > 0 ? 'success' : 'error'} 
                          text={`${room.onlineDeviceCount}/${room.deviceCount} 设备在线`}
                        />
                      </Space>
                    }
                    size="small"
            >
                    <div style={{ marginBottom: 12, fontSize: 12, color: '#666' }}>
                      <div>类型: {room.type === 'standard' ? '标准间' : room.type === 'deluxe' ? '豪华间' : '套房'}</div>
                      <div>温度: {room.temperature}°C</div>
                      <div>湿度: {room.humidity}%</div>
                      <div>能耗: {room.energyConsumption} kWh</div>
              </div>

                    {/* 房间场景快捷操作 */}
                    <div style={{ marginBottom: 12 }}>
                      <Text strong>快捷场景:</Text>
                      <div style={{ marginTop: 8 }}>
                        {roomScenes.map(scene => (
                          <Button
                            key={scene.id}
                            size="small"
                            style={{ marginRight: 8, marginBottom: 4 }}
                            onClick={() => applyRoomScene(scene, room.roomNumber)}
                          >
                            {scene.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* 房间设备控制 */}
                    <div>
                      <Text strong>设备控制:</Text>
                      {getRoomDevices(room.roomNumber).map(device => (
                        <div key={device.id} style={{ marginTop: 8, padding: 8, border: '1px solid #f0f0f0', borderRadius: 4 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <span style={{ fontSize: 12 }}>{device.name}</span>
                            <Badge 
                              status={device.status === 'online' ? 'success' : 'error'} 
                              text={device.status === 'online' ? '在线' : '离线'}
                            />
                          </div>
                          
                          {device.type === 'air_conditioner' && (
                            <div>
                              <div style={{ fontSize: 12, marginBottom: 4 }}>
                                温度: {controlValues[device.id]?.temperature || 22}°C
                              </div>
                              <Slider
                                min={16}
                                max={30}
                                value={controlValues[device.id]?.temperature || 22}
                                onChange={(value) => executeAction({
                              deviceId: device.id,
                              deviceName: device.name,
                                  roomNumber: room.roomNumber,
                                  type: 'temperature',
                                  value: { ...controlValues[device.id], temperature: value },
                                  critical: false
                            })}
                      disabled={device.status !== 'online'}
                    />
                    <Switch
                            size="small"
                                checked={controlValues[device.id]?.power || false}
                            onChange={(checked) => executeAction({
                              deviceId: device.id,
                              deviceName: device.name,
                                  roomNumber: room.roomNumber,
                                  type: 'power',
                                  value: { ...controlValues[device.id], power: checked },
                              critical: false
                            })}
                      disabled={device.status !== 'online'}
                    />
                              <span style={{ marginLeft: 8, fontSize: 12 }}>电源</span>
                  </div>
                          )}

                          {device.type === 'lighting' && (
                            <div>
                          <div style={{ fontSize: 12, marginBottom: 4 }}>
                                亮度: {controlValues[device.id]?.brightness || 50}%
                    </div>
                    <Slider
                                min={0}
                                max={100}
                                value={controlValues[device.id]?.brightness || 50}
                             onChange={(value) => executeAction({
                               deviceId: device.id,
                               deviceName: device.name,
                                  roomNumber: room.roomNumber,
                                  type: 'brightness',
                                  value: { ...controlValues[device.id], brightness: value },
                               critical: false
                             })}
                      disabled={device.status !== 'online'}
                    />
                </div>
              )}

                          {device.type === 'curtain' && (
                <div>
                              <Space>
                      <Button 
                        size="small"
                                  icon={<UnlockOutlined />}
                              onClick={() => executeAction({
                                deviceId: device.id,
                                deviceName: device.name,
                                    roomNumber: room.roomNumber,
                                    type: 'open',
                                    value: true,
                                critical: false
                              })}
                        disabled={device.status !== 'online'}
                      >
                                  开启
                      </Button>
                      <Button 
                        size="small"
                                  icon={<LockOutlined />}
                              onClick={() => executeAction({
                                deviceId: device.id,
                                deviceName: device.name,
                                    roomNumber: room.roomNumber,
                                    type: 'close',
                                    value: false,
                                critical: false
                              })}
                        disabled={device.status !== 'online'}
                      >
                                  关闭
                      </Button>
                              </Space>
                            </div>
                          )}

                          {device.type === 'tv' && (
                            <div>
                              <Space>
                                <Switch
                        size="small"
                                  checked={controlValues[device.id]?.power || false}
                                  onChange={(checked) => executeAction({
                                deviceId: device.id,
                                deviceName: device.name,
                                    roomNumber: room.roomNumber,
                                    type: 'power',
                                    value: { ...controlValues[device.id], power: checked },
                                critical: false
                              })}
                              disabled={device.status !== 'online'}
                                />
                                <span style={{ fontSize: 12 }}>电源</span>
                              </Space>
                            </div>
                          )}

                          {device.type === 'door_lock' && (
                            <div>
                              <Space>
                            <Button 
                              size="small"
                                  icon={<LockOutlined />}
                              onClick={() => executeAction({
                                deviceId: device.id,
                                deviceName: device.name,
                                    roomNumber: room.roomNumber,
                                    type: 'lock',
                                    value: true,
                                    critical: true
                              })}
                        disabled={device.status !== 'online'}
                      >
                                  锁定
                      </Button>
                            <Button 
                              size="small"
                                  icon={<UnlockOutlined />}
                              onClick={() => executeAction({
                                deviceId: device.id,
                                deviceName: device.name,
                                    roomNumber: room.roomNumber,
                                    type: 'unlock',
                                    value: false,
                                    critical: true
                              })}
                              disabled={device.status !== 'online'}
                            >
                                  解锁
                            </Button>
                              </Space>
                          </div>
                          )}
                  </div>
                      ))}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
            
            {/* 分页控件 */}
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Space>
                <span>每页显示:</span>
                <Select
                  value={pageSize}
                  onChange={(value) => {
                    setPageSize(value);
                    setCurrentPage(1);
                  }}
                  style={{ width: 80 }}
                >
                  <Option value={6}>6间</Option>
                  <Option value={9}>9间</Option>
                  <Option value={12}>12间</Option>
                </Select>
                <span>房间</span>
              </Space>
              <div style={{ marginTop: 8 }}>
                <Button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  style={{ marginRight: 8 }}
                >
                  上一页
                </Button>
                <span style={{ margin: '0 16px' }}>
                  第 {currentPage} 页，共 {Math.ceil(totalRooms / pageSize)} 页
                  （共 {totalRooms} 间房间）
                </span>
                <Button
                  disabled={currentPage >= Math.ceil(totalRooms / pageSize)}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  style={{ marginLeft: 8 }}
                >
                  下一页
                </Button>
              </div>
            </div>
          </TabPane>

          <TabPane tab={<span><ControlOutlined />设备控制</span>} key="devices">
            <Row gutter={16}>
              {currentDevices.map(device => (
                <Col span={6} key={device.deviceId} style={{ marginBottom: 16 }}>
                  <Card
                    title={
                                            <Space>
                        {device.deviceType === 'air_conditioner' && <CloudOutlined />}
                        {device.deviceType === 'lighting' && <BulbOutlined />}
                        {device.deviceType === 'curtain' && <EnvironmentOutlined />}
                        {device.deviceType === 'tv' && <PlayCircleOutlined />}
                        {device.deviceType === 'door_lock' && <KeyOutlined />}
                        {device.deviceType === 'mini_bar' && <CoffeeOutlined />}
                        {device.deviceType === 'safe_box' && <SafetyCertificateOutlined />}
                        {device.deviceType === 'delivery_robot' && <RobotOutlined />}
                        {device.deviceType === 'access_control' && <IdcardOutlined />}
                        {device.deviceType === 'elevator' && <VerticalAlignTopOutlined />}
                        {device.deviceType === 'fire_alarm' && <FireOutlined />}
                        {device.deviceType === 'cctv_camera' && <CameraOutlined />}
                        {device.deviceName}
                      </Space>
                    }
                    extra={
                      <Badge 
                        status={device.isOnline ? 'success' : 'error'} 
                        text={device.isOnline ? '在线' : '离线'}
                      />
                    }
                    size="small"
                  >
                    <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>
                      <div>房间: {device.roomNumber}</div>
                      <div>更新: {device.lastUpdate}</div>
                    </div>

                    {device.deviceType === 'air_conditioner' && (
                      <div>
                    <div style={{ marginBottom: 8 }}>
                          <div style={{ fontSize: 12, marginBottom: 4 }}>
                            温度: {device.currentValue?.temperature || 22}°C
                    </div>
                    <Slider
                            min={16}
                            max={30}
                            value={device.currentValue?.temperature || 22}
                             onChange={(value) => executeAction({
                              deviceId: device.deviceId,
                              deviceName: device.deviceName,
                              roomNumber: device.roomNumber,
                              type: 'temperature',
                              value: { ...device.currentValue, temperature: value },
                               critical: false
                             })}
                            disabled={!device.isOnline}
                    />
                  </div>
                          <div style={{ marginBottom: 8 }}>
                          <Switch
                            checked={device.currentValue?.power || false}
                            onChange={(checked) => executeAction({
                              deviceId: device.deviceId,
                              deviceName: device.deviceName,
                              roomNumber: device.roomNumber,
                              type: 'power',
                              value: { ...device.currentValue, power: checked },
                              critical: false
                            })}
                            disabled={!device.isOnline}
                          />
                          <span style={{ marginLeft: 8, fontSize: 12 }}>电源</span>
                        </div>
                    </div>
                  )}

                    {device.deviceType === 'lighting' && (
                      <div>
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontSize: 12, marginBottom: 4 }}>
                            亮度: {device.currentValue?.brightness || 50}%
                          </div>
                          <Slider
                            min={0}
                            max={100}
                            value={device.currentValue?.brightness || 50}
                            onChange={(value) => executeAction({
                              deviceId: device.deviceId,
                              deviceName: device.deviceName,
                              roomNumber: device.roomNumber,
                              type: 'brightness',
                              value: { ...device.currentValue, brightness: value },
                              critical: false
                            })}
                            disabled={!device.isOnline}
                          />
                        </div>
                </div>
              )}

                    {device.deviceType === 'curtain' && (
                      <div>
                        <Space>
                      <Button 
                        size="small" 
                            icon={<UnlockOutlined />}
                            onClick={() => executeAction({
                              deviceId: device.deviceId,
                              deviceName: device.deviceName,
                              roomNumber: device.roomNumber,
                              type: 'open',
                              value: true,
                              critical: false
                            })}
                            disabled={!device.isOnline}
                      >
                            开启
                      </Button>
                        <Button 
                          size="small" 
                            icon={<LockOutlined />}
                            onClick={() => executeAction({
                              deviceId: device.deviceId,
                              deviceName: device.deviceName,
                              roomNumber: device.roomNumber,
                              type: 'close',
                              value: false,
                              critical: false
                            })}
                            disabled={!device.isOnline}
                          >
                            关闭
                        </Button>
                        </Space>
                      </div>
                    )}

                    {device.deviceType === 'tv' && (
                      <div>
                        <Space>
                          <Switch
                            checked={device.currentValue?.power || false}
                            onChange={(checked) => executeAction({
                              deviceId: device.deviceId,
                              deviceName: device.deviceName,
                              roomNumber: device.roomNumber,
                              type: 'power',
                              value: { ...device.currentValue, power: checked },
                              critical: false
                            })}
                            disabled={!device.isOnline}
                          />
                          <span style={{ fontSize: 12 }}>电源</span>
                        </Space>
                    </div>
                    )}

                    {device.deviceType === 'door_lock' && (
                      <div>
                        <Space>
                <Button 
                        size="small"
                            icon={<LockOutlined />}
                            onClick={() => executeAction({
                              deviceId: device.deviceId,
                              deviceName: device.deviceName,
                              roomNumber: device.roomNumber,
                              type: 'lock',
                              value: true,
                              critical: true
                            })}
                            disabled={!device.isOnline}
                >
                            锁定
                </Button>
                          <Button
                            size="small"
                            icon={<UnlockOutlined />}
                            onClick={() => executeAction({
                              deviceId: device.deviceId,
                              deviceName: device.deviceName,
                              roomNumber: device.roomNumber,
                              type: 'unlock',
                              value: false,
                              critical: true
                            })}
                            disabled={!device.isOnline}
                          >
                            解锁
                          </Button>
                        </Space>
                    </div>
                    )}

                    {device.deviceType === 'delivery_robot' && (
                    <div>
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontSize: 12, marginBottom: 4 }}>
                            状态: {device.currentValue?.status || '空闲'}
                      </div>
                          {device.currentValue?.destination && (
                            <div style={{ fontSize: 12, marginBottom: 4 }}>
                              目的地: {device.currentValue.destination}
              </div>
                          )}
                          {device.currentValue?.estimatedArrival && (
                            <div style={{ fontSize: 12, marginBottom: 4 }}>
                              预计到达: {device.currentValue.estimatedArrival}
                            </div>
                          )}
                        </div>
          <Space>
                          <Button
                            size="small"
                            icon={<PlayCircleOutlined />}
                            onClick={() => executeAction({
                              deviceId: device.deviceId,
                              deviceName: device.deviceName,
                              roomNumber: device.roomNumber,
                              type: 'start_delivery',
                              value: { destination: device.roomNumber },
                              critical: false
                            })}
                            disabled={!device.isOnline}
                          >
                            开始送餐
          </Button>
                          <Button
                            size="small"
                            icon={<PauseCircleOutlined />}
                            onClick={() => executeAction({
                              deviceId: device.deviceId,
                              deviceName: device.deviceName,
                              roomNumber: device.roomNumber,
                              type: 'pause_delivery',
                              value: true,
                              critical: false
                            })}
                            disabled={!device.isOnline}
                          >
                            暂停
                          </Button>
                        </Space>
                      </div>
                    )}

                    {device.deviceType === 'access_control' && (
          <div>
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontSize: 12, marginBottom: 4 }}>
                            访问级别: {device.currentValue?.accessLevel || 'guest'}
                    </div>
                          {device.currentValue?.lastAccess && (
                            <div style={{ fontSize: 12, marginBottom: 4 }}>
                              最后访问: {device.currentValue.lastAccess}
                  </div>
                          )}
                        </div>
                        <Space>
                          <Button
                            size="small"
                            icon={<UnlockOutlined />}
                            onClick={() => executeAction({
                              deviceId: device.deviceId,
                              deviceName: device.deviceName,
                              roomNumber: device.roomNumber,
                              type: 'grant_access',
                              value: { level: 'guest', duration: 30 },
                              critical: true
                            })}
                            disabled={!device.isOnline}
                          >
                            授权访问
                          </Button>
                          <Button
                            size="small"
                            icon={<LockOutlined />}
                            onClick={() => executeAction({
                              deviceId: device.deviceId,
                              deviceName: device.deviceName,
                              roomNumber: device.roomNumber,
                              type: 'revoke_access',
                              value: false,
                              critical: true
                            })}
                            disabled={!device.isOnline}
                          >
                            撤销访问
                          </Button>
                        </Space>
                      </div>
                    )}

                    {device.deviceType === 'elevator' && (
                    <div>
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontSize: 12, marginBottom: 4 }}>
                            当前楼层: {device.currentValue?.currentFloor || 1}
                    </div>
                          <div style={{ fontSize: 12, marginBottom: 4 }}>
                            方向: {device.currentValue?.direction || 'idle'}
                    </div>
                  </div>
                        <Space>
                          <Button
                            size="small"
                            icon={<VerticalAlignTopOutlined />}
                            onClick={() => executeAction({
                              deviceId: device.deviceId,
                              deviceName: device.deviceName,
                              roomNumber: device.roomNumber,
                              type: 'call_elevator',
                              value: { floor: device.roomNumber.split('')[0] },
                              critical: false
                            })}
                            disabled={!device.isOnline}
                          >
                            呼叫电梯
                          </Button>
                          <Button
                            size="small"
                            icon={<SettingOutlined />}
                            onClick={() => executeAction({
                              deviceId: device.deviceId,
                              deviceName: device.deviceName,
                              roomNumber: device.roomNumber,
                              type: 'maintenance_mode',
                              value: true,
                              critical: true
                            })}
                            disabled={!device.isOnline}
                          >
                            维护模式
                          </Button>
                        </Space>
                </div>
                    )}

                    {device.deviceType === 'fire_alarm' && (
                      <div>
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontSize: 12, marginBottom: 4 }}>
                            状态: {device.currentValue?.status || 'normal'}
                          </div>
                        </div>
                        <Space>
                <Button 
                  size="small" 
                            icon={<FireOutlined />}
                            onClick={() => executeAction({
                              deviceId: device.deviceId,
                              deviceName: device.deviceName,
                              roomNumber: device.roomNumber,
                              type: 'test_alarm',
                              value: true,
                              critical: false
                            })}
                            disabled={!device.isOnline}
                >
                            测试警报
                </Button>
                <Button 
                  size="small" 
                  icon={<SettingOutlined />}
                            onClick={() => executeAction({
                              deviceId: device.deviceId,
                              deviceName: device.deviceName,
                              roomNumber: device.roomNumber,
                              type: 'silence_alarm',
                              value: true,
                              critical: true
                            })}
                            disabled={!device.isOnline}
                >
                            静音
                </Button>
                        </Space>
              </div>
                    )}

                    {device.deviceType === 'cctv_camera' && (
                      <div>
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontSize: 12, marginBottom: 4 }}>
                            录制: {device.currentValue?.recording ? '开启' : '关闭'}
                    </div>
                          <div style={{ fontSize: 12, marginBottom: 4 }}>
                            移动检测: {device.currentValue?.motionDetection ? '开启' : '关闭'}
                    </div>
                  </div>
                        <Space>
                      <Switch 
                        size="small" 
                            checked={device.currentValue?.recording || false}
                            onChange={(checked) => executeAction({
                              deviceId: device.deviceId,
                              deviceName: device.deviceName,
                              roomNumber: device.roomNumber,
                              type: 'recording',
                              value: checked,
                              critical: false
                            })}
                            disabled={!device.isOnline}
                          />
                          <span style={{ fontSize: 12 }}>录制</span>
                          <Switch
                            size="small"
                            checked={device.currentValue?.motionDetection || false}
                            onChange={(checked) => executeAction({
                              deviceId: device.deviceId,
                              deviceName: device.deviceName,
                              roomNumber: device.roomNumber,
                              type: 'motion_detection',
                              value: checked,
                              critical: false
                            })}
                            disabled={!device.isOnline}
                          />
                          <span style={{ fontSize: 12 }}>移动检测</span>
                        </Space>
                    </div>
                    )}
                </Card>
              </Col>
              ))}
            </Row>

            {/* 设备分页控件 */}
            <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Space>
                <span>每页显示:</span>
                <Select
                  value={devicePageSize}
                  onChange={(value) => {
                    setDevicePageSize(value);
                    setDeviceCurrentPage(1);
                  }}
                  style={{ width: 80 }}
                >
                  <Option value={8}>8台</Option>
                  <Option value={12}>12台</Option>
                  <Option value={16}>16台</Option>
                        </Select>
                <span>设备</span>
              </Space>
              <div style={{ marginTop: 8 }}>
                <Button
                  disabled={deviceCurrentPage === 1}
                  onClick={() => setDeviceCurrentPage(deviceCurrentPage - 1)}
                  style={{ marginRight: 8 }}
                >
                  上一页
                </Button>
                <span style={{ margin: '0 16px' }}>
                  第 {deviceCurrentPage} 页，共 {Math.ceil(totalDevices / devicePageSize)} 页
                  （共 {totalDevices} 台设备）
                </span>
                <Button
                  disabled={deviceCurrentPage >= Math.ceil(totalDevices / devicePageSize)}
                  onClick={() => setDeviceCurrentPage(deviceCurrentPage + 1)}
                  style={{ marginLeft: 8 }}
                >
                  下一页
                </Button>
              </div>
            </div>
              </TabPane>
              
          <TabPane tab={<span><HistoryOutlined />操作记录</span>} key="history">
            <Table
              columns={operationColumns}
              dataSource={operationHistory}
              rowKey="id"
              pagination={{ pageSize: 20 }}
              size="small"
            />
              </TabPane>
            </Tabs>
      </Card>

      {/* 安全验证模态框 */}
      <Modal
        title="安全验证"
        open={isSecurityModalVisible}
        onOk={() => {
                if (pendingAction) {
                  executeAction(pendingAction);
          }
                  setIsSecurityModalVisible(false);
                  setPendingAction(null);
        }}
        onCancel={() => {
          setIsSecurityModalVisible(false);
          setPendingAction(null);
        }}
        okText="确认执行"
        cancelText="取消"
      >
        <p>您即将执行一个关键操作：</p>
        <p><strong>设备：</strong>{pendingAction?.deviceName}</p>
        <p><strong>操作：</strong>{pendingAction?.type}</p>
        <p><strong>值：</strong>{pendingAction?.value}</p>
        <p>请确认您有权限执行此操作。</p>
      </Modal>
    </div>
  );
};

export default RemoteControl; 