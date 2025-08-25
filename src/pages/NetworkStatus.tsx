import React, { useState, useEffect } from 'react';
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
  Alert,
  Typography,
  Divider,
  Tooltip,
  Badge,
  Descriptions,
} from 'antd';
import {
  WifiOutlined,
  CloudOutlined,
  EyeOutlined,
  SettingOutlined,
  ReloadOutlined,
  ExportOutlined,
  LineChartOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';

const { Title, Text } = Typography;

interface NetworkDevice {
  id: string;
  name: string;
  type: 'router' | 'switch' | 'ap' | 'server';
  ip: string;
  status: 'online' | 'offline' | 'warning';
  bandwidth: number;
  latency: number;
  packetLoss: number;
  uptime: string;
  lastUpdate: string;
}

interface NetworkConnection {
  id: string;
  source: string;
  destination: string;
  bandwidth: number;
  latency: number;
  status: 'active' | 'inactive' | 'error' | 'warning';  // 添加 'warning' 状态
  protocol: string;
  lastUpdate: string;
}

// 添加数据验证和格式化函数
const formatNumber = (value: number, precision: number = 2) => {
  return Number(value.toFixed(precision));
};

const validateBandwidth = (value: number) => {
  return Math.min(100, Math.max(0, value));
};

const validateLatency = (value: number) => {
  return value === 999 ? value : Math.min(200, Math.max(1, value));
};

const validatePacketLoss = (value: number) => {
  return value === 100 ? value : Math.min(10, Math.max(0, value));
};

const NetworkStatus: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState<NetworkDevice[]>([]);
  const [connections, setConnections] = useState<NetworkConnection[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>(dayjs().format('YYYY-MM-DD HH:mm:ss'));
  const [chartModalVisible, setChartModalVisible] = useState(false);
  const [analysisTimeRange, setAnalysisTimeRange] = useState<'hour' | 'day' | 'week'>('hour');

  // 修改模拟数据
  const generateMockDevices = (): NetworkDevice[] => {
    const devices: NetworkDevice[] = [
      // 核心网络设备
      {
        id: '1',
        name: '核心路由器-主',
        type: 'router',
        ip: '192.168.1.1',
        status: 'online',
        bandwidth: 75,
        latency: 8,
        packetLoss: 0.05,
        uptime: '30天 4小时 15分钟',
        lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        id: '2',
        name: '核心路由器-备',
        type: 'router',
        ip: '192.168.1.2',
        status: 'online',
        bandwidth: 45,
        latency: 8,
        packetLoss: 0.05,
        uptime: '30天 4小时 15分钟',
        lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        id: '3',
        name: '核心交换机-主',
        type: 'switch',
        ip: '192.168.1.10',
        status: 'online',
        bandwidth: 82,
        latency: 5,
        packetLoss: 0.02,
        uptime: '25天 16小时 45分钟',
        lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        id: '4',
        name: '核心交换机-备',
        type: 'switch',
        ip: '192.168.1.11',
        status: 'online',
        bandwidth: 45,
        latency: 5,
        packetLoss: 0.02,
        uptime: '25天 16小时 45分钟',
        lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      }
    ];

    // 楼层交换机
    for (let floor = 1; floor <= 20; floor++) {
      devices.push({
        id: `switch-f${floor}`,
        name: `${floor}F交换机`,
        type: 'switch',
        ip: `192.168.1.${20 + floor}`,
        status: Math.random() > 0.95 ? 'warning' : 'online',
        bandwidth: 45 + Math.random() * 30,
        latency: 8 + Math.random() * 4,
        packetLoss: 0.1 + Math.random() * 0.3,
        uptime: `${Math.floor(10 + Math.random() * 20)}天 ${Math.floor(Math.random() * 24)}小时 ${Math.floor(Math.random() * 60)}分钟`,
        lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });
    }

    // 无线AP
    const areas = [
      { prefix: 'lobby', name: '大门', count: 4 },
      { prefix: 'restaurant', name: '餐厅', count: 6 },
      { prefix: 'conference', name: '会议室', count: 8 },
      { prefix: 'business', name: '商务中心', count: 2 },
      { prefix: 'gym', name: '健身房', count: 2 },
      { prefix: 'spa', name: 'SPA', count: 2 },
      { prefix: 'parking', name: '停车场', count: 4 }
    ];

    let apId = 1;
    areas.forEach(area => {
      for (let i = 1; i <= area.count; i++) {
        devices.push({
          id: `ap-${area.prefix}-${i}`,
          name: `${area.name}AP-${i}`,
          type: 'ap',
          ip: `192.168.2.${apId}`,
          status: Math.random() > 0.9 ? 'warning' : 'online',
          bandwidth: 40 + Math.random() * 40,
          latency: 10 + Math.random() * 10,
          packetLoss: 0.2 + Math.random() * 0.8,
          uptime: `${Math.floor(5 + Math.random() * 15)}天 ${Math.floor(Math.random() * 24)}小时 ${Math.floor(Math.random() * 60)}分钟`,
          lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        });
        apId++;
      }
    });

    // 客房AP (每层8个)
    for (let floor = 1; floor <= 20; floor++) {
      for (let room = 1; room <= 8; room++) {
        devices.push({
          id: `ap-room-f${floor}-${room}`,
          name: `${floor}F客房AP-${room}`,
          type: 'ap',
          ip: `192.168.3.${floor * 10 + room}`,
          status: Math.random() > 0.95 ? 'offline' : Math.random() > 0.9 ? 'warning' : 'online',
          bandwidth: 30 + Math.random() * 40,
          latency: 12 + Math.random() * 8,
          packetLoss: 0.3 + Math.random() * 0.7,
          uptime: `${Math.floor(5 + Math.random() * 15)}天 ${Math.floor(Math.random() * 24)}小时 ${Math.floor(Math.random() * 60)}分钟`,
          lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        });
      }
    }

    // 服务器
    const servers = [
      { name: '应用服务器-主', ip: '192.168.1.100' },
      { name: '应用服务器-备', ip: '192.168.1.101' },
      { name: '数据库服务器-主', ip: '192.168.1.102' },
      { name: '数据库服务器-备', ip: '192.168.1.103' },
      { name: '文件服务器', ip: '192.168.1.104' },
      { name: '备份服务器', ip: '192.168.1.105' },
      { name: '监控服务器', ip: '192.168.1.106' },
      { name: '日志服务器', ip: '192.168.1.107' },
      { name: '网管服务器', ip: '192.168.1.108' },
      { name: 'Web服务器-1', ip: '192.168.1.109' },
      { name: 'Web服务器-2', ip: '192.168.1.110' },
      { name: '缓存服务器', ip: '192.168.1.111' },
      { name: '认证服务器', ip: '192.168.1.112' },
      { name: 'DNS服务器-主', ip: '192.168.1.113' },
      { name: 'DNS服务器-备', ip: '192.168.1.114' }
    ];

    servers.forEach((server, index) => {
      devices.push({
        id: `server-${index + 1}`,
        name: server.name,
        type: 'server',
        ip: server.ip,
        status: Math.random() > 0.98 ? 'warning' : 'online',
        bandwidth: 20 + Math.random() * 30,
        latency: 3 + Math.random() * 3,
        packetLoss: 0.01 + Math.random() * 0.1,
        uptime: `${Math.floor(20 + Math.random() * 10)}天 ${Math.floor(Math.random() * 24)}小时 ${Math.floor(Math.random() * 60)}分钟`,
        lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });
    });

    return devices;
  };

  const generateMockConnections = (devices: NetworkDevice[]): NetworkConnection[] => {
    const connections: NetworkConnection[] = [];
    let connId = 1;

    // 核心设备间的连接
    connections.push(
      {
        id: `conn-${connId++}`,
        source: '核心路由器-主',
        destination: '核心交换机-主',
        bandwidth: 75,
        latency: 5,
        status: 'active',
        protocol: '40GbE',
        lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        id: `conn-${connId++}`,
        source: '核心路由器-主',
        destination: '核心交换机-备',
        bandwidth: 45,
        latency: 5,
        status: 'active',
        protocol: '40GbE',
        lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        id: `conn-${connId++}`,
        source: '核心路由器-备',
        destination: '核心交换机-主',
        bandwidth: 45,
        latency: 5,
        status: 'active',
        protocol: '40GbE',
        lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        id: `conn-${connId++}`,
        source: '核心路由器-备',
        destination: '核心交换机-备',
        bandwidth: 45,
        latency: 5,
        status: 'active',
        protocol: '40GbE',
        lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      }
    );

    // 楼层交换机的连接
    for (let floor = 1; floor <= 20; floor++) {
      const floorSwitch = devices.find(d => d.name === `${floor}F交换机`);
      if (floorSwitch) {
        // 连接到核心交换机
        connections.push({
          id: `conn-${connId++}`,
          source: floor <= 10 ? '核心交换机-主' : '核心交换机-备',
          destination: `${floor}F交换机`,
          bandwidth: 40 + Math.random() * 30,
          latency: 8 + Math.random() * 4,
          status: Math.random() > 0.95 ? 'warning' : 'active',
          protocol: '10GbE',
          lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        });

        // 连接到该层的AP
        const floorAPs = devices.filter(d => d.name.startsWith(`${floor}F客房AP`));
        floorAPs.forEach(ap => {
          connections.push({
            id: `conn-${connId++}`,
            source: `${floor}F交换机`,
            destination: ap.name,
            bandwidth: 30 + Math.random() * 40,
            latency: 12 + Math.random() * 8,
            status: ap.status === 'offline' ? 'error' : Math.random() > 0.95 ? 'warning' : 'active',
            protocol: 'WiFi 6',
            lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          });
        });
      }
    }

    // 公共区域AP的连接
    const publicAPs = devices.filter(d => d.type === 'ap' && !d.name.includes('客房'));
    publicAPs.forEach(ap => {
      connections.push({
        id: `conn-${connId++}`,
        source: Math.random() > 0.5 ? '核心交换机-主' : '核心交换机-备',
        destination: ap.name,
        bandwidth: 40 + Math.random() * 40,
        latency: 10 + Math.random() * 10,
        status: ap.status === 'offline' ? 'error' : Math.random() > 0.95 ? 'warning' : 'active',
        protocol: 'WiFi 6',
        lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });
    });

    // 服务器的连接
    const servers = devices.filter(d => d.type === 'server');
    servers.forEach(server => {
      connections.push({
        id: `conn-${connId++}`,
        source: Math.random() > 0.5 ? '核心交换机-主' : '核心交换机-备',
        destination: server.name,
        bandwidth: 20 + Math.random() * 30,
        latency: 3 + Math.random() * 3,
        status: server.status === 'offline' ? 'error' : Math.random() > 0.98 ? 'warning' : 'active',
        protocol: '10GbE',
        lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });
    });

    return connections;
  };

  // 初始化模拟数据
  const mockDevices = generateMockDevices();
  const mockConnections = generateMockConnections(mockDevices);

  // 生成分析数据
  const generateAnalysisData = (type: 'bandwidth' | 'latency' | 'packetLoss', range: 'hour' | 'day' | 'week') => {
    const now = dayjs();
    const data: { time: string; value: number }[] = [];
    let startTime: dayjs.Dayjs;
    let interval: number;
    let format: string;

    switch (range) {
      case 'hour':
        startTime = now.subtract(1, 'hour');
        interval = 60; // 每分钟一个点
        format = 'HH:mm';
        break;
      case 'day':
        startTime = now.subtract(24, 'hour');
        interval = 1800; // 每30分钟一个点
        format = 'HH:mm';
        break;
      case 'week':
        startTime = now.subtract(7, 'day');
        interval = 7200; // 每2小时一个点
        format = 'MM-DD HH:mm';
        break;
    }

    // 基准值设置
    const baseValues = {
      bandwidth: 50,
      latency: 15,
      packetLoss: 0.5
    };

    // 波动范围设置
    const fluctuationRanges = {
      bandwidth: 20,
      latency: 5,
      packetLoss: 0.2
    };

    // 生成时间序列数据
    let currentTime = startTime;
    while (currentTime.isBefore(now) || currentTime.isSame(now)) {
      const hour = currentTime.hour();
      let modifier = 0;

      // 根据时间调整数值
      if (hour >= 9 && hour <= 18) {
        // 工作时间带宽使用较高
        modifier = type === 'bandwidth' ? 15 : 
                  type === 'latency' ? 3 :
                  type === 'packetLoss' ? 0.1 : 0;
      } else if (hour >= 19 && hour <= 22) {
        // 晚间娱乐时间带宽使用更高
        modifier = type === 'bandwidth' ? 20 :
                  type === 'latency' ? 4 :
                  type === 'packetLoss' ? 0.15 : 0;
      }

      const baseValue = baseValues[type];
      const fluctuation = fluctuationRanges[type];
      let value = baseValue + (Math.random() - 0.5) * fluctuation + modifier;

      // 验证数值范围
      switch (type) {
        case 'bandwidth':
          value = validateBandwidth(value);
          break;
        case 'latency':
          value = validateLatency(value);
          break;
        case 'packetLoss':
          value = validatePacketLoss(value);
          break;
      }

      data.push({
        time: currentTime.format(format),
        value: formatNumber(value, type === 'packetLoss' ? 2 : 1)
      });

      currentTime = currentTime.add(interval, 'second');
    }

    return data;
  };

  // 获取图表选项
  const getChartOption = (type: 'bandwidth' | 'latency' | 'packetLoss', data: { time: string; value: number }[]) => {
    const titles = {
      bandwidth: '带宽使用率趋势 (%)',
      latency: '网络延迟趋势 (ms)',
      packetLoss: '丢包率趋势 (%)'
    };

    const colors = {
      bandwidth: '#1890ff',
      latency: '#faad14',
      packetLoss: '#ff4d4f'
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
          return `${data.name}<br/>${data.value}${type === 'bandwidth' ? '%' : type === 'latency' ? 'ms' : '%'}`;
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
          formatter: (value: number) => `${value}${type === 'bandwidth' ? '%' : type === 'latency' ? 'ms' : '%'}`
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

  useEffect(() => {
    loadData();
    // 设置定时器，每30秒更新一次数据
    const timer = setInterval(() => {
      loadData();
    }, 30000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const loadData = () => {
    setLoading(true);
    // 更新时间戳
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    setLastUpdateTime(currentTime);

    // 更新设备状态
    const updatedDevices = mockDevices.map(device => ({
      ...device,
      lastUpdate: currentTime,
      bandwidth: device.status === 'offline' ? 0 : validateBandwidth(device.bandwidth + (Math.random() - 0.5) * 5),
      latency: device.status === 'offline' ? 999 : validateLatency(device.latency + (Math.random() - 0.5) * 2),
      packetLoss: device.status === 'offline' ? 100 : validatePacketLoss(device.packetLoss + (Math.random() - 0.5) * 0.2)
    }));

    // 更新连接状态
    const updatedConnections = mockConnections.map(conn => ({
      ...conn,
      lastUpdate: currentTime,
      bandwidth: conn.status === 'error' ? 0 : validateBandwidth(conn.bandwidth + (Math.random() - 0.5) * 5),
      latency: conn.status === 'error' ? 999 : validateLatency(conn.latency + (Math.random() - 0.5) * 2)
    }));

    setDevices(updatedDevices);
    setConnections(updatedConnections);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'active':
        return 'green';
      case 'warning':
        return 'orange';
      case 'offline':
      case 'inactive':
      case 'error':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'active':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'warning':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'offline':
      case 'inactive':
      case 'error':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return '在线';
      case 'offline':
        return '离线';
      case 'warning':
        return '警告';
      case 'active':
        return '活跃';
      case 'inactive':
        return '非活跃';
      case 'error':
        return '错误';
      default:
        return '未知';
    }
  };

  const getDeviceTypeText = (type: string) => {
    switch (type) {
      case 'router':
        return '路由器';
      case 'switch':
        return '交换机';
      case 'ap':
        return '无线AP';
      case 'server':
        return '服务器';
      default:
        return '未知';
    }
  };

  const deviceColumns = [
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: NetworkDevice) => (
        <Space>
          {getStatusIcon(record.status)}
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color="blue">{getDeviceTypeText(type)}</Tag>
      ),
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      render: (text: string) => (
        <Text code>{text}</Text>
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
      title: '带宽使用率',
      dataIndex: 'bandwidth',
      key: 'bandwidth',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{formatNumber(value, 1)}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 80 ? '#ff4d4f' : value > 60 ? '#faad14' : '#52c41a'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '延迟 (ms)',
      dataIndex: 'latency',
      key: 'latency',
      render: (value: number) => (
        <Text strong style={{ color: value > 20 ? '#ff4d4f' : value > 10 ? '#faad14' : '#52c41a' }}>
          {formatNumber(value, 1)}
        </Text>
      ),
    },
    {
      title: '丢包率 (%)',
      dataIndex: 'packetLoss',
      key: 'packetLoss',
      render: (value: number) => (
        <Text strong style={{ color: value > 1 ? '#ff4d4f' : value > 0.5 ? '#faad14' : '#52c41a' }}>
          {formatNumber(value, 2)}
        </Text>
      ),
    },
    {
      title: '运行时间',
      dataIndex: 'uptime',
      key: 'uptime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: NetworkDevice) => (
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

  const connectionColumns = [
    {
      title: '源设备',
      dataIndex: 'source',
      key: 'source',
    },
    {
      title: '目标设备',
      dataIndex: 'destination',
      key: 'destination',
    },
    {
      title: '协议',
      dataIndex: 'protocol',
      key: 'protocol',
      render: (text: string) => (
        <Tag color="purple">{text}</Tag>
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
      title: '带宽使用率',
      dataIndex: 'bandwidth',
      key: 'bandwidth',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{formatNumber(value, 1)}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 80 ? '#ff4d4f' : value > 60 ? '#faad14' : '#52c41a'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '延迟 (ms)',
      dataIndex: 'latency',
      key: 'latency',
      render: (value: number) => (
        <Text strong style={{ color: value > 20 ? '#ff4d4f' : value > 10 ? '#faad14' : '#52c41a' }}>
          {formatNumber(value, 1)}
        </Text>
      ),
    },
  ];

  const handleViewDetails = (record: NetworkDevice) => {
    setSelectedDevice(record);
    setDetailsModalVisible(true);
  };

  const handleSettings = (record: NetworkDevice) => {
    setSettingsModalVisible(true);
  };

  // 修改数据分析模态框内容
  const renderAnalysisContent = () => {
    return (
      <div>
        <Space style={{ marginBottom: 16 }}>
          <Select 
            value={analysisTimeRange} 
            onChange={setAnalysisTimeRange}
            style={{ width: 120 }}
          >
            <Select.Option value="hour">最近1小时</Select.Option>
            <Select.Option value="day">最近24小时</Select.Option>
            <Select.Option value="week">最近7天</Select.Option>
          </Select>
        </Space>
        
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <ReactECharts 
              option={getChartOption('bandwidth', generateAnalysisData('bandwidth', analysisTimeRange))}
              style={{ height: '300px' }}
            />
          </Col>
          <Col span={24}>
            <ReactECharts 
              option={getChartOption('latency', generateAnalysisData('latency', analysisTimeRange))}
              style={{ height: '300px' }}
            />
          </Col>
          <Col span={24}>
            <ReactECharts 
              option={getChartOption('packetLoss', generateAnalysisData('packetLoss', analysisTimeRange))}
              style={{ height: '300px' }}
            />
          </Col>
        </Row>
      </div>
    );
  };

  // 修改handleDataAnalysis函数
  const handleDataAnalysis = () => {
    setChartModalVisible(true);
  };

  const handleExport = () => {
    Modal.success({
      title: '导出成功',
      content: '网络状态数据已成功导出到Excel文件',
    });
  };

  const handleBatchOperation = () => {
    if (selectedDevices.length === 0) {
      Modal.warning({
        title: '提示',
        content: '请先选择要操作的设备',
      });
      return;
    }
    Modal.info({
      title: '批量操作',
      content: `已选择 ${selectedDevices.length} 个设备进行批量操作`,
    });
  };

  const deviceRowSelection = {
    selectedRowKeys: selectedDevices,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedDevices(selectedRowKeys as string[]);
    },
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <WifiOutlined style={{ marginRight: 8 }} />
          网络状态监测
        </Title>
        <Space>
          <Text type="secondary">
            实时监测网络设备状态和连接质量，确保网络稳定运行
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
              title="网络设备总数"
              value={devices.length}
              prefix={<WifiOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线设备"
              value={devices.filter(item => item.status === 'online').length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="警告设备"
              value={devices.filter(item => item.status === 'warning').length}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="离线设备"
              value={devices.filter(item => item.status === 'offline').length}
              prefix={<CloseCircleOutlined />}
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
          {selectedDevices.length > 0 && (
            <Button
              type="default"
              onClick={handleBatchOperation}
            >
              批量操作 ({selectedDevices.length})
            </Button>
          )}
        </Space>
      </Card>

      {/* 网络设备表格 */}
      <Card title="网络设备状态" style={{ marginBottom: '24px' }}>
        <Table
          columns={deviceColumns}
          dataSource={devices}
          rowKey="id"
          loading={loading}
          rowSelection={deviceRowSelection}
          pagination={{
            total: devices.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
        />
      </Card>

      {/* 网络连接表格 */}
      <Card title="网络连接状态">
        <Table
          columns={connectionColumns}
          dataSource={connections}
          rowKey="id"
          loading={loading}
          pagination={{
            total: connections.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
        />
      </Card>

      {/* 设备详情模态框 */}
      <Modal
        title="设备详情"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedDevice && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="设备名称" span={2}>
              {selectedDevice.name}
            </Descriptions.Item>
            <Descriptions.Item label="设备类型">
              {getDeviceTypeText(selectedDevice.type)}
            </Descriptions.Item>
            <Descriptions.Item label="IP地址">
              <Text code>{selectedDevice.ip}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Badge
                status={getStatusColor(selectedDevice.status) as any}
                text={getStatusText(selectedDevice.status)}
              />
            </Descriptions.Item>
            <Descriptions.Item label="运行时间">
              {selectedDevice.uptime}
            </Descriptions.Item>
            <Descriptions.Item label="带宽使用率">
              <Progress
                percent={selectedDevice.bandwidth}
                strokeColor={selectedDevice.bandwidth > 80 ? '#ff4d4f' : selectedDevice.bandwidth > 60 ? '#faad14' : '#52c41a'}
              />
            </Descriptions.Item>
            <Descriptions.Item label="网络延迟">
              <Text style={{ color: selectedDevice.latency > 20 ? '#ff4d4f' : selectedDevice.latency > 10 ? '#faad14' : '#52c41a' }}>
                {formatNumber(selectedDevice.latency, 1)} ms
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="丢包率">
              <Text style={{ color: selectedDevice.packetLoss > 1 ? '#ff4d4f' : selectedDevice.packetLoss > 0.5 ? '#faad14' : '#52c41a' }}>
                {formatNumber(selectedDevice.packetLoss, 2)}%
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="最后更新" span={2}>
              {selectedDevice.lastUpdate}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 设置模态框 */}
      <Modal
        title="网络设备设置"
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
          <Form.Item label="监控频率">
            <Select defaultValue="30s">
              <Select.Option value="10s">10秒</Select.Option>
              <Select.Option value="30s">30秒</Select.Option>
              <Select.Option value="1min">1分钟</Select.Option>
              <Select.Option value="5min">5分钟</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="告警阈值">
            <Input.Group compact>
              <Input placeholder="延迟阈值(ms)" style={{ width: '50%' }} />
              <Input placeholder="丢包率阈值(%)" style={{ width: '50%' }} />
            </Input.Group>
          </Form.Item>
          <Form.Item label="通知方式">
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
        title="网络性能分析"
        open={chartModalVisible}
        onCancel={() => setChartModalVisible(false)}
        footer={null}
        width={1000}
        style={{ top: 20 }}
      >
        {renderAnalysisContent()}
      </Modal>
    </div>
  );
};

export default NetworkStatus; 