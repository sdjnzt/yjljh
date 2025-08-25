import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Select,
  Slider,
  Space,
  Typography,
  Tabs,
  Table,
  Tag,
  Badge,
  Tooltip,
  Modal,
  Form,
  Input,
  Switch,
  message,
  Alert,
  Statistic,
  List,
  Avatar
} from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  FullscreenOutlined,
  SettingOutlined,
  CameraOutlined,
  VideoCameraOutlined,
  EyeOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  StopOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// 隐藏视频控制条的CSS样式
const videoStyles = `
  .no-controls::-webkit-media-controls,
  .no-controls::-webkit-media-controls-panel,
  .no-controls::-webkit-media-controls-play-button,
  .no-controls::-webkit-media-controls-timeline,
  .no-controls::-webkit-media-controls-current-time-display,
  .no-controls::-webkit-media-controls-time-remaining-display,
  .no-controls::-webkit-media-controls-volume-slider,
  .no-controls::-webkit-media-controls-mute-button,
  .no-controls::-webkit-media-controls-fullscreen-button {
    display: none !important;
  }
  
  .no-controls::-webkit-media-controls-enclosure {
    display: none !important;
  }
`;

interface Camera {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  resolution: string;
  fps: number;
  bitrate: number;
  lastUpdate: string;
  streamUrl: string;
  isRecording: boolean;
  isLive: boolean;
}

interface VideoLayout {
  id: string;
  name: string;
  layout: '1x1' | '2x2' | '3x3' | '4x4' | 'custom';
  cameras: string[];
  isActive: boolean;
}

const VideoMonitor: React.FC = () => {
  // 监控画面资源池
  const monitorSources = [
    process.env.PUBLIC_URL + '/images/monitor/1.mp4',
    process.env.PUBLIC_URL + '/images/monitor/2.mp4',
    process.env.PUBLIC_URL + '/images/monitor/building.png',
    process.env.PUBLIC_URL + '/images/monitor/gate.png'
  ];
  const cameraNames = ['北门', '大门入口', '停车场', '消防通道', '电梯间', '走廊1', '走廊2', '餐厅', '会议室', '前台', '后门', '仓库', '厨房', '楼梯口', '休息区', '健身房', '花园', '监控室', '配电房', '消防通道'];
  const locations = ['北门', '一楼大门', '地上停车场', '二楼消费通道', '一楼电梯', '二楼走廊', '三楼走廊', '餐厅', '会议室', '前台', '后门', '仓库', '厨房', '楼梯口', '休息区', '健身房', '花园', '监控室', '配电房', '消防通道'];
  const statusList = ['online', 'online', 'online', 'online', 'online', 'online', 'online', 'online', 'online', 'offline', 'maintenance'] as const;

  const [cameras, setCameras] = useState<Camera[]>(
    Array.from({ length: 50 }, (_, i) => ({
      id: `${i + 1}`,
      name: cameraNames[i % cameraNames.length],
      location: locations[i % locations.length],
      status: statusList[i % statusList.length],
      resolution: '1920x1080',
      fps: 25,
      bitrate: 2048,
      lastUpdate: new Date().toLocaleString('zh-CN'),
      streamUrl: monitorSources[i % monitorSources.length],
      isRecording: i % 3 === 0,
      isLive: i % 2 === 0
    }))
  );

  const [layouts, setLayouts] = useState<VideoLayout[]>([
    {
      id: '1',
      name: '四画面布局',
      layout: '2x2',
      cameras: ['1', '2', '3', '4'],
      isActive: true
    },
    {
      id: '2',
      name: '单画面布局',
      layout: '1x1',
      cameras: ['1'],
      isActive: false
    }
  ]);

  const [currentLayout, setCurrentLayout] = useState<VideoLayout>(layouts[0]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCamera, setEditingCamera] = useState<Camera | null>(null);
  const [form] = Form.useForm();
  const [isRecording, setIsRecording] = useState(false);
  const [isLive, setIsLive] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 实时更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setCameras(prevCameras => 
        prevCameras.map(camera => ({
          ...camera,
          lastUpdate: new Date().toLocaleString('zh-CN')
        }))
      );
    }, 1000); // 每秒更新一次

    return () => clearInterval(timer);
  }, []);

  // 统计数据
  const totalCameras = cameras.length;
  const onlineCameras = cameras.filter(c => c.status === 'online').length;
  const recordingCameras = cameras.filter(c => c.isRecording).length;
  const liveCameras = cameras.filter(c => c.isLive).length;

  // 视频布局渲染
  const renderVideoLayout = () => {
    const layoutMap = {
      '1x1': { cols: 1, rows: 1 },
      '2x2': { cols: 2, rows: 2 },
      '3x3': { cols: 3, rows: 3 },
      '4x4': { cols: 4, rows: 4 }
    };

    const { cols, rows } = layoutMap[currentLayout.layout as keyof typeof layoutMap] || { cols: 2, rows: 2 };
    const gridStyle = {
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      gap: '8px',
      height: '600px'
    };

    return (
      <div style={gridStyle}>
        {currentLayout.cameras.map((cameraId, index) => {
          const camera = cameras.find(c => c.id === cameraId);
          if (!camera) return null;

          return (
            <div
              key={cameraId}
              style={{
                position: 'relative',
                backgroundColor: '#000',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '2px solid #d9d9d9'
              }}
            >
              {camera.streamUrl.match(/\.mp4$/) ? (
                <video 
                  src={camera.streamUrl} 
                  autoPlay 
                  loop 
                  muted 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover'
                  }} 
                  className="no-controls"
                />
              ) : (
                <img src={camera.streamUrl} alt={camera.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
              <div
                style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              >
                {camera.name}
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  display: 'flex',
                  gap: '4px'
                }}
              >
                {camera.isRecording && (
                  <Badge status="error" text="" />
                )}
                <Badge
                  status={camera.status === 'online' ? 'success' : camera.status === 'maintenance' ? 'warning' : 'error'}
                  text=""
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '8px',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '10px'
                }}
              >
                {camera.resolution} {camera.fps}fps
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '10px'
                }}
              >
                {currentTime.toLocaleString('zh-CN')}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const handleLayoutChange = (layoutId: string) => {
    const layout = layouts.find(l => l.id === layoutId);
    if (layout) {
      setCurrentLayout(layout);
      setLayouts(layouts.map(l => ({ ...l, isActive: l.id === layoutId })));
    }
  };

  const handleCameraControl = (cameraId: string, action: 'record' | 'live') => {
    setCameras(cameras.map(c => {
      if (c.id === cameraId) {
        if (action === 'record') {
          return { ...c, isRecording: !c.isRecording };
        } else if (action === 'live') {
          return { ...c, isLive: !c.isLive };
        }
      }
      return c;
    }));
  };

  const handleAddCamera = () => {
    setEditingCamera(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditCamera = (camera: Camera) => {
    setEditingCamera(camera);
    form.setFieldsValue(camera);
    setIsModalVisible(true);
  };

  const handleDeleteCamera = (id: string) => {
    setCameras(cameras.filter(c => c.id !== id));
    message.success('删除成功');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingCamera) {
        setCameras(cameras.map(c => c.id === editingCamera.id ? { ...c, ...values } : c));
        message.success('更新成功');
      } else {
        const newCamera: Camera = {
          id: Date.now().toString(),
          ...values,
          streamUrl: `https://via.placeholder.com/400x300/1890FF/FFFFFF?text=${values.name}`,
          isRecording: false,
          isLive: true
        };
        setCameras([...cameras, newCamera]);
        message.success('添加成功');
      }
      setIsModalVisible(false);
    });
  };

  const cameraColumns = [
    {
      title: '摄像头名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      ellipsis: true
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 120,
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap = {
          online: { color: 'green', text: '在线' },
          offline: { color: 'red', text: '离线' },
          maintenance: { color: 'orange', text: '维护中' }
        };
        return <Tag color={statusMap[status as keyof typeof statusMap]?.color}>{statusMap[status as keyof typeof statusMap]?.text}</Tag>;
      }
    },
    {
      title: '分辨率',
      dataIndex: 'resolution',
      key: 'resolution',
      width: 100
    },
    {
      title: '帧率',
      dataIndex: 'fps',
      key: 'fps',
      width: 80,
      render: (fps: number) => `${fps} fps`
    },
    {
      title: '码率',
      dataIndex: 'bitrate',
      key: 'bitrate',
      width: 100,
      render: (bitrate: number) => `${bitrate} kbps`
    },
    {
      title: '录制状态',
      dataIndex: 'isRecording',
      key: 'isRecording',
      width: 100,
      render: (isRecording: boolean) => (
        <Tag color={isRecording ? 'red' : 'default'} icon={isRecording ? <PlayCircleOutlined /> : <StopOutlined />}>
          {isRecording ? '录制中' : '未录制'}
        </Tag>
      )
    },
    {
      title: '直播状态',
      dataIndex: 'isLive',
      key: 'isLive',
      width: 100,
      render: (isLive: boolean) => (
        <Tag color={isLive ? 'green' : 'default'} icon={isLive ? <VideoCameraOutlined /> : <StopOutlined />}>
          {isLive ? '直播中' : '已停止'}
        </Tag>
      )
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
      width: 160,
      ellipsis: true
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right' as const,
      render: (_: any, record: Camera) => (
        <Space>
          <Button
            type="link"
            icon={record.isRecording ? <StopOutlined /> : <PlayCircleOutlined />}
            onClick={() => handleCameraControl(record.id, 'record')}
          >
            {record.isRecording ? '停止录制' : '开始录制'}
          </Button>
          <Button
            type="link"
            icon={record.isLive ? <StopOutlined /> : <PlayCircleOutlined />}
            onClick={() => handleCameraControl(record.id, 'live')}
          >
            {record.isLive ? '停止直播' : '开始直播'}
        </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditCamera(record)}>
            编辑
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDeleteCamera(record.id)}>
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* 注入CSS样式来隐藏视频控制条 */}
      <style>{videoStyles}</style>
      <Title level={2}>视频监控直播</Title>
      <Text type="secondary">实时获取摄像头视频流，支持多画面切换、缩放，满足实时查看需求</Text>
      
      <Alert
        message="系统状态"
        description="视频监控系统运行正常，当前在线摄像头42个，支持多画面切换和实时录制功能"
        type="success"
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="总摄像头" value={totalCameras} prefix={<CameraOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="在线摄像头" value={onlineCameras} valueStyle={{ color: '#52C41A' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="录制中" value={recordingCameras} valueStyle={{ color: '#FF4D4F' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="直播中" value={liveCameras} valueStyle={{ color: '#1890FF' }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={18}>
          <Card
            title="视频监控画面"
            extra={
              <Space>
                <Select
                  value={currentLayout.id}
                  style={{ width: 150 }}
                  onChange={handleLayoutChange}
                  placeholder="选择布局"
                >
                  {layouts.map(layout => (
                    <Option key={layout.id} value={layout.id}>
                      {layout.name}
                    </Option>
                  ))}
                </Select>
                <Button icon={<FullscreenOutlined />}>全屏</Button>
                <Button icon={<DownloadOutlined />}>截图</Button>
              </Space>
            }
          >
            {renderVideoLayout()}
          </Card>
        </Col>
        <Col span={6}>
          <Card title="控制面板" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                type={isLive ? 'primary' : 'default'}
                icon={isLive ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                block
                onClick={() => setIsLive(!isLive)}
              >
                {isLive ? '停止直播' : '开始直播'}
              </Button>
              <Button
                type={isRecording ? 'primary' : 'default'}
                icon={isRecording ? <StopOutlined /> : <PlayCircleOutlined />}
                block
                onClick={() => setIsRecording(!isRecording)}
              >
                {isRecording ? '停止录制' : '开始录制'}
              </Button>
              <Button icon={<ReloadOutlined />} block>
                刷新画面
              </Button>
              <Button icon={<SettingOutlined />} block>
                系统设置
              </Button>
            </Space>
          </Card>

          <Card title="快速操作" size="small" style={{ marginTop: 16 }}>
            <List
              size="small"
              dataSource={cameras.slice(0, 4)}
              renderItem={camera => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<CameraOutlined />} />}
                    title={camera.name}
                    description={camera.location}
                  />
                  <Space>
                    <Button
                      size="small"
                      type={camera.isLive ? 'primary' : 'default'}
                      icon={<EyeOutlined />}
                      onClick={() => handleCameraControl(camera.id, 'live')}
                    >
                      {camera.isLive ? '直播' : '停止'}
                    </Button>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="1" style={{ marginTop: 24 }}>
        <TabPane tab="摄像头管理" key="1">
          <Card
            title="摄像头列表"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCamera}>
                添加摄像头
              </Button>
            }
          >
            <Table
              columns={cameraColumns}
              dataSource={cameras}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1200 }}
              size="small"
            />
          </Card>
        </TabPane>

        <TabPane tab="布局管理" key="2">
          <Card title="视频布局配置">
            <Row gutter={16}>
              {layouts.map(layout => (
                <Col span={8} key={layout.id}>
                  <Card
                    size="small"
                    title={layout.name}
                    extra={
                      <Tag color={layout.isActive ? 'green' : 'default'}>
                        {layout.isActive ? '当前' : '备用'}
                      </Tag>
                    }
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                        {layout.layout}
                      </div>
                      <Text type="secondary">
                        {layout.cameras.length} 个摄像头
                      </Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </TabPane>

        <TabPane tab="系统设置" key="3">
          <Card title="监控系统配置">
            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="默认分辨率" name="defaultResolution">
                    <Select defaultValue="1920x1080">
                      <Option value="1280x720">1280x720</Option>
                      <Option value="1920x1080">1920x1080</Option>
                      <Option value="2560x1440">2560x1440</Option>
                      <Option value="3840x2160">3840x2160</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="默认帧率" name="defaultFps">
                    <Select defaultValue="25">
                      <Option value="15">15 fps</Option>
                      <Option value="25">25 fps</Option>
                      <Option value="30">30 fps</Option>
                      <Option value="60">60 fps</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="自动录制" name="autoRecord">
                    <Switch defaultChecked />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="移动侦测" name="motionDetection">
                    <Switch defaultChecked />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                <Button type="primary">保存配置</Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
      </Tabs>

      {/* 添加/编辑摄像头模态框 */}
      <Modal
        title={editingCamera ? '编辑摄像头' : '添加摄像头'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="摄像头名称" name="name" rules={[{ required: true, message: '请输入摄像头名称' }]}>
                <Input placeholder="请输入摄像头名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="位置" name="location" rules={[{ required: true, message: '请输入位置' }]}>
                <Input placeholder="请输入位置" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="分辨率" name="resolution">
                <Select placeholder="请选择分辨率">
                  <Option value="1280x720">1280x720</Option>
                  <Option value="1920x1080">1920x1080</Option>
                  <Option value="2560x1440">2560x1440</Option>
                  <Option value="3840x2160">3840x2160</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="帧率" name="fps">
                <Select placeholder="请选择帧率">
                  <Option value="15">15 fps</Option>
                  <Option value="25">25 fps</Option>
                  <Option value="30">30 fps</Option>
                  <Option value="60">60 fps</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="码率 (kbps)" name="bitrate">
            <Input placeholder="请输入码率" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VideoMonitor; 