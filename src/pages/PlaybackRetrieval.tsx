import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Table,
  Tag,
  Image,
  Space,
  Typography,
  Tabs,
  Timeline,
  Badge,
  Tooltip,
  Slider,
  message,
  Modal,
  List,
  Avatar,
  Progress,
  Alert,
  Statistic,
  Divider,
  Switch,
  Radio,
  Collapse
} from 'antd';
import {
  SearchOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  FullscreenOutlined,
  DownloadOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CameraOutlined,
  FileImageOutlined,
  VideoCameraOutlined,
  SettingOutlined,
  FilterOutlined,
  ReloadOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  RobotOutlined,
  HistoryOutlined,
  StarOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

interface SearchResult {
  id: string;
  type: 'face' | 'object' | 'behavior' | 'scene';
  confidence: number;
  timestamp: string;
  location: string;
  camera: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  tags: string[];
  description: string;
}

interface SearchCriteria {
  type: string;
  keywords: string;
  timeRange: [string, string];
  location: string;
  camera: string;
  confidence: number;
}

const PlaybackRetrieval: React.FC = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // 生成当前日期的时间序列
    const generateTime = (minutesAgo: number) => {
      const time = new Date(now);
      time.setMinutes(time.getMinutes() - minutesAgo);
      return time.toISOString().slice(0, 19).replace('T', ' ');
    };
    
    return [
      {
        id: '1',
        type: 'face',
        confidence: 98.5,
        timestamp: generateTime(0),
        location: '大门入口',
        camera: '摄像头-01',
        thumbnail: 'https://via.placeholder.com/200x150/1890FF/FFFFFF?text=人脸识别',
        videoUrl: 'https://via.placeholder.com/400x300/1890FF/FFFFFF?text=视频回放',
        duration: 15,
        tags: ['VIP客户', '陈志强', '进入'],
        description: 'VIP客户陈志强进入大门'
      },
      {
        id: '2',
        type: 'behavior',
        confidence: 95.2,
        timestamp: generateTime(5),
        location: '停车场',
        camera: '摄像头-03',
        thumbnail: 'https://via.placeholder.com/200x150/52C41A/FFFFFF?text=行为分析',
        videoUrl: 'https://via.placeholder.com/400x300/52C41A/FFFFFF?text=视频回放',
        duration: 8,
        tags: ['可疑行为', '徘徊', '异常'],
        description: '检测到可疑徘徊行为'
      },
      {
        id: '3',
        type: 'object',
        confidence: 92.8,
        timestamp: generateTime(10),
        location: '电梯间',
        camera: '摄像头-02',
        thumbnail: 'https://via.placeholder.com/200x150/FAAD14/FFFFFF?text=物体识别',
        videoUrl: 'https://via.placeholder.com/400x300/FAAD14/FFFFFF?text=视频回放',
        duration: 12,
        tags: ['行李箱', '遗留物品', '需要关注'],
        description: '发现遗留行李箱'
      },
      {
        id: '4',
        type: 'face',
        confidence: 97.3,
        timestamp: generateTime(15),
        location: '餐厅',
        camera: '摄像头-05',
        thumbnail: 'https://via.placeholder.com/200x150/1890FF/FFFFFF?text=人脸识别',
        videoUrl: 'https://via.placeholder.com/400x300/1890FF/FFFFFF?text=视频回放',
        duration: 20,
        tags: ['常客', '林美玲', '用餐'],
        description: '常客林美玲在餐厅用餐'
      },
      {
        id: '5',
        type: 'behavior',
        confidence: 89.7,
        timestamp: generateTime(20),
        location: '健身房',
        camera: '摄像头-07',
        thumbnail: 'https://via.placeholder.com/200x150/52C41A/FFFFFF?text=行为分析',
        videoUrl: 'https://via.placeholder.com/400x300/52C41A/FFFFFF?text=视频回放',
        duration: 25,
        tags: ['健身', '正常活动', '会员'],
        description: '会员在健身房正常健身活动'
      },
      {
        id: '6',
        type: 'object',
        confidence: 94.1,
        timestamp: generateTime(25),
        location: '游泳池',
        camera: '摄像头-08',
        thumbnail: 'https://via.placeholder.com/200x150/FAAD14/FFFFFF?text=物体识别',
        videoUrl: 'https://via.placeholder.com/400x300/FAAD14/FFFFFF?text=视频回放',
        duration: 18,
        tags: ['游泳设备', '正常使用', '安全'],
        description: '游泳池设备正常使用状态'
      },
      {
        id: '7',
        type: 'scene',
        confidence: 96.8,
        timestamp: generateTime(30),
        location: '会议室',
        camera: '摄像头-09',
        thumbnail: 'https://via.placeholder.com/200x150/722ED1/FFFFFF?text=场景识别',
        videoUrl: 'https://via.placeholder.com/400x300/722ED1/FFFFFF?text=视频回放',
        duration: 45,
        tags: ['会议', '商务活动', '正常'],
        description: '会议室商务会议进行中'
      },
      {
        id: '8',
        type: 'face',
        confidence: 99.1,
        timestamp: generateTime(35),
        location: '前台',
        camera: '摄像头-04',
        thumbnail: 'https://via.placeholder.com/200x150/1890FF/FFFFFF?text=人脸识别',
        videoUrl: 'https://via.placeholder.com/400x300/1890FF/FFFFFF?text=视频回放',
        duration: 10,
        tags: ['新客户', '王雅婷', '办理入住'],
        description: '新客户王雅婷在前台办理入住'
      },
      {
        id: '9',
        type: 'behavior',
        confidence: 91.5,
        timestamp: generateTime(40),
        location: '走廊',
        camera: '摄像头-06',
        thumbnail: 'https://via.placeholder.com/200x150/52C41A/FFFFFF?text=行为分析',
        videoUrl: 'https://via.placeholder.com/400x300/52C41A/FFFFFF?text=视频回放',
        duration: 15,
        tags: ['正常行走', '客人', '无异常'],
        description: '客人在走廊正常行走'
      },
      {
        id: '10',
        type: 'object',
        confidence: 88.9,
        timestamp: generateTime(45),
        location: '客房',
        camera: '摄像头-10',
        thumbnail: 'https://via.placeholder.com/200x150/FAAD14/FFFFFF?text=物体识别',
        videoUrl: 'https://via.placeholder.com/400x300/FAAD14/FFFFFF?text=视频回放',
        duration: 30,
        tags: ['客房服务', '清洁用品', '正常'],
        description: '客房服务人员携带清洁用品'
      },
      {
        id: '11',
        type: 'face',
        confidence: 97.8,
        timestamp: generateTime(50),
        location: 'SPA中心',
        camera: '摄像头-11',
        thumbnail: 'https://via.placeholder.com/200x150/1890FF/FFFFFF?text=人脸识别',
        videoUrl: 'https://via.placeholder.com/400x300/1890FF/FFFFFF?text=视频回放',
        duration: 22,
        tags: ['VIP客户', '张伟杰', 'SPA服务'],
        description: 'VIP客户张伟杰享受SPA服务'
      },
      {
        id: '12',
        type: 'behavior',
        confidence: 93.2,
        timestamp: generateTime(55),
        location: '酒吧',
        camera: '摄像头-12',
        thumbnail: 'https://via.placeholder.com/200x150/52C41A/FFFFFF?text=行为分析',
        videoUrl: 'https://via.placeholder.com/400x300/52C41A/FFFFFF?text=视频回放',
        duration: 35,
        tags: ['饮酒', '社交活动', '正常'],
        description: '客人在酒吧进行社交活动'
      },
      {
        id: '13',
        type: 'scene',
        confidence: 95.6,
        timestamp: generateTime(60),
        location: '花园',
        camera: '摄像头-13',
        thumbnail: 'https://via.placeholder.com/200x150/722ED1/FFFFFF?text=场景识别',
        videoUrl: 'https://via.placeholder.com/400x300/722ED1/FFFFFF?text=视频回放',
        duration: 28,
        tags: ['户外活动', '休闲', '安全'],
        description: '客人在花园进行休闲活动'
      },
      {
        id: '14',
        type: 'face',
        confidence: 98.9,
        timestamp: generateTime(65),
        location: '商务中心',
        camera: '摄像头-14',
        thumbnail: 'https://via.placeholder.com/200x150/1890FF/FFFFFF?text=人脸识别',
        videoUrl: 'https://via.placeholder.com/400x300/1890FF/FFFFFF?text=视频回放',
        duration: 40,
        tags: ['商务人士', '李建国', '办公'],
        description: '商务人士李建国在商务中心办公'
      },
      {
        id: '15',
        type: 'object',
        confidence: 90.3,
        timestamp: generateTime(70),
        location: '洗衣房',
        camera: '摄像头-15',
        thumbnail: 'https://via.placeholder.com/200x150/FAAD14/FFFFFF?text=物体识别',
        videoUrl: 'https://via.placeholder.com/400x300/FAAD14/FFFFFF?text=视频回放',
        duration: 16,
        tags: ['洗衣设备', '维护', '正常'],
        description: '洗衣房设备正常维护状态'
      }
    ];
  });

  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    type: 'all',
    keywords: '',
    timeRange: ['', ''],
    location: 'all',
    camera: 'all',
    confidence: 80
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<SearchResult | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);

  // 统计数据
  const totalResults = searchResults.length;
  const faceResults = searchResults.filter(r => r.type === 'face').length;
  const behaviorResults = searchResults.filter(r => r.type === 'behavior').length;
  const objectResults = searchResults.filter(r => r.type === 'object').length;
  const avgConfidence = searchResults.reduce((sum, r) => sum + r.confidence, 0) / searchResults.length;

  // 检索类型分布
  const typeDistribution = [
    { value: faceResults, name: '人脸识别', itemStyle: { color: '#1890FF' } },
    { value: behaviorResults, name: '行为分析', itemStyle: { color: '#52C41A' } },
    { value: objectResults, name: '物体识别', itemStyle: { color: '#FAAD14' } }
  ];

  const typeOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}个 ({d}%)'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: typeDistribution,
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

  // 置信度分布
  const confidenceData = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
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
      data: ['85-90%', '90-95%', '95-98%', '98-99%', '99%+'],
      axisLabel: {
        color: '#666'
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#666'
      }
    },
    series: [
      {
        data: [2, 4, 5, 3, 1],
        type: 'bar',
        itemStyle: {
          color: '#1890FF'
        },
        barWidth: '60%'
      }
    ]
  };

  // 时间趋势数据
  const timeTrendData = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      axisLabel: {
        color: '#666'
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#666'
      }
    },
    series: [
      {
        name: '检索次数',
        data: [5, 8, 12, 15, 18, 10],
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#1890FF',
          width: 3
        },
        areaStyle: {
          color: 'rgba(24, 144, 255, 0.3)'
        }
      }
    ]
  };

  const handleSearch = () => {
    message.success('检索完成，找到 ' + totalResults + ' 条结果');
  };

  const handlePlayVideo = (result: SearchResult) => {
    setCurrentVideo(result);
    setIsPlaying(true);
    setIsModalVisible(true);
  };

  const handleDownload = (result: SearchResult) => {
    message.success('开始下载视频文件');
  };

  const handleFullscreen = () => {
    message.info('进入全屏模式');
  };

  const searchColumns = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => {
        const typeMap = {
          face: { color: 'blue', text: '人脸识别', icon: <UserOutlined /> },
          behavior: { color: 'green', text: '行为分析', icon: <EyeOutlined /> },
          object: { color: 'orange', text: '物体识别', icon: <FileImageOutlined /> },
          scene: { color: 'purple', text: '场景识别', icon: <CameraOutlined /> }
        };
        return (
          <Tag color={typeMap[type as keyof typeof typeMap]?.color} icon={typeMap[type as keyof typeof typeMap]?.icon}>
            {typeMap[type as keyof typeof typeMap]?.text}
          </Tag>
        );
      }
    },
    {
      title: '置信度',
      dataIndex: 'confidence',
      key: 'confidence',
      width: 120,
      render: (confidence: number) => (
        <div>
          <Progress 
            percent={confidence} 
            size="small" 
            strokeColor={confidence > 95 ? '#52C41A' : confidence > 85 ? '#FAAD14' : '#FF4D4F'}
            showInfo={false}
          />
          <Text style={{ fontSize: '12px' }}>{confidence}%</Text>
        </div>
      )
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
      render: (timestamp: string) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        let dateText = '';
        if (date.toDateString() === today.toDateString()) {
          dateText = '今天';
        } else if (date.toDateString() === yesterday.toDateString()) {
          dateText = '昨天';
        } else {
          dateText = `${date.getMonth() + 1}月${date.getDate()}日`;
        }
        
        return (
          <div>
            <div style={{ fontWeight: 'bold', color: '#1890FF' }}>{dateText}</div>
            <div style={{ color: '#666', fontSize: '12px' }}>{date.getHours().toString().padStart(2, '0')}:{date.getMinutes().toString().padStart(2, '0')}</div>
          </div>
        );
      }
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 120,
      render: (location: string) => (
        <Tag color="geekblue" icon={<CameraOutlined />}>
          {location}
        </Tag>
      )
    },
    {
      title: '摄像头',
      dataIndex: 'camera',
      key: 'camera',
      width: 120
    },
    {
      title: '时长',
      dataIndex: 'duration',
      key: 'duration',
      width: 80,
      render: (duration: number) => (
        <Tag color="cyan">
          <ClockCircleOutlined /> {duration}秒
        </Tag>
      )
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      render: (tags: string[]) => (
        <Space wrap>
          {tags.map((tag, index) => {
            let color = 'blue';
            let icon = null;
            
            // 根据标签内容设置不同的颜色和图标
            if (tag.includes('VIP') || tag.includes('常客')) {
              color = 'gold';
              icon = <StarOutlined />;
            } else if (tag.includes('异常') || tag.includes('可疑')) {
              color = 'red';
              icon = <SafetyOutlined />;
            } else if (tag.includes('新客户')) {
              color = 'green';
              icon = <UserOutlined />;
            } else if (tag.includes('商务')) {
              color = 'purple';
              icon = <SettingOutlined />;
            } else if (tag.includes('正常')) {
              color = 'cyan';
              icon = <EyeOutlined />;
            }
            
            return (
              <Tag key={index} color={color} icon={icon} style={{ margin: '2px' }}>
                {tag}
              </Tag>
            );
          })}
        </Space>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 150
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right' as const,
      render: (_: any, record: SearchResult) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<PlayCircleOutlined />}
            onClick={() => handlePlayVideo(record)}
          >
            播放
          </Button>
          <Button
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record)}
          >
            下载
          </Button>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handlePlayVideo(record)}
          >
            查看
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面标题区域 */}
      <div style={{ 
        marginBottom: 24, 
        padding: '24px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Title level={2} style={{ margin: 0, color: '#1890FF', fontSize: '28px' }}>
              <RobotOutlined style={{ marginRight: '12px' }} />
              AI智能回放检索系统
            </Title>
            <Text type="secondary" style={{ fontSize: '16px', marginTop: '8px', display: 'block' }}>
              结合AI智能检索算法，可基于人脸、物体、行为等特征精准检索，快速定位目标片段，支持多维度组合查询
            </Text>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ marginBottom: '8px' }}>
              <Switch
                checked={aiEnabled}
                onChange={setAiEnabled}
                checkedChildren="AI已启用"
                unCheckedChildren="AI已禁用"
              />
            </div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              系统状态：运行正常
            </Text>
          </div>
        </div>
      </div>
      
      {/* 系统状态提示 */}
      <Alert
        message="AI智能检索系统状态"
        description="回放检索系统运行正常，AI算法已就绪，支持人脸识别、行为分析、物体识别等多种检索方式，响应时间 < 500ms"
        type="success"
        showIcon
        icon={<ThunderboltOutlined />}
        style={{ 
          marginBottom: 24,
          borderRadius: '8px',
          border: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      />

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Statistic 
              title="检索结果总数" 
              value={totalResults} 
              prefix={<SearchOutlined style={{ color: '#1890FF' }} />}
              valueStyle={{ color: '#1890FF', fontSize: '24px' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>实时更新</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Statistic 
              title="人脸识别结果" 
              value={faceResults} 
              prefix={<UserOutlined style={{ color: '#1890FF' }} />}
              valueStyle={{ color: '#1890FF', fontSize: '24px' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Progress 
                percent={totalResults > 0 ? (faceResults / totalResults) * 100 : 0} 
                size="small" 
                showInfo={false}
                strokeColor="#1890FF"
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Statistic 
              title="行为分析结果" 
              value={behaviorResults} 
              prefix={<EyeOutlined style={{ color: '#52C41A' }} />}
              valueStyle={{ color: '#52C41A', fontSize: '24px' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Progress 
                percent={totalResults > 0 ? (behaviorResults / totalResults) * 100 : 0} 
                size="small" 
                showInfo={false}
                strokeColor="#52C41A"
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Statistic 
              title="平均置信度" 
              value={avgConfidence.toFixed(1)} 
              suffix="%" 
              prefix={<StarOutlined style={{ color: '#FAAD14' }} />}
              valueStyle={{ color: '#FAAD14', fontSize: '24px' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>AI识别精度</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 智能检索条件 */}
      <Card 
        title={
          <Space>
            <SearchOutlined style={{ color: '#1890FF' }} />
            <span>智能检索条件</span>
            <Tag color="blue">AI增强</Tag>
          </Space>
        }
        style={{ 
          marginBottom: 24,
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        extra={
          <Button 
            type="link" 
            icon={<FilterOutlined />}
            onClick={() => setAdvancedSearch(!advancedSearch)}
          >
            {advancedSearch ? '简化模式' : '高级模式'}
          </Button>
        }
      >
        <Form layout="vertical">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="检索类型">
                <Select
                  value={searchCriteria.type}
                  onChange={(value) => setSearchCriteria({ ...searchCriteria, type: value })}
                  placeholder="选择检索类型"
                  style={{ borderRadius: '8px' }}
                >
                  <Option value="all">全部类型</Option>
                  <Option value="face">人脸识别</Option>
                  <Option value="behavior">行为分析</Option>
                  <Option value="object">物体识别</Option>
                  <Option value="scene">场景识别</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="关键词">
                <Input
                  placeholder="输入关键词或描述"
                  value={searchCriteria.keywords}
                  onChange={(e) => setSearchCriteria({ ...searchCriteria, keywords: e.target.value })}
                  prefix={<SearchOutlined />}
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="时间范围">
                <RangePicker
                  showTime
                  placeholder={['开始时间', '结束时间']}
                  style={{ width: '100%', borderRadius: '8px' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="位置">
                <Select
                  value={searchCriteria.location}
                  onChange={(value) => setSearchCriteria({ ...searchCriteria, location: value })}
                  placeholder="选择位置"
                  style={{ borderRadius: '8px' }}
                >
                  <Option value="all">全部位置</Option>
                  <Option value="lobby">大门</Option>
                  <Option value="parking">停车场</Option>
                  <Option value="elevator">电梯间</Option>
                  <Option value="corridor">走廊</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          {advancedSearch && (
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="摄像头">
                  <Select
                    value={searchCriteria.camera}
                    onChange={(value) => setSearchCriteria({ ...searchCriteria, camera: value })}
                    placeholder="选择摄像头"
                    style={{ borderRadius: '8px' }}
                  >
                    <Option value="all">全部摄像头</Option>
                    <Option value="camera-01">摄像头-01</Option>
                    <Option value="camera-02">摄像头-02</Option>
                    <Option value="camera-03">摄像头-03</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={12}>
                <Form.Item label="置信度阈值">
                  <div style={{ padding: '0 12px' }}>
                    <Slider
                      min={0}
                      max={100}
                      value={searchCriteria.confidence}
                      onChange={(value) => setSearchCriteria({ ...searchCriteria, confidence: value })}
                      marks={{
                        0: '0%',
                        50: '50%',
                        80: '80%',
                        100: '100%'
                      }}
                      tooltip={{ formatter: (value) => `${value}%` }}
                    />
                  </div>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label=" ">
                  <Space>
                    <Button 
                      type="primary" 
                      icon={<SearchOutlined />} 
                      onClick={handleSearch}
                      size="large"
                      style={{ borderRadius: '8px' }}
                    >
                      开始检索
                    </Button>
                    <Button 
                      icon={<ReloadOutlined />}
                      size="large"
                      style={{ borderRadius: '8px' }}
                    >
                      重置条件
                    </Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          )}
          
          {!advancedSearch && (
            <Row>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Button 
                  type="primary" 
                  icon={<SearchOutlined />} 
                  onClick={handleSearch}
                  size="large"
                  style={{ borderRadius: '8px', minWidth: '120px' }}
                >
                  开始检索
                </Button>
              </Col>
            </Row>
          )}
        </Form>
      </Card>

      {/* 主要内容区域 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <BarChartOutlined style={{ color: '#1890FF' }} />
                <span>检索结果</span>
                <Badge count={totalResults} style={{ backgroundColor: '#1890FF' }} />
              </Space>
            }
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            bodyStyle={{ padding: '16px' }}
          >
            <Table
              columns={searchColumns}
              dataSource={searchResults}
              rowKey="id"
              pagination={{ 
                pageSize: 8,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
              }}
              scroll={{ x: 1100 }}
              size="middle"
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          {/* 检索统计 */}
          <Card 
            title={
              <Space>
                <PieChartOutlined style={{ color: '#1890FF' }} />
                <span>检索统计</span>
              </Space>
            }
            size="small"
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              marginBottom: 16
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <ReactECharts option={typeOption} style={{ height: 200 }} />
          </Card>

          {/* 置信度分布 */}
          <Card 
            title={
              <Space>
                <BarChartOutlined style={{ color: '#52C41A' }} />
                <span>置信度分布</span>
              </Space>
            }
            size="small" 
            style={{ 
              marginBottom: 16,
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <ReactECharts option={confidenceData} style={{ height: 200 }} />
          </Card>

          {/* 时间趋势 */}
          <Card 
            title={
              <Space>
                <LineChartOutlined style={{ color: '#FAAD14' }} />
                <span>检索时间趋势</span>
              </Space>
            }
            size="small" 
            style={{ 
              marginBottom: 16,
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <ReactECharts option={timeTrendData} style={{ height: 200 }} />
          </Card>
        </Col>
      </Row>

      {/* 标签页区域 */}
      <div style={{ marginTop: 24 }}>
        <Tabs 
          defaultActiveKey="1" 
          style={{ 
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <TabPane 
            tab={
              <span>
                <HistoryOutlined />
                检索历史
              </span>
            } 
            key="1"
          >
            <Card title="检索记录" style={{ borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <Timeline>
                <Timeline.Item color="green" dot={<SearchOutlined style={{ fontSize: '16px' }} />}>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>人脸识别检索 - {new Date().toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
                  </div>
                  <Text type="secondary">找到 5 条结果 • 检索条件：VIP客户，置信度 &gt; 90%</Text>
                </Timeline.Item>
                <Timeline.Item color="blue" dot={<EyeOutlined style={{ fontSize: '16px' }} />}>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>行为分析检索 - {new Date(Date.now() - 5 * 60 * 1000).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
                  </div>
                  <Text type="secondary">找到 4 条结果 • 检索条件：可疑行为，时间范围：最近1小时</Text>
                </Timeline.Item>
                <Timeline.Item color="orange" dot={<FileImageOutlined style={{ fontSize: '16px' }} />}>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>物体识别检索 - {new Date(Date.now() - 10 * 60 * 1000).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
                  </div>
                  <Text type="secondary">找到 4 条结果 • 检索条件：遗留物品，位置：电梯间</Text>
                </Timeline.Item>
                <Timeline.Item color="purple" dot={<CameraOutlined style={{ fontSize: '16px' }} />}>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>场景识别检索 - {new Date(Date.now() - 15 * 60 * 1000).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
                  </div>
                  <Text type="secondary">找到 2 条结果 • 检索条件：商务会议，位置：会议室</Text>
                </Timeline.Item>
              </Timeline>
            </Card>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <SettingOutlined />
                AI算法配置
              </span>
            } 
            key="2"
          >
            <Card title="智能检索算法参数" style={{ borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <Form layout="vertical">
                <Row gutter={[24, 16]}>
                  <Col span={12}>
                    <Form.Item label="人脸识别阈值">
                      <Slider defaultValue={0.8} min={0.5} max={1.0} step={0.05} />
                      <Text type="secondary" style={{ fontSize: '12px' }}>当前值：0.8</Text>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="行为分析敏感度">
                      <Slider defaultValue={0.7} min={0.3} max={1.0} step={0.1} />
                      <Text type="secondary" style={{ fontSize: '12px' }}>当前值：0.7</Text>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[24, 16]}>
                  <Col span={12}>
                    <Form.Item label="物体识别精度">
                      <Slider defaultValue={0.9} min={0.6} max={1.0} step={0.05} />
                      <Text type="secondary" style={{ fontSize: '12px' }}>当前值：0.9</Text>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="检索响应时间">
                      <Input addonAfter="ms" defaultValue="500" />
                      <Text type="secondary" style={{ fontSize: '12px' }}>目标：&lt; 500ms</Text>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>
                  <Button type="primary" size="large" style={{ borderRadius: '8px' }}>
                    保存配置
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </TabPane>
        </Tabs>
      </div>

      {/* 视频播放模态框 */}
      <Modal
        title={
          <Space>
            <VideoCameraOutlined style={{ color: '#1890FF' }} />
            <span>视频回放 - {currentVideo?.description || ''}</span>
          </Space>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={900}
        style={{ top: 20 }}
      >
        {currentVideo && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <img
                src={currentVideo.videoUrl}
                alt="视频播放"
                style={{ 
                  width: '100%', 
                  maxHeight: '450px', 
                  objectFit: 'cover',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              />
            </div>
            
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890FF' }}>类型</div>
                  <Tag color="blue" style={{ marginTop: '8px' }}>{currentVideo.type}</Tag>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#52C41A' }}>置信度</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '8px' }}>{currentVideo.confidence}%</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#FAAD14' }}>时长</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '8px' }}>{currentVideo.duration}秒</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#722ED1' }}>位置</div>
                  <div style={{ fontSize: '14px', marginTop: '8px' }}>{currentVideo.location}</div>
                </div>
              </Col>
            </Row>
            
            <Divider />
            
            <div style={{ textAlign: 'center' }}>
              <Space size="large">
                <Button
                  type="primary"
                  size="large"
                  icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{ borderRadius: '8px', minWidth: '100px' }}
                >
                  {isPlaying ? '暂停' : '播放'}
                </Button>
                <Button 
                  size="large" 
                  icon={<FullscreenOutlined />} 
                  onClick={handleFullscreen}
                  style={{ borderRadius: '8px', minWidth: '100px' }}
                >
                  全屏
                </Button>
                <Button 
                  size="large" 
                  icon={<DownloadOutlined />} 
                  onClick={() => handleDownload(currentVideo)}
                  style={{ borderRadius: '8px', minWidth: '100px' }}
                >
                  下载
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PlaybackRetrieval; 