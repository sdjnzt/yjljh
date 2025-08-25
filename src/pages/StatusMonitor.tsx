import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Table, 
  Tag, 
  Progress, 
  Button, 
  Modal, 
  Select, 
  Space, 
  Input, 
  Badge, 
  Statistic, 
  Tooltip,
  message,
  Switch,
  Radio
} from 'antd';
import { 
  VideoCameraOutlined, 
  EyeOutlined,
  ReloadOutlined,
  SettingOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  WifiOutlined,
  ThunderboltOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FullscreenOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CameraOutlined,
  DownloadOutlined
} from '@ant-design/icons';

import { devices } from '../data/mockData';

const { Option } = Select;
const { Search } = Input;

interface DeviceMetrics {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  warningDevices: number;
  healthScore: number;
  signalStrength: number;
  avgBattery: number;
}

const StatusMonitor: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [filteredDevices, setFilteredDevices] = useState(devices);
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
  const [deviceMetrics, setDeviceMetrics] = useState<DeviceMetrics>({
    totalDevices: 0,
    onlineDevices: 0,
    offlineDevices: 0,
    warningDevices: 0,
    healthScore: 0,
    signalStrength: 0,
    avgBattery: 0
  });

  // 模拟实时数据更新
  useEffect(() => {
    const updateMetrics = () => {
      const total = devices.length;
      const online = devices.filter(d => d.status === 'online').length;
      const offline = devices.filter(d => d.status === 'offline').length;
      const warning = devices.filter(d => d.status === 'warning').length;
      const avgSignal = devices.reduce((acc, d) => acc + (d.signal || 0), 0) / total;
      const avgBattery = devices.filter(d => d.battery).reduce((acc, d) => acc + (d.battery || 0), 0) / devices.filter(d => d.battery).length;
      const healthScore = Math.round((online / total) * 100);

      setDeviceMetrics({
        totalDevices: total,
        onlineDevices: online,
        offlineDevices: offline,
        warningDevices: warning,
        healthScore,
        signalStrength: Math.round(avgSignal),
        avgBattery: Math.round(avgBattery)
      });
    };

    updateMetrics();
    
    if (autoRefresh) {
      const interval = setInterval(updateMetrics, 3000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // 筛选和搜索逻辑
  useEffect(() => {
    let filtered = devices;

    if (deviceTypeFilter) {
      filtered = filtered.filter(d => d.type === deviceTypeFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(d => d.status === statusFilter);
    }

    if (searchText) {
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(searchText.toLowerCase()) ||
        d.location.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredDevices(filtered);
  }, [deviceTypeFilter, statusFilter, searchText]);

  const handleViewVideo = (deviceId: string) => {
    setSelectedDevice(deviceId);
    setIsVideoModalVisible(true);
  };

  const handleRefreshStatus = () => {
    message.success('设备状态已刷新');
  };

  // 状态分布饼图数据
  const statusDistributionData = [
    { type: '在线', value: deviceMetrics.onlineDevices || 0, color: '#52c41a' },
    { type: '离线', value: deviceMetrics.offlineDevices || 0, color: '#ff4d4f' },
    { type: '告警', value: deviceMetrics.warningDevices || 0, color: '#faad14' }
  ].filter(item => item.value > 0);



  // 设备状态列定义
  const columns = [
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (name: string, record: any) => (
        <Space>
          <Badge 
            status={record.status === 'online' ? 'success' : record.status === 'warning' ? 'warning' : 'error'} 
          />
          {name}
        </Space>
      ),
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap = {
          camera: { text: '高清摄像头', icon: <VideoCameraOutlined style={{ color: '#1890ff' }} /> },
          phone: { text: '语音对讲机', icon: <WifiOutlined style={{ color: '#52c41a' }} /> },
          sensor: { text: '传感器', icon: <EnvironmentOutlined style={{ color: '#faad14' }} /> },
          controller: { text: '控制器', icon: <SettingOutlined style={{ color: '#722ed1' }} /> },
        };
        const config = typeMap[type as keyof typeof typeMap];
        return (
          <Space>
            {config.icon}
            {config.text}
          </Space>
        );
      },
    },
    {
      title: '运行状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          online: { color: 'success', text: '在线运行', icon: <CheckCircleOutlined /> },
          offline: { color: 'error', text: '离线', icon: <CloseCircleOutlined /> },
          warning: { color: 'warning', text: '异常警告', icon: <ExclamationCircleOutlined /> },
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
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      render: (location: string) => (
        <Space>
          <EnvironmentOutlined style={{ color: '#1890ff' }} />
          {location}
        </Space>
      ),
    },
    {
      title: '健康度',
      key: 'health',
      render: (record: any) => {
        const health = record.status === 'online' ? 
          Math.round(85 + Math.random() * 15) : 
          record.status === 'warning' ? 
          Math.round(40 + Math.random() * 30) : 
          Math.round(Math.random() * 20);
        
        return (
          <Progress 
            percent={health} 
            size="small" 
            status={health > 80 ? 'success' : health > 50 ? 'normal' : 'exception'}
            format={percent => `${percent}%`}
          />
        );
      },
    },
    {
      title: '电池电量',
      dataIndex: 'battery',
      key: 'battery',
      render: (battery: number) => {
        if (battery === undefined) return '-';
        return (
          <Space>
                         <ThunderboltOutlined style={{ 
               color: battery > 60 ? '#52c41a' : battery > 20 ? '#faad14' : '#ff4d4f' 
             }} />
            <Progress 
              percent={battery} 
              size="small" 
              status={battery > 60 ? 'success' : battery > 20 ? 'normal' : 'exception'}
              format={percent => `${percent}%`}
            />
          </Space>
        );
      },
    },
    {
      title: '信号强度',
      dataIndex: 'signal',
      key: 'signal',
      render: (signal: number) => {
        if (signal === undefined) return '-';
        return (
          <Space>
            <WifiOutlined style={{ 
              color: signal > 80 ? '#52c41a' : signal > 50 ? '#faad14' : '#ff4d4f' 
            }} />
            <Progress 
              percent={signal} 
              size="small" 
              status={signal > 80 ? 'success' : signal > 50 ? 'normal' : 'exception'}
              format={percent => `${percent}%`}
            />
          </Space>
        );
      },
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 150,
      render: (_: any, record: any) => (
        <Space>
          {record.type === 'camera' && (
            <Tooltip title="查看实时视频">
            <Button 
              type="link" 
              icon={<EyeOutlined />}
              onClick={() => handleViewVideo(record.id)}
              />
            </Tooltip>
          )}
          <Tooltip title="设备设置">
          <Button 
            type="link" 
            icon={<SettingOutlined />}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

    // 专业设备监控地图视图
  const MapView = () => {
    return (
      <div style={{ 
        height: 600, 
        background: '#1a1a1a',
        borderRadius: 8,
        position: 'relative',
        overflow: 'hidden',
        border: '2px solid #333'
      }}>
        {/* 网格背景 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(0,255,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />

        {/* 雷达扫描效果 */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          height: 400,
          borderRadius: '50%',
          border: '2px solid rgba(0,255,0,0.3)',
          background: 'radial-gradient(circle, rgba(0,255,0,0.05) 0%, transparent 70%)',
          zIndex: 1
        }}>
          {/* 雷达扫描线 */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '50%',
            height: '2px',
            background: 'linear-gradient(90deg, rgba(0,255,0,0.8), transparent)',
            transformOrigin: 'left center',
            animation: 'radar-sweep 4s linear infinite'
          }} />
          
          {/* 内圆 */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 200,
            height: 200,
            borderRadius: '50%',
            border: '1px solid rgba(0,255,0,0.2)'
          }} />
          
          {/* 中心点 */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#00ff00',
            boxShadow: '0 0 10px #00ff00'
          }} />
        </div>

        {/* 设备点位 */}
        {filteredDevices.map((device, index) => {
          const angle = (index * 30) % 360; // 分散角度
          const radius = 100 + (index % 3) * 50; // 分层半径
          const x = 50 + (radius * Math.cos(angle * Math.PI / 180)) / 6;
          const y = 50 + (radius * Math.sin(angle * Math.PI / 180)) / 6;
          
          return (
            <Tooltip 
              key={device.id} 
              title={
                <div style={{ color: '#000' }}>
                  <div><strong>{device.name}</strong></div>
                  <div>位置: {device.location}</div>
                  <div>状态: {device.status === 'online' ? '在线' : device.status === 'warning' ? '告警' : '离线'}</div>
                  <div>类型: {device.type === 'camera' ? '摄像头' : device.type === 'phone' ? '对讲机' : device.type === 'sensor' ? '传感器' : '控制器'}</div>
                  {device.battery && <div>电量: {device.battery}%</div>}
                  {device.signal && <div>信号: {device.signal}%</div>}
                </div>
              }
              overlayStyle={{ zIndex: 9999 }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10,
                  cursor: 'pointer'
                }}
                onClick={() => device.type === 'camera' && handleViewVideo(device.id)}
              >
                {/* 设备图标 */}
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: device.status === 'online' ? '#00ff00' : 
                                 device.status === 'warning' ? '#ff6600' : '#ff0000',
                  border: '2px solid rgba(255,255,255,0.8)',
                  boxShadow: `0 0 15px ${device.status === 'online' ? '#00ff00' : device.status === 'warning' ? '#ff6600' : '#ff0000'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: device.status === 'warning' ? 'device-warning 1s ease-in-out infinite alternate' : 
                            device.status === 'online' ? 'device-online 2s ease-in-out infinite' : 'none'
                }}>
                  {device.type === 'camera' && <VideoCameraOutlined style={{ fontSize: 10, color: '#000' }} />}
                  {device.type === 'phone' && <WifiOutlined style={{ fontSize: 10, color: '#000' }} />}
                  {device.type === 'sensor' && <EnvironmentOutlined style={{ fontSize: 10, color: '#000' }} />}
                  {device.type === 'controller' && <SettingOutlined style={{ fontSize: 10, color: '#000' }} />}
                </div>
                
                {/* 设备标签 */}
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginTop: 4,
                  fontSize: 10,
                  color: '#00ff00',
                  textShadow: '0 0 5px #00ff00',
                  whiteSpace: 'nowrap',
                  background: 'rgba(0,0,0,0.8)',
                  padding: '2px 6px',
                  borderRadius: 3,
                  border: '1px solid rgba(0,255,0,0.3)'
                }}>
                  {device.name}
                </div>
              </div>
            </Tooltip>
          );
        })}

        {/* 控制面板 */}
        <div style={{
          position: 'absolute',
          top: 16,
          left: 16,
          background: 'rgba(0,0,0,0.8)',
          border: '1px solid rgba(0,255,0,0.3)',
          borderRadius: 8,
          padding: '12px 16px',
          color: '#00ff00',
          fontFamily: 'monospace',
          fontSize: 12,
          zIndex: 20
        }}>
          <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 'bold' }}>SYSTEM STATUS</div>
          <div>ONLINE: {deviceMetrics.onlineDevices.toString().padStart(2, '0')}</div>
          <div>WARNING: {deviceMetrics.warningDevices.toString().padStart(2, '0')}</div>
          <div>OFFLINE: {deviceMetrics.offlineDevices.toString().padStart(2, '0')}</div>
          <div style={{ marginTop: 8, borderTop: '1px solid rgba(0,255,0,0.3)', paddingTop: 8 }}>
            <div>HEALTH: {deviceMetrics.healthScore}%</div>
            <div>SIGNAL: {deviceMetrics.signalStrength}%</div>
          </div>
        </div>

        {/* 时间和状态 */}
        <div style={{
          position: 'absolute',
          top: 16,
          right: 16,
          background: 'rgba(0,0,0,0.8)',
          border: '1px solid rgba(0,255,0,0.3)',
          borderRadius: 8,
          padding: '12px 16px',
          color: '#00ff00',
          fontFamily: 'monospace',
          fontSize: 12,
          zIndex: 20
        }}>
          <div>{new Date().toLocaleTimeString()}</div>
          <div style={{ marginTop: 4 }}>
            <span style={{ 
              color: deviceMetrics.onlineDevices === deviceMetrics.totalDevices ? '#00ff00' : '#ff6600',
              animation: 'status-blink 1s ease-in-out infinite'
            }}>
              MONITORING ACTIVE
            </span>
          </div>
        </div>

        {/* 底部信息栏 */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(0,0,0,0.9)',
          border: '1px solid rgba(0,255,0,0.3)',
          borderRadius: '8px 8px 0 0',
          padding: '8px 16px',
          color: '#00ff00',
          fontFamily: 'monospace',
          fontSize: 11,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 20
        }}>
          <div>山东金科星机电股份有限公司 - 融合通信监控系统</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <span>设备总数: {filteredDevices.length}</span>
            <span>在线率: {Math.round((deviceMetrics.onlineDevices / deviceMetrics.totalDevices) * 100)}%</span>
          </div>
        </div>

        {/* CSS动画 */}
        <style>
          {`
          @keyframes radar-sweep {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes device-warning {
            0% { box-shadow: 0 0 15px #ff6600; }
            100% { box-shadow: 0 0 25px #ff6600, 0 0 35px #ff6600; }
          }
          
          @keyframes device-online {
            0% { box-shadow: 0 0 15px #00ff00; }
            50% { box-shadow: 0 0 20px #00ff00, 0 0 25px #00ff00; }
            100% { box-shadow: 0 0 15px #00ff00; }
          }
          
          @keyframes status-blink {
            0% { opacity: 1; }
            50% { opacity: 0.6; }
            100% { opacity: 1; }
          }
          `}
        </style>
      </div>
    );
  };

  const selectedDeviceInfo = devices.find(d => d.id === selectedDevice);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>设备状态监控</h2>
        <Space>
          <span>自动刷新:</span>
          <Switch checked={autoRefresh} onChange={setAutoRefresh} />
          <Button 
            type="primary" 
            icon={<ReloadOutlined />}
            onClick={handleRefreshStatus}
          >
            手动刷新
          </Button>
        </Space>
      </div>
      
      {/* 统计概览 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="设备总数"
              value={deviceMetrics.totalDevices}
              prefix={<SettingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线设备"
              value={deviceMetrics.onlineDevices}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix={`/ ${deviceMetrics.totalDevices}`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
                         <Statistic
               title="系统健康度"
               value={deviceMetrics.healthScore}
               prefix={<ThunderboltOutlined />}
               suffix="%"
               valueStyle={{ color: deviceMetrics.healthScore > 80 ? '#52c41a' : '#faad14' }}
             />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均信号强度"
              value={deviceMetrics.signalStrength}
              prefix={<WifiOutlined />}
              suffix="%"
              valueStyle={{ color: deviceMetrics.signalStrength > 80 ? '#52c41a' : '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

             {/* 数据可视化 */}
       <Row gutter={16} style={{ marginBottom: 24 }}>
         <Col span={8}>
           <Card title="设备状态分布" size="small">
             <div style={{ padding: '16px 0' }}>
               {statusDistributionData.map((item, index) => (
                 <div key={index} style={{ 
                   display: 'flex', 
                   justifyContent: 'space-between', 
                   alignItems: 'center',
                   marginBottom: 12,
                   padding: '8px 12px',
                   background: '#f5f5f5',
                   borderRadius: 6,
                   borderLeft: `4px solid ${item.color}`
                 }}>
                   <Space>
                     <div style={{ 
                       width: 12, 
                       height: 12, 
                       borderRadius: '50%', 
                       backgroundColor: item.color 
                     }} />
                     <span>{item.type}</span>
                   </Space>
                   <span style={{ fontWeight: 'bold', color: item.color }}>
                     {item.value}台
                   </span>
                 </div>
               ))}
             </div>
           </Card>
         </Col>
         <Col span={16}>
           <Card title="设备健康状态概览" size="small">
             <Row gutter={16} style={{ padding: '16px 0' }}>
               <Col span={6}>
                 <div style={{ textAlign: 'center' }}>
                   <Progress
                     type="circle"
                     percent={deviceMetrics.healthScore}
                     size={80}
                     strokeColor="#52c41a"
                     format={percent => (
                       <span style={{ fontSize: 12 }}>
                         {percent}%<br/>
                         <span style={{ fontSize: 10, color: '#666' }}>健康度</span>
                       </span>
                     )}
                   />
                 </div>
               </Col>
               <Col span={6}>
                 <div style={{ textAlign: 'center' }}>
                   <Progress
                     type="circle"
                     percent={deviceMetrics.signalStrength}
                     size={80}
                     strokeColor="#1890ff"
                     format={percent => (
                       <span style={{ fontSize: 12 }}>
                         {percent}%<br/>
                         <span style={{ fontSize: 10, color: '#666' }}>信号强度</span>
                       </span>
                     )}
                   />
                 </div>
               </Col>
               <Col span={6}>
                 <div style={{ textAlign: 'center' }}>
                   <Progress
                     type="circle"
                     percent={deviceMetrics.avgBattery}
                     size={80}
                     strokeColor="#faad14"
                     format={percent => (
                       <span style={{ fontSize: 12 }}>
                         {percent}%<br/>
                         <span style={{ fontSize: 10, color: '#666' }}>平均电量</span>
                       </span>
                     )}
                   />
                 </div>
               </Col>
               <Col span={6}>
                 <div style={{ textAlign: 'center' }}>
                   <Progress
                     type="circle"
                     percent={Math.round((deviceMetrics.onlineDevices / deviceMetrics.totalDevices) * 100)}
                     size={80}
                     strokeColor="#722ed1"
                     format={percent => (
                       <span style={{ fontSize: 12 }}>
                         {percent}%<br/>
                         <span style={{ fontSize: 10, color: '#666' }}>在线率</span>
                       </span>
                     )}
                   />
                 </div>
               </Col>
             </Row>
           </Card>
         </Col>
       </Row>

      {/* 搜索和筛选 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Search
              placeholder="搜索设备名称或位置"
              allowClear
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
          </Col>
          <Col>
          <Space>
            <Select
                placeholder="设备类型"
              style={{ width: 120 }}
              allowClear
                onChange={setDeviceTypeFilter}
            >
              <Option value="camera">摄像头</Option>
              <Option value="phone">对讲机</Option>
              <Option value="sensor">传感器</Option>
              <Option value="controller">控制器</Option>
            </Select>
              <Select
                placeholder="运行状态"
                style={{ width: 120 }}
                allowClear
                onChange={setStatusFilter}
            >
                <Option value="online">在线</Option>
                <Option value="offline">离线</Option>
                <Option value="warning">告警</Option>
              </Select>
              <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
                <Radio.Button value="table">列表视图</Radio.Button>
                <Radio.Button value="map">地图视图</Radio.Button>
              </Radio.Group>
          </Space>
          </Col>
        </Row>
      </Card>

      {/* 设备列表或地图视图 */}
      <Card title={`设备${viewMode === 'table' ? '状态列表' : '位置分布'} (${filteredDevices.length})`}>
        {viewMode === 'table' ? (
        <Table
            dataSource={filteredDevices}
          columns={columns}
            pagination={{ 
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
            }}
            scroll={{ x: 1400 }}
            size="small"
          />
        ) : (
          <MapView />
        )}
      </Card>

      {/* 视频查看模态框 */}
      <Modal
        title={
          <Space>
            <VideoCameraOutlined />
            {`实时视频监控 - ${selectedDeviceInfo?.name}`}
          </Space>
        }
        visible={isVideoModalVisible}
        onCancel={() => setIsVideoModalVisible(false)}
        width={900}
        footer={null}
      >
        <div style={{ 
          height: 480, 
          background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderRadius: 8,
          position: 'relative'
        }}>
          <div style={{ color: 'white', textAlign: 'center' }}>
            <VideoCameraOutlined style={{ fontSize: 64, marginBottom: 20, color: '#1890ff' }} />
            <div style={{ fontSize: 18, marginBottom: 8 }}>高清视频实时回传</div>
            <div style={{ marginTop: 8, fontSize: 14, opacity: 0.8 }}>
              {selectedDeviceInfo?.location}
            </div>
            <div style={{ marginTop: 16 }}>
              <Tag color="green">5G网络</Tag>
              <Tag color="blue">低时延</Tag>
              <Tag color="purple">1080P高清</Tag>
              <Tag color="orange">夜视功能</Tag>
            </div>
          </div>
          
          {/* 视频状态指示器 */}
          <div style={{ 
            position: 'absolute', 
            top: 16, 
            right: 16,
            background: 'rgba(0,0,0,0.7)',
            padding: '8px 12px',
            borderRadius: 4,
            color: 'white',
            fontSize: 12
          }}>
            <Badge status="processing" />
            实时直播中
          </div>
        </div>
        
        {/* 视频控制栏 */}
        <div style={{ 
          marginTop: 16, 
          padding: '12px 16px',
          background: '#f5f5f5',
          borderRadius: 8,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Space>
            <Button icon={<PlayCircleOutlined />}>播放</Button>
            <Button icon={<PauseCircleOutlined />}>暂停</Button>
            <Button icon={<CameraOutlined />}>截图</Button>
            <Button icon={<DownloadOutlined />}>录制</Button>
          </Space>
          <Space>
            <span style={{ fontSize: 12, color: '#666' }}>
              分辨率: 1920×1080 | 帧率: 30fps | 码率: 2.5Mbps
            </span>
            <Button icon={<FullscreenOutlined />}>全屏</Button>
          </Space>
        </div>
      </Modal>
    </div>
  );
};

export default StatusMonitor; 