import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Avatar,
  Progress,
  Alert,
  Statistic,
  Space,
  Typography,
  Tabs,
  List,
  Badge,
  Tooltip,
  Switch,
  message
} from 'antd';
import {
  UserOutlined,
  CameraOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UploadOutlined,
  SettingOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface Person {
  id: string;
  name: string;
  type: 'vip' | 'employee' | 'blacklist' | 'visitor';
  faceImage: string;
  department?: string;
  position?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'warning';
  lastSeen: string;
  recognitionCount: number;
  accuracy: number;
}

interface RecognitionRecord {
  id: string;
  personId: string;
  personName: string;
  personType: string;
  location: string;
  timestamp: string;
  confidence: number;
  action: 'granted' | 'denied' | 'warning';
  image: string;
}

// 在组件顶部添加获取当天日期的函数
function getTodayString(time = '09:00:00') {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${time}`;
}

// 常用中文姓氏和名字
const surnames = ['王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗', '梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧', '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕', '苏', '卢', '蒋', '蔡', '贾', '丁', '魏', '薛', '叶', '阎', '余', '潘', '杜', '戴', '夏', '钟', '汪', '田', '任', '姜', '范', '方', '石', '姚', '谭', '廖', '邹', '熊', '金', '陆', '郝', '孔', '白', '崔', '康', '毛', '邱', '秦', '江', '史', '顾', '侯', '邵', '孟', '龙', '万', '段', '雷', '钱', '汤', '尹', '黎', '易', '常', '武', '乔', '贺', '赖', '龚', '文'];
const givenNames = ['伟', '芳', '娜', '敏', '静', '秀英', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀兰', '霞', '平', '刚', '桂英', '鹏', '华', '丹', '萍', '红', '玉兰', '飞', '桂兰', '英', '梅', '鑫', '波', '斌', '宇', '浩', '凯', '鑫', '健', '俊', '帆', '雪', '龙', '琳', '欣', '瑞', '博', '旭', '晨', '倩', '璐', '璇', '佳', '宁', '乐', '璐', '璟', '颖', '欣怡', '梓涵', '子轩', '梓萱', '子涵', '雨欣', '嘉怡', '欣妍', '梓琪', '思涵', '宇轩', '浩然', '子墨', '雨桐', '子涵', '子豪', '子睿', '子涵', '子怡', '子涵', '子涵', '子涵', '子涵', '子涵', '子涵', '子涵', '子涵', '子涵', '子涵', '子涵', '子涵', '子涵', '子涵', '子涵', '子涵', '子涵', '子涵'];
function getRandomChineseName() {
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const given = givenNames[Math.floor(Math.random() * givenNames.length)];
  return surname + given;
}

const FacialRecognition: React.FC = () => {
  const [persons, setPersons] = useState<Person[]>([
    // VIP客户
    ...Array.from({ length: 200 }, (_, i) => ({
      id: `${i + 1}`,
      name: getRandomChineseName(),
      type: 'vip' as const,
      faceImage: process.env.PUBLIC_URL + `/images/face/${(i % 10) + 1}.jpg`,
      department: 'VIP客户',
      position: ['钻石会员', '白金会员', '金卡会员', '银卡会员', '普通会员'][i % 5],
      phone: `13${Math.floor(1000 + Math.random() * 9000)}****${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'active' as const,
      lastSeen: getTodayString(`${String(9 + (i % 8)).padStart(2, '0')}:${String(30 + (i % 30)).padStart(2, '0')}:00`),
      recognitionCount: Math.floor(20 + Math.random() * 200),
      accuracy: parseFloat((98 + Math.random() * 2).toFixed(1))
    })),
    // 员工
    ...Array.from({ length: 50 }, (_, i) => ({
      id: `${1000 + i + 1}`,
      name: getRandomChineseName(),
      type: 'employee' as const,
      faceImage: process.env.PUBLIC_URL + `/images/face/${(i % 10) + 1}.jpg`,
      department: ['客房部', '安保部', '前厅部', '餐饮部', '工程部', '财务部'][i % 6],
      position: ['部门经理', '主管', '服务员', '技师', '接待', '主厨'][i % 6],
      phone: `13${Math.floor(1000 + Math.random() * 9000)}****${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'active' as const,
      lastSeen: getTodayString(`${String(8 + (i % 10)).padStart(2, '0')}:${String(10 + (i % 50)).padStart(2, '0')}:00`),
      recognitionCount: Math.floor(10 + Math.random() * 250),
      accuracy: parseFloat((98 + Math.random() * 2).toFixed(1))
    })),
    // 黑名单
    ...Array.from({ length: 30 }, (_, i) => ({
      id: `${2000 + i + 1}`,
      name: `黑名单${i + 1}`,
      type: 'blacklist' as const,
      faceImage: process.env.PUBLIC_URL + `/images/face/${(i % 10) + 1}.jpg`,
      department: '黑名单',
      position: '禁止进入',
      phone: `13${Math.floor(1000 + Math.random() * 9000)}****${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'warning' as const,
      lastSeen: getTodayString(`${String(10 + (i % 8)).padStart(2, '0')}:${String(15 + (i % 30)).padStart(2, '0')}:00`),
      recognitionCount: Math.floor(1 + Math.random() * 10),
      accuracy: parseFloat((98 + Math.random() * 2).toFixed(1))
    })),
  ]);

  const [recognitionRecords, setRecognitionRecords] = useState<RecognitionRecord[]>([
    {
      id: '1',
      personId: '1',
      personName: '陈志强',
      personType: 'VIP客户',
      location: '大门入口',
      timestamp: getTodayString('14:30:00'),
      confidence: 99.8,
      action: 'granted',
      image: process.env.PUBLIC_URL + '/images/face/1.jpg'
    },
    {
      id: '2',
      personId: '2',
      personName: '李美华',
      personType: '员工',
      location: '员工通道',
      timestamp: getTodayString('15:45:00'),
      confidence: 99.5,
      action: 'granted',
      image: process.env.PUBLIC_URL + '/images/face/2.jpg'
    },
    {
      id: '3',
      personId: '7',
      personName: '孙伟东',
      personType: '黑名单',
      location: '大门入口',
      timestamp: getTodayString('12:15:00'),
      confidence: 99.2,
      action: 'warning',
      image: process.env.PUBLIC_URL + '/images/face/7.jpg'
    },
    {
      id: '4',
      personId: '3',
      personName: '王建国',
      personType: '员工',
      location: '安保室',
      timestamp: getTodayString('16:20:00'),
      confidence: 99.7,
      action: 'granted',
      image: process.env.PUBLIC_URL + '/images/face/3.jpg'
    },
    {
      id: '5',
      personId: '4',
      personName: '张丽娜',
      personType: '员工',
      location: '前台',
      timestamp: getTodayString('14:15:00'),
      confidence: 99.6,
      action: 'granted',
      image: process.env.PUBLIC_URL + '/images/face/4.jpg'
    },
    {
      id: '6',
      personId: '5',
      personName: '刘志明',
      personType: 'VIP客户',
      location: '电梯间',
      timestamp: getTodayString('13:45:00'),
      confidence: 99.4,
      action: 'granted',
      image: process.env.PUBLIC_URL + '/images/face/5.jpg'
    },
    {
      id: '7',
      personId: '6',
      personName: '赵雅琴',
      personType: '员工',
      location: '餐厅',
      timestamp: getTodayString('12:30:00'),
      confidence: 99.3,
      action: 'granted',
      image: process.env.PUBLIC_URL + '/images/face/6.jpg'
    },
    {
      id: '8',
      personId: '8',
      personName: '周慧敏',
      personType: 'VIP客户',
      location: '停车场',
      timestamp: getTodayString('11:20:00'),
      confidence: 99.1,
      action: 'granted',
      image: process.env.PUBLIC_URL + '/images/face/8.jpg'
    },
    {
      id: '9',
      personId: '9',
      personName: '王丽华',
      personType: 'VIP客户',
      location: '大门入口',
      timestamp: getTodayString('10:15:00'),
      confidence: 98.9,
      action: 'granted',
      image: process.env.PUBLIC_URL + '/images/face/9.jpg'
    },
    {
      id: '10',
      personId: '10',
      personName: '张伟',
      personType: 'VIP客户',
      location: '电梯间',
      timestamp: getTodayString('09:30:00'),
      confidence: 98.7,
      action: 'granted',
      image: process.env.PUBLIC_URL + '/images/face/10.jpg'
    },
    {
      id: '11',
      personId: '11',
      personName: '赵小红',
      personType: '员工',
      location: '客房部',
      timestamp: getTodayString('15:30:00'),
      confidence: 99.3,
      action: 'granted',
      image: process.env.PUBLIC_URL + '/images/face/1.jpg'
    },
    {
      id: '12',
      personId: '12',
      personName: '孙小芳',
      personType: '员工',
      location: '客房部',
      timestamp: getTodayString('15:20:00'),
      confidence: 99.1,
      action: 'granted',
      image: process.env.PUBLIC_URL + '/images/face/2.jpg'
    },
    {
      id: '13',
      personId: '13',
      personName: '李小华',
      personType: '员工',
      location: '客房部',
      timestamp: getTodayString('15:10:00'),
      confidence: 99.0,
      action: 'granted',
      image: process.env.PUBLIC_URL + '/images/face/3.jpg'
    },
    {
      id: '14',
      personId: '14',
      personName: '刘大壮',
      personType: '员工',
      location: '停车场',
      timestamp: getTodayString('16:15:00'),
      confidence: 98.8,
      action: 'granted',
      image: process.env.PUBLIC_URL + '/images/face/4.jpg'
    },
    {
      id: '15',
      personId: '15',
      personName: '陈小强',
      personType: '员工',
      location: '安保室',
      timestamp: getTodayString('16:10:00'),
      confidence: 98.6,
      action: 'granted',
      image: process.env.PUBLIC_URL + '/images/face/5.jpg'
    },
    {
      id: '16',
      personId: '16',
      personName: '王小美',
      personType: '员工',
      location: '前台',
      timestamp: getTodayString('14:05:00'),
      confidence: 98.9,
      action: 'granted',
      image: process.env.PUBLIC_URL + '/images/face/6.jpg'
    },
    {
      id: '17',
      personId: '17',
      personName: '张小丽',
      personType: '员工',
      location: '前台',
      timestamp: getTodayString('14:00:00'),
      confidence: 98.7,
      action: 'granted',
      image: process.env.PUBLIC_URL + '/images/face/7.jpg'
    },
    {
      id: '18',
      personId: '18',
      personName: '李厨师',
      personType: '员工',
      location: '厨房',
      timestamp: getTodayString('12:20:00'),
      confidence: 98.5,
      action: 'granted',
      image: process.env.PUBLIC_URL + '/images/face/8.jpg'
    },
    {
      id: '19',
      personId: '19',
      personName: '王服务员',
      personType: '员工',
      location: '餐厅',
      timestamp: getTodayString('12:15:00'),
      confidence: 98.3,
      action: 'granted',
      image: process.env.PUBLIC_URL + '/images/face/9.jpg'
    },
    {
      id: '20',
      personId: '20',
      personName: '张工程师',
      personType: '员工',
      location: '工程部',
      timestamp: getTodayString('11:45:00'),
      confidence: 98.9,
      action: 'granted',
      image: process.env.PUBLIC_URL + '/images/face/10.jpg'
    },
    {
      id: '21',
      personId: '21',
      personName: '李维修',
      personType: '员工',
      location: '工程部',
      timestamp: getTodayString('11:40:00'),
      confidence: 98.6,
      action: 'granted',
      image: process.env.PUBLIC_URL + '/images/face/1.jpg'
    },
    {
      id: '22',
      personId: '22',
      personName: '王会计',
      personType: '员工',
      location: '财务部',
      timestamp: getTodayString('11:30:00'),
      confidence: 99.2,
      action: 'granted',
      image: process.env.PUBLIC_URL + '/images/face/2.jpg'
    },
    {
      id: '23',
      personId: '23',
      personName: '赵不良',
      personType: '黑名单',
      location: '大门入口',
      timestamp: getTodayString('10:30:00'),
      confidence: 99.0,
      action: 'warning',
      image: process.env.PUBLIC_URL + '/images/face/3.jpg'
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [form] = Form.useForm();

  // 统计数据
  const totalPersons = persons.length;
  const vipPersons = persons.filter(p => p.type === 'vip').length;
  const employeePersons = persons.filter(p => p.type === 'employee').length;
  const blacklistPersons = persons.filter(p => p.type === 'blacklist').length;
  const activePersons = persons.filter(p => p.status === 'active').length;
  const warningPersons = persons.filter(p => p.status === 'warning').length;

  // 识别准确率统计
  const accuracyData = [
    { value: 99.8, name: 'VIP客户', itemStyle: { color: '#52C41A' } },
    { value: 99.6, name: '员工', itemStyle: { color: '#1890FF' } },
    { value: 99.2, name: '黑名单', itemStyle: { color: '#FAAD14' } },
    { value: 98.9, name: '访客', itemStyle: { color: '#FF4D4F' } }
  ];

  const accuracyOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}%'
    },
    series: [
      {
        type: 'pie',
        radius: '60%',
        data: accuracyData,
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

  // 识别次数趋势
  const recognitionTrendData = {
    xAxis: {
      type: 'category',
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']
    },
    yAxis: {
      type: 'value',
      name: '识别次数'
    },
    series: [
      {
        data: [8, 3, 23, 67, 89, 45, 12],
        type: 'line',
        smooth: true,
        areaStyle: {
          opacity: 0.3
        },
        lineStyle: {
          width: 3
        },
        itemStyle: {
          color: '#1890FF'
        }
      }
    ]
  };

  const handleAddPerson = () => {
    setEditingPerson(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditPerson = (person: Person) => {
    setEditingPerson(person);
    form.setFieldsValue(person);
    setIsModalVisible(true);
  };

  const handleDeletePerson = (id: string) => {
    setPersons(persons.filter(p => p.id !== id));
    message.success('删除成功');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingPerson) {
        setPersons(persons.map(p => p.id === editingPerson.id ? { ...p, ...values } : p));
        message.success('更新成功');
      } else {
        const newPerson: Person = {
          id: Date.now().toString(),
          ...values,
          faceImage: process.env.PUBLIC_URL + '/images/face/9.jpg',
          status: 'active',
          lastSeen: new Date().toLocaleString(),
          recognitionCount: 0,
          accuracy: 99.0
        };
        setPersons([...persons, newPerson]);
        message.success('添加成功');
      }
      setIsModalVisible(false);
    });
  };

  const columns = [
    {
      title: '头像',
      dataIndex: 'faceImage',
      key: 'faceImage',
      render: (image: string) => <Avatar size={64} src={image} />
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap = {
          vip: { color: 'gold', text: 'VIP客户' },
          employee: { color: 'blue', text: '员工' },
          blacklist: { color: 'red', text: '黑名单' },
          visitor: { color: 'green', text: '访客' }
        };
        return <Tag color={typeMap[type as keyof typeof typeMap]?.color}>{typeMap[type as keyof typeof typeMap]?.text}</Tag>;
      }
    },
    {
      title: '部门/职位',
      dataIndex: 'department',
      key: 'department',
      render: (department: string, record: Person) => (
        <div>
          <div>{department}</div>
          <Text type="secondary">{record.position}</Text>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          active: { color: 'green', text: '正常', icon: <CheckCircleOutlined /> },
          inactive: { color: 'default', text: '停用', icon: <ClockCircleOutlined /> },
          warning: { color: 'red', text: '警告', icon: <WarningOutlined /> }
        };
        return (
          <Tag color={statusMap[status as keyof typeof statusMap]?.color} icon={statusMap[status as keyof typeof statusMap]?.icon}>
            {statusMap[status as keyof typeof statusMap]?.text}
          </Tag>
        );
      }
    },
    {
      title: '识别准确率',
      dataIndex: 'accuracy',
      key: 'accuracy',
      render: (accuracy: number) => (
        <div>
          <Progress percent={accuracy} size="small" />
          {/* <Text>{accuracy}%</Text> */}
        </div>
      )
    },
    {
      title: '最后识别',
      dataIndex: 'lastSeen',
      key: 'lastSeen'
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Person) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleEditPerson(record)}>
            查看
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditPerson(record)}>
            编辑
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDeletePerson(record.id)}>
            删除
          </Button>
        </Space>
      )
    }
  ];

  const recordColumns = [
    {
      title: '姓名',
      dataIndex: 'personName',
      key: 'personName'
    },
    {
      title: '类型',
      dataIndex: 'personType',
      key: 'personType'
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location'
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp'
    },
    {
      title: '置信度',
      dataIndex: 'confidence',
      key: 'confidence',
      render: (confidence: number) => <Progress percent={confidence} size="small" />
    },
    {
      title: '结果',
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => {
        const actionMap = {
          granted: { color: 'green', text: '通过' },
          denied: { color: 'red', text: '拒绝' },
          warning: { color: 'orange', text: '警告' }
        };
        return <Tag color={actionMap[action as keyof typeof actionMap]?.color}>{actionMap[action as keyof typeof actionMap]?.text}</Tag>;
      }
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>人脸识别系统</Title>
      <Text type="secondary">基于AI深度学习算法，实现VIP客户自动识别、黑名单人员实时预警、员工考勤智能统计及门禁权限动态管理</Text>
      
      <Alert
        message="系统状态"
        description="人脸识别系统运行正常，识别准确率达99.5%以上，当前在线摄像头12个，实时识别中..."
        type="success"
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card>
            <Statistic title="总人数" value={totalPersons} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="VIP客户" value={vipPersons} valueStyle={{ color: '#52C41A' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="员工" value={employeePersons} valueStyle={{ color: '#1890FF' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="黑名单" value={blacklistPersons} valueStyle={{ color: '#FAAD14' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="正常状态" value={activePersons} valueStyle={{ color: '#52C41A' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="警告状态" value={warningPersons} valueStyle={{ color: '#FF4D4F' }} />
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="1">
        <TabPane tab="人员管理" key="1">
          <Card
            title="人员信息管理"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPerson}>
                添加人员
              </Button>
            }
          >
            <Table
              columns={columns}
              dataSource={persons}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="识别记录" key="2">
          <Card title="实时识别记录">
            <Table
              columns={recordColumns}
              dataSource={recognitionRecords}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="统计分析" key="3">
          <Row gutter={16}>
            <Col span={12}>
              <Card title="识别准确率分布">
                <ReactECharts option={accuracyOption} style={{ height: 300 }} />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="今日识别次数趋势">
                <ReactECharts option={recognitionTrendData} style={{ height: 300 }} />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="系统设置" key="4">
          <Card title="识别参数配置">
            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="识别阈值" name="threshold">
                    <Input placeholder="0.8" addonAfter="%" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="识别间隔" name="interval">
                    <Input placeholder="1000" addonAfter="ms" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="自动学习" name="autoLearn">
                    <Switch defaultChecked />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="实时预警" name="realTimeAlert">
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

      {/* 添加/编辑人员模态框 */}
      <Modal
        title={editingPerson ? '编辑人员' : '添加人员'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="类型" name="type" rules={[{ required: true, message: '请选择类型' }]}>
                <Select placeholder="请选择类型">
                  <Option value="vip">VIP客户</Option>
                  <Option value="employee">员工</Option>
                  <Option value="visitor">访客</Option>
                  <Option value="blacklist">黑名单</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="部门" name="department">
                <Input placeholder="请输入部门" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="职位" name="position">
                <Input placeholder="请输入职位" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="手机号" name="phone">
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item label="人脸照片" name="faceImage">
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>上传照片</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FacialRecognition; 