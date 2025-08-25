import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Alert,
  Typography,
  Divider,
  Tooltip,
  Badge,
  Tabs
} from 'antd';
import {
  CloudOutlined,
  SunOutlined,
  EyeOutlined,
  SettingOutlined,
  ReloadOutlined,
  ExportOutlined,
  BellOutlined,
  LineChartOutlined,
  EnvironmentOutlined,
  AlertOutlined,
  FireOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface EnvironmentData {
  id: string;
  location: string;
  temperature: number;
  humidity: number;
  airQuality: number;
  lightIntensity: number;
  noiseLevel: number;
  status: 'normal' | 'warning' | 'danger';
  lastUpdate: string;
}

interface AnalysisData {
  time: string;
  value: number;
}

interface LocationData {
  name: string;
  type: 'public' | 'restaurant' | 'room' | 'facility' | 'equipment';
}

interface AreaData {
  name: string;
  value: number;
}

interface EnvironmentType {
  type: 'temperature' | 'humidity' | 'airQuality' | 'noiseLevel';
  max: number;
  unit: string;
}

const EnvironmentMonitor: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<EnvironmentData[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [chartModalVisible, setChartModalVisible] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>(dayjs().format('YYYY-MM-DD HH:mm:ss'));
  const [analysisTab, setAnalysisTab] = useState('temperature');
  const [analysisTimeRange, setAnalysisTimeRange] = useState<'day' | 'week' | 'month'>('day');

  // 生成实时数据的函数
  const generateRealtimeData = () => {
    return mockLocations.map((location, index) => {
      // 添加随机波动
      const randomFluctuation = (base: number, range: number) => {
        return Number((base + (Math.random() - 0.5) * range).toFixed(1));
      };

      // 基于位置特征设置基准值和波动范围
      let baseTemp = 24.0;
      let baseHumidity = 60;
      let baseAirQuality = 85;
      let baseLightIntensity = 800;
      let baseNoiseLevel = 45;
      let status: 'normal' | 'warning' | 'danger' = 'normal';

      // 根据位置类型调整参数
      switch (location.type) {
        case 'public':
          baseTemp = 24.0;
          baseHumidity = 60;
          baseAirQuality = 85;
          baseLightIntensity = 1000;
          baseNoiseLevel = 50;
          break;
        case 'restaurant':
          baseTemp = 25.0;
          baseHumidity = 58;
          baseAirQuality = 82;
          baseLightIntensity = 800;
          baseNoiseLevel = 55;
          break;
        case 'room':
          baseTemp = 23.5;
          baseHumidity = 55;
          baseAirQuality = 90;
          baseLightIntensity = 600;
          baseNoiseLevel = 35;
          break;
        case 'facility':
          baseTemp = 26.0;
          baseHumidity = 65;
          baseAirQuality = 80;
          baseLightIntensity = 700;
          baseNoiseLevel = 60;
          break;
        case 'equipment':
          baseTemp = 28.0;
          baseHumidity = 45;
          baseAirQuality = 75;
          baseLightIntensity = 400;
          baseNoiseLevel = 70;
          break;
      }

      // 生成当前值
      const temperature = randomFluctuation(baseTemp, 2);
      const humidity = randomFluctuation(baseHumidity, 10);
      const airQuality = randomFluctuation(baseAirQuality, 15);
      const lightIntensity = Math.round(randomFluctuation(baseLightIntensity, 200));
      const noiseLevel = Math.round(randomFluctuation(baseNoiseLevel, 10));

      // 确定状态
      if (
        temperature > 30 ||
        humidity > 80 ||
        airQuality < 60 ||
        noiseLevel > 70
      ) {
        status = 'danger';
      } else if (
        temperature > 28 ||
        humidity > 70 ||
        airQuality < 70 ||
        noiseLevel > 60
      ) {
        status = 'warning';
      }

      return {
        id: (index + 1).toString(),
        location: location.name,
        temperature,
        humidity,
        airQuality,
        lightIntensity,
        noiseLevel,
        status,
        lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      };
    });
  };

  // 生成分析数据
  const generateAnalysisData = (type: string, range: 'day' | 'week' | 'month'): AnalysisData[] => {
    const now = dayjs();
    const data: AnalysisData[] = [];
    let startTime: dayjs.Dayjs;
    let interval: number;
    let format: string;

    switch (range) {
      case 'day':
        startTime = now.subtract(24, 'hour');
        interval = 60; // 每小时一个点
        format = 'HH:mm';
        break;
      case 'week':
        startTime = now.subtract(7, 'day');
        interval = 24; // 每天一个点
        format = 'MM-DD';
        break;
      case 'month':
        startTime = now.subtract(30, 'day');
        interval = 24; // 每天一个点
        format = 'MM-DD';
        break;
    }

    // 基准值设置
    const baseValues: Record<string, number> = {
      temperature: 24,
      humidity: 60,
      airQuality: 85,
      noiseLevel: 45
    };

    // 波动范围设置
    const fluctuationRanges: Record<string, number> = {
      temperature: 3,
      humidity: 10,
      airQuality: 15,
      noiseLevel: 10
    };

    // 生成时间序列数据
    let currentTime = startTime;
    while (currentTime.isBefore(now) || currentTime.isSame(now)) {
      const baseValue = baseValues[type] || 0;
      const fluctuation = fluctuationRanges[type] || 0;
      const value = baseValue + (Math.random() - 0.5) * fluctuation;

      // 添加时间模式
      const hour = currentTime.hour();
      let modifier = 0;
      
      // 根据时间调整数值
      if (type === 'temperature') {
        // 温度在白天升高，晚上降低
        modifier = hour >= 6 && hour <= 18 ? 1 : -1;
      } else if (type === 'humidity') {
        // 湿度在早晚较高
        modifier = (hour <= 6 || hour >= 18) ? 1 : -1;
      } else if (type === 'noiseLevel') {
        // 噪音在用餐和活动时间较高
        modifier = (hour >= 7 && hour <= 9) || (hour >= 12 && hour <= 14) || (hour >= 18 && hour <= 21) ? 2 : 0;
      }

      data.push({
        time: currentTime.format(format),
        value: Number((value + modifier).toFixed(1))
      });

      currentTime = currentTime.add(range === 'day' ? 1 : 24, 'hour');
    }

    return data;
  };

  // 获取图表选项
  const getChartOption = (type: string, data: AnalysisData[]) => {
    const titles: { [key: string]: string } = {
      temperature: '温度趋势 (°C)',
      humidity: '湿度趋势 (%)',
      airQuality: '空气质量趋势',
      noiseLevel: '噪音趋势 (dB)'
    };

    const colors: { [key: string]: string } = {
      temperature: '#ff4d4f',
      humidity: '#1890ff',
      airQuality: '#52c41a',
      noiseLevel: '#faad14'
    };

    return {
      title: {
        text: titles[type],
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>${data.value}${type === 'temperature' ? '°C' : type === 'humidity' ? '%' : type === 'noiseLevel' ? 'dB' : ''}`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.map(item => item.time)
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => `${value}${type === 'temperature' ? '°C' : type === 'humidity' ? '%' : type === 'noiseLevel' ? 'dB' : ''}`
        }
      },
      series: [
        {
          name: titles[type],
          type: 'line',
          smooth: true,
          data: data.map(item => item.value),
          itemStyle: {
            color: colors[type]
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colors[type]
              },
              {
                offset: 1,
                color: '#fff'
              }
            ])
          }
        }
      ]
    };
  };

  // 获取多区域对比图表选项
  const getComparisonChartOption = (envType: string) => {
    const locationTypes = ['public', 'restaurant', 'room', 'facility', 'equipment'] as const;
    const typeNames: Record<typeof locationTypes[number], string> = {
      public: '公共区域',
      restaurant: '餐饮区域',
      room: '客房区域',
      facility: '设施区域',
      equipment: '设备区域'
    };

    const environmentTypes: Record<string, EnvironmentType> = {
      temperature: { type: 'temperature', max: 35, unit: '°C' },
      humidity: { type: 'humidity', max: 100, unit: '%' },
      airQuality: { type: 'airQuality', max: 100, unit: '' },
      noiseLevel: { type: 'noiseLevel', max: 80, unit: 'dB' }
    };

    const areaData: AreaData[] = locationTypes.map(locationType => {
      const locations = mockLocations.filter(loc => loc.type === locationType);
      const values = data
        .filter(item => locations.some(loc => loc.name === item.location))
        .map(item => {
          const value = item[envType as keyof typeof item];
          return typeof value === 'number' ? value : 0;
        });

      return {
        name: typeNames[locationType],
        value: values.length > 0 ? 
          Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)) : 0
      };
    });

    return {
      title: {
        text: '各区域对比',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      radar: {
        indicator: locationTypes.map(type => ({
          name: typeNames[type],
          max: environmentTypes[envType]?.max || 100
        }))
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: areaData.map(item => item.value),
              name: '当前值',
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(24,144,255,0.3)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(24,144,255,0.1)'
                  }
                ])
              }
            }
          ]
        }
      ]
    };
  };

  // 监测点位置配置
  const mockLocations = [
    { name: '大门主区域', type: 'public' },
    { name: '中餐厅', type: 'restaurant' },
    { name: '西餐厅', type: 'restaurant' },
    { name: '大门吧', type: 'restaurant' },
    { name: '行政酒廊', type: 'public' },
    { name: '宴会厅A', type: 'public' },
    { name: '宴会厅B', type: 'public' },
    { name: '多功能厅', type: 'public' },
    { name: '健身中心', type: 'facility' },
    { name: 'SPA区域', type: 'facility' },
    { name: '游泳池', type: 'facility' },
    { name: '地下停车场A区', type: 'equipment' },
    { name: '地下停车场B区', type: 'equipment' },
    { name: '员工餐厅', type: 'restaurant' },
    { name: '员工休息室', type: 'public' },
    { name: '行政办公区', type: 'public' },
    { name: '总统套房', type: 'room' },
    { name: '豪华套房区域', type: 'room' },
    { name: '标准客房区域A', type: 'room' },
    { name: '标准客房区域B', type: 'room' },
    { name: '空调机房', type: 'equipment' },
    { name: '配电房', type: 'equipment' },
    { name: '锅炉房', type: 'equipment' },
    { name: '中央厨房', type: 'restaurant' },
    { name: '洗衣房', type: 'equipment' }
  ];

  // 自动更新数据
  useEffect(() => {
    // 首次加载数据
    loadData();

    // 设置定时器，每分钟更新一次数据
    const timer = setInterval(() => {
      loadData();
    }, 60000); // 60秒更新一次

    // 清理函数
    return () => {
      clearInterval(timer);
    };
  }, []);

  const loadData = () => {
    setLoading(true);
    // 生成新的实时数据
    const newData = generateRealtimeData();
    setData(newData);
    setLastUpdateTime(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'green';
      case 'warning':
        return 'orange';
      case 'danger':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return '正常';
      case 'warning':
        return '警告';
      case 'danger':
        return '危险';
      default:
        return '未知';
    }
  };

  const getAirQualityLevel = (value: number) => {
    if (value >= 90) return { level: '优', color: 'green' };
    if (value >= 80) return { level: '良', color: 'blue' };
    if (value >= 70) return { level: '一般', color: 'orange' };
    return { level: '差', color: 'red' };
  };

  const columns = [
    {
      title: '监测点',
      dataIndex: 'location',
      key: 'location',
      render: (text: string) => (
        <Space>
          <EnvironmentOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '温度 (°C)',
      dataIndex: 'temperature',
      key: 'temperature',
      render: (value: number) => (
        <Space>
          <FireOutlined style={{ color: '#ff4d4f' }} />
          <Text strong>{value}</Text>
        </Space>
      ),
    },
    {
      title: '湿度 (%)',
      dataIndex: 'humidity',
      key: 'humidity',
      render: (value: number) => (
        <Space>
          <CloudOutlined style={{ color: '#1890ff' }} />
          <Text strong>{value}</Text>
        </Space>
      ),
    },
    {
      title: '空气质量',
      dataIndex: 'airQuality',
      key: 'airQuality',
      render: (value: number) => {
        const { level, color } = getAirQualityLevel(value);
        return (
          <Space>
            <Tag color={color}>{level}</Tag>
            <Text strong>{value}</Text>
          </Space>
        );
      },
    },
    {
      title: '光照 (lux)',
      dataIndex: 'lightIntensity',
      key: 'lightIntensity',
      render: (value: number) => (
        <Space>
          <SunOutlined style={{ color: '#faad14' }} />
          <Text strong>{value}</Text>
        </Space>
      ),
    },
    {
      title: '噪音 (dB)',
      dataIndex: 'noiseLevel',
      key: 'noiseLevel',
      render: (value: number) => (
        <Space>
          <ThunderboltOutlined style={{ color: '#52c41a' }} />
          <Text strong>{value}</Text>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge
          status={getStatusColor(status) as any}
          text={getStatusText(status)}
        />
      ),
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: EnvironmentData) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<SettingOutlined />}
            onClick={() => handleSettings(record)}
          >
            设置
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewDetails = (record: EnvironmentData) => {
    Modal.info({
      title: `${record.location}环境详情`,
      width: 600,
      content: (
        <div>
          <Row gutter={16}>
            <Col span={12}>
              <Card size="small" title="温度监测">
                <Statistic
                  title="当前温度"
                  value={record.temperature}
                  suffix="°C"
                  valueStyle={{ color: '#ff4d4f' }}
                />
                <Progress
                  percent={Math.min((record.temperature / 30) * 100, 100)}
                  strokeColor="#ff4d4f"
                  showInfo={false}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card size="small" title="湿度监测">
                <Statistic
                  title="当前湿度"
                  value={record.humidity}
                  suffix="%"
                  valueStyle={{ color: '#1890ff' }}
                />
                <Progress
                  percent={record.humidity}
                  strokeColor="#1890ff"
                  showInfo={false}
                />
              </Card>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Card size="small" title="空气质量">
                <Statistic
                  title="AQI指数"
                  value={record.airQuality}
                  valueStyle={{ color: '#52c41a' }}
                />
                <Tag color={getAirQualityLevel(record.airQuality).color}>
                  {getAirQualityLevel(record.airQuality).level}
                </Tag>
              </Card>
            </Col>
            <Col span={12}>
              <Card size="small" title="光照强度">
                <Statistic
                  title="当前光照"
                  value={record.lightIntensity}
                  suffix="lux"
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
          </Row>
        </div>
      ),
    });
  };

  const handleSettings = (record: EnvironmentData) => {
    setSettingsModalVisible(true);
  };

  const handleAlertSettings = () => {
    setAlertModalVisible(true);
  };

  const handleDataAnalysis = () => {
    setChartModalVisible(true);
  };

  const handleExport = () => {
    Modal.success({
      title: '导出成功',
      content: '环境监测数据已成功导出到Excel文件',
    });
  };

  const handleBatchOperation = () => {
    if (selectedRows.length === 0) {
      Modal.warning({
        title: '提示',
        content: '请先选择要操作的监测点',
      });
      return;
    }
    Modal.info({
      title: '批量操作',
      content: `已选择 ${selectedRows.length} 个监测点进行批量操作`,
    });
  };

  const rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRows(selectedRowKeys as string[]);
    },
  };

  // 修改数据分析模态框内容
  const renderAnalysisContent = () => {
    const data = generateAnalysisData(analysisTab, analysisTimeRange);
    
    return (
      <div>
        <Space style={{ marginBottom: 16 }}>
          <Select 
            value={analysisTimeRange} 
            onChange={setAnalysisTimeRange}
            style={{ width: 120 }}
          >
            <Select.Option value="day">24小时</Select.Option>
            <Select.Option value="week">7天</Select.Option>
            <Select.Option value="month">30天</Select.Option>
          </Select>
        </Space>
        
        <Tabs
          activeKey={analysisTab}
          onChange={setAnalysisTab}
          items={[
            {
              key: 'temperature',
              label: '温度分析',
              children: (
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <ReactECharts 
                      option={getChartOption('temperature', data)}
                      style={{ height: '300px' }}
                    />
                  </Col>
                  <Col span={24}>
                    <ReactECharts 
                      option={getComparisonChartOption('temperature')}
                      style={{ height: '300px' }}
                    />
                  </Col>
                </Row>
              )
            },
            {
              key: 'humidity',
              label: '湿度分析',
              children: (
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <ReactECharts 
                      option={getChartOption('humidity', data)}
                      style={{ height: '300px' }}
                    />
                  </Col>
                  <Col span={24}>
                    <ReactECharts 
                      option={getComparisonChartOption('humidity')}
                      style={{ height: '300px' }}
                    />
                  </Col>
                </Row>
              )
            },
            {
              key: 'airQuality',
              label: '空气质量分析',
              children: (
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <ReactECharts 
                      option={getChartOption('airQuality', data)}
                      style={{ height: '300px' }}
                    />
                  </Col>
                  <Col span={24}>
                    <ReactECharts 
                      option={getComparisonChartOption('airQuality')}
                      style={{ height: '300px' }}
                    />
                  </Col>
                </Row>
              )
            },
            {
              key: 'noiseLevel',
              label: '噪音分析',
              children: (
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <ReactECharts 
                      option={getChartOption('noiseLevel', data)}
                      style={{ height: '300px' }}
                    />
                  </Col>
                  <Col span={24}>
                    <ReactECharts 
                      option={getComparisonChartOption('noiseLevel')}
                      style={{ height: '300px' }}
                    />
                  </Col>
                </Row>
              )
            }
          ]}
        />
      </div>
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <EnvironmentOutlined style={{ marginRight: 8 }} />
          环境监测
        </Title>
        <Space>
          <Text type="secondary">
            实时监测酒店各区域的环境参数，确保舒适的住宿环境
          </Text>
          <Divider type="vertical" />
          <Text type="secondary">
            最后更新: {lastUpdateTime}
          </Text>
        </Space>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="监测点总数"
              value={data.length}
              prefix={<EnvironmentOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="正常状态"
              value={data.filter(item => item.status === 'normal').length}
              prefix={<Badge status="success" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="警告状态"
              value={data.filter(item => item.status === 'warning').length}
              prefix={<Badge status="warning" />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="危险状态"
              value={data.filter(item => item.status === 'danger').length}
              prefix={<Badge status="error" />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 操作工具栏 */}
      <Card style={{ marginBottom: '24px' }}>
        <Space wrap>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={loadData}
            loading={loading}
          >
            刷新数据
          </Button>
          <Button
            icon={<AlertOutlined />}
            onClick={handleAlertSettings}
          >
            告警设置
          </Button>
          <Button
            icon={<LineChartOutlined />}
            onClick={handleDataAnalysis}
          >
            数据分析
          </Button>
          <Button
            icon={<ExportOutlined />}
            onClick={handleExport}
          >
            导出数据
          </Button>
          {selectedRows.length > 0 && (
            <Button
              type="default"
              onClick={handleBatchOperation}
            >
              批量操作 ({selectedRows.length})
            </Button>
          )}
        </Space>
      </Card>

      {/* 数据表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          rowSelection={rowSelection}
          pagination={{
            total: data.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
        />
      </Card>

      {/* 告警设置模态框 */}
      <Modal
        title="告警设置"
        open={alertModalVisible}
        onCancel={() => setAlertModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setAlertModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary">
            保存设置
          </Button>,
        ]}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="温度告警范围">
                <Input.Group compact>
                  <Input placeholder="最小值" style={{ width: '50%' }} />
                  <Input placeholder="最大值" style={{ width: '50%' }} />
                </Input.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="湿度告警范围">
                <Input.Group compact>
                  <Input placeholder="最小值" style={{ width: '50%' }} />
                  <Input placeholder="最大值" style={{ width: '50%' }} />
                </Input.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="空气质量告警阈值">
                <Input placeholder="低于此值告警" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="噪音告警阈值">
                <Input placeholder="高于此值告警" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="告警通知方式">
            <Select mode="multiple" placeholder="选择通知方式">
              <Select.Option value="email">邮件</Select.Option>
              <Select.Option value="sms">短信</Select.Option>
              <Select.Option value="app">APP推送</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 数据分析模态框 */}
      <Modal
        title="环境数据分析"
        open={chartModalVisible}
        onCancel={() => setChartModalVisible(false)}
        footer={null}
        width={1000}
        style={{ top: 20 }}
      >
        {renderAnalysisContent()}
      </Modal>

      {/* 设置模态框 */}
      <Modal
        title="监测点设置"
        open={settingsModalVisible}
        onCancel={() => setSettingsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setSettingsModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary">
            保存设置
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="监测频率">
            <Select defaultValue="5min">
              <Select.Option value="1min">1分钟</Select.Option>
              <Select.Option value="5min">5分钟</Select.Option>
              <Select.Option value="10min">10分钟</Select.Option>
              <Select.Option value="30min">30分钟</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="数据保留时间">
            <Select defaultValue="30days">
              <Select.Option value="7days">7天</Select.Option>
              <Select.Option value="30days">30天</Select.Option>
              <Select.Option value="90days">90天</Select.Option>
              <Select.Option value="1year">1年</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EnvironmentMonitor; 