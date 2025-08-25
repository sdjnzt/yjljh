import React, { useState } from 'react';
import { Row, Col, Card, Table, Tag, Button, Modal, Form, Input, Select, Space, Alert, Timeline } from 'antd';
import { 
  SafetyOutlined, 
  FireOutlined, 
  ExperimentOutlined,
  UserDeleteOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { safetyEvents } from '../data/mockData';

const { TextArea } = Input;
const { Option } = Select;

const SafetyManagement: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [form] = Form.useForm();

  const handleProcessEvent = (event: any) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(() => {
      console.log('处理安全事件:', form.getFieldsValue());
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  // 安全事件列定义
  const columns = [
    {
      title: '事件类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeConfig = {
          fire: { color: 'red', text: '火灾', icon: <FireOutlined /> },
          gas: { color: 'orange', text: '气体泄漏', icon: <ExperimentOutlined /> },
          intrusion: { color: 'purple', text: '入侵检测', icon: <UserDeleteOutlined /> },
          emergency: { color: 'volcano', text: '紧急情况', icon: <ExclamationCircleOutlined /> },
        };
        const config = typeConfig[type as keyof typeof typeConfig];
        return (
          <Space>
            {config.icon}
            <Tag color={config.color}>{config.text}</Tag>
          </Space>
        );
      },
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => {
        const severityConfig = {
          low: { color: 'green', text: '低' },
          medium: { color: 'orange', text: '中' },
          high: { color: 'red', text: '高' },
          critical: { color: 'purple', text: '严重' },
        };
        const config = severityConfig[severity as keyof typeof severityConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          active: { color: 'red', text: '活跃', icon: <ExclamationCircleOutlined /> },
          investigating: { color: 'orange', text: '调查中', icon: <ClockCircleOutlined /> },
          resolved: { color: 'green', text: '已解决', icon: <CheckCircleOutlined /> },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
          <Space>
            {config.icon}
            <Tag color={config.color}>{config.text}</Tag>
          </Space>
        );
      },
    },
    {
      title: '发生时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Button 
          type="primary" 
          size="small"
          onClick={() => handleProcessEvent(record)}
          disabled={record.status === 'resolved'}
        >
          {record.status === 'resolved' ? '已处理' : '处理'}
        </Button>
      ),
    },
  ];

  // 统计活跃事件
  const activeEvents = safetyEvents.filter(e => e.status === 'active');
  const investigatingEvents = safetyEvents.filter(e => e.status === 'investigating');
  const resolvedEvents = safetyEvents.filter(e => e.status === 'resolved');

  return (
    <div>
      <h2>安全管理中心</h2>
      
      {/* 告警横幅 */}
      {activeEvents.length > 0 && (
        <Alert
          message={`当前有 ${activeEvents.length} 个活跃安全事件需要处理`}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
          action={
            <Button size="small" type="primary" danger>
              立即处理
            </Button>
          }
        />
      )}

      {/* 统计概览 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ff4d4f' }}>
                {activeEvents.length}
              </div>
              <div>活跃事件</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>
                {investigatingEvents.length}
              </div>
              <div>调查中</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                {resolvedEvents.length}
              </div>
              <div>已解决</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                {safetyEvents.length}
              </div>
              <div>总事件数</div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 安全事件列表 */}
        <Col span={16}>
          <Card title="安全事件列表">
            <Table
              dataSource={safetyEvents}
              columns={columns}
              pagination={{ pageSize: 8 }}
              scroll={{ x: 1000 }}
            />
          </Card>
        </Col>

        {/* 应急响应时间线 */}
        <Col span={8}>
          <Card title="应急响应时间线" style={{ height: 600, overflow: 'auto' }}>
            <Timeline>
              <Timeline.Item color="red">
                <p>14:15 - 检测到气体泄漏</p>
                <p style={{ fontSize: 12, color: '#666' }}>生产车间B区</p>
              </Timeline.Item>
              <Timeline.Item color="orange">
                <p>14:16 - 启动应急预案</p>
                <p style={{ fontSize: 12, color: '#666' }}>自动通知相关人员</p>
              </Timeline.Item>
              <Timeline.Item color="blue">
                <p>14:18 - 安全人员到达现场</p>
                <p style={{ fontSize: 12, color: '#666' }}>开始现场评估</p>
              </Timeline.Item>
              <Timeline.Item color="green">
                <p>14:10 - 配电室火警已解决</p>
                <p style={{ fontSize: 12, color: '#666' }}>消防系统正常工作</p>
              </Timeline.Item>
              <Timeline.Item color="green">
                <p>13:45 - 入侵误报已确认</p>
                <p style={{ fontSize: 12, color: '#666' }}>仓库A区安全</p>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>
      </Row>

      {/* 处理事件模态框 */}
      <Modal
        title={`处理安全事件 - ${selectedEvent?.type}`}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        {selectedEvent && (
          <div>
            <div style={{ marginBottom: 16, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
              <div><strong>事件类型:</strong> {selectedEvent.type}</div>
              <div><strong>位置:</strong> {selectedEvent.location}</div>
              <div><strong>严重程度:</strong> {selectedEvent.severity}</div>
              <div><strong>描述:</strong> {selectedEvent.description}</div>
            </div>
            
            <Form form={form} layout="vertical">
              <Form.Item
                name="action"
                label="处理措施"
                rules={[{ required: true, message: '请选择处理措施' }]}
              >
                <Select placeholder="请选择处理措施">
                  <Option value="investigate">开始调查</Option>
                  <Option value="emergency">启动应急预案</Option>
                  <Option value="dispatch">派遣人员</Option>
                  <Option value="resolve">标记为已解决</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="assignee"
                label="指派给"
              >
                <Select placeholder="选择负责人">
                  <Option value="张三">张三 - 安全主管</Option>
                  <Option value="李四">李四 - 技术工程师</Option>
                  <Option value="王五">王五 - 车间主任</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="notes"
                label="处理备注"
              >
                <TextArea 
                  rows={4} 
                  placeholder="请输入处理备注或说明..."
                />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SafetyManagement; 