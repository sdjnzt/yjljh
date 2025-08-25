import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Button, 
  Space, 
  Tag, 
  Progress,
  Timeline,
  Badge,
  List,
  Avatar,
  Divider
} from 'antd';
import {
  AudioOutlined,
  VideoCameraOutlined,
  ScheduleOutlined,
  PartitionOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,

  ClockCircleOutlined,
  GlobalOutlined,
  BellOutlined,
  SoundOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

/**
 * 广播系统主页面
 * 提供实时广播、定时广播、分区广播等功能入口
 */
const BroadcastSystem: React.FC = () => {
  const navigate = useNavigate();
  const [currentBroadcasts, setCurrentBroadcasts] = useState<any[]>([]);
  const [scheduledBroadcasts, setScheduledBroadcasts] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState({
    online: true,
    activeZones: 8,
    totalDevices: 156,
    currentVolume: 75
  });

  // 模拟广播数据
  useEffect(() => {
    const mockCurrentBroadcasts = [
      {
        id: 1,
        name: '欢迎词广播',
        type: 'audio',
        zone: '前厅',
        status: 'playing',
        startTime: '14:00:00',
        duration: '00:02:30',
        volume: 80
      },
      {
        id: 2,
        name: '背景音乐',
        type: 'audio',
        zone: '餐厅',
        status: 'playing',
        startTime: '12:00:00',
        duration: '02:00:00',
        volume: 60
      },
      {
        id: 3,
        name: '紧急通知',
        type: 'voice',
        zone: '全区域',
        status: 'paused',
        startTime: '14:15:00',
        duration: '00:00:30',
        volume: 90
      }
    ];

    const mockScheduledBroadcasts = [
      {
        id: 1,
        name: '早餐时间提醒',
        type: 'voice',
        zone: '客房区域',
        scheduledTime: '07:00:00',
        duration: '00:01:00',
        status: 'scheduled'
      },
      {
        id: 2,
        name: '午餐时间提醒',
        type: 'voice',
        zone: '餐厅',
        scheduledTime: '12:00:00',
        duration: '00:01:00',
        status: 'scheduled'
      },
      {
        id: 3,
        name: '晚安广播',
        type: 'voice',
        zone: '全区域',
        scheduledTime: '22:00:00',
        duration: '00:02:00',
        status: 'scheduled'
      }
    ];

    setCurrentBroadcasts(mockCurrentBroadcasts);
    setScheduledBroadcasts(mockScheduledBroadcasts);
  }, []);

  // 处理广播控制
  const handleBroadcastControl = (action: string, broadcastId: number) => {
    console.log(`${action} broadcast ${broadcastId}`);
    // 这里可以添加实际的广播控制逻辑
  };

  // 获取状态标签颜色
  const getStatusColor = (status: string) => {
    const statusMap: { [key: string]: string } = {
      playing: 'green',
      paused: 'orange',
      stopped: 'red',
      scheduled: 'blue'
    };
    return statusMap[status] || 'default';
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      playing: '播放中',
      paused: '已暂停',
      stopped: '已停止',
      scheduled: '已计划'
    };
    return statusMap[status] || status;
  };

  // 获取类型图标
  const getTypeIcon = (type: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      audio: <AudioOutlined />,
      voice: <SoundOutlined />,
      video: <VideoCameraOutlined />
    };
    return iconMap[type] || <AudioOutlined />;
  };

  return (
    <div className="broadcast-system">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
          <AudioOutlined style={{ marginRight: '8px' }} />
          广播系统
        </h1>
        <p style={{ color: '#666', fontSize: '14px' }}>
          管理酒店各区域的广播播放，支持实时广播、定时广播和分区广播
        </p>
      </div>

      {/* 系统状态统计 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="系统状态"
              value={systemStatus.online ? '在线' : '离线'}
              prefix={<GlobalOutlined style={{ color: systemStatus.online ? '#52c41a' : '#ff4d4f' }} />}
              valueStyle={{ color: systemStatus.online ? '#52c41a' : '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃分区"
              value={systemStatus.activeZones}
              prefix={<PartitionOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="广播设备"
              value={systemStatus.totalDevices}
              prefix={<AudioOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="系统音量"
              value={systemStatus.currentVolume}
              prefix={<SoundOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16' }}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* 功能入口 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card 
            hoverable
            onClick={() => navigate('/real-time-broadcast')}
            style={{ textAlign: 'center', cursor: 'pointer' }}
          >
            <VideoCameraOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
            <h3>实时广播</h3>
            <p>立即向指定区域播放音频、语音或视频内容</p>
            <Button type="primary" icon={<PlayCircleOutlined />}>
              开始广播
            </Button>
          </Card>
        </Col>
        <Col span={8}>
          <Card 
            hoverable
            onClick={() => navigate('/scheduled-broadcast')}
            style={{ textAlign: 'center', cursor: 'pointer' }}
          >
            <ScheduleOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
            <h3>定时广播</h3>
            <p>设置定时任务，在指定时间自动播放广播内容</p>
            <Button type="primary" icon={<ClockCircleOutlined />}>
              设置定时
            </Button>
          </Card>
        </Col>
        <Col span={8}>
          <Card 
            hoverable
            onClick={() => navigate('/zone-broadcast')}
            style={{ textAlign: 'center', cursor: 'pointer' }}
          >
            <PartitionOutlined style={{ fontSize: '48px', color: '#722ed1', marginBottom: '16px' }} />
            <h3>分区广播</h3>
            <p>管理广播分区，设置不同区域的播放策略</p>
            <Button type="primary" icon={<PartitionOutlined />}>
              分区管理
            </Button>
          </Card>
        </Col>
      </Row>

      {/* 当前广播状态 */}
      <Card 
        title={
          <Space>
            <PlayCircleOutlined />
            当前广播
            <Badge count={currentBroadcasts.filter(b => b.status === 'playing').length} />
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <List
          dataSource={currentBroadcasts}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button 
                  key="play" 
                  type="link" 
                  icon={item.status === 'playing' ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                  onClick={() => handleBroadcastControl(
                    item.status === 'playing' ? 'pause' : 'play', 
                    item.id
                  )}
                >
                  {item.status === 'playing' ? '暂停' : '播放'}
                </Button>,
                <Button 
                  key="stop" 
                  type="link" 
                  icon={<StopOutlined />}
                  onClick={() => handleBroadcastControl('stop', item.id)}
                >
                  停止
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={getTypeIcon(item.type)} style={{ backgroundColor: '#1890ff' }} />}
                title={
                  <Space>
                    {item.name}
                    <Tag color={getStatusColor(item.status)}>
                      {getStatusText(item.status)}
                    </Tag>
                  </Space>
                }
                description={
                  <Space direction="vertical" size="small">
                    <div>区域: {item.zone}</div>
                    <div>开始时间: {item.startTime} | 时长: {item.duration}</div>
                    <div>
                      音量: 
                      <Progress 
                        percent={item.volume} 
                        size="small" 
                        style={{ display: 'inline-block', width: '100px', marginLeft: '8px' }}
                      />
                    </div>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* 定时广播计划 */}
      <Card 
        title={
          <Space>
            <ScheduleOutlined />
            定时广播计划
            <Badge count={scheduledBroadcasts.length} />
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <List
          dataSource={scheduledBroadcasts}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button key="edit" type="link">编辑</Button>,
                <Button key="delete" type="link" danger>删除</Button>
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={getTypeIcon(item.type)} style={{ backgroundColor: '#52c41a' }} />}
                title={
                  <Space>
                    {item.name}
                    <Tag color={getStatusColor(item.status)}>
                      {getStatusText(item.status)}
                    </Tag>
                  </Space>
                }
                description={
                  <Space direction="vertical" size="small">
                    <div>区域: {item.zone}</div>
                    <div>计划时间: {item.scheduledTime} | 时长: {item.duration}</div>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* 广播历史记录 */}
      <Card title="广播历史记录">
        <Timeline>
          <Timeline.Item color="green">
            <p style={{ margin: 0 }}>
              <strong>欢迎词广播</strong> - 前厅区域播放完成
            </p>
            <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>
              14:00:00 - 14:02:30 | 时长: 2分30秒
            </p>
          </Timeline.Item>
          <Timeline.Item color="blue">
            <p style={{ margin: 0 }}>
              <strong>背景音乐</strong> - 餐厅区域开始播放
            </p>
            <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>
              12:00:00 开始播放 | 音量: 60%
            </p>
          </Timeline.Item>
          <Timeline.Item color="red">
            <p style={{ margin: 0 }}>
              <strong>紧急通知</strong> - 全区域播放完成
            </p>
            <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>
              14:15:00 - 14:15:30 | 时长: 30秒
            </p>
          </Timeline.Item>
        </Timeline>
      </Card>
    </div>
  );
};

export default BroadcastSystem;
