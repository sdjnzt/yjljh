import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Statistic,
  Progress,
  Avatar,
  List,
  Tag,
  Alert,
  Badge
} from 'antd';
import {
  HomeOutlined,
  MonitorOutlined,
  WarningOutlined,
  RocketOutlined,
  StarOutlined,
  TrophyOutlined,
  CloudOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CameraOutlined,
  VideoCameraOutlined,
  UserOutlined,
  SecurityScanOutlined,
  AudioOutlined,
  PartitionOutlined,
  ScheduleOutlined,
  IeOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import '../styles/welcome.css';

const { Title, Paragraph, Text } = Typography;

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  // 实时更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 根据时间设置问候语
  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 6) {
      setGreeting('夜深了，请注意休息');
    } else if (hour < 12) {
      setGreeting('早上好，祝您工作愉快');
    } else if (hour < 18) {
      setGreeting('下午好，继续加油');
    } else {
      setGreeting('晚上好，辛苦了');
    }
  }, [currentTime]);

  // 模拟系统统计数据
  const systemStats = {
    securityDevices: 156,
    onlineDevices: 148,
    activeAlarms: 3,
    broadcastZones: 12,
    activeBroadcasts: 2,
    totalUsers: 45,
    onlineUsers: 38,
    systemUptime: 99.8
  };

  // 核心功能入口
  const coreFeatures = [
    {
      title: '安防管理系统',
      icon: <IeOutlined style={{ fontSize: '32px', color: '#3f51b5' }} />,
      description: '智能监控、门禁管理、报警系统',
      path: '/security-system',
      color: '#3f51b5',
      badge: '核心功能',
      status: 'online'
    },
    {
      title: '广播系统',
      icon: <AudioOutlined style={{ fontSize: '32px', color: '#4caf50' }} />,
      description: '实时广播、定时广播、分区广播',
      path: '/broadcast-system',
      color: '#4caf50',
      badge: '核心功能',
      status: 'online'
    },
    {
      title: '权限管理',
      icon: <SecurityScanOutlined style={{ fontSize: '32px', color: '#ff9800' }} />,
      description: '用户管理、角色权限、安全控制',
      path: '/permission-management',
      color: '#ff9800',
      badge: '核心功能',
      status: 'online'
    },
    {
      title: '系统监控',
      icon: <MonitorOutlined style={{ fontSize: '32px', color: '#e91e63' }} />,
      description: '设备状态、性能监控、日志管理',
      path: '/dashboard',
      color: '#e91e63',
      badge: '核心功能',
      status: 'online'
    }
  ];

  // 快速功能入口
  const quickFeatures = [
    {
      title: '实时广播',
      icon: <VideoCameraOutlined style={{ fontSize: '24px', color: '#00bcd4' }} />,
      description: '即时语音广播',
      path: '/real-time-broadcast',
      color: '#00bcd4'
    },
    {
      title: '定时广播',
      icon: <ScheduleOutlined style={{ fontSize: '24px', color: '#9c27b0' }} />,
      description: '定时任务管理',
      path: '/scheduled-broadcast',
      color: '#9c27b0'
    },
    {
      title: '分区广播',
      icon: <PartitionOutlined style={{ fontSize: '24px', color: '#f44336' }} />,
      description: '区域广播控制',
      path: '/zone-broadcast',
      color: '#f44336'
    },
    {
      title: '安防监控',
      icon: <CameraOutlined style={{ fontSize: '24px', color: '#795548' }} />,
      description: '实时视频监控',
      path: '/video-monitor',
      color: '#795548'
    }
  ];

  // 系统特色
  const features = [
    {
      icon: <SafetyCertificateOutlined style={{ color: '#4caf50' }} />,
      title: '智能安防',
      description: 'AI人脸识别、智能预警、全方位监控'
    },
    {
      icon: <AudioOutlined style={{ color: '#2196f3' }} />,
      title: '智能广播',
      description: '多区域广播、定时播放、紧急通知'
    },
    {
      icon: <SecurityScanOutlined style={{ color: '#ff9800' }} />,
      title: '权限控制',
      description: '细粒度权限管理、角色分配、安全审计'
    },
    {
      icon: <MonitorOutlined style={{ color: '#e91e63' }} />,
      title: '实时监控',
      description: '设备状态监控、性能分析、故障预警'
    }
  ];

  // 最新动态
  const recentActivities = [
    {
      time: '2分钟前',
      action: '安防系统检测到可疑人员，已自动报警',
      icon: <WarningOutlined style={{ color: '#ff9800' }} />,
      type: 'warning'
    },
    {
      time: '5分钟前',
      action: '前厅区域广播任务完成，播放时长3分钟',
      icon: <CheckCircleOutlined style={{ color: '#4caf50' }} />,
      type: 'success'
    },
    {
      time: '10分钟前',
      action: '新用户张经理登录系统，权限验证成功',
      icon: <UserOutlined style={{ color: '#2196f3' }} />,
      type: 'info'
    },
    {
      time: '15分钟前',
      action: '系统自动备份完成，数据完整性100%',
      icon: <CloudOutlined style={{ color: '#9c27b0' }} />,
      type: 'success'
    }
  ];

  // 系统状态卡片
  const statusCards = [
    {
      title: '安防设备',
      value: systemStats.securityDevices,
      suffix: '台',
      prefix: <IeOutlined style={{ color: '#3f51b5' }} />,
      color: '#3f51b5',
      detail: `${systemStats.onlineDevices}台在线`
    },
    {
      title: '广播分区',
      value: systemStats.broadcastZones,
      suffix: '个',
      prefix: <PartitionOutlined style={{ color: '#4caf50' }} />,
      color: '#4caf50',
      detail: `${systemStats.activeBroadcasts}个活跃`
    },
    {
      title: '系统用户',
      value: systemStats.totalUsers,
      suffix: '人',
      prefix: <UserOutlined style={{ color: '#ff9800' }} />,
      color: '#ff9800',
      detail: `${systemStats.onlineUsers}人在线`
    },
    {
      title: '系统运行',
      value: systemStats.systemUptime,
      suffix: '%',
      prefix: <CheckCircleOutlined style={{ color: '#e91e63' }} />,
      color: '#e91e63',
      detail: '稳定运行中'
    }
  ];

  return (
    <div className="welcome-container">
      {/* 品牌横幅 */}
      <Card 
        className="brand-banner"
        style={{ 
          marginBottom: 24, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 20,
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
        }}
      >
        <Row align="middle" justify="center">
          <Col>
            <Space direction="vertical" size="small" style={{ textAlign: 'center' }}>
              <Title level={1} style={{ color: 'white', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                <HomeOutlined style={{ marginRight: 12 }} />
                渔家里京杭假日酒店管理系统
              </Title>
              <Title level={3} style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontWeight: 'normal' }}>
                智能安防 · 广播管理 · 权限控制
              </Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '16px' }}>
                {greeting} · {currentTime.toLocaleDateString('zh-CN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  weekday: 'long'
                })} · {currentTime.toLocaleTimeString('zh-CN')}
              </Paragraph>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 系统状态概览 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        {statusCards.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card 
              className="welcome-card status-card"
              style={{ 
                textAlign: 'center',
                border: `2px solid ${card.color}15`,
                borderRadius: 20,
                background: `linear-gradient(135deg, ${card.color}08 0%, ${card.color}05 100%)`,
                boxShadow: `0 4px 20px ${card.color}15`,
                transition: 'all 0.3s ease'
              }}
              hoverable
            >
              <Statistic
                title={card.title}
                value={card.value}
                suffix={card.suffix}
                prefix={card.prefix}
                valueStyle={{ color: card.color, fontSize: '28px', fontWeight: 'bold' }}
              />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {card.detail}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 核心功能入口 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card 
            title={
              <Space>
                <StarOutlined style={{ color: '#ffc107' }} />
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>核心功能</span>
              </Space>
            }
            className="welcome-card"
            style={{ borderRadius: 20 }}
          >
            <Row gutter={[20, 20]}>
              {coreFeatures.map((feature, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card
                    hoverable
                    className="core-feature-card hover-lift"
                    style={{ 
                      textAlign: 'center', 
                      border: `2px solid ${feature.color}20`,
                      borderRadius: 20,
                      position: 'relative',
                      background: `linear-gradient(135deg, ${feature.color}08 0%, ${feature.color}05 100%)`,
                      boxShadow: `0 4px 20px ${feature.color}15`,
                      transition: 'all 0.3s ease',
                      '--index': index
                    } as React.CSSProperties}
                    onClick={() => navigate(feature.path)}
                  >
                    <Badge.Ribbon text={feature.badge} color={feature.color}>
                      <div style={{ padding: '20px 0' }}>
                        <div style={{ marginBottom: 16 }}>
                          {feature.icon}
                        </div>
                        <Title level={4} style={{ margin: '12px 0', color: feature.color }}>
                          {feature.title}
                        </Title>
                        <Text type="secondary" style={{ fontSize: '13px', lineHeight: '1.4' }}>
                          {feature.description}
                        </Text>
                        <div style={{ marginTop: 12 }}>
                          <Tag color={feature.status === 'online' ? 'green' : 'red'}>
                            {feature.status === 'online' ? '在线' : '离线'}
                          </Tag>
                        </div>
                      </div>
                    </Badge.Ribbon>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 快速功能和系统状态 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        {/* 快速功能 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <RocketOutlined style={{ color: '#2196f3' }} />
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>快速功能</span>
              </Space>
            }
            className="welcome-card"
            style={{ height: '100%', borderRadius: 20 }}
          >
            <Row gutter={[16, 16]}>
              {quickFeatures.map((item, index) => (
                <Col xs={12} sm={12} key={index}>
                  <Card
                    hoverable
                    className="quick-feature-card hover-lift"
                    style={{ 
                      textAlign: 'center', 
                      border: `1px solid ${item.color}30`,
                      borderRadius: 16,
                      background: `linear-gradient(135deg, ${item.color}08 0%, ${item.color}05 100%)`,
                      boxShadow: `0 2px 12px ${item.color}15`,
                      transition: 'all 0.3s ease',
                      '--index': index
                    } as React.CSSProperties}
                    onClick={() => navigate(item.path)}
                  >
                    <div style={{ marginBottom: 8 }}>
                      {item.icon}
                    </div>
                    <Title level={5} style={{ margin: '8px 0', color: item.color }}>
                      {item.title}
                    </Title>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {item.description}
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* 系统状态 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <MonitorOutlined style={{ color: '#4caf50' }} />
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>系统状态</span>
              </Space>
            }
            className="welcome-card"
            style={{ height: '100%', borderRadius: 20 }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>设备在线率</Text>
                  <Text strong style={{ color: '#4caf50' }}>{((systemStats.onlineDevices / systemStats.securityDevices) * 100).toFixed(1)}%</Text>
                </div>
                <Progress 
                  percent={(systemStats.onlineDevices / systemStats.securityDevices) * 100} 
                  strokeColor="#4caf50" 
                  showInfo={false}
                  size="small"
                  strokeWidth={8}
                />
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>用户在线率</Text>
                  <Text strong style={{ color: '#2196f3' }}>{((systemStats.onlineUsers / systemStats.totalUsers) * 100).toFixed(1)}%</Text>
                </div>
                <Progress 
                  percent={(systemStats.onlineUsers / systemStats.totalUsers) * 100} 
                  strokeColor="#2196f3" 
                  showInfo={false}
                  size="small"
                  strokeWidth={8}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>广播活跃度</Text>
                  <Text strong style={{ color: '#9c27b0' }}>{((systemStats.activeBroadcasts / systemStats.broadcastZones) * 100).toFixed(1)}%</Text>
                </div>
                <Progress 
                  percent={(systemStats.activeBroadcasts / systemStats.broadcastZones) * 100} 
                  strokeColor="#9c27b0" 
                  showInfo={false}
                  size="small"
                  strokeWidth={8}
                />
              </div>

              <Alert
                message={`当前有 ${systemStats.activeAlarms} 个活跃报警需要处理`}
                type={systemStats.activeAlarms > 0 ? 'warning' : 'success'}
                showIcon
                style={{ marginTop: 16, borderRadius: 12 }}
              />
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 系统特色和最新动态 */}
      <Row gutter={[24, 24]}>
        {/* 系统特色 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <TrophyOutlined style={{ color: '#ffc107' }} />
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>系统特色</span>
              </Space>
            }
            className="welcome-card"
            style={{ height: '100%', borderRadius: 20 }}
          >
            <List
              dataSource={features}
              renderItem={(feature) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        size="large" 
                        icon={feature.icon}
                        style={{ backgroundColor: '#f8f9fa', color: feature.icon.props.style.color }}
                      />
                    }
                    title={<Text strong>{feature.title}</Text>}
                    description={<Text type="secondary">{feature.description}</Text>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 最新动态 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <ClockCircleOutlined style={{ color: '#00bcd4' }} />
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>最新动态</span>
              </Space>
            }
            className="welcome-card"
            style={{ height: '100%', borderRadius: 20 }}
          >
            <List
              dataSource={recentActivities}
              renderItem={(activity) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Badge dot color={activity.type === 'success' ? 'green' : activity.type === 'warning' ? 'orange' : 'blue'}>
                        <Avatar size="small" icon={activity.icon} />
                      </Badge>
                    }
                    title={<Text>{activity.action}</Text>}
                    description={<Text type="secondary">{activity.time}</Text>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 底部版权信息 */}
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card 
            className="welcome-card"
            style={{ 
              textAlign: 'center', 
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              borderRadius: 20,
              border: '1px solid #dee2e6'
            }}
          >
            <Space direction="vertical" size="small">
              <Text type="secondary" style={{ fontSize: '14px' }}>
                © 2025 渔家里京杭假日酒店管理系统 · 智能安防与广播管理平台
              </Text>
              <Space size="large">
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  <IeOutlined style={{ marginRight: 4, color: '#3f51b5' }} />
                  智能安防管理
                </Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  <AudioOutlined style={{ marginRight: 4, color: '#4caf50' }} />
                  智能广播系统
                </Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  <SecurityScanOutlined style={{ marginRight: 4, color: '#ff9800' }} />
                  权限安全管理
                </Text>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Welcome; 