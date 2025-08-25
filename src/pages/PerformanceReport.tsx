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
  Rate,
} from 'antd';
import {
  TrophyOutlined,
  UserOutlined,
  TeamOutlined,
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
  StarOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  CalendarOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

interface EmployeePerformance {
  id: string;
  name: string;
  department: string;
  position: string;
  avatar: string;
  overallScore: number;
  attendance: number;
  efficiency: number;
  quality: number;
  teamwork: number;
  customerSatisfaction: number;
  monthlyTarget: number;
  actualAchievement: number;
  completionRate: number;
  lastMonthScore: number;
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'average' | 'poor';
}

interface DepartmentPerformance {
  id: string;
  name: string;
  manager: string;
  employeeCount: number;
  overallScore: number;
  attendance: number;
  efficiency: number;
  quality: number;
  customerSatisfaction: number;
  monthlyTarget: number;
  actualAchievement: number;
  completionRate: number;
  lastMonthScore: number;
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'average' | 'poor';
}

interface KPIIndicator {
  id: string;
  name: string;
  category: 'financial' | 'operational' | 'customer' | 'employee';
  target: number;
  actual: number;
  unit: string;
  completionRate: number;
  lastMonth: number;
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'average' | 'poor';
}

// 生成更真实的员工绩效数据
function generateEmployeePerformance(count: number): EmployeePerformance[] {
  const departments = [
    { name: '客房部', positions: ['客房经理', '楼层主管', '客房服务员', '布草员'] },
    { name: '餐饮部', positions: ['餐饮经理', '厨师长', '厨师', '服务员', '传菜员'] },
    { name: '前厅部', positions: ['前厅经理', '大门经理', '前台接待', '礼宾员', '行李员'] },
    { name: '工程部', positions: ['工程经理', '维修主管', '维修工程师', '空调技工', '电工'] },
    { name: '保安部', positions: ['保安经理', '保安队长', '保安员', '监控员'] },
    { name: '财务部', positions: ['财务经理', '会计主管', '会计', '出纳'] },
    { name: '人事部', positions: ['人事经理', '招聘主管', '培训专员', '人事专员'] },
    { name: '销售部', positions: ['销售经理', '销售主管', '销售代表', '客户经理'] },
    { name: '采购部', positions: ['采购经理', '采购主管', '采购员', '仓管员'] },
    { name: 'IT部', positions: ['IT经理', '系统工程师', '网络工程师', '技术支持'] }
  ];

  const employees: EmployeePerformance[] = [];
  const lastNames = ['张', '李', '王', '刘', '陈', '杨', '黄', '赵', '吴', '周', '徐', '孙', '马', '朱', '胡', '郭', '何', '高', '林', '郑'];
  const firstNames = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛', '明', '超', '秀兰', '霞', '平', '刚'];

  // 生成员工数据
  for (let i = 1; i <= count; i++) {
    // 随机选择部门和职位
    const department = departments[Math.floor(Math.random() * departments.length)];
    const position = department.positions[Math.floor(Math.random() * department.positions.length)];
    
    // 根据职位级别调整基础分数
    let baseScore = position.includes('经理') ? 90 : 
                   position.includes('主管') ? 85 :
                   position.includes('工程师') ? 82 : 75;
    
    // 添加随机波动
    const randomVariation = Math.random() * 10 - 5; // -5到5的随机波动
    const overallScore = Math.min(100, Math.max(60, Math.round(baseScore + randomVariation)));
    
    // 根据综合评分确定状态
    const status = overallScore >= 90 ? 'excellent' :
                  overallScore >= 80 ? 'good' :
                  overallScore >= 70 ? 'average' : 'poor';

    // 生成姓名
    const name = lastNames[Math.floor(Math.random() * lastNames.length)] + 
                firstNames[Math.floor(Math.random() * firstNames.length)];

    // 生成其他指标
    const attendance = Math.round(90 + Math.random() * 10); // 90-100
    const efficiency = Math.round(overallScore - 5 + Math.random() * 10);
    const quality = Math.round(overallScore - 3 + Math.random() * 6);
    const teamwork = Math.round(overallScore - 4 + Math.random() * 8);
    const customerSatisfaction = Math.round(overallScore - 2 + Math.random() * 4);
    
    // 计算目标完成情况
    const monthlyTarget = 100;
    const actualAchievement = Math.round(overallScore * 0.9 + Math.random() * 10);
    const completionRate = Math.round((actualAchievement / monthlyTarget) * 100);
    
    // 生成上月评分和趋势
    const lastMonthScore = Math.round(overallScore - 5 + Math.random() * 10);
    const trend = overallScore > lastMonthScore ? 'up' :
                 overallScore < lastMonthScore ? 'down' : 'stable';

    employees.push({
      id: i.toString().padStart(3, '0'),
      name,
      department: department.name,
      position,
      avatar: '',
      overallScore,
      attendance,
      efficiency,
      quality,
      teamwork,
      customerSatisfaction,
      monthlyTarget,
      actualAchievement,
      completionRate,
      lastMonthScore,
      trend,
      status
    });
  }

  return employees;
}

// 生成更真实的部门绩效数据
function generateDepartmentPerformance(employees: EmployeePerformance[]): DepartmentPerformance[] {
  const departments = new Map<string, EmployeePerformance[]>();
  
  // 按部门分组员工
  employees.forEach(emp => {
    if (!departments.has(emp.department)) {
      departments.set(emp.department, []);
    }
    departments.get(emp.department)?.push(emp);
  });

  const departmentPerformances: DepartmentPerformance[] = [];
  let id = 1;

  // 计算每个部门的绩效
  departments.forEach((deptEmployees, deptName) => {
    const avgOverallScore = Math.round(deptEmployees.reduce((sum, emp) => sum + emp.overallScore, 0) / deptEmployees.length);
    const avgAttendance = Math.round(deptEmployees.reduce((sum, emp) => sum + emp.attendance, 0) / deptEmployees.length);
    const avgEfficiency = Math.round(deptEmployees.reduce((sum, emp) => sum + emp.efficiency, 0) / deptEmployees.length);
    const avgQuality = Math.round(deptEmployees.reduce((sum, emp) => sum + emp.quality, 0) / deptEmployees.length);
    const avgCustomerSatisfaction = Math.round(deptEmployees.reduce((sum, emp) => sum + emp.customerSatisfaction, 0) / deptEmployees.length);
    
    // 计算部门目标完成情况
    const monthlyTarget = 100;
    const actualAchievement = Math.round(avgOverallScore * 0.9 + Math.random() * 10);
    const completionRate = Math.round((actualAchievement / monthlyTarget) * 100);
    
    // 生成上月评分和趋势
    const lastMonthScore = Math.round(avgOverallScore - 3 + Math.random() * 6);
    const trend = avgOverallScore > lastMonthScore ? 'up' :
                 avgOverallScore < lastMonthScore ? 'down' : 'stable';
    
    // 确定部门状态
    const status = avgOverallScore >= 90 ? 'excellent' :
                  avgOverallScore >= 80 ? 'good' :
                  avgOverallScore >= 70 ? 'average' : 'poor';

    departmentPerformances.push({
      id: id.toString(),
      name: deptName,
      manager: deptEmployees.find(emp => emp.position.includes('经理'))?.name || '待定',
      employeeCount: deptEmployees.length,
      overallScore: avgOverallScore,
      attendance: avgAttendance,
      efficiency: avgEfficiency,
      quality: avgQuality,
      customerSatisfaction: avgCustomerSatisfaction,
      monthlyTarget,
      actualAchievement,
      completionRate,
      lastMonthScore,
      trend,
      status
    });

    id++;
  });

  return departmentPerformances;
}

// 生成更真实的KPI指标数据
function generateKPIIndicators(): KPIIndicator[] {
  const indicators: KPIIndicator[] = [
    {
      id: '1',
      name: '客房入住率',
      category: 'operational',
      target: 85,
      actual: Math.round(80 + Math.random() * 10),
      unit: '%',
      completionRate: 0,
      lastMonth: Math.round(75 + Math.random() * 10),
      trend: 'up',
      status: 'good'
    },
    {
      id: '2',
      name: '平均房价',
      category: 'financial',
      target: 450,
      actual: Math.round(420 + Math.random() * 60),
      unit: '元',
      completionRate: 0,
      lastMonth: Math.round(400 + Math.random() * 50),
      trend: 'up',
      status: 'good'
    },
    {
      id: '3',
      name: '客户满意度',
      category: 'customer',
      target: 90,
      actual: Math.round(85 + Math.random() * 10),
      unit: '分',
      completionRate: 0,
      lastMonth: Math.round(80 + Math.random() * 10),
      trend: 'up',
      status: 'good'
    },
    {
      id: '4',
      name: '员工满意度',
      category: 'employee',
      target: 85,
      actual: Math.round(80 + Math.random() * 10),
      unit: '分',
      completionRate: 0,
      lastMonth: Math.round(75 + Math.random() * 10),
      trend: 'up',
      status: 'good'
    },
    {
      id: '5',
      name: '营业收入',
      category: 'financial',
      target: 1000000,
      actual: Math.round(900000 + Math.random() * 200000),
      unit: '元',
      completionRate: 0,
      lastMonth: Math.round(850000 + Math.random() * 150000),
      trend: 'up',
      status: 'good'
    },
    {
      id: '6',
      name: '成本控制率',
      category: 'financial',
      target: 75,
      actual: Math.round(70 + Math.random() * 10),
      unit: '%',
      completionRate: 0,
      lastMonth: Math.round(65 + Math.random() * 10),
      trend: 'up',
      status: 'good'
    },
    {
      id: '7',
      name: '设备完好率',
      category: 'operational',
      target: 95,
      actual: Math.round(90 + Math.random() * 8),
      unit: '%',
      completionRate: 0,
      lastMonth: Math.round(88 + Math.random() * 7),
      trend: 'up',
      status: 'good'
    },
    {
      id: '8',
      name: '培训完成率',
      category: 'employee',
      target: 100,
      actual: Math.round(85 + Math.random() * 15),
      unit: '%',
      completionRate: 0,
      lastMonth: Math.round(80 + Math.random() * 15),
      trend: 'up',
      status: 'good'
    },
    {
      id: '9',
      name: '投诉处理率',
      category: 'customer',
      target: 100,
      actual: Math.round(95 + Math.random() * 5),
      unit: '%',
      completionRate: 0,
      lastMonth: Math.round(93 + Math.random() * 5),
      trend: 'up',
      status: 'excellent'
    },
    {
      id: '10',
      name: '能源节约率',
      category: 'operational',
      target: 10,
      actual: Math.round(8 + Math.random() * 4),
      unit: '%',
      completionRate: 0,
      lastMonth: Math.round(7 + Math.random() * 3),
      trend: 'up',
      status: 'good'
    }
  ];

  // 计算完成率和状态
  indicators.forEach(indicator => {
    // 计算完成率
    indicator.completionRate = Math.round((indicator.actual / indicator.target) * 100);
    
    // 确定趋势
    indicator.trend = indicator.actual > indicator.lastMonth ? 'up' :
                     indicator.actual < indicator.lastMonth ? 'down' : 'stable';
    
    // 确定状态
    const completion = indicator.completionRate;
    indicator.status = completion >= 95 ? 'excellent' :
                      completion >= 85 ? 'good' :
                      completion >= 75 ? 'average' : 'poor';
  });

  return indicators;
}

const PerformanceReport: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<EmployeePerformance[]>([]);
  const [departments, setDepartments] = useState<DepartmentPerformance[]>([]);
  const [kpiIndicators, setKpiIndicators] = useState<KPIIndicator[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
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
    // 生成数据
    const employeeData = generateEmployeePerformance(100); // 生成100个员工数据
    const departmentData = generateDepartmentPerformance(employeeData);
    const kpiData = generateKPIIndicators();

    setEmployees(employeeData);
    setDepartments(departmentData);
    setKpiIndicators(kpiData);
      setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'green';
      case 'good':
        return 'blue';
      case 'average':
        return 'orange';
      case 'poor':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <StarOutlined style={{ color: '#52c41a' }} />;
      case 'good':
        return <CheckCircleOutlined style={{ color: '#1890ff' }} />;
      case 'average':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'poor':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      excellent: '优秀',
      good: '良好',
      average: '一般',
      poor: '较差',
    };
    return statusMap[status] || status;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <RiseOutlined style={{ color: '#52c41a' }} />;
      case 'down':
        return <FallOutlined style={{ color: '#ff4d4f' }} />;
      case 'stable':
        return <BarChartOutlined style={{ color: '#faad14' }} />;
      default:
        return <BarChartOutlined />;
    }
  };

  const getTrendText = (trend: string) => {
    const trendMap: { [key: string]: string } = {
      up: '上升',
      down: '下降',
      stable: '稳定',
    };
    return trendMap[trend] || trend;
  };

  const getCategoryText = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      financial: '财务指标',
      operational: '运营指标',
      customer: '客户指标',
      employee: '员工指标',
    };
    return categoryMap[category] || category;
  };

  const employeeColumns = [
    {
      title: '员工信息',
      key: 'info',
      render: (_: any, record: EmployeePerformance) => (
        <Space>
          <Avatar size="large" icon={<UserOutlined />} />
          <div>
            <div>
              <Text strong>{record.name}</Text>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.department} | {record.position}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '综合评分',
      dataIndex: 'overallScore',
      key: 'overallScore',
      render: (score: number) => (
        <Space>
          <Text strong style={{ fontSize: '16px' }}>{score}</Text>
          <Rate disabled defaultValue={Math.floor(score / 20)} />
        </Space>
      ),
    },
    {
      title: '出勤率',
      dataIndex: 'attendance',
      key: 'attendance',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 95 ? '#52c41a' : value > 90 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '工作效率',
      dataIndex: 'efficiency',
      key: 'efficiency',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 90 ? '#52c41a' : value > 80 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '客户满意度',
      dataIndex: 'customerSatisfaction',
      key: 'customerSatisfaction',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 90 ? '#52c41a' : value > 80 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '目标完成率',
      dataIndex: 'completionRate',
      key: 'completionRate',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 95 ? '#52c41a' : value > 85 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '趋势',
      dataIndex: 'trend',
      key: 'trend',
      render: (trend: string) => (
        <Space>
          {getTrendIcon(trend)}
          <Text>{getTrendText(trend)}</Text>
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
      render: (_: any, record: EmployeePerformance) => (
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

  const departmentColumns = [
    {
      title: '部门信息',
      key: 'info',
      render: (_: any, record: DepartmentPerformance) => (
        <Space>
          <Avatar size="large" icon={<TeamOutlined />} />
          <div>
            <div>
              <Text strong>{record.name}</Text>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.manager} | {record.employeeCount}人
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '综合评分',
      dataIndex: 'overallScore',
      key: 'overallScore',
      render: (score: number) => (
        <Space>
          <Text strong style={{ fontSize: '16px' }}>{score}</Text>
          <Rate disabled defaultValue={Math.floor(score / 20)} />
        </Space>
      ),
    },
    {
      title: '出勤率',
      dataIndex: 'attendance',
      key: 'attendance',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 95 ? '#52c41a' : value > 90 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '工作效率',
      dataIndex: 'efficiency',
      key: 'efficiency',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 90 ? '#52c41a' : value > 80 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '客户满意度',
      dataIndex: 'customerSatisfaction',
      key: 'customerSatisfaction',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 90 ? '#52c41a' : value > 80 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '目标完成率',
      dataIndex: 'completionRate',
      key: 'completionRate',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 95 ? '#52c41a' : value > 85 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '趋势',
      dataIndex: 'trend',
      key: 'trend',
      render: (trend: string) => (
        <Space>
          {getTrendIcon(trend)}
          <Text>{getTrendText(trend)}</Text>
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
      render: (_: any, record: DepartmentPerformance) => (
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

  const kpiColumns = [
    {
      title: '指标名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '指标类别',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag color="blue">{getCategoryText(category)}</Tag>,
    },
    {
      title: '目标值',
      dataIndex: 'target',
      key: 'target',
      render: (target: number, record: KPIIndicator) => (
        <Text>{target}{record.unit}</Text>
      ),
    },
    {
      title: '实际值',
      dataIndex: 'actual',
      key: 'actual',
      render: (actual: number, record: KPIIndicator) => (
        <Text>{actual}{record.unit}</Text>
      ),
    },
    {
      title: '完成率',
      dataIndex: 'completionRate',
      key: 'completionRate',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 95 ? '#52c41a' : value > 85 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '上月对比',
      key: 'comparison',
      render: (_: any, record: KPIIndicator) => {
        const diff = record.actual - record.lastMonth;
        const diffPercent = ((diff / record.lastMonth) * 100).toFixed(1);
        return (
          <Space>
            <Text>{record.lastMonth}{record.unit}</Text>
            <Text style={{ color: diff >= 0 ? '#52c41a' : '#ff4d4f' }}>
              {diff >= 0 ? '+' : ''}{diffPercent}%
            </Text>
          </Space>
        );
      },
    },
    {
      title: '趋势',
      dataIndex: 'trend',
      key: 'trend',
      render: (trend: string) => (
        <Space>
          {getTrendIcon(trend)}
          <Text>{getTrendText(trend)}</Text>
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
  ];

  const handleViewDetails = (record: any) => {
    setSelectedItem(record);
    setDetailsModalVisible(true);
  };

  const handleExport = () => {
    Modal.success({
      title: '导出成功',
      content: '绩效报告数据已成功导出到Excel文件',
    });
  };

  const rowSelection = {
    selectedRowKeys: selectedItems,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedItems(selectedRowKeys as string[]);
    },
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

  // 生成趋势图表配置
  const getTrendChartOption = () => {
    const dates = Array.from({ length: 30 }, (_, i) => {
      return dayjs().subtract(29 - i, 'days').format('MM-DD');
    });

    // 计算每天的平均分数
    const avgScores = dates.map(() => Math.round(70 + Math.random() * 20));
    const excellentRate = dates.map(() => Math.round(10 + Math.random() * 20));
    const satisfactionRate = dates.map(() => Math.round(80 + Math.random() * 15));

    return {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['平均绩效分', '优秀率', '满意度'],
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
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [
        {
          name: '平均绩效分',
          type: 'line',
          data: avgScores,
          smooth: true,
          lineStyle: {
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
        },
        {
          name: '优秀率',
          type: 'line',
          data: excellentRate,
          smooth: true,
          lineStyle: {
            color: '#52c41a'
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
                color: 'rgba(82,196,26,0.3)'
              }, {
                offset: 1,
                color: 'rgba(82,196,26,0.1)'
              }]
            }
          }
        },
        {
          name: '满意度',
          type: 'line',
          data: satisfactionRate,
          smooth: true,
          lineStyle: {
            color: '#fa8c16'
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

  // 生成部门对比图表配置
  const getDepartmentComparisonOption = () => {
    const departmentNames = departments.map(d => d.name);
    const overallScores = departments.map(d => d.overallScore);
    const attendanceRates = departments.map(d => d.attendance);
    const satisfactionRates = departments.map(d => d.customerSatisfaction);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['综合评分', '出勤率', '满意度'],
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
        data: departmentNames
      },
      series: [
        {
          name: '综合评分',
          type: 'bar',
          data: overallScores,
          itemStyle: {
            color: '#1890ff'
          }
        },
        {
          name: '出勤率',
          type: 'bar',
          data: attendanceRates,
          itemStyle: {
            color: '#52c41a'
          }
        },
        {
          name: '满意度',
          type: 'bar',
          data: satisfactionRates,
          itemStyle: {
            color: '#fa8c16'
          }
        }
      ]
    };
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <TrophyOutlined style={{ marginRight: 8 }} />
          绩效报告
        </Title>
        <Text type="secondary">
          分析员工和部门绩效表现，监控KPI指标完成情况
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="员工总数"
              value={employees.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="优秀员工"
              value={employees.filter(e => e.status === 'excellent').length}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="部门数量"
              value={departments.length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均绩效分"
              value={Math.round(employees.reduce((sum, e) => sum + e.overallScore, 0) / employees.length)}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#fa8c16' }}
              suffix="分"
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
          <TabPane tab="综合概览" key="overview">
            <Row gutter={16}>
              <Col span={12}>
                <Card title="员工绩效排行" size="small">
                  <List
                    dataSource={employees.slice(0, 5)}
                    renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Badge count={index + 1} style={{ backgroundColor: index < 3 ? '#52c41a' : '#d9d9d9' }}>
                              <Avatar icon={<UserOutlined />} />
                            </Badge>
                          }
                          title={item.name}
                          description={`${item.department} | ${item.position}`}
                        />
                        <div>
                          <Text strong style={{ fontSize: '16px' }}>{item.overallScore}分</Text>
                          <Rate disabled defaultValue={Math.floor(item.overallScore / 20)} />
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="部门绩效排行" size="small">
                  <List
                    dataSource={departments.slice(0, 5)}
                    renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Badge count={index + 1} style={{ backgroundColor: index < 3 ? '#52c41a' : '#d9d9d9' }}>
                              <Avatar icon={<TeamOutlined />} />
                            </Badge>
                          }
                          title={item.name}
                          description={`${item.manager} | ${item.employeeCount}人`}
                        />
                        <div>
                          <Text strong style={{ fontSize: '16px' }}>{item.overallScore}分</Text>
                          <Rate disabled defaultValue={Math.floor(item.overallScore / 20)} />
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="员工绩效" key="employees">
            <Table
              columns={employeeColumns}
              dataSource={employees}
              rowKey="id"
              loading={loading}
              rowSelection={rowSelection}
              pagination={{
                total: employees.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          <TabPane tab="部门绩效" key="departments">
            <Table
              columns={departmentColumns}
              dataSource={departments}
              rowKey="id"
              loading={loading}
              pagination={{
                total: departments.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          <TabPane tab="KPI指标" key="kpi">
            <Table
              columns={kpiColumns}
              dataSource={kpiIndicators}
              rowKey="id"
              loading={loading}
              pagination={{
                total: kpiIndicators.length,
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
        title="绩效详情"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedItem && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="姓名/部门" span={2}>
              {selectedItem.name}
            </Descriptions.Item>
            <Descriptions.Item label="综合评分">
              <Space>
                <Text strong style={{ fontSize: '18px' }}>{selectedItem.overallScore}</Text>
                <Rate disabled defaultValue={Math.floor(selectedItem.overallScore / 20)} />
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Badge
                status={getStatusColor(selectedItem.status) as any}
                text={getStatusText(selectedItem.status)}
              />
            </Descriptions.Item>
            <Descriptions.Item label="出勤率">
              <Progress percent={selectedItem.attendance} size="small" />
            </Descriptions.Item>
            <Descriptions.Item label="工作效率">
              <Progress percent={selectedItem.efficiency} size="small" />
            </Descriptions.Item>
            <Descriptions.Item label="工作质量">
              <Progress percent={selectedItem.quality} size="small" />
            </Descriptions.Item>
            <Descriptions.Item label="团队合作">
              <Progress percent={selectedItem.teamwork} size="small" />
            </Descriptions.Item>
            <Descriptions.Item label="客户满意度">
              <Progress percent={selectedItem.customerSatisfaction} size="small" />
            </Descriptions.Item>
            <Descriptions.Item label="目标完成率">
              <Progress percent={selectedItem.completionRate} size="small" />
            </Descriptions.Item>
            <Descriptions.Item label="上月评分">
              {selectedItem.lastMonthScore}
            </Descriptions.Item>
            <Descriptions.Item label="趋势">
              <Space>
                {getTrendIcon(selectedItem.trend)}
                <Text>{getTrendText(selectedItem.trend)}</Text>
              </Space>
            </Descriptions.Item>
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
            message="选择要查看的绩效数据时间范围"
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
        title="绩效趋势分析"
        open={trendModalVisible}
        onCancel={() => setTrendModalVisible(false)}
        width={1000}
        footer={null}
      >
        <Tabs defaultActiveKey="trend">
          <TabPane tab="整体趋势" key="trend">
            <Card>
              <ReactECharts option={getTrendChartOption()} style={{ height: 400 }} />
            </Card>
          </TabPane>
          <TabPane tab="部门对比" key="department">
            <Card>
              <ReactECharts option={getDepartmentComparisonOption()} style={{ height: 600 }} />
            </Card>
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default PerformanceReport; 