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
} from 'antd';
import {
  RobotOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  ReloadOutlined,
  SettingOutlined,
  EyeOutlined,
  PlusOutlined,
  ExportOutlined,
  LineChartOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ThunderboltOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import ReactECharts from 'echarts-for-react';
import { Segmented } from 'antd';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface CleaningRobot {
  id: string;
  name: string;
  model: string;
  status: 'idle' | 'working' | 'charging' | 'maintenance' | 'error';
  battery: number;
  currentTask: string;
  location: string;
  efficiency: number;
  totalDistance: number;
  totalTime: number;
  lastMaintenance: string;
  nextMaintenance: string;
  lastUpdate: string;
}

interface CleaningTask {
  id: string;
  robotId: string;
  robotName: string;
  area: string;
  taskType: 'daily' | 'deep' | 'spot';
  status: 'pending' | 'running' | 'completed' | 'cancelled';
  startTime: string;
  endTime?: string;
  duration?: number;
  progress: number;
  priority: 'low' | 'medium' | 'high';
}

interface AnalysisData {
  time: string;
  value: number;
  type?: string;
}

// 添加数值格式化函数
const formatNumber = (value: number, precision: number = 1) => {
  return Number(value.toFixed(precision));
};

// 添加区域配置
const AREAS = {
  public: ['大门', '前台区域', '电梯厅', '休息区', '走廊'],
  restaurant: ['中餐厅', '西餐厅', '咖啡厅', '酒吧', '宴会厅'],
  meeting: ['多功能厅', '会议室A', '会议室B', '会议室C', '商务中心'],
  facilities: ['健身房', 'SPA', '游泳池', '儿童乐园', '娱乐室'],
  rooms: Array.from({ length: 20 }, (_, i) => `${i + 1}层客房区`),
  service: ['员工餐厅', '员工休息室', '洗衣房', '储藏室', '设备间']
};

const CleaningRobot: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [robots, setRobots] = useState<CleaningRobot[]>([]);
  const [tasks, setTasks] = useState<CleaningTask[]>([]);
  const [selectedRobots, setSelectedRobots] = useState<string[]>([]);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [controlModalVisible, setControlModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState<CleaningRobot | null>(null);
  const [activeTab, setActiveTab] = useState('robots');
  const [analysisModalVisible, setAnalysisModalVisible] = useState(false);
  const [analysisTimeRange, setAnalysisTimeRange] = useState<'day' | 'week' | 'month'>('day');
  const [analysisType, setAnalysisType] = useState<'efficiency' | 'workload'>('efficiency');

  // 生成机器人数据
  const generateRobotData = (): CleaningRobot[] => {
    const robots: CleaningRobot[] = [];
    
    // 生成20台清洁机器人
    for (let i = 1; i <= 20; i++) {
      const id = i.toString().padStart(3, '0');
      const battery = Math.floor(30 + Math.random() * 70); // 30-100%
      const status = battery < 20 ? 'charging' :
                    Math.random() > 0.95 ? 'maintenance' :
                    Math.random() > 0.98 ? 'error' : 
                    Math.random() > 0.3 ? 'working' : 'idle';

      // 随机选择区域
      const areaTypes = Object.keys(AREAS);
      const randomAreaType = areaTypes[Math.floor(Math.random() * areaTypes.length)];
      const areaList = AREAS[randomAreaType as keyof typeof AREAS];
      const randomArea = areaList[Math.floor(Math.random() * areaList.length)];
      
      const efficiency = formatNumber(75 + Math.random() * 20); // 75-95%
      const totalDistance = formatNumber(50 + Math.random() * 150); // 50-200km
      const totalTime = formatNumber(20 + Math.random() * 80); // 20-100h
      
      // 生成维护日期
      const lastMaintenance = dayjs().subtract(Math.floor(Math.random() * 14), 'day').format('YYYY-MM-DD');
      const nextMaintenance = dayjs(lastMaintenance).add(15, 'day').format('YYYY-MM-DD');

      robots.push({
        id: `robot_${id}`,
        name: `清洁机器人-${id}`,
        model: Math.random() > 0.5 ? 'CR-3000' : 'CR-2000',
        status,
        battery,
        currentTask: status === 'working' ? `清洁${randomArea}` :
                    status === 'charging' ? '充电中' :
                    status === 'maintenance' ? '例行维护' :
                    status === 'error' ? '故障待处理' : '待机中',
        location: status === 'charging' ? '充电站' :
                 status === 'maintenance' ? '维修间' :
                 randomArea,
        efficiency,
        totalDistance,
        totalTime,
        lastMaintenance,
        nextMaintenance,
        lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss')
      });
    }

    return robots;
  };

  // 生成任务数据
  const generateTaskData = (robots: CleaningRobot[]): CleaningTask[] => {
    const tasks: CleaningTask[] = [];
    const taskTypes: ('daily' | 'deep' | 'spot')[] = ['daily', 'deep', 'spot'];
    const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];

    // 生成100个任务
    for (let i = 1; i <= 100; i++) {
      const id = i.toString().padStart(3, '0');
      const robot = robots[Math.floor(Math.random() * robots.length)];
      const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      
      // 生成随机时间（过去24小时内）
      const randomTime = dayjs().subtract(Math.random() * 24, 'hour');
      const startTime = randomTime.format('YYYY-MM-DD HH:mm:ss');
      
      // 根据任务类型设置持续时间
      let duration: number | undefined;
      let endTime: string | undefined;
      let progress: number;
      let status: 'pending' | 'running' | 'completed' | 'cancelled';

      if (randomTime.isAfter(dayjs())) {
        // 未来任务
        status = 'pending';
        progress = 0;
      } else {
        // 已开始的任务
        const timePassed = dayjs().diff(randomTime, 'minute');
        const totalDuration = taskType === 'daily' ? 60 : // 1小时
                            taskType === 'deep' ? 180 : // 3小时
                            30; // 30分钟（spot）
        
        progress = Math.min(100, Math.floor((timePassed / totalDuration) * 100));
        
        if (progress >= 100) {
          status = Math.random() > 0.9 ? 'cancelled' : 'completed';
          duration = totalDuration / 60; // 转换为小时
          endTime = dayjs(startTime).add(duration, 'hour').format('YYYY-MM-DD HH:mm:ss');
        } else {
          status = 'running';
        }
      }

      // 随机选择区域
      const areaTypes = Object.keys(AREAS);
      const randomAreaType = areaTypes[Math.floor(Math.random() * areaTypes.length)];
      const areaList = AREAS[randomAreaType as keyof typeof AREAS];
      const area = areaList[Math.floor(Math.random() * areaList.length)];

      tasks.push({
        id: `task_${id}`,
        robotId: robot.id,
        robotName: robot.name,
        area,
        taskType,
        status,
        startTime,
        endTime,
        duration,
        progress,
        priority
      });
    }

    // 按时间倒序排序
    return tasks.sort((a, b) => dayjs(b.startTime).valueOf() - dayjs(a.startTime).valueOf());
  };

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
        case 'efficiency':
          // 清洁效率随时间变化
          const baseEfficiency = 85;
          const hourEffect = Math.sin((time.hour() - 12) * Math.PI / 12) * 5; // 日间效率较高
          data.push({
            time: timeStr,
            value: formatNumber(baseEfficiency + hourEffect + Math.random() * 5)
          });
          break;

        case 'workload':
          // 工作负载分布
          const baseWorkload = 70;
          const dayEffect = Math.sin((time.hour() - 12) * Math.PI / 12) * 20; // 日间工作量较大
          data.push({
            time: timeStr,
            value: formatNumber(baseWorkload + dayEffect + Math.random() * 10)
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
        trigger: 'axis',
        formatter: '{b}: {c}%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      }
    };

    switch (type) {
      case 'efficiency':
        return {
          ...baseOption,
          title: {
            text: '清洁效率趋势',
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
            name: '效率(%)',
            min: 70,
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

      case 'workload':
        return {
          ...baseOption,
          title: {
            text: '工作负载分布',
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
            name: '负载(%)',
            min: 0,
            max: 100
          },
          series: [{
            type: 'bar',
            data: data.map(item => item.value),
            itemStyle: {
              color: '#52c41a'
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
                { label: '清洁效率', value: 'efficiency' },
                { label: '工作负载', value: 'workload' }
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
        {analysisType === 'efficiency' && (
          <div style={{ marginTop: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="平均效率"
                  value={formatNumber(data.reduce((sum, item) => sum + item.value, 0) / data.length)}
                  suffix="%"
                  precision={1}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="最高效率"
                  value={formatNumber(Math.max(...data.map(item => item.value)))}
                  suffix="%"
                  precision={1}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="最低效率"
                  value={formatNumber(Math.min(...data.map(item => item.value)))}
                  suffix="%"
                  precision={1}
                  valueStyle={{ color: '#ff4d4f' }}
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

  // 初始化数据
  useEffect(() => {
    const robotData = generateRobotData();
    const taskData = generateTaskData(robotData);
    
    setRobots(robotData);
    setTasks(taskData);

    // 设置定时器，每30秒更新一次数据
    const timer = setInterval(() => {
      const updatedRobots = robotData.map(robot => {
        // 更新电池电量
        let battery = robot.status === 'charging' ? 
                     Math.min(100, robot.battery + 2) : // 充电时每30秒+2%
                     Math.max(0, robot.battery - 0.5); // 工作时每30秒-0.5%
        
        // 更新状态
        let status = robot.status;
        if (battery < 20 && status !== 'charging') {
          status = 'charging';
        } else if (battery >= 95 && status === 'charging') {
          status = 'idle';
        }

        // 更新效率
        const efficiency = formatNumber(Math.max(75, Math.min(95, robot.efficiency + (Math.random() - 0.5) * 2)));
        
        // 更新总里程和工作时间
        const totalDistance = status === 'working' ? 
                            formatNumber(robot.totalDistance + 0.1) : // 每30秒+0.1km
                            robot.totalDistance;
        const totalTime = status === 'working' ? 
                         formatNumber(robot.totalTime + 0.5 / 60) : // 每30秒+0.5分钟
                         robot.totalTime;

        return {
          ...robot,
          battery,
          status,
          efficiency,
          totalDistance,
          totalTime,
          lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss')
        };
      });

      setRobots(updatedRobots);

      // 更新任务进度
      const updatedTasks = tasks.map(task => {
        if (task.status === 'running') {
          const progress = Math.min(100, task.progress + 2); // 每30秒+2%进度
          if (progress >= 100) {
            return {
              ...task,
              status: 'completed' as const,
              progress: 100,
              endTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              duration: dayjs().diff(task.startTime, 'hour', true)
            };
          }
          return { ...task, progress };
        }
        return task;
      });

      setTasks(updatedTasks);
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle':
      case 'completed':
        return 'green';
      case 'working':
      case 'running':
        return 'blue';
      case 'charging':
        return 'orange';
      case 'maintenance':
        return 'purple';
      case 'error':
      case 'cancelled':
        return 'red';
      case 'pending':
        return 'gold';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'idle':
      case 'completed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'working':
      case 'running':
        return <PlayCircleOutlined style={{ color: '#1890ff' }} />;
      case 'charging':
        return <ThunderboltOutlined style={{ color: '#faad14' }} />;
      case 'maintenance':
        return <SettingOutlined style={{ color: '#722ed1' }} />;
      case 'error':
      case 'cancelled':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'pending':
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'idle':
        return '待机';
      case 'working':
        return '工作中';
      case 'charging':
        return '充电中';
      case 'maintenance':
        return '维护中';
      case 'error':
        return '故障';
      case 'pending':
        return '等待中';
      case 'running':
        return '执行中';
      case 'completed':
        return '已完成';
      case 'cancelled':
        return '已取消';
      default:
        return '未知';
    }
  };

  const getTaskTypeText = (type: string) => {
    switch (type) {
      case 'daily':
        return '日常清洁';
      case 'deep':
        return '深度清洁';
      case 'spot':
        return '定点清洁';
      default:
        return '未知';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'default';
    }
  };

  const robotColumns = [
    {
      title: '机器人信息',
      key: 'info',
      render: (_: any, record: CleaningRobot) => (
        <Space>
          <Avatar size="large" icon={<RobotOutlined />} />
          <div>
            <div>
              <Text strong>{record.name}</Text>
              <Text code style={{ marginLeft: 8 }}>{record.model}</Text>
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
      title: '电池电量',
      dataIndex: 'battery',
      key: 'battery',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value < 20 ? '#ff4d4f' : value < 50 ? '#faad14' : '#52c41a'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '当前任务',
      dataIndex: 'currentTask',
      key: 'currentTask',
    },
    {
      title: '清洁效率',
      dataIndex: 'efficiency',
      key: 'efficiency',
      render: (value: number) => (
        <Text strong style={{ color: value > 90 ? '#52c41a' : value > 80 ? '#faad14' : '#ff4d4f' }}>
          {formatNumber(value, 1)}%
        </Text>
      ),
    },
    {
      title: '累计数据',
      key: 'stats',
      render: (_: any, record: CleaningRobot) => (
        <Space direction="vertical" size="small">
          <Text>距离: {formatNumber(record.totalDistance, 1)} km</Text>
          <Text>时间: {formatNumber(record.totalTime, 1)} h</Text>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: CleaningRobot) => (
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
            onClick={() => handleControl(record)}
          >
            控制
          </Button>
        </Space>
      ),
    },
  ];

  const taskColumns = [
    {
      title: '任务信息',
      key: 'info',
      render: (_: any, record: CleaningTask) => (
        <Space>
          <div>
            <div>
              <Text strong>{record.robotName}</Text>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.area} - {getTaskTypeText(record.taskType)}
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
        <Badge
          status={getStatusColor(status) as any}
          text={getStatusText(status)}
        />
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'}
        </Tag>
      ),
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (value: number) => (
        <Progress
          percent={value}
          size="small"
          strokeColor={value === 100 ? '#52c41a' : '#1890ff'}
        />
      ),
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: CleaningTask) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewTaskDetails(record)}
          >
            详情
          </Button>
          {record.status === 'pending' && (
            <Button
              type="link"
              size="small"
              danger
              onClick={() => handleCancelTask(record)}
            >
              取消
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleViewDetails = (record: CleaningRobot) => {
    setSelectedRobot(record);
    setDetailsModalVisible(true);
  };

  const handleControl = (record: CleaningRobot) => {
    setSelectedRobot(record);
    setControlModalVisible(true);
  };

  const handleViewTaskDetails = (record: CleaningTask) => {
    Modal.info({
      title: '任务详情',
      content: (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="机器人">{record.robotName}</Descriptions.Item>
          <Descriptions.Item label="清洁区域">{record.area}</Descriptions.Item>
          <Descriptions.Item label="任务类型">{getTaskTypeText(record.taskType)}</Descriptions.Item>
          <Descriptions.Item label="状态">{getStatusText(record.status)}</Descriptions.Item>
          <Descriptions.Item label="优先级">{record.priority}</Descriptions.Item>
          <Descriptions.Item label="开始时间">{record.startTime}</Descriptions.Item>
          {record.endTime && <Descriptions.Item label="结束时间">{record.endTime}</Descriptions.Item>}
          {record.duration && <Descriptions.Item label="耗时">{record.duration} 小时</Descriptions.Item>}
        </Descriptions>
      ),
      width: 600,
    });
  };

  const handleCancelTask = (record: CleaningTask) => {
    Modal.confirm({
      title: '确认取消',
      content: `确定要取消任务 "${record.area}" 吗？`,
      onOk: () => {
        setTasks(tasks.map(task => 
          task.id === record.id ? { ...task, status: 'cancelled' } : task
        ));
        Modal.success({
          title: '取消成功',
          content: '任务已成功取消',
        });
      },
    });
  };

  const handleAddTask = () => {
    setTaskModalVisible(true);
  };

  const handleExport = () => {
    Modal.success({
      title: '导出成功',
      content: '清洁机器人数据已成功导出到Excel文件',
    });
  };

  const handleBatchOperation = () => {
    if (selectedRobots.length === 0) {
      Modal.warning({
        title: '提示',
        content: '请先选择要操作的机器人',
      });
      return;
    }
    Modal.info({
      title: '批量操作',
      content: `已选择 ${selectedRobots.length} 个机器人进行批量操作`,
    });
  };

  const robotRowSelection = {
    selectedRowKeys: selectedRobots,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRobots(selectedRowKeys as string[]);
    },
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <RobotOutlined style={{ marginRight: 8 }} />
          清洁机器人管理
        </Title>
        <Text type="secondary">
          管理酒店清洁机器人，监控运行状态和任务执行情况
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="机器人总数"
              value={robots.length}
              prefix={<RobotOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="工作中"
              value={robots.filter(item => item.status === 'working').length}
              prefix={<PlayCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="充电中"
              value={robots.filter(item => item.status === 'charging').length}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="故障数量"
              value={robots.filter(item => item.status === 'error').length}
              prefix={<ExclamationCircleOutlined />}
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
            icon={<PlusOutlined />}
            onClick={handleAddTask}
          >
            添加任务
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              const robotData = generateRobotData();
              const taskData = generateTaskData(robotData);
              setRobots(robotData);
              setTasks(taskData);
            }}
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
          {selectedRobots.length > 0 && (
            <Button
              type="default"
              onClick={handleBatchOperation}
            >
              批量操作 ({selectedRobots.length})
            </Button>
          )}
        </Space>
      </Card>

      {/* 主要内容区域 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="机器人状态" key="robots">
            <Table
              columns={robotColumns}
              dataSource={robots}
              rowKey="id"
              loading={loading}
              rowSelection={robotRowSelection}
              pagination={{
                total: robots.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          <TabPane tab="任务管理" key="tasks">
            <Table
              columns={taskColumns}
              dataSource={tasks}
              rowKey="id"
              loading={loading}
              pagination={{
                total: tasks.length,
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

      {/* 机器人详情模态框 */}
      <Modal
        title="机器人详情"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedRobot && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="机器人名称" span={2}>
              {selectedRobot.name}
            </Descriptions.Item>
            <Descriptions.Item label="型号">
              {selectedRobot.model}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Badge
                status={getStatusColor(selectedRobot.status) as any}
                text={getStatusText(selectedRobot.status)}
              />
            </Descriptions.Item>
            <Descriptions.Item label="当前位置">
              {selectedRobot.location}
            </Descriptions.Item>
            <Descriptions.Item label="当前任务">
              {selectedRobot.currentTask}
            </Descriptions.Item>
            <Descriptions.Item label="电池电量">
              <Progress
                percent={selectedRobot.battery}
                strokeColor={selectedRobot.battery < 20 ? '#ff4d4f' : selectedRobot.battery < 50 ? '#faad14' : '#52c41a'}
              />
            </Descriptions.Item>
            <Descriptions.Item label="清洁效率">
              {selectedRobot.efficiency}%
            </Descriptions.Item>
            <Descriptions.Item label="累计清洁距离">
              {formatNumber(selectedRobot.totalDistance, 1)} km
            </Descriptions.Item>
            <Descriptions.Item label="累计工作时间">
              {formatNumber(selectedRobot.totalTime, 1)} 小时
            </Descriptions.Item>
            <Descriptions.Item label="上次维护">
              {selectedRobot.lastMaintenance}
            </Descriptions.Item>
            <Descriptions.Item label="下次维护">
              {selectedRobot.nextMaintenance}
            </Descriptions.Item>
            <Descriptions.Item label="最后更新" span={2}>
              {selectedRobot.lastUpdate}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 机器人控制模态框 */}
      <Modal
        title="机器人控制"
        open={controlModalVisible}
        onCancel={() => setControlModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setControlModalVisible(false)}>
            取消
          </Button>,
        ]}
        width={500}
      >
        {selectedRobot && (
          <div>
            <Alert
              message={`当前控制: ${selectedRobot.name}`}
              description={`状态: ${getStatusText(selectedRobot.status)} | 位置: ${selectedRobot.location}`}
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" icon={<PlayCircleOutlined />} block>
                开始工作
              </Button>
              <Button icon={<PauseCircleOutlined />} block>
                暂停工作
              </Button>
              <Button icon={<StopOutlined />} block>
                停止工作
              </Button>
              <Button icon={<ThunderboltOutlined />} block>
                开始充电
              </Button>
              <Button icon={<SettingOutlined />} block>
                进入维护模式
              </Button>
            </Space>
          </div>
        )}
      </Modal>

      {/* 添加任务模态框 */}
      <Modal
        title="添加清洁任务"
        open={taskModalVisible}
        onCancel={() => setTaskModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setTaskModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary">
            创建任务
          </Button>,
        ]}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="选择机器人" required>
                <Select placeholder="请选择清洁机器人">
                  {robots.map(robot => (
                    <Select.Option key={robot.id} value={robot.id}>
                      {robot.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="清洁区域" required>
                <Select placeholder="请选择清洁区域">
                  {Object.entries(AREAS).map(([key, areas]) => (
                    <Select.OptGroup key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
                      {areas.map(area => (
                        <Select.Option key={area} value={area}>
                          {area}
                        </Select.Option>
                      ))}
                    </Select.OptGroup>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="任务类型" required>
                <Select placeholder="请选择任务类型">
                  <Select.Option value="daily">日常清洁</Select.Option>
                  <Select.Option value="deep">深度清洁</Select.Option>
                  <Select.Option value="spot">定点清洁</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="优先级" required>
                <Select placeholder="请选择优先级">
                  <Select.Option value="high">高</Select.Option>
                  <Select.Option value="medium">中</Select.Option>
                  <Select.Option value="low">低</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="计划时间">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="备注">
            <Input.TextArea rows={3} placeholder="请输入任务备注信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 添加数据分析模态框 */}
      <Modal
        title="清洁机器人数据分析"
        open={analysisModalVisible}
        onCancel={() => setAnalysisModalVisible(false)}
        footer={null}
        width={800}
        style={{ top: 100 }}
      >
        {renderAnalysisContent()}
      </Modal>
    </div>
  );
};

export default CleaningRobot; 