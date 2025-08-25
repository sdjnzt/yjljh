import React, { useState } from 'react';
import dayjs from 'dayjs';
import { 
  Row, 
  Col, 
  Card, 
  Table, 
  Tag, 
  Progress, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Space, 
  Statistic, 
  Timeline, 
  Tabs, 
  Alert, 
  Tooltip, 
  Badge,
  Typography,
  Divider,
  message
} from 'antd';
import { 
  AuditOutlined,
  CheckCircleOutlined, 
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DownloadOutlined,
  FilterOutlined,
  ReloadOutlined,
  BarChartOutlined,
  FileTextOutlined,
  WarningOutlined,
  SettingOutlined,
  CalendarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  SafetyOutlined,
  ToolOutlined,
  FileProtectOutlined,
  BookOutlined,
  TrophyOutlined,
  RocketOutlined,
  HeartOutlined
} from '@ant-design/icons';
import { Pie, Column, Line } from '@ant-design/plots';
import { inspectionRecords, rectificationItems, chartData } from '../data/mockData';
import type { InspectionRecord, RectificationItem } from '../data/mockData';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const InspectionManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isInspectionModalVisible, setIsInspectionModalVisible] = useState(false);
  const [isRectificationModalVisible, setIsRectificationModalVisible] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<InspectionRecord | null>(null);
  const [selectedRectification, setSelectedRectification] = useState<RectificationItem | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [inspectionForm] = Form.useForm();
  const [rectificationForm] = Form.useForm();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // 统计数据
  const totalInspections = inspectionRecords.length;
  const completedInspections = inspectionRecords.filter(r => r.status === 'completed').length;
  const overdueInspections = inspectionRecords.filter(r => r.status === 'overdue').length;
  const pendingRectifications = rectificationItems.filter(r => r.status === 'pending').length;
  const completionRate = Math.round((completedInspections / totalInspections) * 100);

  // 检查记录表格列配置
  const inspectionColumns = [
    {
      title: '检查编号',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id: string) => (
        <Text code style={{ fontSize: '12px' }}>{id}</Text>
      )
    },
    {
      title: '检查标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
      render: (title: string, record: InspectionRecord) => (
        <div>
          <div style={{ fontWeight: 'bold', color: '#262626' }}>{title}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.location}
          </Text>
        </div>
      )
    },
    {
      title: '检查类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const typeConfig = {
          routine: { color: 'blue', text: '例行检查', icon: <CalendarOutlined /> },
          special: { color: 'orange', text: '专项检查', icon: <AuditOutlined /> },
          emergency: { color: 'red', text: '紧急检查', icon: <WarningOutlined /> },
          annual: { color: 'purple', text: '年度检查', icon: <TrophyOutlined /> }
        };
        const config = typeConfig[type as keyof typeof typeConfig];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      }
    },
    {
      title: '检查员',
      dataIndex: 'inspector',
      key: 'inspector',
      width: 100,
      render: (inspector: string, record: InspectionRecord) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <UserOutlined style={{ color: '#1890ff', fontSize: '12px' }} />
            <Text strong style={{ fontSize: '13px' }}>{inspector}</Text>
          </div>
          <Text type="secondary" style={{ fontSize: '11px' }}>
            {record.department}
          </Text>
        </div>
      )
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (priority: string) => {
        const priorityConfig = {
          low: { color: 'green', text: '低' },
          medium: { color: 'blue', text: '中' },
          high: { color: 'orange', text: '高' },
          urgent: { color: 'red', text: '紧急' }
        };
        const config = priorityConfig[priority as keyof typeof priorityConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string, record: InspectionRecord) => {
        const statusConfig = {
          scheduled: { color: 'default', text: '已安排', icon: <ClockCircleOutlined /> },
          in_progress: { color: 'processing', text: '进行中', icon: <ReloadOutlined spin /> },
          completed: { color: 'success', text: '已完成', icon: <CheckCircleOutlined /> },
          overdue: { color: 'error', text: '已逾期', icon: <ExclamationCircleOutlined /> }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
          <div>
            <Tag color={config.color} icon={config.icon}>
              {config.text}
            </Tag>
            {record.score && (
              <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                评分: {record.score}分
              </div>
            )}
          </div>
        );
      }
    },
    {
      title: '检查时间',
      dataIndex: 'scheduledDate',
      key: 'scheduledDate',
      width: 100,
      render: (date: string, record: InspectionRecord) => (
        <div>
          <div style={{ fontSize: '12px' }}>{date}</div>
          {record.completedDate && (
            <Text type="secondary" style={{ fontSize: '11px' }}>
              完成: {record.completedDate}
            </Text>
          )}
        </div>
      )
    },
    {
      title: '问题/整改',
      key: 'issues',
      width: 100,
      render: (_: any, record: InspectionRecord) => (
        <div style={{ textAlign: 'center' }}>
          <div>
            <Text type="danger" style={{ fontSize: '14px', fontWeight: 'bold' }}>
              {record.issuesFound}
            </Text>
            <Text type="secondary" style={{ fontSize: '11px' }}> 问题</Text>
          </div>
          <div>
            <Text type="warning" style={{ fontSize: '14px', fontWeight: 'bold' }}>
              {record.rectificationItems}
            </Text>
            <Text type="secondary" style={{ fontSize: '11px' }}> 整改</Text>
          </div>
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: InspectionRecord) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewInspection(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button 
              type="text" 
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditInspection(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  // 整改项目表格列配置
  const rectificationColumns = [
    {
      title: '整改编号',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id: string) => (
        <Text code style={{ fontSize: '12px' }}>{id}</Text>
      )
    },
    {
      title: '整改项目',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
      render: (title: string, record: RectificationItem) => (
        <div>
          <div style={{ fontWeight: 'bold', color: '#262626' }}>{title}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.description}
          </Text>
        </div>
      )
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category: string) => {
        const categoryConfig = {
          safety: { color: 'red', text: '安全', icon: <SafetyOutlined /> },
          equipment: { color: 'blue', text: '设备', icon: <ToolOutlined /> },
          process: { color: 'green', text: '工艺', icon: <SettingOutlined /> },
          environment: { color: 'cyan', text: '环境', icon: <EnvironmentOutlined /> },
          documentation: { color: 'purple', text: '文档', icon: <FileProtectOutlined /> }
        };
        const config = categoryConfig[category as keyof typeof categoryConfig];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      }
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      width: 100,
      render: (severity: string) => {
        const severityConfig = {
          low: { color: 'green', text: '低' },
          medium: { color: 'blue', text: '中' },
          high: { color: 'orange', text: '高' },
          critical: { color: 'red', text: '严重' }
        };
        const config = severityConfig[severity as keyof typeof severityConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '负责人',
      dataIndex: 'assignee',
      key: 'assignee',
      width: 120,
      render: (assignee: string, record: RectificationItem) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <UserOutlined style={{ color: '#1890ff', fontSize: '12px' }} />
            <Text strong style={{ fontSize: '13px' }}>{assignee}</Text>
          </div>
          <Text type="secondary" style={{ fontSize: '11px' }}>
            {record.department}
          </Text>
        </div>
      )
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 120,
      render: (progress: number, record: RectificationItem) => (
        <div>
          <Progress 
            percent={progress} 
            size="small" 
            status={record.status === 'completed' ? 'success' : 'active'}
            showInfo={false}
          />
          <Text style={{ fontSize: '11px' }}>{progress}%</Text>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusConfig = {
          pending: { color: 'default', text: '待处理', icon: <ClockCircleOutlined /> },
          in_progress: { color: 'processing', text: '处理中', icon: <ReloadOutlined spin /> },
          completed: { color: 'warning', text: '已完成', icon: <CheckCircleOutlined /> },
          verified: { color: 'success', text: '已验证', icon: <CheckCircleOutlined /> },
          closed: { color: 'success', text: '已关闭', icon: <CheckCircleOutlined /> }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      }
    },
    {
      title: '截止日期',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 100,
      render: (date: string, record: RectificationItem) => {
        const isOverdue = new Date(date) < new Date() && record.status !== 'completed' && record.status !== 'verified';
        return (
          <div>
            <div style={{ 
              fontSize: '12px',
              color: isOverdue ? '#ff4d4f' : '#262626'
            }}>
              {date}
            </div>
            {isOverdue && (
              <Text type="danger" style={{ fontSize: '11px' }}>
                已逾期
              </Text>
            )}
          </div>
        );
      }
    },
    {
      title: '费用',
      dataIndex: 'cost',
      key: 'cost',
      width: 80,
      render: (cost: number) => (
        cost ? (
          <Text style={{ fontSize: '12px' }}>
            ¥{cost.toLocaleString()}
          </Text>
        ) : (
          <Text type="secondary" style={{ fontSize: '12px' }}>
            -
          </Text>
        )
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: RectificationItem) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewRectification(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button 
              type="text" 
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditRectification(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  // 事件处理函数
  const handleViewInspection = (record: InspectionRecord) => {
    setSelectedInspection(record);
    // Convert date strings to dayjs objects for DatePicker
    const formValues = {
      ...record,
      scheduledDate: record.scheduledDate ? dayjs(record.scheduledDate) : null,
    };
    inspectionForm.setFieldsValue(formValues);
    setIsViewMode(true);
    setIsInspectionModalVisible(true);
  };

  const handleEditInspection = (record: InspectionRecord) => {
    setSelectedInspection(record);
    // Convert date strings to dayjs objects for DatePicker
    const formValues = {
      ...record,
      scheduledDate: record.scheduledDate ? dayjs(record.scheduledDate) : null,
    };
    inspectionForm.setFieldsValue(formValues);
    setIsViewMode(false);
    setIsInspectionModalVisible(true);
  };

  const handleViewRectification = (record: RectificationItem) => {
    setSelectedRectification(record);
    // Convert date strings to dayjs objects for DatePicker
    const formValues = {
      ...record,
      dueDate: record.dueDate ? dayjs(record.dueDate) : null,
    };
    rectificationForm.setFieldsValue(formValues);
    setIsViewMode(true);
    setIsRectificationModalVisible(true);
  };

  const handleEditRectification = (record: RectificationItem) => {
    setSelectedRectification(record);
    // Convert date strings to dayjs objects for DatePicker
    const formValues = {
      ...record,
      dueDate: record.dueDate ? dayjs(record.dueDate) : null,
    };
    rectificationForm.setFieldsValue(formValues);
    setIsViewMode(false);
    setIsRectificationModalVisible(true);
  };

  const handleNewInspection = () => {
    setSelectedInspection(null);
    inspectionForm.resetFields();
    setIsViewMode(false);
    setIsInspectionModalVisible(true);
  };

  const handleNewRectification = () => {
    setSelectedRectification(null);
    rectificationForm.resetFields();
    setIsViewMode(false);
    setIsRectificationModalVisible(true);
  };

  const handleInspectionModalOk = () => {
    inspectionForm.validateFields().then((values) => {
      console.log('保存检查记录:', values);
      message.success('检查记录保存成功');
      setIsInspectionModalVisible(false);
      inspectionForm.resetFields();
    });
  };

  const handleRectificationModalOk = () => {
    rectificationForm.validateFields().then((values) => {
      console.log('保存整改项目:', values);
      message.success('整改项目保存成功');
      setIsRectificationModalVisible(false);
      rectificationForm.resetFields();
    });
  };

  // 过滤数据
  const filteredInspections = filterStatus === 'all' 
    ? inspectionRecords 
    : inspectionRecords.filter(record => record.status === filterStatus);

  // 图表配置
  const inspectionStatsConfig = {
    data: chartData.inspectionStats,
    angleField: 'count',
    colorField: 'status',
    radius: 0.8,
    label: {
      content: (data: any) => `${data.status}\n${data.count}`,
    },
    interactions: [{ type: 'element-active' }],
    color: ['#52c41a', '#1890ff', '#faad14', '#ff4d4f']
  };

  const rectificationStatsConfig = {
    data: chartData.rectificationStats,
    xField: 'status',
    yField: 'count',
    color: '#1890ff',
    columnWidthRatio: 0.6,
    label: {
      position: 'inside' as const,
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
  };

  return (
    <div>
      {/* 页面标题 */}
      <div style={{ 
        marginBottom: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <Title level={2} style={{ margin: 0, color: '#262626' }}>
            <AuditOutlined style={{ marginRight: 8, color: '#4E7FFF' }} />
            检查整改管理中心
          </Title>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            安全检查 · 问题整改 · 风险防控 · 持续改进
          </Text>
        </div>
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleNewInspection}
          >
            新建检查
          </Button>
          <Button 
            icon={<DownloadOutlined />}
          >
            导出报告
          </Button>
          <Button 
            icon={<ReloadOutlined />}
          >
            刷新
          </Button>
        </Space>
      </div>

      {/* 警报横幅 */}
      {(overdueInspections > 0 || pendingRectifications > 0) && (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          message={
            <div>
              {overdueInspections > 0 && (
                <span>有 {overdueInspections} 项检查已逾期</span>
              )}
              {overdueInspections > 0 && pendingRectifications > 0 && <Divider type="vertical" />}
              {pendingRectifications > 0 && (
                <span>有 {pendingRectifications} 项整改待处理</span>
              )}
            </div>
          }
          action={
            <Button size="small" type="primary">
              立即处理
            </Button>
          }
        />
      )}

      {/* 统计概览 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={
                <span style={{ color: '#666', fontSize: '14px' }}>
                  <FileTextOutlined style={{ marginRight: 4, color: '#1890ff' }} />
                  总检查数
                </span>
              }
              value={totalInspections}
              valueStyle={{ color: '#1890ff', fontSize: '28px', fontWeight: 'bold' }}
              suffix="项"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={
                <span style={{ color: '#666', fontSize: '14px' }}>
                  <CheckCircleOutlined style={{ marginRight: 4, color: '#52c41a' }} />
                  完成检查
                </span>
              }
              value={completedInspections}
              valueStyle={{ color: '#52c41a', fontSize: '28px', fontWeight: 'bold' }}
              suffix="项"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={
                <span style={{ color: '#666', fontSize: '14px' }}>
                  <ExclamationCircleOutlined style={{ marginRight: 4, color: '#ff4d4f' }} />
                  逾期检查
                </span>
              }
              value={overdueInspections}
              valueStyle={{ color: '#ff4d4f', fontSize: '28px', fontWeight: 'bold' }}
              suffix="项"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={
                <span style={{ color: '#666', fontSize: '14px' }}>
                  <TrophyOutlined style={{ marginRight: 4, color: '#fa8c16' }} />
                  完成率
                </span>
              }
              value={completionRate}
              valueStyle={{ color: '#fa8c16', fontSize: '28px', fontWeight: 'bold' }}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容区域 */}
      <Tabs 
        activeKey={selectedTab} 
        onChange={setSelectedTab}
        tabBarExtraContent={
          <Space>
            <Select
              placeholder="状态筛选"
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: 120 }}
              size="small"
            >
              <Option value="all">全部状态</Option>
              <Option value="scheduled">已安排</Option>
              <Option value="in_progress">进行中</Option>
              <Option value="completed">已完成</Option>
              <Option value="overdue">已逾期</Option>
            </Select>
            <Button 
              icon={<FilterOutlined />} 
              size="small"
            >
              高级筛选
            </Button>
          </Space>
        }
      >
        {/* 概览标签页 */}
        <TabPane 
          tab={
            <span>
              <BarChartOutlined />
              数据概览
            </span>
          } 
          key="overview"
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card 
                title={
                  <span>
                    <FileTextOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                    检查状态分布
                  </span>
                }
                style={{ height: 400 }}
              >
                <Pie {...inspectionStatsConfig} height={300} />
              </Card>
            </Col>
            <Col span={12}>
              <Card 
                title={
                  <span>
                    <ToolOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                    整改进度统计
                  </span>
                }
                style={{ height: 400 }}
              >
                <Column {...rectificationStatsConfig} height={300} />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card 
                title={
                  <span>
                    <ClockCircleOutlined style={{ marginRight: 8, color: '#fa8c16' }} />
                    近期检查动态
                  </span>
                }
                style={{ height: 350 }}
              >
                <Timeline style={{ padding: '16px 0' }}>
                  <Timeline.Item 
                    color="green" 
                    dot={<CheckCircleOutlined style={{ fontSize: '16px' }} />}
                  >
                    <div>
                      <Text strong>电气系统紧急检查已完成</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        2025-07-18 · 检查员：刘电工 · 评分：92分
                      </Text>
                    </div>
                  </Timeline.Item>
                  <Timeline.Item 
                    color="blue"
                    dot={<ReloadOutlined style={{ fontSize: '16px' }} />}
                  >
                    <div>
                      <Text strong>通信设备专项检查进行中</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        2025-07-20 · 检查员：李技术 · 进度：60%
                      </Text>
                    </div>
                  </Timeline.Item>
                  <Timeline.Item 
                    color="orange"
                    dot={<CalendarOutlined style={{ fontSize: '16px' }} />}
                  >
                    <div>
                      <Text strong>年度消防安全大检查已安排</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        2025-07-01 · 检查员：王消防 · 优先级：紧急
                      </Text>
                    </div>
                  </Timeline.Item>
                  <Timeline.Item 
                    color="red"
                    dot={<ExclamationCircleOutlined style={{ fontSize: '16px' }} />}
                  >
                    <div>
                      <Text strong>仓库区域安全检查已逾期</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        2025-07-10 · 检查员：陈管理 · 逾期：8天
                      </Text>
                    </div>
                  </Timeline.Item>
                </Timeline>
              </Card>
            </Col>
          </Row>
        </TabPane>

        {/* 检查记录标签页 */}
        <TabPane 
          tab={
            <span>
              <FileTextOutlined />
              检查记录
              <Badge 
                count={inspectionRecords.length} 
                style={{ marginLeft: 8 }}
                showZero
              />
            </span>
          } 
          key="inspections"
        >
          <Card>
            <Table
              dataSource={filteredInspections}
              columns={inspectionColumns}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条记录`
              }}
              scroll={{ x: 1400 }}
              size="small"
            />
          </Card>
        </TabPane>

        {/* 整改管理标签页 */}
        <TabPane 
          tab={
            <span>
              <ToolOutlined />
              整改管理
              <Badge 
                count={rectificationItems.length} 
                style={{ marginLeft: 8 }}
                showZero
              />
            </span>
          } 
          key="rectifications"
        >
          <Card
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleNewRectification}
                size="small"
              >
                新建整改
              </Button>
            }
          >
            <Table
              dataSource={rectificationItems}
              columns={rectificationColumns}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条记录`
              }}
              scroll={{ x: 1600 }}
              size="small"
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* 检查记录模态框 */}
      <Modal
        title={
          <span>
            <FileTextOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            {selectedInspection ? (isViewMode ? '查看检查记录' : '编辑检查记录') : '新建检查记录'}
          </span>
        }
        visible={isInspectionModalVisible}
        onOk={isViewMode ? undefined : handleInspectionModalOk}
        onCancel={() => {
          setIsInspectionModalVisible(false);
          setIsViewMode(false);
        }}
        width={800}
        destroyOnClose
        footer={isViewMode ? null : undefined}
      >
        <Form form={inspectionForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="检查标题"
                rules={[{ required: true, message: '请输入检查标题' }]}
              >
                <Input placeholder="请输入检查标题" disabled={isViewMode} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="检查类型"
                rules={[{ required: true, message: '请选择检查类型' }]}
              >
                <Select placeholder="请选择检查类型" disabled={isViewMode}>
                  <Option value="routine">例行检查</Option>
                  <Option value="special">专项检查</Option>
                  <Option value="emergency">紧急检查</Option>
                  <Option value="annual">年度检查</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="inspector"
                label="检查员"
                rules={[{ required: true, message: '请输入检查员姓名' }]}
              >
                <Input placeholder="请输入检查员姓名" disabled={isViewMode} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department"
                label="所属部门"
                rules={[{ required: true, message: '请输入所属部门' }]}
              >
                <Input placeholder="请输入所属部门" disabled={isViewMode} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="location"
                label="检查位置"
                rules={[{ required: true, message: '请输入检查位置' }]}
              >
                <Input placeholder="请输入检查位置" disabled={isViewMode} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="优先级"
                rules={[{ required: true, message: '请选择优先级' }]}
              >
                <Select placeholder="请选择优先级" disabled={isViewMode}>
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
              <Form.Item
                name="scheduledDate"
                label="计划检查时间"
                rules={[{ required: true, message: '请选择检查时间' }]}
              >
                <DatePicker style={{ width: '100%' }} disabled={isViewMode} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="检查状态"
              >
                <Select placeholder="请选择检查状态" disabled={isViewMode}>
                  <Option value="scheduled">已安排</Option>
                  <Option value="in_progress">进行中</Option>
                  <Option value="completed">已完成</Option>
                  <Option value="overdue">已逾期</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="检查描述"
            rules={[{ required: true, message: '请输入检查描述' }]}
          >
            <TextArea rows={3} placeholder="请详细描述检查内容和要求" disabled={isViewMode} />
          </Form.Item>

          <Form.Item
            name="remarks"
            label="备注信息"
          >
            <TextArea rows={2} placeholder="其他需要说明的信息" disabled={isViewMode} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 整改项目模态框 */}
      <Modal
        title={
          <span>
            <ToolOutlined style={{ marginRight: 8, color: '#52c41a' }} />
            {selectedRectification ? (isViewMode ? '查看整改项目' : '编辑整改项目') : '新建整改项目'}
          </span>
        }
        visible={isRectificationModalVisible}
        onOk={isViewMode ? undefined : handleRectificationModalOk}
        onCancel={() => {
          setIsRectificationModalVisible(false);
          setIsViewMode(false);
        }}
        width={800}
        destroyOnClose
        footer={isViewMode ? null : undefined}
      >
        <Form form={rectificationForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="整改标题"
                rules={[{ required: true, message: '请输入整改标题' }]}
              >
                <Input placeholder="请输入整改标题" disabled={isViewMode} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="整改类别"
                rules={[{ required: true, message: '请选择整改类别' }]}
              >
                <Select placeholder="请选择整改类别" disabled={isViewMode}>
                  <Option value="safety">安全</Option>
                  <Option value="equipment">设备</Option>
                  <Option value="process">工艺</Option>
                  <Option value="environment">环境</Option>
                  <Option value="documentation">文档</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="severity"
                label="严重程度"
                rules={[{ required: true, message: '请选择严重程度' }]}
              >
                <Select placeholder="请选择严重程度" disabled={isViewMode}>
                  <Option value="low">低</Option>
                  <Option value="medium">中</Option>
                  <Option value="high">高</Option>
                  <Option value="critical">严重</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="assignee"
                label="负责人"
                rules={[{ required: true, message: '请输入负责人姓名' }]}
              >
                <Input placeholder="请输入负责人姓名" disabled={isViewMode} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="department"
                label="负责部门"
                rules={[{ required: true, message: '请输入负责部门' }]}
              >
                <Input placeholder="请输入负责部门" disabled={isViewMode} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dueDate"
                label="截止日期"
                rules={[{ required: true, message: '请选择截止日期' }]}
              >
                <DatePicker style={{ width: '100%' }} disabled={isViewMode} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="整改状态"
              >
                <Select placeholder="请选择整改状态" disabled={isViewMode}>
                  <Option value="pending">待处理</Option>
                  <Option value="in_progress">处理中</Option>
                  <Option value="completed">已完成</Option>
                  <Option value="verified">已验证</Option>
                  <Option value="closed">已关闭</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="cost"
                label="预估费用（元）"
              >
                <Input placeholder="请输入预估费用" type="number" disabled={isViewMode} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="问题描述"
            rules={[{ required: true, message: '请输入问题描述' }]}
          >
            <TextArea rows={3} placeholder="请详细描述发现的问题" disabled={isViewMode} />
          </Form.Item>

          <Form.Item
            name="remarks"
            label="整改方案"
          >
            <TextArea rows={3} placeholder="请描述具体的整改方案和措施" disabled={isViewMode} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InspectionManagement; 