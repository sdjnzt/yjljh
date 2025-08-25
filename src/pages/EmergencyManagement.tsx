import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Table,
  Tag,
  Button,
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
  Progress,
  Drawer,
  Steps
} from 'antd';
import {
  SafetyCertificateOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  SettingOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BellOutlined,
  TeamOutlined,
  PhoneOutlined,
  CarOutlined,
  MedicineBoxOutlined,
  FireOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { Step } = Steps;

interface EmergencyPlan {
  id: string;
  name: string;
  type: 'fire' | 'medical' | 'security' | 'natural_disaster' | 'equipment_failure';
  level: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'inactive' | 'testing';
  description: string;
  procedures: string[];
  resources: string[];
  contacts: string[];
  lastUpdated: string;
  nextDrill: string;
}

interface EmergencyEvent {
  id: string;
  type: string;
  level: string;
  status: 'active' | 'responding' | 'resolved' | 'closed';
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime?: string;
  assignedTeam: string;
  resources: string[];
  progress: number;
  timeline: Array<{
    time: string;
    action: string;
    person: string;
    status: 'completed' | 'in_progress' | 'pending';
  }>;
}

interface EmergencyResource {
  id: string;
  name: string;
  type: 'personnel' | 'equipment' | 'vehicle' | 'medical' | 'communication';
  status: 'available' | 'deployed' | 'maintenance' | 'unavailable';
  location: string;
  capacity: string;
  contact: string;
  lastUpdated: string;
}

// 工具函数：生成一个月内的随机时间
function getRandomDateWithinLastMonth() {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  const seconds = Math.floor(Math.random() * 60);
  const randomDate = new Date(now);
  randomDate.setDate(now.getDate() - daysAgo);
  randomDate.setHours(hours, minutes, seconds, 0);
  return randomDate;
}
function formatDate(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

const EmergencyManagement: React.FC = () => {
  const [emergencyPlans, setEmergencyPlans] = useState<EmergencyPlan[]>(
    (() => {
      // 生成8个预案，lastUpdated和nextDrill为一个月内随机时间，nextDrill晚于lastUpdated
      const plans = [
    {
      id: '1',
      name: '火灾应急预案',
      type: 'fire',
      level: 'high',
      status: 'active',
      description: '酒店火灾应急响应和疏散预案，包括报警、疏散、灭火、救援等完整流程',
      procedures: ['报警', '疏散', '灭火', '救援', '调查', '恢复'],
      resources: ['消防队', '灭火器', '疏散通道', '应急照明', '消防栓', '烟雾探测器'],
          contacts: ['消防部门', '酒店安保', '医疗急救', '工程部']
    },
    {
      id: '2',
      name: '医疗急救预案',
      type: 'medical',
      level: 'medium',
      status: 'active',
      description: '客人突发疾病或意外伤害应急处理，确保及时有效的医疗救助',
      procedures: ['评估', '急救', '转运', '通知家属', '记录', '跟进'],
      resources: ['急救箱', 'AED设备', '救护车', '医护人员', '担架', '氧气设备'],
          contacts: ['120急救', '酒店医务室', '附近医院', '保险公司']
    },
    {
      id: '3',
      name: '安全事件预案',
      type: 'security',
      level: 'high',
      status: 'active',
      description: '治安事件、恐怖袭击等安全威胁应对，保障人员和财产安全',
      procedures: ['报警', '封锁', '疏散', '调查', '恢复', '总结'],
      resources: ['安保人员', '监控设备', '通讯设备', '防护装备', '隔离带'],
          contacts: ['110报警', '酒店安保', '政府应急办', '保险公司']
    },
    {
      id: '4',
      name: '自然灾害预案',
      type: 'natural_disaster',
      level: 'critical',
      status: 'active',
      description: '地震、台风、暴雨等自然灾害的应急响应和防护措施',
      procedures: ['预警', '疏散', '避难', '救援', '恢复', '重建'],
      resources: ['避难所', '应急物资', '通讯设备', '救援队伍', '发电机'],
          contacts: ['气象部门', '政府应急办', '救援队', '保险公司']
    },
    {
      id: '5',
      name: '设备故障预案',
      type: 'equipment_failure',
      level: 'medium',
      status: 'active',
      description: '电梯故障、电力中断、空调系统故障等设备问题的应急处理',
      procedures: ['故障报告', '安全隔离', '维修', '测试', '恢复'],
      resources: ['维修人员', '备用设备', '发电机', '应急照明', '通讯设备'],
          contacts: ['工程部', '设备供应商', '电力公司', '维修公司']
    },
    {
      id: '6',
      name: '食物中毒预案',
      type: 'medical',
      level: 'high',
      status: 'active',
      description: '食品安全事件应急处理，防止事态扩大，保障客人健康',
      procedures: ['隔离', '医疗救助', '调查', '通知', '整改', '预防'],
      resources: ['医疗人员', '隔离区域', '检测设备', '应急药品', '通讯设备'],
          contacts: ['卫生部门', '医疗急救', '食品安全局', '保险公司']
    },
    {
      id: '7',
      name: '人员聚集预案',
      type: 'security',
      level: 'medium',
      status: 'active',
      description: '大型活动、人员聚集场所的安全管理和应急响应',
      procedures: ['人流控制', '安全检查', '应急疏散', '医疗救助', '秩序维护'],
      resources: ['安保人员', '隔离设施', '医疗点', '通讯设备', '应急车辆'],
          contacts: ['安保部门', '医疗急救', '交通部门', '活动主办方']
    },
    {
      id: '8',
      name: '网络攻击预案',
      type: 'security',
      level: 'high',
      status: 'active',
      description: '网络系统遭受攻击时的应急响应和数据保护措施',
      procedures: ['检测', '隔离', '分析', '修复', '恢复', '防护'],
      resources: ['IT人员', '备用系统', '防火墙', '数据备份', '安全设备'],
          contacts: ['IT部门', '网络安全公司', '警方网安部门', '保险公司']
        }
      ];
      return plans.map(plan => {
        const lastUpdated = getRandomDateWithinLastMonth();
        const nextDrill = new Date(lastUpdated.getTime() + Math.floor(Math.random() * 15 * 24 * 60 * 60 * 1000)); // lastUpdated后0~15天
        return {
          ...plan,
          lastUpdated: formatDate(lastUpdated),
          nextDrill: formatDate(nextDrill)
        };
      }) as EmergencyPlan[];
    })()
  );

  const [emergencyEvents, setEmergencyEvents] = useState<EmergencyEvent[]>(
    (() => {
      // 生成多个事件，startTime为一个月内随机，endTime大于startTime，timeline时间递增
      const events = [
        {
          id: '1',
          type: 'fire',
          level: 'high',
          status: 'responding',
          title: '厨房火灾报警',
          description: '厨房油烟管道起火，需要立即处理',
          location: '酒店厨房',
          assignedTeam: '消防应急小组',
          resources: ['消防队', '灭火器', '疏散通道'],
          progress: 65,
          timeline: [
            { action: '火灾报警', person: '系统', status: 'completed' },
            { action: '启动应急预案', person: '值班经理', status: 'completed' },
            { action: '疏散人员', person: '安保人员', status: 'completed' },
            { action: '消防队到达', person: '消防队', status: 'completed' },
            { action: '灭火作业', person: '消防队', status: 'in_progress' },
            { action: '现场清理', person: '清洁人员', status: 'pending' }
          ]
        },
        {
          id: '2',
          type: 'medical',
          level: 'medium',
          status: 'active',
          title: '客人突发心脏病',
          description: '大门客人突发心脏病，需要紧急医疗救助',
          location: '酒店大门',
          assignedTeam: '医疗急救小组',
          resources: ['医护人员', 'AED设备', '救护车'],
          progress: 30,
          timeline: [
            { action: '发现病人', person: '前台人员', status: 'completed' },
            { action: '呼叫急救', person: '值班经理', status: 'completed' },
            { action: '现场急救', person: '医护人员', status: 'in_progress' },
            { action: '等待救护车', person: '医护人员', status: 'pending' },
            { action: '转运医院', person: '救护车', status: 'pending' }
          ]
        },
        {
          id: '3',
          type: 'security',
          level: 'high',
          status: 'resolved',
          title: '可疑人员闯入',
          description: '停车场发现可疑人员，已成功处理',
          location: '地下停车场',
          assignedTeam: '安保应急小组',
          resources: ['安保人员', '监控设备', '警车'],
          progress: 100,
          timeline: [
            { action: '发现可疑人员', person: '监控系统', status: 'completed' },
            { action: '安保人员到达', person: '安保队长', status: 'completed' },
            { action: '现场控制', person: '安保人员', status: 'completed' },
            { action: '警方到达', person: '警方', status: 'completed' },
            { action: '事件处理完成', person: '警方', status: 'completed' }
          ]
        },
        {
          id: '4',
          type: 'equipment_failure',
          level: 'medium',
          status: 'responding',
          title: '电梯故障',
          description: '2号电梯发生故障，有人员被困',
          location: '2号电梯',
          assignedTeam: '工程维修小组',
          resources: ['维修人员', '备用电梯', '救援设备'],
          progress: 45,
          timeline: [
            { action: '故障报警', person: '电梯系统', status: 'completed' },
            { action: '确认被困人员', person: '监控中心', status: 'completed' },
            { action: '维修人员到达', person: '工程部', status: 'completed' },
            { action: '救援作业', person: '维修人员', status: 'in_progress' },
            { action: '人员解救', person: '维修人员', status: 'pending' },
            { action: '设备维修', person: '维修人员', status: 'pending' }
          ]
        },
        {
          id: '5',
          type: 'natural_disaster',
          level: 'critical',
          status: 'active',
          title: '台风预警',
          description: '台风即将登陆，需要启动防灾预案',
          location: '整个酒店',
          assignedTeam: '防灾应急小组',
          resources: ['应急物资', '避难所', '通讯设备'],
          progress: 20,
          timeline: [
            { action: '收到预警', person: '气象部门', status: 'completed' },
            { action: '启动预案', person: '总经理', status: 'completed' },
            { action: '物资准备', person: '后勤部', status: 'in_progress' },
            { action: '人员疏散', person: '安保部', status: 'pending' },
            { action: '设施加固', person: '工程部', status: 'pending' }
          ]
        }
      ];

      return events.map(event => {
        const startTime = getRandomDateWithinLastMonth();
        const endTime = event.status === 'resolved' ? 
          new Date(startTime.getTime() + Math.floor(Math.random() * 2 * 60 * 60 * 1000)) : undefined;
        
        // 生成时间线
        let timelineTime = new Date(startTime);
        const timeline = event.timeline.map((step, idx) => {
          if (idx > 0) {
            timelineTime = new Date(timelineTime.getTime() + (2 + Math.floor(Math.random() * 9)) * 60 * 1000);
          }
          return {
            ...step,
            time: formatDate(timelineTime)
          };
        });

        return {
          ...event,
          startTime: formatDate(startTime),
          endTime: endTime ? formatDate(endTime) : undefined,
          timeline
        };
      }) as EmergencyEvent[];
    })()
  );

  const [emergencyResources, setEmergencyResources] = useState<EmergencyResource[]>(
    (() => {
      // 生成12个资源，lastUpdated为一个月内随机
      const base = [
    {
      id: '1',
      name: '消防应急小组',
      type: 'personnel',
      status: 'available',
      location: '酒店安保部',
      capacity: '8人',
          contact: '张队长 138****8888'
    },
    {
      id: '2',
      name: '急救医疗小组',
      type: 'medical',
      status: 'available',
      location: '酒店医务室',
      capacity: '3人',
          contact: '李医生 139****9999'
    },
    {
      id: '3',
      name: '应急车辆',
      type: 'vehicle',
      status: 'deployed',
      location: '酒店停车场',
      capacity: '2辆',
          contact: '王司机 137****7777'
    },
    {
      id: '4',
      name: '安保应急小组',
      type: 'personnel',
      status: 'available',
      location: '酒店安保部',
      capacity: '6人',
          contact: '刘队长 136****6666'
    },
    {
      id: '5',
      name: '工程维修小组',
      type: 'personnel',
      status: 'available',
      location: '酒店工程部',
      capacity: '4人',
          contact: '陈工程师 135****5555'
    },
    {
      id: '6',
      name: '消防车',
      type: 'vehicle',
      status: 'available',
      location: '消防站',
      capacity: '1辆',
          contact: '消防队 119'
    },
    {
      id: '7',
      name: '救护车',
      type: 'vehicle',
      status: 'deployed',
      location: '医院',
      capacity: '1辆',
          contact: '急救中心 120'
    },
    {
      id: '8',
      name: '应急通讯设备',
      type: 'communication',
      status: 'available',
      location: '酒店监控中心',
      capacity: '10台',
          contact: '通讯组 134****4444'
    },
    {
      id: '9',
      name: '灭火器设备',
      type: 'equipment',
      status: 'available',
      location: '酒店各楼层',
      capacity: '50个',
          contact: '设备管理员 133****3333'
    },
    {
      id: '10',
      name: 'AED除颤器',
      type: 'medical',
      status: 'available',
      location: '酒店大门',
      capacity: '2台',
          contact: '医务室 132****2222'
    },
    {
      id: '11',
      name: '应急发电机',
      type: 'equipment',
      status: 'maintenance',
      location: '酒店配电房',
      capacity: '1台',
          contact: '工程部 131****1111'
    },
    {
      id: '12',
      name: '应急物资储备',
      type: 'equipment',
      status: 'available',
      location: '酒店仓库',
      capacity: '充足',
          contact: '后勤部 130****0000'
        }
      ];
      return base.map(r => ({
        ...r,
        lastUpdated: formatDate(getRandomDateWithinLastMonth())
      })) as EmergencyResource[];
    })()
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState<EmergencyPlan | null>(null);
  const [form] = Form.useForm();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EmergencyEvent | null>(null);
  const [autoResponse, setAutoResponse] = useState(true);
  const [drillMode, setDrillMode] = useState(false);

  // 统计数据
  const totalPlans = emergencyPlans.length;
  const activePlans = emergencyPlans.filter(p => p.status === 'active').length;
  const criticalPlans = emergencyPlans.filter(p => p.level === 'critical').length;
  const activeEvents = emergencyEvents.filter(e => e.status === 'active' || e.status === 'responding').length;
  const availableResources = emergencyResources.filter(r => r.status === 'available').length;

  // 预案类型分布
  const planTypeDistribution = emergencyPlans.reduce((acc, plan) => {
    acc[plan.type] = (acc[plan.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const planTypeOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}个 ({d}%)'
    },
    series: [
      {
        type: 'pie',
        radius: '60%',
        data: Object.entries(planTypeDistribution).map(([type, count]) => ({
          value: count,
          name: type === 'fire' ? '火灾预案' : 
                type === 'medical' ? '医疗预案' : 
                type === 'security' ? '安全预案' : 
                type === 'natural_disaster' ? '自然灾害' : '设备故障',
          itemStyle: {
            color: type === 'fire' ? '#FF4D4F' :
                   type === 'medical' ? '#52C41A' :
                   type === 'security' ? '#1890FF' :
                   type === 'natural_disaster' ? '#FAAD14' : '#722ED1'
          }
        }))
      }
    ]
  };

  // 资源状态分布
  const resourceStatusData = {
    xAxis: {
      type: 'category',
      data: ['可用', '已部署', '维护中', '不可用']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [
          emergencyResources.filter(r => r.status === 'available').length,
          emergencyResources.filter(r => r.status === 'deployed').length,
          emergencyResources.filter(r => r.status === 'maintenance').length,
          emergencyResources.filter(r => r.status === 'unavailable').length
        ],
        type: 'bar',
        itemStyle: {
          color: (params: any) => {
            const colors = ['#52C41A', '#1890FF', '#FAAD14', '#FF4D4F'];
            return colors[params.dataIndex];
          }
        }
      }
    ]
  };

  const handleAddPlan = () => {
    setEditingPlan(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditPlan = (plan: EmergencyPlan) => {
    setEditingPlan(plan);
    form.setFieldsValue(plan);
    setIsModalVisible(true);
  };

  const handleDeletePlan = (id: string) => {
    setEmergencyPlans(emergencyPlans.filter(p => p.id !== id));
    message.success('删除成功');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingPlan) {
        setEmergencyPlans(emergencyPlans.map(p => p.id === editingPlan.id ? { ...p, ...values } : p));
        message.success('更新成功');
      } else {
        const newPlan: EmergencyPlan = {
          id: Date.now().toString(),
          ...values,
          status: 'active',
          lastUpdated: new Date().toISOString().split('T')[0],
          nextDrill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
        setEmergencyPlans([...emergencyPlans, newPlan]);
        message.success('添加成功');
      }
      setIsModalVisible(false);
    });
  };

  const handleViewEventDetails = (event: EmergencyEvent) => {
    setSelectedEvent(event);
    setIsDrawerVisible(true);
  };

  const planColumns = [
    {
      title: '预案名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap = {
          fire: { color: 'red', text: '火灾预案', icon: <FireOutlined /> },
          medical: { color: 'green', text: '医疗预案', icon: <MedicineBoxOutlined /> },
          security: { color: 'blue', text: '安全预案', icon: <SafetyCertificateOutlined /> },
          natural_disaster: { color: 'orange', text: '自然灾害', icon: <WarningOutlined /> },
          equipment_failure: { color: 'purple', text: '设备故障', icon: <SettingOutlined /> }
        };
        return (
          <Tag color={typeMap[type as keyof typeof typeMap]?.color} icon={typeMap[type as keyof typeof typeMap]?.icon}>
            {typeMap[type as keyof typeof typeMap]?.text}
          </Tag>
        );
      }
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => {
        const levelMap = {
          low: { color: 'green', text: '低' },
          medium: { color: 'blue', text: '中' },
          high: { color: 'orange', text: '高' },
          critical: { color: 'red', text: '紧急' }
        };
        return <Tag color={levelMap[level as keyof typeof levelMap]?.color}>{levelMap[level as keyof typeof levelMap]?.text}</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          active: { color: 'green', text: '激活', icon: <CheckCircleOutlined /> },
          inactive: { color: 'red', text: '停用', icon: <ClockCircleOutlined /> },
          testing: { color: 'orange', text: '测试中', icon: <WarningOutlined /> }
        };
        return (
          <Tag color={statusMap[status as keyof typeof statusMap]?.color} icon={statusMap[status as keyof typeof statusMap]?.icon}>
            {statusMap[status as keyof typeof statusMap]?.text}
          </Tag>
        );
      }
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated'
    },
    {
      title: '下次演练',
      dataIndex: 'nextDrill',
      key: 'nextDrill'
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: EmergencyPlan) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleEditPlan(record)}>
            查看
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditPlan(record)}>
            编辑
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDeletePlan(record.id)}>
            删除
          </Button>
        </Space>
      )
    }
  ];

  const eventColumns = [
    {
      title: '事件类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap = {
          fire: { color: 'red', text: '火灾', icon: <FireOutlined /> },
          medical: { color: 'green', text: '医疗', icon: <MedicineBoxOutlined /> },
          security: { color: 'blue', text: '安全', icon: <SafetyCertificateOutlined /> }
        };
        return (
          <Tag color={typeMap[type as keyof typeof typeMap]?.color} icon={typeMap[type as keyof typeof typeMap]?.icon}>
            {typeMap[type as keyof typeof typeMap]?.text}
          </Tag>
        );
      }
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => {
        const levelMap = {
          low: { color: 'green', text: '低' },
          medium: { color: 'blue', text: '中' },
          high: { color: 'orange', text: '高' },
          critical: { color: 'red', text: '紧急' }
        };
        return <Tag color={levelMap[level as keyof typeof levelMap]?.color}>{levelMap[level as keyof typeof levelMap]?.text}</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          active: { color: 'red', text: '活跃', icon: <WarningOutlined /> },
          responding: { color: 'orange', text: '响应中', icon: <ClockCircleOutlined /> },
          resolved: { color: 'green', text: '已解决', icon: <CheckCircleOutlined /> },
          closed: { color: 'default', text: '已关闭', icon: <CheckCircleOutlined /> }
        };
        return (
          <Tag color={statusMap[status as keyof typeof statusMap]?.color} icon={statusMap[status as keyof typeof statusMap]?.icon}>
            {statusMap[status as keyof typeof statusMap]?.text}
          </Tag>
        );
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location'
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime'
    },
    {
      title: '处理进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <div>
          <Progress percent={progress} size="small" />
          <Text>{progress}%</Text>
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: EmergencyEvent) => (
        <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewEventDetails(record)}>
          详情
        </Button>
      )
    }
  ];

  const resourceColumns = [
    {
      title: '资源名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap = {
          personnel: { color: 'blue', text: '人员', icon: <TeamOutlined /> },
          equipment: { color: 'green', text: '设备', icon: <SettingOutlined /> },
          vehicle: { color: 'orange', text: '车辆', icon: <CarOutlined /> },
          medical: { color: 'red', text: '医疗', icon: <MedicineBoxOutlined /> },
          communication: { color: 'purple', text: '通讯', icon: <PhoneOutlined /> }
        };
        return (
          <Tag color={typeMap[type as keyof typeof typeMap]?.color} icon={typeMap[type as keyof typeof typeMap]?.icon}>
            {typeMap[type as keyof typeof typeMap]?.text}
          </Tag>
        );
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          available: { color: 'green', text: '可用' },
          deployed: { color: 'blue', text: '已部署' },
          maintenance: { color: 'orange', text: '维护中' },
          unavailable: { color: 'red', text: '不可用' }
        };
        return <Tag color={statusMap[status as keyof typeof statusMap]?.color}>{statusMap[status as keyof typeof statusMap]?.text}</Tag>;
      }
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location'
    },
    {
      title: '容量',
      dataIndex: 'capacity',
      key: 'capacity'
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      key: 'contact'
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated'
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>应急指挥</Title>
      <Text type="secondary">整合应急预案与资源，在紧急事件时快速启动响应流程，支持应急指挥调度与资源调配，提升应急处理能力</Text>
      
      <Alert
        message="系统状态"
        description="应急管理系统运行正常，当前活跃事件1个，应急预案3个，应急资源充足，系统响应时间良好"
        type="success"
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card>
            <Statistic title="应急预案" value={totalPlans} prefix={<SafetyCertificateOutlined />} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="活跃事件" value={activeEvents} valueStyle={{ color: '#FF4D4F' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="可用资源" value={availableResources} valueStyle={{ color: '#52C41A' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="响应时间" value="<2分钟" valueStyle={{ color: '#1890FF' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="本月演练" value={3} valueStyle={{ color: '#722ED1' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="系统可用性" value={99.8} suffix="%" valueStyle={{ color: '#52C41A' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="应急人员" value={25} valueStyle={{ color: '#1890FF' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="应急车辆" value={5} valueStyle={{ color: '#FAAD14' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="应急设备" value={68} valueStyle={{ color: '#52C41A' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="平均处理时间" value="45分钟" valueStyle={{ color: '#1890FF' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="预案覆盖率" value={95} suffix="%" valueStyle={{ color: '#52C41A' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="资源利用率" value={78} suffix="%" valueStyle={{ color: '#FAAD14' }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={16}>
          <Card
            title="应急事件监控"
            extra={
              <Space>
                <Switch
                  checked={autoResponse}
                  onChange={setAutoResponse}
                  checkedChildren="自动响应"
                  unCheckedChildren="手动响应"
                />
                <Switch
                  checked={drillMode}
                  onChange={setDrillMode}
                  checkedChildren="演练模式"
                  unCheckedChildren="实战模式"
                />
                <Button icon={<ReloadOutlined />}>刷新</Button>
              </Space>
            }
          >
            <Table
              columns={eventColumns}
              dataSource={emergencyEvents}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="预案类型分布" size="small">
            <ReactECharts option={planTypeOption} style={{ height: 200 }} />
          </Card>

          <Card title="资源状态分布" size="small" style={{ marginTop: 16 }}>
            <ReactECharts option={resourceStatusData} style={{ height: 200 }} />
          </Card>

          <Card title="快速响应" size="small" style={{ marginTop: 16 }}>
            <List
              size="small"
              dataSource={[
                { title: '火灾报警', icon: <FireOutlined />, color: '#FF4D4F' },
                { title: '医疗急救', icon: <MedicineBoxOutlined />, color: '#52C41A' },
                { title: '安全事件', icon: <SafetyCertificateOutlined />, color: '#1890FF' },
                { title: '自然灾害', icon: <WarningOutlined />, color: '#FAAD14' }
              ]}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={item.icon} style={{ backgroundColor: item.color }} />}
                    title={<a href="#">{item.title}</a>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="1" style={{ marginTop: 24 }}>
        <TabPane tab="应急预案管理" key="1">
          <Card
            title="应急预案配置"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPlan}>
                添加预案
              </Button>
            }
          >
            <Table
              columns={planColumns}
              dataSource={emergencyPlans}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="应急资源管理" key="2">
          <Card title="应急资源列表">
            <Table
              columns={resourceColumns}
              dataSource={emergencyResources}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="应急演练" key="3">
          <Card title="演练计划与记录">
            <Timeline>
              <Timeline.Item color="green">
                <p>2025-01-15 - 火灾应急演练</p>
                <p>参与人员：全体员工，演练地点：酒店大门</p>
                <p>演练结果：优秀，疏散时间3分钟，无人员伤亡</p>
              </Timeline.Item>
              <Timeline.Item color="blue">
                <p>2025-01-30 - 安全事件演练</p>
                <p>参与人员：安保人员，演练地点：停车场</p>
                <p>演练结果：良好，响应时间2分钟，成功控制现场</p>
              </Timeline.Item>
              <Timeline.Item color="orange">
                <p>2025-02-15 - 医疗急救演练</p>
                <p>参与人员：医务室人员，演练地点：客房区域</p>
                <p>演练结果：优秀，急救时间1.5分钟，操作规范</p>
              </Timeline.Item>
              <Timeline.Item color="purple">
                <p>2025-03-01 - 电梯故障演练</p>
                <p>参与人员：工程部人员，演练地点：2号电梯</p>
                <p>演练结果：良好，救援时间5分钟，技术熟练</p>
              </Timeline.Item>
              <Timeline.Item color="red">
                <p>2025-03-15 - 自然灾害演练</p>
                <p>参与人员：全体应急小组，演练地点：整个酒店</p>
                <p>演练结果：优秀，防灾措施到位，人员安全</p>
              </Timeline.Item>
              <Timeline.Item color="cyan">
                <p>2025-04-01 - 食物中毒演练</p>
                <p>参与人员：餐饮部、医务室，演练地点：餐厅</p>
                <p>演练结果：良好，隔离措施及时，医疗救助到位</p>
              </Timeline.Item>
              <Timeline.Item color="gold">
                <p>2025-04-15 - 网络攻击演练</p>
                <p>参与人员：IT部门，演练地点：数据中心</p>
                <p>演练结果：优秀，系统恢复时间10分钟，数据安全</p>
              </Timeline.Item>
              <Timeline.Item color="lime">
                <p>2025-05-01 - 人员聚集演练</p>
                <p>参与人员：安保部、医疗部，演练地点：宴会厅</p>
                <p>演练结果：良好，人流控制有序，应急响应及时</p>
              </Timeline.Item>
            </Timeline>
          </Card>
        </TabPane>

        <TabPane tab="系统设置" key="4">
          <Card title="应急系统配置">
            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="自动响应延迟" name="responseDelay">
                    <Input addonAfter="秒" defaultValue="30" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="演练频率" name="drillFrequency">
                    <Select defaultValue="monthly">
                      <Option value="weekly">每周</Option>
                      <Option value="monthly">每月</Option>
                      <Option value="quarterly">每季度</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="自动通知" name="autoNotification">
                    <Switch defaultChecked />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="资源自动调配" name="autoResourceAllocation">
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

      {/* 添加/编辑应急预案模态框 */}
      <Modal
        title={editingPlan ? '编辑应急预案' : '添加应急预案'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="预案名称" name="name" rules={[{ required: true, message: '请输入预案名称' }]}>
                <Input placeholder="请输入预案名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="预案类型" name="type" rules={[{ required: true, message: '请选择预案类型' }]}>
                <Select placeholder="请选择预案类型">
                  <Option value="fire">火灾预案</Option>
                  <Option value="medical">医疗预案</Option>
                  <Option value="security">安全预案</Option>
                  <Option value="natural_disaster">自然灾害</Option>
                  <Option value="equipment_failure">设备故障</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="预案级别" name="level">
                <Select placeholder="请选择预案级别">
                  <Option value="low">低</Option>
                  <Option value="medium">中</Option>
                  <Option value="high">高</Option>
                  <Option value="critical">紧急</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="启用状态" name="status" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="预案描述" name="description" rules={[{ required: true, message: '请输入预案描述' }]}>
            <Input.TextArea placeholder="请输入预案描述" rows={3} />
          </Form.Item>
          <Form.Item label="应急程序" name="procedures">
            <Select mode="tags" placeholder="请输入应急程序">
              <Option value="报警">报警</Option>
              <Option value="疏散">疏散</Option>
              <Option value="灭火">灭火</Option>
              <Option value="救援">救援</Option>
              <Option value="调查">调查</Option>
            </Select>
          </Form.Item>
          <Form.Item label="所需资源" name="resources">
            <Select mode="tags" placeholder="请输入所需资源">
              <Option value="消防队">消防队</Option>
              <Option value="灭火器">灭火器</Option>
              <Option value="疏散通道">疏散通道</Option>
              <Option value="应急照明">应急照明</Option>
            </Select>
          </Form.Item>
          <Form.Item label="联系人" name="contacts">
            <Select mode="tags" placeholder="请输入联系人">
              <Option value="消防部门">消防部门</Option>
              <Option value="酒店安保">酒店安保</Option>
              <Option value="医疗急救">医疗急救</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 应急事件详情抽屉 */}
      <Drawer
        title="应急事件详情"
        placement="right"
        width={600}
        open={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      >
        {selectedEvent && (
          <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Text strong>事件类型：</Text>
                <Tag color="red">{selectedEvent.type}</Tag>
              </Col>
              <Col span={12}>
                <Text strong>事件级别：</Text>
                <Tag color="orange">{selectedEvent.level}</Tag>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Text strong>状态：</Text>
                <Tag color="orange">{selectedEvent.status}</Tag>
              </Col>
              <Col span={12}>
                <Text strong>位置：</Text>
                <Text>{selectedEvent.location}</Text>
              </Col>
            </Row>
            <div style={{ marginBottom: 16 }}>
              <Text strong>标题：</Text>
              <div style={{ marginTop: 8 }}>{selectedEvent.title}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>描述：</Text>
              <div style={{ marginTop: 8 }}>{selectedEvent.description}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>处理进度：</Text>
              <Progress percent={selectedEvent.progress} style={{ marginTop: 8 }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>响应时间线：</Text>
              <Steps
                direction="vertical"
                size="small"
                style={{ marginTop: 8 }}
                current={selectedEvent.timeline.filter(t => t.status === 'completed').length}
              >
                {selectedEvent.timeline.map((step, index) => (
                  <Step
                    key={index}
                    title={step.action}
                    description={`${step.time} - ${step.person}`}
                    status={step.status === 'completed' ? 'finish' : step.status === 'in_progress' ? 'process' : 'wait'}
                  />
                ))}
              </Steps>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default EmergencyManagement; 