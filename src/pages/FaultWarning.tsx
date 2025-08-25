import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Tag, 
  Row, 
  Col, 
  Statistic, 
  Alert, 
  Modal, 
  Button, 
  Select, 
  Input, 
  Space, 
  Badge, 
  Progress, 
  Descriptions, 
  Tabs, 
  Form, 
  Tooltip, 
  Avatar, 
  List, 
  Divider,
  Typography,
  notification,
  Drawer,
  Steps,
  TreeSelect,
  Radio,
  Popover,
  Empty
} from 'antd';
import { 
  WarningOutlined, 
  AlertOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  ExclamationCircleOutlined, 
  SearchOutlined, 
  EyeOutlined, 
  ToolOutlined,
  ReloadOutlined,
  ExportOutlined,
  PrinterOutlined,
  PhoneOutlined,
  MessageOutlined,
  UserOutlined,
  EnvironmentOutlined,
  ThunderboltOutlined,
  FireOutlined,
  SafetyOutlined,
  WifiOutlined,
  CameraOutlined,
  RobotOutlined,
  LockOutlined,
  HomeOutlined,
  HistoryOutlined,
  StarOutlined,
  FilterOutlined,
  DashboardOutlined,
  BugOutlined,
  PoweroffOutlined,
  SyncOutlined,
  SettingOutlined,
  TeamOutlined,
  MonitorOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { faultWarnings, FaultWarning, hotelDevices, hotelRooms } from '../data/mockData';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Option } = Select;
const { Search } = Input;
const { TextArea } = Input;
const { Text } = Typography;
const { TabPane } = Tabs;
const { Step } = Steps;

interface WarningRecord {
  id: string;
  warningId: string;
  action: 'acknowledged' | 'resolved' | 'false_alarm' | 'escalated' | 'assigned';
  operator: string;
  timestamp: string;
  comment?: string;
  assignedTo?: string;
}

const FaultWarningPage: React.FC = () => {
  const [warnings, setWarnings] = useState<FaultWarning[]>(faultWarnings);
  const [filteredWarnings, setFilteredWarnings] = useState<FaultWarning[]>(faultWarnings);
  const [filters, setFilters] = useState({
    severity: null as string | null,
    status: null as string | null,
    type: null as string | null,
    category: null as string | null,
    floor: null as string | null,
    search: ''
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedWarning, setSelectedWarning] = useState<FaultWarning | null>(null);
  const [processingModalVisible, setProcessingModalVisible] = useState(false);
  const [historyDrawerVisible, setHistoryDrawerVisible] = useState(false);
  const [selectedWarningHistory, setSelectedWarningHistory] = useState<WarningRecord[]>([]);
  const [processingForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('all');
  const [tableSize, setTableSize] = useState<'small' | 'middle' | 'large'>('small');

  // 模拟处理记录数据
  const [warningRecords] = useState<WarningRecord[]>([
    {
      id: 'record_001',
      warningId: 'warning_001',
      action: 'acknowledged',
      operator: '张工程师',
      timestamp: '2025-08-05 14:25:00',
      comment: '已确认传感器故障，正在安排维修人员'
    },
    {
      id: 'record_002',
      warningId: 'warning_001',
      action: 'assigned',
      operator: '李主管',
      timestamp: '2025-08-05 14:30:00',
      comment: '已分配给维修团队处理',
      assignedTo: '王维修师'
    }
  ]);

  // 过滤预警
  useEffect(() => {
    let filtered = warnings;

    if (filters.severity) {
      filtered = filtered.filter(warning => warning.severity === filters.severity);
    }
    if (filters.status) {
      filtered = filtered.filter(warning => warning.status === filters.status);
    }
    if (filters.type) {
      filtered = filtered.filter(warning => warning.warningType === filters.type);
    }
    if (filters.category) {
      filtered = filtered.filter(warning => {
        const device = hotelDevices.find(d => d.id === warning.deviceId);
        return device?.category === filters.category;
      });
    }
    if (filters.floor) {
      filtered = filtered.filter(warning => {
        const room = hotelRooms.find(r => r.roomNumber === warning.roomNumber);
        return room?.floor.toString() === filters.floor;
      });
    }
    if (filters.search) {
      filtered = filtered.filter(warning => 
        warning.deviceName.toLowerCase().includes(filters.search.toLowerCase()) ||
        warning.roomNumber.includes(filters.search) ||
        warning.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // 排序：严重程度 > 状态 > 时间
    filtered.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const statusOrder = { active: 3, acknowledged: 2, resolved: 1, false_alarm: 0 };
      
      if (severityOrder[a.severity as keyof typeof severityOrder] !== severityOrder[b.severity as keyof typeof severityOrder]) {
        return severityOrder[b.severity as keyof typeof severityOrder] - severityOrder[a.severity as keyof typeof severityOrder];
      }
      if (statusOrder[a.status as keyof typeof statusOrder] !== statusOrder[b.status as keyof typeof statusOrder]) {
        return statusOrder[b.status as keyof typeof statusOrder] - statusOrder[a.status as keyof typeof statusOrder];
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    setFilteredWarnings(filtered);
  }, [warnings, filters]);

  // 统计数据
  const stats = {
    total: warnings.length,
    active: warnings.filter(w => w.status === 'active').length,
    critical: warnings.filter(w => w.severity === 'critical').length,
    high: warnings.filter(w => w.severity === 'high').length,
    resolved: warnings.filter(w => w.status === 'resolved').length,
    totalCost: warnings.reduce((sum, warning) => sum + (warning.estimatedCost || 0), 0)
  };

  // 按类型统计
  const typeStats = warnings.reduce((acc, warning) => {
    acc[warning.warningType] = (acc[warning.warningType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 按设备分类统计
  const categoryStats = hotelDevices.reduce((acc, device) => {
    const deviceWarnings = warnings.filter(w => w.deviceId === device.id);
    if (deviceWarnings.length > 0) {
      acc[device.category] = (acc[device.category] || 0) + deviceWarnings.length;
    }
    return acc;
  }, {} as Record<string, number>);

  // 获取严重程度信息
  const getSeverityInfo = (severity: string) => {
    const config = {
      critical: { color: '#ff4d4f', bgColor: '#fff1f0', icon: <ExclamationCircleOutlined />, text: '严重' },
      high: { color: '#fa8c16', bgColor: '#fff7e6', icon: <WarningOutlined />, text: '高' },
      medium: { color: '#fadb14', bgColor: '#feffe6', icon: <AlertOutlined />, text: '中' },
      low: { color: '#52c41a', bgColor: '#f6ffed', icon: <ClockCircleOutlined />, text: '低' }
    };
    return config[severity as keyof typeof config];
  };

  // 获取状态信息
  const getStatusInfo = (status: string) => {
    const config = {
      active: { color: '#ff4d4f', text: '活跃', icon: <SyncOutlined spin /> },
      acknowledged: { color: '#fa8c16', text: '已确认', icon: <ClockCircleOutlined /> },
      resolved: { color: '#52c41a', text: '已解决', icon: <CheckCircleOutlined /> },
      false_alarm: { color: '#d9d9d9', text: '误报', icon: <CloseCircleOutlined /> }
    };
    return config[status as keyof typeof config];
  };

  // 获取预警类型信息
  const getWarningTypeInfo = (type: string) => {
    const config = {
      temperature_abnormal: { name: '温度异常', icon: <FireOutlined />, color: '#fa8c16' },
      power_failure: { name: '电源故障', icon: <PoweroffOutlined />, color: '#ff4d4f' },
      sensor_error: { name: '传感器错误', icon: <BugOutlined />, color: '#722ed1' },
      maintenance_due: { name: '维护到期', icon: <ToolOutlined />, color: '#1890ff' },
      energy_overconsumption: { name: '能耗过高', icon: <ThunderboltOutlined />, color: '#fadb14' }
    };
    return config[type as keyof typeof config] || { name: type, icon: <WarningOutlined />, color: '#666' };
  };

  // 获取设备分类图标
  const getCategoryIcon = (category: string) => {
    const icons = {
      hvac: <FireOutlined />,
      lighting: <WifiOutlined />,
      security: <LockOutlined />,
      entertainment: <CameraOutlined />,
      comfort: <HomeOutlined />,
      service: <RobotOutlined />,
      safety: <SafetyOutlined />
    };
    return icons[category as keyof typeof icons] || <SettingOutlined />;
  };

  // 处理预警
  const handleWarning = (warning: FaultWarning, action: string) => {
    const updatedWarnings = warnings.map(w => {
      if (w.id === warning.id) {
        return { ...w, status: action as 'acknowledged' | 'resolved' | 'false_alarm' };
      }
      return w;
    });
    setWarnings(updatedWarnings);
    
    notification.success({
      message: '预警处理成功',
      description: `已${action === 'acknowledged' ? '确认' : action === 'resolved' ? '解决' : '标记为误报'}预警: ${warning.deviceName}`,
      placement: 'topRight',
      duration: 3
    });
    
    setProcessingModalVisible(false);
    setDetailModalVisible(false);
    processingForm.resetFields();
  };

  // 查看处理历史
  const viewHistory = (warningId: string) => {
    const history = warningRecords.filter(record => record.warningId === warningId);
    setSelectedWarningHistory(history);
    setHistoryDrawerVisible(true);
  };

  // 表格列配置
  const columns = [
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      width: 80,
      render: (severity: string) => {
        const info = getSeverityInfo(severity);
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '100%', 
              height: '4px', 
              backgroundColor: info.color,
              marginBottom: '4px',
              borderRadius: '2px'
            }} />
            <Text style={{ fontSize: '11px', color: info.color, fontWeight: 'bold' }}>
              {info.text}
            </Text>
          </div>
        );
      },
    },
    {
      title: '预警信息',
      key: 'warning',
      width: 280,
      render: (text: any, record: FaultWarning) => {
        const typeInfo = getWarningTypeInfo(record.warningType);
        const device = hotelDevices.find(d => d.id === record.deviceId);
        return (
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '2px', fontSize: '13px' }}>
              <Space size={4}>
                <span style={{ color: typeInfo.color }}>{typeInfo.icon}</span>
                {record.deviceName}
              </Space>
            </div>
            <div style={{ fontSize: '11px', color: '#666', marginBottom: '2px' }}>
              <Space size={4}>
                <EnvironmentOutlined />
                {record.roomNumber}
                {device && (
                  <>
                    <Divider type="vertical" style={{ margin: '0 4px' }} />
                    {getCategoryIcon(device.category)}
                    {device.category}
                  </>
                )}
              </Space>
            </div>
            <div style={{ fontSize: '11px', color: '#999' }}>
              {dayjs(record.timestamp).format('MM-DD HH:mm')} ({dayjs(record.timestamp).fromNow()})
            </div>
          </div>
        );
      },
    },
    {
      title: '问题描述',
      dataIndex: 'description',
      key: 'description',
      width: 220,
      render: (description: string) => (
        <Tooltip title={description}>
          <Text ellipsis style={{ fontSize: '12px', display: 'block', lineHeight: '1.4' }}>
            {description}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => {
        const info = getStatusInfo(status);
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: info.color, fontSize: '16px', marginBottom: '2px' }}>
              {info.icon}
            </div>
            <Text style={{ fontSize: '11px', color: info.color }}>
              {info.text}
            </Text>
          </div>
        );
      },
    },
    {
      title: '预计成本',
      dataIndex: 'estimatedCost',
      key: 'estimatedCost',
      width: 80,
      render: (cost: number) => cost ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#ff4d4f' }}>
            ¥{cost}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: '#ccc' }}>-</div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      render: (text: any, record: FaultWarning) => (
        <Space size={2}>
          <Button 
            type="text" 
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedWarning(record);
              setDetailModalVisible(true);
            }}
          />
          <Button 
            type="text" 
            size="small"
            icon={<HistoryOutlined />}
            onClick={() => viewHistory(record.id)}
          />
          {record.status === 'active' && (
            <Button
              type="primary"
              size="small"
              icon={<ToolOutlined />}
              onClick={() => {
                setSelectedWarning(record);
                setProcessingModalVisible(true);
              }}
            >
              处理
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 12px' }}>
      {/* 紧急预警提示 */}
      {stats.critical > 0 && (
        <Alert
          message={`紧急: ${stats.critical} 个严重预警需要立即处理！`}
          type="error"
          showIcon
          style={{ marginBottom: '8px' }}
          action={
            <Space size={4}>
              <Button size="small" type="primary" danger>立即处理</Button>
              <Button size="small" icon={<PhoneOutlined />}>联系维修</Button>
            </Space>
          }
        />
      )}

      {/* 紧凑统计卡片 */}
      <Row gutter={8} style={{ marginBottom: '8px' }}>
        <Col span={4}>
          <Card size="small" style={{ textAlign: 'center', padding: '8px 0' }}>
            <Statistic
              title="总预警"
              value={stats.total}
              prefix={<WarningOutlined />}
              valueStyle={{ fontSize: '20px', color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small" style={{ textAlign: 'center', padding: '8px 0' }}>
            <Statistic
              title="活跃"
              value={stats.active}
              prefix={<AlertOutlined />}
              valueStyle={{ fontSize: '20px', color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small" style={{ textAlign: 'center', padding: '8px 0' }}>
            <Statistic
              title="严重/高级"
              value={stats.critical + stats.high}
              suffix={`/${stats.total}`}
              valueStyle={{ fontSize: '20px', color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small" style={{ textAlign: 'center', padding: '8px 0' }}>
            <Statistic
              title="已解决"
              value={stats.resolved}
              valueStyle={{ fontSize: '20px', color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small" style={{ textAlign: 'center', padding: '8px 0' }}>
            <Statistic
              title="解决率"
              value={Math.round((stats.resolved / stats.total) * 100)}
              suffix="%"
              valueStyle={{ fontSize: '20px', color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small" style={{ textAlign: 'center', padding: '8px 0' }}>
            <Statistic
              title="预计成本"
              value={stats.totalCost}
              prefix="¥"
              valueStyle={{ fontSize: '20px', color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 快速统计 */}
      <Row gutter={8} style={{ marginBottom: '8px' }}>
        <Col span={12}>
          <Card size="small" title="预警类型分布" style={{ height: '120px' }}>
            <Row gutter={4}>
              {Object.entries(typeStats).map(([type, count]) => {
                const info = getWarningTypeInfo(type);
                return (
                  <Col span={12} key={type} style={{ marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px' }}>
                      <span style={{ color: info.color, marginRight: '4px' }}>{info.icon}</span>
                      <span style={{ flex: 1 }}>{info.name}</span>
                      <Badge count={count} style={{ backgroundColor: info.color }} />
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" title="设备分类分布" style={{ height: '120px' }}>
            <Row gutter={4}>
              {Object.entries(categoryStats).map(([category, count]) => (
                <Col span={12} key={category} style={{ marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px' }}>
                    <span style={{ color: '#1890ff', marginRight: '4px' }}>{getCategoryIcon(category)}</span>
                    <span style={{ flex: 1 }}>{category}</span>
                    <Badge count={count} />
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 紧凑筛选器 */}
      <Card size="small" style={{ marginBottom: '8px' }}>
        <Row gutter={8} align="middle">
          <Col span={3}>
            <Select
              size="small"
              placeholder="严重程度"
              style={{ width: '100%' }}
              allowClear
              value={filters.severity}
              onChange={(value) => setFilters({...filters, severity: value})}
            >
              <Option value="critical">严重</Option>
              <Option value="high">高</Option>
              <Option value="medium">中</Option>
              <Option value="low">低</Option>
            </Select>
          </Col>
          <Col span={3}>
            <Select
              size="small"
              placeholder="处理状态"
              style={{ width: '100%' }}
              allowClear
              value={filters.status}
              onChange={(value) => setFilters({...filters, status: value})}
            >
              <Option value="active">活跃</Option>
              <Option value="acknowledged">已确认</Option>
              <Option value="resolved">已解决</Option>
              <Option value="false_alarm">误报</Option>
            </Select>
          </Col>
          <Col span={3}>
            <Select
              size="small"
              placeholder="预警类型"
              style={{ width: '100%' }}
              allowClear
              value={filters.type}
              onChange={(value) => setFilters({...filters, type: value})}
            >
              <Option value="temperature_abnormal">温度异常</Option>
              <Option value="power_failure">电源故障</Option>
              <Option value="sensor_error">传感器错误</Option>
              <Option value="maintenance_due">维护到期</Option>
              <Option value="energy_overconsumption">能耗过高</Option>
            </Select>
          </Col>
          <Col span={3}>
            <Select
              size="small"
              placeholder="楼层"
              style={{ width: '100%' }}
              allowClear
              value={filters.floor}
              onChange={(value) => setFilters({...filters, floor: value})}
            >
              <Option value="-1">地下1层</Option>
              <Option value="1">1层</Option>
              <Option value="2">2层</Option>
              <Option value="3">3层</Option>
              <Option value="4">4层</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Search
              size="small"
              placeholder="搜索设备、房间或描述"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              enterButton
            />
          </Col>
          <Col span={3}>
            <Space size={4}>
              <Button 
                size="small"
                icon={<ReloadOutlined />}
                onClick={() => setFilters({
                  severity: null,
                  status: null,
                  type: null,
                  category: null,
                  floor: null,
                  search: ''
                })}
              >
                重置
              </Button>
              <Button size="small" icon={<ExportOutlined />}>导出</Button>
            </Space>
          </Col>
          <Col span={3}>
            <Space>
              <Text style={{ fontSize: '11px' }}>表格大小:</Text>
              <Radio.Group 
                size="small" 
                value={tableSize} 
                onChange={(e) => setTableSize(e.target.value)}
              >
                <Radio.Button value="small">紧凑</Radio.Button>
                <Radio.Button value="middle">标准</Radio.Button>
              </Radio.Group>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 主表格 */}
      <Card 
        size="small"
        title={
          <Space>
            <MonitorOutlined />
            故障预警列表
            <Badge count={filteredWarnings.length} style={{ backgroundColor: '#52c41a' }} />
            <Divider type="vertical" />
            <Badge status="error" text={`活跃: ${filteredWarnings.filter(w => w.status === 'active').length}`} />
            <Badge status="processing" text={`处理中: ${filteredWarnings.filter(w => w.status === 'acknowledged').length}`} />
            <Badge status="success" text={`已解决: ${filteredWarnings.filter(w => w.status === 'resolved').length}`} />
          </Space>
        }
        extra={
          <Space size={4}>
            <Button size="small" icon={<PrinterOutlined />}>打印</Button>
            <Button size="small" icon={<PhoneOutlined />}>联系维修</Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredWarnings}
          rowKey="id"
          size={tableSize}
          pagination={{
            size: 'small',
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            pageSizeOptions: ['20', '50', '100']
          }}
          scroll={{ x: 900, y: 400 }}
          rowClassName={(record) => {
            if (record.severity === 'critical') return 'critical-warning-row';
            if (record.status === 'active' && record.severity === 'high') return 'high-warning-row';
            return '';
          }}
        />
      </Card>

      {/* 预警详情弹窗 */}
      <Modal
        title={
          <Space>
            <WarningOutlined style={{ color: '#fa8c16' }} />
            预警详情
            {selectedWarning && (
              <Tag color={getSeverityInfo(selectedWarning.severity).color}>
                {getSeverityInfo(selectedWarning.severity).text}
              </Tag>
            )}
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={
          selectedWarning && selectedWarning.status === 'active' ? [
            <Button key="false_alarm" onClick={() => handleWarning(selectedWarning, 'false_alarm')}>
              标记为误报
            </Button>,
            <Button key="acknowledge" type="default" onClick={() => handleWarning(selectedWarning, 'acknowledged')}>
              确认预警
            </Button>,
            <Button key="resolve" type="primary" onClick={() => handleWarning(selectedWarning, 'resolved')}>
              标记已解决
            </Button>
          ] : null
        }
        width={700}
      >
        {selectedWarning && (
          <div>
            <Alert
              message={selectedWarning.description}
              type={selectedWarning.severity === 'critical' ? 'error' : 'warning'}
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="预警ID" span={2}>
                <Text code>{selectedWarning.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="设备名称">{selectedWarning.deviceName}</Descriptions.Item>
              <Descriptions.Item label="房间号">{selectedWarning.roomNumber}</Descriptions.Item>
              <Descriptions.Item label="预警类型" span={2}>
                {(() => {
                  const typeInfo = getWarningTypeInfo(selectedWarning.warningType);
                  return (
                    <Tag color={typeInfo.color} icon={typeInfo.icon}>
                      {typeInfo.name}
                    </Tag>
                  );
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="严重程度">
                {(() => {
                  const info = getSeverityInfo(selectedWarning.severity);
                  return <Tag color={info.color}>{info.text}</Tag>;
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                {(() => {
                  const info = getStatusInfo(selectedWarning.status);
                  return <Tag color={info.color}>{info.text}</Tag>;
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="预警时间" span={2}>
                {dayjs(selectedWarning.timestamp).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              {selectedWarning.predictedFailureTime && (
                <Descriptions.Item label="预计故障时间" span={2}>
                  <Tag color="orange">{selectedWarning.predictedFailureTime}</Tag>
                </Descriptions.Item>
              )}
              <Descriptions.Item label="建议措施" span={2}>
                <Alert message={selectedWarning.recommendedAction} type="info" showIcon />
              </Descriptions.Item>
              {selectedWarning.estimatedCost && (
                <Descriptions.Item label="预计维修成本" span={2}>
                  <Tag color="red">¥{selectedWarning.estimatedCost}</Tag>
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* 预警处理弹窗 */}
      <Modal
        title="处理预警"
        open={processingModalVisible}
        onCancel={() => setProcessingModalVisible(false)}
        footer={null}
        width={500}
      >
        {selectedWarning && (
          <div>
            <Alert
              message={`正在处理: ${selectedWarning.deviceName}`}
              description={selectedWarning.description}
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Form form={processingForm} layout="vertical" size="small">
              <Form.Item label="处理操作" name="action" initialValue="acknowledged">
                <Select>
                  <Option value="acknowledged">确认预警</Option>
                  <Option value="resolved">标记已解决</Option>
                  <Option value="false_alarm">标记为误报</Option>
                </Select>
              </Form.Item>
              
              <Form.Item label="处理备注" name="comment">
                <TextArea rows={3} placeholder="请输入处理备注..." />
              </Form.Item>
              
              <Form.Item>
                <Space>
                  <Button 
                    type="primary" 
                    onClick={() => {
                      const action = processingForm.getFieldValue('action');
                      handleWarning(selectedWarning, action);
                    }}
                  >
                    确认处理
                  </Button>
                  <Button onClick={() => setProcessingModalVisible(false)}>
                    取消
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>

      {/* 处理历史抽屉 */}
      <Drawer
        title="处理历史记录"
        placement="right"
        width={400}
        open={historyDrawerVisible}
        onClose={() => setHistoryDrawerVisible(false)}
      >
        {selectedWarningHistory.length > 0 ? (
          <List
            size="small"
            dataSource={selectedWarningHistory}
            renderItem={(record) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar size="small" icon={<UserOutlined />} />}
                  title={
                    <Space>
                      <Text strong style={{ fontSize: '12px' }}>{record.operator}</Text>
                                             <Tag 
                         color={
                           record.action === 'resolved' ? 'green' : 
                           record.action === 'acknowledged' ? 'orange' : 
                           record.action === 'false_alarm' ? 'gray' : 'blue'
                         }
                       >
                        {record.action === 'resolved' ? '已解决' :
                         record.action === 'acknowledged' ? '已确认' :
                         record.action === 'false_alarm' ? '误报' : '已分配'}
                      </Tag>
                    </Space>
                  }
                  description={
                    <div>
                      <div style={{ fontSize: '11px', color: '#999' }}>
                        {dayjs(record.timestamp).format('YYYY-MM-DD HH:mm:ss')}
                      </div>
                      {record.comment && (
                        <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                          {record.comment}
                        </div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="暂无处理记录" />
        )}
      </Drawer>
    </div>
  );
};

export default FaultWarningPage;

// 添加样式
const styles = `
  .critical-warning-row {
    background-color: #fff2f0 !important;
    border-left: 3px solid #ff4d4f !important;
  }
  
  .high-warning-row {
    background-color: #fff7e6 !important;
    border-left: 3px solid #fa8c16 !important;
  }
  
  .ant-card-small > .ant-card-head {
    min-height: 38px;
    padding: 0 12px;
    font-size: 13px;
  }
  
  .ant-card-small > .ant-card-body {
    padding: 12px;
  }
  
  .ant-table-small {
    font-size: 12px;
  }
  
  .ant-table-small .ant-table-thead > tr > th {
    padding: 8px 8px;
    font-size: 12px;
  }
  
  .ant-table-small .ant-table-tbody > tr > td {
    padding: 6px 8px;
  }
`;

// 动态添加样式
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
} 