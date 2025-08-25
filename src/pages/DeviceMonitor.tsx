import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Row, Col, Statistic, Progress, Select, Input, Badge, Space, Button, Modal, Descriptions, Tabs } from 'antd';
import { MonitorOutlined, BulbOutlined, SnippetsOutlined, SafetyCertificateOutlined, VideoCameraOutlined, WarningOutlined, SearchOutlined, EyeOutlined, RobotOutlined, IdcardOutlined, VerticalAlignTopOutlined, FireOutlined, CameraOutlined } from '@ant-design/icons';
import { hotelDevices, hotelRooms, HotelDevice, HotelRoom } from '../data/mockData';
import dayjs from 'dayjs';
import ReactECharts from 'echarts-for-react';

const { Option } = Select;
const { Search } = Input;

const DeviceMonitor: React.FC = () => {
  const [devices, setDevices] = useState<HotelDevice[]>(hotelDevices);
  const [filteredDevices, setFilteredDevices] = useState<HotelDevice[]>(hotelDevices);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<HotelDevice | null>(null);

  // 生成当天的随机时间
  const generateTodayTime = () => {
    const now = dayjs();
    const randomMinutes = Math.floor(Math.random() * 60);
    const randomSeconds = Math.floor(Math.random() * 60);
    return now.subtract(randomMinutes, 'minute')
              .subtract(randomSeconds, 'second')
              .format('YYYY-MM-DD HH:mm:ss');
  };

  // 实时更新设备状态
  useEffect(() => {
    const updateDevice = (device: HotelDevice) => {
      const shouldUpdate = Math.random() < 0.3; // 30%概率更新
      if (!shouldUpdate) return device;

      return {
        ...device,
        lastUpdate: dayjs()
          .subtract(Math.floor(Math.random() * 60), 'minute')
          .subtract(Math.floor(Math.random() * 60), 'second')
          .format('YYYY-MM-DD HH:mm:ss'),
        signal: Math.max(80, Math.min(100, device.signal! + (Math.random() - 0.5) * 4)),
        temperature: device.temperature ? Math.max(18, Math.min(30, device.temperature + (Math.random() - 0.5) * 2)) : undefined,
        humidity: device.humidity ? Math.max(30, Math.min(70, device.humidity + (Math.random() - 0.5) * 4)) : undefined,
        brightness: device.brightness ? Math.max(0, Math.min(100, device.brightness + (Math.random() - 0.5) * 10)) : undefined,
        power: device.power ? Math.max(0, device.power + (Math.random() - 0.5) * 20) : undefined,
      };
    };

    const interval = setInterval(() => {
      setDevices(prevDevices => prevDevices.map(updateDevice));
    }, 180000); // 3分钟更新一次

    // 初始化设备时间
    setDevices(devices.map(updateDevice));

    return () => clearInterval(interval);
  }, []);

  // 过滤设备
  useEffect(() => {
    let filtered = devices;

    if (selectedFloor !== null) {
      filtered = filtered.filter(device => device.floor === selectedFloor);
    }

    if (selectedCategory) {
      filtered = filtered.filter(device => device.category === selectedCategory);
    }

    if (selectedStatus) {
      filtered = filtered.filter(device => device.status === selectedStatus);
    }

    if (searchText) {
      filtered = filtered.filter(device => 
        device.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (device.roomNumber && device.roomNumber.includes(searchText))
      );
    }

    setFilteredDevices(filtered);
  }, [devices, selectedFloor, selectedCategory, selectedStatus, searchText]);

  // 统计数据
  const totalDevices = devices.length;
  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const warningDevices = devices.filter(d => d.status === 'warning').length;
  const errorDevices = devices.filter(d => d.status === 'error').length;
  const totalEnergyConsumption = devices.reduce((sum, device) => sum + (device.energyConsumption || 0), 0);
  const averageUptime = (onlineDevices / totalDevices) * 100;

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const statusConfig = {
      online: { color: 'green', text: '在线' },
      offline: { color: 'red', text: '离线' },
      warning: { color: 'orange', text: '警告' },
      error: { color: 'red', text: '故障' }
    };
    return <Tag color={statusConfig[status as keyof typeof statusConfig].color}>
      {statusConfig[status as keyof typeof statusConfig].text}
    </Tag>;
  };

  // 获取设备类型图标
  const getDeviceIcon = (type: string) => {
    const iconMap = {
      air_conditioner: <SnippetsOutlined style={{ color: '#1890ff' }} />,
      lighting: <BulbOutlined style={{ color: '#fadb14' }} />,
      curtain: <SnippetsOutlined style={{ color: '#722ed1' }} />,
      tv: <VideoCameraOutlined style={{ color: '#eb2f96' }} />,
      sensor: <MonitorOutlined style={{ color: '#52c41a' }} />,
      door_lock: <SafetyCertificateOutlined style={{ color: '#fa8c16' }} />,
      mini_bar: <SnippetsOutlined style={{ color: '#13c2c2' }} />,
      safe_box: <SafetyCertificateOutlined style={{ color: '#f5222d' }} />,
      delivery_robot: <RobotOutlined style={{ color: '#52c41a' }} />,
      access_control: <IdcardOutlined style={{ color: '#1890ff' }} />,
      elevator: <VerticalAlignTopOutlined style={{ color: '#722ed1' }} />,
      fire_alarm: <FireOutlined style={{ color: '#f5222d' }} />,
      cctv_camera: <CameraOutlined style={{ color: '#13c2c2' }} />
    };
    return iconMap[type as keyof typeof iconMap] || <MonitorOutlined />;
  };

  // 表格列配置
  const columns = [
    {
      title: '设备',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string, record: HotelDevice) => (
        <Space>
          {getDeviceIcon(record.type)}
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '房间',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
      width: 80,
      render: (text: string, record: HotelDevice) => (
        <Badge count={record.floor} color="#1890ff">
          <span>{text}</span>
        </Badge>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '信号强度',
      dataIndex: 'signal',
      key: 'signal',
      width: 120,
      render: (signal: number) => (
        <Progress 
          percent={signal} 
          size="small" 
          status={signal > 90 ? 'success' : signal > 70 ? 'normal' : 'exception'}
          showInfo={false}
        />
      ),
    },
    {
      title: '功率(W)',
      dataIndex: 'power',
      key: 'power',
      width: 100,
      render: (power: number) => power ? `${power.toFixed(0)}W` : '-',
    },
    {
      title: '能耗(kWh)',
      dataIndex: 'energyConsumption',
      key: 'energyConsumption',
      width: 120,
      render: (energy: number) => energy ? `${energy.toFixed(1)}kWh` : '-',
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (text: any, record: HotelDevice) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedDevice(record);
            setDetailModalVisible(true);
          }}
        >
          详情
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="设备总数"
              value={totalDevices}
              prefix={<MonitorOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线设备"
              value={onlineDevices}
              suffix={`/ ${totalDevices}`}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="告警设备"
              value={warningDevices + errorDevices}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总能耗"
              value={totalEnergyConsumption.toFixed(1)}
              suffix="kWh"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 过滤器 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={4}>
            <Select
              placeholder="选择楼层"
              style={{ width: '100%' }}
              allowClear
              onChange={setSelectedFloor}
            >
              <Option value={1}>1楼</Option>
              <Option value={2}>2楼</Option>
              <Option value={3}>3楼</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="设备类别"
              style={{ width: '100%' }}
              allowClear
              onChange={setSelectedCategory}
            >
              <Option value="hvac">暖通空调</Option>
              <Option value="lighting">照明系统</Option>
              <Option value="security">安防系统</Option>
              <Option value="entertainment">娱乐设备</Option>
              <Option value="comfort">舒适设备</Option>
              <Option value="service">服务设备</Option>
              <Option value="safety">安全设备</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="设备状态"
              style={{ width: '100%' }}
              allowClear
              onChange={setSelectedStatus}
            >
              <Option value="online">在线</Option>
              <Option value="offline">离线</Option>
              <Option value="warning">警告</Option>
              <Option value="error">故障</Option>
            </Select>
          </Col>
          <Col span={8}>
            <Search
              placeholder="搜索设备名称或房间号"
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
              enterButton={<SearchOutlined />}
            />
          </Col>
          <Col span={4}>
            <Button 
              onClick={() => {
                setSelectedFloor(null);
                setSelectedCategory(null);
                setSelectedStatus(null);
                setSearchText('');
              }}
            >
              重置
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 设备列表 */}
      <Card 
        title={`设备监控 (${filteredDevices.length}/${totalDevices})`}
        extra={
          <Space>
            <span>在线率: {averageUptime.toFixed(1)}%</span>
            <Progress 
              type="circle" 
              percent={averageUptime} 
              width={40}
              format={() => ''}
            />
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredDevices}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 台设备`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* 图表监控 */}
      <Card title="设备监控图表" style={{ marginBottom: 16 }}>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: '1',
              label: '设备状态分布',
              children: (
                <Row gutter={16}>
                  <Col span={12}>
                    <Card title="设备状态饼图" size="small">
                      <ReactECharts
                        option={{
                          title: {
                            text: '设备状态分布',
                            left: 'center'
                          },
                          tooltip: {
                            trigger: 'item',
                            formatter: '{a} <br/>{b}: {c} ({d}%)'
                          },
                          legend: {
                            orient: 'vertical',
                            left: 'left'
                          },
                          series: [
                            {
                              name: '设备状态',
                              type: 'pie',
                              radius: '50%',
                              data: [
                                { value: onlineDevices, name: '在线', itemStyle: { color: '#52c41a' } },
                                { value: warningDevices, name: '警告', itemStyle: { color: '#faad14' } },
                                { value: errorDevices, name: '故障', itemStyle: { color: '#ff4d4f' } },
                                { value: totalDevices - onlineDevices - warningDevices - errorDevices, name: '离线', itemStyle: { color: '#d9d9d9' } }
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
                        style={{ height: '300px' }}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="设备类型分布" size="small">
                      <ReactECharts
                        option={{
                          title: {
                            text: '设备类型分布',
                            left: 'center'
                          },
                          tooltip: {
                            trigger: 'item',
                            formatter: '{a} <br/>{b}: {c} ({d}%)'
                          },
                          legend: {
                            orient: 'vertical',
                            left: 'left'
                          },
                          series: [
                            {
                              name: '设备类型',
                              type: 'pie',
                              radius: '50%',
                              data: [
                                { value: devices.filter(d => d.category === 'hvac').length, name: '暖通空调', itemStyle: { color: '#1890ff' } },
                                { value: devices.filter(d => d.category === 'lighting').length, name: '照明系统', itemStyle: { color: '#722ed1' } },
                                { value: devices.filter(d => d.category === 'security').length, name: '安防系统', itemStyle: { color: '#13c2c2' } },
                                { value: devices.filter(d => d.category === 'entertainment').length, name: '娱乐设备', itemStyle: { color: '#eb2f96' } },
                                { value: devices.filter(d => d.category === 'comfort').length, name: '舒适设备', itemStyle: { color: '#fa8c16' } },
                                { value: devices.filter(d => d.category === 'service').length, name: '服务设备', itemStyle: { color: '#a0d911' } },
                                { value: devices.filter(d => d.category === 'safety').length, name: '安全设备', itemStyle: { color: '#f5222d' } }
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
                        style={{ height: '300px' }}
                      />
                    </Card>
                  </Col>
                </Row>
              )
            },
            {
              key: '2',
              label: '能耗监控',
              children: (
                <Row gutter={16}>
                  <Col span={12}>
                    <Card title="楼层能耗对比" size="small">
                      <ReactECharts
                        option={{
                          title: {
                            text: '楼层能耗对比',
                            left: 'center'
                          },
                          tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                              type: 'shadow'
                            }
                          },
                          xAxis: {
                            type: 'category',
                            data: ['1楼', '2楼', '3楼']
                          },
                          yAxis: {
                            type: 'value',
                            name: '能耗 (kWh)'
                          },
                          series: [
                            {
                              name: '能耗',
                              type: 'bar',
                              data: [
                                devices.filter(d => d.floor === 1).reduce((sum, d) => sum + (d.energyConsumption || 0), 0),
                                devices.filter(d => d.floor === 2).reduce((sum, d) => sum + (d.energyConsumption || 0), 0),
                                devices.filter(d => d.floor === 3).reduce((sum, d) => sum + (d.energyConsumption || 0), 0)
                              ],
                              itemStyle: {
                                color: '#1890ff'
                              }
                            }
                          ]
                        }}
                        style={{ height: '300px' }}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="设备类型能耗" size="small">
                      <ReactECharts
                        option={{
                          title: {
                            text: '设备类型能耗',
                            left: 'center'
                          },
                          tooltip: {
                            trigger: 'item',
                            formatter: '{a} <br/>{b}: {c} kWh ({d}%)'
                          },
                          legend: {
                            orient: 'vertical',
                            left: 'left'
                          },
                          series: [
                            {
                              name: '能耗',
                              type: 'pie',
                              radius: '50%',
                              data: [
                                { value: devices.filter(d => d.category === 'hvac').reduce((sum, d) => sum + (d.energyConsumption || 0), 0), name: '暖通空调', itemStyle: { color: '#1890ff' } },
                                { value: devices.filter(d => d.category === 'lighting').reduce((sum, d) => sum + (d.energyConsumption || 0), 0), name: '照明系统', itemStyle: { color: '#722ed1' } },
                                { value: devices.filter(d => d.category === 'security').reduce((sum, d) => sum + (d.energyConsumption || 0), 0), name: '安防系统', itemStyle: { color: '#13c2c2' } },
                                { value: devices.filter(d => d.category === 'entertainment').reduce((sum, d) => sum + (d.energyConsumption || 0), 0), name: '娱乐设备', itemStyle: { color: '#eb2f96' } },
                                { value: devices.filter(d => d.category === 'comfort').reduce((sum, d) => sum + (d.energyConsumption || 0), 0), name: '舒适设备', itemStyle: { color: '#fa8c16' } },
                                { value: devices.filter(d => d.category === 'service').reduce((sum, d) => sum + (d.energyConsumption || 0), 0), name: '服务设备', itemStyle: { color: '#a0d911' } },
                                { value: devices.filter(d => d.category === 'safety').reduce((sum, d) => sum + (d.energyConsumption || 0), 0), name: '安全设备', itemStyle: { color: '#f5222d' } }
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
                        style={{ height: '300px' }}
                      />
                    </Card>
                  </Col>
                </Row>
              )
            },
            {
              key: '3',
              label: '实时监控',
              children: (
                <Row gutter={16}>
                  <Col span={12}>
                    <Card title="信号强度分布" size="small">
                      <ReactECharts
                        option={{
                          title: {
                            text: '信号强度分布',
                            left: 'center'
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
                                devices.filter(d => (d.signal || 0) <= 20).length,
                                devices.filter(d => (d.signal || 0) > 20 && (d.signal || 0) <= 40).length,
                                devices.filter(d => (d.signal || 0) > 40 && (d.signal || 0) <= 60).length,
                                devices.filter(d => (d.signal || 0) > 60 && (d.signal || 0) <= 80).length,
                                devices.filter(d => (d.signal || 0) > 80).length
                              ],
                              itemStyle: {
                                color: '#52c41a'
                              }
                            }
                          ]
                        }}
                        style={{ height: '300px' }}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="温度分布" size="small">
                      <ReactECharts
                        option={{
                          title: {
                            text: '设备温度分布',
                            left: 'center'
                          },
                          tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                              type: 'shadow'
                            }
                          },
                          xAxis: {
                            type: 'category',
                            data: ['<18°C', '18-22°C', '22-26°C', '26-30°C', '>30°C']
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
                                devices.filter(d => d.temperature && d.temperature < 18).length,
                                devices.filter(d => d.temperature && d.temperature >= 18 && d.temperature < 22).length,
                                devices.filter(d => d.temperature && d.temperature >= 22 && d.temperature < 26).length,
                                devices.filter(d => d.temperature && d.temperature >= 26 && d.temperature < 30).length,
                                devices.filter(d => d.temperature && d.temperature >= 30).length
                              ],
                              itemStyle: {
                                color: '#fa8c16'
                              }
                            }
                          ]
                        }}
                        style={{ height: '300px' }}
                      />
                    </Card>
                  </Col>
                </Row>
              )
            }
          ]}
        />
      </Card>

      {/* 设备详情弹窗 */}
      <Modal
        title="设备详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedDevice && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="设备名称" span={2}>
              <Space>
                {getDeviceIcon(selectedDevice.type)}
                {selectedDevice.name}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="设备ID">{selectedDevice.id}</Descriptions.Item>
            <Descriptions.Item label="设备类型">
              {selectedDevice.type.replace('_', ' ').toUpperCase()}
            </Descriptions.Item>
            <Descriptions.Item label="房间号">{selectedDevice.roomNumber}</Descriptions.Item>
            <Descriptions.Item label="楼层">{selectedDevice.floor}楼</Descriptions.Item>
            <Descriptions.Item label="位置" span={2}>{selectedDevice.location}</Descriptions.Item>
            <Descriptions.Item label="状态">{getStatusTag(selectedDevice.status)}</Descriptions.Item>
            <Descriptions.Item label="信号强度">
              <Progress percent={selectedDevice.signal} size="small" />
            </Descriptions.Item>
            {selectedDevice.temperature && (
              <Descriptions.Item label="温度">{selectedDevice.temperature.toFixed(1)}°C</Descriptions.Item>
            )}
            {selectedDevice.humidity && (
              <Descriptions.Item label="湿度">{selectedDevice.humidity.toFixed(1)}%</Descriptions.Item>
            )}
            {selectedDevice.brightness && (
              <Descriptions.Item label="亮度">{selectedDevice.brightness.toFixed(0)}%</Descriptions.Item>
            )}
            {selectedDevice.power && (
              <Descriptions.Item label="功率">{selectedDevice.power.toFixed(0)}W</Descriptions.Item>
            )}
            {selectedDevice.energyConsumption && (
              <Descriptions.Item label="能耗">{selectedDevice.energyConsumption.toFixed(1)}kWh</Descriptions.Item>
            )}
            {selectedDevice.battery && (
              <Descriptions.Item label="电池电量">
                <Progress 
                  percent={selectedDevice.battery} 
                  size="small"
                  status={selectedDevice.battery > 20 ? 'success' : 'exception'}
                />
              </Descriptions.Item>
            )}
            <Descriptions.Item label="最后更新" span={2}>{selectedDevice.lastUpdate}</Descriptions.Item>
            {selectedDevice.errorMessage && (
              <Descriptions.Item label="错误信息" span={2}>
                <Tag color="red">{selectedDevice.errorMessage}</Tag>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default DeviceMonitor; 