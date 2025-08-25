import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Button,
  Space,
  Statistic,
  Progress,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Timeline,
  Alert,
  Badge,
  Tooltip,
  Avatar,
  List,
  Typography,
  Divider,
  Switch,
  message,
  Descriptions,
  Steps,
  Tabs
} from 'antd';
import {
  RobotOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  BarsOutlined,
  WifiOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  HomeOutlined,
  CoffeeOutlined,
  GiftOutlined,
  SafetyOutlined,
  CompassOutlined,
  HistoryOutlined,
  StarOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  BellOutlined,
  NotificationOutlined,
  FilterOutlined,
  SearchOutlined,
  DownloadOutlined,
  UploadOutlined,
  CalendarOutlined,
  TeamOutlined,
  ToolOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  SyncOutlined,
  CloudOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  ScheduleOutlined,
  BulbOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined
} from '@ant-design/icons';
import { hotelDevices } from '../data/mockData';
import { Line, Column, Pie } from '@ant-design/plots';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface RobotTask {
  id: string;
  robotId: string;
  robotName: string;
  taskType: 'delivery' | 'pickup' | 'maintenance' | 'patrol';
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startLocation: string;
  destination: string;
  guestName?: string;
  roomNumber?: string;
  items: string[];
  estimatedTime: number; // 分钟
  actualTime?: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  operator: string;
  notes?: string;
}

interface RobotStatus {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'charging' | 'maintenance' | 'error';
  battery: number;
  signal: number;
  currentLocation: string;
  currentTask?: string;
  speed: number; // km/h
  temperature: number;
  lastUpdate: string;
  totalDeliveries: number;
  totalDistance: number; // km
  uptime: number; // 小时
  errorCode?: string;
  errorMessage?: string;
}

// 添加数值格式化函数
const formatNumber = (value: number, precision: number = 1) => {
  return Number(value.toFixed(precision));
};

const DeliveryRobot: React.FC = () => {
  const [robots, setRobots] = useState<RobotStatus[]>([]);
  const [tasks, setTasks] = useState<RobotTask[]>([]);
  const [selectedRobot, setSelectedRobot] = useState<RobotStatus | null>(null);
  const [selectedTask, setSelectedTask] = useState<RobotTask | null>(null);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [taskDetailModalVisible, setTaskDetailModalVisible] = useState(false);
  const [controlModalVisible, setControlModalVisible] = useState(false);
  const [taskForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [taskTypeFilter, setTaskTypeFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // 生成机器人数据
  const generateRobotData = (): RobotStatus[] => {
    const robots: RobotStatus[] = [];
    
    // 配送机器人 (20台)
    for (let i = 1; i <= 20; i++) {
      const id = i.toString().padStart(3, '0');
      const battery = Math.floor(30 + Math.random() * 70); // 30-100%
      const status = battery < 20 ? 'charging' :
                    Math.random() > 0.95 ? 'maintenance' :
                    Math.random() > 0.98 ? 'error' : 'online';
      
      robots.push({
        id: `robot_${id}`,
        name: `送餐机器人-${id}`,
        status,
        battery,
        signal: Math.floor(85 + Math.random() * 15), // 85-100%
        currentLocation: status === 'charging' ? '充电站' :
                       status === 'maintenance' ? '维修间' :
                       ['厨房', '餐厅', '大门', '电梯间', '走廊'][Math.floor(Math.random() * 5)],
        currentTask: status === 'online' && Math.random() > 0.3 ? 
                    `配送房间${(Math.floor(Math.random() * 20 + 1)).toString().padStart(2, '0')}${(Math.floor(Math.random() * 20 + 1)).toString().padStart(2, '0')}的${['早餐', '午餐', '晚餐', '夜宵', '下午茶'][Math.floor(Math.random() * 5)]}` : 
                    undefined,
        speed: status === 'online' ? formatNumber(1 + Math.random() * 2) : 0, // 1-3 km/h
        temperature: formatNumber(20 + Math.random() * 10), // 20-30°C
        lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        totalDeliveries: Math.floor(100 + Math.random() * 200), // 100-300次
        totalDistance: formatNumber(20 + Math.random() * 50), // 20-70km
        uptime: Math.floor(50 + Math.random() * 100), // 50-150小时
        errorCode: status === 'error' ? ['MOTOR_ERROR', 'SENSOR_ERROR', 'NAVIGATION_ERROR', 'COMMUNICATION_ERROR'][Math.floor(Math.random() * 4)] : undefined,
        errorMessage: status === 'error' ? ['左轮电机异常', '障碍物传感器异常', '导航系统异常', '通信模块异常'][Math.floor(Math.random() * 4)] : undefined
      });
    }

    return robots;
  };

  // 生成任务数据
  const generateTaskData = (robots: RobotStatus[]): RobotTask[] => {
    const tasks: RobotTask[] = [];
    const taskTypes: ('delivery' | 'pickup' | 'maintenance' | 'patrol')[] = ['delivery', 'pickup', 'maintenance', 'patrol'];
    const priorities: ('low' | 'medium' | 'high' | 'urgent')[] = ['low', 'medium', 'high', 'urgent'];
    const locations = ['厨房', '中餐厅', '西餐厅', '大门', '商务中心', '健身房', 'SPA', '员工餐厅'];
    const menuItems = {
      breakfast: ['早餐套餐A', '早餐套餐B', '牛奶', '咖啡', '面包', '水果'],
      lunch: ['商务套餐', '中式炒菜', '西式牛排', '海鲜套餐', '素食套餐'],
      dinner: ['烤鸭套餐', '粤式点心', '日式料理', '意大利面', '印度咖喱'],
      drinks: ['咖啡', '茶', '果汁', '气泡水', '红酒'],
      snacks: ['水果拼盘', '点心拼盘', '三明治', '沙拉', '小食拼盘']
    };

    // 生成100个任务
    for (let i = 1; i <= 100; i++) {
      const id = i.toString().padStart(3, '0');
      const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const robot = robots[Math.floor(Math.random() * robots.length)];
      const startLocation = locations[Math.floor(Math.random() * locations.length)];
      
      // 生成随机时间（过去24小时内）
      const randomTime = dayjs().subtract(Math.random() * 24, 'hour');
      const createdAt = randomTime.format('YYYY-MM-DD HH:mm:ss');
      const startedAt = Math.random() > 0.3 ? randomTime.add(Math.random() * 5, 'minute').format('YYYY-MM-DD HH:mm:ss') : undefined;
      const completedAt = startedAt && Math.random() > 0.5 ? dayjs(startedAt).add(Math.random() * 15, 'minute').format('YYYY-MM-DD HH:mm:ss') : undefined;

      // 生成房间号（1-20层，每层20间）
      const floor = Math.floor(Math.random() * 20 + 1);
      const room = Math.floor(Math.random() * 20 + 1);
      const roomNumber = `${floor.toString().padStart(2, '0')}${room.toString().padStart(2, '0')}`;

      // 根据任务类型生成不同的任务内容
      let taskItems: string[] = [];
      let destination = '';
      let status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';

      switch (taskType) {
        case 'delivery':
          const mealType = Math.random() > 0.5 ? 'lunch' : 'dinner';
          taskItems = Array(Math.floor(Math.random() * 3 + 1))
            .fill(0)
            .map(() => menuItems[mealType as keyof typeof menuItems][Math.floor(Math.random() * menuItems[mealType as keyof typeof menuItems].length)]);
          destination = `房间${roomNumber}`;
          break;
        case 'pickup':
          taskItems = ['餐具回收', '垃圾回收'];
          destination = '后厨回收站';
          break;
        case 'maintenance':
          taskItems = ['例行检查', '软件更新', '传感器校准', '电池检测'][Math.floor(Math.random() * 4)].split(',');
          destination = '维修间';
          break;
        case 'patrol':
          taskItems = ['安全巡检', '设备巡检', '环境监测'][Math.floor(Math.random() * 3)].split(',');
          destination = `${floor}层走廊`;
          break;
      }

      // 根据时间确定任务状态
      if (!startedAt) {
        status = 'pending';
      } else if (!completedAt) {
        status = 'in_progress';
      } else {
        status = Math.random() > 0.9 ? 'failed' : 
                Math.random() > 0.95 ? 'cancelled' : 
                'completed';
      }

      tasks.push({
        id: `task_${id}`,
        robotId: robot.id,
        robotName: robot.name,
        taskType,
        status,
        priority,
        startLocation,
        destination,
        guestName: taskType === 'delivery' ? ['张先生', '王女士', 'Mr. Smith', 'Ms. Johnson', '李先生'][Math.floor(Math.random() * 5)] : undefined,
        roomNumber: taskType === 'delivery' ? roomNumber : undefined,
        items: taskItems,
        estimatedTime: Math.floor(5 + Math.random() * 20), // 5-25分钟
        actualTime: completedAt ? Math.floor(3 + Math.random() * 30) : undefined,
        createdAt,
        startedAt,
        completedAt,
        operator: ['前台小王', '客房部李经理', '工程部张师傅', '餐饮部周经理', '系统管理员'][Math.floor(Math.random() * 5)],
        notes: Math.random() > 0.7 ? ['请尽快送达', '客人等待中', '需要特殊处理', '优先配送', '例行任务'][Math.floor(Math.random() * 5)] : undefined
      });
    }

    // 按时间倒序排序
    return tasks.sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf());
  };

  // 生成告警数据
  const generateAlertData = (robots: RobotStatus[]): any[] => {
    const alerts: any[] = [];
    const alertTypes = ['error', 'warning', 'info'];
    
    robots.forEach(robot => {
      if (robot.status === 'error') {
        alerts.push({
          id: `alert_${alerts.length + 1}`,
        type: 'error',
        title: '机器人故障',
          message: `${robot.name}发生故障：${robot.errorMessage}`,
          robotId: robot.id,
          timestamp: robot.lastUpdate,
        read: false
        });
      }
      
      if (robot.battery < 20) {
        alerts.push({
          id: `alert_${alerts.length + 1}`,
          type: 'warning',
          title: '电量低警告',
          message: `${robot.name}电量低于20%，建议及时充电`,
          robotId: robot.id,
          timestamp: robot.lastUpdate,
          read: Math.random() > 0.5
        });
      }

      if (robot.temperature > 28) {
        alerts.push({
          id: `alert_${alerts.length + 1}`,
          type: 'warning',
          title: '温度异常',
          message: `${robot.name}运行温度过高：${robot.temperature}°C`,
          robotId: robot.id,
          timestamp: robot.lastUpdate,
          read: Math.random() > 0.5
        });
      }
    });

    // 添加一些随机的系统通知
    const systemNotifications = [
      '系统例行维护通知',
      '软件版本更新提醒',
      '任务高峰期提醒',
      '设备保养提醒',
      '系统性能报告'
    ];

    for (let i = 0; i < 5; i++) {
      alerts.push({
        id: `alert_${alerts.length + 1}`,
        type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        title: systemNotifications[i],
        message: `系统${systemNotifications[i]}，请相关人员注意。`,
        timestamp: dayjs().subtract(Math.random() * 24, 'hour').format('YYYY-MM-DD HH:mm:ss'),
        read: Math.random() > 0.3
      });
    }

    // 按时间倒序排序
    return alerts.sort((a, b) => dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf());
  };

  // 模拟性能趋势数据
  const performanceTrendData = useMemo(() => {
    const now = new Date();
    const data = [];
    
    // 生成过去7天的数据
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
      
      data.push({
        date: dateStr,
        type: '配送次数',
        value: Math.floor(Math.random() * 50) + 20
      });
      
      data.push({
        date: dateStr,
        type: '运行时间',
        value: Math.floor(Math.random() * 8) + 4
      });
      
      data.push({
        date: dateStr,
        type: '平均效率',
        value: Math.floor(Math.random() * 3) + 1.5
      });
    }
    
    return data;
  }, []);

  // 图表配置
  const chartConfig = {
    theme: {
      colors10: ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#f5222d', '#13c2c2', '#eb2f96', '#faad14', '#a0d911', '#2f54eb']
    }
  };

  // 机器人性能对比数据
  const robotComparisonData = useMemo(() => {
    return robots.map(robot => ({
      robot: robot.name,
      deliveries: robot.totalDeliveries,
      distance: robot.totalDistance,
      efficiency: Math.round((robot.totalDeliveries / robot.uptime) * 100) / 100
    }));
  }, [robots]);

  // 任务类型分布数据
  const taskTypeDistributionData = useMemo(() => {
    const taskTypeStats = tasks.reduce((acc, task) => {
      acc[task.taskType] = (acc[task.taskType] || 0) + 1;
      return acc;
    }, {} as any);

    return Object.entries(taskTypeStats).map(([type, count]) => ({
      type: type === 'delivery' ? '配送' :
            type === 'pickup' ? '取餐' :
            type === 'maintenance' ? '维护' : '巡逻',
      value: count as number
    }));
  }, [tasks]);

  // 初始化数据
  useEffect(() => {
    const robotData = generateRobotData();
    const taskData = generateTaskData(robotData);
    const alertData = generateAlertData(robotData);
    
    setRobots(robotData);
    setTasks(taskData);
    setAlerts(alertData);

    // 设置定时器，每30秒更新一次数据
    const timer = setInterval(() => {
      const updatedRobots = robotData.map(robot => ({
        ...robot,
        battery: Math.max(0, Math.min(100, Math.floor(robot.battery + (Math.random() - 0.5) * 5))),
        signal: Math.max(0, Math.min(100, Math.floor(robot.signal + (Math.random() - 0.5) * 3))),
        temperature: formatNumber(Math.max(20, Math.min(35, robot.temperature + (Math.random() - 0.5) * 2))),
        speed: robot.status === 'online' ? formatNumber(1 + Math.random() * 2) : 0,
        lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }));
      setRobots(updatedRobots);
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  // 刷新状态
  const handleRefreshStatus = async () => {
    setLoading(true);
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      const robotData = generateRobotData();
      const taskData = generateTaskData(robotData);
      const alertData = generateAlertData(robotData);
      
      setRobots(robotData);
      setTasks(taskData);
      setAlerts(alertData);
      message.success('状态刷新成功');
    } catch (error) {
      message.error('状态刷新失败');
    } finally {
      setLoading(false);
    }
  };

  // 创建新任务
  const handleCreateTask = () => {
    setTaskModalVisible(true);
    taskForm.resetFields();
  };

  // 提交任务表单
  const handleTaskSubmit = async (values: any) => {
    try {
      const newTask: RobotTask = {
        id: `task_${Date.now()}`,
        robotId: values.robotId,
        robotName: robots.find(r => r.id === values.robotId)?.name || '',
        taskType: values.taskType,
        status: 'pending',
        priority: values.priority,
        startLocation: values.startLocation,
        destination: values.destination,
        guestName: values.guestName,
        roomNumber: values.roomNumber,
        items: values.items ? values.items.split(',').map((item: string) => item.trim()) : [],
        estimatedTime: values.estimatedTime,
        createdAt: new Date().toLocaleString('zh-CN'),
        operator: values.operator || '系统管理员'
      };

      setTasks(prev => [newTask, ...prev]);
      setTaskModalVisible(false);
      taskForm.resetFields();
      message.success('任务创建成功');
    } catch (error) {
      message.error('任务创建失败');
    }
  };

  // 取消任务
  const handleCancelTask = (taskId: string) => {
    Modal.confirm({
      title: '确认取消任务',
      content: '确定要取消这个任务吗？',
      onOk: () => {
        setTasks(prev => prev.map(task => 
          task.id === taskId ? { ...task, status: 'cancelled' } : task
        ));
        message.success('任务已取消');
      }
    });
  };

  // 机器人控制
  const handleRobotControl = (robot: RobotStatus) => {
    setSelectedRobot(robot);
    setControlModalVisible(true);
  };

  // 执行机器人控制操作
  const handleRobotAction = (action: string) => {
    if (!selectedRobot) return;
    
    const robotId = selectedRobot.id;
    setRobots(prev => prev.map(robot => {
      if (robot.id === robotId) {
        switch (action) {
          case 'start':
            return { ...robot, status: 'online', speed: 2.5 };
          case 'stop':
            return { ...robot, status: 'offline', speed: 0, currentTask: undefined };
          case 'charge':
            return { ...robot, status: 'charging', speed: 0, currentTask: undefined };
          case 'maintenance':
            return { ...robot, status: 'maintenance', speed: 0, currentTask: undefined };
          default:
            return robot;
        }
      }
      return robot;
    }));
    
    message.success(`机器人${action === 'start' ? '启动' : action === 'stop' ? '停止' : action === 'charge' ? '充电' : '维护'}成功`);
    setControlModalVisible(false);
  };

  // 批量操作
  const handleBatchOperation = (operation: string) => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要操作的机器人');
      return;
    }

    Modal.confirm({
      title: `确认${operation === 'start' ? '启动' : operation === 'stop' ? '停止' : '充电'}选中的机器人`,
      content: `确定要${operation === 'start' ? '启动' : operation === 'stop' ? '停止' : '充电'} ${selectedRowKeys.length} 个机器人吗？`,
      onOk: () => {
        setRobots(prev => prev.map(robot => {
          if (selectedRowKeys.includes(robot.id)) {
            switch (operation) {
              case 'start':
                return { ...robot, status: 'online', speed: 2.5 };
              case 'stop':
                return { ...robot, status: 'offline', speed: 0, currentTask: undefined };
              case 'charge':
                return { ...robot, status: 'charging', speed: 0, currentTask: undefined };
              default:
                return robot;
            }
          }
          return robot;
        }));
        setSelectedRowKeys([]);
        message.success(`批量${operation === 'start' ? '启动' : operation === 'stop' ? '停止' : '充电'}成功`);
      }
    });
  };

  // 导出数据
  const handleExportData = () => {
    const data = {
      robots: robots,
      tasks: tasks,
      exportTime: new Date().toLocaleString('zh-CN')
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `delivery_robot_data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    message.success('数据导出成功');
  };

  // 标记告警为已读
  const handleMarkAlertRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  // 获取统计数据
  const getAnalyticsData = () => {
    const today = new Date().toDateString();
    const todayTasks = tasks.filter(task => 
      new Date(task.createdAt).toDateString() === today
    );
    
    const taskTypeStats = tasks.reduce((acc, task) => {
      acc[task.taskType] = (acc[task.taskType] || 0) + 1;
      return acc;
    }, {} as any);

    const robotPerformance = robots.map(robot => ({
      name: robot.name,
      deliveries: robot.totalDeliveries,
      distance: robot.totalDistance,
      uptime: robot.uptime,
      efficiency: robot.totalDeliveries / robot.uptime
    }));

    return {
      todayTasks: todayTasks.length,
      taskTypeStats,
      robotPerformance,
      totalAlerts: alerts.filter(alert => !alert.read).length
    };
  };

  // 过滤数据
  const filteredRobots = robots.filter(robot => {
    const matchesSearch = robot.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         robot.currentLocation.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(robot.status);
    return matchesSearch && matchesStatus;
  });

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.robotName.toLowerCase().includes(searchText.toLowerCase()) ||
                         task.destination.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = taskTypeFilter.length === 0 || taskTypeFilter.includes(task.taskType);
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(task.status);
    return matchesSearch && matchesType && matchesStatus;
  });

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    const colors = {
      online: 'green',
      offline: 'red',
      charging: 'blue',
      maintenance: 'orange',
      error: 'red'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    const icons = {
      online: <CheckCircleOutlined />,
      offline: <ExclamationCircleOutlined />,
      charging: <BarsOutlined />,
      maintenance: <SettingOutlined />,
      error: <ExclamationCircleOutlined />
    };
    return icons[status as keyof typeof icons] || <LoadingOutlined />;
  };

  // 获取任务类型图标
  const getTaskTypeIcon = (type: string) => {
    const icons = {
      delivery: <CoffeeOutlined />,
      pickup: <GiftOutlined />,
      maintenance: <SettingOutlined />,
      patrol: <CompassOutlined />
    };
    return icons[type as keyof typeof icons] || <RobotOutlined />;
  };

  // 机器人状态表格列
  const robotColumns = [
    {
      title: '机器人',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: RobotStatus) => (
        <Space>
          <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>ID: {record.id}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: RobotStatus) => (
        <div>
          <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
            {status === 'online' ? '在线' :
             status === 'offline' ? '离线' :
             status === 'charging' ? '充电中' :
             status === 'maintenance' ? '维护中' : '故障'}
          </Tag>

        </div>
      ),
    },
    {
      title: '电量',
      dataIndex: 'battery',
      key: 'battery',
      render: (battery: number) => (
        <div>
          <Progress 
            percent={battery} 
            size="small" 
            strokeColor={battery > 20 ? '#52c41a' : '#ff4d4f'}
            showInfo={false}
          />
          <div style={{ fontSize: '12px', textAlign: 'center' }}>{battery}%</div>
        </div>
      ),
    },
    {
      title: '位置',
      dataIndex: 'currentLocation',
      key: 'currentLocation',
      render: (location: string) => (
        <Space>
          <EnvironmentOutlined style={{ color: '#1890ff' }} />
          {location}
        </Space>
      ),
    },
    {
      title: '速度',
      dataIndex: 'speed',
      key: 'speed',
      render: (speed: number) => (
        <Space>
          <ThunderboltOutlined style={{ color: '#fa8c16' }} />
          {formatNumber(speed, 1)} km/h
        </Space>
      ),
    },
    {
      title: '统计',
      key: 'statistics',
      render: (record: RobotStatus) => (
        <div style={{ fontSize: '12px' }}>
          <div>配送: {record.totalDeliveries}次</div>
          <div>里程: {record.totalDistance}km</div>
          <div>运行: {record.uptime}h</div>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (record: RobotStatus) => (
        <Space>
          <Tooltip title="查看详情">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedRobot(record);
                setDetailModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="控制">
            <Button
              type="link"
              size="small"
              icon={<SettingOutlined />}
              onClick={() => handleRobotControl(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 任务表格列
  const taskColumns = [
    {
      title: '任务ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '机器人',
      dataIndex: 'robotName',
      key: 'robotName',
      render: (name: string) => (
        <Space>
          <RobotOutlined />
          {name}
        </Space>
      ),
    },
    {
      title: '任务类型',
      dataIndex: 'taskType',
      key: 'taskType',
      render: (type: string, record: RobotTask) => (
        <Space>
          {getTaskTypeIcon(type)}
          {type === 'delivery' ? '配送' :
           type === 'pickup' ? '取餐' :
           type === 'maintenance' ? '维护' : '巡逻'}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          pending: { color: 'default', text: '待执行' },
          in_progress: { color: 'processing', text: '执行中' },
          completed: { color: 'success', text: '已完成' },
          failed: { color: 'error', text: '失败' },
          cancelled: { color: 'default', text: '已取消' }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '路径',
      key: 'route',
      render: (record: RobotTask) => (
        <div style={{ fontSize: '12px' }}>
          <div>{record.startLocation} → {record.destination}</div>
          {record.roomNumber && (
            <div style={{ color: '#666' }}>房间: {record.roomNumber}</div>
          )}
        </div>
      ),
    },
    {
      title: '时间',
      key: 'time',
      render: (record: RobotTask) => (
        <div style={{ fontSize: '12px' }}>
          <div>预计: {record.estimatedTime}分钟</div>
          {record.actualTime && (
            <div style={{ color: '#52c41a' }}>实际: {record.actualTime}分钟</div>
          )}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (record: RobotTask) => (
        <Space>
          <Tooltip title="查看详情">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedTask(record);
                setTaskDetailModalVisible(true);
              }}
            />
          </Tooltip>
          {record.status === 'pending' && (
            <Tooltip title="取消任务">
              <Button
                type="link"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleCancelTask(record.id)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  // 统计数据
  const totalRobots = robots.length;
  const onlineRobots = robots.filter(r => r.status === 'online').length;
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter(t => t.status === 'in_progress').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalDeliveries = robots.reduce((sum, r) => sum + r.totalDeliveries, 0);
  const totalDistance = Math.round(robots.reduce((sum, r) => sum + r.totalDistance, 0) * 10) / 10;

  return (
    <div style={{ padding: '0 16px' }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="机器人总数"
              value={totalRobots}
              prefix={<RobotOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="green">在线: {onlineRobots}</Tag>
              <Tag color="red">离线: {totalRobots - onlineRobots}</Tag>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃任务"
              value={activeTasks}
              prefix={<LoadingOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">总任务: {totalTasks}</Text>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总配送次数"
              value={totalDeliveries}
              prefix={<CoffeeOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">今日: {Math.floor(totalDeliveries * 0.15)}</Text>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总行驶里程"
              value={totalDistance}
              suffix="km"
              prefix={<CompassOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">平均: {Math.round((totalDistance / totalRobots) * 10) / 10}km</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 功能工具栏 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Space>
              <Input
                placeholder="搜索机器人或任务..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 250 }}
              />
              <Select
                mode="multiple"
                placeholder="状态筛选"
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 150 }}
                allowClear
              >
                <Option value="online">在线</Option>
                <Option value="offline">离线</Option>
                <Option value="charging">充电中</Option>
                <Option value="maintenance">维护中</Option>
                <Option value="error">故障</Option>
              </Select>
              <Select
                mode="multiple"
                placeholder="任务类型"
                value={taskTypeFilter}
                onChange={setTaskTypeFilter}
                style={{ width: 150 }}
                allowClear
              >
                <Option value="delivery">配送</Option>
                <Option value="pickup">取餐</Option>
                <Option value="maintenance">维护</Option>
                <Option value="patrol">巡逻</Option>
              </Select>
            </Space>
          </Col>
          <Col span={8}>
            <Space>
              <Button 
                type="primary" 
                icon={<BarChartOutlined />}
                onClick={() => setShowAnalytics(true)}
              >
                数据分析
              </Button>
              <Badge count={alerts.filter(alert => !alert.read).length}>
                <Button 
                  icon={<BellOutlined />}
                  onClick={() => setShowNotifications(true)}
                >
                  告警通知
                </Button>
              </Badge>
              <Button 
                icon={<SettingOutlined />}
                onClick={() => setShowSettings(true)}
              >
                系统设置
              </Button>
            </Space>
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Space>
              <Button 
                icon={<DownloadOutlined />}
                onClick={handleExportData}
              >
                导出数据
              </Button>
              <Button 
                icon={<SyncOutlined />}
                onClick={handleRefreshStatus}
                loading={loading}
              >
                刷新
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 快速性能概览 */}
      <Card title="性能概览" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={16}>
            <Line
              data={performanceTrendData.filter(item => item.type === '配送次数')}
              xField="date"
              yField="value"
              smooth
              height={200}
            />
          </Col>
          <Col span={8}>
            <div style={{ padding: '20px 0' }}>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">今日配送趋势</Text>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                  {performanceTrendData[performanceTrendData.length - 1]?.value || 0} 次
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">平均效率</Text>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                  {Math.round(robotComparisonData.reduce((sum, robot) => sum + robot.efficiency, 0) / robotComparisonData.length * 100) / 100} 次/小时
                </div>
              </div>
              <div>
                <Text type="secondary">系统状态</Text>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
                  {Math.round((onlineRobots / totalRobots) * 100)}% 在线
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 机器人状态表格 */}
      <Card 
        title={
          <Space>
            <RobotOutlined />
            <span>机器人状态监控</span>
          </Space>
        }
        extra={
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateTask}>
              添加任务
            </Button>
            {selectedRowKeys.length > 0 && (
              <>
                <Button 
                  icon={<PlayCircleOutlined />}
                  onClick={() => handleBatchOperation('start')}
                >
                  批量启动 ({selectedRowKeys.length})
                </Button>
                <Button 
                  icon={<PauseCircleOutlined />}
                  onClick={() => handleBatchOperation('stop')}
                >
                  批量停止 ({selectedRowKeys.length})
                </Button>
                <Button 
                  icon={<BarsOutlined />}
                  onClick={() => handleBatchOperation('charge')}
                >
                  批量充电 ({selectedRowKeys.length})
                </Button>
              </>
            )}
            <Button icon={<ReloadOutlined />} onClick={handleRefreshStatus} loading={loading}>
              刷新状态
            </Button>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Table
          columns={robotColumns}
          dataSource={filteredRobots}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          size="small"
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys as string[]),
          }}
        />
      </Card>

      {/* 任务管理 */}
      <Card 
        title={
          <Space>
            <HistoryOutlined />
            <span>任务管理</span>
          </Space>
        }
        extra={
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateTask}>
              新建任务
            </Button>
          </Space>
        }
      >
        <Table
          columns={taskColumns}
          dataSource={filteredTasks}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          size="small"
        />
      </Card>

      {/* 任务创建模态框 */}
      <Modal
        title="创建新任务"
        open={taskModalVisible}
        onCancel={() => setTaskModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={taskForm}
          layout="vertical"
          onFinish={handleTaskSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="robotId"
                label="选择机器人"
                rules={[{ required: true, message: '请选择机器人' }]}
              >
                <Select placeholder="选择机器人">
                  {robots.map(robot => (
                    <Option key={robot.id} value={robot.id}>
                      {robot.name} ({robot.status === 'online' ? '在线' : '离线'})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="taskType"
                label="任务类型"
                rules={[{ required: true, message: '请选择任务类型' }]}
              >
                <Select placeholder="选择任务类型">
                  <Option value="delivery">配送</Option>
                  <Option value="pickup">取餐</Option>
                  <Option value="maintenance">维护</Option>
                  <Option value="patrol">巡逻</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="优先级"
                rules={[{ required: true, message: '请选择优先级' }]}
              >
                <Select placeholder="选择优先级">
                  <Option value="low">低</Option>
                  <Option value="medium">中</Option>
                  <Option value="high">高</Option>
                  <Option value="urgent">紧急</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="estimatedTime"
                label="预计时间(分钟)"
                rules={[{ required: true, message: '请输入预计时间' }]}
              >
                <InputNumber min={1} max={120} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startLocation"
                label="起始位置"
                rules={[{ required: true, message: '请输入起始位置' }]}
              >
                <Input placeholder="如：厨房、大门" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="destination"
                label="目标位置"
                rules={[{ required: true, message: '请输入目标位置' }]}
              >
                <Input placeholder="如：房间0201、维修间" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="guestName"
                label="客人姓名"
              >
                <Input placeholder="客人姓名（可选）" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="roomNumber"
                label="房间号"
              >
                <Input placeholder="房间号，如：0101（可选）" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="items"
            label="配送物品"
          >
            <TextArea 
              placeholder="请输入配送物品，多个物品用逗号分隔（可选）"
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="operator"
            label="操作员"
          >
            <Input placeholder="操作员姓名（可选）" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                创建任务
              </Button>
              <Button onClick={() => setTaskModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 机器人详情模态框 */}
      <Modal
        title="机器人详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedRobot && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Card size="small" title="基本信息">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="机器人名称">{selectedRobot.name}</Descriptions.Item>
                    <Descriptions.Item label="机器人ID">{selectedRobot.id}</Descriptions.Item>
                    <Descriptions.Item label="当前状态">
                      <Tag color={getStatusColor(selectedRobot.status)}>
                        {selectedRobot.status === 'online' ? '在线' :
                         selectedRobot.status === 'offline' ? '离线' :
                         selectedRobot.status === 'charging' ? '充电中' :
                         selectedRobot.status === 'maintenance' ? '维护中' : '故障'}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="当前位置">{selectedRobot.currentLocation}</Descriptions.Item>
                    <Descriptions.Item label="当前任务">{selectedRobot.currentTask || '无'}</Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="运行状态">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Text>电池电量</Text>
                      <Progress 
                        percent={selectedRobot.battery} 
                        strokeColor={selectedRobot.battery > 20 ? '#52c41a' : '#ff4d4f'}
                        size="small"
                      />
                    </div>
                    <div>
                      <Text>信号强度</Text>
                      <Progress 
                        percent={selectedRobot.signal} 
                        strokeColor="#1890ff"
                        size="small"
                      />
                    </div>
                    <div>
                      <Text>运行温度</Text>
                      <Text strong style={{ color: selectedRobot.temperature > 30 ? '#ff4d4f' : '#52c41a' }}>
                        {selectedRobot.temperature}°C
                      </Text>
                    </div>
                    <div>
                      <Text>当前速度</Text>
                      <Text strong>{formatNumber(selectedRobot.speed, 1)} km/h</Text>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
            
            <Card size="small" title="运行统计" style={{ marginTop: 16 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic title="总配送次数" value={selectedRobot.totalDeliveries} />
                </Col>
                <Col span={8}>
                  <Statistic title="总行驶里程" value={selectedRobot.totalDistance} suffix="km" />
                </Col>
                <Col span={8}>
                  <Statistic title="运行时间" value={selectedRobot.uptime} suffix="小时" />
                </Col>
              </Row>
            </Card>

            {selectedRobot.errorCode && (
              <Alert
                message="故障信息"
                description={`错误代码: ${selectedRobot.errorCode} - ${selectedRobot.errorMessage}`}
                type="error"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}
          </div>
        )}
      </Modal>

      {/* 机器人控制模态框 */}
      <Modal
        title={`机器人控制 - ${selectedRobot?.name}`}
        open={controlModalVisible}
        onCancel={() => setControlModalVisible(false)}
        footer={null}
        width={500}
      >
        {selectedRobot && (
          <div>
            <Card size="small" title="当前状态" style={{ marginBottom: 16 }}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="状态">
                  <Tag color={getStatusColor(selectedRobot.status)}>
                    {selectedRobot.status === 'online' ? '在线' :
                     selectedRobot.status === 'offline' ? '离线' :
                     selectedRobot.status === 'charging' ? '充电中' :
                     selectedRobot.status === 'maintenance' ? '维护中' : '故障'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="电量">{selectedRobot.battery}%</Descriptions.Item>
                <Descriptions.Item label="位置">{selectedRobot.currentLocation}</Descriptions.Item>
                <Descriptions.Item label="当前任务">{selectedRobot.currentTask || '无'}</Descriptions.Item>
              </Descriptions>
            </Card>

            <Card size="small" title="控制操作">
              <Space direction="vertical" style={{ width: '100%' }}>
                {selectedRobot.status !== 'online' && (
                  <Button 
                    type="primary" 
                    icon={<PlayCircleOutlined />}
                    onClick={() => handleRobotAction('start')}
                    style={{ width: '100%' }}
                  >
                    启动机器人
                  </Button>
                )}
                
                {selectedRobot.status === 'online' && (
                  <Button 
                    danger 
                    icon={<PauseCircleOutlined />}
                    onClick={() => handleRobotAction('stop')}
                    style={{ width: '100%' }}
                  >
                    停止机器人
                  </Button>
                )}

                {selectedRobot.status !== 'charging' && (
                  <Button 
                    icon={<BarsOutlined />}
                    onClick={() => handleRobotAction('charge')}
                    style={{ width: '100%' }}
                  >
                    开始充电
                  </Button>
                )}

                {selectedRobot.status !== 'maintenance' && (
                  <Button 
                    icon={<SettingOutlined />}
                    onClick={() => handleRobotAction('maintenance')}
                    style={{ width: '100%' }}
                  >
                    进入维护模式
                  </Button>
                )}

                {selectedRobot.errorCode && (
                  <Alert
                    message="故障信息"
                    description={`${selectedRobot.errorCode}: ${selectedRobot.errorMessage}`}
                    type="error"
                    showIcon
                    style={{ marginTop: 16 }}
                  />
                )}
              </Space>
            </Card>
          </div>
        )}
      </Modal>

      {/* 数据分析模态框 */}
      <Modal
        title="数据分析"
        open={showAnalytics}
        onCancel={() => setShowAnalytics(false)}
        footer={null}
        width={1000}
      >
        {(() => {
          const analyticsData = getAnalyticsData();
          return (
            <div>
              <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="今日任务"
                      value={analyticsData.todayTasks}
                      prefix={<CalendarOutlined />}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="未读告警"
                      value={analyticsData.totalAlerts}
                      prefix={<BellOutlined />}
                      valueStyle={{ color: '#ff4d4f' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="平均效率"
                      value={Math.round(analyticsData.robotPerformance.reduce((sum, robot) => sum + robot.efficiency, 0) / analyticsData.robotPerformance.length * 100) / 100}
                      suffix="次/小时"
                      prefix={<TrophyOutlined />}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="在线率"
                      value={Math.round((onlineRobots / totalRobots) * 100)}
                      suffix="%"
                      prefix={<RiseOutlined />}
                      valueStyle={{ color: '#722ed1' }}
                    />
                  </Card>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Card title="任务类型分布" size="small">
                    <Pie
                      data={taskTypeDistributionData}
                      angleField="value"
                      colorField="type"
                      radius={0.8}
                      height={200}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="机器人性能对比" size="small">
                    <Column
                      data={robotComparisonData}
                      xField="robot"
                      yField="efficiency"
                      height={200}
                    />
                  </Card>
                </Col>
              </Row>

              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Card title="性能趋势分析" size="small">
                    <Line
                      data={performanceTrendData}
                      xField="date"
                      yField="value"
                      seriesField="type"
                      smooth
                      height={300}
                    />
                  </Card>
                </Col>
              </Row>

              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={12}>
                  <Card title="机器人性能排行" size="small">
                    <List
                      size="small"
                      dataSource={analyticsData.robotPerformance.sort((a, b) => b.efficiency - a.efficiency)}
                      renderItem={(robot, index) => (
                        <List.Item>
                          <Space>
                            <Badge count={index + 1} style={{ backgroundColor: index < 3 ? '#f5222d' : '#d9d9d9' }} />
                            <span>{robot.name}</span>
                            <span style={{ color: '#666' }}>
                              效率: {Math.round(robot.efficiency * 100) / 100} 次/小时
                            </span>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="关键指标" size="small">
                    <List
                      size="small"
                      dataSource={[
                        { label: '总配送次数', value: totalDeliveries, unit: '次' },
                        { label: '总行驶里程', value: totalDistance, unit: 'km' },
                        { label: '平均在线率', value: Math.round((onlineRobots / totalRobots) * 100), unit: '%' },
                        { label: '任务完成率', value: Math.round((completedTasks / totalTasks) * 100), unit: '%' },
                        { label: '平均响应时间', value: '3.2', unit: '分钟' },
                        { label: '系统可用性', value: '99.8', unit: '%' }
                      ]}
                      renderItem={(item) => (
                        <List.Item>
                          <Space>
                            <span>{item.label}:</span>
                            <Text strong style={{ color: '#1890ff' }}>
                              {item.value} {item.unit}
                            </Text>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          );
        })()}
      </Modal>

      {/* 告警通知模态框 */}
      <Modal
        title="告警通知"
        open={showNotifications}
        onCancel={() => setShowNotifications(false)}
        footer={null}
        width={600}
      >
        <List
          dataSource={alerts}
          renderItem={(alert) => (
            <List.Item
              actions={[
                !alert.read && (
                  <Button 
                    type="link" 
                    size="small"
                    onClick={() => handleMarkAlertRead(alert.id)}
                  >
                    标记已读
                  </Button>
                )
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Badge dot={!alert.read}>
                    <Avatar 
                      icon={
                        alert.type === 'error' ? <ExclamationCircleOutlined /> :
                        alert.type === 'warning' ? <WarningOutlined /> :
                        <InfoCircleOutlined />
                      }
                      style={{ 
                        backgroundColor: alert.type === 'error' ? '#ff4d4f' :
                                       alert.type === 'warning' ? '#fa8c16' : '#1890ff'
                      }}
                    />
                  </Badge>
                }
                title={
                  <Space>
                    <span>{alert.title}</span>
                    {!alert.read && <Tag color="red">新</Tag>}
                  </Space>
                }
                description={
                  <div>
                    <div>{alert.message}</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                      {alert.timestamp}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Modal>

      {/* 系统设置模态框 */}
      <Modal
        title="系统设置"
        open={showSettings}
        onCancel={() => setShowSettings(false)}
        footer={null}
        width={600}
      >
        <Tabs
          items={[
            {
              key: 'general',
              label: '常规设置',
              children: (
                <div>
                  <Form layout="vertical">
                    <Form.Item label="自动刷新间隔">
                      <Select defaultValue="30" style={{ width: 200 }}>
                        <Option value="10">10秒</Option>
                        <Option value="30">30秒</Option>
                        <Option value="60">1分钟</Option>
                        <Option value="300">5分钟</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item label="告警通知">
                      <Switch defaultChecked />
                    </Form.Item>
                    <Form.Item label="声音提醒">
                      <Switch defaultChecked />
                    </Form.Item>
                    <Form.Item label="邮件通知">
                      <Switch />
                    </Form.Item>
                  </Form>
                </div>
              )
            },
            {
              key: 'robot',
              label: '机器人设置',
              children: (
                <div>
                  <Form layout="vertical">
                    <Form.Item label="低电量阈值">
                      <InputNumber min={10} max={50} defaultValue={20} suffix="%" />
                    </Form.Item>
                    <Form.Item label="自动充电">
                      <Switch defaultChecked />
                    </Form.Item>
                    <Form.Item label="维护提醒">
                      <Switch defaultChecked />
                    </Form.Item>
                    <Form.Item label="最大速度">
                      <InputNumber min={1} max={10} defaultValue={3} suffix="km/h" />
                    </Form.Item>
                  </Form>
                </div>
              )
            },
            {
              key: 'task',
              label: '任务设置',
              children: (
                <div>
                  <Form layout="vertical">
                    <Form.Item label="任务超时时间">
                      <InputNumber min={5} max={60} defaultValue={15} suffix="分钟" />
                    </Form.Item>
                    <Form.Item label="自动重试">
                      <Switch defaultChecked />
                    </Form.Item>
                    <Form.Item label="重试次数">
                      <InputNumber min={1} max={5} defaultValue={3} />
                    </Form.Item>
                    <Form.Item label="优先级策略">
                      <Select defaultValue="fifo">
                        <Option value="fifo">先进先出</Option>
                        <Option value="priority">优先级优先</Option>
                        <Option value="distance">距离优先</Option>
                      </Select>
                    </Form.Item>
                  </Form>
                </div>
              )
            }
          ]}
        />
      </Modal>

      {/* 任务详情模态框 */}
      <Modal
        title="任务详情"
        open={taskDetailModalVisible}
        onCancel={() => setTaskDetailModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedTask && (
          <div>
            <Card size="small" title="基本信息">
              <Descriptions column={2} size="small">
                <Descriptions.Item label="任务ID">{selectedTask.id}</Descriptions.Item>
                <Descriptions.Item label="机器人">{selectedTask.robotName}</Descriptions.Item>
                <Descriptions.Item label="任务类型">
                  <Tag color={selectedTask.taskType === 'delivery' ? 'green' : 
                              selectedTask.taskType === 'pickup' ? 'blue' : 
                              selectedTask.taskType === 'maintenance' ? 'orange' : 'purple'}>
                    {selectedTask.taskType === 'delivery' ? '配送' :
                     selectedTask.taskType === 'pickup' ? '取餐' :
                     selectedTask.taskType === 'maintenance' ? '维护' : '巡逻'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag color={selectedTask.status === 'pending' ? 'default' :
                              selectedTask.status === 'in_progress' ? 'processing' :
                              selectedTask.status === 'completed' ? 'success' :
                              selectedTask.status === 'failed' ? 'error' : 'default'}>
                    {selectedTask.status === 'pending' ? '待执行' :
                     selectedTask.status === 'in_progress' ? '执行中' :
                     selectedTask.status === 'completed' ? '已完成' :
                     selectedTask.status === 'failed' ? '失败' : '已取消'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="优先级">
                  <Tag color={selectedTask.priority === 'urgent' ? 'red' :
                              selectedTask.priority === 'high' ? 'orange' :
                              selectedTask.priority === 'medium' ? 'blue' : 'green'}>
                    {selectedTask.priority === 'urgent' ? '紧急' :
                     selectedTask.priority === 'high' ? '高' :
                     selectedTask.priority === 'medium' ? '中' : '低'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="预计时间">{selectedTask.estimatedTime}分钟</Descriptions.Item>
              </Descriptions>
            </Card>

            <Card size="small" title="路径信息" style={{ marginTop: 16 }}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="起始位置">{selectedTask.startLocation}</Descriptions.Item>
                <Descriptions.Item label="目标位置">{selectedTask.destination}</Descriptions.Item>
                {selectedTask.guestName && (
                  <Descriptions.Item label="客人姓名">{selectedTask.guestName}</Descriptions.Item>
                )}
                {selectedTask.roomNumber && (
                  <Descriptions.Item label="房间号">{selectedTask.roomNumber}</Descriptions.Item>
                )}
              </Descriptions>
            </Card>

            {selectedTask.items.length > 0 && (
              <Card size="small" title="配送物品" style={{ marginTop: 16 }}>
                <List
                  size="small"
                  dataSource={selectedTask.items}
                  renderItem={(item, index) => (
                    <List.Item>
                      <Space>
                        <span>{index + 1}.</span>
                        <span>{item}</span>
                      </Space>
                    </List.Item>
                  )}
                />
              </Card>
            )}

            <Card size="small" title="时间信息" style={{ marginTop: 16 }}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="创建时间">{selectedTask.createdAt}</Descriptions.Item>
                {selectedTask.startedAt && (
                  <Descriptions.Item label="开始时间">{selectedTask.startedAt}</Descriptions.Item>
                )}
                {selectedTask.completedAt && (
                  <Descriptions.Item label="完成时间">{selectedTask.completedAt}</Descriptions.Item>
                )}
                {selectedTask.actualTime && (
                  <Descriptions.Item label="实际用时">{selectedTask.actualTime}分钟</Descriptions.Item>
                )}
                <Descriptions.Item label="操作员">{selectedTask.operator}</Descriptions.Item>
              </Descriptions>
            </Card>

            {selectedTask.notes && (
              <Card size="small" title="备注" style={{ marginTop: 16 }}>
                <Text>{selectedTask.notes}</Text>
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DeliveryRobot; 