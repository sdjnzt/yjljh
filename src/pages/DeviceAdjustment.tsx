import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Slider, Switch, Button, Select, Space, Alert, Modal, Table, Tag, Statistic, Progress, Radio, Tooltip, Badge } from 'antd';
import { SettingOutlined, ThunderboltOutlined, BulbOutlined, SnippetsOutlined, SaveOutlined, HistoryOutlined, ReloadOutlined, ArrowUpOutlined, ArrowDownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { hotelDevices, deviceAdjustments, HotelDevice, DeviceAdjustment } from '../data/mockData';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import DatePicker from 'antd/es/date-picker';
import { Line } from '@ant-design/plots';

const { Option } = Select;
const { RangePicker } = DatePicker;

// 添加图表配置
const ChartConfig = {
  height: 300,
  padding: 'auto',
  xField: 'timestamp',
  yField: 'value',
  seriesField: 'type',
  smooth: true,
  animation: {
    appear: {
      animation: 'path-in',
      duration: 1000,
    },
  },
  legend: {
    position: 'top',
  },
};

const DeviceAdjustmentPage: React.FC = () => {
  // 使用useEffect来确保每次访问页面时都获取最新数据
  const [devices, setDevices] = useState<HotelDevice[]>([]);
  const [adjustmentHistory, setAdjustmentHistory] = useState<DeviceAdjustment[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>('0101');
  const [historyVisible, setHistoryVisible] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 添加新的状态
  const [activeTab, setActiveTab] = useState<'control' | 'analysis'>('control');
  const [dateRange, setDateRange] = useState<[string, string]>([
    dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD')
  ]);
  const [filterType, setFilterType] = useState<'all' | 'temperature' | 'brightness'>('all');
  const [filterOperator, setFilterOperator] = useState<'all' | 'guest' | 'staff' | 'auto_system'>('all');

  useEffect(() => {
    // 每次进入页面时重新获取最新数据
    setDevices(hotelDevices);
    setAdjustmentHistory(deviceAdjustments);
  }, []);
  
  // 获取当前房间的设备
  const roomDevices = devices.filter(device => device.roomNumber === selectedRoom);
  
  // 获取房间列表
  const roomNumbers = Array.from(new Set(devices.map(device => device.roomNumber)))
    .filter((room): room is string => !!room) // 过滤掉undefined或null
    .sort((a, b) => {
      // 按楼层和房间号排序
      const floorA = parseInt(a.substring(0, 2));
      const roomA = parseInt(a.substring(2, 4));
      const floorB = parseInt(b.substring(0, 2));
      const roomB = parseInt(b.substring(2, 4));
      
      if (floorA !== floorB) {
        return floorA - floorB;
      }
      return roomA - roomB;
    });

  // 计算统计数据
  const calculateStats = () => {
    const filteredHistory = adjustmentHistory.filter(adj => adj.roomNumber === selectedRoom);
    const temperatureAdjustments = filteredHistory.filter(adj => adj.adjustmentType === 'temperature');
    const brightnessAdjustments = filteredHistory.filter(adj => adj.adjustmentType === 'brightness');
    
    return {
      totalAdjustments: filteredHistory.length,
      temperatureAdjustments: temperatureAdjustments.length,
      brightnessAdjustments: brightnessAdjustments.length,
      guestAdjustments: filteredHistory.filter(adj => adj.adjustedBy === 'guest').length,
      staffAdjustments: filteredHistory.filter(adj => adj.adjustedBy === 'staff').length,
      autoAdjustments: filteredHistory.filter(adj => adj.adjustedBy === 'auto_system').length,
      totalEnergyImpact: Number(filteredHistory.reduce((sum, adj) => sum + (adj.energyImpact || 0), 0).toFixed(2)),
      averageTemperature: temperatureAdjustments.length > 0 
        ? Number((temperatureAdjustments.reduce((sum, adj) => sum + Number(adj.newValue), 0) / temperatureAdjustments.length).toFixed(1))
        : null,
      averageBrightness: brightnessAdjustments.length > 0
        ? Math.round(brightnessAdjustments.reduce((sum, adj) => sum + Number(adj.newValue), 0) / brightnessAdjustments.length)
        : null
    };
  };

  const stats = calculateStats();

  // 过滤历史记录
  const filteredHistory = adjustmentHistory.filter(adj => {
    const dateMatch = dayjs(adj.timestamp).format('YYYY-MM-DD') >= dateRange[0] &&
                     dayjs(adj.timestamp).format('YYYY-MM-DD') <= dateRange[1];
    const typeMatch = filterType === 'all' || adj.adjustmentType === filterType;
    const operatorMatch = filterOperator === 'all' || adj.adjustedBy === filterOperator;
    return adj.roomNumber === selectedRoom && dateMatch && typeMatch && operatorMatch;
  });

  // 添加图表数据处理函数
  const getChartData = () => {
    const data: any[] = [];
    const sortedHistory = [...filteredHistory].sort((a, b) => 
      dayjs(a.timestamp).valueOf() - dayjs(b.timestamp).valueOf()
    );

    sortedHistory.forEach(adj => {
      if (adj.adjustmentType === 'temperature') {
        data.push({
          timestamp: dayjs(adj.timestamp).format('MM-DD HH:mm'),
          value: adj.newValue,
          type: '温度(°C)'
        });
      } else if (adj.adjustmentType === 'brightness') {
        data.push({
          timestamp: dayjs(adj.timestamp).format('MM-DD HH:mm'),
          value: adj.newValue,
          type: '亮度(%)'
        });
      }
    });

    return data;
  };

  // 设备控制组件
  const DeviceControl: React.FC<{ device: HotelDevice; onUpdate: (updates: Partial<HotelDevice>) => void }> = 
    ({ device, onUpdate }) => {
    
    const getDeviceIcon = (type: string) => {
      const iconMap = {
        air_conditioner: <SnippetsOutlined style={{ color: '#1890ff' }} />,
        lighting: <BulbOutlined style={{ color: '#fadb14' }} />,
        tv: <SnippetsOutlined style={{ color: '#eb2f96' }} />,
        curtain: <SnippetsOutlined style={{ color: '#722ed1' }} />
      };
      return iconMap[type as keyof typeof iconMap] || <SettingOutlined />;
    };

    const renderControls = () => {
      switch (device.type) {
        case 'air_conditioner':
          return (
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <label>温度设置: {device.temperature}°C</label>
                <Slider
                  min={16}
                  max={30}
                  value={device.temperature}
                  onChange={(value) => {
                    onUpdate({ temperature: value });
                    setHasUnsavedChanges(true);
                  }}
                  marks={{
                    16: '16°C',
                    22: '22°C',
                    26: '26°C',
                    30: '30°C'
                  }}
                />
              </div>
              <div>
                <label>湿度设置: {device.humidity}%</label>
                <Slider
                  min={30}
                  max={70}
                  value={device.humidity}
                  onChange={(value) => {
                    onUpdate({ humidity: value });
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>
            </Space>
          );
        
        case 'lighting':
          return (
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <label>亮度: {device.brightness}%</label>
                <Slider
                  min={0}
                  max={100}
                  value={device.brightness}
                  onChange={(value) => {
                    onUpdate({ brightness: value });
                    setHasUnsavedChanges(true);
                  }}
                  marks={{
                    0: '关闭',
                    25: '25%',
                    50: '50%',
                    75: '75%',
                    100: '100%'
                  }}
                />
              </div>
            </Space>
          );
        
        case 'tv':
          return (
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>电源状态</span>
                <Switch 
                  checked={device.power! > 0} 
                  onChange={(checked) => {
                    onUpdate({ power: checked ? 150 : 0 });
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>
              <div>
                <label>音量: 50%</label>
                <Slider
                  min={0}
                  max={100}
                  defaultValue={50}
                  onChange={() => setHasUnsavedChanges(true)}
                />
              </div>
            </Space>
          );
        
        case 'curtain':
          return (
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <label>开启程度: 50%</label>
                <Slider
                  min={0}
                  max={100}
                  defaultValue={50}
                  onChange={() => setHasUnsavedChanges(true)}
                  marks={{
                    0: '关闭',
                    50: '半开',
                    100: '全开'
                  }}
                />
              </div>
            </Space>
          );
        
        default:
          return (
            <div style={{ textAlign: 'center', color: '#999' }}>
              该设备暂不支持远程调节
            </div>
          );
      }
    };

    return (
      <Card 
        title={
          <Space>
            {getDeviceIcon(device.type)}
            {device.name}
            <Tag color={device.status === 'online' ? 'green' : 'red'}>
              {device.status === 'online' ? '在线' : '离线'}
            </Tag>
          </Space>
        }
        extra={
          <Space>
            <span style={{ fontSize: '12px', color: '#666' }}>
              功率: {device.power}W
            </span>
          </Space>
        }
        size="small"
      >
        {device.status === 'online' ? renderControls() : (
          <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
            设备离线，无法调节
          </div>
        )}
      </Card>
    );
  };

  // 更新设备参数
  const updateDevice = (deviceId: string, updates: Partial<HotelDevice>) => {
    setDevices(prevDevices => 
      prevDevices.map(device => 
        device.id === deviceId 
          ? { ...device, ...updates, lastUpdate: new Date().toLocaleString() }
          : device
      )
    );
  };

  // 历史记录表格列
  const historyColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
    },
    {
      title: '设备',
      dataIndex: 'deviceName',
      key: 'deviceName',
      width: 120,
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'adjustmentType',
      key: 'adjustmentType',
      width: 80,
      render: (type: string) => {
        const typeNames = {
          temperature: '温度',
          brightness: '亮度',
          volume: '音量',
          power: '电源',
          schedule: '定时'
        };
        return typeNames[type as keyof typeof typeNames] || type;
      }
    },
    {
      title: '调节前',
      dataIndex: 'oldValue',
      key: 'oldValue',
      width: 80,
      render: (value: number, record: DeviceAdjustment) => {
        return record.adjustmentType === 'temperature' ? 
          `${value.toFixed(1)}°C` : 
          `${value}%`;
      }
    },
    {
      title: '调节后',
      dataIndex: 'newValue',
      key: 'newValue',
      width: 80,
      render: (value: number, record: DeviceAdjustment) => {
        return record.adjustmentType === 'temperature' ? 
          `${value.toFixed(1)}°C` : 
          `${value}%`;
      }
    },
    {
      title: '调节人',
      dataIndex: 'adjustedBy',
      key: 'adjustedBy',
      width: 90,
      render: (value: string) => {
        const adjustedByMap = {
          guest: '客人',
          staff: '工作人员',
          auto_system: '自动系统'
        };
        return adjustedByMap[value as keyof typeof adjustedByMap] || value;
      }
    },
    {
      title: '原因',
      dataIndex: 'reason',
      key: 'reason',
      width: 160,
      ellipsis: true,
    },
    {
      title: '能耗影响',
      dataIndex: 'energyImpact',
      key: 'energyImpact',
      width: 100,
      align: 'right' as const,
      render: (impact: number) => (
        <Tag color={impact > 0 ? '#ff4d4f' : '#52c41a'} style={{ margin: 0 }}>
          {impact > 0 ? '+' : ''}{impact.toFixed(2)} kWh
        </Tag>
      )
    }
  ];

  // 保存设置
  const saveSettings = () => {
    // 模拟保存到后端
    setHasUnsavedChanges(false);
    
    // 添加到历史记录
    const newAdjustments: DeviceAdjustment[] = roomDevices.map(device => {
      const isTemperature = device.type === 'air_conditioner';
      return {
        id: `adj_${Date.now()}_${device.id}`,
        deviceId: device.id,
        deviceName: device.name,
        roomNumber: selectedRoom,
        adjustmentType: isTemperature ? 'temperature' : 'brightness',
        oldValue: isTemperature ? device.temperature || 22 : device.brightness || 0,
        newValue: isTemperature ? device.temperature || 22 : device.brightness || 0,
        adjustedBy: 'staff',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        reason: '工作人员手动调节',
        energyImpact: 0
      };
    });
    
    setAdjustmentHistory(prev => [...newAdjustments, ...prev]);
    
    Modal.success({
      title: '设置已保存',
      content: '设备参数已成功更新'
    });
  };

  // 重置设置
  const resetSettings = () => {
    Modal.confirm({
      title: '确认重置',
      content: '确定要重置当前房间所有设备到默认设置吗？',
      onOk: () => {
        setDevices(prevDevices => 
          prevDevices.map(device => {
            if (device.roomNumber === selectedRoom) {
              return {
                ...device,
                temperature: device.type === 'air_conditioner' ? 22 : device.temperature,
                brightness: device.type === 'lighting' ? 70 : device.brightness,
                humidity: device.type === 'air_conditioner' ? 45 : device.humidity,
                lastUpdate: new Date().toLocaleString()
              };
            }
            return device;
          })
        );
        setHasUnsavedChanges(false);
      }
    });
  };

  // 计算房间能耗统计
  const roomEnergyConsumption = roomDevices.reduce((sum, device) => sum + (device.energyConsumption || 0), 0);
  const roomPowerConsumption = roomDevices.reduce((sum, device) => sum + (device.power || 0), 0);
  const onlineDeviceCount = roomDevices.filter(d => d.status === 'online').length;

  // 渲染统计卡片
  const renderStatsCards = () => (
    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
      <Col span={6}>
        <Card>
          <Statistic
            title={
              <Space>
                总调节次数
                <Tooltip title="包括温度和亮度的所有调节记录">
                  <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
                </Tooltip>
              </Space>
            }
            value={stats.totalAdjustments}
            suffix="次"
            valueStyle={{ color: '#1890ff' }}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
            <Badge color="#1890ff" text={`温度: ${stats.temperatureAdjustments}`} style={{ marginRight: 12 }} />
            <Badge color="#52c41a" text={`亮度: ${stats.brightnessAdjustments}`} />
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title={
              <Space>
                调节来源分布
                <Tooltip title="显示不同操作者的调节次数">
                  <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
                </Tooltip>
              </Space>
            }
            value={stats.guestAdjustments + stats.staffAdjustments + stats.autoAdjustments}
            suffix="次"
            valueStyle={{ color: '#52c41a' }}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
            <Badge color="#f5222d" text={`客人: ${stats.guestAdjustments}`} style={{ marginRight: 8 }} />
            <Badge color="#1890ff" text={`工作人员: ${stats.staffAdjustments}`} style={{ marginRight: 8 }} />
            <Badge color="#52c41a" text={`自动: ${stats.autoAdjustments}`} />
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title={
              <Space>
                能耗影响
                <Tooltip title="正值表示能耗增加，负值表示节能">
                  <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
                </Tooltip>
              </Space>
            }
            value={stats.totalEnergyImpact}
            suffix="kWh"
            valueStyle={{ color: stats.totalEnergyImpact > 0 ? '#ff4d4f' : '#52c41a' }}
            prefix={stats.totalEnergyImpact > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          />
          <Progress 
            percent={Math.abs(stats.totalEnergyImpact / 0.2)} 
            size="small" 
            status={stats.totalEnergyImpact > 0 ? "exception" : "success"}
            showInfo={false}
            style={{ marginTop: 8 }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title={
              <Space>
                平均设置
                <Tooltip title="显示温度或亮度的平均设定值">
                  <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
                </Tooltip>
              </Space>
            }
            value={stats.averageTemperature || stats.averageBrightness || 0}
            suffix={stats.averageTemperature ? '°C' : '%'}
            valueStyle={{ color: '#722ed1' }}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
            {stats.averageTemperature ? '平均温度' : '平均亮度'}
          </div>
        </Card>
      </Col>
    </Row>
  );

  // 渲染分析内容
  const renderAnalysis = () => (
    <>
      {renderFilters()}
      <Card title="调节趋势" style={{ marginBottom: 16 }}>
        <Line {...ChartConfig} data={getChartData()} />
      </Card>
      <Card title="调节记录" extra={
        <Space>
          <Badge status="processing" text="总计" />
          <span style={{ fontWeight: 'bold' }}>{filteredHistory.length}</span>
          <span>条记录</span>
        </Space>
      }>
        <Table
          columns={historyColumns}
          dataSource={filteredHistory}
          rowKey="id"
          pagination={{ 
            pageSize: 10,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total) => `共 ${total} 条记录`
          }}
          size="small"
        />
      </Card>
    </>
  );

  // 渲染过滤器
  const renderFilters = () => (
    <Row gutter={16} style={{ marginBottom: 16 }}>
      <Col span={6}>
        <RangePicker
          value={[dayjs(dateRange[0]), dayjs(dateRange[1])]}
          onChange={(dates: [Dayjs | null, Dayjs | null] | null) => {
            if (dates && dates[0] && dates[1]) {
              setDateRange([
                dates[0].format('YYYY-MM-DD'),
                dates[1].format('YYYY-MM-DD')
              ]);
            }
          }}
          style={{ width: '100%' }}
        />
      </Col>
      <Col span={6}>
        <Select
          value={filterType}
          onChange={setFilterType}
          style={{ width: '100%' }}
        >
          <Option value="all">全部类型</Option>
          <Option value="temperature">温度调节</Option>
          <Option value="brightness">亮度调节</Option>
        </Select>
      </Col>
      <Col span={6}>
        <Select
          value={filterOperator}
          onChange={setFilterOperator}
          style={{ width: '100%' }}
        >
          <Option value="all">全部操作者</Option>
          <Option value="guest">客人</Option>
          <Option value="staff">工作人员</Option>
          <Option value="auto_system">自动系统</Option>
        </Select>
      </Col>
      <Col span={6}>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />}
          onClick={() => {
            setDateRange([
              dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
              dayjs().format('YYYY-MM-DD')
            ]);
            setFilterType('all');
            setFilterOperator('all');
          }}
        >
          重置筛选
        </Button>
      </Col>
    </Row>
  );

  return (
    <div style={{ padding: '0 16px' }}>
      {/* 未保存更改提示 */}
      {hasUnsavedChanges && (
        <Alert
          message="有未保存的更改"
          description="您对设备参数进行了修改，请记得保存设置"
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          action={
            <Button size="small" type="primary" onClick={saveSettings}>
              立即保存
            </Button>
          }
        />
      )}

      {/* 房间选择和统计 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <div style={{ marginBottom: 16 }}>
              <Space style={{ marginBottom: 8 }}>
                <label>选择房间：</label>
                <Tooltip title="选择要查看的房间">
                  <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
                </Tooltip>
              </Space>
              <Select
                style={{ width: '100%' }}
                value={selectedRoom}
                onChange={setSelectedRoom}
                optionLabelProp="label"
              >
                {roomNumbers.map(room => {
                  if (!room) return null;
                  const floor = parseInt(room.substring(0, 2));
                  let roomType = '标准间';
                  if (floor >= 19) roomType = '总统套房';
                  else if (floor >= 16) roomType = '豪华套房';
                  else if (floor >= 11) roomType = '豪华间';
                  
                  return (
                    <Option key={room} value={room} label={`${room}房间`}>
                      <Space>
                        <span>{room}房间</span>
                        <Tag color={
                          floor >= 19 ? 'gold' :
                          floor >= 16 ? 'purple' :
                          floor >= 11 ? 'blue' :
                          'default'
                        }>{roomType}</Tag>
                      </Space>
                    </Option>
                  );
                })}
              </Select>
            </div>
          </Card>
        </Col>
        <Col span={18}>
          {renderStatsCards()}
        </Col>
      </Row>

      {/* 主要内容区 */}
      <Card
        title={`房间 ${selectedRoom} 设备控制`}
        extra={
          <Space>
            <Radio.Group value={activeTab} onChange={e => setActiveTab(e.target.value)}>
              <Radio.Button value="control">设备控制</Radio.Button>
              <Radio.Button value="analysis">调节分析</Radio.Button>
            </Radio.Group>
            <Button onClick={() => setHistoryVisible(true)} icon={<HistoryOutlined />}>
              调节历史
            </Button>
            <Button onClick={resetSettings}>
              重置设置
            </Button>
            <Button 
              type="primary" 
              icon={<SaveOutlined />}
              onClick={saveSettings}
              disabled={!hasUnsavedChanges}
            >
              保存设置
            </Button>
          </Space>
        }
      >
        {activeTab === 'control' ? (
          <Row gutter={16}>
            {roomDevices.map(device => (
              <Col span={12} key={device.id} style={{ marginBottom: 16 }}>
                <DeviceControl 
                  device={device} 
                  onUpdate={(updates) => updateDevice(device.id, updates)}
                />
              </Col>
            ))}
            {roomDevices.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                该房间暂无设备
              </div>
            )}
          </Row>
        ) : (
          renderAnalysis()
        )}
      </Card>

      {/* 调节历史弹窗 */}
      <Modal
        title={`房间${selectedRoom}设备调节历史`}
        open={historyVisible}
        onCancel={() => setHistoryVisible(false)}
        footer={null}
        width={900}
        style={{ top: 80 }}
        bodyStyle={{ padding: '12px' }}
      >
        <Table
          columns={historyColumns}
          dataSource={adjustmentHistory.filter(adj => adj.roomNumber === selectedRoom)}
          rowKey="id"
          pagination={{ 
            pageSize: 10,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total) => `共 ${total} 条记录`
          }}
          size="small"
          scroll={{ x: 'max-content' }}
          style={{ marginTop: 8 }}
        />
      </Modal>
    </div>
  );
};

export default DeviceAdjustmentPage; 