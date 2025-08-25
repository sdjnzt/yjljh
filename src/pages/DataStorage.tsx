import React, { useState, useEffect, useMemo } from 'react';
import { Card, Row, Col, Button, Space, Table, Tag, Modal, Form, Input, Select, Progress, message, Alert, Typography, Statistic, Checkbox, Tabs } from 'antd';
import {
  DatabaseOutlined,
  CloudOutlined,
  HddOutlined,
  SyncOutlined,
  DeleteOutlined,
  DownloadOutlined,
  SettingOutlined,
  EyeOutlined,
  ReloadOutlined,
  
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title, Text } = Typography;

/**
 * 数据存储管理页面
 * 包含存储监控、备份管理、数据清理等功能
 */
const DataStorage: React.FC = () => {
  const [storageData, setStorageData] = useState<any[]>([]);
  const [backupData, setBackupData] = useState<any[]>([]);
  const [isBackupModalVisible, setIsBackupModalVisible] = useState(false);
  const [isCleanupModalVisible, setIsCleanupModalVisible] = useState(false);
  const [backupForm] = Form.useForm();
  const [cleanupForm] = Form.useForm();

  // 模拟存储数据
  useEffect(() => {
    const now = dayjs().format('YYYY-MM-DD HH:mm');
    const mockStorageData = [
      {
        id: 1,
        name: '视频存储',
        type: 'video',
        totalSize: 2048, // GB
        usedSize: 1536,
        freeSize: 512,
        status: 'normal',
        location: '本地存储',
        lastUpdate: now
      },
      {
        id: 2,
        name: '音频存储',
        type: 'audio',
        totalSize: 512,
        usedSize: 128,
        freeSize: 384,
        status: 'normal',
        location: '本地存储',
        lastUpdate: now
      },
      {
        id: 3,
        name: '传感器数据',
        type: 'sensor',
        totalSize: 256,
        usedSize: 64,
        freeSize: 192,
        status: 'normal',
        location: '本地存储',
        lastUpdate: now
      },
      {
        id: 4,
        name: '系统日志',
        type: 'log',
        totalSize: 128,
        usedSize: 96,
        freeSize: 32,
      status: 'warning',
        location: '本地存储',
        lastUpdate: now
      },
      {
        id: 5,
        name: '云备份存储',
        type: 'backup',
        totalSize: 1024,
        usedSize: 512,
        freeSize: 512,
        status: 'normal',
        location: '云端存储',
        lastUpdate: now
      }
    ];

    const mockBackupData = [
      {
        id: 1,
        name: '完整备份_20250115',
      type: 'full',
        size: 512,
      status: 'completed',
        startTime: now,
        endTime: now,
        duration: '—',
        location: '云端存储'
      },
      {
        id: 2,
        name: '增量备份_20250114',
      type: 'incremental',
        size: 128,
      status: 'completed',
        startTime: now,
        endTime: now,
        duration: '—',
        location: '云端存储'
      },
      {
        id: 3,
        name: '差异备份_20250113',
      type: 'differential',
        size: 256,
      status: 'completed',
        startTime: now,
        endTime: now,
        duration: '—',
        location: '云端存储'
      },
      {
        id: 4,
        name: '完整备份_20250112',
      type: 'full',
        size: 480,
      status: 'completed',
        startTime: now,
        endTime: now,
        duration: '—',
        location: '云端存储'
      }
    ];

    setStorageData(mockStorageData);
    setBackupData(mockBackupData);
  }, []);

  // 处理备份创建
  const handleBackupSubmit = async (values: any) => {
    try {
      const backupInfo = {
        id: Date.now(),
        name: values.name,
        type: values.type,
        size: 0,
        status: 'running',
        startTime: new Date().toLocaleString(),
        endTime: '',
        duration: '',
        location: values.location
      };

      setBackupData(prev => [backupInfo, ...prev]);
      message.success('备份任务已创建，正在执行中...');
      setIsBackupModalVisible(false);
      backupForm.resetFields();
    } catch (error) {
      message.error('备份创建失败');
    }
  };

  // 处理数据清理
  const handleCleanupSubmit = async (values: any) => {
    try {
      // 模拟数据清理过程
      message.success('数据清理任务已提交，正在执行中...');
      setIsCleanupModalVisible(false);
      cleanupForm.resetFields();
    } catch (error) {
      message.error('数据清理失败');
    }
  };

  // 获取状态标签颜色
  const getStatusColor = (status: string) => {
    const statusMap: { [key: string]: string } = {
      normal: 'green',
      warning: 'orange',
      critical: 'red',
      completed: 'green',
      running: 'blue',
      failed: 'red'
    };
    return statusMap[status] || 'default';
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      normal: '正常',
      warning: '警告',
      critical: '严重',
      completed: '已完成',
      running: '执行中',
      failed: '失败'
    };
    return statusMap[status] || status;
  };

  // 获取类型标签颜色
  const getTypeColor = (type: string) => {
    const typeMap: { [key: string]: string } = {
      video: 'red',
      audio: 'blue',
      sensor: 'green',
      log: 'orange',
      backup: 'purple',
      full: 'red',
      incremental: 'blue',
      differential: 'green'
    };
    return typeMap[type] || 'default';
  };

  // 获取类型文本
  const getTypeText = (type: string) => {
    const typeMap: { [key: string]: string } = {
      video: '视频',
      audio: '音频',
      sensor: '传感器',
      log: '日志',
      backup: '备份',
      full: '完整备份',
      incremental: '增量备份',
      differential: '差异备份'
    };
    return typeMap[type] || type;
  };

  // 格式化存储大小
  const formatSize = (size: number) => {
    if (size >= 1024) {
      return `${(size / 1024).toFixed(1)} TB`;
    }
    return `${size} GB`;
  };

  // 计算使用率
  const calculateUsage = (used: number, total: number) => {
    return Math.round((used / total) * 100);
  };

  // 存储表格列定义
  const storageColumns = [
    {
      title: '存储名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <HddOutlined style={{ color: '#1890ff' }} />
          {text}
          <Tag color={getTypeColor(record.type)}>
            {getTypeText(record.type)}
          </Tag>
        </Space>
      )
    },
    {
      title: '总容量',
      dataIndex: 'totalSize',
      key: 'totalSize',
      render: (size: number) => formatSize(size)
    },
    {
      title: '已使用',
      dataIndex: 'usedSize',
      key: 'usedSize',
      render: (used: number, record: any) => (
        <Space direction="vertical" size="small">
          <span>{formatSize(used)}</span>
          <Progress
            percent={calculateUsage(used, record.totalSize)} 
            size="small"
            showInfo={false}
            status={calculateUsage(used, record.totalSize) > 90 ? 'exception' : 
                   calculateUsage(used, record.totalSize) > 80 ? 'normal' : 'success'}
          />
        </Space>
      )
    },
    {
      title: '可用空间',
      dataIndex: 'freeSize',
      key: 'freeSize',
      render: (size: number) => formatSize(size)
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
          </Tag>
      )
    },
    {
      title: '存储位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" size="small" icon={<EyeOutlined />}>
            查看详情
          </Button>
          <Button type="link" size="small" icon={<SettingOutlined />}>
            配置
          </Button>
        </Space>
      ),
    },
  ];

  // 备份表格列定义
  const backupColumns = [
    {
      title: '备份名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <CloudOutlined style={{ color: '#1890ff' }} />
          {text}
          <Tag color={getTypeColor(record.type)}>
            {getTypeText(record.type)}
          </Tag>
        </Space>
      )
    },
    {
      title: '备份大小',
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => formatSize(size)
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: '耗时',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: '存储位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" size="small" icon={<DownloadOutlined />}>
            下载
          </Button>
          <Button type="link" size="small" icon={<EyeOutlined />}>
            查看
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // ECharts 选项：使用趋势
  const storageTrendOptions = useMemo(() => {
    const dates = ['2025-08-10','2025-08-20','2025-08-21','2025-08-22','2025-08-23','2025-08-24'];
    const video = [1200,1250,1300,1350,1400,1536];
    const audio = [100,110,115,120,125,128];
    const sensor = [50,52,54,56,58,64];
    const log = [80,82,85,88,90,96];
    return {
      tooltip: { trigger: 'axis' },
      legend: { data: ['视频','音频','传感器','日志'] },
      grid: { left: 40, right: 20, top: 40, bottom: 30 },
      xAxis: { type: 'category', data: dates },
      yAxis: { type: 'value', name: 'GB' },
      series: [
        { name: '视频', type: 'line', smooth: true, data: video },
        { name: '音频', type: 'line', smooth: true, data: audio },
        { name: '传感器', type: 'line', smooth: true, data: sensor },
        { name: '日志', type: 'line', smooth: true, data: log },
      ]
    };
  }, []);

  // ECharts 选项：类型分布
  const storageTypeOptions = useMemo(() => {
    // 基于当前 storageData 的 usedSize 汇总
    const byType: { [k: string]: number } = {};
    storageData.forEach(item => {
      byType[item.type] = (byType[item.type] || 0) + (item.usedSize || 0);
    });
    const nameMap: { [k: string]: string } = { video: '视频数据', audio: '音频数据', sensor: '传感器数据', log: '系统日志', backup: '备份数据' };
    const data = Object.keys(byType).map(k => ({ name: nameMap[k] || k, value: byType[k] }));
    return {
      tooltip: { trigger: 'item', formatter: '{b}: {c} GB ({d}%)' },
      legend: { orient: 'horizontal', bottom: 0 },
      series: [
        {
          type: 'pie',
          radius: ['40%','70%'],
          avoidLabelOverlap: false,
          label: { show: true, formatter: '{b}\n{d}%' },
          labelLine: { show: true },
          data
        }
      ]
    };
  }, [storageData]);

  // 计算总存储统计
  const totalStorage = storageData.reduce((sum, item) => sum + item.totalSize, 0);
  const totalUsed = storageData.reduce((sum, item) => sum + item.usedSize, 0);
  const totalFree = storageData.reduce((sum, item) => sum + item.freeSize, 0);
  const usageRate = Math.round((totalUsed / totalStorage) * 100);

  return (
    <div className="data-storage">
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <DatabaseOutlined style={{ marginRight: '8px' }} />
          数据存储管理
        </Title>
        <Text type="secondary">
          监控存储设备状态、管理数据备份、执行数据清理等存储管理功能
        </Text>
      </div>
      
      <Card>
        <Tabs defaultActiveKey="overview" type="card">
          <Tabs.TabPane tab="系统概览" key="overview">
            {/* 存储统计信息 */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="总存储容量"
                    value={formatSize(totalStorage)}
                    prefix={<HddOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
          </Card>
        </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="已使用空间"
                    value={formatSize(totalUsed)}
                    prefix={<CloudOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
          </Card>
        </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="可用空间"
                    value={formatSize(totalFree)}
                    prefix={<HddOutlined />}
                    valueStyle={{ color: '#722ed1' }}
                  />
          </Card>
        </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="使用率"
                    value={usageRate}
                    prefix={<SyncOutlined />}
                    valueStyle={{ color: usageRate > 90 ? '#ff4d4f' : usageRate > 80 ? '#faad14' : '#52c41a' }}
                    suffix="%"
                  />
          </Card>
        </Col>
            </Row>

            {/* 存储使用趋势 */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={16}>
                <Card title="存储使用趋势" extra={<Button type="link">查看详情</Button>}>
                  <ReactECharts option={storageTrendOptions} style={{ height: 300 }} />
          </Card>
        </Col>
              <Col span={8}>
                <Card title="存储类型分布">
                  <ReactECharts option={storageTypeOptions} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

            {/* 操作按钮 */}
            <Card style={{ marginBottom: 0 }}>
              <Space>
                <Button 
                  type="primary" 
                  icon={<CloudOutlined />}
                  onClick={() => setIsBackupModalVisible(true)}
                >
                  创建备份
                </Button>
                <Button 
                  icon={<DeleteOutlined />}
                  onClick={() => setIsCleanupModalVisible(true)}
                >
                  数据清理
                </Button>
                <Button icon={<ReloadOutlined />}>
                  刷新状态
                </Button>
              </Space>
            </Card>
          </Tabs.TabPane>

          <Tabs.TabPane tab="存储设备" key="devices">
            <Table
              columns={storageColumns}
              dataSource={storageData}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Tabs.TabPane>

          <Tabs.TabPane tab="备份管理" key="backups">
            <Table 
              columns={backupColumns}
              dataSource={backupData}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Tabs.TabPane>
        </Tabs>
          </Card>

      {/* 创建备份弹窗 */}
      <Modal
        title="创建数据备份"
        open={isBackupModalVisible}
        onCancel={() => {
          setIsBackupModalVisible(false);
          backupForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={backupForm}
          layout="vertical"
          onFinish={handleBackupSubmit}
          initialValues={{
            type: 'full',
            location: '云端存储'
          }}
        >
          <Form.Item
            name="name"
            label="备份名称"
            rules={[{ required: true, message: '请输入备份名称' }]}
          >
            <Input placeholder="请输入备份名称" />
              </Form.Item>

          <Form.Item
            name="type"
            label="备份类型"
            rules={[{ required: true, message: '请选择备份类型' }]}
          >
            <Select placeholder="请选择备份类型">
              <Option value="full">完整备份</Option>
              <Option value="incremental">增量备份</Option>
              <Option value="differential">差异备份</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="location"
            label="备份位置"
            rules={[{ required: true, message: '请选择备份位置' }]}
          >
            <Select placeholder="请选择备份位置">
              <Option value="云端存储">云端存储</Option>
              <Option value="本地存储">本地存储</Option>
              <Option value="网络存储">网络存储</Option>
            </Select>
          </Form.Item>

          <Form.Item>
                  <Space>
              <Button type="primary" htmlType="submit">
                开始备份
                    </Button>
              <Button onClick={() => {
                setIsBackupModalVisible(false);
                backupForm.resetFields();
              }}>
                取消
                    </Button>
                  </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 数据清理弹窗 */}
      <Modal
        title="数据清理"
        open={isCleanupModalVisible}
        onCancel={() => {
          setIsCleanupModalVisible(false);
          cleanupForm.resetFields();
        }}
        footer={null}
        width={500}
      >
                    <Alert
          message="数据清理警告"
          description="数据清理操作不可逆，请谨慎操作。建议在清理前先创建备份。"
          type="warning"
                      showIcon
                      style={{ marginBottom: 16 }}
                    />

        <Form
          form={cleanupForm}
          layout="vertical"
          onFinish={handleCleanupSubmit}
        >
          <Form.Item
            name="dataType"
            label="清理数据类型"
            rules={[{ required: true, message: '请选择要清理的数据类型' }]}
          >
            <Select mode="multiple" placeholder="请选择要清理的数据类型">
              <Option value="video">视频数据</Option>
              <Option value="audio">音频数据</Option>
              <Option value="sensor">传感器数据</Option>
              <Option value="log">系统日志</Option>
                    </Select>
                  </Form.Item>

          <Form.Item
            name="retentionDays"
            label="保留天数"
            rules={[{ required: true, message: '请输入数据保留天数' }]}
          >
            <Input type="number" placeholder="请输入数据保留天数" />
                  </Form.Item>

          <Form.Item
            name="confirm"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('请确认数据清理操作')),
              },
            ]}
          >
            <Checkbox>我确认要执行数据清理操作，已了解此操作不可逆</Checkbox>
              </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" danger>
                开始清理
              </Button>
              <Button onClick={() => {
                setIsCleanupModalVisible(false);
                cleanupForm.resetFields();
              }}>
                取消
              </Button>
            </Space>
              </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataStorage; 