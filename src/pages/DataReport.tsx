import React, { useState } from 'react';
import { Row, Col, Card, Table, Button, Modal, Form, Input, Select, DatePicker, Tag, Space } from 'antd';
import { 
  UploadOutlined, 
  DownloadOutlined,
  FileTextOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { dataRecords } from '../data/mockData';

const { RangePicker } = DatePicker;
const { Option } = Select;

const DataReport: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleExport = () => {
    console.log('导出数据报告');
  };

  const handleUploadReport = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(() => {
      console.log('上传数据报告:', form.getFieldsValue());
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  // 数据记录列定义
  const columns = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      key: 'dataType',
      render: (type: string) => {
        const typeMap = {
          temperature: { color: 'orange', text: '温度' },
          humidity: { color: 'blue', text: '湿度' },
          pressure: { color: 'purple', text: '压力' },
          vibration: { color: 'green', text: '振动' },
          voltage: { color: 'red', text: '电压' },
        };
        const config = typeMap[type as keyof typeof typeMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '数值',
      dataIndex: 'value',
      key: 'value',
      render: (value: number, record: any) => `${value} ${record.unit}`,
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '上报时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
    {
      title: '状态',
      key: 'status',
      render: () => <Tag color="green">已上报</Tag>,
    },
  ];

  return (
    <div>
      <h2>数据上报管理</h2>
      
      {/* 统计概览 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                {dataRecords.length}
              </div>
              <div>今日上报数据</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                {dataRecords.filter(d => d.dataType === 'temperature').length}
              </div>
              <div>温度数据</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}>
                {dataRecords.filter(d => d.dataType === 'humidity').length}
              </div>
              <div>湿度数据</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#fa541c' }}>
                {dataRecords.filter(d => d.dataType === 'voltage').length}
              </div>
              <div>电压数据</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 数据上报列表 */}
      <Card 
        title="数据上报记录" 
        extra={
          <Space>
            <Button 
              type="primary" 
              icon={<UploadOutlined />}
              onClick={handleUploadReport}
            >
              手动上报
            </Button>
            <Button 
              icon={<DownloadOutlined />}
              onClick={handleExport}
            >
              导出报告
            </Button>
          </Space>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Select placeholder="选择数据类型" style={{ width: 120 }}>
              <Option value="temperature">温度</Option>
              <Option value="humidity">湿度</Option>
              <Option value="pressure">压力</Option>
              <Option value="vibration">振动</Option>
              <Option value="voltage">电压</Option>
            </Select>
            <RangePicker placeholder={['开始时间', '结束时间']} />
            <Button type="primary">查询</Button>
          </Space>
        </div>
        
        <Table
          dataSource={dataRecords}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 上报数据模态框 */}
      <Modal
        title="手动上报数据"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="deviceId"
            label="设备选择"
            rules={[{ required: true, message: '请选择设备' }]}
          >
            <Select placeholder="请选择设备">
              <Option value="dev001">高清摄像头-01</Option>
              <Option value="dev002">语音对讲机-01</Option>
              <Option value="dev003">温湿度传感器-01</Option>
              <Option value="dev004">远程控制器-01</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="dataType"
            label="数据类型"
            rules={[{ required: true, message: '请选择数据类型' }]}
          >
            <Select placeholder="请选择数据类型">
              <Option value="temperature">温度</Option>
              <Option value="humidity">湿度</Option>
              <Option value="pressure">压力</Option>
              <Option value="vibration">振动</Option>
              <Option value="voltage">电压</Option>
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="value"
                label="数值"
                rules={[{ required: true, message: '请输入数值' }]}
              >
                <Input placeholder="请输入数值" type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="unit"
                label="单位"
                rules={[{ required: true, message: '请输入单位' }]}
              >
                <Input placeholder="如: °C, %, V" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="location"
            label="位置"
            rules={[{ required: true, message: '请输入位置' }]}
          >
            <Input placeholder="请输入设备位置" />
          </Form.Item>

          <Form.Item
            name="timestamp"
            label="采集时间"
            rules={[{ required: true, message: '请选择采集时间' }]}
          >
            <DatePicker 
              showTime 
              placeholder="选择采集时间"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataReport; 