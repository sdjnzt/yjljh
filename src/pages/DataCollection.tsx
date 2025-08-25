import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Table,
  Tag,
  Button,
  Progress,
  Alert,
  Statistic,
  Space,
  Typography,
  Tabs,
  Timeline,
  Badge,
  Tooltip,
  Switch,
  message,
  Form,
  Input,
  Select,
  Modal,
  List,
  Avatar,
  Descriptions,
  Divider,
  Rate,
  Empty,
  Spin,
  notification
} from 'antd';
import {
  DatabaseOutlined,
  ApiOutlined,
  SettingOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  ExperimentOutlined,
  DropboxOutlined,
  WifiOutlined,
  CameraOutlined,
  EnvironmentOutlined,
  FireOutlined,
  SafetyOutlined,
  BulbOutlined,
  SoundOutlined,
  RadarChartOutlined,
  GlobalOutlined,
  CloudOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface Sensor {
  id: string;
  name: string;
  type: 'temperature' | 'humidity' | 'pressure' | 'voltage' | 'current' | 'motion' | 'light' | 'noise' | 'air_quality' | 'water_level' | 'gas' | 'vibration';
  location: string;
  status: 'online' | 'offline' | 'warning' | 'error' | 'maintenance';
  lastUpdate: string;
  value: number;
  unit: string;
  threshold: {
    min: number;
    max: number;
  };
  dataQuality: number;
  samplingRate: number;
  battery?: number;
  signal?: number;
  accuracy?: number;
  manufacturer?: string;
  model?: string;
  installDate?: string;
  lastCalibration?: string;
  nextCalibration?: string;
}

interface DataRecord {
  id: string;
  sensorId: string;
  sensorName: string;
  sensorType: string;
  value: number;
  unit: string;
  timestamp: string;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  location: string;
  anomaly?: boolean;
  trend?: 'up' | 'down' | 'stable';
}

interface DataStream {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'error';
  dataRate: number;
  totalRecords: number;
  lastActivity: string;
  bandwidth: number;
}

// 生成随机传感器数据
const generateSensors = (): Sensor[] => {
  const sensorTypes = [
    { type: 'temperature', unit: '°C', min: 15, max: 30, icon: <ExperimentOutlined />, color: '#FF4D4F' },
    { type: 'humidity', unit: '%', min: 30, max: 70, icon: <DropboxOutlined />, color: '#1890FF' },
    { type: 'pressure', unit: 'Pa', min: 0, max: 1000, icon: <SettingOutlined />, color: '#FAAD14' },
    { type: 'voltage', unit: 'V', min: 200, max: 250, icon: <ThunderboltOutlined />, color: '#52C41A' },
    { type: 'current', unit: 'A', min: 0, max: 100, icon: <ThunderboltOutlined />, color: '#722ED1' },
    { type: 'motion', unit: 'count', min: 0, max: 1000, icon: <WifiOutlined />, color: '#13C2C2' },
    { type: 'light', unit: 'lux', min: 0, max: 10000, icon: <BulbOutlined />, color: '#FADB14' },
    { type: 'noise', unit: 'dB', min: 30, max: 100, icon: <SoundOutlined />, color: '#EB2F96' },
    { type: 'air_quality', unit: 'ppm', min: 0, max: 1000, icon: <EnvironmentOutlined />, color: '#A0D911' },
    { type: 'water_level', unit: 'm', min: 0, max: 10, icon: <DropboxOutlined />, color: '#1890FF' },
    { type: 'gas', unit: 'ppm', min: 0, max: 100, icon: <FireOutlined />, color: '#FF7A45' },
    { type: 'vibration', unit: 'mm/s', min: 0, max: 50, icon: <RadarChartOutlined />, color: '#9254DE' }
  ];

  const locations = [
    '大门', '客房101', '客房102', '客房103', '客房201', '客房202', '客房203',
    '餐厅', '厨房', '会议室A', '会议室B', '会议室C', '健身房', '游泳池',
    '停车场', '配电室', '空调机房', '锅炉房', '水泵房', '消防控制室',
    '监控中心', '前台', '后台办公室', '仓库', '洗衣房', '垃圾房'
  ];

  const manufacturers = ['霍尼韦尔', '西门子', '施耐德', 'ABB', '欧姆龙', '三菱', '松下', '博世'];

  return Array.from({ length: 48 }, (_, i) => {
    const sensorType = sensorTypes[i % sensorTypes.length];
    const location = locations[i % locations.length];
    const statuses: ('online' | 'offline' | 'warning' | 'error' | 'maintenance')[] = ['online', 'online', 'online', 'warning', 'maintenance'];
    const status = statuses[i % statuses.length];
    
    const baseValue = (sensorType.min + sensorType.max) / 2;
    const variation = (Math.random() - 0.5) * (sensorType.max - sensorType.min) * 0.3;
    const value = Math.round((baseValue + variation) * 100) / 100;

    return {
      id: `${i + 1}`,
      name: `${sensorType.type === 'temperature' ? '温度' : 
             sensorType.type === 'humidity' ? '湿度' : 
             sensorType.type === 'pressure' ? '压力' : 
             sensorType.type === 'voltage' ? '电压' : 
             sensorType.type === 'current' ? '电流' : 
             sensorType.type === 'motion' ? '运动' : 
             sensorType.type === 'light' ? '光照' : 
             sensorType.type === 'noise' ? '噪音' : 
             sensorType.type === 'air_quality' ? '空气质量' : 
             sensorType.type === 'water_level' ? '水位' : 
             sensorType.type === 'gas' ? '气体' : '振动'}传感器-${String(i + 1).padStart(2, '0')}`,
      type: sensorType.type as Sensor['type'],
      location,
      status,
      lastUpdate: new Date().toLocaleString(),
      value,
      unit: sensorType.unit,
      threshold: { min: sensorType.min, max: sensorType.max },
      dataQuality: Math.round((85 + Math.random() * 15) * 100) / 100,
      samplingRate: [500, 1000, 2000, 5000][i % 4],
      battery: status === 'online' ? Math.round((20 + Math.random() * 80) * 100) / 100 : undefined,
      signal: status === 'online' ? Math.round((60 + Math.random() * 40) * 100) / 100 : undefined,
      accuracy: Math.round((95 + Math.random() * 5) * 100) / 100,
      manufacturer: manufacturers[i % manufacturers.length],
      model: `SENS-${sensorType.type.toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
      installDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      lastCalibration: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      nextCalibration: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString()
    } as Sensor;
  });
};

const DataCollection: React.FC = () => {
  const [sensors, setSensors] = useState<Sensor[]>(generateSensors());
  const [dataRecords, setDataRecords] = useState<DataRecord[]>([]);
  const [dataStreams, setDataStreams] = useState<DataStream[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSensor, setEditingSensor] = useState<Sensor | null>(null);
  const [form] = Form.useForm();
  const [autoCollection, setAutoCollection] = useState(true);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // 统计数据
  const totalSensors = sensors.length;
  const onlineSensors = sensors.filter(s => s.status === 'online').length;
  const warningSensors = sensors.filter(s => s.status === 'warning').length;
  const errorSensors = sensors.filter(s => s.status === 'error').length;
  const maintenanceSensors = sensors.filter(s => s.status === 'maintenance').length;
  const offlineSensors = sensors.filter(s => s.status === 'offline').length;
  const avgDataQuality = sensors.reduce((sum, s) => sum + s.dataQuality, 0) / sensors.length;
  // 计算总数据率：每秒采集的数据点数
  const totalDataRate = sensors.reduce((sum, s) => {
    if (s.status === 'online') {
      return sum + (1000 / s.samplingRate); // 每秒采集次数
    }
    return sum;
  }, 0);
  const batteryLowSensors = sensors.filter(s => s.battery && s.battery < 20).length;

  // 实时数据更新模拟
  useEffect(() => {
    if (autoCollection) {
      const interval = setInterval(() => {
        setSensors(prevSensors => 
          prevSensors.map(sensor => {
            if (sensor.status === 'online') {
              const variation = (Math.random() - 0.5) * 2;
              let newValue = sensor.value + variation;
              
              // 根据传感器类型调整数值范围
              const threshold = sensor.threshold;
              newValue = Math.max(threshold.min, Math.min(threshold.max, newValue));

              // 随机状态变化
              let newStatus: Sensor['status'] = sensor.status;
              if (Math.random() < 0.01) { // 1%概率变为警告
                newStatus = 'warning';
              } else if (Math.random() < 0.005) { // 0.5%概率变为错误
                newStatus = 'error';
              }

              return {
                ...sensor,
                value: Math.round(newValue * 100) / 100,
                status: newStatus,
                lastUpdate: new Date().toLocaleString(),
                dataQuality: Math.round(Math.max(80, Math.min(100, sensor.dataQuality + (Math.random() - 0.5) * 2)) * 100) / 100,
                battery: sensor.battery ? Math.round(Math.max(0, sensor.battery - Math.random() * 0.1) * 100) / 100 : undefined,
                signal: sensor.signal ? Math.round(Math.max(30, sensor.signal + (Math.random() - 0.5) * 5) * 100) / 100 : undefined
              };
            }
            return sensor;
          })
        );
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [autoCollection]);

  // 数据质量分布图
  const qualityData = [
    { value: sensors.filter(s => s.dataQuality >= 95).length, name: '优秀 (≥95%)', itemStyle: { color: '#52C41A' } },
    { value: sensors.filter(s => s.dataQuality >= 85 && s.dataQuality < 95).length, name: '良好 (85-95%)', itemStyle: { color: '#1890FF' } },
    { value: sensors.filter(s => s.dataQuality >= 70 && s.dataQuality < 85).length, name: '一般 (70-85%)', itemStyle: { color: '#FAAD14' } },
    { value: sensors.filter(s => s.dataQuality < 70).length, name: '较差 (<70%)', itemStyle: { color: '#FF4D4F' } }
  ];

  const qualityOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}个 ({d}%)'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: qualityData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  // 传感器类型分布
  const typeData = sensors.reduce((acc, sensor) => {
    acc[sensor.type] = (acc[sensor.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeOption = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        radius: '60%',
        data: Object.entries(typeData).map(([type, count]) => ({
          value: count,
          name: type === 'temperature' ? '温度' : 
                type === 'humidity' ? '湿度' : 
                type === 'voltage' ? '电压' : 
                type === 'pressure' ? '压力' : 
                type === 'current' ? '电流' : 
                type === 'motion' ? '运动' : 
                type === 'light' ? '光照' : 
                type === 'noise' ? '噪音' : 
                type === 'air_quality' ? '空气质量' : 
                type === 'water_level' ? '水位' : 
                type === 'gas' ? '气体' : '振动',
          itemStyle: {
            color: type === 'temperature' ? '#FF4D4F' :
                   type === 'humidity' ? '#1890FF' :
                   type === 'voltage' ? '#52C41A' :
                   type === 'pressure' ? '#FAAD14' :
                   type === 'current' ? '#722ED1' : 
                   type === 'motion' ? '#13C2C2' :
                   type === 'light' ? '#FADB14' :
                   type === 'noise' ? '#EB2F96' :
                   type === 'air_quality' ? '#A0D911' :
                   type === 'water_level' ? '#1890FF' :
                   type === 'gas' ? '#FF7A45' : '#9254DE'
          }
        }))
      }
    ]
  };

  // 实时数据趋势图
  const trendOption = {
    title: {
      text: '实时数据趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['温度', '湿度', '电压', '压力'],
      top: 30
    },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 20 }, (_, i) => `${i * 3}s`)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '温度',
        type: 'line',
        data: Array.from({ length: 20 }, () => Math.round((20 + Math.random() * 10) * 10) / 10),
        smooth: true,
        itemStyle: { color: '#FF4D4F' }
      },
      {
        name: '湿度',
        type: 'line',
        data: Array.from({ length: 20 }, () => Math.round((40 + Math.random() * 20) * 10) / 10),
        smooth: true,
        itemStyle: { color: '#1890FF' }
      },
      {
        name: '电压',
        type: 'line',
        data: Array.from({ length: 20 }, () => Math.round((220 + Math.random() * 20) * 10) / 10),
        smooth: true,
        itemStyle: { color: '#52C41A' }
      },
      {
        name: '压力',
        type: 'line',
        data: Array.from({ length: 20 }, () => Math.round((400 + Math.random() * 200) * 10) / 10),
        smooth: true,
        itemStyle: { color: '#FAAD14' }
      }
    ]
  };

  const handleAddSensor = () => {
    setEditingSensor(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditSensor = (sensor: Sensor) => {
    setEditingSensor(sensor);
    form.setFieldsValue(sensor);
    setIsModalVisible(true);
  };

  const handleDeleteSensor = (id: string) => {
    setSensors(sensors.filter(s => s.id !== id));
    message.success('删除成功');
  };

  const handleViewDetails = (sensor: Sensor) => {
    setSelectedSensor(sensor);
    setIsDetailModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingSensor) {
        setSensors(sensors.map(s => s.id === editingSensor.id ? { ...s, ...values } : s));
        message.success('更新成功');
      } else {
        const newSensor: Sensor = {
          id: Date.now().toString(),
          ...values,
          status: 'online',
          lastUpdate: new Date().toLocaleString(),
          value: 0,
          dataQuality: 100,
          samplingRate: 1000
        };
        setSensors([...sensors, newSensor]);
        message.success('添加成功');
      }
      setIsModalVisible(false);
    });
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setSensors(generateSensors());
      setLoading(false);
      message.success('数据已刷新');
    }, 1000);
  };

  const sensorColumns = [
    {
      title: '传感器名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name: string, record: Sensor) => (
        <div>
          <Text strong>{name}</Text>
          <div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.manufacturer} {record.model}
            </Text>
          </div>
        </div>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => {
        const typeMap = {
          temperature: { color: '#FF4D4F', text: '温度', icon: <ExperimentOutlined /> },
          humidity: { color: '#1890FF', text: '湿度', icon: <DropboxOutlined /> },
          voltage: { color: '#52C41A', text: '电压', icon: <ThunderboltOutlined /> },
          pressure: { color: '#FAAD14', text: '压力', icon: <SettingOutlined /> },
          current: { color: '#722ED1', text: '电流', icon: <ThunderboltOutlined /> },
          motion: { color: '#13C2C2', text: '运动', icon: <WifiOutlined /> },
          light: { color: '#FADB14', text: '光照', icon: <BulbOutlined /> },
          noise: { color: '#EB2F96', text: '噪音', icon: <SoundOutlined /> },
          air_quality: { color: '#A0D911', text: '空气质量', icon: <EnvironmentOutlined /> },
          water_level: { color: '#1890FF', text: '水位', icon: <DropboxOutlined /> },
          gas: { color: '#FF7A45', text: '气体', icon: <FireOutlined /> },
          vibration: { color: '#9254DE', text: '振动', icon: <RadarChartOutlined /> }
        };
        return (
          <Tag color={typeMap[type as keyof typeof typeMap]?.color} icon={typeMap[type as keyof typeof typeMap]?.icon}>
            {typeMap[type as keyof typeof typeMap]?.text}
          </Tag>
        );
      }
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 120
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap = {
          online: { color: '#52C41A', text: '在线', icon: <CheckCircleOutlined /> },
          offline: { color: '#FF4D4F', text: '离线', icon: <ClockCircleOutlined /> },
          warning: { color: '#FAAD14', text: '警告', icon: <WarningOutlined /> },
          error: { color: '#FF4D4F', text: '错误', icon: <ExclamationCircleOutlined /> },
          maintenance: { color: '#1890FF', text: '维护', icon: <SettingOutlined /> }
        };
        return (
          <Tag color={statusMap[status as keyof typeof statusMap]?.color} icon={statusMap[status as keyof typeof statusMap]?.icon}>
            {statusMap[status as keyof typeof statusMap]?.text}
          </Tag>
        );
      }
    },
    {
      title: '当前值',
      key: 'value',
      width: 150,
      render: (_: any, record: Sensor) => (
        <div>
          <Text strong style={{ fontSize: '16px', color: record.status === 'warning' ? '#FAAD14' : record.status === 'error' ? '#FF4D4F' : '#000' }}>
            {record.value} {record.unit}
          </Text>
          <div style={{ marginTop: '4px' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              阈值: {record.threshold.min} - {record.threshold.max} {record.unit}
            </Text>
          </div>
        </div>
      )
    },
    {
      title: '数据质量',
      dataIndex: 'dataQuality',
      key: 'dataQuality',
      width: 120,
      render: (quality: number) => (
        <div>
          <Progress 
            percent={quality} 
            size="small" 
            status={quality < 70 ? 'exception' : quality < 85 ? 'active' : 'success'}
          />
          <Text style={{ fontSize: '12px' }}>{quality}%</Text>
        </div>
      )
    },
    {
      title: '电池/信号',
      key: 'battery',
      width: 120,
      render: (_: any, record: Sensor) => (
        <div>
          {record.battery && (
            <div style={{ marginBottom: '4px' }}>
              <Text style={{ fontSize: '12px' }}>电池: {record.battery}%</Text>
              <Progress percent={record.battery} size="small" status={record.battery < 20 ? 'exception' : 'success'} />
            </div>
          )}
          {record.signal && (
            <div>
              <Text style={{ fontSize: '12px' }}>信号: {record.signal}%</Text>
              <Progress percent={record.signal} size="small" status={record.signal < 50 ? 'exception' : 'success'} />
            </div>
          )}
        </div>
      )
    },
    {
      title: '采样率',
      dataIndex: 'samplingRate',
      key: 'samplingRate',
      width: 100,
      render: (rate: number) => `${rate} ms`
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
      width: 150
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: Sensor) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetails(record)}>
            详情
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditSensor(record)}>
            编辑
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDeleteSensor(record.id)}>
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ background: 'white', padding: '24px', borderRadius: '8px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Title level={2} style={{ marginBottom: '8px', color: '#1890ff' }}>
          <DatabaseOutlined /> 数据采集与监控平台
        </Title>
        <Paragraph type="secondary" style={{ fontSize: '14px', marginBottom: '0' }}>
          从各类传感器、摄像头等设备自动采集温度、湿度、设备运行状态等非电量或电量信号数据，为数字化管理提供数据基础
        </Paragraph>
      </div>
      
      <Alert
        message="系统状态"
        description={`数据采集系统运行正常，当前在线传感器${onlineSensors}个，警告${warningSensors}个，错误${errorSensors}个，数据质量良好，自动采集已启用`}
        type="success"
        showIcon
        style={{ marginBottom: 24, borderRadius: '8px' }}
        action={
          <Space>
            <Button size="small" type="primary" icon={<SyncOutlined spin={loading} />} onClick={handleRefresh}>
              刷新数据
            </Button>
            <Button size="small" icon={<SettingOutlined />}>
              系统设置
            </Button>
          </Space>
        }
      />

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6} lg={4} xl={3}>
          <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Statistic title="总传感器" value={totalSensors} prefix={<DatabaseOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4} xl={3}>
          <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Statistic title="在线传感器" value={onlineSensors} valueStyle={{ color: '#52C41A' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4} xl={3}>
          <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Statistic title="警告传感器" value={warningSensors} valueStyle={{ color: '#FAAD14' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4} xl={3}>
          <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Statistic title="错误传感器" value={errorSensors} valueStyle={{ color: '#FF4D4F' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4} xl={3}>
          <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Statistic title="平均数据质量" value={avgDataQuality.toFixed(1)} suffix="%" valueStyle={{ color: '#1890FF' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4} xl={3}>
          <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Statistic 
              title="总数据率" 
              value={Math.round(totalDataRate)} 
              suffix="点/秒" 
              valueStyle={{ color: '#722ED1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4} xl={3}>
          <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Statistic title="电池低电量" value={batteryLowSensors} valueStyle={{ color: '#FF7A45' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4} xl={3}>
          <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Statistic title="维护中" value={maintenanceSensors} valueStyle={{ color: '#1890FF' }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={16}>
          <Card
            title={
              <Space>
                <GlobalOutlined />
                传感器状态监控
              </Space>
            }
            extra={
              <Space>
                <Switch
                  checked={autoCollection}
                  onChange={setAutoCollection}
                  checkedChildren={<PlayCircleOutlined />}
                  unCheckedChildren={<PauseCircleOutlined />}
                />
                <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
                  刷新
                </Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddSensor}>
                  添加传感器
                </Button>
              </Space>
            }
            bodyStyle={{ padding: 0 }}
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            <Table
              columns={sensorColumns}
              dataSource={sensors}
              rowKey="id"
              pagination={{ 
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
              }}
              scroll={{ x: 1400 }}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card 
            title="实时数据流" 
            size="small" 
            style={{ marginBottom: 16, borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            <Timeline>
              {sensors.slice(0, 8).map(sensor => (
                <Timeline.Item
                  key={sensor.id}
                  color={sensor.status === 'online' ? 'green' : sensor.status === 'warning' ? 'orange' : 'red'}
                >
                  <div>
                    <Text strong style={{ fontSize: '12px' }}>{sensor.name}</Text>
                    <div>
                      <Text type="secondary" style={{ fontSize: '11px' }}>
                        {sensor.value} {sensor.unit} • {sensor.location}
                      </Text>
                      <Badge
                        status={sensor.status === 'online' ? 'success' : sensor.status === 'warning' ? 'warning' : 'error'}
                        text={sensor.status === 'online' ? '正常' : sensor.status === 'warning' ? '警告' : '异常'}
                        style={{ marginLeft: '8px', fontSize: '11px' }}
                      />
                    </div>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>

          <Card 
            title="数据质量分布" 
            size="small" 
            style={{ marginBottom: 16, borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            <ReactECharts option={qualityOption} style={{ height: 200 }} />
          </Card>

          <Card 
            title="传感器类型分布" 
            size="small"
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            <ReactECharts option={typeOption} style={{ height: 200 }} />
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="1" style={{ marginTop: 24 }}>
        <TabPane tab="实时数据趋势" key="1">
          <Card 
            title="数据趋势监控"
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            <ReactECharts option={trendOption} style={{ height: 400 }} />
          </Card>
        </TabPane>

        <TabPane tab="数据质量分析" key="2">
          <Row gutter={16}>
            <Col span={12}>
              <Card 
                title="数据质量分布"
                style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              >
                <ReactECharts option={qualityOption} style={{ height: 300 }} />
              </Card>
            </Col>
            <Col span={12}>
              <Card 
                title="传感器类型分布"
                style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              >
                <ReactECharts option={typeOption} style={{ height: 300 }} />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="采集历史" key="3">
          <Card 
            title="历史数据记录"
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            {dataRecords.length > 0 ? (
              <Table
                columns={[
                  { title: '传感器', dataIndex: 'sensorName', key: 'sensorName' },
                  { title: '类型', dataIndex: 'sensorType', key: 'sensorType' },
                  { title: '数值', dataIndex: 'value', key: 'value' },
                  { title: '单位', dataIndex: 'unit', key: 'unit' },
                  { title: '时间', dataIndex: 'timestamp', key: 'timestamp' },
                  { title: '质量', dataIndex: 'quality', key: 'quality' },
                  { title: '位置', dataIndex: 'location', key: 'location' }
                ]}
                dataSource={dataRecords}
                rowKey="id"
                pagination={{ pageSize: 20 }}
              />
            ) : (
              <Empty description="暂无历史数据" />
            )}
          </Card>
        </TabPane>

        <TabPane tab="系统设置" key="4">
          <Card 
            title="采集系统配置"
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="默认采集频率" name="defaultRate">
                    <Select defaultValue="1000">
                      <Option value="500">500ms</Option>
                      <Option value="1000">1s</Option>
                      <Option value="2000">2s</Option>
                      <Option value="5000">5s</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="数据保留时间" name="retentionTime">
                    <Select defaultValue="30">
                      <Option value="7">7天</Option>
                      <Option value="30">30天</Option>
                      <Option value="90">90天</Option>
                      <Option value="365">1年</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="自动备份" name="autoBackup">
                    <Switch defaultChecked />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="数据加密" name="dataEncryption">
                    <Switch defaultChecked />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                <Button type="primary">保存配置</Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
      </Tabs>

      {/* 添加/编辑传感器模态框 */}
      <Modal
        title={editingSensor ? '编辑传感器' : '添加传感器'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="传感器名称" name="name" rules={[{ required: true, message: '请输入传感器名称' }]}>
                <Input placeholder="请输入传感器名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="类型" name="type" rules={[{ required: true, message: '请选择类型' }]}>
                <Select placeholder="请选择类型">
                  <Option value="temperature">温度</Option>
                  <Option value="humidity">湿度</Option>
                  <Option value="voltage">电压</Option>
                  <Option value="pressure">压力</Option>
                  <Option value="current">电流</Option>
                  <Option value="motion">运动</Option>
                  <Option value="light">光照</Option>
                  <Option value="noise">噪音</Option>
                  <Option value="air_quality">空气质量</Option>
                  <Option value="water_level">水位</Option>
                  <Option value="gas">气体</Option>
                  <Option value="vibration">振动</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="位置" name="location" rules={[{ required: true, message: '请输入位置' }]}>
                <Input placeholder="请输入位置" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="单位" name="unit">
                <Input placeholder="请输入单位" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="最小值" name={['threshold', 'min']}>
                <Input type="number" placeholder="最小值" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="最大值" name={['threshold', 'max']}>
                <Input type="number" placeholder="最大值" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="采样率 (ms)" name="samplingRate">
            <Input type="number" placeholder="1000" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 传感器详情模态框 */}
      <Modal
        title="传感器详细信息"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedSensor && (
          <div>
            <Descriptions title="基本信息" bordered column={2}>
              <Descriptions.Item label="传感器名称">{selectedSensor.name}</Descriptions.Item>
              <Descriptions.Item label="传感器类型">{selectedSensor.type}</Descriptions.Item>
              <Descriptions.Item label="安装位置">{selectedSensor.location}</Descriptions.Item>
              <Descriptions.Item label="当前状态">
                <Tag color={selectedSensor.status === 'online' ? 'green' : selectedSensor.status === 'warning' ? 'orange' : 'red'}>
                  {selectedSensor.status === 'online' ? '在线' : selectedSensor.status === 'warning' ? '警告' : '离线'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="当前值">{selectedSensor.value} {selectedSensor.unit}</Descriptions.Item>
              <Descriptions.Item label="数据质量">{selectedSensor.dataQuality}%</Descriptions.Item>
              <Descriptions.Item label="采样率">{selectedSensor.samplingRate} ms</Descriptions.Item>
              <Descriptions.Item label="最后更新">{selectedSensor.lastUpdate}</Descriptions.Item>
            </Descriptions>
            
            <Divider />
            
            <Descriptions title="设备信息" bordered column={2}>
              <Descriptions.Item label="制造商">{selectedSensor.manufacturer}</Descriptions.Item>
              <Descriptions.Item label="型号">{selectedSensor.model}</Descriptions.Item>
              <Descriptions.Item label="安装日期">{selectedSensor.installDate}</Descriptions.Item>
              <Descriptions.Item label="精度">{selectedSensor.accuracy}%</Descriptions.Item>
              <Descriptions.Item label="上次校准">{selectedSensor.lastCalibration}</Descriptions.Item>
              <Descriptions.Item label="下次校准">{selectedSensor.nextCalibration}</Descriptions.Item>
            </Descriptions>
            
            <Divider />
            
            <Descriptions title="阈值设置" bordered column={2}>
              <Descriptions.Item label="最小值">{selectedSensor.threshold.min} {selectedSensor.unit}</Descriptions.Item>
              <Descriptions.Item label="最大值">{selectedSensor.threshold.max} {selectedSensor.unit}</Descriptions.Item>
            </Descriptions>
            
            {selectedSensor.battery && (
              <>
                <Divider />
                <Descriptions title="设备状态" bordered column={2}>
                  <Descriptions.Item label="电池电量">
                    <Progress percent={selectedSensor.battery} status={selectedSensor.battery < 20 ? 'exception' : 'success'} />
                  </Descriptions.Item>
                  {selectedSensor.signal && (
                    <Descriptions.Item label="信号强度">
                      <Progress percent={selectedSensor.signal} status={selectedSensor.signal < 50 ? 'exception' : 'success'} />
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DataCollection; 