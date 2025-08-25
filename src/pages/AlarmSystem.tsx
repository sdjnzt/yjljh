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
  Drawer
} from 'antd';
import {
  AlertOutlined,
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
  SafetyOutlined,
  UserOutlined,
  CameraOutlined,
  ThunderboltOutlined,
  FireOutlined,
  LockOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface AlarmEvent {
  id: string;
  type: 'intrusion' | 'fire' | 'gas' | 'equipment' | 'environment' | 'security';
  level: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved' | 'false_alarm';
  title: string;
  description: string;
  location: string;
  timestamp: string;
  source: string;
  confidence: number;
  assignedTo?: string;
  responseTime?: string;
  resolutionTime?: string;
  tags: string[];
}

interface AlarmRule {
  id: string;
  name: string;
  type: string;
  conditions: string;
  actions: string[];
  isEnabled: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  lastTriggered?: string;
  triggerCount: number;
}

// 常用中文姓名、地点、报警描述
const alarmNames = ['王伟', '李娜', '张磊', '刘洋', '陈静', '杨勇', '赵敏', '黄磊', '周杰', '吴霞', '徐强', '孙丽', '胡军', '朱琳', '高翔', '林涛', '何梅', '郭鹏', '马超', '罗丹', '陈明', '刘芳', '张华', '李强', '王丽', '赵伟', '孙明', '周华', '吴强', '郑丽'];
const locations = ['地下停车场', '配电室', '大门', '餐厅', '会议室', '前台', '仓库', '厨房', '楼梯口', '休息区', '健身房', '花园', '监控室', '配电房', '消防通道', '北门', '一楼大门', '二楼走廊', '三楼走廊', '正门', '电梯间', '洗手间', '办公室', '档案室', '机房', '锅炉房', '水泵房', '空调机房', '配电箱', '消防栓'];
const alarmTypes = ['intrusion', 'fire', 'gas', 'equipment', 'environment', 'security'] as const;
const alarmLevels = ['low', 'medium', 'high', 'critical'] as const;
const alarmStatus = ['active', 'acknowledged', 'resolved', 'false_alarm'] as const;
const alarmTitles = [
  '检测到可疑人员进入', '火灾烟雾报警', '气体泄漏报警', '设备参数超标', '环境参数异常', '安全事件报警',
  '门禁系统异常', '设备离线报警', '温度异常升高', '湿度超标警告', '电压波动异常', '电流过载报警',
  '人员聚集检测', '异常行为识别', '设备故障预警', '环境质量异常', '安全通道堵塞', '消防设备异常'
];
const alarmDescs = [
  'AI行为分析检测到可疑人员在停车场徘徊',
  '烟雾传感器检测到异常烟雾',
  '气体传感器检测到可燃气体浓度超标',
  '配电室电压超出正常范围',
  '大门温度超出舒适范围',
  '门禁系统检测到异常开门',
  '监控摄像头检测到异常行为',
  '设备运行参数波动异常',
  '环境湿度超标',
  'AI检测到人员聚集异常',
  '门禁读卡器检测到异常刷卡',
  '关键设备通信中断',
  '空调系统温度传感器异常',
  '环境监测系统湿度超标',
  '配电系统电压不稳定',
  '电气设备电流过载',
  '监控系统检测到人员异常聚集',
  'AI算法识别到可疑行为模式',
  '设备运行状态异常',
  '空气质量传感器检测到异常',
  '安全出口被物品堵塞',
  '消防喷淋系统压力异常',
  '电梯运行状态异常',
  '锅炉房温度异常',
  '水泵运行参数超标',
  '空调制冷系统故障',
  '配电箱温度过高',
  '消防栓水压不足',
  '监控摄像头离线',
  '网络设备通信故障'
];
const alarmTags = [
  ['行为异常', '可疑人员', '需要关注'],
  ['火灾', '烟雾', '高危'],
  ['气体泄漏', '危险', '需紧急处理'],
  ['设备故障', '电压异常', '已处理'],
  ['环境异常', '温度过高', '已解决'],
  ['安全事件', '门禁异常', '需排查'],
  ['门禁异常', '刷卡异常', '需核实'],
  ['设备离线', '通信中断', '需检查'],
  ['温度异常', '空调故障', '需维修'],
  ['湿度超标', '环境异常', '需调节'],
  ['电压波动', '电力异常', '需检查'],
  ['电流过载', '设备过载', '需处理'],
  ['人员聚集', '行为异常', '需关注'],
  ['行为识别', 'AI检测', '需核实'],
  ['设备故障', '运行异常', '需维修'],
  ['环境质量', '空气质量', '需改善'],
  ['安全通道', '堵塞异常', '需清理'],
  ['消防设备', '系统异常', '需检查'],
  ['电梯故障', '运行异常', '需维修'],
  ['锅炉异常', '温度过高', '需检查'],
  ['水泵异常', '运行参数', '需调整'],
  ['空调故障', '制冷异常', '需维修'],
  ['配电异常', '温度过高', '需检查'],
  ['消防异常', '水压不足', '需处理'],
  ['监控离线', '设备故障', '需维修'],
  ['网络故障', '通信异常', '需检查']
];
function getTodayString(time: string) {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${time}`;
}
function getRandomTime() {
  const hour = String(8 + Math.floor(Math.random() * 10)).padStart(2, '0');
  const min = String(Math.floor(Math.random() * 60)).padStart(2, '0');
  const sec = String(Math.floor(Math.random() * 60)).padStart(2, '0');
  return `${hour}:${min}:${sec}`;
}
function getRandomDateWithinLastMonth() {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30); // 0~29天前
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

const AlarmSystem: React.FC = () => {
  const [alarmEvents, setAlarmEvents] = useState<AlarmEvent[]>(
    Array.from({ length: 120 }, (_, i) => {
      const typeIdx = i % alarmTypes.length;
      const levelIdx = i % alarmLevels.length;
      const statusIdx = i % alarmStatus.length;
      const locIdx = i % locations.length;
      const titleIdx = i % alarmTitles.length;
      const descIdx = i % alarmDescs.length;
      const tagsIdx = i % alarmTags.length;
      const assigned = alarmStatus[statusIdx] !== 'active' ? alarmNames[i % alarmNames.length] : undefined;
      // 生成timestamp
      const timestampDate = getRandomDateWithinLastMonth();
      // 生成responseTime（大于等于timestamp）
      let responseTimeDate: Date | undefined = undefined;
      if (alarmStatus[statusIdx] !== 'active') {
        responseTimeDate = new Date(timestampDate.getTime() + Math.floor(Math.random() * 60 * 60 * 1000)); // 0~60分钟后
      }
      // 生成resolutionTime（大于等于responseTime）
      let resolutionTimeDate: Date | undefined = undefined;
      if (alarmStatus[statusIdx] === 'resolved' && responseTimeDate) {
        resolutionTimeDate = new Date(responseTimeDate.getTime() + Math.floor(Math.random() * 60 * 60 * 1000)); // 0~60分钟后
      }
      return {
        id: `${i + 1}`,
        type: alarmTypes[typeIdx],
        level: alarmLevels[levelIdx],
        status: alarmStatus[statusIdx],
        title: alarmTitles[titleIdx],
        description: alarmDescs[descIdx],
        location: locations[locIdx],
        timestamp: formatDate(timestampDate),
        source: `传感器-${(i % 15) + 1}`,
        confidence: parseFloat((85 + Math.random() * 15).toFixed(1)),
        assignedTo: assigned,
        responseTime: responseTimeDate ? formatDate(responseTimeDate) : undefined,
        resolutionTime: resolutionTimeDate ? formatDate(resolutionTimeDate) : undefined,
        tags: alarmTags[tagsIdx]
      };
    })
  );

  const [alarmRules, setAlarmRules] = useState<AlarmRule[]>([
    {
      id: '1',
      name: '区域入侵检测',
      type: 'intrusion',
      conditions: '检测到未授权人员进入限制区域',
      actions: ['发送短信', '推送APP通知', '记录日志'],
      isEnabled: true,
      priority: 'high',
      lastTriggered: formatDate(getRandomDateWithinLastMonth()),
      triggerCount: 15
    },
    {
      id: '2',
      name: '设备参数监控',
      type: 'equipment',
      conditions: '设备参数超出正常范围',
      actions: ['发送邮件', '推送APP通知', '自动记录'],
      isEnabled: true,
      priority: 'medium',
      lastTriggered: formatDate(getRandomDateWithinLastMonth()),
      triggerCount: 28
    },
    {
      id: '3',
      name: '环境异常预警',
      type: 'environment',
      conditions: '环境参数超出舒适范围',
      actions: ['推送APP通知', '记录日志'],
      isEnabled: true,
      priority: 'low',
      lastTriggered: formatDate(getRandomDateWithinLastMonth()),
      triggerCount: 22
    },
    {
      id: '4',
      name: '火灾烟雾检测',
      type: 'fire',
      conditions: '烟雾浓度超过阈值或温度异常升高',
      actions: ['发送短信', '推送APP通知', '自动报警', '启动消防系统'],
      isEnabled: true,
      priority: 'critical',
      lastTriggered: formatDate(getRandomDateWithinLastMonth()),
      triggerCount: 3
    },
    {
      id: '5',
      name: '气体泄漏监控',
      type: 'gas',
      conditions: '可燃气体浓度超过安全阈值',
      actions: ['发送短信', '推送APP通知', '启动通风系统', '记录日志'],
      isEnabled: true,
      priority: 'high',
      lastTriggered: formatDate(getRandomDateWithinLastMonth()),
      triggerCount: 7
    },
    {
      id: '6',
      name: '门禁异常检测',
      type: 'security',
      conditions: '门禁系统检测到异常开门或暴力破坏',
      actions: ['发送短信', '推送APP通知', '记录视频', '通知保安'],
      isEnabled: true,
      priority: 'high',
      lastTriggered: formatDate(getRandomDateWithinLastMonth()),
      triggerCount: 12
    },
    {
      id: '7',
      name: '设备离线监控',
      type: 'equipment',
      conditions: '关键设备离线或通信中断',
      actions: ['发送邮件', '推送APP通知', '记录日志', '通知维护人员'],
      isEnabled: true,
      priority: 'medium',
      lastTriggered: formatDate(getRandomDateWithinLastMonth()),
      triggerCount: 5
    },
    {
      id: '8',
      name: '人员聚集检测',
      type: 'security',
      conditions: '检测到人员异常聚集或停留时间过长',
      actions: ['推送APP通知', '记录日志', '通知管理人员'],
      isEnabled: true,
      priority: 'medium',
      lastTriggered: formatDate(getRandomDateWithinLastMonth()),
      triggerCount: 18
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState<AlarmRule | null>(null);
  const [form] = Form.useForm();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedAlarm, setSelectedAlarm] = useState<AlarmEvent | null>(null);
  const [autoResponse, setAutoResponse] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState(true);

  // 统计数据
  const totalAlarms = alarmEvents.length;
  const activeAlarms = alarmEvents.filter(a => a.status === 'active').length;
  const criticalAlarms = alarmEvents.filter(a => a.level === 'critical').length;
  const resolvedAlarms = alarmEvents.filter(a => a.status === 'resolved').length;
  const falseAlarms = alarmEvents.filter(a => a.status === 'false_alarm').length;
  const avgResponseTime = alarmEvents
    .filter(a => a.responseTime)
    .reduce((sum, a) => {
      // 兼容 'YYYY-MM-DD HH:mm:ss' 格式
      const t1 = Date.parse(a.timestamp.replace(' ', 'T'));
      const t2 = Date.parse(a.responseTime!.replace(' ', 'T'));
      return sum + (t2 - t1);
    }, 0) / alarmEvents.filter(a => a.responseTime).length;
  const avgResolutionTime = alarmEvents
    .filter(a => a.resolutionTime && a.responseTime)
    .reduce((sum, a) => {
      const t1 = Date.parse(a.responseTime!.replace(' ', 'T'));
      const t2 = Date.parse(a.resolutionTime!.replace(' ', 'T'));
      return sum + (t2 - t1);
    }, 0) / (alarmEvents.filter(a => a.resolutionTime && a.responseTime).length || 1);
  const handledAlarms = alarmEvents.filter(a => a.status === 'acknowledged' || a.status === 'resolved' || a.status === 'false_alarm').length;
  const handleRate = totalAlarms > 0 ? Math.round((handledAlarms / totalAlarms) * 100) : 0;

  // 报警类型分布
  const typeDistribution = alarmEvents.reduce((acc, alarm) => {
    acc[alarm.type] = (acc[alarm.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}个 ({d}%)'
    },
    series: [
      {
        type: 'pie',
        radius: '60%',
        data: Object.entries(typeDistribution).map(([type, count]) => ({
          value: count,
          name: type === 'intrusion' ? '入侵检测' : 
                type === 'equipment' ? '设备故障' : 
                type === 'environment' ? '环境异常' : 
                type === 'fire' ? '火灾报警' : 
                type === 'gas' ? '气体泄漏' : '安全事件',
          itemStyle: {
            color: type === 'intrusion' ? '#FF4D4F' :
                   type === 'equipment' ? '#FAAD14' :
                   type === 'environment' ? '#1890FF' :
                   type === 'fire' ? '#FF7875' :
                   type === 'gas' ? '#FF7A45' : '#722ED1'
          }
        }))
      }
    ]
  };

  // 报警级别分布
  const levelData = {
    xAxis: {
      type: 'category',
      data: ['低', '中', '高', '紧急']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [
          alarmEvents.filter(a => a.level === 'low').length,
          alarmEvents.filter(a => a.level === 'medium').length,
          alarmEvents.filter(a => a.level === 'high').length,
          alarmEvents.filter(a => a.level === 'critical').length
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

  const handleAcknowledge = (id: string) => {
    setAlarmEvents(alarmEvents.map(a => 
      a.id === id ? { ...a, status: 'acknowledged', responseTime: new Date().toLocaleString() } : a
    ));
    message.success('报警已确认');
  };

  const handleResolve = (id: string) => {
    setAlarmEvents(alarmEvents.map(a => 
      a.id === id ? { ...a, status: 'resolved', resolutionTime: new Date().toLocaleString() } : a
    ));
    message.success('报警已解决');
  };

  const handleViewDetails = (alarm: AlarmEvent) => {
    setSelectedAlarm(alarm);
    setIsDrawerVisible(true);
  };

  const handleAddRule = () => {
    setEditingRule(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditRule = (rule: AlarmRule) => {
    setEditingRule(rule);
    form.setFieldsValue(rule);
    setIsModalVisible(true);
  };

  const handleDeleteRule = (id: string) => {
    setAlarmRules(alarmRules.filter(r => r.id !== id));
    message.success('删除成功');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingRule) {
        setAlarmRules(alarmRules.map(r => r.id === editingRule.id ? { ...r, ...values } : r));
        message.success('更新成功');
      } else {
        const newRule: AlarmRule = {
          id: Date.now().toString(),
          ...values,
          isEnabled: true,
          triggerCount: 0
        };
        setAlarmRules([...alarmRules, newRule]);
        message.success('添加成功');
      }
      setIsModalVisible(false);
    });
  };

  const alarmColumns = [
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
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap = {
          intrusion: { color: 'red', text: '入侵检测', icon: <LockOutlined /> },
          fire: { color: 'red', text: '火灾报警', icon: <FireOutlined /> },
          gas: { color: 'orange', text: '气体泄漏', icon: <SafetyOutlined /> },
          equipment: { color: 'orange', text: '设备故障', icon: <ThunderboltOutlined /> },
          environment: { color: 'blue', text: '环境异常', icon: <CameraOutlined /> },
          security: { color: 'purple', text: '安全事件', icon: <SafetyOutlined /> }
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
          active: { color: 'red', text: '活跃', icon: <AlertOutlined /> },
          acknowledged: { color: 'orange', text: '已确认', icon: <ClockCircleOutlined /> },
          resolved: { color: 'green', text: '已解决', icon: <CheckCircleOutlined /> },
          false_alarm: { color: 'default', text: '误报', icon: <WarningOutlined /> }
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
      title: '置信度',
      dataIndex: 'confidence',
      key: 'confidence',
      render: (confidence: number) => (
        <div>
          <Progress percent={confidence} size="small" />
          <Text>{confidence}%</Text>
        </div>
      )
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp'
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: AlarmEvent) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewDetails(record)}>
            详情
          </Button>
          {record.status === 'active' && (
            <>
              <Button type="link" icon={<CheckCircleOutlined />} onClick={() => handleAcknowledge(record.id)}>
                确认
              </Button>
              <Button type="link" icon={<CheckCircleOutlined />} onClick={() => handleResolve(record.id)}>
                解决
              </Button>
            </>
          )}
        </Space>
      )
    }
  ];

  const ruleColumns = [
    {
      title: '规则名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap = {
          intrusion: { color: 'red', text: '入侵检测' },
          equipment: { color: 'orange', text: '设备监控' },
          environment: { color: 'blue', text: '环境监控' },
          fire: { color: 'red', text: '火灾检测' },
          gas: { color: 'orange', text: '气体检测' }
        };
        return <Tag color={typeMap[type as keyof typeof typeMap]?.color}>{typeMap[type as keyof typeof typeMap]?.text}</Tag>;
      }
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const priorityMap = {
          low: { color: 'green', text: '低' },
          medium: { color: 'blue', text: '中' },
          high: { color: 'orange', text: '高' },
          critical: { color: 'red', text: '紧急' }
        };
        return <Tag color={priorityMap[priority as keyof typeof priorityMap]?.color}>{priorityMap[priority as keyof typeof priorityMap]?.text}</Tag>;
      }
    },
    {
      title: '触发条件',
      dataIndex: 'conditions',
      key: 'conditions',
      ellipsis: true
    },
    {
      title: '执行动作',
      dataIndex: 'actions',
      key: 'actions',
      render: (actions: string[]) => (
        <Space>
          {actions.map(action => (
            <Tag key={action} color="blue">{action}</Tag>
          ))}
        </Space>
      )
    },
    {
      title: '状态',
      dataIndex: 'isEnabled',
      key: 'isEnabled',
      render: (enabled: boolean) => (
        <Tag color={enabled ? 'green' : 'red'}>
          {enabled ? '启用' : '禁用'}
        </Tag>
      )
    },
    {
      title: '触发次数',
      dataIndex: 'triggerCount',
      key: 'triggerCount'
    },
    {
      title: '最后触发',
      dataIndex: 'lastTriggered',
      key: 'lastTriggered',
      render: (time: string) => time || '-'
    },
    {
      title: '操作',
      key: 'action',
      width: 120, // 固定宽度
      fixed: 'right' as const, // 修正类型
      render: (_: any, record: AlarmRule) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditRule(record)}>
            编辑
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDeleteRule(record.id)}>
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>报警中心</Title>
      <Text type="secondary">基于AI行为分析技术，自动识别区域入侵、设备参数超标等异常，触发多级报警并通过短信、APP等通知相关人员</Text>
      
      <Alert
        message="系统状态"
        description="报警与预警系统运行正常，AI分析引擎已就绪，当前活跃报警1个，系统响应时间良好"
        type="success"
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* 统计卡片 */}
      <Row gutter={20} style={{ marginBottom: 20 }}>
        <Col span={5}>
          <Card>
            <Statistic title="总报警数" value={totalAlarms} prefix={<AlertOutlined />} />
          </Card>
        </Col>
        {/* <Col span={5}>
          <Card>
            <Statistic title="活跃报警" value={activeAlarms} valueStyle={{ color: '#FF4D4F' }} />
          </Card>
        </Col> */}
        <Col span={5}>
          <Card>
            <Statistic title="紧急报警" value={criticalAlarms} valueStyle={{ color: '#FF4D4F' }} />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic title="已解决报警" value={resolvedAlarms} valueStyle={{ color: '#52C41A' }} />
          </Card>
        </Col>
        {/* <Col span={3}>
          <Card>
            <Statistic title="误报数" value={falseAlarms} valueStyle={{ color: '#BFBFBF' }} />
          </Card>
        </Col> */}
        <Col span={5}>
          <Card>
            <Statistic title="平均响应时间" value={Math.round(avgResponseTime / 1000 / 60)} suffix="分钟" valueStyle={{ color: '#52C41A' }} />
          </Card>
        </Col>
        {/* <Col span={3}>
          <Card>
            <Statistic title="平均解决时间" value={Math.round(avgResolutionTime / 1000 / 60)} suffix="分钟" valueStyle={{ color: '#1890FF' }} />
          </Card>
        </Col> */}
        {/* <Col span={3}>
          <Card>
            <Statistic title="报警处理率" value={handleRate} suffix="%" valueStyle={{ color: '#722ED1' }} />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic title="今日新增" value={Math.floor(totalAlarms * 0.15)} valueStyle={{ color: '#1890FF' }} />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic title="本周处理" value={Math.floor(totalAlarms * 0.35)} valueStyle={{ color: '#52C41A' }} />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic title="设备在线率" value={95} suffix="%" valueStyle={{ color: '#52C41A' }} />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic title="系统可用性" value={99.8} suffix="%" valueStyle={{ color: '#52C41A' }} />
          </Card>
        </Col> */}
      </Row>

      <Row gutter={16}>
        <Col span={16}>
          <Card
            title="实时报警事件"
            extra={
              <Space>
                <Switch
                  checked={autoResponse}
                  onChange={setAutoResponse}
                  checkedChildren="自动响应"
                  unCheckedChildren="手动响应"
                />
                <Switch
                  checked={aiAnalysis}
                  onChange={setAiAnalysis}
                  checkedChildren="AI分析"
                  unCheckedChildren="规则分析"
                />
                <Button icon={<ReloadOutlined />}>刷新</Button>
              </Space>
            }
          >
            <Table
              columns={alarmColumns}
              dataSource={alarmEvents}
              rowKey="id"
              pagination={{ pageSize: 6 }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="报警类型分布" size="small">
            <ReactECharts option={typeOption} style={{ height: 200 }} />
          </Card>

          <Card title="报警级别分布" size="small" style={{ marginTop: 16 }}>
            <ReactECharts option={levelData} style={{ height: 200 }} />
          </Card>

          <Card title="系统配置" size="small" style={{ marginTop: 16 }}>
            <Form layout="vertical" size="small">
              <Form.Item label="报警阈值">
                <Select defaultValue="medium">
                  <Option value="low">低</Option>
                  <Option value="medium">中</Option>
                  <Option value="high">高</Option>
                </Select>
              </Form.Item>
              <Form.Item label="通知方式">
                <Select defaultValue="all" mode="multiple">
                  <Option value="sms">短信</Option>
                  <Option value="email">邮件</Option>
                  <Option value="app">APP推送</Option>
                  <Option value="phone">电话</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" size="small" block>保存配置</Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="1" style={{ marginTop: 24 }}>
        <TabPane tab="报警规则管理" key="1">
          <Card
            title="报警规则配置"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRule}>
                添加规则
              </Button>
            }
          >
            <Table
              columns={ruleColumns}
              dataSource={alarmRules}
              rowKey="id"
              pagination={{ pageSize: 6 }}
              scroll={{ x: 'max-content' }} // 增加横向滚动
            />
          </Card>
        </TabPane>

        <TabPane tab="报警历史" key="2">
          <Card title="历史报警记录">
            <Timeline>
              {alarmEvents.slice(0, 10).map(alarm => (
                <Timeline.Item
                  key={alarm.id}
                  color={alarm.level === 'critical' ? 'red' : alarm.level === 'high' ? 'orange' : 'blue'}
                >
                  <div>
                    <Text strong>{alarm.title}</Text>
                    <div>
                      <Text type="secondary">
                        {alarm.location} - {alarm.timestamp}
                      </Text>
                      <Badge
                        status={alarm.status === 'active' ? 'error' : alarm.status === 'resolved' ? 'success' : 'processing'}
                        text={alarm.status === 'active' ? '活跃' : alarm.status === 'resolved' ? '已解决' : '处理中'}
                        style={{ marginLeft: '8px' }}
                      />
                    </div>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </TabPane>

        <TabPane tab="系统设置" key="3">
          <Card title="报警系统配置">
            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="AI分析敏感度" name="aiSensitivity">
                    <Select defaultValue="medium">
                      <Option value="low">低</Option>
                      <Option value="medium">中</Option>
                      <Option value="high">高</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="自动响应延迟" name="responseDelay">
                    <Input addonAfter="秒" defaultValue="30" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="误报过滤" name="falseAlarmFilter">
                    <Switch defaultChecked />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="智能升级" name="smartEscalation">
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

      {/* 添加/编辑报警规则模态框 */}
      <Modal
        title={editingRule ? '编辑报警规则' : '添加报警规则'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="规则名称" name="name" rules={[{ required: true, message: '请输入规则名称' }]}>
                <Input placeholder="请输入规则名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="规则类型" name="type" rules={[{ required: true, message: '请选择规则类型' }]}>
                <Select placeholder="请选择规则类型">
                  <Option value="intrusion">入侵检测</Option>
                  <Option value="equipment">设备监控</Option>
                  <Option value="environment">环境监控</Option>
                  <Option value="fire">火灾检测</Option>
                  <Option value="gas">气体检测</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="优先级" name="priority">
                <Select placeholder="请选择优先级">
                  <Option value="low">低</Option>
                  <Option value="medium">中</Option>
                  <Option value="high">高</Option>
                  <Option value="critical">紧急</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="启用状态" name="isEnabled" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="触发条件" name="conditions" rules={[{ required: true, message: '请输入触发条件' }]}>
            <Input.TextArea placeholder="请输入触发条件" rows={3} />
          </Form.Item>
          <Form.Item label="执行动作" name="actions">
            <Select mode="multiple" placeholder="请选择执行动作">
              <Option value="发送短信">发送短信</Option>
              <Option value="推送APP通知">推送APP通知</Option>
              <Option value="发送邮件">发送邮件</Option>
              <Option value="记录日志">记录日志</Option>
              <Option value="自动记录">自动记录</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 报警详情抽屉 */}
      <Drawer
        title="报警详情"
        placement="right"
        width={600}
        open={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      >
        {selectedAlarm && (
          <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Text strong>报警级别：</Text>
                <Tag color={selectedAlarm.level === 'critical' ? 'red' : selectedAlarm.level === 'high' ? 'orange' : 'blue'}>
                  {selectedAlarm.level === 'critical' ? '紧急' : selectedAlarm.level === 'high' ? '高' : selectedAlarm.level === 'medium' ? '中' : '低'}
                </Tag>
              </Col>
              <Col span={12}>
                <Text strong>状态：</Text>
                <Tag color={selectedAlarm.status === 'active' ? 'red' : selectedAlarm.status === 'resolved' ? 'green' : 'orange'}>
                  {selectedAlarm.status === 'active' ? '活跃' : selectedAlarm.status === 'resolved' ? '已解决' : '已确认'}
                </Tag>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Text strong>位置：</Text>
                <Text>{selectedAlarm.location}</Text>
              </Col>
              <Col span={12}>
                <Text strong>来源：</Text>
                <Text>{selectedAlarm.source}</Text>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Text strong>置信度：</Text>
                <Progress percent={selectedAlarm.confidence} size="small" style={{ display: 'inline-block', width: 100 }} />
                <Text>{selectedAlarm.confidence}%</Text>
              </Col>
              <Col span={12}>
                <Text strong>时间：</Text>
                <Text>{selectedAlarm.timestamp}</Text>
              </Col>
            </Row>
            <div style={{ marginBottom: 16 }}>
              <Text strong>描述：</Text>
              <div style={{ marginTop: 8 }}>{selectedAlarm.description}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>标签：</Text>
              <div style={{ marginTop: 8 }}>
                {selectedAlarm.tags.map(tag => (
                  <Tag key={tag} color="blue">{tag}</Tag>
                ))}
              </div>
            </div>
            {selectedAlarm.assignedTo && (
              <div style={{ marginBottom: 16 }}>
                <Text strong>处理人：</Text>
                <Text>{selectedAlarm.assignedTo}</Text>
              </div>
            )}
            {selectedAlarm.responseTime && (
              <div style={{ marginBottom: 16 }}>
                <Text strong>响应时间：</Text>
                <Text>{selectedAlarm.responseTime}</Text>
              </div>
            )}
            {selectedAlarm.resolutionTime && (
              <div style={{ marginBottom: 16 }}>
                <Text strong>解决时间：</Text>
                <Text>{selectedAlarm.resolutionTime}</Text>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default AlarmSystem; 