import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Collapse,
  List,
  Tag,
  Button,
  Space,
  Divider,
  Alert,
  Steps,
  Image,
  Table,
  Anchor,
} from 'antd';
import {
  BookOutlined,
  QuestionCircleOutlined,
  InfoCircleOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  DownloadOutlined,
  SearchOutlined,
  StarOutlined,
  BulbOutlined,
  SafetyOutlined,
  SettingOutlined,
  TeamOutlined,
  RobotOutlined,
  MonitorOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { Step } = Steps;

const UserGuide: React.FC = () => {
  const [activeKey, setActiveKey] = useState('1');

  const quickStartSteps = [
    {
      title: '登录系统',
      description: '使用管理员账号登录智慧酒店管理平台',
      icon: <TeamOutlined />,
    },
    {
      title: '查看总览',
      description: '在仪表板查看酒店整体运营状况',
      icon: <BarChartOutlined />,
    },
    {
      title: '设备监控',
      description: '监测各类设备运行状态',
      icon: <MonitorOutlined />,
    },
    {
      title: '智能服务',
      description: '管理送餐机器人等智能设备',
      icon: <RobotOutlined />,
    },
  ];

  const featureList = [
    {
      title: '设备管理',
      features: [
        '设备状态实时监测',
        '远程控制设备操作',
        '设备调节和参数设置',
        '设备联动配置',
        '环境监测和网络状态',
      ],
      icon: <MonitorOutlined />,
      color: '#1890ff',
    },
    {
      title: '智能服务',
      features: [
        '送餐机器人管理',
        '清洁机器人控制',
        '安防系统监控',
        '门禁管理系统',
      ],
      icon: <RobotOutlined />,
      color: '#52c41a',
    },
    {
      title: '数据分析',
      features: [
        '运营数据分析',
        '绩效报告生成',
        '能耗分析统计',
        '客户满意度分析',
      ],
      icon: <BarChartOutlined />,
      color: '#faad14',
    },
    {
      title: '管理功能',
      features: [
        '员工信息管理',
        '房间状态管理',
        '维护计划安排',
        '库存管理系统',
      ],
      icon: <TeamOutlined />,
      color: '#722ed1',
    },
    {
      title: '系统管理',
      features: [
        '系统设置配置',
        '用户权限管理',
        '角色权限分配',
        '系统日志查看',
        '数据备份恢复',
      ],
      icon: <SettingOutlined />,
      color: '#eb2f96',
    },
  ];

  const faqData = [
    {
      question: '如何添加新的设备？',
      answer: '在设备管理页面，点击"添加设备"按钮，填写设备信息并保存即可。',
    },
    {
      question: '如何设置设备告警？',
      answer: '在设备详情页面，点击"设置"按钮，在告警设置中配置阈值和通知方式。',
    },
    {
      question: '如何导出数据报告？',
      answer: '在各个功能页面，点击"导出数据"按钮，选择导出格式和时间范围。',
    },
    {
      question: '如何管理用户权限？',
      answer: '在系统管理-用户管理中，可以为不同用户分配不同的角色和权限。',
    },
    {
      question: '如何查看系统日志？',
      answer: '在系统管理-系统日志中，可以查看所有操作记录和系统事件。',
    },
    {
      question: '如何配置设备联动？',
      answer: '在设备联动页面，设置触发条件和执行动作，实现设备间的自动联动。',
    },
  ];

  const contactInfo = [
    {
      type: '技术支持',
      contact: '400-123-4567',
      email: 'support@hotel.com',
      time: '7x24小时',
    },
    {
      type: '系统管理员',
      contact: '138-0013-8000',
      email: 'admin@hotel.com',
      time: '工作日 9:00-18:00',
    },
    {
      type: '产品经理',
      contact: '139-0013-9000',
      email: 'pm@hotel.com',
      time: '工作日 9:00-18:00',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <BookOutlined style={{ marginRight: 8 }} />
          用户指南
        </Title>
        <Text type="secondary">
          智慧酒店管理平台使用指南和帮助文档
        </Text>
      </div>

      <Row gutter={24}>
        {/* 左侧导航 */}
        <Col span={6}>
          <Card title="快速导航" style={{ position: 'sticky', top: 24 }}>
            <Anchor>
              <Anchor.Link href="#quick-start" title="快速开始" />
              <Anchor.Link href="#features" title="功能介绍" />
              <Anchor.Link href="#faq" title="常见问题" />
              <Anchor.Link href="#contact" title="联系我们" />
            </Anchor>
          </Card>
        </Col>

        {/* 右侧内容 */}
        <Col span={18}>
          {/* 快速开始 */}
          <Card id="quick-start" title="快速开始" style={{ marginBottom: '24px' }}>
            <Alert
              message="欢迎使用智慧酒店管理平台"
              description="本系统提供全面的酒店智能化管理功能，包括设备监控、智能服务、数据分析等模块。"
              type="info"
              showIcon
              style={{ marginBottom: '24px' }}
            />
            
            <Title level={4}>使用步骤</Title>
            <Steps direction="vertical" current={-1} style={{ marginBottom: '24px' }}>
              {quickStartSteps.map((step, index) => (
                <Step
                  key={index}
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                />
              ))}
            </Steps>

            <Divider />

            <Title level={4}>系统要求</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Card size="small" title="浏览器要求">
                  <List
                    size="small"
                    dataSource={[
                      'Chrome 80+',
                      'Firefox 75+',
                      'Safari 13+',
                      'Edge 80+',
                    ]}
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="网络要求">
                  <List
                    size="small"
                    dataSource={[
                      '稳定的网络连接',
                      '建议带宽 2Mbps+',
                      '支持 HTTPS 协议',
                    ]}
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                  />
                </Card>
              </Col>
            </Row>
          </Card>

          {/* 功能介绍 */}
          <Card id="features" title="功能介绍" style={{ marginBottom: '24px' }}>
            <Row gutter={[16, 16]}>
              {featureList.map((feature, index) => (
                <Col span={12} key={index}>
                  <Card
                    size="small"
                    title={
                      <Space>
                        <span style={{ color: feature.color }}>{feature.icon}</span>
                        {feature.title}
                      </Space>
                    }
                  >
                    <List
                      size="small"
                      dataSource={feature.features}
                      renderItem={(item) => (
                        <List.Item>
                          <Text>{item}</Text>
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
              ))}
            </Row>

            <Divider />

            <Title level={4}>功能特色</Title>
            <Row gutter={16}>
              <Col span={8}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <BulbOutlined style={{ fontSize: '32px', color: '#faad14' }} />
                    <Title level={5}>智能化管理</Title>
                    <Text type="secondary">AI驱动的智能决策和自动化管理</Text>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <SafetyOutlined style={{ fontSize: '32px', color: '#52c41a' }} />
                    <Title level={5}>安全可靠</Title>
                    <Text type="secondary">多重安全防护，确保数据安全</Text>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <StarOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
                    <Title level={5}>用户友好</Title>
                    <Text type="secondary">直观的界面设计，操作简单便捷</Text>
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>

          {/* 常见问题 */}
          <Card id="faq" title="常见问题" style={{ marginBottom: '24px' }}>
            <Collapse defaultActiveKey={['1']}>
              {faqData.map((item, index) => (
                <Panel
                  header={
                    <Space>
                      <QuestionCircleOutlined />
                      {item.question}
                    </Space>
                  }
                  key={index + 1}
                >
                  <Paragraph>{item.answer}</Paragraph>
                </Panel>
              ))}
            </Collapse>

            <Divider />

            <Title level={4}>使用技巧</Title>
            <Alert
              message="快捷键操作"
              description="Ctrl+F：搜索功能 | Ctrl+R：刷新数据 | Ctrl+E：导出数据"
              type="success"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            <Alert
              message="数据刷新"
              description="系统数据每30秒自动刷新一次，也可手动点击刷新按钮"
              type="info"
              showIcon
            />
          </Card>

          {/* 联系我们 */}
          <Card id="contact" title="联系我们">
            <Row gutter={16}>
              <Col span={16}>
                <Title level={4}>技术支持</Title>
                <Table
                  dataSource={contactInfo}
                  columns={[
                    {
                      title: '类型',
                      dataIndex: 'type',
                      key: 'type',
                    },
                    {
                      title: '联系电话',
                      dataIndex: 'contact',
                      key: 'contact',
                    },
                    {
                      title: '邮箱',
                      dataIndex: 'email',
                      key: 'email',
                    },
                    {
                      title: '服务时间',
                      dataIndex: 'time',
                      key: 'time',
                    },
                  ]}
                  pagination={false}
                  size="small"
                />
              </Col>
              <Col span={8}>
                <Card size="small" title="快速联系">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button type="primary" icon={<VideoCameraOutlined />} block>
                      在线客服
                    </Button>
                    <Button icon={<FileTextOutlined />} block>
                      提交工单
                    </Button>
                    <Button icon={<DownloadOutlined />} block>
                      下载手册
                    </Button>
                  </Space>
                </Card>
              </Col>
            </Row>

            <Divider />

            <Title level={4}>反馈建议</Title>
            <Paragraph>
              如果您在使用过程中遇到问题或有改进建议，欢迎通过以下方式联系我们：
            </Paragraph>
            <ul>
              <li>发送邮件至：feedback@hotel.com</li>
              <li>拨打客服热线：400-123-4567</li>
              <li>在系统内提交反馈工单</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserGuide; 