

import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Space, 
  Select, 
  Slider, 
  Form, 
  Input, 
  Upload, 
  message,
  Progress,
  Tag,
  Divider,
  Alert,
  List,
  Avatar,
  Typography,
  Switch,
  Tooltip,
  Badge,
  Modal,
  Drawer,
  Tabs,
  Statistic,
  Timeline,
  Descriptions
} from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  UploadOutlined,
  AudioOutlined,
  VideoCameraOutlined,
  SoundOutlined,
  PartitionOutlined,
  ClockCircleOutlined,
  UserOutlined,
  GlobalOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  SaveOutlined,
  FileTextOutlined,
  BellOutlined,
  ThunderboltOutlined,
  EyeOutlined,
  BarChartOutlined,
  WifiOutlined,
  SignalFilled
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { broadcastZones, presetTemplates, broadcastHistory as initialBroadcastHistory } from '../data/broadcastData';
import ReactECharts from 'echarts-for-react';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

/**
 * 实时广播页面
 * 支持音频、语音、视频的实时播放和区域控制
 */
const RealTimeBroadcast: React.FC = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [broadcastType, setBroadcastType] = useState('audio');
  const [broadcastName, setBroadcastName] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [broadcastHistory, setBroadcastHistory] = useState<any[]>([]);
  const [isEmergency, setIsEmergency] = useState(false);
  const [priority, setPriority] = useState('normal');
  const [autoRepeat, setAutoRepeat] = useState(false);
  const [repeatCount, setRepeatCount] = useState(1);
  const [showDeviceStatus, setShowDeviceStatus] = useState(false);
  const [showPresetTemplates, setShowPresetTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  // 使用统一的广播区域数据
  const zonesForDisplay = broadcastZones.map(zone => ({
    key: zone.key,
    name: zone.name,
    devices: zone.deviceCount,
    status: zone.status === 'active' ? 'online' : 'offline',
    signal: zone.signal,
    volume: zone.volume
  }));

  // 使用统一的预设广播模板
  const templatesForDisplay = presetTemplates;

  // 使用统一的广播历史数据
  useEffect(() => {
    setBroadcastHistory(initialBroadcastHistory);
  }, []);

  // 处理文件上传
  const handleFileUpload = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`);
      setUploadedFiles([...uploadedFiles, info.file]);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  };

  // 处理区域选择
  const handleZoneChange = (values: string[]) => {
    setSelectedZones(values);
  };

  // 处理播放控制
  const handlePlay = () => {
    if (selectedZones.length === 0) {
      message.warning('请选择广播区域');
      return;
    }
    if (!broadcastName.trim()) {
      message.warning('请输入广播名称');
      return;
    }

    setIsPlaying(true);
    // 模拟播放进度
    intervalRef.current = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= duration) {
          handleStop();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    message.success('广播开始播放');
  };

  // 处理暂停
  const handlePause = () => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    message.info('广播已暂停');
  };

  // 处理停止
  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    message.info('广播已停止');
  };

  // 处理音量变化
  const handleVolumeChange = (value: number) => {
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
    }
  };

  // 处理语音合成
  const handleTextToSpeech = () => {
    if (!broadcastContent.trim()) {
      message.warning('请输入要播放的文本内容');
      return;
    }
    message.success('语音合成完成，可以开始播放');
  };

  // 应用预设模板
  const applyTemplate = (template: any) => {
    setBroadcastName(template.name);
    setBroadcastContent(template.content);
    setBroadcastType(template.type);
    setSelectedZones(template.zones);
    setVolume(template.volume);
    setPriority(template.priority);
    setShowPresetTemplates(false);
    message.success(`已应用模板：${template.name}`);
  };

  // 紧急广播确认
  const confirmEmergencyBroadcast = () => {
    if (isEmergency) {
      Modal.confirm({
        title: '紧急广播确认',
        content: '您即将发送紧急广播，这将覆盖所有其他广播。确定继续吗？',
        okText: '确认发送',
        cancelText: '取消',
        okType: 'danger',
        onOk: () => {
          message.success('紧急广播已发送');
        }
      });
    }
  };

  // 获取状态标签颜色
  const getStatusColor = (status: string) => {
    const statusMap: { [key: string]: string } = {
      playing: 'green',
      completed: 'blue',
      failed: 'red'
    };
    return statusMap[status] || 'default';
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      playing: '播放中',
      completed: '已完成',
      failed: '失败'
    };
    return statusMap[status] || status;
  };

  // 获取优先级标签
  const getPriorityTag = (priority: string) => {
    const priorityMap: { [key: string]: { color: string; text: string } } = {
      emergency: { color: 'red', text: '紧急' },
      high: { color: 'orange', text: '高' },
      normal: { color: 'blue', text: '普通' },
      low: { color: 'green', text: '低' }
    };
    return priorityMap[priority] || { color: 'default', text: '普通' };
  };

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 计算设备在线率（以 active 为在线）
  const deviceOnlineRate = (broadcastZones.filter(z => z.status === 'active').length / broadcastZones.length * 100).toFixed(1);

  return (
    <div className="real-time-broadcast">
      <div style={{ marginBottom: 24 }}>
        <Button 
          type="link" 
          icon={<PartitionOutlined />} 
          onClick={() => navigate('/broadcast-system')}
          style={{ padding: 0, marginBottom: '16px' }}
        >
          返回广播系统
        </Button>
        <Title level={2}>
          <VideoCameraOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          实时广播
        </Title>
        <Text type="secondary">
          立即向指定区域播放音频、语音或视频内容，支持紧急广播和预设模板
        </Text>
      </div>

      {/* 系统状态概览 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card style={{ textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Statistic
              title={<Text style={{ color: 'white' }}>在线分区</Text>}
              value={broadcastZones.filter(z => z.status === 'active').length}
              suffix={<Text style={{ color: 'white' }}>个</Text>}
              valueStyle={{ color: 'white', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <Statistic
              title={<Text style={{ color: 'white' }}>总设备数</Text>}
              value={broadcastZones.reduce((sum, z) => sum + z.deviceCount, 0)}
              suffix={<Text style={{ color: 'white' }}>台</Text>}
              valueStyle={{ color: 'white', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ textAlign: 'center', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <Statistic
              title={<Text style={{ color: 'white' }}>设备在线率</Text>}
              value={deviceOnlineRate}
              suffix={<Text style={{ color: 'white' }}>%</Text>}
              valueStyle={{ color: 'white', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ textAlign: 'center', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <Statistic
              title={<Text style={{ color: 'white' }}>当前广播</Text>}
              value={broadcastHistory.filter(h => h.status === 'playing').length}
              suffix={<Text style={{ color: 'white' }}>个</Text>}
              valueStyle={{ color: 'white', fontSize: '24px' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        {/* 左侧：广播控制面板 */}
        <Col span={16}>
          {/* 广播类型选择 */}
          <Card 
            title={
              <Space>
                <BarChartOutlined style={{ color: '#1890ff' }} />
                广播类型
              </Space>
            } 
            style={{ marginBottom: 24 }}
            extra={
              <Space>
                <Button 
                  type="primary" 
                  icon={<FileTextOutlined />}
                  onClick={() => setShowPresetTemplates(true)}
                >
                  预设模板
                </Button>
                <Button 
                  icon={<SettingOutlined />}
                  onClick={() => setShowDeviceStatus(true)}
                >
                  设备状态
                </Button>
              </Space>
            }
          >
            <Row gutter={16}>
              <Col span={8}>
                <Card 
                  hoverable
                  style={{ 
                    textAlign: 'center', 
                    border: broadcastType === 'audio' ? '2px solid #1890ff' : '1px solid #d9d9d9',
                    cursor: 'pointer',
                    borderRadius: 12
                  }}
                  onClick={() => setBroadcastType('audio')}
                >
                  <AudioOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '8px' }} />
                  <div>音频文件</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>MP3, WAV, AAC</Text>
                </Card>
              </Col>
              <Col span={8}>
                <Card 
                  hoverable
                  style={{ 
                    textAlign: 'center', 
                    border: broadcastType === 'voice' ? '2px solid #52c41a' : '1px solid #d9d9d9',
                    cursor: 'pointer',
                    borderRadius: 12
                  }}
                  onClick={() => setBroadcastType('voice')}
                >
                  <SoundOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '8px' }} />
                  <div>语音合成</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>TTS 技术</Text>
                </Card>
              </Col>
              <Col span={8}>
                <Card 
                  hoverable
                  style={{ 
                    textAlign: 'center', 
                    border: broadcastType === 'video' ? '2px solid #722ed1' : '1px solid #d9d9d9',
                    cursor: 'pointer',
                    borderRadius: 12
                  }}
                  onClick={() => setBroadcastType('video')}
                >
                  <VideoCameraOutlined style={{ fontSize: '32px', color: '#722ed1', marginBottom: '8px' }} />
                  <div>视频文件</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>MP4, AVI, MOV</Text>
                </Card>
              </Col>
            </Row>
          </Card>

          {/* 广播内容设置 */}
          <Card 
            title={
              <Space>
                <FileTextOutlined style={{ color: '#52c41a' }} />
                广播内容
              </Space>
            } 
            style={{ marginBottom: 24 }}
          >
            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="广播名称" required>
                    <Input 
                      placeholder="请输入广播名称"
                      value={broadcastName}
                      onChange={(e) => setBroadcastName(e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="优先级">
                    <Select
                      value={priority}
                      onChange={setPriority}
                      style={{ width: '100%' }}
                    >
                      <Option value="low">低</Option>
                      <Option value="normal">普通</Option>
                      <Option value="high">高</Option>
                      <Option value="emergency">紧急</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="紧急广播">
                    <Switch 
                      checked={isEmergency}
                      onChange={setIsEmergency}
                      checkedChildren="是"
                      unCheckedChildren="否"
                    />
                    <Text type="secondary" style={{ marginLeft: 8 }}>
                      紧急广播将覆盖其他广播
                    </Text>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="自动重复">
                    <Switch 
                      checked={autoRepeat}
                      onChange={setAutoRepeat}
                      checkedChildren="是"
                      unCheckedChildren="否"
                    />
                    {autoRepeat && (
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        value={repeatCount}
                        onChange={(e) => setRepeatCount(Number(e.target.value))}
                        style={{ width: 80, marginLeft: 8 }}
                        suffix="次"
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>

              {broadcastType === 'audio' && (
                <Form.Item label="音频文件" required>
                  <Upload
                    name="file"
                    action="/api/upload"
                    onChange={handleFileUpload}
                    accept=".mp3,.wav,.aac"
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>选择音频文件</Button>
                  </Upload>
                  <Text type="secondary">支持 MP3、WAV、AAC 格式，最大文件大小 50MB</Text>
                </Form.Item>
              )}

              {broadcastType === 'voice' && (
                <Form.Item label="文本内容" required>
                  <TextArea 
                    rows={4}
                    placeholder="请输入要播放的文本内容"
                    value={broadcastContent}
                    onChange={(e) => setBroadcastContent(e.target.value)}
                  />
                  <Button 
                    type="primary" 
                    icon={<SoundOutlined />} 
                    onClick={handleTextToSpeech}
                    style={{ marginTop: '8px' }}
                  >
                    语音合成
                  </Button>
                </Form.Item>
              )}

              {broadcastType === 'video' && (
                <Form.Item label="视频文件" required>
                  <Upload
                    name="file"
                    action="/api/upload"
                    onChange={handleFileUpload}
                    accept=".mp4,.avi,.mov"
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>选择视频文件</Button>
                  </Upload>
                  <Text type="secondary">支持 MP4、AVI、MOV 格式，最大文件大小 200MB</Text>
                </Form.Item>
              )}
            </Form>
          </Card>

          {/* 播放控制 */}
          <Card 
            title={
              <Space>
                <ThunderboltOutlined style={{ color: '#fa8c16' }} />
                播放控制
              </Space>
            } 
            style={{ marginBottom: 24 }}
          >
            {/* 播放按钮控制 */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Space size="large">
                <Button 
                  type="primary" 
                  icon={<PlayCircleOutlined />} 
                  size="large"
                  onClick={handlePlay}
                  disabled={isPlaying}
                  style={{ 
                    minWidth: 100, 
                    height: 48,
                    fontSize: '16px',
                    borderRadius: '8px'
                  }}
                >
                  播放
                </Button>
                <Button 
                  icon={<PauseCircleOutlined />} 
                  size="large"
                  onClick={handlePause}
                  disabled={!isPlaying}
                  style={{ 
                    minWidth: 100, 
                    height: 48,
                    fontSize: '16px',
                    borderRadius: '8px'
                  }}
                >
                  暂停
                </Button>
                <Button 
                  icon={<StopOutlined />} 
                  size="large"
                  onClick={handleStop}
                  disabled={!isPlaying}
                  style={{ 
                    minWidth: 100, 
                    height: 48,
                    fontSize: '16px',
                    borderRadius: '8px'
                  }}
                >
                  停止
                </Button>
              </Space>
            </div>

            {/* 播放进度和音量控制 */}
            <Row gutter={24}>
              <Col span={16}>
                <div style={{ marginBottom: '16px' }}>
                  <Text strong>播放进度: {formatTime(currentTime)} / {formatTime(duration)}</Text>
                </div>
                <Progress 
                  percent={duration > 0 ? (currentTime / duration) * 100 : 0} 
                  showInfo={false}
                  strokeColor="#1890ff"
                  strokeWidth={8}
                  style={{ marginBottom: '8px' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>开始</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>结束</Text>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <SoundOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                    <Text strong>音量控制</Text>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <Text style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
                      {volume}%
                    </Text>
                  </div>
                  <Slider
                    value={volume}
                    onChange={handleVolumeChange}
                    min={0}
                    max={100}
                    vertical
                    style={{ height: '120px' }}
                    trackStyle={{ backgroundColor: '#1890ff' }}
                    handleStyle={{ borderColor: '#1890ff' }}
                  />
                  <div style={{ marginTop: '8px' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>静音</Text>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 右侧：区域选择和状态信息 */}
        <Col span={8}>
          {/* 广播区域选择 */}
          <Card 
            title={
              <Space>
                <PartitionOutlined style={{ color: '#722ed1' }} />
                广播区域
              </Space>
            } 
            style={{ marginBottom: 24 }}
          >
            <Select
              mode="multiple"
              placeholder="请选择广播区域"
              value={selectedZones}
              onChange={handleZoneChange}
              style={{ width: '100%', marginBottom: '16px' }}
            >
              {broadcastZones.map(zone => (
                <Option key={zone.key} value={zone.key}>
                  <Space>
                    <span>{zone.name}</span>
                    <Tag color={zone.status === 'online' ? 'green' : 'red'}>
                      {zone.status === 'online' ? '在线' : '离线'}
                    </Tag>
                    <span>({zone.deviceCount}台设备)</span>
                  </Space>
                </Option>
              ))}
            </Select>
            
            <Alert
              message={`已选择 ${selectedZones.length} 个区域`}
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Button 
              type="primary" 
              block 
              icon={<EyeOutlined />}
              onClick={() => setShowDeviceStatus(true)}
            >
              查看设备详情
            </Button>
          </Card>

          {/* 系统状态 */}
          <Card 
            title={
              <Space>
                <GlobalOutlined style={{ color: '#52c41a' }} />
                系统状态
              </Space>
            }
          >
            <List size="small">
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<GlobalOutlined />} style={{ backgroundColor: '#52c41a' }} />}
                  title="广播系统"
                  description="在线运行中"
                />
                <Tag color="green">正常</Tag>
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<PartitionOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                  title="活跃分区"
                  description={`${broadcastZones.filter(z => z.status === 'online').length} 个分区在线`}
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<AudioOutlined />} style={{ backgroundColor: '#722ed1' }} />}
                  title="广播设备"
                  description={`${broadcastZones.reduce((sum, z) => sum + z.deviceCount, 0)} 台设备`}
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<WifiOutlined />} style={{ backgroundColor: '#fa8c16' }} />}
                  title="信号强度"
                  description="平均 89%"
                />
              </List.Item>
            </List>
          </Card>
        </Col>
      </Row>

      {/* 广播历史记录 */}
      <Card 
        title={
          <Space>
            <ClockCircleOutlined style={{ color: '#13c2c2' }} />
            广播历史记录
          </Space>
        } 
        style={{ marginTop: 24 }}
      >
        <Tabs defaultActiveKey="all" type="card">
          <TabPane tab="全部记录" key="all">
            <List
              dataSource={broadcastHistory}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button key="replay" type="link" size="small">重新播放</Button>,
                    <Button key="details" type="link" size="small">详情</Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={
                          item.type === 'audio' ? <AudioOutlined /> :
                          item.type === 'voice' ? <SoundOutlined /> :
                          <VideoCameraOutlined />
                        } 
                        style={{ backgroundColor: '#1890ff' }} 
                      />
                    }
                    title={
                      <Space>
                        {item.name}
                        <Tag color={getStatusColor(item.status)}>
                          {getStatusText(item.status)}
                        </Tag>
                        <Tag color={getPriorityTag(item.priority).color}>
                          {getPriorityTag(item.priority).text}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="small">
                        <div>区域: {item.zones.join(', ')}</div>
                        <div>时间: {item.startTime} - {item.endTime || '进行中'}</div>
                        <div>时长: {item.duration || '计算中'} | 音量: {item.volume}%</div>
                        <div>操作员: {item.operator}</div>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </TabPane>

          <TabPane tab="进行中" key="playing">
            <List
              dataSource={broadcastHistory.filter(item => item.status === 'playing')}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button key="pause" type="link" size="small" danger>暂停</Button>,
                    <Button key="stop" type="link" size="small" danger>停止</Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={
                          item.type === 'audio' ? <AudioOutlined /> :
                          item.type === 'voice' ? <SoundOutlined /> :
                          <VideoCameraOutlined />
                        } 
                        style={{ backgroundColor: '#52c41a' }} 
                      />
                    }
                    title={
                      <Space>
                        {item.name}
                        <Tag color="green">播放中</Tag>
                        <Tag color={getPriorityTag(item.priority).color}>
                          {getPriorityTag(item.priority).text}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="small">
                        <div>区域: {item.zones.join(', ')}</div>
                        <div>开始时间: {item.startTime}</div>
                        <div>音量: {item.volume}%</div>
                        <div>操作员: {item.operator}</div>
                      </Space>
                    }
                  />
                </List.Item>
              )}
              locale={{
                emptyText: (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <AudioOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                    <div style={{ marginTop: '16px', color: '#999' }}>
                      暂无进行中的广播
                    </div>
                  </div>
                )
              }}
            />
          </TabPane>

          <TabPane tab="已完成" key="completed">
            <List
              dataSource={broadcastHistory.filter(item => item.status === 'completed')}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button key="replay" type="link" size="small">重新播放</Button>,
                    <Button key="details" type="link" size="small">详情</Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={
                          item.type === 'audio' ? <AudioOutlined /> :
                          item.type === 'voice' ? <SoundOutlined /> :
                          <VideoCameraOutlined />
                        } 
                        style={{ backgroundColor: '#1890ff' }} 
                      />
                    }
                    title={
                      <Space>
                        {item.name}
                        <Tag color="blue">已完成</Tag>
                        <Tag color={getPriorityTag(item.priority).color}>
                          {getPriorityTag(item.priority).text}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="small">
                        <div>区域: {item.zones.join(', ')}</div>
                        <div>时间: {item.startTime} - {item.endTime}</div>
                        <div>时长: {item.duration} | 音量: {item.volume}%</div>
                        <div>操作员: {item.operator}</div>
                      </Space>
                    }
                  />
                </List.Item>
              )}
              locale={{
                emptyText: (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <CheckCircleOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                    <div style={{ marginTop: '16px', color: '#999' }}>
                      暂无已完成的广播记录
                    </div>
                  </div>
                )
              }}
            />
          </TabPane>

          <TabPane tab="紧急广播" key="emergency">
            <List
              dataSource={broadcastHistory.filter(item => item.priority === 'emergency')}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button key="replay" type="link" size="small">重新播放</Button>,
                    <Button key="details" type="link" size="small">详情</Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={<ExclamationCircleOutlined />}
                        style={{ backgroundColor: '#ff4d4f' }} 
                      />
                    }
                    title={
                      <Space>
                        {item.name}
                        <Tag color="red">紧急</Tag>
                        <Tag color={getStatusColor(item.status)}>
                          {getStatusText(item.status)}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="small">
                        <div>区域: {item.zones.join(', ')}</div>
                        <div>时间: {item.startTime} - {item.endTime || '进行中'}</div>
                        <div>时长: {item.duration || '计算中'} | 音量: {item.volume}%</div>
                        <div>操作员: {item.operator}</div>
                      </Space>
                    }
                  />
                </List.Item>
              )}
              locale={{
                emptyText: (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <ExclamationCircleOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                    <div style={{ marginTop: '16px', color: '#999' }}>
                      暂无紧急广播记录
                    </div>
                  </div>
                )
              }}
            />
          </TabPane>

          <TabPane tab="统计信息" key="statistics">
            <Row gutter={[24, 24]} style={{ padding: '24px 0' }}>
              <Col span={6}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="总广播次数"
                    value={broadcastHistory.length}
                    suffix="次"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="进行中"
                    value={broadcastHistory.filter(item => item.status === 'playing').length}
                    suffix="个"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="已完成"
                    value={broadcastHistory.filter(item => item.status === 'completed').length}
                    suffix="个"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="紧急广播"
                    value={broadcastHistory.filter(item => item.priority === 'emergency').length}
                    suffix="次"
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Card size="small" title="广播类型分布">
                  <ReactECharts
                    option={{
                      tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                      },
                      legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['音频广播', '语音广播', '视频广播']
                      },
                      series: [
                        {
                          name: '广播类型',
                          type: 'pie',
                          radius: ['40%', '70%'],
                          avoidLabelOverlap: false,
                          label: {
                            show: false,
                            position: 'center'
                          },
                          emphasis: {
                            label: {
                              show: true,
                              fontSize: '18',
                              fontWeight: 'bold'
                            }
                          },
                          labelLine: {
                            show: false
                          },
                          data: [
                            { value: 45, name: '音频广播', itemStyle: { color: '#1890ff' } },
                            { value: 35, name: '语音广播', itemStyle: { color: '#52c41a' } },
                            { value: 20, name: '视频广播', itemStyle: { color: '#722ed1' } }
                          ]
                        }
                      ]
                    }}
                    style={{ height: '200px' }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="优先级分布">
                  <ReactECharts
                    option={{
                      tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                      },
                      legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['高优先级', '普通优先级', '低优先级']
                      },
                      series: [
                        {
                          name: '优先级',
                          type: 'pie',
                          radius: ['40%', '70%'],
                          avoidLabelOverlap: false,
                          label: {
                            show: false,
                            position: 'center'
                          },
                          emphasis: {
                            label: {
                              show: true,
                              fontSize: '18',
                              fontWeight: 'bold'
                            }
                          },
                          labelLine: {
                            show: false
                          },
                          data: [
                            { value: 25, name: '高优先级', itemStyle: { color: '#ff4d4f' } },
                            { value: 60, name: '普通优先级', itemStyle: { color: '#faad14' } },
                            { value: 15, name: '低优先级', itemStyle: { color: '#52c41a' } }
                          ]
                        }
                      ]
                    }}
                    style={{ height: '200px' }}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* 预设模板抽屉 */}
      <Drawer
        title="预设广播模板"
        placement="right"
        width={500}
        onClose={() => setShowPresetTemplates(false)}
        visible={showPresetTemplates}
      >
        <List
          dataSource={presetTemplates}
          renderItem={(template) => (
            <List.Item
              actions={[
                <Button 
                  key="apply" 
                  type="primary" 
                  size="small"
                  onClick={() => applyTemplate(template)}
                >
                  应用
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar 
                    icon={
                      template.type === 'audio' ? <AudioOutlined /> :
                      template.type === 'voice' ? <SoundOutlined /> :
                      <VideoCameraOutlined />
                    } 
                    style={{ backgroundColor: '#1890ff' }} 
                  />
                }
                title={
                  <Space>
                    {template.name}
                    <Tag color={getPriorityTag(template.priority).color}>
                      {getPriorityTag(template.priority).text}
                    </Tag>
                  </Space>
                }
                description={
                  <div>
                    <div>{template.content}</div>
                    <div style={{ marginTop: 8 }}>
                      <Text type="secondary">区域: {template.zones.map(key => 
                        broadcastZones.find(z => z.key === key)?.name
                      ).join(', ')}</Text>
                    </div>
                    <div>
                      <Text type="secondary">音量: {template.volume}%</Text>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Drawer>

      {/* 设备状态抽屉 */}
      <Drawer
        title="设备状态监控"
        placement="right"
        width={600}
        onClose={() => setShowDeviceStatus(false)}
        visible={showDeviceStatus}
      >
        <Tabs defaultActiveKey="overview">
          <TabPane tab="概览" key="overview">
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="在线分区"
                    value={broadcastZones.filter(z => z.status === 'online').length}
                    suffix={`/ ${broadcastZones.length}`}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="总设备数"
                    value={broadcastZones.reduce((sum, z) => sum + z.deviceCount, 0)}
                    suffix="台"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
            </Row>
            
            <List
              dataSource={broadcastZones}
              renderItem={(zone) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Badge 
                        dot 
                        color={zone.status === 'online' ? 'green' : 'red'}
                      >
                        <Avatar 
                          icon={<PartitionOutlined />}
                          style={{ backgroundColor: zone.status === 'online' ? '#52c41a' : '#ff4d4f' }}
                        />
                      </Badge>
                    }
                    title={
                      <Space>
                        {zone.name}
                        <Tag color={zone.status === 'online' ? 'green' : 'red'}>
                          {zone.status === 'online' ? '在线' : '离线'}
                        </Tag>
                      </Space>
                    }
                    description={
                      <div>
                        <div>设备数量: {zone.deviceCount}台</div>
                        {zone.status === 'online' && (
                          <>
                            <div>信号强度: {zone.signal}%</div>
                            <div>当前音量: {zone.volume}%</div>
                          </>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </TabPane>
          
          <TabPane tab="实时监控" key="monitor">
            <Alert
              message="实时监控功能"
              description="显示设备实时状态、信号强度、音量等信息"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Card size="small" title="信号强度分布">
                  <ReactECharts
                    option={{
                      tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                          type: 'shadow'
                        }
                      },
                      xAxis: {
                        type: 'category',
                        data: ['前厅', '餐厅', '客房', '花园', '停车场']
                      },
                      yAxis: {
                        type: 'value',
                        name: '信号强度 (%)'
                      },
                      series: [
                        {
                          name: '信号强度',
                          type: 'bar',
                          data: [85, 92, 78, 65, 88],
                          itemStyle: {
                            color: '#1890ff'
                          }
                        }
                      ]
                    }}
                    style={{ height: '200px' }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="音量分布">
                  <ReactECharts
                    option={{
                      tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                      },
                      legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['低音量', '中音量', '高音量']
                      },
                      series: [
                        {
                          name: '音量分布',
                          type: 'pie',
                          radius: '50%',
                          data: [
                            { value: 30, name: '低音量 (0-40%)', itemStyle: { color: '#52c41a' } },
                            { value: 50, name: '中音量 (40-80%)', itemStyle: { color: '#faad14' } },
                            { value: 20, name: '高音量 (80-100%)', itemStyle: { color: '#ff4d4f' } }
                          ]
                        }
                      ]
                    }}
                    style={{ height: '200px' }}
                  />
                </Card>
              </Col>
            </Row>
            
            <Card size="small" title="设备状态趋势">
              <ReactECharts
                option={{
                  tooltip: {
                    trigger: 'axis'
                  },
                  legend: {
                    data: ['在线设备', '离线设备', '维护设备']
                  },
                  xAxis: {
                    type: 'category',
                    data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']
                  },
                  yAxis: {
                    type: 'value',
                    name: '设备数量'
                  },
                  series: [
                    {
                      name: '在线设备',
                      type: 'line',
                      data: [45, 42, 48, 52, 55, 58, 50],
                      itemStyle: { color: '#52c41a' }
                    },
                    {
                      name: '离线设备',
                      type: 'line',
                      data: [5, 8, 2, 0, 0, 0, 0],
                      itemStyle: { color: '#ff4d4f' }
                    },
                    {
                      name: '维护设备',
                      type: 'line',
                      data: [0, 0, 0, 0, 0, 0, 0],
                      itemStyle: { color: '#faad14' }
                    }
                  ]
                }}
                style={{ height: '200px' }}
              />
            </Card>
          </TabPane>
        </Tabs>
      </Drawer>

      {/* 隐藏的音频元素 */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
};

export default RealTimeBroadcast;
