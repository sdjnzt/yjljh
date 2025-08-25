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
} from 'antd';
import {
  KeyOutlined,
  UserOutlined,
  LockOutlined,
  UnlockOutlined,
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
  SafetyOutlined,
  TeamOutlined,
  CalendarOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

interface AccessDevice {
  id: string;
  name: string;
  location: string;
  type: 'card' | 'fingerprint' | 'face' | 'password' | 'mobile';
  status: 'normal' | 'locked' | 'maintenance' | 'offline';
  lastAccess: string;
  authorizedUsers: number;
  deniedAttempts: number;
  battery: number;
  signal: number;
}

interface AccessUser {
  id: string;
  name: string;
  cardNumber: string;
  department: string;
  role: 'guest' | 'staff' | 'manager' | 'admin';
  status: 'active' | 'inactive' | 'expired';
  accessLevel: 'public' | 'staff' | 'restricted' | 'admin';
  validFrom: string;
  validTo: string;
  lastAccess: string;
  accessCount: number;
  position?: string; // Added for staff and manager
  purpose?: string; // Added for guest
}

interface AccessRecord {
  id: string;
  userId: string;
  userName: string;
  deviceId: string;
  deviceName: string;
  accessType: 'granted' | 'denied' | 'timeout';
  timestamp: string;
  location: string;
  reason?: string;
  userRole?: string; // Added for record
  userDepartment?: string; // Added for record
  deviceType?: string; // Added for record
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
  security: ['监控室', '机房', '财务室', '人事室', '档案室']
};

// 添加真实姓名生成
const LAST_NAMES = ['张', '李', '王', '刘', '陈', '杨', '黄', '赵', '吴', '周', '徐', '孙', '马', '朱', '胡', '郭', '何', '高', '林', '郑'];
const FIRST_NAMES = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛', '明', '超', '秀兰', '霞', '平', '刚'];

// 添加部门配置
const DEPARTMENTS = {
  frontDesk: {
    name: '前厅部',
    roles: {
      manager: ['前厅经理', '大门经理', '礼宾部经理'],
      staff: ['前台接待员', '礼宾员', '行李员', '大门助理']
    }
  },
  housekeeping: {
    name: '客房部',
    roles: {
      manager: ['客房经理', '楼层经理', '布草间经理'],
      staff: ['客房服务员', '清洁员', '布草员']
    }
  },
  restaurant: {
    name: '餐饮部',
    roles: {
      manager: ['餐饮经理', '中餐厅经理', '西餐厅经理', '宴会厅经理'],
      staff: ['服务员', '传菜员', '收银员', '调酒师', '厨师']
    }
  },
  security: {
    name: '保安部',
    roles: {
      manager: ['保安经理', '安保主管'],
      staff: ['保安员', '监控员', '巡逻员']
    }
  },
  engineering: {
    name: '工程部',
    roles: {
      manager: ['工程经理', '设备主管'],
      staff: ['维修工程师', '空调技工', '电工', '水工']
    }
  },
  finance: {
    name: '财务部',
    roles: {
      manager: ['财务经理', '会计主管'],
      staff: ['会计', '出纳', '审计员']
    }
  },
  hr: {
    name: '人事部',
    roles: {
      manager: ['人事经理', '培训经理'],
      staff: ['人事专员', '招聘专员', '培训专员']
    }
  },
  sales: {
    name: '市场营销部',
    roles: {
      manager: ['市场经理', '销售经理'],
      staff: ['市场专员', '销售代表', '客户经理']
    }
  }
};

// 修改访客类型配置的类型定义
interface GuestTypeConfig {
  title: string[];
  company?: string[];
  purpose: string[];
}

const GUEST_TYPES: { [key: string]: GuestTypeConfig } = {
  business: {
    title: ['经理', '总监', '主管', '顾问', '专员'],
    company: ['科技', '金融', '贸易', '咨询', '建筑'],
    purpose: ['商务会谈', '项目洽谈', '培训会议', '商务考察', '项目验收']
  },
  event: {
    title: ['参会者', '演讲者', '展商', '记者', '工作人员'],
    purpose: ['参加会议', '展会布展', '新闻采访', '活动策划', '现场协调']
  },
  vendor: {
    title: ['送货员', '维修工', '安装工', '技术员', '采购员'],
    company: ['物流', '设备', '装修', '食品', '日用品'],
    purpose: ['物资配送', '设备维护', '安装调试', '技术支持', '商品采购']
  }
};

const AccessControl: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState<AccessDevice[]>([]);
  const [users, setUsers] = useState<AccessUser[]>([]);
  const [records, setRecords] = useState<AccessRecord[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [deviceModalVisible, setDeviceModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('devices');
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM-DD HH:mm:ss'));
  // Remove analysisModalVisible state

  // 生成设备数据
  const generateDevices = (): AccessDevice[] => {
    const devices: AccessDevice[] = [];
    let id = 1;

    // 为每个区域生成门禁设备
    Object.entries(AREAS).forEach(([areaType, locations]) => {
      locations.forEach(location => {
        // 每个位置1-2个门禁
        const deviceCount = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < deviceCount; i++) {
          const idStr = id.toString().padStart(3, '0');
          const types: ('card' | 'fingerprint' | 'face' | 'password' | 'mobile')[] = 
            ['card', 'fingerprint', 'face', 'password', 'mobile'];
          const type = types[Math.floor(Math.random() * types.length)];
          const status = Math.random() > 0.95 ? 'maintenance' :
                        Math.random() > 0.98 ? 'offline' :
                        Math.random() > 0.99 ? 'locked' : 'normal';

          devices.push({
            id: `dev_${idStr}`,
            name: `${location}门禁-${i + 1}`,
            location,
            type,
            status,
            lastAccess: dayjs().subtract(Math.random() * 60, 'minute').format('YYYY-MM-DD HH:mm:ss'),
            authorizedUsers: Math.floor(20 + Math.random() * 100),
            deniedAttempts: Math.floor(Math.random() * 5),
            battery: Math.floor(60 + Math.random() * 40),
            signal: Math.floor(70 + Math.random() * 30)
          });
          id++;
        }
      });
    });

    return devices;
  };

  // 生成真实姓名
  const generateName = () => {
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    return lastName + firstName;
  };

  // 生成工作人员信息
  const generateStaffInfo = (role: 'manager' | 'staff') => {
    const department = Object.values(DEPARTMENTS)[Math.floor(Math.random() * Object.keys(DEPARTMENTS).length)];
    const position = department.roles[role][Math.floor(Math.random() * department.roles[role].length)];
    return {
      department: department.name,
      position
    };
  };

  // 生成访客信息
  const generateGuestInfo = () => {
    const types = Object.keys(GUEST_TYPES) as Array<keyof typeof GUEST_TYPES>;
    const type = types[Math.floor(Math.random() * types.length)];
    const guestType = GUEST_TYPES[type];
    
    const title = guestType.title[Math.floor(Math.random() * guestType.title.length)];
    const company = guestType.company ? 
                   guestType.company[Math.floor(Math.random() * guestType.company.length)] + '公司' :
                   undefined;
    const purpose = guestType.purpose[Math.floor(Math.random() * guestType.purpose.length)];
    
    return {
      type,
      title,
      company,
      purpose
    };
  };

  // 生成用户数据
  const generateUsers = (): AccessUser[] => {
    const users: AccessUser[] = [];
    const currentDate = dayjs();
    const startDate = currentDate.subtract(3, 'day'); // 从3天前开始

    // 生成管理员（5人）
    for (let i = 1; i <= 5; i++) {
      const id = i.toString().padStart(3, '0');
      const name = generateName();
      const { department, position } = generateStaffInfo('manager');
      
      users.push({
        id: `user_${id}`,
        name,
        cardNumber: `ADM${id}`,
        department,
        position,
        role: 'admin',
        status: 'active',
        accessLevel: 'admin',
        validFrom: startDate.format('YYYY-MM-DD'),
        validTo: startDate.add(2, 'year').format('YYYY-MM-DD'), // 管理员有效期2年
        lastAccess: currentDate.subtract(Math.random() * 60, 'minute').format('YYYY-MM-DD HH:mm:ss'),
        accessCount: Math.floor(500 + Math.random() * 500)
      });
    }

    // 生成经理（15人）
    for (let i = 6; i <= 20; i++) {
      const id = i.toString().padStart(3, '0');
      const name = generateName();
      const { department, position } = generateStaffInfo('manager');
      const validFrom = startDate.subtract(Math.floor(Math.random() * 2), 'day'); // 1-2天的随机偏移
      
      users.push({
        id: `user_${id}`,
        name,
        cardNumber: `MGR${id}`,
        department,
        position,
        role: 'manager',
        status: Math.random() > 0.98 ? 'inactive' : 'active',
        accessLevel: 'restricted',
        validFrom: validFrom.format('YYYY-MM-DD'),
        validTo: validFrom.add(2, 'year').format('YYYY-MM-DD'), // 经理有效期2年
        lastAccess: currentDate.subtract(Math.random() * 120, 'minute').format('YYYY-MM-DD HH:mm:ss'),
        accessCount: Math.floor(300 + Math.random() * 300)
      });
    }

    // 生成员工（130人）
    for (let i = 21; i <= 150; i++) {
      const id = i.toString().padStart(3, '0');
      const name = generateName();
      const { department, position } = generateStaffInfo('staff');
      const validFrom = startDate.subtract(Math.floor(Math.random() * 3), 'day'); // 1-3天的随机偏移
      
      users.push({
        id: `user_${id}`,
        name,
        cardNumber: `EMP${id}`,
        department,
        position,
        role: 'staff',
        status: Math.random() > 0.95 ? 'inactive' : 'active',
        accessLevel: 'staff',
        validFrom: validFrom.format('YYYY-MM-DD'),
        validTo: validFrom.add(1, 'year').format('YYYY-MM-DD'), // 员工有效期1年
        lastAccess: currentDate.subtract(Math.random() * 180, 'minute').format('YYYY-MM-DD HH:mm:ss'),
        accessCount: Math.floor(100 + Math.random() * 200)
      });
    }

    // 生成访客（50人）
    for (let i = 151; i <= 200; i++) {
      const id = i.toString().padStart(3, '0');
      const name = generateName();
      const guestInfo = generateGuestInfo();
      const validFrom = startDate.subtract(Math.floor(Math.random() * 2), 'day'); // 1-2天的随机偏移
      
      users.push({
        id: `user_${id}`,
        name,
        cardNumber: `VST${id}`,
        department: '访客',
        position: `${guestInfo.company ? guestInfo.company + ' ' : ''}${guestInfo.title}`,
        role: 'guest',
        status: Math.random() > 0.9 ? 'expired' : 'active',
        accessLevel: 'public',
        validFrom: validFrom.format('YYYY-MM-DD'),
        validTo: validFrom.add(Math.floor(Math.random() * 7) + 1, 'day').format('YYYY-MM-DD'), // 访客有效期1-7天
        lastAccess: currentDate.subtract(Math.random() * 240, 'minute').format('YYYY-MM-DD HH:mm:ss'),
        accessCount: Math.floor(1 + Math.random() * 10),
        purpose: guestInfo.purpose
      });
    }

    return users;
  };

  // 生成访问记录
  const generateRecords = (devices: AccessDevice[], users: AccessUser[]): AccessRecord[] => {
    const records: AccessRecord[] = [];
    
    // 生成1000条访问记录
    for (let i = 1; i <= 1000; i++) {
      const id = i.toString().padStart(4, '0');
      const user = users[Math.floor(Math.random() * users.length)];
      
      // 根据用户角色选择合适的设备
      let availableDevices: AccessDevice[] = [];
      if (user.role === 'admin') {
        // 管理员可以访问所有设备
        availableDevices = devices;
      } else if (user.role === 'manager') {
        // 经理可以访问除了高度机密区域外的设备
        availableDevices = devices.filter(d => !d.location.includes('机密'));
      } else if (user.role === 'staff') {
        // 员工只能访问其部门相关和公共区域的设备
        availableDevices = devices.filter(d => 
          d.location.includes('公共') || 
          d.location.includes(user.department) ||
          d.location.includes('员工')
        );
      } else {
        // 访客只能访问公共区域的设备
        availableDevices = devices.filter(d => 
          d.location.includes('公共') || 
          d.location.includes('大门') ||
          d.location.includes('会议')
        );
      }

      // 如果没有可用设备，跳过此记录
      if (availableDevices.length === 0) {
        continue;
      }

      const device = availableDevices[Math.floor(Math.random() * availableDevices.length)];

      // 生成访问时间（根据用户角色和时间段生成合理的记录）
      let timestamp = dayjs().subtract(Math.random() * 24, 'hour');
      const hour = timestamp.hour();
      
      // 调整概率：工作时间段（8-18点）访问频率更高
      if (hour < 8 || hour > 18) {
        // 非工作时间，仅特定人员可能出现
        if (user.role === 'guest' || (user.role === 'staff' && !user.department.includes('保安'))) {
          continue; // 跳过此记录，重新生成
        }
      }

      // 计算访问结果
      let accessType: 'granted' | 'denied' | 'timeout';
      let reason: string | undefined;

      if (user.status !== 'active') {
        accessType = 'denied';
        reason = '卡片已失效';
      } else if (user.role === 'guest' && !device.location.includes('公共') && !device.location.includes('会议')) {
        accessType = 'denied';
        reason = '访客无权限';
      } else if (Math.random() > 0.98) { // 2%的随机故障率
        accessType = 'timeout';
        reason = '设备响应超时';
      } else if (Math.random() > 0.99) { // 1%的随机拒绝率
        accessType = 'denied';
        reason = '系统临时故障';
      } else {
        accessType = 'granted';
      }

      records.push({
        id: `record_${id}`,
        userId: user.id,
        userName: user.name,
        deviceId: device.id,
        deviceName: device.name,
        accessType,
        timestamp: timestamp.format('YYYY-MM-DD HH:mm:ss'),
        location: device.location,
        reason,
        userRole: user.role,
        userDepartment: user.department,
        deviceType: device.type
      });
    }

    // 按时间倒序排序
    return records.sort((a, b) => dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf());
  };

  // 修改初始化数据
  useEffect(() => {
    loadData();

    // 添加时间更新定时器
    const timer = setInterval(() => {
      setCurrentTime(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadData = () => {
    setLoading(true);
    const deviceData = generateDevices();
    const userData = generateUsers();
    const recordData = generateRecords(deviceData, userData);
    
    setDevices(deviceData);
    setUsers(userData);
    setRecords(recordData);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
      case 'active':
      case 'granted':
        return 'green';
      case 'locked':
      case 'denied':
        return 'red';
      case 'maintenance':
      case 'timeout':
        return 'orange';
      case 'offline':
      case 'inactive':
      case 'expired':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
      case 'active':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'locked':
      case 'denied':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'maintenance':
      case 'timeout':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'offline':
      case 'inactive':
      case 'expired':
        return <ClockCircleOutlined style={{ color: '#d9d9d9' }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      normal: '正常',
      locked: '锁定',
      maintenance: '维护中',
      offline: '离线',
      active: '激活',
      inactive: '未激活',
      expired: '已过期',
      granted: '允许',
      denied: '拒绝',
      timeout: '超时',
    };
    return statusMap[status] || status;
  };

  const getTypeText = (type: string) => {
    const typeMap: { [key: string]: string } = {
      card: '刷卡',
      fingerprint: '指纹',
      face: '人脸识别',
      password: '密码',
      mobile: '手机',
    };
    return typeMap[type] || type;
  };

  const getRoleText = (role: string) => {
    const roleMap: { [key: string]: string } = {
      guest: '客人',
      staff: '员工',
      manager: '经理',
      admin: '管理员',
    };
    return roleMap[role] || role;
  };

  const getAccessLevelText = (level: string) => {
    const levelMap: { [key: string]: string } = {
      public: '公共区域',
      staff: '员工区域',
      restricted: '受限区域',
      admin: '管理区域',
    };
    return levelMap[level] || level;
  };

  const deviceColumns = [
    {
      title: '设备信息',
      key: 'info',
      render: (_: any, record: AccessDevice) => (
        <Space>
          <Avatar size="large" icon={<KeyOutlined />} />
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
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color="blue">{getTypeText(type)}</Tag>,
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
      title: '授权用户',
      dataIndex: 'authorizedUsers',
      key: 'authorizedUsers',
    },
    {
      title: '拒绝次数',
      dataIndex: 'deniedAttempts',
      key: 'deniedAttempts',
      render: (value: number) => (
        <Text style={{ color: value > 0 ? '#ff4d4f' : '#52c41a' }}>
          {value}
        </Text>
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
            strokeColor={value > 80 ? '#52c41a' : value > 60 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '信号强度',
      dataIndex: 'signal',
      key: 'signal',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 80 ? '#52c41a' : value > 60 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: AccessDevice) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
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

  // 修改用户列表列配置
  const userColumns = [
    {
      title: '用户信息',
      key: 'info',
      render: (_: any, record: AccessUser) => (
        <Space>
          <Avatar size="large" icon={<UserOutlined />} />
          <div>
            <div>
              <Text strong>{record.name}</Text>
              <Tag style={{ marginLeft: 8 }} color={
                record.role === 'admin' ? 'red' :
                record.role === 'manager' ? 'purple' :
                record.role === 'staff' ? 'blue' : 'default'
              }>{record.position}</Tag>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.cardNumber} | {record.department}
              {record.purpose && <Tag style={{ marginLeft: 8 }} color="cyan">{record.purpose}</Tag>}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => <Tag color="purple">{getRoleText(role)}</Tag>,
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
      title: '访问级别',
      dataIndex: 'accessLevel',
      key: 'accessLevel',
      render: (level: string) => <Tag color="cyan">{getAccessLevelText(level)}</Tag>,
    },
    {
      title: '有效期',
      key: 'validity',
      render: (_: any, record: AccessUser) => (
        <div>
          <div>{record.validFrom}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>至 {record.validTo}</div>
        </div>
      ),
    },
    {
      title: '访问次数',
      dataIndex: 'accessCount',
      key: 'accessCount',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: AccessUser) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  // 修改访问记录列配置
  const recordColumns = [
    {
      title: '访问信息',
      key: 'info',
      render: (_: unknown, record: AccessRecord) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <div>
            <div>
              <Text strong>{record.userName}</Text>
              <Tag style={{ marginLeft: 8 }} color={
                record.userRole === 'admin' ? 'red' :
                record.userRole === 'manager' ? 'purple' :
                record.userRole === 'staff' ? 'blue' : 'default'
              }>{record.userDepartment}</Tag>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.deviceName}
              <Tag style={{ marginLeft: 8 }} color="blue">{record.deviceType ? getTypeText(record.deviceType) : '未知'}</Tag>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '访问结果',
      key: 'result',
      render: (_: Record<string, unknown>, record: AccessRecord) => (
        <Space direction="vertical" size="small">
          <Badge
            status={getStatusColor(record.accessType) as any}
            text={getStatusText(record.accessType)}
          />
          {record.reason && (
            <Text type="danger" style={{ fontSize: '12px' }}>{record.reason}</Text>
          )}
        </Space>
      ),
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text: string) => (
        <Space direction="vertical" size={0}>
          <div>{dayjs(text).format('YYYY-MM-DD')}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{dayjs(text).format('HH:mm:ss')}</div>
        </Space>
      ),
    }
  ];

  const handleViewDetails = (record: any) => {
    setSelectedItem(record);
    setDetailsModalVisible(true);
  };

  const handleSettings = (record: any) => {
    setDeviceModalVisible(true);
  };

  const handleEditUser = (record: any) => {
    setUserModalVisible(true);
  };

  const handleExport = () => {
    Modal.success({
      title: '导出成功',
      content: '门禁系统数据已成功导出到Excel文件',
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

  const rowSelection = {
    selectedRowKeys: selectedItems,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedItems(selectedRowKeys as string[]);
    },
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2}>
              <KeyOutlined style={{ marginRight: 8 }} />
              通行管理
            </Title>
            <Text type="secondary">
              管理酒店门禁设备、用户权限和访问记录
            </Text>
          </Col>
          {/* Remove data analysis button */}
        </Row>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="门禁设备"
              value={devices.length}
              prefix={<KeyOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线设备"
              value={devices.filter(d => d.status === 'normal').length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="授权用户"
              value={users.filter(u => u.status === 'active').length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日访问"
              value={records.filter(r => dayjs(r.timestamp).isAfter(dayjs().startOf('day'))).length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
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
            刷新状态
          </Button>
          <Button
            icon={<PlusOutlined />}
            onClick={() => setDeviceModalVisible(true)}
          >
            添加设备
          </Button>
          <Button
            icon={<TeamOutlined />}
            onClick={() => setUserModalVisible(true)}
          >
            添加用户
          </Button>
          {/* Remove data analysis button */}
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
      </Card>

      {/* 主要内容区域 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="设备管理" key="devices">
            <Table
              columns={deviceColumns}
              dataSource={devices}
              rowKey="id"
              loading={loading}
              rowSelection={rowSelection}
              pagination={{
                total: devices.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          <TabPane tab="用户管理" key="users">
            <Table
              columns={userColumns}
              dataSource={users}
              rowKey="id"
              loading={loading}
              pagination={{
                total: users.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          <TabPane tab="访问记录" key="records">
            <Table
              columns={recordColumns}
              dataSource={records}
              rowKey="id"
              loading={loading}
              pagination={{
                total: records.length,
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
            {selectedItem.type && (
              <Descriptions.Item label="类型">
                {getTypeText(selectedItem.type)}
              </Descriptions.Item>
            )}
            {selectedItem.authorizedUsers && (
              <Descriptions.Item label="授权用户">
                {selectedItem.authorizedUsers}
              </Descriptions.Item>
            )}
            {selectedItem.deniedAttempts && (
              <Descriptions.Item label="拒绝次数">
                {selectedItem.deniedAttempts}
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

      {/* 设备设置模态框 */}
      <Modal
        title="设备设置"
        open={deviceModalVisible}
        onCancel={() => setDeviceModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setDeviceModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => {
            message.success('设置已保存');
            setDeviceModalVisible(false);
          }}>
            保存
          </Button>,
        ]}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="设备名称" name="name">
            <Input placeholder="请输入设备名称" />
          </Form.Item>
          <Form.Item label="位置" name="location">
            <Input placeholder="请输入设备位置" />
          </Form.Item>
          <Form.Item label="设备类型" name="type">
            <Select placeholder="请选择设备类型">
              <Select.Option value="card">刷卡</Select.Option>
              <Select.Option value="fingerprint">指纹</Select.Option>
              <Select.Option value="face">人脸识别</Select.Option>
              <Select.Option value="password">密码</Select.Option>
              <Select.Option value="mobile">手机</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="设备状态" name="status">
            <Select placeholder="请选择设备状态">
              <Select.Option value="normal">正常</Select.Option>
              <Select.Option value="locked">锁定</Select.Option>
              <Select.Option value="maintenance">维护中</Select.Option>
              <Select.Option value="offline">离线</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 用户管理模态框 */}
      <Modal
        title="用户管理"
        open={userModalVisible}
        onCancel={() => setUserModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setUserModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => {
            message.success('用户信息已保存');
            setUserModalVisible(false);
          }}>
            保存
          </Button>,
        ]}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="姓名" name="name">
            <Input placeholder="请输入用户姓名" />
          </Form.Item>
          <Form.Item label="卡号" name="cardNumber">
            <Input placeholder="请输入卡号" />
          </Form.Item>
          <Form.Item label="部门" name="department">
            <Input placeholder="请输入部门" />
          </Form.Item>
          <Form.Item label="角色" name="role">
            <Select placeholder="请选择角色">
              <Select.Option value="guest">客人</Select.Option>
              <Select.Option value="staff">员工</Select.Option>
              <Select.Option value="manager">经理</Select.Option>
              <Select.Option value="admin">管理员</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="访问级别" name="accessLevel">
            <Select placeholder="请选择访问级别">
              <Select.Option value="public">公共区域</Select.Option>
              <Select.Option value="staff">员工区域</Select.Option>
              <Select.Option value="restricted">受限区域</Select.Option>
              <Select.Option value="admin">管理区域</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="有效期" name="validity">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AccessControl; 