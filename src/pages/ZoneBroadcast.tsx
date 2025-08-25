import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Space,
  Table,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
  Progress,
  List,
  Avatar,
  Typography,
  Divider,
  Alert,
  Tree,
  Drawer,
  Badge,
  Tooltip,
  Statistic,
  Tabs,
  Checkbox
} from 'antd';
import {
  PartitionOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  AudioOutlined,
  SoundOutlined,
  VideoCameraOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  WifiOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  EyeOutlined,
  ControlOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  TeamOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { broadcastZones as initialBroadcastZones, broadcastDevices as initialBroadcastDevices } from '../data/broadcastData';
import ReactECharts from 'echarts-for-react';

const { Option } = Select;
const { Title, Text } = Typography;
const { DirectoryTree } = Tree;

/**
 * 分区广播页面
 * 管理广播分区、设备配置、播放策略等
 */
const ZoneBroadcast: React.FC = () => {
  const navigate = useNavigate();
  const [zones, setZones] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [isZoneModalVisible, setIsZoneModalVisible] = useState(false);
  const [isDeviceModalVisible, setIsDeviceModalVisible] = useState(false);
  const [editingZone, setEditingZone] = useState<any>(null);
  const [editingDevice, setEditingDevice] = useState<any>(null);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [isDeviceDrawerVisible, setIsDeviceDrawerVisible] = useState(false);
  const [zoneForm] = Form.useForm();
  const [deviceForm] = Form.useForm();
  const [batchConfigModalVisible, setBatchConfigModalVisible] = useState(false);
  const [templateModalVisible, setTemplateModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [selectedZones, setSelectedZones] = useState<number[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<number[]>([]);

  // 快速配置：按区域预填表单并打开
  const applyQuickConfig = (preset: 'lobby' | 'restaurant' | 'rooms' | 'emergency') => {
    const nowPreset: Record<string, any> = {
      lobby: { name: '前厅区域', code: 'LOBBY', description: '前厅快速配置', priority: 'high', volume: 75 },
      restaurant: { name: '餐饮区域', code: 'DINING', description: '餐饮快速配置', priority: 'normal', volume: 70 },
      rooms: { name: '客房区域', code: 'ROOMS', description: '客房快速配置', priority: 'normal', volume: 65 },
      emergency: { name: '全区域', code: 'ALL', description: '紧急广播配置', priority: 'high', volume: 90 }
    };
    const data = nowPreset[preset];
    setEditingZone(null);
    zoneForm.setFieldsValue(data);
    setIsZoneModalVisible(true);
    message.success('已载入快速配置，请确认后保存');
  };

  // 使用统一的分区和设备数据
  useEffect(() => {
    setZones(initialBroadcastZones);
    setDevices(initialBroadcastDevices);
  }, []);



  // 刷新状态
  const handleRefreshStatus = () => {
    message.success('状态刷新成功');
    // 这里可以添加实际的刷新逻辑
  };

  // 批量配置
  const handleBatchConfig = () => {
    if (selectedZones.length === 0 && selectedDevices.length === 0) {
      message.warning('请先选择要配置的分区或设备');
      return;
    }
    setBatchConfigModalVisible(true);
  };

  // 分区模板
  const handleZoneTemplate = () => {
    setTemplateModalVisible(true);
  };

  // 设备监控
  const handleDeviceMonitor = () => {
    // 切换到设备监控标签页
    const tabsElement = document.querySelector('.ant-tabs-tab[data-key="monitoring"]');
    if (tabsElement) {
      (tabsElement as HTMLElement).click();
    }
  };

  // 历史记录
  const handleHistory = () => {
    setHistoryModalVisible(true);
  };

  // 处理分区表单提交
  const handleZoneSubmit = async (values: any) => {
    try {
      const zoneData = {
        ...values,
        id: editingZone ? editingZone.id : Date.now(),
        deviceCount: editingZone ? editingZone.deviceCount : 0,
        status: editingZone ? editingZone.status : 'active'
      };

      if (editingZone) {
        setZones(prev => 
          prev.map(zone => zone.id === editingZone.id ? zoneData : zone)
        );
        message.success('分区更新成功');
      } else {
        setZones(prev => [zoneData, ...prev]);
        message.success('分区创建成功');
      }

      setIsZoneModalVisible(false);
      setEditingZone(null);
      zoneForm.resetFields();
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 处理设备表单提交
  const handleDeviceSubmit = async (values: any) => {
    try {
      const deviceData = {
        ...values,
        id: editingDevice ? editingDevice.id : Date.now(),
        zoneName: zones.find(z => z.id === values.zoneId)?.name || '',
        lastSeen: new Date().toLocaleString(),
        firmware: editingDevice ? editingDevice.firmware : 'v1.0.0'
      };

      if (editingDevice) {
        setDevices(prev => 
          prev.map(device => device.id === editingDevice.id ? deviceData : device)
        );
        message.success('设备更新成功');
      } else {
        setDevices(prev => [deviceData, ...prev]);
        // 更新分区设备数量
        setZones(prev => 
          prev.map(zone => 
            zone.id === values.zoneId 
              ? { ...zone, deviceCount: zone.deviceCount + 1 }
              : zone
          )
        );
        message.success('设备添加成功');
      }

      setIsDeviceModalVisible(false);
      setEditingDevice(null);
      deviceForm.resetFields();
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 处理分区删除
  const handleZoneDelete = (zoneId: number) => {
    const zone = zones.find(z => z.id === zoneId);
    if (zone && zone.deviceCount > 0) {
      message.error('该分区下还有设备，无法删除');
      return;
    }

    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个分区吗？',
      onOk: () => {
        setZones(prev => prev.filter(zone => zone.id !== zoneId));
        message.success('分区删除成功');
      }
    });
  };

  // 处理设备删除
  const handleDeviceDelete = (deviceId: number) => {
    const device = devices.find(d => d.id === deviceId);
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个设备吗？',
      onOk: () => {
        setDevices(prev => prev.filter(device => device.id !== deviceId));
        // 更新分区设备数量
        if (device) {
          setZones(prev => 
            prev.map(zone => 
              zone.id === device.zoneId 
                ? { ...zone, deviceCount: Math.max(0, zone.deviceCount - 1) }
                : zone
            )
          );
        }
        message.success('设备删除成功');
      }
    });
  };

  // 处理分区编辑
  const handleZoneEdit = (zone: any) => {
    setEditingZone(zone);
    zoneForm.setFieldsValue(zone);
    setIsZoneModalVisible(true);
  };

  // 处理设备编辑
  const handleDeviceEdit = (device: any) => {
    setEditingDevice(device);
    deviceForm.setFieldsValue(device);
    setIsDeviceModalVisible(true);
  };

  // 查看分区设备
  const handleViewZoneDevices = (zone: any) => {
    setSelectedZone(zone);
    setIsDeviceDrawerVisible(true);
  };

  // 获取状态标签颜色
  const getStatusColor = (status: string) => {
    const statusMap: { [key: string]: string } = {
      active: 'green',
      inactive: 'red',
      online: 'green',
      offline: 'red',
      warning: 'orange'
    };
    return statusMap[status] || 'default';
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      active: '启用',
      inactive: '禁用',
      online: '在线',
      offline: '离线',
      warning: '警告'
    };
    return statusMap[status] || status;
  };

  // 获取优先级标签颜色
  const getPriorityColor = (priority: string) => {
    const priorityMap: { [key: string]: string } = {
      high: 'red',
      normal: 'blue',
      low: 'green'
    };
    return priorityMap[priority] || 'default';
  };

  // 分区表格列定义
  const zoneColumns = [
    {
      title: '选择',
      key: 'selection',
      width: 60,
      render: (_: any, record: any) => (
        <Checkbox
          checked={selectedZones.includes(record.id)}
          onChange={(e: any) => {
            if (e.target.checked) {
              setSelectedZones([...selectedZones, record.id]);
            } else {
              setSelectedZones(selectedZones.filter(id => id !== record.id));
            }
          }}
        />
      )
    },
    {
      title: '分区名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <PartitionOutlined style={{ color: '#1890ff' }} />
          {text}
          <Tag color="blue">{record.code}</Tag>
        </Space>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '设备数量',
      dataIndex: 'deviceCount',
      key: 'deviceCount',
      render: (count: number) => (
        <Badge count={count} showZero style={{ backgroundColor: '#1890ff' }} />
      )
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
      title: '默认音量',
      dataIndex: 'volume',
      key: 'volume',
      render: (volume: number) => (
        <Progress 
          percent={volume} 
          size="small" 
          showInfo={false}
          strokeColor={volume > 80 ? '#ff4d4f' : volume > 60 ? '#faad14' : '#52c41a'}
        />
      )
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {priority === 'high' ? '高' : priority === 'normal' ? '中' : '低'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            type="link" 
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewZoneDevices(record)}
          >
            查看设备
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleZoneEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            size="small" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleZoneDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 设备表格列定义
  const deviceColumns = [
    {
      title: '选择',
      key: 'selection',
      width: 60,
      render: (_: any, record: any) => (
        <Checkbox
          checked={selectedDevices.includes(record.id)}
          onChange={(e: any) => {
            if (e.target.checked) {
              setSelectedDevices([...selectedDevices, record.id]);
            } else {
              setSelectedDevices(selectedDevices.filter(id => id !== record.id));
            }
          }}
        />
      )
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          {record.type === 'speaker' ? <AudioOutlined /> : 
           record.type === 'amplifier' ? <SoundOutlined /> : <ControlOutlined />}
          {text}
        </Space>
      )
    },
    {
      title: '所属分区',
      dataIndex: 'zoneName',
      key: 'zoneName',
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap: { [key: string]: string } = {
          speaker: '音响',
          amplifier: '功放',
          controller: '控制器'
        };
        return typeMap[type] || type;
      }
    },
    {
      title: '型号',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
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
      title: '音量',
      dataIndex: 'volume',
      key: 'volume',
      render: (volume: number) => (
        <Progress 
          percent={volume} 
          size="small" 
          showInfo={false}
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            type="link" 
            size="small"
            icon={<SettingOutlined />}
            onClick={() => handleDeviceEdit(record)}
          >
            配置
          </Button>
          <Button 
            type="link" 
            size="small" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDeviceDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="zone-broadcast">
      <div style={{ marginBottom: 24 }}>
        <Button 
          type="link" 
          icon={<PartitionOutlined />} 
          onClick={() => navigate('/broadcast-system')}
          style={{ padding: 0, marginBottom: '16px' }}
        >
          返回广播系统
        </Button>
        <Title level={2}>
          <PartitionOutlined style={{ marginRight: '8px' }} />
          分区广播
        </Title>
        <Text type="secondary">
          管理广播分区，设置不同区域的播放策略和设备配置
        </Text>
      </div>

      {/* 统计信息 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总分区数"
              value={zones.length}
              prefix={<PartitionOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总设备数"
              value={devices.length}
              prefix={<AudioOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线设备"
              value={devices.filter(device => device.status === 'online').length}
              prefix={<WifiOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="离线设备"
              value={devices.filter(device => device.status === 'offline').length}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 详细统计信息 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="平均设备在线率"
              value={Math.round(
                (devices.filter(device => device.status === 'online').length / 
                Math.max(devices.length, 1)) * 100
              )}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="高优先级分区"
              value={zones.filter(zone => zone.priority === 'high').length}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="平均分区音量"
              value={Math.round(
                zones.reduce((sum, zone) => sum + zone.volume, 0) / 
                Math.max(zones.length, 1)
              )}
              suffix="%"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 操作按钮 */}
      <Card style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingZone(null);
                  zoneForm.resetFields();
                  setIsZoneModalVisible(true);
                }}
              >
                新建分区
              </Button>
              <Button 
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingDevice(null);
                  deviceForm.resetFields();
                  setIsDeviceModalVisible(true);
                }}
              >
                添加设备
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleRefreshStatus}>
                刷新状态
              </Button>
              <Button icon={<BarChartOutlined />} onClick={handleBatchConfig}>
                批量配置
              </Button>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button icon={<TeamOutlined />} onClick={handleZoneTemplate}>
                分区模板
              </Button>
              <Button icon={<SafetyOutlined />} onClick={handleDeviceMonitor}>
                设备监控
              </Button>
              <Button icon={<ClockCircleOutlined />} onClick={handleHistory}>
                历史记录
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 主要内容区域 - Tabs样式 */}
      <Card>
        <Tabs defaultActiveKey="zones" type="card" size="large">
          {/* 分区管理标签页 */}
          <Tabs.TabPane tab="分区管理" key="zones">
            <Table 
              columns={zoneColumns} 
              dataSource={zones} 
              rowKey="id"
              pagination={{ 
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
              }}
              scroll={{ x: 1200 }}
              size="middle"
              bordered
            />
          </Tabs.TabPane>

          {/* 设备管理标签页 */}
          <Tabs.TabPane tab="设备管理" key="devices">
            <Table 
              columns={deviceColumns} 
              dataSource={devices} 
              rowKey="id"
              pagination={{ 
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
              }}
              scroll={{ x: 1200 }}
              size="middle"
              bordered
            />
          </Tabs.TabPane>

          {/* 设备监控标签页 */}
          <Tabs.TabPane tab="设备监控" key="monitoring">
            <Row gutter={24}>
              <Col span={12}>
                <Card title="设备状态分布" style={{ marginBottom: 24 }}>
                  <ReactECharts
                    option={{
                      title: {
                        text: '设备状态分布',
                        left: 'center',
                        textStyle: {
                          fontSize: 14
                        }
                      },
                      tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                      },
                      legend: {
                        orient: 'vertical',
                        left: 'left',
                        top: 'middle'
                      },
                      series: [
                        {
                          name: '设备状态',
                          type: 'pie',
                          radius: '60%',
                          center: ['60%', '50%'],
                          data: [
                            { value: devices.filter(d => d.status === 'online').length, name: '在线', itemStyle: { color: '#52c41a' } },
                            { value: devices.filter(d => d.status === 'offline').length, name: '离线', itemStyle: { color: '#d9d9d9' } }
                          ],
                          emphasis: {
                            itemStyle: {
                              shadowBlur: 10,
                              shadowOffsetX: 0,
                              shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                          }
                        }
                      ]
                    }}
                    style={{ height: '250px' }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="设备类型分布" style={{ marginBottom: 24 }}>
                  <ReactECharts
                    option={{
                      title: {
                        text: '设备类型分布',
                        left: 'center',
                        textStyle: {
                          fontSize: 14
                        }
                      },
                      tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                      },
                      legend: {
                        orient: 'vertical',
                        left: 'left',
                        top: 'middle'
                      },
                      series: [
                        {
                          name: '设备类型',
                          type: 'pie',
                          radius: '60%',
                          center: ['60%', '50%'],
                          data: [
                            { value: devices.filter(d => d.type === 'speaker').length, name: '音响', itemStyle: { color: '#1890ff' } },
                            { value: devices.filter(d => d.type === 'amplifier').length, name: '功放', itemStyle: { color: '#722ed1' } },
                            { value: devices.filter(d => d.type === 'controller').length, name: '控制器', itemStyle: { color: '#13c2c2' } }
                          ],
                          emphasis: {
                            itemStyle: {
                              shadowBlur: 10,
                              shadowOffsetX: 0,
                              shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                          }
                        }
                      ]
                    }}
                    style={{ height: '250px' }}
                  />
                </Card>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Card title="分区设备数量" style={{ marginBottom: 24 }}>
                  <ReactECharts
                    option={{
                      title: {
                        text: '分区设备数量',
                        left: 'center',
                        textStyle: {
                          fontSize: 14
                        }
                      },
                      tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                          type: 'shadow'
                        }
                      },
                      xAxis: {
                        type: 'category',
                        data: zones.map(zone => zone.name),
                        axisLabel: {
                          rotate: 45,
                          fontSize: 10
                        }
                      },
                      yAxis: {
                        type: 'value',
                        name: '设备数量'
                      },
                      series: [
                        {
                          name: '设备数量',
                          type: 'bar',
                          data: zones.map(zone => zone.deviceCount),
                          itemStyle: {
                            color: '#1890ff'
                          }
                        }
                      ]
                    }}
                    style={{ height: '250px' }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="设备信号强度分布" style={{ marginBottom: 24 }}>
                  <ReactECharts
                    option={{
                      title: {
                        text: '设备信号强度分布',
                        left: 'center',
                        textStyle: {
                          fontSize: 14
                        }
                      },
                      tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                          type: 'shadow'
                        }
                      },
                      xAxis: {
                        type: 'category',
                        data: ['0-20%', '21-40%', '41-60%', '61-80%', '81-100%']
                      },
                      yAxis: {
                        type: 'value',
                        name: '设备数量'
                      },
                      series: [
                        {
                          name: '设备数量',
                          type: 'bar',
                          data: [
                            devices.filter(d => (d.signalStrength && parseInt(d.signalStrength) <= 20)).length,
                            devices.filter(d => (d.signalStrength && parseInt(d.signalStrength) > 20 && parseInt(d.signalStrength) <= 40)).length,
                            devices.filter(d => (d.signalStrength && parseInt(d.signalStrength) > 40 && parseInt(d.signalStrength) <= 60)).length,
                            devices.filter(d => (d.signalStrength && parseInt(d.signalStrength) > 60 && parseInt(d.signalStrength) <= 80)).length,
                            devices.filter(d => (d.signalStrength && parseInt(d.signalStrength) > 80)).length
                          ],
                          itemStyle: {
                            color: '#52c41a'
                          }
                        }
                      ]
                    }}
                    style={{ height: '250px' }}
                  />
                </Card>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Card title="设备性能监控">
                  <ReactECharts
                    option={{
                      title: {
                        // text: '设备性能监控',
                        left: 'center',
                        textStyle: {
                          fontSize: 14
                        }
                      },
                      tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                          type: 'cross'
                        }
                      },
                      legend: {
                        data: ['温度', '功耗']
                      },
                      xAxis: {
                        type: 'category',
                        data: devices.slice(0, 8).map(d => d.name),
                        axisLabel: {
                          rotate: 45,
                          fontSize: 10
                        }
                      },
                      yAxis: [
                        {
                          type: 'value',
                          name: '温度 (°C)',
                          position: 'left'
                        },
                        {
                          type: 'value',
                          name: '功耗 (W)',
                          position: 'right'
                        }
                      ],
                      series: [
                        {
                          name: '温度',
                          type: 'line',
                          yAxisIndex: 0,
                          data: devices.slice(0, 8).map(d => {
                            const temp = d.temperature ? parseInt(d.temperature) : 0;
                            return temp;
                          }),
                          itemStyle: { color: '#ff4d4f' }
                        },
                        {
                          name: '功耗',
                          type: 'line',
                          yAxisIndex: 1,
                          data: devices.slice(0, 8).map(d => {
                            const power = d.powerConsumption ? parseInt(d.powerConsumption) : 0;
                            return power;
                          }),
                          itemStyle: { color: '#1890ff' }
                        }
                      ]
                    }}
                    style={{ height: '300px' }}
                  />
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>

          {/* 快速配置标签页 */}
          <Tabs.TabPane tab="快速配置" key="quickConfig">
            <Row gutter={16}>
              <Col span={6}>
                <Card size="small" hoverable style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => applyQuickConfig('lobby')}>
                  <AudioOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
                  <div>前厅配置</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>前厅区域设备配置</Text>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" hoverable style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => applyQuickConfig('restaurant')}>
                  <SoundOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '8px' }} />
                  <div>餐厅配置</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>餐饮区域设备配置</Text>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" hoverable style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => applyQuickConfig('rooms')}>
                  <VideoCameraOutlined style={{ fontSize: '24px', color: '#722ed1', marginBottom: '8px' }} />
                  <div>客房配置</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>客房区域设备配置</Text>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" hoverable style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => applyQuickConfig('emergency')}>
                  <ExclamationCircleOutlined style={{ fontSize: '24px', color: '#ff4d4f', marginBottom: '8px' }} />
                  <div>紧急配置</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>紧急广播配置</Text>
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>
        </Tabs>
      </Card>

      {/* 分区表单弹窗 */}
      <Modal
        title={editingZone ? '编辑分区' : '新建分区'}
        open={isZoneModalVisible}
        onCancel={() => {
          setIsZoneModalVisible(false);
          setEditingZone(null);
          zoneForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={zoneForm}
          layout="vertical"
          onFinish={handleZoneSubmit}
          initialValues={{
            priority: 'normal',
            volume: 75
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="分区名称"
                rules={[{ required: true, message: '请输入分区名称' }]}
              >
                <Input placeholder="请输入分区名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="分区代码"
                rules={[{ required: true, message: '请输入分区代码' }]}
              >
                <Input placeholder="请输入分区代码" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="分区描述"
            rules={[{ required: true, message: '请输入分区描述' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入分区描述" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="优先级"
                rules={[{ required: true, message: '请选择优先级' }]}
              >
                <Select placeholder="请选择优先级">
                  <Option value="high">高</Option>
                  <Option value="normal">中</Option>
                  <Option value="low">低</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="volume"
                label="默认音量"
                rules={[{ required: true, message: '请设置默认音量' }]}
              >
                <Select placeholder="请设置默认音量">
                  <Option value={50}>50%</Option>
                  <Option value={60}>60%</Option>
                  <Option value={70}>70%</Option>
                  <Option value={75}>75%</Option>
                  <Option value={80}>80%</Option>
                  <Option value={90}>90%</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingZone ? '更新分区' : '创建分区'}
              </Button>
              <Button onClick={() => {
                setIsZoneModalVisible(false);
                setEditingZone(null);
                zoneForm.resetFields();
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 设备表单弹窗 */}
      <Modal
        title={editingDevice ? '编辑设备' : '添加设备'}
        open={isDeviceModalVisible}
        onCancel={() => {
          setIsDeviceModalVisible(false);
          setEditingDevice(null);
          deviceForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={deviceForm}
          layout="vertical"
          onFinish={handleDeviceSubmit}
          initialValues={{
            volume: 75
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="设备名称"
                rules={[{ required: true, message: '请输入设备名称' }]}
              >
                <Input placeholder="请输入设备名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="设备类型"
                rules={[{ required: true, message: '请选择设备类型' }]}
              >
                <Select placeholder="请选择设备类型">
                  <Option value="speaker">音响</Option>
                  <Option value="amplifier">功放</Option>
                  <Option value="controller">控制器</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="model"
                label="设备型号"
                rules={[{ required: true, message: '请输入设备型号' }]}
              >
                <Input placeholder="请输入设备型号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="ip"
                label="IP地址"
                rules={[{ required: true, message: '请输入IP地址' }]}
              >
                <Input placeholder="请输入IP地址" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="zoneId"
                label="所属分区"
                rules={[{ required: true, message: '请选择所属分区' }]}
              >
                <Select placeholder="请选择所属分区">
                  {zones.map(zone => (
                    <Option key={zone.id} value={zone.id}>
                      {zone.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="volume"
                label="设备音量"
                rules={[{ required: true, message: '请设置设备音量' }]}
              >
                <Select placeholder="请设置设备音量">
                  <Option value={50}>50%</Option>
                  <Option value={60}>60%</Option>
                  <Option value={70}>70%</Option>
                  <Option value={75}>75%</Option>
                  <Option value={80}>80%</Option>
                  <Option value={90}>90%</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingDevice ? '更新设备' : '添加设备'}
              </Button>
              <Button onClick={() => {
                setIsDeviceModalVisible(false);
                setEditingDevice(null);
                deviceForm.resetFields();
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 分区设备详情抽屉 */}
      <Drawer
        title={`${selectedZone?.name} - 设备详情`}
        placement="right"
        onClose={() => setIsDeviceDrawerVisible(false)}
        open={isDeviceDrawerVisible}
        width={600}
      >
        {selectedZone && (
          <div>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>分区代码:</Text>
                  <br />
                  <Text>{selectedZone.code}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>设备数量:</Text>
                  <br />
                  <Text>{selectedZone.deviceCount}</Text>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={12}>
                  <Text strong>默认音量:</Text>
                  <br />
                  <Progress percent={selectedZone.volume} size="small" />
                </Col>
                <Col span={12}>
                  <Text strong>优先级:</Text>
                  <br />
                  <Tag color={getPriorityColor(selectedZone.priority)}>
                    {selectedZone.priority === 'high' ? '高' : selectedZone.priority === 'normal' ? '中' : '低'}
                  </Tag>
                </Col>
              </Row>
            </Card>

            <List
              size="small"
              dataSource={devices.filter(device => device.zoneId === selectedZone.id)}
              renderItem={(device) => (
                <List.Item
                  actions={[
                    <Button key="edit" type="link" size="small" onClick={() => handleDeviceEdit(device)}>
                      编辑
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={
                          device.type === 'speaker' ? <AudioOutlined /> :
                          device.type === 'amplifier' ? <SoundOutlined /> :
                          <ControlOutlined />
                        }
                        style={{ backgroundColor: '#1890ff' }}
                      />
                    }
                    title={
                      <Space>
                        {device.name}
                        <Tag color={getStatusColor(device.status)}>
                          {getStatusText(device.status)}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="small">
                        <div>型号: {device.model}</div>
                        <div>IP: {device.ip}</div>
                        <div>音量: {device.volume}%</div>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </Drawer>

      {/* 批量配置弹窗 */}
      <Modal
        title="批量配置"
        open={batchConfigModalVisible}
        onCancel={() => setBatchConfigModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setBatchConfigModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => {
            message.success('批量配置已应用');
            setBatchConfigModalVisible(false);
          }}>
            应用配置
          </Button>
        ]}
        width={600}
      >
        <div>
          <Alert
            message={`已选择 ${selectedZones.length} 个分区和 ${selectedDevices.length} 个设备`}
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          
          <Form layout="vertical">
            <Form.Item label="统一音量设置">
              <Select placeholder="选择音量级别" style={{ width: '100%' }}>
                <Option value={60}>60% - 安静</Option>
                <Option value={70}>70% - 适中</Option>
                <Option value={80}>80% - 清晰</Option>
                <Option value={90}>90% - 响亮</Option>
              </Select>
            </Form.Item>
            
            <Form.Item label="优先级设置">
              <Select placeholder="选择优先级" style={{ width: '100%' }}>
                <Option value="low">低优先级</Option>
                <Option value="normal">普通优先级</Option>
                <Option value="high">高优先级</Option>
              </Select>
            </Form.Item>
            
            <Form.Item label="状态设置">
              <Select placeholder="选择状态" style={{ width: '100%' }}>
                <Option value="active">激活</Option>
                <Option value="inactive">停用</Option>
                <Option value="maintenance">维护</Option>
              </Select>
            </Form.Item>
          </Form>
        </div>
      </Modal>

      {/* 分区模板弹窗 */}
      <Modal
        title="分区模板管理"
        open={templateModalVisible}
        onCancel={() => setTemplateModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setTemplateModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        <div>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={12}>
              <Card size="small" hoverable style={{ textAlign: 'center', cursor: 'pointer' }}>
                <AudioOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
                <div>前厅模板</div>
                <Text type="secondary" style={{ fontSize: '12px' }}>适用于前厅、接待区</Text>
              </Card>
            </Col>
            <Col span={12}>
              <Card size="small" hoverable style={{ textAlign: 'center', cursor: 'pointer' }}>
                <SoundOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '8px' }} />
                <div>餐厅模板</div>
                <Text type="secondary" style={{ fontSize: '12px' }}>适用于餐厅、宴会厅</Text>
              </Card>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Card size="small" hoverable style={{ textAlign: 'center', cursor: 'pointer' }}>
                <VideoCameraOutlined style={{ fontSize: '24px', color: '#722ed1', marginBottom: '8px' }} />
                <div>客房模板</div>
                <Text type="secondary" style={{ fontSize: '12px' }}>适用于客房、走廊</Text>
              </Card>
            </Col>
            <Col span={12}>
              <Card size="small" hoverable style={{ textAlign: 'center', cursor: 'pointer' }}>
                <ExclamationCircleOutlined style={{ fontSize: '24px', color: '#ff4d4f', marginBottom: '8px' }} />
                <div>紧急模板</div>
                <Text type="secondary" style={{ fontSize: '12px' }}>适用于紧急广播</Text>
              </Card>
            </Col>
          </Row>
        </div>
      </Modal>

      {/* 历史记录弹窗 */}
      <Modal
        title="操作历史记录"
        open={historyModalVisible}
        onCancel={() => setHistoryModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setHistoryModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        <div>
          <List
            size="small"
            dataSource={[
              {
                id: 1,
                action: '分区配置更新',
                operator: '系统管理员',
                time: '2025-01-15 14:30:00',
                details: '前厅区域音量调整为80%'
              },
              {
                id: 2,
                action: '设备添加',
                operator: '技术员',
                time: '2025-01-15 13:15:00',
                details: '新增前厅音响设备'
              },
              {
                id: 3,
                action: '批量配置应用',
                operator: '系统管理员',
                time: '2025-01-15 12:00:00',
                details: '餐厅区域设备统一配置'
              },
              {
                id: 4,
                action: '分区状态变更',
                operator: '系统管理员',
                time: '2025-01-15 11:45:00',
                details: '花园区域设置为维护状态'
              }
            ]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<ClockCircleOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                  title={
                    <Space>
                      {item.action}
                      <Tag color="blue">{item.operator}</Tag>
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size="small">
                      <div>{item.details}</div>
                      <Text type="secondary">{item.time}</Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ZoneBroadcast;
