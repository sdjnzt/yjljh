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
  StarOutlined,
  UserOutlined,
  MessageOutlined,
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
  SmileOutlined,
  FrownOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface SatisfactionSurvey {
  id: string;
  guestName: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  overallRating: number;
  cleanliness: number;
  service: number;
  facilities: number;
  food: number;
  value: number;
  comment: string;
  status: 'submitted' | 'processed' | 'resolved';
  timestamp: string;
}

interface ComplaintRecord {
  id: string;
  guestName: string;
  roomNumber: string;
  category: 'service' | 'facility' | 'cleanliness' | 'noise' | 'food' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  status: 'pending' | 'processing' | 'resolved' | 'closed';
  assignedTo: string;
  createdAt: string;
  resolvedAt?: string;
  resolution?: string;
}

interface SatisfactionMetric {
  id: string;
  category: string;
  currentScore: number;
  lastMonthScore: number;
  changeRate: number;
  totalResponses: number;
  excellentCount: number;
  goodCount: number;
  averageCount: number;
  poorCount: number;
  trend: 'up' | 'down' | 'stable';
}

// 生成更真实的满意度调查数据
function generateSurveyData(count: number): SatisfactionSurvey[] {
  const surveys: SatisfactionSurvey[] = [];
  const lastNames = ['张', '李', '王', '刘', '陈', '杨', '黄', '赵', '吴', '周', '徐', '孙', '马', '朱', '胡', '郭', '何', '高', '林', '郑'];
  const firstNames = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛', '明', '超', '秀兰', '霞', '平', '刚'];
  const roomTypes = ['标准房', '豪华房', '套房'];
  const positiveComments = [
    '房间整洁舒适，服务周到，非常满意。',
    '酒店环境优雅，员工服务态度很好。',
    '餐饮种类丰富，味道可口，很享受。',
    '设施完善，位置便利，下次还会选择。',
    '前台服务热情，入住体验很好。'
  ];
  const negativeComments = [
    '房间隔音效果一般，建议改进。',
    '空调温度调节不太灵敏。',
    '服务响应时间可以更快一些。',
    '餐厅品种可以再丰富些。',
    '价格略高，性价比一般。'
  ];
  const neutralComments = [
    '总体还不错，有待提升。',
    '基本符合预期，服务尚可。',
    '设施还算完善，服务一般。',
    '位置不错，其他方面中规中矩。',
    '性价比一般，但可以接受。'
  ];

  for (let i = 1; i <= count; i++) {
    // 生成基础评分（考虑正态分布）
    const baseScore = Math.min(5, Math.max(1, Math.round(3.8 + (Math.random() + Math.random() - 1) * 2)));
    
    // 生成各项评分（基于基础评分有小幅波动）
    const overallRating = baseScore;
    const cleanliness = Math.min(5, Math.max(1, baseScore + Math.floor(Math.random() * 3) - 1));
    const service = Math.min(5, Math.max(1, baseScore + Math.floor(Math.random() * 3) - 1));
    const facilities = Math.min(5, Math.max(1, baseScore + Math.floor(Math.random() * 3) - 1));
    const food = Math.min(5, Math.max(1, baseScore + Math.floor(Math.random() * 3) - 1));
    const value = Math.min(5, Math.max(1, baseScore + Math.floor(Math.random() * 3) - 1));

    // 生成评价内容
    let comment;
    if (baseScore >= 4) {
      comment = positiveComments[Math.floor(Math.random() * positiveComments.length)];
    } else if (baseScore <= 2) {
      comment = negativeComments[Math.floor(Math.random() * negativeComments.length)];
    } else {
      comment = neutralComments[Math.floor(Math.random() * neutralComments.length)];
    }

    // 生成房间号（楼层1-20，房间号01-20）
    const floor = Math.floor(Math.random() * 20) + 1;
    const room = Math.floor(Math.random() * 20) + 1;
    const roomNumber = `${floor.toString().padStart(2, '0')}${room.toString().padStart(2, '0')}`;

    // 生成入住日期（最近30天内）
    const checkInDate = dayjs().subtract(Math.floor(Math.random() * 30), 'days');
    const stayDays = Math.floor(Math.random() * 5) + 1;
    const checkOutDate = checkInDate.add(stayDays, 'days');

    surveys.push({
      id: i.toString().padStart(3, '0'),
      guestName: lastNames[Math.floor(Math.random() * lastNames.length)] + 
                firstNames[Math.floor(Math.random() * firstNames.length)],
      roomNumber,
      checkInDate: checkInDate.format('YYYY-MM-DD'),
      checkOutDate: checkOutDate.format('YYYY-MM-DD'),
      overallRating,
      cleanliness,
      service,
      facilities,
      food,
      value,
      comment,
      status: Math.random() > 0.7 ? 'submitted' : Math.random() > 0.5 ? 'processed' : 'resolved',
      timestamp: checkOutDate.format('YYYY-MM-DD HH:mm:ss')
    });
  }

  return surveys.sort((a, b) => dayjs(b.timestamp).unix() - dayjs(a.timestamp).unix());
}

// 生成更真实的投诉记录数据
function generateComplaintData(count: number): ComplaintRecord[] {
  const complaints: ComplaintRecord[] = [];
  const lastNames = ['张', '李', '王', '刘', '陈', '杨', '黄', '赵', '吴', '周', '徐', '孙', '马', '朱', '胡', '郭', '何', '高', '林', '郑'];
  const firstNames = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛', '明', '超', '秀兰', '霞', '平', '刚'];
  const categories: ('service' | 'facility' | 'cleanliness' | 'noise' | 'food' | 'other')[] = 
    ['service', 'facility', 'cleanliness', 'noise', 'food', 'other'];
  const severities: ('low' | 'medium' | 'high' | 'critical')[] = 
    ['low', 'medium', 'high', 'critical'];
  const staffNames = ['王经理', '李主管', '张助理', '刘组长', '陈专员'];
  
  const complaintDescriptions = {
    service: [
      '服务人员态度不够友善',
      '客房服务响应时间过长',
      '前台办理手续效率较低',
      '服务人员专业性有待提高'
    ],
    facility: [
      '空调制冷效果不佳',
      '热水供应不稳定',
      '电视信号时有时无',
      '房间设施有轻微损坏'
    ],
    cleanliness: [
      '房间未及时打扫',
      '床单存在污渍',
      '浴室清洁不够彻底',
      '地毯有异味'
    ],
    noise: [
      '邻近房间声音干扰',
      '走廊施工噪音影响休息',
      '空调外机噪音较大',
      '电梯运行声音明显'
    ],
    food: [
      '餐食口味一般',
      '菜品种类较少',
      '送餐时间过长',
      '食物温度不够热'
    ],
    other: [
      '网络连接不稳定',
      '停车位紧张',
      '发票开具延迟',
      '预订信息有误'
    ]
  };

  const resolutions = {
    service: [
      '已对相关人员进行培训，并向客人表示歉意',
      '已优化服务流程，缩短响应时间',
      '已安排专人跟进处理，客人表示满意'
    ],
    facility: [
      '已完成设备维修，恢复正常使用',
      '已更换新设备，问题得到解决',
      '已进行设施升级，改善使用体验'
    ],
    cleanliness: [
      '已重新安排保洁，并进行深度清洁',
      '已更换全新床品，确保卫生达标',
      '已完成房间消毒，解决异味问题'
    ],
    noise: [
      '已与相关方沟通，减少噪音影响',
      '已调整施工时间，避免打扰客人',
      '已进行隔音处理，改善居住体验'
    ],
    food: [
      '已调整菜品制作流程，提升品质',
      '已增加菜品种类，丰富选择',
      '已优化配送流程，确保及时送达'
    ],
    other: [
      '已升级网络设备，提升连接稳定性',
      '已优化停车管理，增加车位周转',
      '已完善预订系统，避免信息错误'
    ]
  };

  for (let i = 1; i <= count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const status: 'pending' | 'processing' | 'resolved' | 'closed' =
      Math.random() > 0.8 ? 'pending' :
      Math.random() > 0.6 ? 'processing' :
      Math.random() > 0.3 ? 'resolved' : 'closed';
    
    // 生成房间号
    const floor = Math.floor(Math.random() * 20) + 1;
    const room = Math.floor(Math.random() * 20) + 1;
    const roomNumber = `${floor.toString().padStart(2, '0')}${room.toString().padStart(2, '0')}`;

    // 生成时间
    const createdAt = dayjs().subtract(Math.floor(Math.random() * 72), 'hours');
    let resolvedAt;
    let resolution;

    if (status === 'resolved' || status === 'closed') {
      resolvedAt = dayjs(createdAt).add(Math.floor(Math.random() * 24), 'hours').format('YYYY-MM-DD HH:mm:ss');
      resolution = resolutions[category][Math.floor(Math.random() * resolutions[category].length)];
    }

    complaints.push({
      id: i.toString().padStart(3, '0'),
      guestName: lastNames[Math.floor(Math.random() * lastNames.length)] + 
                firstNames[Math.floor(Math.random() * firstNames.length)],
      roomNumber,
      category,
      severity,
      description: complaintDescriptions[category][Math.floor(Math.random() * complaintDescriptions[category].length)],
      status,
      assignedTo: staffNames[Math.floor(Math.random() * staffNames.length)],
      createdAt: createdAt.format('YYYY-MM-DD HH:mm:ss'),
      resolvedAt,
      resolution
    });
  }

  return complaints.sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix());
}

// 生成更真实的满意度指标数据
function generateMetricData(surveys: SatisfactionSurvey[]): SatisfactionMetric[] {
  const categories = ['整体满意度', '清洁卫生', '服务质量', '设施设备', '餐饮服务', '性价比'];
  const metrics: SatisfactionMetric[] = [];

  categories.forEach((category, index) => {
    // 获取当前类别的评分
    let currentScores: number[] = [];
    switch (index) {
      case 0:
        currentScores = surveys.map(s => s.overallRating);
        break;
      case 1:
        currentScores = surveys.map(s => s.cleanliness);
        break;
      case 2:
        currentScores = surveys.map(s => s.service);
        break;
      case 3:
        currentScores = surveys.map(s => s.facilities);
        break;
      case 4:
        currentScores = surveys.map(s => s.food);
        break;
      case 5:
        currentScores = surveys.map(s => s.value);
        break;
    }

    // 计算当前评分
    const currentScore = Number((currentScores.reduce((sum, score) => sum + score, 0) / currentScores.length).toFixed(1));
    
    // 生成上月评分（略低于当前评分）
    const lastMonthScore = Number((currentScore - 0.3 + Math.random() * 0.4).toFixed(1));
    
    // 计算变化率
    const changeRate = Number(((currentScore - lastMonthScore) / lastMonthScore * 100).toFixed(1));

    // 计算评分分布
    const excellentCount = currentScores.filter(score => score === 5).length;
    const goodCount = currentScores.filter(score => score === 4).length;
    const averageCount = currentScores.filter(score => score === 3).length;
    const poorCount = currentScores.filter(score => score <= 2).length;

    metrics.push({
      id: (index + 1).toString(),
      category,
      currentScore,
      lastMonthScore,
      changeRate,
      totalResponses: currentScores.length,
      excellentCount,
      goodCount,
      averageCount,
      poorCount,
      trend: changeRate > 1 ? 'up' : changeRate < -1 ? 'down' : 'stable'
    });
  });

  return metrics;
}

const GuestSatisfaction: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [surveys, setSurveys] = useState<SatisfactionSurvey[]>([]);
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);
  const [metrics, setMetrics] = useState<SatisfactionMetric[]>([]);
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

  // 模拟数据
  const mockSurveys: SatisfactionSurvey[] = [
    {
      id: '1',
      guestName: '陈美玲',
      roomNumber: '301',
      checkInDate: '2025-07-12',
      checkOutDate: '2025-08-05',
      overallRating: 5,
      cleanliness: 5,
      service: 4,
      facilities: 5,
      food: 4,
      value: 5,
      comment: '酒店环境很好，服务态度也不错，房间很干净，下次还会选择这里。',
      status: 'submitted',
      timestamp: '2025-08-05 10:30:00',
    },
    {
      id: '2',
      guestName: '刘志强',
      roomNumber: '205',
      checkInDate: '2025-07-13',
      checkOutDate: '2025-07-14',
      overallRating: 3,
      cleanliness: 4,
      service: 2,
      facilities: 3,
      food: 3,
      value: 3,
      comment: '服务响应较慢，房间设施有些老旧，但位置便利。',
      status: 'processed',
      timestamp: '2025-07-14 16:45:00',
    },
    {
      id: '3',
      guestName: '王雅婷',
      roomNumber: '408',
      checkInDate: '2025-07-10',
      checkOutDate: '2025-07-12',
      overallRating: 4,
      cleanliness: 5,
      service: 4,
      facilities: 4,
      food: 4,
      value: 4,
      comment: '整体满意，早餐种类丰富，房间隔音效果不错。',
      status: 'resolved',
      timestamp: '2025-07-12 09:15:00',
    },
    {
      id: '4',
      guestName: '张建国',
      roomNumber: '102',
      checkInDate: '2025-07-11',
      checkOutDate: '2025-07-13',
      overallRating: 5,
      cleanliness: 5,
      service: 5,
      facilities: 5,
      food: 5,
      value: 5,
      comment: '非常满意！服务周到，环境优雅，设施完善，强烈推荐！',
      status: 'submitted',
      timestamp: '2025-07-13 14:20:00',
    },
  ];

  const mockComplaints: ComplaintRecord[] = [
    {
      id: '1',
      guestName: '李小明',
      roomNumber: '306',
      category: 'service',
      severity: 'medium',
      description: '客房服务响应太慢，等了30分钟才送来毛巾。',
      status: 'resolved',
      assignedTo: '陈美玲',
      createdAt: '2025-08-05 08:30:00',
      resolvedAt: '2025-08-05 09:15:00',
      resolution: '已向客人道歉并免费提供客房服务，客人表示满意。',
    },
    {
      id: '2',
      guestName: '赵小红',
      roomNumber: '209',
      category: 'facility',
      severity: 'high',
      description: '空调不制冷，房间温度很高，影响休息。',
      status: 'processing',
      assignedTo: '张建国',
      createdAt: '2025-08-05 14:20:00',
    },
    {
      id: '3',
      guestName: '孙小华',
      roomNumber: '401',
      category: 'noise',
      severity: 'low',
      description: '隔壁房间声音较大，影响睡眠质量。',
      status: 'resolved',
      assignedTo: '刘志强',
      createdAt: '2025-07-14 22:15:00',
      resolvedAt: '2025-07-14 22:45:00',
      resolution: '已与隔壁客人沟通，问题得到解决。',
    },
    {
      id: '4',
      guestName: '周小丽',
      roomNumber: '105',
      category: 'cleanliness',
      severity: 'medium',
      description: '房间地毯有污渍，床单不够干净。',
      status: 'pending',
      assignedTo: '王雅婷',
      createdAt: '2025-08-05 11:00:00',
    },
  ];

  const mockMetrics: SatisfactionMetric[] = [
    {
      id: '1',
      category: '整体满意度',
      currentScore: 4.2,
      lastMonthScore: 4.0,
      changeRate: 5.0,
      totalResponses: 156,
      excellentCount: 89,
      goodCount: 45,
      averageCount: 18,
      poorCount: 4,
      trend: 'up',
    },
    {
      id: '2',
      category: '清洁卫生',
      currentScore: 4.5,
      lastMonthScore: 4.3,
      changeRate: 4.7,
      totalResponses: 156,
      excellentCount: 95,
      goodCount: 42,
      averageCount: 15,
      poorCount: 4,
      trend: 'up',
    },
    {
      id: '3',
      category: '服务质量',
      currentScore: 4.0,
      lastMonthScore: 4.2,
      changeRate: -4.8,
      totalResponses: 156,
      excellentCount: 78,
      goodCount: 52,
      averageCount: 20,
      poorCount: 6,
      trend: 'down',
    },
    {
      id: '4',
      category: '设施设备',
      currentScore: 4.1,
      lastMonthScore: 4.0,
      changeRate: 2.5,
      totalResponses: 156,
      excellentCount: 82,
      goodCount: 48,
      averageCount: 22,
      poorCount: 4,
      trend: 'up',
    },
    {
      id: '5',
      category: '餐饮服务',
      currentScore: 4.3,
      lastMonthScore: 4.1,
      changeRate: 4.9,
      totalResponses: 156,
      excellentCount: 88,
      goodCount: 46,
      averageCount: 18,
      poorCount: 4,
      trend: 'up',
    },
    {
      id: '6',
      category: '性价比',
      currentScore: 4.0,
      lastMonthScore: 4.0,
      changeRate: 0.0,
      totalResponses: 156,
      excellentCount: 75,
      goodCount: 55,
      averageCount: 20,
      poorCount: 6,
      trend: 'stable',
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    const surveyData = generateSurveyData(100);
    const complaintData = generateComplaintData(30);
    const metricData = generateMetricData(surveyData);

    setSurveys(surveyData);
    setComplaints(complaintData);
    setMetrics(metricData);
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

  // 生成满意度趋势图表配置
  const getSatisfactionTrendOption = () => {
    const dates = Array.from({ length: 30 }, (_, i) => {
      return dayjs().subtract(29 - i, 'days').format('MM-DD');
    });

    // 生成趋势数据
    const overallData = dates.map(() => Number((3.5 + Math.random() * 1.2).toFixed(1)));
    const cleanlinessData = dates.map(() => Number((3.8 + Math.random() * 1).toFixed(1)));
    const serviceData = dates.map(() => Number((3.6 + Math.random() * 1.1).toFixed(1)));

    return {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['整体满意度', '清洁卫生', '服务质量'],
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
        min: 1,
        max: 5,
        interval: 1,
        axisLabel: {
          formatter: '{value}分'
        }
      },
      series: [
        {
          name: '整体满意度',
          type: 'line',
          data: overallData,
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
          name: '清洁卫生',
          type: 'line',
          data: cleanlinessData,
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
          name: '服务质量',
          type: 'line',
          data: serviceData,
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

  // 生成投诉分布图表配置
  const getComplaintDistributionOption = () => {
    const categories = ['服务', '设施', '清洁', '噪音', '餐饮', '其他'];
    const severities = ['低', '中', '高', '严重'];
    
    // 生成数据
    const data = categories.map(category => {
      return severities.map(severity => {
        return complaints.filter(c => 
          getCategoryText(c.category) === category && 
          getSeverityText(c.severity) === severity
        ).length;
      });
    });

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: severities,
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
        data: categories
      },
      series: severities.map((severity, index) => ({
        name: severity,
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        data: categories.map((_, categoryIndex) => data[categoryIndex][index]),
        itemStyle: {
          color: severity === '低' ? '#52c41a' :
                severity === '中' ? '#faad14' :
                severity === '高' ? '#ff4d4f' :
                '#cf1322'
        }
      }))
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
      case 'pending':
        return 'orange';
      case 'processed':
      case 'processing':
        return 'blue';
      case 'resolved':
      case 'closed':
        return 'green';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
      case 'pending':
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      case 'processed':
      case 'processing':
        return <ExclamationCircleOutlined style={{ color: '#1890ff' }} />;
      case 'resolved':
      case 'closed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      submitted: '已提交',
      processed: '已处理',
      resolved: '已解决',
      pending: '待处理',
      processing: '处理中',
      closed: '已关闭',
    };
    return statusMap[status] || status;
  };

  const getCategoryText = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      service: '服务',
      facility: '设施',
      cleanliness: '清洁',
      noise: '噪音',
      food: '餐饮',
      other: '其他',
    };
    return categoryMap[category] || category;
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
    const severityMap: { [key: string]: string } = {
      low: '低',
      medium: '中',
      high: '高',
      critical: '严重',
    };
    return severityMap[severity] || severity;
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

  const surveyColumns = [
    {
      title: '客人信息',
      key: 'info',
      render: (_: any, record: SatisfactionSurvey) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div>
              <Text strong>{record.guestName}</Text>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              房间 {record.roomNumber} | {record.checkInDate} - {record.checkOutDate}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '整体评分',
      dataIndex: 'overallRating',
      key: 'overallRating',
      render: (rating: number) => (
        <Space>
          <Text strong style={{ fontSize: '16px' }}>{rating}</Text>
          <Rate disabled defaultValue={rating} />
        </Space>
      ),
    },
    {
      title: '清洁卫生',
      dataIndex: 'cleanliness',
      key: 'cleanliness',
      render: (rating: number) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: '服务质量',
      dataIndex: 'service',
      key: 'service',
      render: (rating: number) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: '设施设备',
      dataIndex: 'facilities',
      key: 'facilities',
      render: (rating: number) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: '餐饮服务',
      dataIndex: 'food',
      key: 'food',
      render: (rating: number) => <Rate disabled defaultValue={rating} />,
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
      render: (_: any, record: SatisfactionSurvey) => (
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

  const complaintColumns = [
    {
      title: '客人信息',
      key: 'info',
      render: (_: any, record: ComplaintRecord) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div>
              <Text strong>{record.guestName}</Text>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              房间 {record.roomNumber}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '投诉类别',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag color="blue">{getCategoryText(category)}</Tag>,
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
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => (
        <Tooltip title={description}>
          <Text style={{ maxWidth: 200, display: 'block' }} ellipsis>
            {description}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: '处理人',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
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
      render: (_: any, record: ComplaintRecord) => (
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

  const metricColumns = [
    {
      title: '评价类别',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '当前评分',
      dataIndex: 'currentScore',
      key: 'currentScore',
      render: (score: number) => (
        <Space>
          <Text strong style={{ fontSize: '16px' }}>{score}</Text>
          <Rate disabled defaultValue={Math.round(score)} />
        </Space>
      ),
    },
    {
      title: '变化率',
      key: 'change',
      render: (_: any, record: SatisfactionMetric) => (
        <Space>
          {getTrendIcon(record.trend)}
          <Text style={{ color: record.changeRate >= 0 ? '#52c41a' : '#ff4d4f' }}>
            {record.changeRate >= 0 ? '+' : ''}{record.changeRate}%
          </Text>
        </Space>
      ),
    },
    {
      title: '评价分布',
      key: 'distribution',
      render: (_: any, record: SatisfactionMetric) => (
        <Space direction="vertical" size="small">
          <Text type="secondary">优秀: {record.excellentCount}</Text>
          <Text type="secondary">良好: {record.goodCount}</Text>
          <Text type="secondary">一般: {record.averageCount}</Text>
          <Text type="secondary">较差: {record.poorCount}</Text>
        </Space>
      ),
    },
    {
      title: '总评价数',
      dataIndex: 'totalResponses',
      key: 'totalResponses',
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
  ];

  const handleViewDetails = (record: any) => {
    setSelectedItem(record);
    setDetailsModalVisible(true);
  };

  const handleExport = () => {
    Modal.success({
      title: '导出成功',
      content: '客户满意度数据已成功导出到Excel文件',
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
          <StarOutlined style={{ marginRight: 8 }} />
          客户满意度分析
        </Title>
        <Text type="secondary">
          分析客户满意度调查结果，处理客户投诉，提升服务质量
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均满意度"
              value={metrics.find(m => m.category === '整体满意度')?.currentScore || 0}
              prefix={<SmileOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix="分"
              precision={1}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="调查总数"
              value={surveys.length}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="投诉数量"
              value={complaints.length}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="解决率"
              value={Math.round((complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length / complaints.length) * 100)}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
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
          <TabPane tab="综合概览" key="overview">
            <Row gutter={16}>
              <Col span={12}>
                <Card title="满意度分布" size="small">
                  <List
                    dataSource={metrics}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          title={item.category}
                          description={`${item.totalResponses} 条评价`}
                        />
                        <div>
                          <Text strong>{item.currentScore}分</Text>
                          <br />
                          <Text type="secondary">
                            {item.changeRate >= 0 ? '+' : ''}{item.changeRate}%
                          </Text>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="最新评价" size="small">
                  <List
                    dataSource={surveys.slice(0, 5)}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar icon={<UserOutlined />} />}
                          title={item.guestName}
                          description={`房间 ${item.roomNumber}`}
                        />
                        <div>
                          <Rate disabled defaultValue={item.overallRating} />
                          <br />
                          <Text type="secondary">{item.timestamp}</Text>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="满意度调查" key="surveys">
            <Table
              columns={surveyColumns}
              dataSource={surveys}
              rowKey="id"
              loading={loading}
              rowSelection={rowSelection}
              pagination={{
                total: surveys.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          <TabPane tab="投诉处理" key="complaints">
            <Table
              columns={complaintColumns}
              dataSource={complaints}
              rowKey="id"
              loading={loading}
              pagination={{
                total: complaints.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          <TabPane tab="满意度指标" key="metrics">
            <Table
              columns={metricColumns}
              dataSource={metrics}
              rowKey="id"
              loading={loading}
              pagination={{
                total: metrics.length,
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
        title="详情信息"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedItem && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="客人姓名" span={2}>
              {selectedItem.guestName}
            </Descriptions.Item>
            <Descriptions.Item label="房间号">
              {selectedItem.roomNumber}
            </Descriptions.Item>
            {selectedItem.overallRating && (
              <Descriptions.Item label="整体评分">
                <Rate disabled defaultValue={selectedItem.overallRating} />
              </Descriptions.Item>
            )}
            {selectedItem.category && (
              <Descriptions.Item label="投诉类别">
                {getCategoryText(selectedItem.category)}
              </Descriptions.Item>
            )}
            {selectedItem.severity && (
              <Descriptions.Item label="严重程度">
                <Tag color={getSeverityColor(selectedItem.severity)}>
                  {getSeverityText(selectedItem.severity)}
                </Tag>
              </Descriptions.Item>
            )}
            {selectedItem.status && (
              <Descriptions.Item label="状态">
                <Badge
                  status={getStatusColor(selectedItem.status) as any}
                  text={getStatusText(selectedItem.status)}
                />
              </Descriptions.Item>
            )}
            {selectedItem.comment && (
              <Descriptions.Item label="评价内容" span={2}>
                {selectedItem.comment}
              </Descriptions.Item>
            )}
            {selectedItem.description && (
              <Descriptions.Item label="投诉描述" span={2}>
                {selectedItem.description}
              </Descriptions.Item>
            )}
            {selectedItem.resolution && (
              <Descriptions.Item label="处理结果" span={2}>
                {selectedItem.resolution}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="创建时间">
              {selectedItem.timestamp || selectedItem.createdAt}
            </Descriptions.Item>
            {selectedItem.resolvedAt && (
              <Descriptions.Item label="解决时间">
                {selectedItem.resolvedAt}
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
            message="选择要查看的满意度数据时间范围"
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
        title="满意度趋势分析"
        open={trendModalVisible}
        onCancel={() => setTrendModalVisible(false)}
        width={1000}
        footer={null}
      >
        <Tabs defaultActiveKey="trend">
          <TabPane tab="满意度趋势" key="trend">
            <Card>
              <ReactECharts option={getSatisfactionTrendOption()} style={{ height: 400 }} />
            </Card>
          </TabPane>
          <TabPane tab="投诉分布" key="complaints">
            <Card>
              <ReactECharts option={getComplaintDistributionOption()} style={{ height: 600 }} />
            </Card>
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default GuestSatisfaction; 