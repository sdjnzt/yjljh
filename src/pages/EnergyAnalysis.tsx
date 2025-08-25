import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Progress,
  Typography,
  Divider,
  Tooltip,
  Badge,
  Alert,
  Descriptions,
  List,
  Avatar,
  Tabs,
  Switch,
  message,
} from 'antd';
import {
  ThunderboltOutlined,
  DropboxOutlined,
  FireOutlined,
  BarChartOutlined,
  EyeOutlined,
  SettingOutlined,
  ReloadOutlined,
  ExportOutlined,
  LineChartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  CalendarOutlined,
  FileTextOutlined,
  CloudOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

interface EnergyConsumption {
  id: string;
  type: 'electricity' | 'water' | 'gas' | 'heating' | 'cooling';
  location: string;
  currentUsage: number;
  lastMonthUsage: number;
  changeRate: number;
  cost: number;
  unit: string;
  status: 'normal' | 'high' | 'warning' | 'critical';
  efficiency: number;
  lastUpdate: string;
}

interface EnergyDevice {
  id: string;
  name: string;
  type: 'lighting' | 'hvac' | 'kitchen' | 'laundry' | 'other';
  location: string;
  power: number;
  currentStatus: 'on' | 'off' | 'standby';
  dailyUsage: number;
  monthlyUsage: number;
  efficiency: number;
  lastMaintenance: string;
  nextMaintenance: string;
}

interface EnergyAlert {
  id: string;
  type: 'high_consumption' | 'device_fault' | 'efficiency_low' | 'cost_overrun';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  description: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

// 生成更真实的能耗数据
function generateConsumptionData(): EnergyConsumption[] {
  const locations = [
    { name: '主楼', weight: 1 },
    { name: '客房区', weight: 0.8 },
    { name: '餐饮区', weight: 0.6 },
    { name: '公共区域', weight: 0.4 },
    { name: '后勤区', weight: 0.3 }
  ];

  const consumptionData: EnergyConsumption[] = [];
  let id = 1;

  // 电力消耗
  locations.forEach(loc => {
    const baseUsage = 1200 * loc.weight;
    const currentUsage = Math.round(baseUsage * (0.9 + Math.random() * 0.2));
    const lastMonthUsage = Math.round(baseUsage * (0.85 + Math.random() * 0.2));
    const changeRate = Number(((currentUsage - lastMonthUsage) / lastMonthUsage * 100).toFixed(1));
    
    consumptionData.push({
      id: id.toString(),
      type: 'electricity',
      location: loc.name,
      currentUsage,
      lastMonthUsage,
      changeRate,
      cost: Math.round(currentUsage * 0.8), // 0.8元/kWh
      unit: 'kWh',
      status: changeRate > 10 ? 'high' : changeRate > 5 ? 'warning' : 'normal',
      efficiency: Math.round(85 + Math.random() * 10),
      lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss')
    });
    id++;
  });

  // 用水消耗
  locations.forEach(loc => {
    const baseUsage = 150 * loc.weight;
    const currentUsage = Math.round(baseUsage * (0.9 + Math.random() * 0.2));
    const lastMonthUsage = Math.round(baseUsage * (0.85 + Math.random() * 0.2));
    const changeRate = Number(((currentUsage - lastMonthUsage) / lastMonthUsage * 100).toFixed(1));
    
    consumptionData.push({
      id: id.toString(),
      type: 'water',
      location: loc.name,
      currentUsage,
      lastMonthUsage,
      changeRate,
      cost: Math.round(currentUsage * 2.5), // 2.5元/m³
      unit: 'm³',
      status: changeRate > 10 ? 'high' : changeRate > 5 ? 'warning' : 'normal',
      efficiency: Math.round(88 + Math.random() * 8),
      lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss')
    });
    id++;
  });

  // 燃气消耗（主要在餐饮区和后勤区）
  ['餐饮区', '后勤区'].forEach(loc => {
    const baseUsage = 80;
    const currentUsage = Math.round(baseUsage * (0.9 + Math.random() * 0.2));
    const lastMonthUsage = Math.round(baseUsage * (0.85 + Math.random() * 0.2));
    const changeRate = Number(((currentUsage - lastMonthUsage) / lastMonthUsage * 100).toFixed(1));
    
    consumptionData.push({
      id: id.toString(),
      type: 'gas',
      location: loc,
      currentUsage,
      lastMonthUsage,
      changeRate,
      cost: Math.round(currentUsage * 5), // 5元/m³
      unit: 'm³',
      status: changeRate > 10 ? 'high' : changeRate > 5 ? 'warning' : 'normal',
      efficiency: Math.round(82 + Math.random() * 8),
      lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss')
    });
    id++;
  });

  // 供暖和制冷（主要在客房区和公共区域）
  ['heating', 'cooling'].forEach(type => {
    ['客房区', '公共区域'].forEach(loc => {
      const baseUsage = 300;
      const currentUsage = Math.round(baseUsage * (0.9 + Math.random() * 0.2));
      const lastMonthUsage = Math.round(baseUsage * (0.85 + Math.random() * 0.2));
      const changeRate = Number(((currentUsage - lastMonthUsage) / lastMonthUsage * 100).toFixed(1));
      
      consumptionData.push({
        id: id.toString(),
        type: type as 'heating' | 'cooling',
        location: loc,
        currentUsage,
        lastMonthUsage,
        changeRate,
        cost: Math.round(currentUsage * 1.2), // 1.2元/kWh
        unit: 'kWh',
        status: changeRate > 10 ? 'high' : changeRate > 5 ? 'warning' : 'normal',
        efficiency: Math.round(85 + Math.random() * 10),
        lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss')
      });
      id++;
    });
  });

  return consumptionData;
}

// 生成更真实的设备数据
function generateDeviceData(): EnergyDevice[] {
  const devices: EnergyDevice[] = [];
  let id = 1;

  // HVAC设备
  const hvacLocations = ['主楼', '客房区', '餐饮区', '公共区域'];
  hvacLocations.forEach((loc, index) => {
    const power = 15 + Math.random() * 5;
    const dailyUsage = Math.round(power * (12 + Math.random() * 4));
    devices.push({
      id: id.toString(),
      name: `中央空调-${(index + 1).toString().padStart(2, '0')}`,
      type: 'hvac',
      location: loc,
      power: Number(power.toFixed(1)),
      currentStatus: Math.random() > 0.1 ? 'on' : Math.random() > 0.5 ? 'standby' : 'off',
      dailyUsage,
      monthlyUsage: dailyUsage * 30,
      efficiency: Math.round(85 + Math.random() * 10),
      lastMaintenance: dayjs().subtract(Math.floor(Math.random() * 30), 'days').format('YYYY-MM-DD'),
      nextMaintenance: dayjs().add(Math.floor(Math.random() * 30 + 30), 'days').format('YYYY-MM-DD')
    });
    id++;
  });

  // 照明系统
  const lightingLocations = ['客房走廊', '大门', '餐厅', '会议室', '停车场'];
  lightingLocations.forEach((loc, index) => {
    const power = 5 + Math.random() * 3;
    const dailyUsage = Math.round(power * (14 + Math.random() * 4));
    devices.push({
      id: id.toString(),
      name: `照明系统-${(index + 1).toString().padStart(2, '0')}`,
      type: 'lighting',
      location: loc,
      power: Number(power.toFixed(1)),
      currentStatus: Math.random() > 0.1 ? 'on' : 'off',
      dailyUsage,
      monthlyUsage: dailyUsage * 30,
      efficiency: Math.round(90 + Math.random() * 8),
      lastMaintenance: dayjs().subtract(Math.floor(Math.random() * 30), 'days').format('YYYY-MM-DD'),
      nextMaintenance: dayjs().add(Math.floor(Math.random() * 30 + 30), 'days').format('YYYY-MM-DD')
    });
    id++;
  });

  // 厨房设备
  const kitchenEquipment = ['主厨房', '中餐厅', '西餐厅', '员工餐厅'];
  kitchenEquipment.forEach((loc, index) => {
    const power = 10 + Math.random() * 5;
    const dailyUsage = Math.round(power * (8 + Math.random() * 4));
    devices.push({
      id: id.toString(),
      name: `厨房设备-${(index + 1).toString().padStart(2, '0')}`,
      type: 'kitchen',
      location: loc,
      power: Number(power.toFixed(1)),
      currentStatus: Math.random() > 0.2 ? 'on' : Math.random() > 0.5 ? 'standby' : 'off',
      dailyUsage,
      monthlyUsage: dailyUsage * 30,
      efficiency: Math.round(80 + Math.random() * 15),
      lastMaintenance: dayjs().subtract(Math.floor(Math.random() * 30), 'days').format('YYYY-MM-DD'),
      nextMaintenance: dayjs().add(Math.floor(Math.random() * 30 + 30), 'days').format('YYYY-MM-DD')
    });
    id++;
  });

  // 洗衣设备
  const laundryEquipment = ['洗衣房'];
  laundryEquipment.forEach((loc, index) => {
    const power = 8 + Math.random() * 4;
    const dailyUsage = Math.round(power * (6 + Math.random() * 4));
    devices.push({
      id: id.toString(),
      name: `洗衣设备-${(index + 1).toString().padStart(2, '0')}`,
      type: 'laundry',
      location: loc,
      power: Number(power.toFixed(1)),
      currentStatus: Math.random() > 0.3 ? 'on' : Math.random() > 0.5 ? 'standby' : 'off',
      dailyUsage,
      monthlyUsage: dailyUsage * 30,
      efficiency: Math.round(85 + Math.random() * 10),
      lastMaintenance: dayjs().subtract(Math.floor(Math.random() * 30), 'days').format('YYYY-MM-DD'),
      nextMaintenance: dayjs().add(Math.floor(Math.random() * 30 + 30), 'days').format('YYYY-MM-DD')
    });
    id++;
  });

  // 其他设备（电梯、水泵等）
  const otherEquipment = [
    { name: '客用电梯', loc: '主楼' },
    { name: '货梯', loc: '后勤区' },
    { name: '水泵系统', loc: '设备房' },
    { name: '热水系统', loc: '锅炉房' }
  ];
  otherEquipment.forEach((equip, index) => {
    const power = 6 + Math.random() * 4;
    const dailyUsage = Math.round(power * (10 + Math.random() * 4));
    devices.push({
      id: id.toString(),
      name: equip.name,
      type: 'other',
      location: equip.loc,
      power: Number(power.toFixed(1)),
      currentStatus: Math.random() > 0.1 ? 'on' : Math.random() > 0.5 ? 'standby' : 'off',
      dailyUsage,
      monthlyUsage: dailyUsage * 30,
      efficiency: Math.round(88 + Math.random() * 8),
      lastMaintenance: dayjs().subtract(Math.floor(Math.random() * 30), 'days').format('YYYY-MM-DD'),
      nextMaintenance: dayjs().add(Math.floor(Math.random() * 30 + 30), 'days').format('YYYY-MM-DD')
    });
    id++;
  });

  return devices;
}

// 生成更真实的告警数据
function generateAlertData(): EnergyAlert[] {
  const alerts: EnergyAlert[] = [];
  let id = 1;

  // 高能耗告警
  const highConsumptionLocations = ['厨房', '客房区', '公共区域'];
  highConsumptionLocations.forEach(loc => {
    if (Math.random() > 0.7) {
      alerts.push({
        id: id.toString(),
        type: 'high_consumption',
        severity: Math.random() > 0.7 ? 'high' : 'medium',
        location: loc,
        description: `${loc}能耗异常增加，较上月增长${Math.round(5 + Math.random() * 10)}%`,
        timestamp: dayjs().subtract(Math.floor(Math.random() * 24), 'hours').format('YYYY-MM-DD HH:mm:ss'),
        status: Math.random() > 0.6 ? 'active' : Math.random() > 0.5 ? 'acknowledged' : 'resolved'
      });
      id++;
    }
  });

  // 设备故障告警
  const devices = ['中央空调', '热水系统', '电梯', '洗衣设备'];
  devices.forEach(device => {
    if (Math.random() > 0.8) {
      alerts.push({
        id: id.toString(),
        type: 'device_fault',
        severity: Math.random() > 0.7 ? 'critical' : 'high',
        location: device,
        description: `${device}运行异常，需要检查维护`,
        timestamp: dayjs().subtract(Math.floor(Math.random() * 24), 'hours').format('YYYY-MM-DD HH:mm:ss'),
        status: Math.random() > 0.5 ? 'active' : 'acknowledged'
      });
      id++;
    }
  });

  // 效率低下告警
  const areas = ['空调系统', '照明系统', '热水系统', '洗衣系统'];
  areas.forEach(area => {
    if (Math.random() > 0.8) {
      alerts.push({
        id: id.toString(),
        type: 'efficiency_low',
        severity: 'medium',
        location: area,
        description: `${area}效率低于预期，建议进行维护检查`,
        timestamp: dayjs().subtract(Math.floor(Math.random() * 24), 'hours').format('YYYY-MM-DD HH:mm:ss'),
        status: Math.random() > 0.6 ? 'active' : Math.random() > 0.5 ? 'acknowledged' : 'resolved'
      });
      id++;
    }
  });

  // 成本超支告警
  const costAreas = ['总体', '客房区', '餐饮区'];
  costAreas.forEach(area => {
    if (Math.random() > 0.8) {
      alerts.push({
        id: id.toString(),
        type: 'cost_overrun',
        severity: Math.random() > 0.7 ? 'high' : 'medium',
        location: area,
        description: `${area}能耗成本超出预算${Math.round(5 + Math.random() * 10)}%`,
        timestamp: dayjs().subtract(Math.floor(Math.random() * 24), 'hours').format('YYYY-MM-DD HH:mm:ss'),
        status: Math.random() > 0.6 ? 'active' : Math.random() > 0.5 ? 'acknowledged' : 'resolved'
      });
      id++;
    }
  });

  return alerts;
}

const EnergyAnalysis: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [consumption, setConsumption] = useState<EnergyConsumption[]>([]);
  const [devices, setDevices] = useState<EnergyDevice[]>([]);
  const [alerts, setAlerts] = useState<EnergyAlert[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('consumption'); // 修改默认标签页为能耗监控
  const [dateRangeModalVisible, setDateRangeModalVisible] = useState(false);
  const [trendModalVisible, setTrendModalVisible] = useState(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'days'),
    dayjs()
  ]);
  const [selectedDateRange, setSelectedDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'days'),
    dayjs()
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    const consumptionData = generateConsumptionData();
    const deviceData = generateDeviceData();
    const alertData = generateAlertData();

    setConsumption(consumptionData);
    setDevices(deviceData);
    setAlerts(alertData);
    setLoading(false);
  };

  // 处理日期范围选择
  const handleDateRangeOk = () => {
    setDateRange(selectedDateRange);
    setDateRangeModalVisible(false);
    loadData(); // 重新加载数据
  };

  // 处理趋势分析
  const handleTrendAnalysis = () => {
    setTrendModalVisible(true);
  };

  // 生成能耗趋势图表配置
  const getConsumptionTrendOption = () => {
    const dates = Array.from({ length: 30 }, (_, i) => {
      return dayjs().subtract(29 - i, 'days').format('MM-DD');
    });

    // 生成各类能耗的趋势数据
    const electricityData = dates.map(() => Math.round(1000 + Math.random() * 500));
    const waterData = dates.map(() => Math.round(150 + Math.random() * 60));
    const gasData = dates.map(() => Math.round(70 + Math.random() * 30));

    return {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['用电量(kWh)', '用水量(m³)', '燃气量(m³)'],
        top: 10
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
        data: dates,
        axisLabel: {
          rotate: 30
        }
      },
      yAxis: [
        {
          type: 'value',
          name: '用电量(kWh)',
          position: 'left'
        },
        {
          type: 'value',
          name: '用水/燃气量(m³)',
          position: 'right'
        }
      ],
      series: [
        {
          name: '用电量(kWh)',
          type: 'line',
          data: electricityData,
          smooth: true,
          lineStyle: { color: '#1890ff' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [{
                offset: 0,
                color: 'rgba(24,144,255,0.3)'
              }, {
                offset: 1,
                color: 'rgba(24,144,255,0.1)'
              }]
            }
          }
        },
        {
          name: '用水量(m³)',
          type: 'line',
          yAxisIndex: 1,
          data: waterData,
          smooth: true,
          lineStyle: { color: '#52c41a' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [{
                offset: 0,
                color: 'rgba(82,196,26,0.3)'
              }, {
                offset: 1,
                color: 'rgba(82,196,26,0.1)'
              }]
            }
          }
        },
        {
          name: '燃气量(m³)',
          type: 'line',
          yAxisIndex: 1,
          data: gasData,
          smooth: true,
          lineStyle: { color: '#fa8c16' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [{
                offset: 0,
                color: 'rgba(250,140,22,0.3)'
              }, {
                offset: 1,
                color: 'rgba(250,140,22,0.1)'
              }]
            }
          }
        }
      ]
    };
  };

  // 生成设备效率对比图表配置
  const getDeviceEfficiencyOption = () => {
    const deviceTypes = ['空调系统', '照明系统', '厨房设备', '洗衣设备', '其他设备'];
    const efficiencyData = deviceTypes.map(() => Math.round(75 + Math.random() * 20));
    const maintenanceData = deviceTypes.map(() => Math.round(70 + Math.random() * 25));
    const utilizationData = deviceTypes.map(() => Math.round(65 + Math.random() * 30));

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['设备效率', '维护状况', '使用率'],
        top: 10
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}%'
        }
      },
      yAxis: {
        type: 'category',
        data: deviceTypes
      },
      series: [
        {
          name: '设备效率',
          type: 'bar',
          data: efficiencyData,
          itemStyle: { color: '#1890ff' }
        },
        {
          name: '维护状况',
          type: 'bar',
          data: maintenanceData,
          itemStyle: { color: '#52c41a' }
        },
        {
          name: '使用率',
          type: 'bar',
          data: utilizationData,
          itemStyle: { color: '#fa8c16' }
        }
      ]
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
      case 'on':
      case 'resolved':
        return 'green';
      case 'high':
      case 'warning':
      case 'medium':
      case 'acknowledged':
        return 'orange';
      case 'critical':
      case 'high':
      case 'active':
        return 'red';
      case 'off':
      case 'standby':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
      case 'on':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'high':
      case 'warning':
      case 'medium':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'critical':
      case 'active':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'off':
      case 'standby':
        return <ClockCircleOutlined style={{ color: '#d9d9d9' }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      normal: '正常',
      high: '偏高',
      warning: '警告',
      critical: '严重',
      on: '运行中',
      off: '已关闭',
      standby: '待机',
      active: '活跃',
      acknowledged: '已确认',
      resolved: '已解决',
    };
    return statusMap[status] || status;
  };

  const getTypeText = (type: string) => {
    const typeMap: { [key: string]: string } = {
      electricity: '电力',
      water: '用水',
      gas: '燃气',
      heating: '供暖',
      cooling: '制冷',
      lighting: '照明',
      hvac: '空调',
      kitchen: '厨房',
      laundry: '洗衣',
      other: '其他',
    };
    return typeMap[type] || type;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'electricity':
        return <ThunderboltOutlined />;
      case 'water':
        return <DropboxOutlined />;
      case 'gas':
      case 'heating':
        return <FireOutlined />;
      case 'cooling':
        return <CloudOutlined />;
      default:
        return <BarChartOutlined />;
    }
  };

  const getAlertTypeText = (type: string) => {
    const typeMap: { [key: string]: string } = {
      high_consumption: '高能耗',
      device_fault: '设备故障',
      efficiency_low: '效率低下',
      cost_overrun: '成本超支',
    };
    return typeMap[type] || type;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'green';
      case 'medium':
        return 'orange';
      case 'high':
        return 'red';
      case 'critical':
        return 'red';
      default:
        return 'default';
    }
  };

  const consumptionColumns = [
    {
      title: '能耗类型',
      key: 'type',
      render: (_: any, record: EnergyConsumption) => (
        <Space>
          <Avatar icon={getTypeIcon(record.type)} />
          <div>
            <div>
              <Text strong>{getTypeText(record.type)}</Text>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.location}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '当前用量',
      dataIndex: 'currentUsage',
      key: 'currentUsage',
      render: (value: number, record: EnergyConsumption) => (
        <Text strong>{value} {record.unit}</Text>
      ),
    },
    {
      title: '变化率',
      dataIndex: 'changeRate',
      key: 'changeRate',
      render: (rate: number) => (
        <Space>
          {rate > 0 ? <RiseOutlined style={{ color: '#ff4d4f' }} /> : <FallOutlined style={{ color: '#52c41a' }} />}
          <Text style={{ color: rate > 0 ? '#ff4d4f' : '#52c41a' }}>
            {rate > 0 ? '+' : ''}{rate}%
          </Text>
        </Space>
      ),
    },
    {
      title: '成本',
      dataIndex: 'cost',
      key: 'cost',
      render: (cost: number) => (
        <Space>
          <DollarOutlined />
          <Text strong>{cost}</Text>
        </Space>
      ),
    },
    {
      title: '效率',
      dataIndex: 'efficiency',
      key: 'efficiency',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 85 ? '#52c41a' : value > 70 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Space>
          {getStatusIcon(status)}
          <Badge
            status={getStatusColor(status) as any}
            text={getStatusText(status)}
          />
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: EnergyConsumption) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            查看详情
          </Button>
        </Space>
      ),
    },
  ];

  const deviceColumns = [
    {
      title: '设备信息',
      key: 'info',
      render: (_: any, record: EnergyDevice) => (
        <Space>
          <Avatar icon={getTypeIcon(record.type)} />
          <div>
            <div>
              <Text strong>{record.name}</Text>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.location}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color="blue">{getTypeText(type)}</Tag>,
    },
    {
      title: '功率',
      dataIndex: 'power',
      key: 'power',
      render: (power: number) => <Text>{power} kW</Text>,
    },
    {
      title: '运行状态',
      dataIndex: 'currentStatus',
      key: 'currentStatus',
      render: (status: string) => (
        <Space>
          {getStatusIcon(status)}
          <Badge
            status={getStatusColor(status) as any}
            text={getStatusText(status)}
          />
        </Space>
      ),
    },
    {
      title: '日用量',
      dataIndex: 'dailyUsage',
      key: 'dailyUsage',
      render: (usage: number) => <Text>{usage} kWh</Text>,
    },
    {
      title: '月用量',
      dataIndex: 'monthlyUsage',
      key: 'monthlyUsage',
      render: (usage: number) => <Text>{usage} kWh</Text>,
    },
    {
      title: '效率',
      dataIndex: 'efficiency',
      key: 'efficiency',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 85 ? '#52c41a' : value > 70 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: EnergyDevice) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            查看详情
          </Button>
        </Space>
      ),
    },
  ];

  const alertColumns = [
    {
      title: '告警类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Space>
          <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
          <Text>{getAlertTypeText(type)}</Text>
        </Space>
      ),
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
      render: (severity: string) => (
        <Tag color={getSeverityColor(severity)}>
          {severity === 'low' ? '低' : severity === 'medium' ? '中' : severity === 'high' ? '高' : '严重'}
        </Tag>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
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
  ];

  const handleViewDetails = (record: any) => {
    setSelectedItem(record);
    setDetailsModalVisible(true);
  };

  const handleExport = () => {
    Modal.success({
      title: '导出成功',
      content: '能耗分析数据已成功导出到Excel文件',
    });
  };

  const rowSelection = {
    selectedRowKeys: selectedItems,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedItems(selectedRowKeys as string[]);
    },
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <ThunderboltOutlined style={{ marginRight: 8 }} />
          能耗分析
        </Title>
        <Text type="secondary">
          监控和分析酒店各项能耗数据，优化能源使用效率
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总用电量"
              value={consumption.find(c => c.type === 'electricity')?.currentUsage || 0}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix="kWh"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总用水量"
              value={consumption.find(c => c.type === 'water')?.currentUsage || 0}
              prefix={<DropboxOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix="m³"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总能耗成本"
              value={consumption.reduce((sum, c) => sum + c.cost, 0)}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#722ed1' }}
              suffix="元"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均效率"
              value={Math.round(consumption.reduce((sum, c) => sum + c.efficiency, 0) / consumption.length)}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#fa8c16' }}
              suffix="%"
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
            icon={<CalendarOutlined />}
            onClick={() => setDateRangeModalVisible(true)}
          >
            选择时间范围
          </Button>
          <Button
            icon={<LineChartOutlined />}
            onClick={handleTrendAnalysis}
          >
            趋势分析
          </Button>
          <Button
            icon={<ExportOutlined />}
            onClick={handleExport}
          >
            导出报告
          </Button>
        </Space>
      </Card>

      {/* 主要内容区域 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="能耗监控" key="consumption">
            <Table
              columns={consumptionColumns}
              dataSource={consumption}
              rowKey="id"
              loading={loading}
              rowSelection={rowSelection}
              pagination={{
                total: consumption.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          <TabPane tab="设备管理" key="devices">
            <Table
              columns={deviceColumns}
              dataSource={devices}
              rowKey="id"
              loading={loading}
              pagination={{
                total: devices.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          <TabPane tab="告警信息" key="alerts">
            <Table
              columns={alertColumns}
              dataSource={alerts}
              rowKey="id"
              loading={loading}
              pagination={{
                total: alerts.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 详情模态框 */}
      <Modal
        title="能耗详情"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedItem && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="名称" span={2}>
              {selectedItem.name || getTypeText(selectedItem.type)}
            </Descriptions.Item>
            <Descriptions.Item label="位置">
              {selectedItem.location}
            </Descriptions.Item>
            <Descriptions.Item label="类型">
              {getTypeText(selectedItem.type)}
            </Descriptions.Item>
            {selectedItem.currentUsage && (
              <Descriptions.Item label="当前用量">
                {selectedItem.currentUsage} {selectedItem.unit}
              </Descriptions.Item>
            )}
            {selectedItem.power && (
              <Descriptions.Item label="功率">
                {selectedItem.power} kW
              </Descriptions.Item>
            )}
            {selectedItem.cost && (
              <Descriptions.Item label="成本">
                ¥{selectedItem.cost}
              </Descriptions.Item>
            )}
            {selectedItem.efficiency && (
              <Descriptions.Item label="效率">
                <Progress percent={selectedItem.efficiency} size="small" />
              </Descriptions.Item>
            )}
            {selectedItem.currentStatus && (
              <Descriptions.Item label="状态">
                <Badge
                  status={getStatusColor(selectedItem.currentStatus) as any}
                  text={getStatusText(selectedItem.currentStatus)}
                />
              </Descriptions.Item>
            )}
            {selectedItem.lastUpdate && (
              <Descriptions.Item label="最后更新">
                {selectedItem.lastUpdate}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* 日期范围选择模态框 */}
      <Modal
        title="选择时间范围"
        open={dateRangeModalVisible}
        onOk={handleDateRangeOk}
        onCancel={() => setDateRangeModalVisible(false)}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            message="选择要查看的能耗数据时间范围"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <RangePicker
            value={selectedDateRange}
            onChange={(dates) => {
              if (dates) {
                setSelectedDateRange([dates[0]!, dates[1]!]);
              }
            }}
            style={{ width: '100%' }}
          />
        </Space>
      </Modal>

      {/* 趋势分析模态框 */}
      <Modal
        title="能耗趋势分析"
        open={trendModalVisible}
        onCancel={() => setTrendModalVisible(false)}
        width={1000}
        footer={null}
      >
        <Tabs defaultActiveKey="trend">
          <TabPane tab="能耗趋势" key="trend">
            <Card>
              <ReactECharts option={getConsumptionTrendOption()} style={{ height: 400 }} />
            </Card>
          </TabPane>
          <TabPane tab="设备效率" key="efficiency">
            <Card>
              <ReactECharts option={getDeviceEfficiencyOption()} style={{ height: 600 }} />
            </Card>
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default EnergyAnalysis; 