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
  
  Badge,
  
  Descriptions,
  
  Avatar,
  Tabs,
  message
} from 'antd';
import {
  SafetyOutlined,
  VideoCameraOutlined,
  AlertOutlined,
  EyeOutlined,
  SettingOutlined,
  ReloadOutlined,
  ExportOutlined,
  LineChartOutlined,
  CheckCircleOutlined,
  
  ExclamationCircleOutlined,
  
  CameraOutlined,
  
  ClockCircleOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  FullscreenOutlined,
  EnvironmentOutlined,
  HistoryOutlined,
  
  FilterOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { Segmented } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface SecurityCamera {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  resolution: string;
  recording: boolean;
  motionDetection: boolean;
  lastRecording: string;
  storageUsage: number;
  isFireEscape?: boolean; // 新增属性
}



interface AlarmEvent {
  id: string;
  type: 'motion' | 'fire' | 'intrusion';
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved';
  timestamp: string;
  description: string;
  handledBy?: string;
}

interface AnalysisData {
  time: string;
  value: number;
}

// 添加区域配置
const AREAS = {
  public: ['大门', '前台区域', '电梯厅', '休息区', '走廊'],
  restaurant: ['中餐厅', '西餐厅', '咖啡厅', '酒吧', '宴会厅'],
  meeting: ['多功能厅', '会议室A', '会议室B', '会议室C', '商务中心'],
  facilities: ['健身房', 'SPA', '游泳池', '儿童乐园', '娱乐室'],
  rooms: Array.from({ length: 20 }, (_, i) => `${i + 1}层客房区`),
  service: ['员工餐厅', '员工休息室', '洗衣房', '储藏室', '设备间'],
  parking: ['地下停车场入口', '地下停车场A区', '地下停车场B区', '地面停车场', '装卸货区'],
  exterior: ['正门', '侧门', '后门', '花园', '屋顶']
};

// 添加数值格式化函数
const formatNumber = (value: number, precision: number = 1) => {
  return Number(value.toFixed(precision));
};

const SecuritySystem: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [cameras, setCameras] = useState<SecurityCamera[]>([]);
  const [alarmEvents, setAlarmEvents] = useState<AlarmEvent[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('cameras'); // 修改默认标签为cameras
  const [analysisModalVisible, setAnalysisModalVisible] = useState(false);
  const [analysisTimeRange, setAnalysisTimeRange] = useState<'day' | 'week' | 'month'>('day');
  const [analysisType, setAnalysisType] = useState<'alarms' | 'storage'>('alarms');
  const [pageSize, setPageSize] = useState(10);
  const [currentCameraPage, setCurrentCameraPage] = useState(1);
  const [currentAlarmPage, setCurrentAlarmPage] = useState(1);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<SecurityCamera | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [alarmSeverityFilter, setAlarmSeverityFilter] = useState<string>('all');
  const [alarmStatusFilter, setAlarmStatusFilter] = useState<string>('all');
  const [alarmRange, setAlarmRange] = useState<any>();
  const [processModalVisible, setProcessModalVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(dayjs());
  // const [processingEvent, setProcessingEvent] = useState<AlarmEvent | null>(null);


  // 生成摄像头数据
  const generateCameraData = (): SecurityCamera[] => {
    const cameras: SecurityCamera[] = [];
    let id = 1;

    // 为每个区域生成摄像头
    Object.entries(AREAS).forEach(([areaType, locations], areaIndex) => {
      locations.forEach((location, locationIndex) => {
        // 每个位置1-3个摄像头
        const cameraCount = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < cameraCount; i++) {
          const idStr = id.toString().padStart(3, '0');
          // const battery = Math.floor(30 + Math.random() * 70); // 30-100%
          const status = Math.random() > 0.95 ? 'maintenance' :
                        Math.random() > 0.98 ? 'offline' : 'online';

          // 特殊处理第二个摄像头为消防通道
          const isFireEscape = id === 2;
          const customName = isFireEscape ? '消防通道监控-1' : `${location}摄像头-${i + 1}`;
          const customLocation = isFireEscape ? '消防通道' : location;

          cameras.push({
            id: `cam_${idStr}`,
            name: customName,
            location: customLocation,
            status,
            resolution: Math.random() > 0.5 ? '4K' : '1080P',
            recording: status === 'online' && Math.random() > 0.1,
            motionDetection: status === 'online' && Math.random() > 0.1,
            lastRecording: dayjs().subtract(Math.random() * 60, 'minute').format('YYYY-MM-DD HH:mm:ss'),
            storageUsage: Math.floor(40 + Math.random() * 50), // 40-90%
            isFireEscape // 添加标识
          });
          id++;
        }
      });
    });

    return cameras;
  };

  // 生成报警事件数据
  const generateAlarmEvents = (cameras: SecurityCamera[]): AlarmEvent[] => {
    const events: AlarmEvent[] = [];
    const eventTypes: ('motion' | 'fire' | 'intrusion')[] = ['motion', 'fire', 'intrusion'];
    const severityLevels: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
    const operators = ['张三', '李四', '王五', '赵六', '系统'];

    // 生成200个报警事件
    for (let i = 1; i <= 200; i++) {
      const id = i.toString().padStart(3, '0');
      const camera = cameras[Math.floor(Math.random() * cameras.length)];
      const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const severity = type === 'fire' ? 'critical' :
                      type === 'intrusion' ? (Math.random() > 0.5 ? 'high' : 'medium') :
                      severityLevels[Math.floor(Math.random() * severityLevels.length)];
      
      // 生成随机时间（过去24小时内）
      const timestamp = dayjs().subtract(Math.random() * 24, 'hour');
      
      // 根据时间确定状态和处理人
      let status: 'active' | 'acknowledged' | 'resolved';
      let handledBy: string | undefined;
      
      if (timestamp.isAfter(dayjs().subtract(1, 'hour'))) {
        // 最近1小时的事件
        status = 'active';
        handledBy = undefined;
      } else if (timestamp.isAfter(dayjs().subtract(4, 'hour'))) {
        // 1-4小时前的事件
        status = Math.random() > 0.3 ? 'acknowledged' : 'active';
        handledBy = status === 'acknowledged' ? operators[Math.floor(Math.random() * operators.length)] : undefined;
      } else {
        // 4小时前的事件
        status = Math.random() > 0.1 ? 'resolved' : 'acknowledged';
        handledBy = operators[Math.floor(Math.random() * operators.length)];
      }

      // 生成描述
      let description = '';
      switch (type) {
        case 'motion':
          description = `在${camera.location}检测到异常移动`;
          break;
        case 'fire':
          description = `${camera.location}烟雾报警器触发`;
          break;
        case 'intrusion':
          description = `${camera.location}检测到可疑人员活动`;
          break;
      }

      events.push({
        id: `event_${id}`,
        type,
        location: camera.location,
        severity,
        status,
        timestamp: timestamp.format('YYYY-MM-DD HH:mm:ss'),
        description,
        handledBy
      });
    }

    // 按时间倒序排序
    return events.sort((a, b) => dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf());
  };

  // 修改初始化数据
  useEffect(() => {
    const cameraData = generateCameraData();
    const eventData = generateAlarmEvents(cameraData);
    
    setCameras(cameraData);
    setAlarmEvents(eventData);

    // 设置定时器，每30秒更新一次数据，每秒更新时间
    const dataTimer = setInterval(() => {
      // 更新摄像头状态
      const updatedCameras = cameraData.map(camera => {
        if (camera.status === 'online') {
          // 更新存储使用量
          const storageUsage = Math.min(100, camera.storageUsage + (Math.random() - 0.3));
          // 更新最后录制时间
          const lastRecording = Math.random() > 0.8 ? dayjs().format('YYYY-MM-DD HH:mm:ss') : camera.lastRecording;
          return { ...camera, storageUsage, lastRecording };
        }
        return camera;
      });

      // 随机添加新的报警事件
      const newEvents: AlarmEvent[] = [];
      if (Math.random() > 0.7) { // 30%概率生成新事件
        const camera = updatedCameras[Math.floor(Math.random() * updatedCameras.length)];
        if (camera.status === 'online') {
          const type = Math.random() > 0.8 ? 'intrusion' as const : 'motion' as const;
          newEvents.push({
            id: `event_${Date.now()}`,
            type,
            location: camera.location,
            severity: type === 'intrusion' ? 'high' as const : 'medium' as const,
            status: 'active' as const,
            timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            description: type === 'intrusion' ? 
                        `${camera.location}检测到可疑人员活动` :
                        `在${camera.location}检测到异常移动`
          });
        }
      }

      // 更新报警事件状态
      const updatedEvents = eventData.map(event => {
        if (event.status === 'active' && Math.random() > 0.7) {
          return {
            ...event,
            status: 'acknowledged' as const,
            handledBy: ['张三', '李四', '王五', '赵六'][Math.floor(Math.random() * 4)]
          };
        }
        return event;
      }).concat(newEvents);

      setCameras(updatedCameras);
      setAlarmEvents(updatedEvents);
    }, 30000);
    
    // 每秒更新时间
    const timeTimer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    return () => {
      clearInterval(dataTimer);
      clearInterval(timeTimer);
    };
  }, []);

  // 修改loadData函数，重置分页状态
  const loadData = () => {
    setLoading(true);
    const cameraData = generateCameraData();
    const eventData = generateAlarmEvents(cameraData);
    setCameras(cameraData);
    setAlarmEvents(eventData);
    setCurrentCameraPage(1);
    setCurrentAlarmPage(1);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'normal':
      case 'resolved':
        return 'green';
      case 'offline':
      case 'locked':
      case 'acknowledged':
        return 'orange';
      case 'maintenance':
        return 'purple';
      case 'active':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'normal':
      case 'resolved':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'offline':
      case 'locked':
      case 'acknowledged':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'maintenance':
        return <SettingOutlined style={{ color: '#722ed1' }} />;
      case 'active':
        return <AlertOutlined style={{ color: '#ff4d4f' }} />;
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
      case 'maintenance':
        return '维护中';
      case 'normal':
        return '正常';
      case 'locked':
        return '锁定';
      case 'active':
        return '活跃';
      case 'acknowledged':
        return '已确认';
      case 'resolved':
        return '已解决';
      default:
        return '未知';
    }
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

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'low':
        return '低';
      case 'medium':
        return '中';
      case 'high':
        return '高';
      case 'critical':
        return '紧急';
      default:
        return '未知';
    }
  };

  const getAlarmTypeText = (type: string) => {
    switch (type) {
      case 'motion':
        return '移动检测';
      case 'fire':
        return '火灾报警';
      case 'intrusion':
        return '入侵检测';
      default:
        return '未知';
    }
  };

  // 处理查看视频
  const handleViewVideo = (camera: SecurityCamera) => {
    setSelectedCamera(camera);
    setVideoModalVisible(true);
  };

  // 修改摄像头列表列配置
  const cameraColumns = [
    {
      title: '摄像头信息',
      key: 'info',
      render: (_: any, record: SecurityCamera) => (
        <Space>
          <Avatar size="large" icon={<CameraOutlined />} />
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
      title: '分辨率',
      dataIndex: 'resolution',
      key: 'resolution',
    },
    {
      title: '录制状态',
      dataIndex: 'recording',
      key: 'recording',
      render: (recording: boolean) => (
        <Tag color={recording ? 'green' : 'red'}>
          {recording ? '录制中' : '未录制'}
        </Tag>
      ),
    },
    {
      title: '移动检测',
      dataIndex: 'motionDetection',
      key: 'motionDetection',
      render: (detection: boolean) => (
        <Tag color={detection ? 'green' : 'red'}>
          {detection ? '已启用' : '已禁用'}
        </Tag>
      ),
    },
    {
      title: '存储使用',
      dataIndex: 'storageUsage',
      key: 'storageUsage',
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
      title: '操作',
      key: 'action',
      render: (_: any, record: SecurityCamera) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewVideo(record)}
          >
            查看
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



  const alarmColumns = [
    {
      title: '报警类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Space>
          <AlertOutlined style={{ color: '#ff4d4f' }} />
          <Text>{getAlarmTypeText(type)}</Text>
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
          {getSeverityText(severity)}
        </Tag>
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
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '处理人',
      dataIndex: 'handledBy',
      key: 'handledBy',
      render: (handler: string) => handler || '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: AlarmEvent) => (
        <Space>
          <Button size="small" type="link" onClick={() => { setProcessModalVisible(true); }}>处理</Button>
        </Space>
      )
    }
  ];

  // const handleViewDetails = (record: any) => {
  //   setSelectedItem(record);
  //   setDetailsModalVisible(true);
  // };

  const handleSettings = (record: any) => {
    setSettingsModalVisible(true);
  };

  const handleExport = () => {
    Modal.success({
      title: '导出成功',
      content: '安防系统数据已成功导出到Excel文件',
    });
  };

  const handleBatchOperation = () => {
    if (selectedItems.length === 0) {
      Modal.warning({
        title: '提示',
        content: '请先选择要操作的设备',
      });
      return;
    }
    Modal.info({
      title: '批量操作',
      content: `已选择 ${selectedItems.length} 个设备进行批量操作`,
    });
  };

  // const rowSelection = {
  //   selectedRowKeys: selectedItems,
  //   onChange: (selectedRowKeys: React.Key[]) => {
  //     setSelectedItems(selectedRowKeys as string[]);
  //   },
  // };

  // 生成分析数据
  const generateAnalysisData = (type: string, range: 'day' | 'week' | 'month'): AnalysisData[] => {
    const data: AnalysisData[] = [];
    const now = dayjs();
    let startTime: dayjs.Dayjs;
    let format: string;
    let step: number;
    
    switch (range) {
      case 'day':
        startTime = now.subtract(24, 'hour');
        format = 'HH:00';
        step = 1;
        break;
      case 'week':
        startTime = now.subtract(7, 'day');
        format = 'MM-DD';
        step = 24;
        break;
      case 'month':
        startTime = now.subtract(30, 'day');
        format = 'MM-DD';
        step = 24;
        break;
    }

    for (let i = 0; startTime.add(i * step, 'hour').isBefore(now); i++) {
      const time = startTime.add(i * step, 'hour');
      const timeStr = time.format(format);

      switch (type) {
        case 'alarms':
          // 报警事件数量随时间变化
          const baseAlarms = 8;
          const hourEffect = Math.sin((time.hour() - 12) * Math.PI / 12) * 5; // 夜间报警较多
          const weekendEffect = [0, 6].includes(time.day()) ? 3 : 0; // 周末报警较多
          data.push({
            time: timeStr,
            value: Math.max(0, Math.round(baseAlarms - hourEffect + weekendEffect + Math.random() * 8))
          });
          break;

        case 'storage':
          // 存储使用量趋势
          const baseStorage = 65;
          const dayEffect = time.hour() / 24 * 15; // 随时间增长
          const weekEffect = [0, 6].includes(time.day()) ? 5 : 0; // 周末存储增长较快
          data.push({
            time: timeStr,
            value: Math.min(100, Math.round(baseStorage + dayEffect + weekEffect + Math.random() * 8))
          });
          break;
      }
    }

    return data;
  };

  // 获取图表配置
  const getChartOption = (type: string, data: AnalysisData[]) => {
    const baseOption = {
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      }
    };

    switch (type) {
      case 'alarms':
        return {
          ...baseOption,
          title: {
            text: '报警事件趋势',
            left: 'center'
          },
          xAxis: {
            type: 'category',
            data: data.map(item => item.time),
            axisLabel: {
              rotate: 45
            }
          },
          yAxis: {
            type: 'value',
            name: '事件数',
            minInterval: 1
          },
          series: [{
            type: 'bar',
            data: data.map(item => item.value),
            itemStyle: {
              color: '#ff4d4f'
            }
          }]
        };

      case 'storage':
        return {
          ...baseOption,
          title: {
            text: '存储使用趋势',
            left: 'center'
          },
          xAxis: {
            type: 'category',
            data: data.map(item => item.time),
            axisLabel: {
              rotate: 45
            }
          },
          yAxis: {
            type: 'value',
            name: '使用率(%)',
            min: 0,
            max: 100
          },
          series: [{
            type: 'line',
            data: data.map(item => item.value),
            smooth: true,
            lineStyle: {
              width: 3
            },
            itemStyle: {
              color: '#1890ff'
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: 'rgba(24,144,255,0.3)'
                }, {
                  offset: 1,
                  color: 'rgba(24,144,255,0.1)'
                }]
              }
            }
          }]
        };
    }
  };

  // 渲染分析内容
  const renderAnalysisContent = () => {
    const data = generateAnalysisData(analysisType, analysisTimeRange);
    const option = getChartOption(analysisType, data);

    return (
      <div>
        <div style={{ marginBottom: 16, textAlign: 'center' }}>
          <Space>
            <Segmented
              value={analysisType}
              onChange={value => setAnalysisType(value as typeof analysisType)}
              options={[
                { label: '报警事件', value: 'alarms' },
                { label: '存储使用', value: 'storage' }
              ]}
            />
            <Segmented
              value={analysisTimeRange}
              onChange={value => setAnalysisTimeRange(value as typeof analysisTimeRange)}
              options={[
                { label: '24小时', value: 'day' },
                { label: '7天', value: 'week' },
                { label: '30天', value: 'month' }
              ]}
            />
          </Space>
        </div>
        <ReactECharts option={option} style={{ height: 400 }} />
        {analysisType === 'alarms' && (
          <div style={{ marginTop: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="平均事件数"
                  value={Math.round(data.reduce((sum, item) => sum + item.value, 0) / data.length)}
                  precision={0}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="最高事件数"
                  value={Math.max(...data.map(item => item.value))}
                  precision={0}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="最低事件数"
                  value={Math.min(...data.map(item => item.value))}
                  precision={0}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
            </Row>
          </div>
        )}
      </div>
    );
  };

  // 修改数据分析按钮点击事件
  const handleDataAnalysis = () => {
    setAnalysisModalVisible(true);
  };

  // 修改表格分页配置
  const getCameraPaginationConfig = () => ({
    current: currentCameraPage,
    total: cameras.length,
    pageSize,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number, range: [number, number]) =>
      `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
    onChange: (page: number) => {
      setCurrentCameraPage(page);
    },
    onShowSizeChange: (_: number, size: number) => {
      setPageSize(size);
      setCurrentCameraPage(1); // 改变每页数量时重置到第一页
    },
    pageSizeOptions: ['10', '20', '50', '100'],
    size: 'default' as const,
    position: ['bottomRight'] as ("topLeft" | "topCenter" | "topRight" | "bottomLeft" | "bottomCenter" | "bottomRight")[],
    showLessItems: false, // 显示所有页码
    hideOnSinglePage: false, // 总是显示分页
    responsive: true
  });

  const getAlarmPaginationConfig = () => ({
    current: currentAlarmPage,
    total: alarmEvents.length,
    pageSize,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number, range: [number, number]) =>
      `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
    onChange: (page: number) => {
      setCurrentAlarmPage(page);
    },
    onShowSizeChange: (_: number, size: number) => {
      setPageSize(size);
      setCurrentAlarmPage(1); // 改变每页数量时重置到第一页
    },
    pageSizeOptions: ['10', '20', '50', '100'],
    size: 'default' as const,
    position: ['bottomRight'] as ("topLeft" | "topCenter" | "topRight" | "bottomLeft" | "bottomCenter" | "bottomRight")[],
    showLessItems: false, // 显示所有页码
    hideOnSinglePage: false, // 总是显示分页
    responsive: true
  });

  // 获取所有区域列表
  const getAreaList = () => {
    const areas = new Set<string>();
    cameras.forEach(camera => areas.add(camera.location.split('-')[0]));
    return Array.from(areas);
  };

  // 过滤摄像头列表
  const getFilteredCameras = () => {
    return cameras.filter(camera => {
      const matchSearch = searchText ? 
        camera.name.toLowerCase().includes(searchText.toLowerCase()) ||
        camera.location.toLowerCase().includes(searchText.toLowerCase()) : true;
      
      const matchStatus = statusFilter === 'all' ? true : camera.status === statusFilter;
      
      const matchArea = areaFilter === 'all' ? true : 
        camera.location.startsWith(areaFilter);

      return matchSearch && matchStatus && matchArea;
    });
  };

  // 获取当前页数据
  const getCurrentPageCameras = () => {
    const filteredData = getFilteredCameras();
    const startIndex = (currentCameraPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  };

  // const getCurrentPageAlarms = () => {
  //   const startIndex = (currentAlarmPage - 1) * pageSize;
  //   const endIndex = startIndex + pageSize;
  //   return filteredAlarms().slice(startIndex, endIndex);
  // };

  // 过滤报警
  const filteredAlarms = () => {
    return alarmEvents.filter(e => {
      const sevOk = alarmSeverityFilter === 'all' ? true : e.severity === alarmSeverityFilter;
      const stOk = alarmStatusFilter === 'all' ? true : e.status === alarmStatusFilter;
      const rangeOk = alarmRange ? (dayjs(e.timestamp).isAfter(alarmRange[0].startOf('day')) && dayjs(e.timestamp).isBefore(alarmRange[1].endOf('day'))) : true;
      return sevOk && stOk && rangeOk;
    });
  };

  // 渲染监控内容
  const renderMonitorContent = () => {
    if (videoError) {
      return (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff'
        }}>
          <Space direction="vertical" align="center">
            <ExclamationCircleOutlined style={{ fontSize: 32 }} />
            <Text style={{ color: '#fff' }}>视频加载失败</Text>
            <Button 
              type="primary" 
              onClick={() => {
                const video = document.querySelector('video');
                if (video) {
                  video.load();
                  setVideoError(false);
                }
              }}
            >
              重试
            </Button>
          </Space>
        </div>
      );
    }

    return (
      <>
        {selectedCamera?.isFireEscape ? (
          <img
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            src={process.env.PUBLIC_URL + '/images/monitor/gate.png'}
            alt="消防通道监控"
          />
        ) : selectedCamera?.status !== 'online' ? (
          <img
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            src={process.env.PUBLIC_URL + '/images/monitor/building.png'}
            alt="摄像头离线"
          />
        ) : (
          <video
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            src={process.env.PUBLIC_URL + (Number((selectedCamera?.id || '').replace(/\D/g, '')) % 2 === 0
              ? '/images/monitor/2.mp4'
              : '/images/monitor/1.mp4')}
            autoPlay
            loop
            muted
            onError={() => setVideoError(true)}
            controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
            disablePictureInPicture
            playsInline
          />
        )}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.2) 100%)'
        }} />
        <div style={{
          position: 'absolute',
          top: 16,
          left: 16,
          display: 'flex',
          alignItems: 'center',
          color: '#fff',
          textShadow: '0 0 2px rgba(0,0,0,0.5)'
        }}>
          <Space>
            <Badge status="processing" />
            <Text style={{ color: '#fff', fontSize: 12 }}>实时监控</Text>
            <Tag style={{ marginLeft: 8 }} color="blue">{selectedCamera?.resolution}</Tag>
            {selectedCamera?.isFireEscape && (
              <Tag color="red">消防监控</Tag>
            )}
          </Space>
        </div>
        <div style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          color: '#fff',
          textShadow: '0 0 2px rgba(0,0,0,0.5)'
        }}>
          <div>
            <div style={{ marginBottom: 4 }}>
              <Space>
                <EnvironmentOutlined />
                <span>{selectedCamera?.location}</span>
              </Space>
            </div>
            <Space split={<Divider type="vertical" style={{ borderColor: 'rgba(255,255,255,0.3)', margin: '0 8px' }} />}>
              <span style={{ fontSize: 12 }}>ID: {selectedCamera?.id}</span>
              <span style={{ fontSize: 12 }}>
                {selectedCamera?.motionDetection ? '移动检测已开启' : '移动检测已关闭'}
              </span>
              <span style={{ fontSize: 12 }}>
                存储: {selectedCamera?.storageUsage}%
              </span>
            </Space>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 20, fontFamily: 'monospace', marginBottom: 4 }}>
              {currentTime.format('HH:mm:ss')}
            </div>
            <div style={{ fontSize: 12 }}>
              {currentTime.format('YYYY-MM-DD')}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: 'linear-gradient(180deg, #f7f9fc 0%, #ffffff 100%)' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <SafetyOutlined style={{ marginRight: 8 }} />
          安全总览
        </Title>
        <Text type="secondary">
          监控酒店安防设备状态，管理摄像头系统和报警事件
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card style={{ borderRadius: 16, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
            <Statistic
              title="摄像头总数"
              value={cameras.length}
              prefix={<CameraOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: 16, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
            <Statistic
              title="在线设备"
              value={cameras.filter(c => c.status === 'online').length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: 16, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
            <Statistic
              title="活跃报警"
              value={alarmEvents.filter(a => a.status === 'active').length}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: 16, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
            <Statistic
              title="今日报警"
              value={alarmEvents.filter(a => dayjs(a.timestamp).isAfter(dayjs().startOf('day'))).length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 操作工具栏 */}
      <Card style={{ marginBottom: '24px', borderRadius: 16, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <Space wrap>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={loadData}
                loading={loading}
              >
                刷新状态
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
              {selectedItems.length > 0 && (
                <Button
                  type="default"
                  onClick={handleBatchOperation}
                >
                  批量操作 ({selectedItems.length})
                </Button>
              )}
            </Space>
          </Col>
          <Col>
            <Space wrap size="middle">
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 120 }}
                placeholder="状态筛选"
                suffixIcon={<FilterOutlined />}
              >
                <Option value="all">全部状态</Option>
                <Option value="online">在线</Option>
                <Option value="offline">离线</Option>
                <Option value="maintenance">维护中</Option>
              </Select>
              <Select
                value={areaFilter}
                onChange={setAreaFilter}
                style={{ width: 120 }}
                placeholder="区域筛选"
                suffixIcon={<FilterOutlined />}
              >
                <Option value="all">全部区域</Option>
                {getAreaList().map(area => (
                  <Option key={area} value={area}>{area}</Option>
                ))}
              </Select>
              <Search
                placeholder="搜索摄像头名称或位置"
                allowClear
                enterButton
                style={{ width: 250 }}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                onSearch={value => setSearchText(value)}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 主要内容区域 */}
      <Card style={{ borderRadius: 16, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="摄像头管理" key="cameras">
            <Table
              columns={cameraColumns}
              dataSource={getCurrentPageCameras()}
              rowKey="id"
              loading={loading}
              rowSelection={{
                selectedRowKeys: selectedItems,
                onChange: (selectedRowKeys: React.Key[]) => {
                  setSelectedItems(selectedRowKeys as string[]);
                }
              }}
              pagination={{
                ...getCameraPaginationConfig(),
                total: getFilteredCameras().length // 更新总数为过滤后的数量
              }}
              scroll={{ x: 'max-content' }}
              size="middle"
            />
          </TabPane>
          <TabPane tab="报警事件" key="alarms">
            <Space style={{ marginBottom: 16 }} wrap>
              <Select
                value={alarmSeverityFilter}
                style={{ width: 140 }}
                onChange={setAlarmSeverityFilter}
                placeholder="严重程度"
              >
                <Option value="all">全部严重度</Option>
                <Option value="low">低</Option>
                <Option value="medium">中</Option>
                <Option value="high">高</Option>
                <Option value="critical">紧急</Option>
              </Select>
              <Select
                value={alarmStatusFilter}
                style={{ width: 140 }}
                onChange={setAlarmStatusFilter}
                placeholder="状态"
              >
                <Option value="all">全部状态</Option>
                <Option value="active">活跃</Option>
                <Option value="acknowledged">已确认</Option>
                <Option value="resolved">已解决</Option>
              </Select>
              <RangePicker value={alarmRange} onChange={setAlarmRange} />
              <Button onClick={() => { setAlarmSeverityFilter('all'); setAlarmStatusFilter('all'); setAlarmRange(undefined); }}>重置</Button>
              <Button
                icon={<ExportOutlined />}
                onClick={() => {
                  const rows = filteredAlarms().map(e => [e.id, e.type, e.location, e.severity, e.status, e.timestamp, e.description].join(','));
                  const header = 'ID,类型,位置,严重度,状态,时间,描述';
                  const csv = [header, ...rows].join('\n');
                  const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url; link.download = '报警事件.csv'; link.click(); URL.revokeObjectURL(url);
                }}
              >导出CSV</Button>
            </Space>

            <Table
              columns={alarmColumns}
              dataSource={filteredAlarms().slice((currentAlarmPage-1)*pageSize, (currentAlarmPage-1)*pageSize+pageSize)}
              rowKey="id"
              loading={loading}
              pagination={getAlarmPaginationConfig()}
              scroll={{ x: 'max-content' }}
              size="middle"
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 报警处理弹窗 */}
      <Modal
        title="处理报警"
        open={processModalVisible}
        onCancel={() => setProcessModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={(v) => { message.success('已提交处理'); setProcessModalVisible(false); }} initialValues={{ status: 'acknowledged' }}>
          <Form.Item label="状态" name="status" rules={[{ required: true }]}>
            <Select>
              <Option value="acknowledged">已确认</Option>
              <Option value="resolved">已解决</Option>
            </Select>
          </Form.Item>
          <Form.Item label="责任人" name="owner">
            <Input placeholder="请输入责任人" />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea rows={3} placeholder="处理说明" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={() => setProcessModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">提交</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情模态框 */}
      <Modal
        title="设备详情"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedItem && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="设备名称" span={2}>
              {selectedItem.name}
            </Descriptions.Item>
            <Descriptions.Item label="位置">
              {selectedItem.location}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Badge
                status={getStatusColor(selectedItem.status) as any}
                text={getStatusText(selectedItem.status)}
              />
            </Descriptions.Item>
            {selectedItem.resolution && (
              <Descriptions.Item label="分辨率">
                {selectedItem.resolution}
              </Descriptions.Item>
            )}
            {selectedItem.accessType && (
              <Descriptions.Item label="访问方式">
                {selectedItem.accessType}
              </Descriptions.Item>
            )}
            {selectedItem.lastRecording && (
              <Descriptions.Item label="最后录制">
                {selectedItem.lastRecording}
              </Descriptions.Item>
            )}
            {selectedItem.lastAccess && (
              <Descriptions.Item label="最后访问">
                {selectedItem.lastAccess}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* 设置模态框 */}
      <Modal
        title="设备设置"
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
          <Form.Item label="设备名称">
            <Input placeholder="请输入设备名称" />
          </Form.Item>
          <Form.Item label="录制设置">
            <Select placeholder="请选择录制模式">
              <Select.Option value="continuous">连续录制</Select.Option>
              <Select.Option value="motion">移动检测录制</Select.Option>
              <Select.Option value="scheduled">定时录制</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="移动检测">
            <Select placeholder="请选择检测灵敏度">
              <Select.Option value="low">低</Select.Option>
              <Select.Option value="medium">中</Select.Option>
              <Select.Option value="high">高</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 添加数据分析模态框 */}
      <Modal
        title="安防系统数据分析"
        open={analysisModalVisible}
        onCancel={() => setAnalysisModalVisible(false)}
        footer={null}
        width={800}
        style={{ top: 100 }}
      >
        {renderAnalysisContent()}
      </Modal>

      {/* 修改视频播放模态框 */}
      <Modal
        title={
          <Space>
            <VideoCameraOutlined style={{ color: '#1890ff' }} />
            {selectedCamera?.name}
            <Tag color="blue">实时监控</Tag>
            {selectedCamera?.recording && (
              <Tag icon={<ClockCircleOutlined />} color="green">
                已录制 {dayjs(selectedCamera.lastRecording).fromNow()}
              </Tag>
            )}
            {selectedCamera?.isFireEscape && (
              <Tag color="red" icon={<AlertOutlined />}>消防重点区域</Tag>
            )}
          </Space>
        }
        open={videoModalVisible}
        onCancel={() => {
          setVideoModalVisible(false);
          setVideoError(false);
        }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <Button 
                icon={<CameraOutlined />}
                onClick={() => message.success('已截图保存')}
              >
                截图
              </Button>
              <Button 
                type="primary"
                danger={selectedCamera?.recording}
                icon={selectedCamera?.recording ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                onClick={() => {
                  const newCamera = { ...selectedCamera, recording: !selectedCamera?.recording };
                  setSelectedCamera(newCamera as SecurityCamera);
                }}
              >
                {selectedCamera?.recording ? '停止录制' : '开始录制'}
              </Button>
            </Space>
            <Button type="primary" icon={<FullscreenOutlined />}>
              全屏查看
            </Button>
          </div>
        }
        width={1000}
        style={{ top: 20 }}
        destroyOnClose
      >
        <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', backgroundColor: '#000' }}>
          {renderMonitorContent()}
        </div>
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={16}>
            <Card 
              size="small" 
              title={
                <Space>
                  <AlertOutlined />
                  实时状态
                </Space>
              }
              extra={
                <Tag color={selectedCamera?.status === 'online' ? 'success' : 'error'}>
                  {getStatusText(selectedCamera?.status || '')}
                </Tag>
              }
            >
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Statistic 
                    title="信号强度" 
                    value={98} 
                    suffix="%" 
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic 
                    title="码率" 
                    value={selectedCamera?.resolution === '4K' ? '8.3' : '2.1'} 
                    suffix="Mbps"
                  />
                </Col>
                <Col span={8}>
                  <Statistic 
                    title="延迟" 
                    value={32} 
                    suffix="ms"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={8}>
            <Card 
              size="small" 
              title={
                <Space>
                  <HistoryOutlined />
                  录制信息
                </Space>
              }
            >
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                <div>
                  <Text type="secondary">存储使用</Text>
                  <Progress
                    percent={selectedCamera?.storageUsage}
                    size="small"
                    status={selectedCamera?.storageUsage && selectedCamera.storageUsage > 80 ? 'exception' : 'normal'}
                    showInfo={false}
                  />
                </div>
                <div>
                  <Text type="secondary">最后录制</Text>
                  <div>
                    <Text>{selectedCamera?.lastRecording}</Text>
                  </div>
                </div>
                <div>
                  <Text type="secondary">移动检测</Text>
                  <div>
                    <Tag color={selectedCamera?.motionDetection ? 'green' : 'red'}>
                      {selectedCamera?.motionDetection ? '已启用' : '已禁用'}
                    </Tag>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default SecuritySystem; 