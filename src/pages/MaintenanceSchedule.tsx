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
  Calendar,
  Typography,
  Divider,
  Tooltip,
  Badge,
  Tabs,
  List,
  Descriptions,
  Progress,
  Switch,
  message,
  Timeline,
  Steps,
  Avatar,
  InputNumber,
} from 'antd';
import {
  ToolOutlined,
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExportOutlined,
  ImportOutlined,
  SearchOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  SettingOutlined,
  SafetyOutlined,
  AlertOutlined,
  FileTextOutlined,
  TeamOutlined,
  StarOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import { pinyin } from 'pinyin-pro';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Step } = Steps;

interface MaintenancePlan {
  id: string;
  title: string;
  deviceType: string;
  deviceId: string;
  deviceName: string;
  maintenanceType: 'preventive' | 'corrective' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  estimatedDuration: number;
  assignedTechnician: string;
  description: string;
  parts: string[];
  cost: number;
  location: string;
}

interface MaintenanceRecord {
  id: string;
  planId: string;
  title: string;
  deviceName: string;
  technician: string;
  startTime: string;
  endTime: string;
  status: 'completed' | 'in_progress' | 'cancelled';
  actualDuration: number;
  description: string;
  findings: string;
  actions: string[];
  partsUsed: string[];
  cost: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}

interface Technician {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  status: 'available' | 'busy' | 'off_duty';
  currentTask?: string;
  completedTasks: number;
  rating: number;
}

// 设备类型配置
const DEVICE_TYPES = {
  HVAC: {
    name: 'HVAC系统',
    devices: [
      { name: '中央空调主机', maintenanceCycle: 30, baseCost: 1200 },
      { name: '新风系统', maintenanceCycle: 45, baseCost: 800 },
      { name: '冷却塔', maintenanceCycle: 60, baseCost: 1500 },
      { name: '风机盘管', maintenanceCycle: 90, baseCost: 300 }
    ]
  },
  Elevator: {
    name: '电梯系统',
    devices: [
      { name: '客用电梯', maintenanceCycle: 15, baseCost: 2000 },
      { name: '货梯', maintenanceCycle: 20, baseCost: 2500 },
      { name: 'VIP专用电梯', maintenanceCycle: 15, baseCost: 2200 }
    ]
  },
  FireSafety: {
    name: '消防系统',
    devices: [
      { name: '消防报警主机', maintenanceCycle: 30, baseCost: 1000 },
      { name: '喷淋系统', maintenanceCycle: 90, baseCost: 1500 },
      { name: '消防通道监控', maintenanceCycle: 60, baseCost: 500 }
    ]
  },
  Network: {
    name: '网络设备',
    devices: [
      { name: '核心交换机', maintenanceCycle: 45, baseCost: 800 },
      { name: '无线AP系统', maintenanceCycle: 60, baseCost: 400 },
      { name: '网络安全设备', maintenanceCycle: 30, baseCost: 600 }
    ]
  },
  Kitchen: {
    name: '厨房设备',
    devices: [
      { name: '商用冰箱', maintenanceCycle: 30, baseCost: 1000 },
      { name: '商用灶台', maintenanceCycle: 15, baseCost: 800 },
      { name: '排烟系统', maintenanceCycle: 20, baseCost: 1200 }
    ]
  },
  Security: {
    name: '安防系统',
    devices: [
      { name: '监控主机', maintenanceCycle: 45, baseCost: 1000 },
      { name: '门禁系统', maintenanceCycle: 60, baseCost: 800 },
      { name: '安防报警器', maintenanceCycle: 30, baseCost: 500 }
    ]
  }
};

// 技师专业配置
interface TechnicianSpecialty {
  name: string;
  count: { min: number; max: number };
  baseRating: number;
  positions: string[];
  baseSalary: { [key: string]: number };
  certifications: string[];
  skills: string[];
}

const TECHNICIAN_SPECIALTIES: TechnicianSpecialty[] = [
  { 
    name: 'HVAC系统', 
    count: { min: 3, max: 5 }, 
    baseRating: 4.5,
    positions: ['高级工程师', '工程师', '技术员'],
    baseSalary: { '高级工程师': 12000, '工程师': 8000, '技术员': 5000 },
    certifications: ['制冷工程师证', '暖通工程师证', '电气工程师证'],
    skills: ['中央空调维护', '新风系统调试', '制冷设备维修', '暖通控制系统']
  },
  { 
    name: '电梯维修', 
    count: { min: 2, max: 4 }, 
    baseRating: 4.6,
    positions: ['电梯高级工程师', '电梯工程师', '电梯维修员'],
    baseSalary: { '电梯高级工程师': 11000, '电梯工程师': 7500, '电梯维修员': 4800 },
    certifications: ['电梯安全管理证', '电梯维修资格证', '电工证'],
    skills: ['电梯故障诊断', '控制系统维护', '机械系统维修', '安全系统检测']
  },
  { 
    name: '消防系统', 
    count: { min: 2, max: 3 }, 
    baseRating: 4.7,
    positions: ['消防工程师', '消防设备管理员', '消防技术员'],
    baseSalary: { '消防工程师': 10000, '消防设备管理员': 7000, '消防技术员': 4500 },
    certifications: ['注册消防工程师证', '消防设施操作员证', '安全评估师证'],
    skills: ['消防系统检测', '火警系统维护', '喷淋系统调试', '消防设备维修']
  },
  { 
    name: '网络设备', 
    count: { min: 2, max: 3 }, 
    baseRating: 4.5,
    positions: ['网络工程师', '系统管理员', '网络技术员'],
    baseSalary: { '网络工程师': 11000, '系统管理员': 8000, '网络技术员': 5000 },
    certifications: ['网络工程师证', 'CCNA认证', '信息系统管理证'],
    skills: ['网络故障排查', '系统配置管理', '安全防护', '性能优化']
  },
  { 
    name: '厨房设备', 
    count: { min: 2, max: 4 }, 
    baseRating: 4.4,
    positions: ['厨房设备工程师', '设备维修师', '维护技术员'],
    baseSalary: { '厨房设备工程师': 9000, '设备维修师': 6500, '维护技术员': 4200 },
    certifications: ['特种设备作业证', '电气设备操作证', '燃气设备维修证'],
    skills: ['商用厨具维修', '制冷设备保养', '燃气系统维护', '排烟系统维护']
  },
  { 
    name: '安防系统', 
    count: { min: 2, max: 3 }, 
    baseRating: 4.6,
    positions: ['安防工程师', '监控系统管理员', '安防技术员'],
    baseSalary: { '安防工程师': 10000, '监控系统管理员': 7000, '安防技术员': 4500 },
    certifications: ['安防系统管理证', '监控系统操作证', '门禁系统维护证'],
    skills: ['监控系统维护', '门禁系统调试', '报警系统维修', '安防设备维护']
  }
];

// 生成更真实的维护计划数据
function generateMaintenancePlans(): MaintenancePlan[] {
  const plans: MaintenancePlan[] = [];
  let id = 1;
  const now = dayjs();

  // 为每种设备类型生成维护计划
  Object.entries(DEVICE_TYPES).forEach(([typeKey, typeConfig]) => {
    typeConfig.devices.forEach(device => {
      // 生成最近3个月的维护计划
      for (let i = -30; i <= 60; i += device.maintenanceCycle) {
        const scheduledDate = now.add(i, 'days');
        
        // 确定计划状态
        let status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
        if (i < 0) {
          status = Math.random() > 0.1 ? 'completed' : 'cancelled';
        } else if (i === 0) {
          status = 'in_progress';
        } else {
          status = 'pending';
        }

        // 确定维护类型和优先级
        const maintenanceType: 'preventive' | 'corrective' | 'emergency' =
          Math.random() > 0.9 ? 'emergency' :
          Math.random() > 0.7 ? 'corrective' : 'preventive';

        const priority: 'low' | 'medium' | 'high' | 'critical' =
          maintenanceType === 'emergency' ? 'critical' :
          maintenanceType === 'corrective' ? (Math.random() > 0.5 ? 'high' : 'medium') :
          Math.random() > 0.7 ? 'medium' : 'low';

        // 生成成本（基础成本±20%）
        const cost = Math.round(device.baseCost * (0.8 + Math.random() * 0.4));

        // 生成所需配件
        const parts = [
          '滤网', '传感器', '控制板', '电机', '轴承', '密封圈', '阀门',
          '继电器', '保险丝', '线缆', '开关', '压缩机', '风扇'
        ];
        const selectedParts = Array.from(new Set(
          Array(Math.floor(Math.random() * 3 + 2))
            .fill(0)
            .map(() => parts[Math.floor(Math.random() * parts.length)])
        ));

        plans.push({
          id: id.toString(),
          title: `${device.name}${maintenanceType === 'preventive' ? '定期维护' : maintenanceType === 'corrective' ? '故障维修' : '紧急维修'}`,
          deviceType: typeKey,
          deviceId: `${typeKey}-${Math.floor(Math.random() * 900 + 100)}`,
          deviceName: device.name,
          maintenanceType,
          priority,
          status,
          scheduledDate: scheduledDate.format('YYYY-MM-DD'),
          estimatedDuration: Math.floor(Math.random() * 4 + 2),
          assignedTechnician: '待分配',
          description: `${device.name}${maintenanceType === 'preventive' ? '定期维护检查' : maintenanceType === 'corrective' ? '故障检修维护' : '紧急故障维修'}，包括${selectedParts.join('、')}等部件的检查维护。`,
          parts: selectedParts,
          cost,
          location: ['设备间A', '设备间B', '设备间C', '楼顶机房', '地下室', '配电室'][Math.floor(Math.random() * 6)]
        });

        id++;
      }
    });
  });

  return plans.sort((a, b) => dayjs(a.scheduledDate).unix() - dayjs(b.scheduledDate).unix());
}

// 生成更真实的维护记录数据
function generateMaintenanceRecords(plans: MaintenancePlan[]): MaintenanceRecord[] {
  const records: MaintenanceRecord[] = [];
  let id = 1;

  // 获取所有已完成或已取消的计划
  const completedPlans = plans.filter(plan => plan.status === 'completed' || plan.status === 'cancelled');

  completedPlans.forEach(plan => {
    const startTime = dayjs(plan.scheduledDate).add(Math.floor(Math.random() * 8), 'hours');
    const actualDuration = plan.status === 'completed' ?
      plan.estimatedDuration * (0.8 + Math.random() * 0.4) :
      plan.estimatedDuration * Math.random();
    const endTime = startTime.add(actualDuration, 'hours');

    // 生成维护发现
    const findings = plan.status === 'completed' ?
      ['部件正常磨损', '需要调整参数', '建议更换配件', '性能略有下降', '运行状态良好']
        [Math.floor(Math.random() * 5)] :
      '维护取消，未进行检查';

    // 生成维护行动
    const actions = plan.status === 'completed' ?
      Array.from(new Set([
        '检查并清洁设备',
        '更换损耗部件',
        '调整运行参数',
        '测试功能',
        '记录维护数据'
      ].slice(0, Math.floor(Math.random() * 3 + 2)))) :
      ['维护取消'];

    // 生成使用的配件
    const partsUsed = plan.status === 'completed' ?
      plan.parts.filter(() => Math.random() > 0.5)
        .map(part => `${part} x${Math.floor(Math.random() * 2 + 1)}`) :
      [];

    records.push({
      id: id.toString(),
      planId: plan.id,
      title: plan.title,
      deviceName: plan.deviceName,
      technician: plan.assignedTechnician,
      startTime: startTime.format('YYYY-MM-DD HH:mm'),
      endTime: endTime.format('YYYY-MM-DD HH:mm'),
      status: plan.status === 'completed' ? 'completed' : 'cancelled',
      actualDuration,
      description: plan.description,
      findings,
      actions,
      partsUsed,
      cost: plan.status === 'completed' ? plan.cost : Math.round(plan.cost * 0.1),
      quality: plan.status === 'completed' ?
        (Math.random() > 0.7 ? 'excellent' :
         Math.random() > 0.4 ? 'good' :
         Math.random() > 0.1 ? 'fair' : 'poor') :
        'poor'
    });

    id++;
  });

  return records.sort((a, b) => dayjs(b.startTime).unix() - dayjs(a.startTime).unix());
}

// 生成更真实的技师数据
function generateTechnicians(): Technician[] {
  const technicians: Technician[] = [];
  let id = 1;

  // 常用姓氏和名字组合
  const lastNames = ['张', '李', '王', '刘', '陈', '杨', '黄', '赵', '吴', '周', '徐', '孙', '马', '朱', '胡', '郭', '何', '高', '林', '郑'];
  const firstNames = ['伟', '强', '军', '磊', '洋', '勇', '建国', '建军', '建华', '建平', '建设', '国强', '国华', '国平', '志强', '志国', '志华', '志平', '志明', '建明'];

  TECHNICIAN_SPECIALTIES.forEach(specialty => {
    // 为每个专业生成随机数量的技师
    const count = Math.floor(Math.random() * (specialty.count.max - specialty.count.min + 1)) + specialty.count.min;
    
    for (let i = 0; i < count; i++) {
      // 生成姓名
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const name = lastName + firstName;

      // 确定职位（高级职位数量较少）
      const position = specialty.positions[
        i === 0 ? 0 : // 确保至少有一个高级职位
        Math.random() > 0.7 ? 1 : // 30%概率是中级职位
        2 // 其余是初级职位
      ];

      // 生成工作年限（基于职位）
      const yearsOfExperience = position === specialty.positions[0] ? 
        Math.floor(Math.random() * 10 + 10) : // 高级 10-20年
        position === specialty.positions[1] ?
        Math.floor(Math.random() * 5 + 5) : // 中级 5-10年
        Math.floor(Math.random() * 3 + 2); // 初级 2-5年

      // 生成入职时间（基于工作年限，保证部分年限在本酒店）
      const hotelYears = Math.min(yearsOfExperience, Math.floor(Math.random() * 5 + 1));
      const joinDate = dayjs().subtract(hotelYears, 'year')
        .subtract(Math.floor(Math.random() * 11), 'month')
        .format('YYYY-MM-DD');

      // 生成状态和当前任务
      const status: 'available' | 'busy' | 'off_duty' =
        Math.random() > 0.8 ? 'off_duty' :
        Math.random() > 0.5 ? 'busy' : 'available';

      // 生成完成任务数（基于工作年限和职位）
      const tasksPerMonth = position === specialty.positions[0] ? 
        Math.floor(Math.random() * 5 + 15) : // 高级 15-20/月
        position === specialty.positions[1] ?
        Math.floor(Math.random() * 5 + 10) : // 中级 10-15/月
        Math.floor(Math.random() * 5 + 5); // 初级 5-10/月
      const completedTasks = hotelYears * 12 * tasksPerMonth;

      // 生成评分（基于经验和职位）
      const experienceBonus = yearsOfExperience * 0.02; // 每年经验加0.02分
      const positionBonus = position === specialty.positions[0] ? 0.3 :
                           position === specialty.positions[1] ? 0.2 : 0.1;
      const baseRating = specialty.baseRating + experienceBonus + positionBonus;
      const rating = Number(Math.min(5, Math.max(4, baseRating + (Math.random() * 0.4 - 0.2))).toFixed(1));

      // 生成认证（基于职位和经验）
      const certCount = position === specialty.positions[0] ? 3 :
                       position === specialty.positions[1] ? 2 : 1;
      const certifications = Array.from(new Set([
        ...specialty.certifications.slice(0, certCount)
      ]));

      // 生成技能（基于职位和经验）
      const skillCount = position === specialty.positions[0] ? 4 :
                        position === specialty.positions[1] ? 3 : 2;
      const skills = Array.from(new Set([
        ...specialty.skills.slice(0, skillCount)
      ]));

      // 生成工资（基于基础工资±10%）
      const baseSalary = specialty.baseSalary[position];
      const salary = Math.round(baseSalary * (0.9 + Math.random() * 0.2));

      technicians.push({
        id: id.toString(),
        name,
        specialty: specialty.name,
        position,
        yearsOfExperience,
        joinDate,
        phone: `1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        email: `${pinyin(lastName, { toneType: 'none' }).split(' ').join('')}${pinyin(firstName, { toneType: 'none' }).split(' ').join('')}${id}@hotel.com`,
        status,
        currentTask: status === 'busy' ? 
          ['设备维护', '故障维修', '定期检查', '设备调试', '系统升级'][Math.floor(Math.random() * 5)] : 
          undefined,
        completedTasks,
        rating,
        certifications,
        skills,
        salary
      });

      id++;
    }
  });

  return technicians;
}

// 更新 Technician 接口
interface Technician {
  id: string;
  name: string;
  specialty: string;
  position: string;
  yearsOfExperience: number;
  joinDate: string;
  phone: string;
  email: string;
  status: 'available' | 'busy' | 'off_duty';
  currentTask?: string;
  completedTasks: number;
  rating: number;
  certifications: string[];
  skills: string[];
  salary: number;
}

const MaintenanceSchedule: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [maintenancePlans, setMaintenancePlans] = useState<MaintenancePlan[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [addPlanModalVisible, setAddPlanModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [recordModalVisible, setRecordModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<MaintenancePlan | null>(null);
  const [activeTab, setActiveTab] = useState('plans');
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
  const [technicianModalVisible, setTechnicianModalVisible] = useState(false);
  const [editTechnicianModalVisible, setEditTechnicianModalVisible] = useState(false);
  const [currentTechnician, setCurrentTechnician] = useState<Technician | null>(null);
  const [recordDetailModalVisible, setRecordDetailModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<MaintenanceRecord | null>(null);
  const [selectedDeviceType, setSelectedDeviceType] = useState<string>('');
  const [selectedDevice, setSelectedDevice] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    const planData = generateMaintenancePlans();
    const technicianData = generateTechnicians();
    
    // 分配技师给维护计划
    const assignedPlans = planData.map(plan => {
      const deviceType = DEVICE_TYPES[plan.deviceType as keyof typeof DEVICE_TYPES];
      if (!deviceType) {
        return plan; // 如果找不到设备类型，保持原样
      }

      const availableTechs = technicianData.filter(tech => 
        tech.specialty === deviceType.name
      );

      // 如果没有找到匹配的技师，保持"待分配"状态
      if (availableTechs.length === 0) {
        return {
          ...plan,
          assignedTechnician: '待分配'
        };
      }

      return {
        ...plan,
        assignedTechnician: availableTechs[Math.floor(Math.random() * availableTechs.length)].name
      };
    });

    const recordData = generateMaintenanceRecords(assignedPlans);

    setMaintenancePlans(assignedPlans);
    setMaintenanceRecords(recordData);
    setTechnicians(technicianData);
      setLoading(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'blue';
      case 'medium':
        return 'orange';
      case 'high':
        return 'red';
      case 'critical':
        return 'purple';
      default:
        return 'default';
    }
  };

  const planColumns = [
    {
      title: '维护计划',
      key: 'plan',
      render: (_: any, record: MaintenancePlan) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong>{record.title}</Text>
            <Tag color="blue" style={{ marginLeft: 8 }}>{record.deviceType}</Tag>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            设备: {record.deviceName} ({record.deviceId})
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            位置: {record.location}
          </div>
        </Space>
      ),
    },
    {
      title: '类型/优先级',
      key: 'type_priority',
      render: (_: any, record: MaintenancePlan) => (
        <Space direction="vertical" size="small">
          <Tag color="blue">{getStatusText(record.maintenanceType)}</Tag>
          <Tag color={getPriorityColor(record.priority)}>
            {record.priority.toUpperCase()}
          </Tag>
        </Space>
      ),
    },
    {
      title: '状态',
      key: 'status',
      render: (_: any, record: MaintenancePlan) => (
        <Space direction="vertical" size="small">
          <Badge
            status={getStatusColor(record.status) as any}
            text={getStatusText(record.status)}
          />
          <div style={{ fontSize: '12px', color: '#666' }}>
            预计时长: {record.estimatedDuration}小时
          </div>
        </Space>
      ),
    },
    {
      title: '时间安排',
      key: 'schedule',
      render: (_: any, record: MaintenancePlan) => (
        <Space direction="vertical" size="small">
          <div>计划日期: {record.scheduledDate}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            负责人: {record.assignedTechnician}
          </div>
        </Space>
      ),
    },
    {
      title: '成本',
      key: 'cost',
      render: (_: any, record: MaintenancePlan) => (
        <Text strong style={{ color: '#1890ff' }}>
          ¥{record.cost.toLocaleString()}
        </Text>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: MaintenancePlan) => (
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
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            icon={<FileTextOutlined />}
            onClick={() => handleStartMaintenance(record)}
          >
            开始维护
          </Button>
        </Space>
      ),
    },
  ];

  const recordColumns = [
    {
      title: '维护记录',
      key: 'record',
      render: (_: any, record: MaintenanceRecord) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong>{record.title}</Text>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            设备: {record.deviceName}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            技师: {record.technician}
          </div>
        </Space>
      ),
    },
    {
      title: '执行时间',
      key: 'time',
      render: (_: any, record: MaintenanceRecord) => (
        <Space direction="vertical" size="small">
          <div>开始: {record.startTime}</div>
          <div>结束: {record.endTime}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            实际时长: {record.actualDuration.toFixed(1)}小时
          </div>
        </Space>
      ),
    },
    {
      title: '状态/质量',
      key: 'status_quality',
      render: (_: any, record: MaintenanceRecord) => (
        <Space direction="vertical" size="small">
          <Badge
            status={getStatusColor(record.status) as any}
            text={getStatusText(record.status)}
          />
          <div style={{ fontSize: '12px', color: '#666' }}>
            质量: {record.quality}
          </div>
        </Space>
      ),
    },
    {
      title: '成本',
      key: 'cost',
      render: (_: any, record: MaintenanceRecord) => (
        <Text strong style={{ color: '#1890ff' }}>
          ¥{record.cost.toLocaleString()}
        </Text>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: MaintenanceRecord) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewRecord(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<FileTextOutlined />}
            onClick={() => handleGenerateReport(record)}
          >
            生成报告
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewDetails = (record: MaintenancePlan) => {
    setCurrentPlan(record);
    setDetailsModalVisible(true);
  };

  const handleEdit = (record: MaintenancePlan) => {
    setCurrentPlan(record);
    setEditModalVisible(true);
  };

  const handleStartMaintenance = (record: MaintenancePlan) => {
    message.success(`开始执行维护计划: ${record.title}`);
  };

  const handleViewRecord = (record: MaintenanceRecord) => {
    setCurrentRecord(record);
    setRecordDetailModalVisible(true);
  };

  const handleGenerateReport = (record: MaintenanceRecord) => {
    message.success('维护报告生成成功');
  };

  // 处理技师详情查看
  const handleViewTechnician = (record: Technician) => {
    setCurrentTechnician(record);
    setTechnicianModalVisible(true);
  };

  // 处理技师信息编辑
  const handleEditTechnician = (record: Technician) => {
    setCurrentTechnician(record);
    setEditTechnicianModalVisible(true);
  };

  // 处理技师信息保存
  const handleSaveTechnician = (values: any) => {
    if (currentTechnician) {
      // 更新技师信息
      const updatedTechnicians = technicians.map(tech =>
        tech.id === currentTechnician.id ? { ...tech, ...values } : tech
      );
      setTechnicians(updatedTechnicians);
      message.success('技师信息更新成功');
      setEditTechnicianModalVisible(false);
    }
  };

  // 处理新增计划
  const handleAddPlan = (values: any) => {
    const newPlan: MaintenancePlan = {
      id: `plan${Date.now()}`,
      title: values.title,
      deviceType: selectedDeviceType,
      deviceId: values.deviceId,
      deviceName: DEVICE_TYPES[selectedDeviceType as keyof typeof DEVICE_TYPES]
        .devices.find(d => d.name === selectedDevice)?.name || '',
      maintenanceType: values.maintenanceType,
      priority: values.priority,
      status: 'pending',
      scheduledDate: dayjs(values.scheduledDate).format('YYYY-MM-DD'),
      estimatedDuration: values.estimatedDuration,
      assignedTechnician: values.assignedTechnician || '待分配',
      description: values.description,
      parts: values.parts || [],
      cost: values.cost,
      location: values.location
    };

    setMaintenancePlans([newPlan, ...maintenancePlans]);
    message.success('维护计划创建成功');
    setAddPlanModalVisible(false);
  };

  // 处理设备类型变更
  const handleDeviceTypeChange = (value: string) => {
    setSelectedDeviceType(value);
    setSelectedDevice('');
  };

  // 技师表格列配置
  const technicianColumns = [
    {
      title: '技师信息',
      key: 'info',
      render: (_: any, record: Technician) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div>
              <Text strong>{record.name}</Text>
              <Tag color="blue" style={{ marginLeft: 8 }}>{record.position}</Tag>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.specialty} | {record.yearsOfExperience}年经验
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '联系方式',
      key: 'contact',
      render: (_: any, record: Technician) => (
        <Space direction="vertical" size="small">
          <div>{record.phone}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.email}</div>
        </Space>
      ),
    },
    {
      title: '状态',
      key: 'status',
      render: (_: any, record: Technician) => (
        <Space direction="vertical" size="small">
          <Badge
            status={getStatusColor(record.status) as any}
            text={getStatusText(record.status)}
          />
          {record.currentTask && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              当前任务: {record.currentTask}
            </div>
          )}
        </Space>
      ),
    },
    {
      title: '技能认证',
      key: 'certifications',
      render: (_: any, record: Technician) => (
        <Space direction="vertical" size="small">
          <Space wrap>
            {record.certifications.map((cert, index) => (
              <Tag key={index} color="green">{cert}</Tag>
            ))}
          </Space>
          <Space wrap>
            {record.skills.map((skill, index) => (
              <Tag key={index} color="blue">{skill}</Tag>
            ))}
          </Space>
        </Space>
      ),
    },
    {
      title: '绩效',
      key: 'performance',
      render: (_: any, record: Technician) => (
        <Space direction="vertical" size="small">
          <div>入职时间: {record.joinDate}</div>
          <div>完成任务: {record.completedTasks}</div>
          <div>
            评分: <StarOutlined style={{ color: '#faad14' }} /> {record.rating}
          </div>
          <div>月薪: ¥{record.salary}</div>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Technician) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewTechnician(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditTechnician(record)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  // 状态颜色映射
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'in_progress':
        return 'blue';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      case 'available':
        return 'green';
      case 'busy':
        return 'orange';
      case 'off_duty':
        return 'default';
      default:
        return 'default';
    }
  };

  // 状态文本映射
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待执行';
      case 'in_progress':
        return '进行中';
      case 'completed':
        return '已完成';
      case 'cancelled':
        return '已取消';
      case 'preventive':
        return '预防性';
      case 'corrective':
        return '纠正性';
      case 'emergency':
        return '紧急';
      case 'available':
        return '可用';
      case 'busy':
        return '忙碌';
      case 'off_duty':
        return '休息';
      default:
        return '未知';
    }
  };

  const handleExport = () => {
    message.success('数据导出成功');
  };

  const handleImport = () => {
    message.info('数据导入功能开发中...');
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

  // 生成维护类型分布图表配置
  const getMaintenanceTypeDistributionOption = () => {
    const data = [
      { value: maintenancePlans.filter(p => p.maintenanceType === 'preventive').length, name: '预防性维护' },
      { value: maintenancePlans.filter(p => p.maintenanceType === 'corrective').length, name: '纠正性维护' },
      { value: maintenancePlans.filter(p => p.maintenanceType === 'emergency').length, name: '紧急维护' }
    ];

    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}个 ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle'
      },
      series: [
        {
          type: 'pie',
          radius: '70%',
          center: ['60%', '50%'],
          data: data,
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
  };

  // 生成维护完成情况图表配置
  const getMaintenanceCompletionOption = () => {
    const deviceTypes = Object.keys(DEVICE_TYPES);
    const completedCounts = deviceTypes.map(type =>
      maintenanceRecords.filter(r => r.status === 'completed' && 
        maintenancePlans.find(p => p.id === r.planId)?.deviceType === type).length
    );
    const cancelledCounts = deviceTypes.map(type =>
      maintenanceRecords.filter(r => r.status === 'cancelled' && 
        maintenancePlans.find(p => p.id === r.planId)?.deviceType === type).length
    );

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['已完成', '已取消'],
        top: 10
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        data: deviceTypes.map(type => DEVICE_TYPES[type as keyof typeof DEVICE_TYPES].name)
      },
      series: [
        {
          name: '已完成',
          type: 'bar',
          stack: 'total',
          label: {
            show: true
          },
          data: completedCounts,
          itemStyle: {
            color: '#52c41a'
          }
        },
        {
          name: '已取消',
          type: 'bar',
          stack: 'total',
          label: {
            show: true
          },
          data: cancelledCounts,
          itemStyle: {
            color: '#ff4d4f'
          }
        }
      ]
    };
  };

  // 统计数据
  const totalPlans = maintenancePlans.length;
  const pendingPlans = maintenancePlans.filter(plan => plan.status === 'pending').length;
  const inProgressPlans = maintenancePlans.filter(plan => plan.status === 'in_progress').length;
  const completedPlans = maintenancePlans.filter(plan => plan.status === 'completed').length;
  const totalCost = maintenancePlans.reduce((sum, plan) => sum + plan.cost, 0);
  const availableTechnicians = technicians.filter(tech => tech.status === 'available').length;

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <ToolOutlined style={{ marginRight: 8 }} />
        维护计划管理
      </Title>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="总维护计划"
              value={totalPlans}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="待执行"
              value={pendingPlans}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="进行中"
              value={inProgressPlans}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="已完成"
              value={completedPlans}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="预计总成本"
              value={totalCost}
              prefix="¥"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="可用技师"
              value={availableTechnicians}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 操作工具栏 */}
      <Card style={{ marginBottom: '24px' }}>
        <Space wrap>
          <Button
            type="primary"
            icon={<CalendarOutlined />}
            onClick={() => setAddPlanModalVisible(true)}
          >
                  新增计划
                </Button>
          <Button
            icon={<ExportOutlined />}
            onClick={handleExport}
          >
                  导出数据
                </Button>
          <Button
            icon={<ImportOutlined />}
            onClick={handleImport}
          >
                  导入数据
                </Button>
          <Button
            icon={<LineChartOutlined />}
            onClick={handleTrendAnalysis}
          >
            数据分析
          </Button>
          <Button
            icon={<SearchOutlined />}
          >
                  高级搜索
                </Button>
              </Space>
      </Card>

      {/* 主要内容 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="维护计划" key="plans">
            <Table
              columns={planColumns}
              dataSource={maintenancePlans}
              rowKey="id"
              loading={loading}
              pagination={{
                total: maintenancePlans.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          
          <TabPane tab="维护记录" key="records">
            <Table
              columns={recordColumns}
              dataSource={maintenanceRecords}
              rowKey="id"
              loading={loading}
              pagination={{
                total: maintenanceRecords.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>

          <TabPane tab="技师管理" key="technicians">
            <Table
              columns={technicianColumns}
              dataSource={technicians}
              rowKey="id"
              loading={loading}
              pagination={{
                total: technicians.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>

          <TabPane tab="维护日历" key="calendar">
            <Calendar
              fullscreen={false}
              headerRender={({ value, onChange }) => {
                const start = 0;
                const current = value.month();
                const months = [...Array(12)].map((_, i) => {
                  const month = (i + start) % 12;
                  return {
                    label: `${month + 1}月`,
                    value: month,
                  };
                });

                return (
                  <div style={{ padding: '8px 0' }}>
                    <Select
                      size="small"
                      dropdownMatchSelectWidth={false}
                      value={current}
                      style={{ width: 80 }}
                      onChange={(newMonth) => {
                        const now = value.clone().month(newMonth);
                        onChange(now);
                      }}
                    >
                      {months.map((month) => (
                        <Option key={month.value} value={month.value}>
                          {month.label}
                        </Option>
                      ))}
                    </Select>
                  </div>
                );
              }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 维护计划详情模态框 */}
      <Modal
        title="维护计划详情"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={700}
      >
        {currentPlan && (
          <div>
            <Descriptions column={2} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="计划标题">{currentPlan.title}</Descriptions.Item>
              <Descriptions.Item label="设备类型">{currentPlan.deviceType}</Descriptions.Item>
              <Descriptions.Item label="设备名称">{currentPlan.deviceName}</Descriptions.Item>
              <Descriptions.Item label="设备ID">{currentPlan.deviceId}</Descriptions.Item>
              <Descriptions.Item label="维护类型">
                <Tag color="blue">{getStatusText(currentPlan.maintenanceType)}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="优先级">
                <Tag color={getPriorityColor(currentPlan.priority)}>
                  {currentPlan.priority.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Badge
                  status={getStatusColor(currentPlan.status) as any}
                  text={getStatusText(currentPlan.status)}
                />
              </Descriptions.Item>
              <Descriptions.Item label="计划日期">{currentPlan.scheduledDate}</Descriptions.Item>
              <Descriptions.Item label="预计时长">{currentPlan.estimatedDuration}小时</Descriptions.Item>
              <Descriptions.Item label="负责人">{currentPlan.assignedTechnician}</Descriptions.Item>
              <Descriptions.Item label="位置">{currentPlan.location}</Descriptions.Item>
              <Descriptions.Item label="预计成本">¥{currentPlan.cost.toLocaleString()}</Descriptions.Item>
            </Descriptions>
            
            <Divider>维护描述</Divider>
            <Text>{currentPlan.description}</Text>
            
            <Divider>所需配件</Divider>
            <Space wrap>
              {currentPlan.parts.map((part, index) => (
                <Tag key={index} color="blue">{part}</Tag>
              ))}
            </Space>
          </div>
        )}
      </Modal>

      {/* 编辑维护计划模态框 */}
      <Modal
        title="编辑维护计划"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => {
          message.success('维护计划更新成功');
          setEditModalVisible(false);
        }}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="计划标题">
                <Input defaultValue={currentPlan?.title} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设备类型">
                <Select defaultValue={currentPlan?.deviceType}>
                  <Option value="HVAC">HVAC系统</Option>
                  <Option value="Elevator">电梯</Option>
                  <Option value="Fire Safety">消防系统</Option>
                  <Option value="Network">网络设备</Option>
                  <Option value="Kitchen">厨房设备</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="维护类型">
                <Select defaultValue={currentPlan?.maintenanceType}>
                  <Option value="preventive">预防性</Option>
                  <Option value="corrective">纠正性</Option>
                  <Option value="emergency">紧急</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="优先级">
                <Select defaultValue={currentPlan?.priority}>
                  <Option value="low">低</Option>
                  <Option value="medium">中</Option>
                  <Option value="high">高</Option>
                  <Option value="critical">紧急</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="计划日期">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="预计时长(小时)">
                <Input type="number" defaultValue={currentPlan?.estimatedDuration} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="维护描述">
            <Input.TextArea rows={3} defaultValue={currentPlan?.description} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 趋势分析模态框 */}
      <Modal
        title="维护数据分析"
        open={trendModalVisible}
        onCancel={() => setTrendModalVisible(false)}
        width={1000}
        footer={null}
      >
        <Tabs defaultActiveKey="type">
          <TabPane tab="维护类型分布" key="type">
            <Card>
              <ReactECharts option={getMaintenanceTypeDistributionOption()} style={{ height: 400 }} />
            </Card>
          </TabPane>
          <TabPane tab="维护完成情况" key="completion">
            <Card>
              <ReactECharts option={getMaintenanceCompletionOption()} style={{ height: 600 }} />
            </Card>
          </TabPane>
        </Tabs>
      </Modal>

      {/* 维护记录详情模态框 */}
      <Modal
        title="维护记录详情"
        open={recordDetailModalVisible}
        onCancel={() => setRecordDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setRecordDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {currentRecord && (
          <div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="维护计划">{currentRecord.title}</Descriptions.Item>
              <Descriptions.Item label="设备名称">{currentRecord.deviceName}</Descriptions.Item>
              <Descriptions.Item label="负责技师">{currentRecord.technician}</Descriptions.Item>
              <Descriptions.Item label="维护状态">
                <Badge
                  status={getStatusColor(currentRecord.status) as any}
                  text={getStatusText(currentRecord.status)}
                />
              </Descriptions.Item>
              <Descriptions.Item label="开始时间">{currentRecord.startTime}</Descriptions.Item>
              <Descriptions.Item label="结束时间">{currentRecord.endTime}</Descriptions.Item>
              <Descriptions.Item label="实际时长">{currentRecord.actualDuration}小时</Descriptions.Item>
              <Descriptions.Item label="维护质量">{currentRecord.quality}</Descriptions.Item>
              <Descriptions.Item label="维护成本">¥{currentRecord.cost}</Descriptions.Item>
            </Descriptions>

            <Divider>维护描述</Divider>
            <Text>{currentRecord.description}</Text>

            <Divider>维护发现</Divider>
            <Text>{currentRecord.findings}</Text>

            <Divider>维护行动</Divider>
            <Space wrap>
              {currentRecord.actions.map((action, index) => (
                <Tag key={index} color="blue">{action}</Tag>
              ))}
            </Space>

            <Divider>使用配件</Divider>
            <Space wrap>
              {currentRecord.partsUsed.map((part, index) => (
                <Tag key={index} color="green">{part}</Tag>
              ))}
            </Space>
          </div>
        )}
      </Modal>

      {/* 技师详情模态框 */}
      <Modal
        title="技师详情"
        open={technicianModalVisible}
        onCancel={() => setTechnicianModalVisible(false)}
        footer={[
          <Button key="edit" type="primary" onClick={() => {
            setTechnicianModalVisible(false);
            handleEditTechnician(currentTechnician!);
          }}>
            编辑信息
          </Button>,
          <Button key="close" onClick={() => setTechnicianModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {currentTechnician && (
          <div>
            <Row gutter={24}>
              <Col span={12}>
                <Card title="基本信息" size="small">
                  <Descriptions column={1}>
                    <Descriptions.Item label="姓名">
                      <Text strong>{currentTechnician.name}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="职位">
                      <Tag color="blue">{currentTechnician.position}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="专业">
                      {currentTechnician.specialty}
                    </Descriptions.Item>
                    <Descriptions.Item label="工作年限">
                      {currentTechnician.yearsOfExperience}年
                    </Descriptions.Item>
                    <Descriptions.Item label="入职时间">
                      {currentTechnician.joinDate}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="联系方式" size="small">
                  <Descriptions column={1}>
                    <Descriptions.Item label="手机">
                      {currentTechnician.phone}
                    </Descriptions.Item>
                    <Descriptions.Item label="邮箱">
                      {currentTechnician.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="状态">
                      <Badge
                        status={getStatusColor(currentTechnician.status) as any}
                        text={getStatusText(currentTechnician.status)}
                      />
                    </Descriptions.Item>
                    {currentTechnician.currentTask && (
                      <Descriptions.Item label="当前任务">
                        {currentTechnician.currentTask}
                      </Descriptions.Item>
                    )}
                  </Descriptions>
                </Card>
              </Col>
            </Row>

            <Card title="专业技能" size="small" style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">专业认证：</Text>
                <Space wrap>
                  {currentTechnician.certifications.map((cert, index) => (
                    <Tag key={index} color="green">{cert}</Tag>
                  ))}
                </Space>
              </div>
              <div>
                <Text type="secondary">技能：</Text>
                <Space wrap>
                  {currentTechnician.skills.map((skill, index) => (
                    <Tag key={index} color="blue">{skill}</Tag>
                  ))}
                </Space>
              </div>
            </Card>

            <Card title="绩效信息" size="small" style={{ marginTop: 16 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="完成任务"
                    value={currentTechnician.completedTasks}
                    suffix="个"
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="评分"
                    value={currentTechnician.rating}
                    prefix={<StarOutlined style={{ color: '#faad14' }} />}
                    suffix="/5.0"
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="月薪"
                    value={currentTechnician.salary}
                    prefix="¥"
                  />
                </Col>
              </Row>
            </Card>
          </div>
        )}
      </Modal>

      {/* 编辑技师信息模态框 */}
      <Modal
        title="编辑技师信息"
        open={editTechnicianModalVisible}
        onCancel={() => setEditTechnicianModalVisible(false)}
        onOk={() => {
          const form = document.querySelector('form');
          if (form) {
            form.dispatchEvent(new Event('submit', { cancelable: true }));
          }
        }}
        width={600}
      >
        {currentTechnician && (
          <Form
            layout="vertical"
            initialValues={currentTechnician}
            onFinish={handleSaveTechnician}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="姓名"
                  rules={[{ required: true, message: '请输入姓名' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="position"
                  label="职位"
                  rules={[{ required: true, message: '请选择职位' }]}
                >
                  <Select>
                    {TECHNICIAN_SPECIALTIES.find(s => s.name === currentTechnician.specialty)?.positions.map(pos => (
                      <Option key={pos} value={pos}>{pos}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="手机"
                  rules={[{ required: true, message: '请输入手机号' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="邮箱"
                  rules={[{ required: true, message: '请输入邮箱' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="yearsOfExperience"
                  label="工作年限"
                  rules={[{ required: true, message: '请输入工作年限' }]}
                >
                  <InputNumber min={0} max={50} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="salary"
                  label="月薪"
                  rules={[{ required: true, message: '请输入月薪' }]}
                >
                  <InputNumber
                    min={3000}
                    max={50000}
                    step={100}
                    style={{ width: '100%' }}
                    formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value: string | undefined) => {
                      const parsed = Number(value?.replace(/\¥\s?|(,*)/g, ''));
                      return isNaN(parsed) ? 3000 : parsed;
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="certifications"
              label="专业认证"
              rules={[{ required: true, message: '请选择专业认证' }]}
            >
              <Select mode="multiple">
                {TECHNICIAN_SPECIALTIES.find(s => s.name === currentTechnician.specialty)?.certifications.map(cert => (
                  <Option key={cert} value={cert}>{cert}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="skills"
              label="技能"
              rules={[{ required: true, message: '请选择技能' }]}
            >
              <Select mode="multiple">
                {TECHNICIAN_SPECIALTIES.find(s => s.name === currentTechnician.specialty)?.skills.map(skill => (
                  <Option key={skill} value={skill}>{skill}</Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* 新增计划模态框 */}
      <Modal
        title="新增维护计划"
        open={addPlanModalVisible}
        onCancel={() => setAddPlanModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          layout="vertical"
          onFinish={handleAddPlan}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="计划标题"
                rules={[{ required: true, message: '请输入计划标题' }]}
              >
                <Input placeholder="请输入计划标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="deviceType"
                label="设备类型"
                rules={[{ required: true, message: '请选择设备类型' }]}
              >
                <Select
                  placeholder="请选择设备类型"
                  onChange={handleDeviceTypeChange}
                >
                  {Object.entries(DEVICE_TYPES).map(([key, type]) => (
                    <Option key={key} value={key}>{type.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="deviceName"
                label="设备名称"
                rules={[{ required: true, message: '请选择设备' }]}
              >
                <Select
                  placeholder="请选择设备"
                  disabled={!selectedDeviceType}
                  onChange={(value) => setSelectedDevice(value)}
                >
                  {selectedDeviceType && DEVICE_TYPES[selectedDeviceType as keyof typeof DEVICE_TYPES]
                    .devices.map(device => (
                      <Option key={device.name} value={device.name}>{device.name}</Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="deviceId"
                label="设备编号"
                rules={[{ required: true, message: '请输入设备编号' }]}
              >
                <Input placeholder="请输入设备编号" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="maintenanceType"
                label="维护类型"
                rules={[{ required: true, message: '请选择维护类型' }]}
              >
                <Select placeholder="请选择维护类型">
                  <Option value="preventive">预防性维护</Option>
                  <Option value="corrective">纠正性维护</Option>
                  <Option value="emergency">紧急维护</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="priority"
                label="优先级"
                rules={[{ required: true, message: '请选择优先级' }]}
              >
                <Select placeholder="请选择优先级">
                  <Option value="low">低</Option>
                  <Option value="medium">中</Option>
                  <Option value="high">高</Option>
                  <Option value="critical">紧急</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="location"
                label="位置"
                rules={[{ required: true, message: '请选择位置' }]}
              >
                <Select placeholder="请选择位置">
                  <Option value="设备间A">设备间A</Option>
                  <Option value="设备间B">设备间B</Option>
                  <Option value="设备间C">设备间C</Option>
                  <Option value="楼顶机房">楼顶机房</Option>
                  <Option value="地下室">地下室</Option>
                  <Option value="配电室">配电室</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="scheduledDate"
                label="计划日期"
                rules={[{ required: true, message: '请选择计划日期' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  disabledDate={(current) => {
                    return current && current < dayjs().startOf('day');
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="estimatedDuration"
                label="预计时长(小时)"
                rules={[{ required: true, message: '请输入预计时长' }]}
              >
                <InputNumber
                  min={0.5}
                  max={72}
                  step={0.5}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="assignedTechnician"
                label="指定技师"
              >
                <Select
                  placeholder="请选择技师(可选)"
                  allowClear
                >
                  {technicians
                    .filter(tech => tech.specialty === DEVICE_TYPES[selectedDeviceType as keyof typeof DEVICE_TYPES]?.name)
                    .map(tech => (
                      <Option key={tech.id} value={tech.name}>
                        {tech.name} ({tech.position})
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="cost"
                label="预计成本"
                rules={[{ required: true, message: '请输入预计成本' }]}
                initialValue={selectedDevice ? 
                  DEVICE_TYPES[selectedDeviceType as keyof typeof DEVICE_TYPES]
                    ?.devices.find(d => d.name === selectedDevice)?.baseCost || 0 : 0}
              >
                <InputNumber
                  min={0}
                  max={100000}
                  step={100}
                  style={{ width: '100%' }}
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value: string | undefined) => {
                    const parsed = Number(value?.replace(/\¥\s?|(,*)/g, ''));
                    return isNaN(parsed) ? 0 : parsed;
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="parts"
            label="所需配件"
          >
            <Select
              mode="multiple"
              placeholder="请选择所需配件(可选)"
              allowClear
            >
              {['滤网', '传感器', '控制板', '电机', '轴承', '密封圈', '阀门',
                '继电器', '保险丝', '线缆', '开关', '压缩机', '风扇'].map(part => (
                <Option key={part} value={part}>{part}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="维护描述"
            rules={[{ required: true, message: '请输入维护描述' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="请输入维护描述"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                创建计划
              </Button>
              <Button onClick={() => setAddPlanModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MaintenanceSchedule; 