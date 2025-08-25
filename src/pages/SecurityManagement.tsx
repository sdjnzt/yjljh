import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  message,
  Progress,
  Alert,
  Timeline,
  Badge
} from 'antd';
import {
  SecurityScanOutlined,
  CameraOutlined,
  AlertOutlined,
  SafetyOutlined,
  EyeOutlined,
  LockOutlined,
  BellOutlined,
  VideoCameraOutlined,

  FireOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const { Option } = Select;
const { RangePicker } = DatePicker;

/**
 * 安防管理页面
 * 包含安防设备监控、报警管理、视频监控等功能
 */
const SecurityManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [securityData, setSecurityData] = useState<any[]>([]);
  const [alarmData, setAlarmData] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filters, setFilters] = useState<{ type?: string; status?: string; range?: any }>(() => ({}));
  const [processVisible, setProcessVisible] = useState(false);
  const [currentAlarm, setCurrentAlarm] = useState<any>(null);
  const [form] = Form.useForm();

  // 模拟安防数据
  useEffect(() => {
    const mockSecurityData = [
      {
        id: 1,
        deviceName: '前厅监控摄像头',
        deviceType: '摄像头',
        status: 'online',
        location: '前厅',
        lastUpdate: '2025-01-15 14:30:00',
        battery: 85,
        signal: 95
      },
      {
        id: 2,
        deviceName: '停车场门禁',
        deviceType: '门禁',
        status: 'online',
        location: '停车场',
        lastUpdate: '2025-01-15 14:28:00',
        battery: 92,
        signal: 88
      },
      {
        id: 3,
        deviceName: '后厨烟雾报警器',
        deviceType: '烟雾报警器',
        status: 'warning',
        location: '后厨',
        lastUpdate: '2025-01-15 14:25:00',
        battery: 45,
        signal: 78
      },
      {
        id: 4,
        deviceName: '客房走廊监控',
        deviceType: '摄像头',
        status: 'offline',
        location: '客房走廊',
        lastUpdate: '2025-01-15 14:20:00',
        battery: 0,
        signal: 0
      }
    ];

    const mockAlarmData = [
      {
        id: 1,
        type: 'fire',
        level: 'high',
        location: '后厨',
        description: '检测到烟雾浓度异常',
        time: '2025-01-15 14:25:00',
        status: 'pending'
      },
      {
        id: 2,
        type: 'intrusion',
        level: 'medium',
        location: '停车场',
        description: '检测到可疑人员活动',
        time: '2025-01-15 14:15:00',
        status: 'handled'
      },
      {
        id: 3,
        type: 'equipment',
        level: 'low',
        location: '客房走廊',
        description: '监控设备离线',
        time: '2025-01-15 14:20:00',
        status: 'pending'
      }
    ];

    setSecurityData(mockSecurityData);
    setAlarmData(mockAlarmData);
  }, []);

  // 安防设备表格列定义
  const securityColumns = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
    },
    {
      title: '设备类型',
      dataIndex: 'deviceType',
      key: 'deviceType',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          online: { color: 'green', text: '在线' },
          offline: { color: 'red', text: '离线' },
          warning: { color: 'orange', text: '警告' }
        };
        const { color, text } = statusMap[status as keyof typeof statusMap] || { color: 'default', text: status };
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
    },
    {
      title: '电池电量',
      dataIndex: 'battery',
      key: 'battery',
      render: (battery: number) => (
        <Progress 
          percent={battery} 
          size="small" 
          status={battery < 20 ? 'exception' : battery < 50 ? 'normal' : 'success'}
        />
      )
    },
    {
      title: '信号强度',
      dataIndex: 'signal',
      key: 'signal',
      render: (signal: number) => (
        <Progress 
          percent={signal} 
          size="small" 
          status={signal < 50 ? 'exception' : signal < 80 ? 'normal' : 'success'}
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" size="small">查看详情</Button>
          <Button type="link" size="small">远程控制</Button>
        </Space>
      ),
    },
  ];

  // 报警记录表格列定义
  const alarmColumns = [
    {
      title: '报警类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap = {
          fire: { color: 'red', text: '火警', icon: <FireOutlined /> },
          intrusion: { color: 'orange', text: '入侵', icon: <AlertOutlined /> },
          equipment: { color: 'blue', text: '设备', icon: <EyeOutlined /> }
        };
        const { color, text, icon } = typeMap[type as keyof typeof typeMap] || { color: 'default', text: type, icon: null };
        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      }
    },
    {
      title: '报警级别',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => {
        const levelMap = {
          high: { color: 'red', text: '高' },
          medium: { color: 'orange', text: '中' },
          low: { color: 'blue', text: '低' }
        };
        const { color, text } = levelMap[level as keyof typeof levelMap] || { color: 'default', text: level };
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          pending: { color: 'red', text: '待处理' },
          handling: { color: 'orange', text: '处理中' },
          handled: { color: 'green', text: '已处理' }
        };
        const { color, text } = statusMap[status as keyof typeof statusMap] || { color: 'default', text: status };
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" size="small">查看详情</Button>
          <Button type="link" size="small">处理报警</Button>
        </Space>
      ),
    },
  ];

  // 处理添加设备
  const handleAddDevice = () => {
    setIsModalVisible(true);
  };

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('设备添加成功');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('设备添加失败');
    } finally {
      setLoading(false);
    }
  };

  // 过滤后的数据
  const filteredSecurityData = securityData.filter(item => {
    const typeOk = filters.type ? item.deviceType === filters.type : true;
    const statusOk = filters.status ? item.status === filters.status : true;
    // 示例数据不含时间，若有 range 可在此匹配
    return typeOk && statusOk;
  });

  const filteredAlarmData = alarmData; // 可根据 filters.range 扩展时间筛选

  // ECharts 统计图表配置
  const securityTrendOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 30, bottom: 30 },
    xAxis: {
      type: 'category',
      data: ['00:00','04:00','08:00','12:00','16:00','20:00','24:00']
    },
    yAxis: { type: 'value', name: '设备健康度' },
    series: [
      {
        name: '健康度',
        type: 'line',
        smooth: true,
        data: [85,88,92,89,94,91,87],
        itemStyle: { color: '#1890ff' },
        areaStyle: { color: 'rgba(24,144,255,0.15)' }
      }
    ]
  };

  const statusCounts = (() => {
    const online = filteredSecurityData.filter(i => i.status === 'online').length;
    const offline = filteredSecurityData.filter(i => i.status === 'offline').length;
    const warning = filteredSecurityData.filter(i => i.status === 'warning').length;
    return { online, offline, warning };
  })();

  const deviceStatusOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        name: '设备状态',
        type: 'pie',
        radius: ['40%','70%'],
        avoidLabelOverlap: false,
        label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
        labelLine: { show: false },
        data: [
          { value: statusCounts.online, name: '在线', itemStyle: { color: '#52c41a' } },
          { value: statusCounts.offline, name: '离线', itemStyle: { color: '#ff4d4f' } },
          { value: statusCounts.warning, name: '警告', itemStyle: { color: '#faad14' } }
        ]
      }
    ]
  };

  return (
    <div className="security-management">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
          <SecurityScanOutlined style={{ marginRight: '8px' }} />
          安防管理系统
        </h1>
        <p style={{ color: '#666', fontSize: '14px' }}>
          实时监控酒店安防设备状态，管理报警信息，确保酒店安全
        </p>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线设备"
              value={filteredSecurityData.filter(item => item.status === 'online').length}
              prefix={<SafetyOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="离线设备"
              value={filteredSecurityData.filter(item => item.status === 'offline').length}
              prefix={<EyeOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待处理报警"
              value={filteredAlarmData.filter(item => item.status === 'pending').length}
              prefix={<AlertOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日报警"
              value={filteredAlarmData.length}
              prefix={<BellOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选区 */}
      <Card style={{ marginBottom: 16 }}>
        <Form layout="inline">
          <Form.Item label="设备类型">
            <Select
              allowClear
              placeholder="全部类型"
              style={{ width: 160 }}
              value={filters.type}
              onChange={(v) => setFilters(prev => ({ ...prev, type: v }))}
            >
              <Option value="摄像头">摄像头</Option>
              <Option value="门禁">门禁</Option>
              <Option value="烟雾报警器">烟雾报警器</Option>
              <Option value="红外感应器">红外感应器</Option>
            </Select>
          </Form.Item>
          <Form.Item label="设备状态">
            <Select
              allowClear
              placeholder="全部状态"
              style={{ width: 160 }}
              value={filters.status}
              onChange={(v) => setFilters(prev => ({ ...prev, status: v }))}
            >
              <Option value="online">在线</Option>
              <Option value="offline">离线</Option>
              <Option value="warning">警告</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={() => setFilters({})}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 图表区域 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={16}>
          <Card title="安防设备状态趋势" extra={<Button type="link">查看详情</Button>}>
            <ReactECharts option={securityTrendOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="设备状态分布">
            <ReactECharts option={deviceStatusOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      {/* 实时报警 */}
      <Card 
        title={
          <Space>
            <AlertOutlined style={{ color: '#ff4d4f' }} />
            实时报警
            <Badge count={filteredAlarmData.filter(item => item.status === 'pending').length} />
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Timeline>
          {filteredAlarmData.slice(0, 5).map(alarm => (
            <Timeline.Item 
              key={alarm.id}
              color={alarm.level === 'high' ? 'red' : alarm.level === 'medium' ? 'orange' : 'blue'}
            >
              <p style={{ margin: 0 }}>
                <strong>{alarm.location}</strong> - {alarm.description}
              </p>
              <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>
                {alarm.time} | 级别: {alarm.level === 'high' ? '高' : alarm.level === 'medium' ? '中' : '低'}
              </p>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>

      {/* 安防设备管理 */}
      <Card 
        title="安防设备管理" 
        extra={
          <Button type="primary" icon={<SecurityScanOutlined />} onClick={handleAddDevice}>
            添加设备
          </Button>
        }
        style={{ marginBottom: 24 }}
      >
        <Table 
          columns={securityColumns} 
          dataSource={securityData} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 报警记录 */}
      <Card title="报警记录">
        <Table 
          columns={alarmColumns} 
          dataSource={filteredAlarmData} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 处理报警弹窗 */}
      <Modal
        title="处理报警"
        open={processVisible}
        onCancel={() => setProcessVisible(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={(values) => {
            message.success('报警处理已提交');
            setProcessVisible(false);
          }}
          initialValues={{ status: 'handling' }}
        >
          <Form.Item label="处理状态" name="status" rules={[{ required: true }] }>
            <Select>
              <Option value="handling">处理中</Option>
              <Option value="handled">已处理</Option>
            </Select>
          </Form.Item>
          <Form.Item label="处理备注" name="remark">
            <Input.TextArea rows={3} placeholder="填写处理说明" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={() => setProcessVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">提交</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 添加设备弹窗 */}
      <Modal
        title="添加安防设备"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="deviceName"
                label="设备名称"
                rules={[{ required: true, message: '请输入设备名称' }]}
              >
                <Input placeholder="请输入设备名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="deviceType"
                label="设备类型"
                rules={[{ required: true, message: '请选择设备类型' }]}
              >
                <Select placeholder="请选择设备类型">
                  <Option value="camera">摄像头</Option>
                  <Option value="access">门禁</Option>
                  <Option value="smoke">烟雾报警器</Option>
                  <Option value="motion">红外感应器</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="location"
                label="安装位置"
                rules={[{ required: true, message: '请输入安装位置' }]}
              >
                <Input placeholder="请输入安装位置" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="设备状态"
                rules={[{ required: true, message: '请选择设备状态' }]}
              >
                <Select placeholder="请选择设备状态">
                  <Option value="online">在线</Option>
                  <Option value="offline">离线</Option>
                  <Option value="maintenance">维护中</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                确认添加
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SecurityManagement;
