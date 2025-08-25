// 模拟数据文件
export interface Device {
  id: string;
  name: string;
  type: 'camera' | 'phone' | 'sensor' | 'controller';
  status: 'online' | 'offline' | 'warning';
  location: string;
  lastUpdate: string;
  battery?: number;
  signal?: number;
}

export interface OrganizationUnit {
  id: string;
  name: string;
  type: 'department' | 'team' | 'group';
  parentId?: string;
  manager: string;
  managerPhone?: string;
  memberCount: number;
  description?: string;
  location?: string;
  establishedDate?: string;
  budget?: number;
  children?: OrganizationUnit[];
}

export interface User {
  id: string;
  name: string;
  department: string;
  role: string;
  phone: string;
  email?: string;
  status: 'online' | 'offline' | 'busy';
  avatar?: string;
  joinDate?: string;
  supervisor?: string;
  level?: '初级' | '中级' | '高级' | '专家';
  workLocation?: string;
  employeeId?: string;
}

export interface Command {
  id: string;
  title: string;
  content: string;
  sender: string;
  receiver: string;
  status: 'pending' | 'sent' | 'received' | 'completed';
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface SafetyEvent {
  id: string;
  type: 'fire' | 'gas' | 'intrusion' | 'emergency';
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'investigating';
  timestamp: string;
  description: string;
}

export interface DataRecord {
  id: string;
  deviceId: string;
  deviceName: string;
  dataType: 'temperature' | 'humidity' | 'pressure' | 'vibration' | 'voltage';
  value: number;
  unit: string;
  timestamp: string;
  location: string;
}

export interface InspectionRecord {
  id: string;
  title: string;
  type: 'routine' | 'special' | 'emergency' | 'annual';
  inspector: string;
  department: string;
  location: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledDate: string;
  completedDate?: string;
  score?: number;
  issuesFound: number;
  rectificationItems: number;
  description: string;
  remarks?: string;
}

export interface RectificationItem {
  id: string;
  inspectionId: string;
  title: string;
  description: string;
  category: 'safety' | 'equipment' | 'process' | 'environment' | 'documentation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'verified' | 'closed';
  assignee: string;
  department: string;
  dueDate: string;
  createdDate: string;
  completedDate?: string;
  verifiedDate?: string;
  progress: number;
  cost?: number;
  remarks?: string;
}

// 设备数据
export const devices: Device[] = [
  // 高清摄像头系列
  {
    id: 'dev001',
    name: '4K高清摄像头-停车场',
    type: 'camera',
    status: 'online',
    location: '生产车间A区1号生产线',
    lastUpdate: '2025-08-05 14:30:00',
    battery: 85,
    signal: 95,
  },
  {
    id: 'dev002',
    name: '红外夜视摄像头-门岗东',
    type: 'camera',
    status: 'online',
    location: '厂区东门岗哨监控点',
    lastUpdate: '2025-08-05 14:29:30',
    battery: 91,
    signal: 96,
  },
  {
    id: 'dev003',
    name: '360度全景摄像头-中央',
    type: 'camera',
    status: 'online',
    location: '生产车间中央监控塔',
    lastUpdate: '2025-08-05 14:30:15',
    battery: 78,
    signal: 89,
  },
  {
    id: 'dev004',
    name: '防爆摄像头-危险区域A07',
    type: 'camera',
    status: 'warning',
    location: '化学品存储区A-07货架',
    lastUpdate: '2025-08-05 14:28:45',
    battery: 56,
    signal: 82,
  },
  {
    id: 'dev005',
    name: '高速球形摄像头-围墙北',
    type: 'camera',
    status: 'online',
    location: '厂区北围墙监控塔3号',
    lastUpdate: '2025-08-05 14:30:10',
    battery: 94,
    signal: 91,
  },
  {
    id: 'dev006',
    name: '智能AI摄像头-出入口',
    type: 'camera',
    status: 'online',
    location: '主厂房出入口闸机处',
    lastUpdate: '2025-08-05 14:29:50',
    battery: 88,
    signal: 93,
  },
  
  // 语音对讲设备系列
  {
    id: 'dev007',
    name: '5G无线对讲机-班长01',
    type: 'phone',
    status: 'online',
    location: '生产车间A区班长岗位',
    lastUpdate: '2025-08-05 14:29:00',
    battery: 92,
    signal: 98,
  },
  {
    id: 'dev008',
    name: '防水对讲机-维修组长',
    type: 'phone',
    status: 'online',
    location: '设备维修间工具台',
    lastUpdate: '2025-08-05 14:29:45',
    battery: 82,
    signal: 85,
  },
  {
    id: 'dev009',
    name: '车载对讲终端-叉车01',
    type: 'phone',
    status: 'online',
    location: '仓库B区3号叉车',
    lastUpdate: '2025-08-05 14:30:20',
    battery: 71,
    signal: 79,
  },
  {
    id: 'dev010',
    name: '桌面调度终端-控制室',
    type: 'phone',
    status: 'online',
    location: '中央控制室调度台',
    lastUpdate: '2025-08-05 14:30:00',
    signal: 98,
  },
  {
    id: 'dev011',
    name: '应急通信终端-安全部',
    type: 'phone',
    status: 'online',
    location: '安全管理部值班室',
    lastUpdate: '2025-08-05 14:29:50',
    battery: 95,
    signal: 94,
  },
  {
    id: 'dev012',
    name: '便携式对讲机-巡检员',
    type: 'phone',
    status: 'online',
    location: '厂区巡检路线B段',
    lastUpdate: '2025-08-05 14:28:30',
    battery: 64,
    signal: 87,
  },
  
  // 传感器设备系列
  {
    id: 'dev013',
    name: '温湿度传感器-车间A1',
    type: 'sensor',
    status: 'online',
    location: '生产车间A区1号检测点',
    lastUpdate: '2025-08-05 14:28:00',
    battery: 76,
    signal: 87,
  },
  {
    id: 'dev014',
    name: '烟雾报警器-仓库B3',
    type: 'sensor',
    status: 'online',
    location: '仓库B区3号货架顶部',
    lastUpdate: '2025-08-05 14:29:55',
    battery: 68,
    signal: 83,
  },
  {
    id: 'dev015',
    name: '可燃气体检测仪-化学区',
    type: 'sensor',
    status: 'warning',
    location: '化学品处理区域西南角',
    lastUpdate: '2025-08-05 14:25:00',
    battery: 45,
    signal: 76,
  },
  {
    id: 'dev016',
    name: '振动监测仪-设备01',
    type: 'sensor',
    status: 'online',
    location: '主要生产设备机台01轴承',
    lastUpdate: '2025-08-05 14:29:40',
    battery: 88,
    signal: 90,
  },
  {
    id: 'dev017',
    name: '压力传感器-主管道A',
    type: 'sensor',
    status: 'online',
    location: '主管道A段3号监测点',
    lastUpdate: '2025-08-05 14:30:05',
    battery: 72,
    signal: 86,
  },
  {
    id: 'dev018',
    name: '噪声监测仪-车间中央',
    type: 'sensor',
    status: 'online',
    location: '生产车间中央噪声检测点',
    lastUpdate: '2025-08-05 14:29:25',
    battery: 81,
    signal: 84,
  },
  
  // 控制器设备系列
  {
    id: 'dev019',
    name: '智能照明控制器-车间A',
    type: 'controller',
    status: 'online',
    location: '生产车间A区照明控制柜',
    lastUpdate: '2025-08-05 14:30:00',
    battery: 100,
    signal: 95,
  },
  {
    id: 'dev020',
    name: '中央空调控制终端-办公区',
    type: 'controller',
    status: 'online',
    location: '办公楼C座空调机房',
    lastUpdate: '2025-08-05 14:29:30',
    battery: 92,
    signal: 89,
  },
  {
    id: 'dev021',
    name: '门禁控制器-主入口',
    type: 'controller',
    status: 'online',
    location: '办公楼主入口门禁系统',
    lastUpdate: '2025-08-05 14:30:10',
    battery: 87,
    signal: 93,
  },
  {
    id: 'dev022',
    name: '生产线PLC控制器-A1',
    type: 'controller',
    status: 'warning',
    location: '生产线A1电控柜',
    lastUpdate: '2025-08-05 14:25:00',
    battery: 45,
    signal: 78,
  },
  {
    id: 'dev023',
    name: '应急广播控制器-全厂',
    type: 'controller',
    status: 'online',
    location: '应急指挥中心广播室',
    lastUpdate: '2025-08-05 14:30:00',
    battery: 98,
    signal: 97,
  },
  {
    id: 'dev024',
    name: '消防联动控制器-主楼',
    type: 'controller',
    status: 'offline',
    location: '主办公楼消防控制室',
    lastUpdate: '2025-08-05 13:45:00',
    battery: 0,
    signal: 0,
  },
];

// 用户数据 - 山东金科星机电股份有限公司
export const users: User[] = [
  // 总经理办公室
  {
    id: 'user001',
    name: '赵建华',
    department: '总经理办公室',
    role: '总经理',
    phone: '13800138001',
    email: 'zhao.jianhua@jinkexing.com',
    status: 'online',
    joinDate: '2020-01-01',
    supervisor: '',
    level: '专家',
    workLocation: '行政楼3楼',
    employeeId: 'JKX001',
  },
  {
    id: 'user002',
    name: '李秘书',
    department: '总经理办公室',
    role: '总经理秘书',
    phone: '13800138002',
    email: 'li.mishu@jinkexing.com',
    status: 'online',
    joinDate: '2020-03-15',
    supervisor: '赵建华',
    level: '高级',
    workLocation: '行政楼3楼301',
    employeeId: 'JKX002',
  },
  {
    id: 'user003',
    name: '王文博',
    department: '总经理办公室',
    role: '战略规划师',
    phone: '13800138003',
    email: 'wang.wenbo@jinkexing.com',
    status: 'busy',
    joinDate: '2020-06-01',
    supervisor: '赵建华',
    level: '高级',
    workLocation: '行政楼3楼302',
    employeeId: 'JKX003',
  },

  // 生产制造部
  {
    id: 'user004',
    name: '张伟民',
    department: '生产制造部',
    role: '生产总监',
    phone: '13800138010',
    email: 'zhang.weimin@jinkexing.com',
    status: 'online',
    joinDate: '2020-01-01',
    supervisor: '赵建华',
    level: '专家',
    workLocation: '生产厂区A区',
    employeeId: 'JKX010',
  },
  {
    id: 'user005',
    name: '李国强',
    department: '生产制造部',
    role: '机械加工车间主任',
    phone: '13800138011',
    email: 'li.guoqiang@jinkexing.com',
    status: 'online',
    joinDate: '2020-02-01',
    supervisor: '张伟民',
    level: '高级',
    workLocation: '生产厂区A区1号车间',
    employeeId: 'JKX011',
  },
  {
    id: 'user006',
    name: '王建军',
    department: '生产制造部',
    role: '电气装配车间主任',
    phone: '13800138012',
    email: 'wang.jianjun@jinkexing.com',
    status: 'online',
    joinDate: '2020-02-15',
    supervisor: '张伟民',
    level: '高级',
    workLocation: '生产厂区A区2号车间',
    employeeId: 'JKX012',
  },
  {
    id: 'user007',
    name: '陈质检',
    department: '生产制造部',
    role: '质检科长',
    phone: '13800138013',
    email: 'chen.zhijian@jinkexing.com',
    status: 'busy',
    joinDate: '2020-03-01',
    supervisor: '张伟民',
    level: '高级',
    workLocation: '生产厂区A区质检中心',
    employeeId: 'JKX013',
  },
  {
    id: 'user008',
    name: '刘维护',
    department: '生产制造部',
    role: '设备维护主管',
    phone: '13800138014',
    email: 'liu.weihu@jinkexing.com',
    status: 'online',
    joinDate: '2020-04-01',
    supervisor: '张伟民',
    level: '中级',
    workLocation: '生产厂区A区维修中心',
    employeeId: 'JKX014',
  },
  {
    id: 'user009',
    name: '马仓储',
    department: '生产制造部',
    role: '仓储主管',
    phone: '13800138015',
    email: 'ma.cangchu@jinkexing.com',
    status: 'online',
    joinDate: '2020-05-01',
    supervisor: '张伟民',
    level: '中级',
    workLocation: '生产厂区B区仓库',
    employeeId: 'JKX015',
  },
  {
    id: 'user010',
    name: '孙操作',
    department: '生产制造部',
    role: '机床操作员',
    phone: '13800138016',
    email: 'sun.caozuo@jinkexing.com',
    status: 'online',
    joinDate: '2021-01-15',
    supervisor: '李国强',
    level: '中级',
    workLocation: '生产厂区A区1号车间',
    employeeId: 'JKX016',
  },
  {
    id: 'user011',
    name: '周装配',
    department: '生产制造部',
    role: '电气装配工',
    phone: '13800138017',
    email: 'zhou.zhuangpei@jinkexing.com',
    status: 'online',
    joinDate: '2021-02-01',
    supervisor: '王建军',
    level: '中级',
    workLocation: '生产厂区A区2号车间',
    employeeId: 'JKX017',
  },
  {
    id: 'user012',
    name: '吴检验',
    department: '生产制造部',
    role: '质量检验员',
    phone: '13800138018',
    email: 'wu.jianyan@jinkexing.com',
    status: 'busy',
    joinDate: '2021-03-01',
    supervisor: '陈质检',
    level: '初级',
    workLocation: '生产厂区A区质检中心',
    employeeId: 'JKX018',
  },

  // 技术研发部
  {
    id: 'user013',
    name: '陈志远',
    department: '技术研发部',
    role: '技术总监',
    phone: '13800138020',
    email: 'chen.zhiyuan@jinkexing.com',
    status: 'online',
    joinDate: '2020-01-01',
    supervisor: '赵建华',
    level: '专家',
    workLocation: '研发楼2-3楼',
    employeeId: 'JKX020',
  },
  {
    id: 'user014',
    name: '王设计',
    department: '技术研发部',
    role: '机械设计主管',
    phone: '13800138021',
    email: 'wang.sheji@jinkexing.com',
    status: 'online',
    joinDate: '2020-02-01',
    supervisor: '陈志远',
    level: '高级',
    workLocation: '研发楼2楼201',
    employeeId: 'JKX021',
  },
  {
    id: 'user015',
    name: '李电气',
    department: '技术研发部',
    role: '电气工程师',
    phone: '13800138022',
    email: 'li.dianqi@jinkexing.com',
    status: 'busy',
    joinDate: '2020-03-01',
    supervisor: '陈志远',
    level: '高级',
    workLocation: '研发楼2楼202',
    employeeId: 'JKX022',
  },
  {
    id: 'user016',
    name: '张软件',
    department: '技术研发部',
    role: '软件工程师',
    phone: '13800138023',
    email: 'zhang.ruanjian@jinkexing.com',
    status: 'online',
    joinDate: '2020-04-01',
    supervisor: '陈志远',
    level: '高级',
    workLocation: '研发楼3楼301',
    employeeId: 'JKX023',
  },
  {
    id: 'user017',
    name: '刘测试',
    department: '技术研发部',
    role: '测试工程师',
    phone: '13800138024',
    email: 'liu.ceshi@jinkexing.com',
    status: 'online',
    joinDate: '2020-05-01',
    supervisor: '陈志远',
    level: '中级',
    workLocation: '研发楼1楼实验室',
    employeeId: 'JKX024',
  },

  // 销售市场部
  {
    id: 'user018',
    name: '刘营销',
    department: '销售市场部',
    role: '销售总监',
    phone: '13800138030',
    email: 'liu.yingxiao@jinkexing.com',
    status: 'online',
    joinDate: '2020-01-01',
    supervisor: '赵建华',
    level: '专家',
    workLocation: '行政楼2楼',
    employeeId: 'JKX030',
  },
  {
    id: 'user019',
    name: '王华北',
    department: '销售市场部',
    role: '华北区经理',
    phone: '13800138031',
    email: 'wang.huabei@jinkexing.com',
    status: 'busy',
    joinDate: '2020-02-01',
    supervisor: '刘营销',
    level: '高级',
    workLocation: '行政楼2楼201',
    employeeId: 'JKX031',
  },
  {
    id: 'user020',
    name: '李华东',
    department: '销售市场部',
    role: '华东区经理',
    phone: '13800138032',
    email: 'li.huadong@jinkexing.com',
    status: 'online',
    joinDate: '2020-03-01',
    supervisor: '刘营销',
    level: '高级',
    workLocation: '行政楼2楼202',
    employeeId: 'JKX032',
  },
  {
    id: 'user021',
    name: '陈华南',
    department: '销售市场部',
    role: '华南区经理',
    phone: '13800138033',
    email: 'chen.huanan@jinkexing.com',
    status: 'online',
    joinDate: '2020-04-01',
    supervisor: '刘营销',
    level: '高级',
    workLocation: '行政楼2楼203',
    employeeId: 'JKX033',
  },
  {
    id: 'user022',
    name: '张市场',
    department: '销售市场部',
    role: '市场主管',
    phone: '13800138034',
    email: 'zhang.shichang@jinkexing.com',
    status: 'online',
    joinDate: '2020-05-01',
    supervisor: '刘营销',
    level: '中级',
    workLocation: '行政楼2楼204',
    employeeId: 'JKX034',
  },

  // 安全环保部
  {
    id: 'user023',
    name: '马安全',
    department: '安全环保部',
    role: '安全总监',
    phone: '13800138040',
    email: 'ma.anquan@jinkexing.com',
    status: 'online',
    joinDate: '2020-01-01',
    supervisor: '赵建华',
    level: '专家',
    workLocation: '安全楼1-2楼',
    employeeId: 'JKX040',
  },
  {
    id: 'user024',
    name: '孙管理',
    department: '安全环保部',
    role: '安全管理主管',
    phone: '13800138041',
    email: 'sun.guanli@jinkexing.com',
    status: 'online',
    joinDate: '2020-02-01',
    supervisor: '马安全',
    level: '高级',
    workLocation: '安全楼1楼',
    employeeId: 'JKX041',
  },
  {
    id: 'user025',
    name: '周环保',
    department: '安全环保部',
    role: '环保主管',
    phone: '13800138042',
    email: 'zhou.huanbao@jinkexing.com',
    status: 'busy',
    joinDate: '2020-03-01',
    supervisor: '马安全',
    level: '高级',
    workLocation: '安全楼2楼',
    employeeId: 'JKX042',
  },
  {
    id: 'user026',
    name: '吴应急',
    department: '安全环保部',
    role: '应急主管',
    phone: '13800138043',
    email: 'wu.yingji@jinkexing.com',
    status: 'online',
    joinDate: '2020-04-01',
    supervisor: '马安全',
    level: '中级',
    workLocation: '安全楼1楼应急中心',
    employeeId: 'JKX043',
  },

  // 人力资源部
  {
    id: 'user027',
    name: '孙人力',
    department: '人力资源部',
    role: '人力资源总监',
    phone: '13800138050',
    email: 'sun.renli@jinkexing.com',
    status: 'online',
    joinDate: '2020-01-01',
    supervisor: '赵建华',
    level: '专家',
    workLocation: '行政楼1楼',
    employeeId: 'JKX050',
  },
  {
    id: 'user028',
    name: '刘招聘',
    department: '人力资源部',
    role: '招聘主管',
    phone: '13800138051',
    email: 'liu.zhaopin@jinkexing.com',
    status: 'online',
    joinDate: '2020-02-01',
    supervisor: '孙人力',
    level: '高级',
    workLocation: '行政楼1楼101',
    employeeId: 'JKX051',
  },
  {
    id: 'user029',
    name: '王薪酬',
    department: '人力资源部',
    role: '薪酬主管',
    phone: '13800138052',
    email: 'wang.xinchou@jinkexing.com',
    status: 'busy',
    joinDate: '2020-03-01',
    supervisor: '孙人力',
    level: '高级',
    workLocation: '行政楼1楼102',
    employeeId: 'JKX052',
  },
  {
    id: 'user030',
    name: '陈员工',
    department: '人力资源部',
    role: '员工关系主管',
    phone: '13800138053',
    email: 'chen.yuangong@jinkexing.com',
    status: 'online',
    joinDate: '2020-04-01',
    supervisor: '孙人力',
    level: '中级',
    workLocation: '行政楼1楼103',
    employeeId: 'JKX053',
  },

  // 财务管理部
  {
    id: 'user031',
    name: '周财务',
    department: '财务管理部',
    role: '财务总监',
    phone: '13800138060',
    email: 'zhou.caiwu@jinkexing.com',
    status: 'online',
    joinDate: '2020-01-01',
    supervisor: '赵建华',
    level: '专家',
    workLocation: '行政楼1楼',
    employeeId: 'JKX060',
  },
  {
    id: 'user032',
    name: '吴会计',
    department: '财务管理部',
    role: '会计主管',
    phone: '13800138061',
    email: 'wu.kuaiji@jinkexing.com',
    status: 'busy',
    joinDate: '2020-02-01',
    supervisor: '周财务',
    level: '高级',
    workLocation: '行政楼1楼104',
    employeeId: 'JKX061',
  },
  {
    id: 'user033',
    name: '郑成本',
    department: '财务管理部',
    role: '成本主管',
    phone: '13800138062',
    email: 'zheng.chengben@jinkexing.com',
    status: 'online',
    joinDate: '2020-03-01',
    supervisor: '周财务',
    level: '高级',
    workLocation: '行政楼1楼105',
    employeeId: 'JKX062',
  },
  {
    id: 'user034',
    name: '黄资金',
    department: '财务管理部',
    role: '资金主管',
    phone: '13800138063',
    email: 'huang.zijin@jinkexing.com',
    status: 'online',
    joinDate: '2020-04-01',
    supervisor: '周财务',
    level: '中级',
    workLocation: '行政楼1楼106',
    employeeId: 'JKX063',
  },

  // 信息技术部
  {
    id: 'user035',
    name: '郑技术',
    department: '信息技术部',
    role: '信息技术总监',
    phone: '13800138070',
    email: 'zheng.jishu@jinkexing.com',
    status: 'online',
    joinDate: '2020-01-01',
    supervisor: '赵建华',
    level: '专家',
    workLocation: '研发楼1楼',
    employeeId: 'JKX070',
  },
  {
    id: 'user036',
    name: '韩开发',
    department: '信息技术部',
    role: '开发主管',
    phone: '13800138071',
    email: 'han.kaifa@jinkexing.com',
    status: 'busy',
    joinDate: '2020-02-01',
    supervisor: '郑技术',
    level: '高级',
    workLocation: '研发楼1楼101',
    employeeId: 'JKX071',
  },
  {
    id: 'user037',
    name: '冯运维',
    department: '信息技术部',
    role: '运维主管',
    phone: '13800138072',
    email: 'feng.yunwei@jinkexing.com',
    status: 'online',
    joinDate: '2020-03-01',
    supervisor: '郑技术',
    level: '高级',
    workLocation: '研发楼1楼102',
    employeeId: 'JKX072',
  },
  {
    id: 'user038',
    name: '谢数据',
    department: '信息技术部',
    role: '数据分析师',
    phone: '13800138073',
    email: 'xie.shuju@jinkexing.com',
    status: 'online',
    joinDate: '2020-04-01',
    supervisor: '郑技术',
    level: '中级',
    workLocation: '研发楼1楼103',
    employeeId: 'JKX073',
  },
  {
    id: 'user011',
    name: '何维修',
    department: '技术研发部',
    role: '设备维修工',
    phone: '13800138011',
    status: 'online',
  },
  
  // 管理部门
  {
    id: 'user012',
    name: '朱经理',
    department: '综合管理部',
    role: '部门经理',
    phone: '13800138012',
    status: 'online',
  },
  {
    id: 'user013',
    name: '林调度',
    department: '综合管理部',
    role: '调度员',
    phone: '13800138013',
    status: 'online',
  },
  {
    id: 'user014',
    name: '高监控',
    department: '综合管理部',
    role: '监控值班员',
    phone: '13800138014',
    status: 'online',
  },
  
  // 后勤保障
  {
    id: 'user015',
    name: '钱后勤',
    department: '后勤保障部',
    role: '后勤主管',
    phone: '13800138015',
    status: 'online',
  },
  {
    id: 'user016',
    name: '孔仓管',
    department: '后勤保障部',
    role: '仓库管理员',
    phone: '13800138016',
    status: 'busy',
  },
  {
    id: 'user017',
    name: '严巡检',
    department: '后勤保障部',
    role: '设施巡检员',
    phone: '13800138017',
    status: 'online',
  },
  
  // 夜班人员
  {
    id: 'user018',
    name: '龙夜班',
    department: '生产部',
    role: '夜班班长',
    phone: '13800138018',
    status: 'offline',
  },
  {
    id: 'user019',
    name: '白值班',
    department: '安全管理部',
    role: '夜班安全员',
    phone: '13800138019',
    status: 'offline',
  },
  {
    id: 'user020',
    name: '夜保安',
    department: '综合管理部',
    role: '夜班保安',
    phone: '13800138020',
    status: 'offline',
  },
];

// 指挥调度数据
export const commands: Command[] = [
  {
    id: 'cmd001',
    title: '紧急集合通知',
    content: '请各车间负责人立即到会议室集合，有重要事项讨论',
    sender: '张主任',
    receiver: '全体车间主任',
    status: 'sent',
    timestamp: '2025-08-05 14:30:00',
    priority: 'urgent',
  },
  {
    id: 'cmd002',
    title: '设备检查指令',
    content: '请检查A区生产设备运行状态，确保安全生产。重点关注5号生产线液压系统压力值，如有异常立即上报。',
    sender: '李工程师',
    receiver: '王技术员',
    status: 'received',
    timestamp: '2025-08-05 14:25:00',
    priority: 'high',
  },
  {
    id: 'cmd003',
    title: '安全巡检通知',
    content: '请各区域安全员进行例行安全巡检，特别关注消防设施和应急通道畅通情况',
    sender: '赵安全员',
    receiver: '安全员团队',
    status: 'completed',
    timestamp: '2025-08-05 14:20:00',
    priority: 'medium',
  },
  {
    id: 'cmd004',
    title: '原料供应协调',
    content: 'B区生产线原料库存不足，请物流部门紧急补充化工原料，预计需求量500公斤，确保明日正常生产。',
    sender: '陈生产主管',
    receiver: '物流部门',
    status: 'pending',
    timestamp: '2025-08-05 14:18:00',
    priority: 'high',
  },
  {
    id: 'cmd005',
    title: '设备维护计划',
    content: '3号压缩机定期保养时间到，安排在今晚20:00停机维护，预计维护时间4小时，请做好生产调度安排。',
    sender: '维护部',
    receiver: 'C区生产组',
    status: 'sent',
    timestamp: '2025-08-05 14:15:00',
    priority: 'medium',
  },
  {
    id: 'cmd006',
    title: '质量检验通知',
    content: '第24批次产品已下线，请质检部门尽快安排检验，重点关注产品密度和纯度指标。',
    sender: '刘主管',
    receiver: '质检部',
    status: 'completed',
    timestamp: '2025-08-05 14:12:00',
    priority: 'medium',
  },
  {
    id: 'cmd007',
    title: '环保数据上报',
    content: '本月环保监测数据需在今日16:00前完成整理并上报环保局，请环保专员抓紧时间完成。',
    sender: '环保部',
    receiver: '孙环保专员',
    status: 'received',
    timestamp: '2025-08-05 14:08:00',
    priority: 'high',
  },
  {
    id: 'cmd008',
    title: '员工培训安排',
    content: '新入职员工安全培训定于明日上午9:00在培训中心举行，请各部门安排新员工准时参加。',
    sender: '人事部',
    receiver: '各部门主管',
    status: 'sent',
    timestamp: '2025-08-05 14:05:00',
    priority: 'medium',
  },
  {
    id: 'cmd009',
    title: '紧急停产指令',
    content: '接上级通知，因特殊天气原因，所有露天作业立即停止，人员撤至安全区域。恢复作业时间另行通知。',
    sender: '应急指挥中心',
    receiver: '全体作业人员',
    status: 'sent',
    timestamp: '2025-08-05 14:02:00',
    priority: 'urgent',
  },
  {
    id: 'cmd010',
    title: '库存盘点任务',
    content: '月末库存盘点工作启动，各仓管员请按照盘点清单对所负责区域进行全面盘点，确保账实相符。',
    sender: '仓储部',
    receiver: '各仓管员',
    status: 'pending',
    timestamp: '2025-08-05 14:00:00',
    priority: 'low',
  },
  {
    id: 'cmd011',
    title: '网络系统维护',
    content: '今晚22:00-23:00进行网络系统升级维护，期间可能影响生产系统使用，请各部门提前做好准备。',
    sender: 'IT部门',
    receiver: '各部门',
    status: 'sent',
    timestamp: '2025-08-05 13:58:00',
    priority: 'medium',
  },
  {
    id: 'cmd012',
    title: '消防演练通知',
    content: '定于本周四下午15:00举行全厂消防应急演练，请各部门配合演练工作，听到警报声立即按预案执行。',
    sender: '安全部',
    receiver: '全体员工',
    status: 'pending',
    timestamp: '2025-08-05 13:55:00',
    priority: 'high',
  },
  {
    id: 'cmd013',
    title: '设备故障处理',
    content: 'A区2号反应釜温控系统出现异常，显示温度偏高，请维修人员立即前往现场检查处理。',
    sender: '中控室',
    receiver: '设备维修组',
    status: 'received',
    timestamp: '2025-08-05 13:52:00',
    priority: 'urgent',
  },
  {
    id: 'cmd014',
    title: '产品出货安排',
    content: '客户A订单的产品已检验合格，安排明日上午装车发货，请物流部门协调运输车辆。',
    sender: '销售部',
    receiver: '物流部门',
    status: 'completed',
    timestamp: '2025-08-05 13:50:00',
    priority: 'medium',
  },
  {
    id: 'cmd015',
    title: '用电安全检查',
    content: '近期用电负荷较高，请电工班对各车间配电设施进行全面检查，确保用电安全。',
    sender: '动力部',
    receiver: '电工班',
    status: 'sent',
    timestamp: '2025-08-05 13:48:00',
    priority: 'high',
  },
  {
    id: 'cmd016',
    title: '废料处理指令',
    content: '生产过程中产生的废料已达到处理临界点，请环保部门联系有资质的处理机构进行无害化处理。',
    sender: '生产部',
    receiver: '环保部',
    status: 'pending',
    timestamp: '2025-08-05 13:45:00',
    priority: 'medium',
  },
  {
    id: 'cmd017',
    title: '班组交接检查',
    content: '夜班交接时发现B区设备运行参数异常，请接班人员重点关注并做好记录，如有问题及时汇报。',
    sender: '夜班班长',
    receiver: '早班班长',
    status: 'completed',
    timestamp: '2025-08-05 13:42:00',
    priority: 'medium',
  },
  {
    id: 'cmd018',
    title: '客户投诉处理',
    content: '收到客户对上批产品质量的投诉，请质检部门和技术部门联合调查，48小时内给出处理方案。',
    sender: '客服部',
    receiver: '质检部,技术部',
    status: 'received',
    timestamp: '2025-08-05 13:40:00',
    priority: 'high',
  },
  {
    id: 'cmd019',
    title: '能耗监控报告',
    content: '本月用电量超出预算15%，请各车间节约用电，非必要设备及时关闭，减少能耗浪费。',
    sender: '能源管理部',
    receiver: '各车间主任',
    status: 'sent',
    timestamp: '2025-08-05 13:38:00',
    priority: 'low',
  },
  {
    id: 'cmd020',
    title: '应急物资补充',
    content: '应急救援物资库存偏低，请采购部门紧急采购防毒面具、急救包等应急物资，确保应急准备充足。',
    sender: '应急管理部',
    receiver: '采购部门',
    status: 'pending',
    timestamp: '2025-08-05 13:35:00',
    priority: 'high',
  },
];

// 安全事件数据
export const safetyEvents: SafetyEvent[] = [
  {
    id: 'evt001',
    type: 'gas',
    location: '化学品存储区A-07',
    severity: 'high',
    status: 'investigating',
    timestamp: '2025-08-05 14:15:00',
    description: '可燃气体检测仪报警，检测到甲烷浓度超标，现场已疏散人员，正在排查泄漏源',
  },
  {
    id: 'evt002',
    type: 'fire',
    location: '主办公楼配电室',
    severity: 'critical',
    status: 'active',
    timestamp: '2025-08-05 14:10:00',
    description: '配电室烟雾报警器触发，现场发现电缆起火，消防系统已自动启动，消防队正在赶来',
  },
  {
    id: 'evt003',
    type: 'intrusion',
    location: '厂区东门岗哨',
    severity: 'low',
    status: 'resolved',
    timestamp: '2025-08-05 13:45:00',
    description: '门禁系统检测到未授权刷卡尝试，经核实为新员工首日上班忘记激活门禁卡',
  },
  {
    id: 'evt004',
    type: 'emergency',
    location: '生产车间A区1号生产线',
    severity: 'medium',
    status: 'investigating',
    timestamp: '2025-08-05 13:30:00',
    description: '设备异常停机，疑似机械故障，维修人员正在现场检查，暂停该生产线作业',
  },
  {
    id: 'evt005',
    type: 'gas',
    location: '危化品仓库B区',
    severity: 'low',
    status: 'resolved',
    timestamp: '2025-08-05 12:20:00',
    description: '氨气浓度轻微超标，经检查为通风系统滤网堵塞，已清理并恢复正常',
  },
  {
    id: 'evt006',
    type: 'intrusion',
    location: '仓库B区3号货架',
    severity: 'medium',
    status: 'resolved',
    timestamp: '2025-08-05 11:15:00',
    description: '红外监控发现夜间有人员在非工作时间进入仓库，经查证为夜班员工加班处理紧急订单',
  },
  {
    id: 'evt007',
    type: 'fire',
    location: '生产车间B区焊接工位',
    severity: 'low',
    status: 'resolved',
    timestamp: '2025-08-05 10:30:00',
    description: '焊接作业时火花引燃附近杂物，现场人员及时扑灭，无人员受伤，已加强现场管理',
  },
  {
    id: 'evt008',
    type: 'emergency',
    location: '办公楼C座电梯',
    severity: 'medium',
    status: 'resolved',
    timestamp: '2025-08-05 09:45:00',
    description: '电梯突然停电困人，应急响应小组5分钟内到达现场，手动开门救出3名被困人员',
  },
  {
    id: 'evt009',
    type: 'gas',
    location: '锅炉房',
    severity: 'high',
    status: 'resolved',
    timestamp: '2025-07-14 16:20:00',
    description: '天然气管道接头处发现微量泄漏，已紧急关闭阀门并更换密封件，系统重新投运正常',
  },
  {
    id: 'evt010',
    type: 'intrusion',
    location: '厂区围墙北段',
    severity: 'high',
    status: 'resolved',
    timestamp: '2025-07-14 02:30:00',
    description: '周界报警系统触发，监控发现有人翻越围墙，保安已赶到现场处理并报警',
  },
];

// 数据记录
export const dataRecords: DataRecord[] = [
  // 温湿度数据
  {
    id: 'data001',
    deviceId: 'dev013',
    deviceName: '温湿度传感器-车间A1',
    dataType: 'temperature',
    value: 25.6,
    unit: '°C',
    timestamp: '2025-08-05 14:30:00',
    location: '生产车间A区1号检测点',
  },
  {
    id: 'data002',
    deviceId: 'dev013',
    deviceName: '温湿度传感器-车间A1',
    dataType: 'humidity',
    value: 65.2,
    unit: '%',
    timestamp: '2025-08-05 14:30:00',
    location: '生产车间A区1号检测点',
  },
  {
    id: 'data003',
    deviceId: 'dev014',
    deviceName: '烟雾报警器-仓库B3',
    dataType: 'temperature',
    value: 22.8,
    unit: '°C',
    timestamp: '2025-08-05 14:29:55',
    location: '仓库B区3号货架顶部',
  },
  {
    id: 'data004',
    deviceId: 'dev014',
    deviceName: '烟雾报警器-仓库B3',
    dataType: 'humidity',
    value: 58.9,
    unit: '%',
    timestamp: '2025-08-05 14:29:55',
    location: '仓库B区3号货架顶部',
  },
  
  // 压力数据
  {
    id: 'data005',
    deviceId: 'dev017',
    deviceName: '压力传感器-主管道A',
    dataType: 'pressure',
    value: 2.45,
    unit: 'MPa',
    timestamp: '2025-08-05 14:30:05',
    location: '主管道A段3号监测点',
  },
  {
    id: 'data006',
    deviceId: 'dev017',
    deviceName: '压力传感器-主管道A',
    dataType: 'pressure',
    value: 2.48,
    unit: 'MPa',
    timestamp: '2025-08-05 14:25:05',
    location: '主管道A段3号监测点',
  },
  
  // 振动数据
  {
    id: 'data007',
    deviceId: 'dev016',
    deviceName: '振动监测仪-设备01',
    dataType: 'vibration',
    value: 1.82,
    unit: 'mm/s',
    timestamp: '2025-08-05 14:29:40',
    location: '主要生产设备机台01轴承',
  },
  {
    id: 'data008',
    deviceId: 'dev016',
    deviceName: '振动监测仪-设备01',
    dataType: 'vibration',
    value: 1.75,
    unit: 'mm/s',
    timestamp: '2025-08-05 14:24:40',
    location: '主要生产设备机台01轴承',
  },
  
  // 电压数据
  {
    id: 'data009',
    deviceId: 'dev022',
    deviceName: '生产线PLC控制器-A1',
    dataType: 'voltage',
    value: 220.5,
    unit: 'V',
    timestamp: '2025-08-05 14:29:00',
    location: '生产线A1电控柜',
  },
  {
    id: 'data010',
    deviceId: 'dev019',
    deviceName: '智能照明控制器-车间A',
    dataType: 'voltage',
    value: 380.2,
    unit: 'V',
    timestamp: '2025-08-05 14:30:00',
    location: '生产车间A区照明控制柜',
  },
  {
    id: 'data011',
    deviceId: 'dev020',
    deviceName: '中央空调控制终端-办公区',
    dataType: 'voltage',
    value: 380.8,
    unit: 'V',
    timestamp: '2025-08-05 14:29:30',
    location: '办公楼C座空调机房',
  },
  
  // 历史数据记录
  {
    id: 'data012',
    deviceId: 'dev013',
    deviceName: '温湿度传感器-车间A1',
    dataType: 'temperature',
    value: 24.8,
    unit: '°C',
    timestamp: '2025-08-05 14:25:00',
    location: '生产车间A区1号检测点',
  },
  {
    id: 'data013',
    deviceId: 'dev013',
    deviceName: '温湿度传感器-车间A1',
    dataType: 'humidity',
    value: 63.7,
    unit: '%',
    timestamp: '2025-08-05 14:25:00',
    location: '生产车间A区1号检测点',
  },
  {
    id: 'data014',
    deviceId: 'dev015',
    deviceName: '可燃气体检测仪-化学区',
    dataType: 'pressure',
    value: 1.01,
    unit: 'kPa',
    timestamp: '2025-08-05 14:25:00',
    location: '化学品处理区域西南角',
  },
  {
    id: 'data015',
    deviceId: 'dev018',
    deviceName: '噪声监测仪-车间中央',
    dataType: 'vibration',
    value: 75.6,
    unit: 'dB',
    timestamp: '2025-08-05 14:29:25',
    location: '生产车间中央噪声检测点',
  },
  
  // 温度趋势数据
  {
    id: 'data016',
    deviceId: 'dev013',
    deviceName: '温湿度传感器-车间A1',
    dataType: 'temperature',
    value: 26.2,
    unit: '°C',
    timestamp: '2025-08-05 14:20:00',
    location: '生产车间A区1号检测点',
  },
  {
    id: 'data017',
    deviceId: 'dev013',
    deviceName: '温湿度传感器-车间A1',
    dataType: 'temperature',
    value: 25.1,
    unit: '°C',
    timestamp: '2025-08-05 14:15:00',
    location: '生产车间A区1号检测点',
  },
  {
    id: 'data018',
    deviceId: 'dev013',
    deviceName: '温湿度传感器-车间A1',
    dataType: 'temperature',
    value: 24.9,
    unit: '°C',
    timestamp: '2025-08-05 14:10:00',
    location: '生产车间A区1号检测点',
  },
  
  // 更多设备数据
  {
    id: 'data019',
    deviceId: 'dev017',
    deviceName: '压力传感器-主管道A',
    dataType: 'pressure',
    value: 2.52,
    unit: 'MPa',
    timestamp: '2025-08-05 14:20:05',
    location: '主管道A段3号监测点',
  },
  {
    id: 'data020',
    deviceId: 'dev016',
    deviceName: '振动监测仪-设备01',
    dataType: 'vibration',
    value: 1.91,
    unit: 'mm/s',
    timestamp: '2025-08-05 14:19:40',
    location: '主要生产设备机台01轴承',
  },
];

// 组织架构数据 - 山东金科星机电股份有限公司
export const organizationUnits: OrganizationUnit[] = [
  {
    id: 'dept001',
    name: '总经理办公室',
    type: 'department',
    manager: '赵总',
    managerPhone: '13800138001',
    memberCount: 8,
    description: '负责公司战略规划、综合管理和对外协调',
    location: '行政楼3楼',
    establishedDate: '2020-01-01',
    budget: 2000000,
    children: [
      {
        id: 'team001',
        name: '总经理秘书处',
        type: 'team',
        parentId: 'dept001',
        manager: '秘书长',
        managerPhone: '13800138002',
        memberCount: 3,
        description: '负责总经理日常事务和会议安排',
        location: '行政楼3楼301',
      },
      {
        id: 'team002',
        name: '企业战略部',
        type: 'team',
        parentId: 'dept001',
        manager: '战略主管',
        managerPhone: '13800138003',
        memberCount: 5,
        description: '负责企业发展战略制定和实施',
        location: '行政楼3楼302',
      },
    ],
  },
  {
    id: 'dept002',
    name: '生产制造部',
    type: 'department',
    manager: '张部长',
    managerPhone: '13800138010',
    memberCount: 156,
    description: '负责产品生产制造和质量管控',
    location: '生产厂区A区',
    establishedDate: '2020-01-01',
    budget: 15000000,
    children: [
      {
        id: 'team003',
        name: '机械加工车间',
        type: 'team',
        parentId: 'dept002',
        manager: '李车间主任',
        managerPhone: '13800138011',
        memberCount: 45,
        description: '负责机械零部件加工制造',
        location: '生产厂区A区1号车间',
      },
      {
        id: 'team004',
        name: '电气装配车间',
        type: 'team',
        parentId: 'dept002',
        manager: '王车间主任',
        managerPhone: '13800138012',
        memberCount: 38,
        description: '负责电气设备装配和调试',
        location: '生产厂区A区2号车间',
      },
      {
        id: 'team005',
        name: '质量检验科',
        type: 'team',
        parentId: 'dept002',
        manager: '质检科长',
        managerPhone: '13800138013',
        memberCount: 25,
        description: '负责产品质量检验和认证',
        location: '生产厂区A区质检中心',
      },
      {
        id: 'team006',
        name: '设备维护组',
        type: 'team',
        parentId: 'dept002',
        manager: '设备主管',
        managerPhone: '13800138014',
        memberCount: 22,
        description: '负责生产设备维护和保养',
        location: '生产厂区A区维修中心',
      },
      {
        id: 'team007',
        name: '物料仓储组',
        type: 'team',
        parentId: 'dept002',
        manager: '仓储主管',
        managerPhone: '13800138015',
        memberCount: 26,
        description: '负责原材料和成品仓储管理',
        location: '生产厂区B区仓库',
      },
    ],
  },
  {
    id: 'dept003',
    name: '技术研发部',
    type: 'department',
    manager: '陈部长',
    managerPhone: '13800138020',
    memberCount: 48,
    description: '负责产品技术研发和创新',
    location: '研发楼2-3楼',
    establishedDate: '2020-01-01',
    budget: 8000000,
    children: [
      {
        id: 'team008',
        name: '机械设计组',
        type: 'team',
        parentId: 'dept003',
        manager: '机械设计主管',
        managerPhone: '13800138021',
        memberCount: 15,
        description: '负责机械产品设计和优化',
        location: '研发楼2楼201',
      },
      {
        id: 'team009',
        name: '电气研发组',
        type: 'team',
        parentId: 'dept003',
        manager: '电气主管',
        managerPhone: '13800138022',
    memberCount: 18,
        description: '负责电气系统研发和控制',
        location: '研发楼2楼202',
      },
      {
        id: 'team010',
        name: '软件开发组',
        type: 'team',
        parentId: 'dept003',
        manager: '软件主管',
        managerPhone: '13800138023',
        memberCount: 12,
        description: '负责工业软件和控制系统开发',
        location: '研发楼3楼301',
      },
      {
        id: 'team011',
        name: '实验测试组',
        type: 'team',
        parentId: 'dept003',
        manager: '测试主管',
        managerPhone: '13800138024',
        memberCount: 8,
        description: '负责产品测试和验证',
        location: '研发楼1楼实验室',
      },
    ],
  },
  {
    id: 'dept004',
    name: '销售市场部',
    type: 'department',
    manager: '刘部长',
    managerPhone: '13800138030',
    memberCount: 32,
    description: '负责产品销售和市场推广',
    location: '行政楼2楼',
    establishedDate: '2020-01-01',
    budget: 5000000,
    children: [
      {
        id: 'team012',
        name: '华北销售区',
        type: 'team',
        parentId: 'dept004',
        manager: '华北区经理',
        managerPhone: '13800138031',
        memberCount: 8,
        description: '负责华北地区销售业务',
        location: '行政楼2楼201',
      },
      {
        id: 'team013',
        name: '华东销售区',
        type: 'team',
        parentId: 'dept004',
        manager: '华东区经理',
        managerPhone: '13800138032',
        memberCount: 10,
        description: '负责华东地区销售业务',
        location: '行政楼2楼202',
      },
      {
        id: 'team014',
        name: '华南销售区',
        type: 'team',
        parentId: 'dept004',
        manager: '华南区经理',
        managerPhone: '13800138033',
        memberCount: 7,
        description: '负责华南地区销售业务',
        location: '行政楼2楼203',
      },
      {
        id: 'team015',
        name: '市场推广组',
        type: 'team',
        parentId: 'dept004',
        manager: '市场主管',
        managerPhone: '13800138034',
        memberCount: 7,
        description: '负责品牌推广和市场活动',
        location: '行政楼2楼204',
      },
    ],
  },
  {
    id: 'dept005',
    name: '安全环保部',
    type: 'department',
    manager: '马部长',
    managerPhone: '13800138040',
    memberCount: 28,
    description: '负责生产安全和环境保护',
    location: '安全楼1-2楼',
    establishedDate: '2020-01-01',
    budget: 3000000,
    children: [
      {
        id: 'team016',
        name: '安全管理组',
        type: 'team',
        parentId: 'dept005',
        manager: '安全主管',
        managerPhone: '13800138041',
        memberCount: 15,
        description: '负责安全制度建设和监督执行',
        location: '安全楼1楼',
      },
      {
        id: 'team017',
        name: '环保监测组',
        type: 'team',
        parentId: 'dept005',
        manager: '环保主管',
        managerPhone: '13800138042',
        memberCount: 8,
        description: '负责环境监测和治理',
        location: '安全楼2楼',
      },
      {
        id: 'team018',
        name: '应急救援组',
        type: 'team',
        parentId: 'dept005',
        manager: '应急主管',
        managerPhone: '13800138043',
        memberCount: 5,
        description: '负责应急预案和救援工作',
        location: '安全楼1楼应急中心',
      },
    ],
  },
  {
    id: 'dept006',
    name: '人力资源部',
    type: 'department',
    manager: '孙部长',
    managerPhone: '13800138050',
    memberCount: 16,
    description: '负责人力资源管理和企业文化建设',
    location: '行政楼1楼',
    establishedDate: '2020-01-01',
    budget: 2500000,
    children: [
      {
        id: 'team019',
        name: '招聘培训组',
        type: 'team',
        parentId: 'dept006',
        manager: '招聘主管',
        managerPhone: '13800138051',
        memberCount: 6,
        description: '负责人员招聘和培训管理',
        location: '行政楼1楼101',
      },
      {
        id: 'team020',
        name: '薪酬绩效组',
        type: 'team',
        parentId: 'dept006',
        manager: '薪酬主管',
        managerPhone: '13800138052',
        memberCount: 5,
        description: '负责薪酬设计和绩效管理',
        location: '行政楼1楼102',
      },
      {
        id: 'team021',
        name: '员工关系组',
        type: 'team',
        parentId: 'dept006',
        manager: '员工关系主管',
        managerPhone: '13800138053',
        memberCount: 5,
        description: '负责员工关系维护和企业文化',
        location: '行政楼1楼103',
      },
    ],
  },
  {
    id: 'dept007',
    name: '财务管理部',
    type: 'department',
    manager: '周部长',
    managerPhone: '13800138060',
    memberCount: 20,
    description: '负责财务管理和成本控制',
    location: '行政楼1楼',
    establishedDate: '2020-01-01',
    budget: 1800000,
    children: [
      {
        id: 'team022',
        name: '会计核算组',
        type: 'team',
        parentId: 'dept007',
        manager: '会计主管',
        managerPhone: '13800138061',
        memberCount: 8,
        description: '负责会计核算和报表编制',
        location: '行政楼1楼104',
      },
      {
        id: 'team023',
        name: '成本管理组',
        type: 'team',
        parentId: 'dept007',
        manager: '成本主管',
        managerPhone: '13800138062',
        memberCount: 6,
        description: '负责成本核算和控制',
        location: '行政楼1楼105',
      },
      {
        id: 'team024',
        name: '资金管理组',
        type: 'team',
        parentId: 'dept007',
        manager: '资金主管',
        managerPhone: '13800138063',
        memberCount: 6,
        description: '负责资金管理和投资决策',
        location: '行政楼1楼106',
      },
    ],
  },
  {
    id: 'dept008',
    name: '信息技术部',
    type: 'department',
    manager: '郑部长',
    managerPhone: '13800138070',
    memberCount: 24,
    description: '负责信息系统建设和数据管理',
    location: '研发楼1楼',
    establishedDate: '2020-01-01',
    budget: 4000000,
    children: [
      {
        id: 'team025',
        name: '系统开发组',
        type: 'team',
        parentId: 'dept008',
        manager: '开发主管',
        managerPhone: '13800138071',
        memberCount: 12,
        description: '负责企业信息系统开发',
        location: '研发楼1楼101',
      },
      {
        id: 'team026',
        name: '网络运维组',
        type: 'team',
        parentId: 'dept008',
        manager: '运维主管',
        managerPhone: '13800138072',
        memberCount: 8,
        description: '负责网络设备维护和数据安全',
        location: '研发楼1楼102',
      },
      {
        id: 'team027',
        name: '数据分析组',
        type: 'team',
        parentId: 'dept008',
        manager: '数据主管',
        managerPhone: '13800138073',
        memberCount: 4,
        description: '负责数据分析和商业智能',
        location: '研发楼1楼103',
      },
    ],
  },
];

// 统计数据
export const statistics = {
  totalDevices: devices.length,
  onlineDevices: devices.filter(d => d.status === 'online').length,
  totalUsers: users.length,
  onlineUsers: users.filter(u => u.status === 'online').length,
  activeCommands: commands.filter(c => c.status === 'pending' || c.status === 'sent').length,
  activeSafetyEvents: safetyEvents.filter(e => e.status === 'active').length,
  dataRecordsToday: dataRecords.length,
};

// 图表数据
// 检查记录数据
export const inspectionRecords: InspectionRecord[] = [
  {
    id: 'INSP-001',
    title: '生产车间A区安全检查',
    type: 'routine',
    inspector: '张安全',
    department: '安全监察部',
    location: '生产车间A区',
    status: 'completed',
    priority: 'medium',
    scheduledDate: '2025-08-05',
    completedDate: '2025-08-05',
    score: 85,
    issuesFound: 3,
    rectificationItems: 2,
    description: '对生产车间A区进行例行安全检查，检查消防设施、电气安全、操作规程执行情况',
    remarks: '整体安全状况良好，发现少量问题已责令整改'
  },
  {
    id: 'INSP-002',
    title: '通信设备专项检查',
    type: 'special',
    inspector: '李技术',
    department: '技术维护部',
    location: '通信机房',
    status: 'in_progress',
    priority: 'high',
    scheduledDate: '2025-07-20',
    issuesFound: 1,
    rectificationItems: 1,
    description: '对5G通信设备、语音对讲系统、视频监控系统进行专项技术检查',
    remarks: '检查中发现部分设备需要升级'
  },
  {
    id: 'INSP-003',
    title: '年度消防安全大检查',
    type: 'annual',
    inspector: '王消防',
    department: '安全监察部',
    location: '全厂区',
    status: 'scheduled',
    priority: 'urgent',
    scheduledDate: '2025-07-01',
    issuesFound: 0,
    rectificationItems: 0,
    description: '年度消防安全综合检查，包括消防设施、疏散通道、应急预案等全面检查'
  },
  {
    id: 'INSP-004',
    title: '仓库区域安全检查',
    type: 'routine',
    inspector: '陈管理',
    department: '物流管理部',
    location: '仓库B区',
    status: 'overdue',
    priority: 'medium',
    scheduledDate: '2025-07-10',
    issuesFound: 2,
    rectificationItems: 2,
    description: '仓库货物堆放、通风系统、防火防盗设施检查'
  },
  {
    id: 'INSP-005',
    title: '电气系统紧急检查',
    type: 'emergency',
    inspector: '刘电工',
    department: '设备维护部',
    location: '配电室',
    status: 'completed',
    priority: 'urgent',
    scheduledDate: '2025-07-18',
    completedDate: '2025-07-18',
    score: 92,
    issuesFound: 1,
    rectificationItems: 1,
    description: '因昨日雷雨天气对电气系统进行紧急安全检查',
    remarks: '检查及时，处理迅速，未发现重大隐患'
  }
];

// 整改项目数据
export const rectificationItems: RectificationItem[] = [
  {
    id: 'RECT-001',
    inspectionId: 'INSP-001',
    title: '更换老化消防栓',
    description: '生产车间A区东侧消防栓老化严重，水压不足，需要立即更换',
    category: 'safety',
    severity: 'high',
    status: 'completed',
    assignee: '消防维修班',
    department: '设备维护部',
    dueDate: '2025-07-25',
    createdDate: '2025-08-05',
    completedDate: '2025-07-22',
    verifiedDate: '2025-08-05',
    progress: 100,
    cost: 1200,
    remarks: '已更换新型消防栓，水压测试正常'
  },
  {
    id: 'RECT-002',
    inspectionId: 'INSP-001',
    title: '修复损坏安全标识',
    description: '车间内部分安全警示标识破损，影响安全提醒效果',
    category: 'safety',
    severity: 'medium',
    status: 'verified',
    assignee: '维修班',
    department: '设备维护部',
    dueDate: '2025-08-05',
    createdDate: '2025-08-05',
    completedDate: '2025-08-05',
    verifiedDate: '2025-07-29',
    progress: 100,
    cost: 300,
    remarks: '已重新制作并安装所有安全标识'
  },
  {
    id: 'RECT-003',
    inspectionId: 'INSP-002',
    title: '升级通信设备固件',
    description: '部分5G设备固件版本过低，需要升级到最新版本',
    category: 'equipment',
    severity: 'medium',
    status: 'in_progress',
    assignee: '网络工程师',
    department: '技术维护部',
    dueDate: '2025-07-05',
    createdDate: '2025-07-20',
    progress: 60,
    cost: 0,
    remarks: '正在分批次升级，避免影响正常通信'
  },
  {
    id: 'RECT-004',
    inspectionId: 'INSP-004',
    title: '清理货物堆放通道',
    description: '仓库通道被货物占用，影响人员通行和消防疏散',
    category: 'safety',
    severity: 'high',
    status: 'pending',
    assignee: '仓库管理员',
    department: '物流管理部',
    dueDate: '2025-08-05',
    createdDate: '2025-07-10',
    progress: 0,
    remarks: '已通知相关人员，等待执行'
  },
  {
    id: 'RECT-005',
    inspectionId: 'INSP-004',
    title: '维修仓库通风系统',
    description: '仓库通风系统部分风机故障，通风效果不佳',
    category: 'environment',
    severity: 'medium',
    status: 'pending',
    assignee: '机电维修组',
    department: '设备维护部',
    dueDate: '2025-07-10',
    createdDate: '2025-07-10',
    progress: 0,
    cost: 2500,
    remarks: '需要采购配件后进行维修'
  },
  {
    id: 'RECT-006',
    inspectionId: 'INSP-005',
    title: '加强配电室防雷措施',
    description: '配电室防雷设施需要加强，增加避雷针保护',
    category: 'safety',
    severity: 'high',
    status: 'completed',
    assignee: '电气班',
    department: '设备维护部',
    dueDate: '2025-07-25',
    createdDate: '2025-07-18',
    completedDate: '2025-07-24',
    progress: 100,
    cost: 3500,
    remarks: '已安装新的避雷系统，通过验收'
  }
];

export const chartData = {
  deviceStatus: [
    { status: '在线', count: devices.filter(d => d.status === 'online').length },
    { status: '离线', count: devices.filter(d => d.status === 'offline').length },
    { status: '警告', count: devices.filter(d => d.status === 'warning').length },
  ],
  safetyEventsByType: [
    { type: '火灾', count: safetyEvents.filter(e => e.type === 'fire').length },
    { type: '气体泄漏', count: safetyEvents.filter(e => e.type === 'gas').length },
    { type: '入侵', count: safetyEvents.filter(e => e.type === 'intrusion').length },
    { type: '紧急情况', count: safetyEvents.filter(e => e.type === 'emergency').length },
  ],
  dataTrend: [
    { time: '08:00', temperature: 22, humidity: 60 },
    { time: '10:00', temperature: 24, humidity: 62 },
    { time: '12:00', temperature: 26, humidity: 65 },
    { time: '14:00', temperature: 25.6, humidity: 65.2 },
    { time: '16:00', temperature: 24, humidity: 63 },
    { time: '18:00', temperature: 23, humidity: 61 },
  ],
  inspectionStats: [
    { status: '已完成', count: inspectionRecords.filter(r => r.status === 'completed').length },
    { status: '进行中', count: inspectionRecords.filter(r => r.status === 'in_progress').length },
    { status: '已安排', count: inspectionRecords.filter(r => r.status === 'scheduled').length },
    { status: '已逾期', count: inspectionRecords.filter(r => r.status === 'overdue').length },
  ],
  rectificationStats: [
    { status: '待处理', count: rectificationItems.filter(r => r.status === 'pending').length },
    { status: '处理中', count: rectificationItems.filter(r => r.status === 'in_progress').length },
    { status: '已完成', count: rectificationItems.filter(r => r.status === 'completed').length },
    { status: '已验证', count: rectificationItems.filter(r => r.status === 'verified').length },
  ]
}; 

// 智慧酒店管理平台数据模型

// 设备类型定义
export interface HotelDevice {
  id: string;
  name: string;
  type: 'air_conditioner' | 'lighting' | 'curtain' | 'tv' | 'sensor' | 'door_lock' | 'mini_bar' | 'safe_box' | 'delivery_robot' | 'access_control' | 'elevator' | 'fire_alarm' | 'cctv_camera';
  category: 'hvac' | 'lighting' | 'security' | 'entertainment' | 'comfort' | 'service' | 'safety';
  status: 'online' | 'offline' | 'warning' | 'error';
  roomNumber?: string;
  floor: number;
  location: string;
  lastUpdate: string;
  battery?: number;
  signal?: number;
  temperature?: number;
  humidity?: number;
  brightness?: number;
  power?: number; // 功率瓦特
  energyConsumption?: number; // 能耗kWh
  isOnline: boolean;
  errorCode?: string;
  errorMessage?: string;
  // 送餐机器人特有属性
  currentTask?: string;
  destination?: string;
  estimatedArrival?: string;
  // 门禁系统特有属性
  accessLevel?: 'guest' | 'staff' | 'admin';
  lastAccess?: string;
  // 电梯特有属性
  currentFloor?: number;
  targetFloor?: number;
  direction?: 'up' | 'down' | 'idle';
  // 监控摄像头特有属性
  recordingStatus?: boolean;
  motionDetection?: boolean;
}

// 客房信息
export interface HotelRoom {
  id: string;
  roomNumber: string;
  floor: number;
  type: 'standard' | 'deluxe' | 'suite' | 'presidential';
  status: 'occupied' | 'vacant_clean' | 'vacant_dirty' | 'out_of_order' | 'maintenance';
  guestName?: string;
  checkInTime?: string;
  checkOutTime?: string;
  deviceCount: number;
  onlineDeviceCount: number;
  temperature: number;
  humidity: number;
  lightLevel: number;
  energyConsumption: number; // 当日能耗
  lastCleanTime?: string;
  maintenanceScheduled?: boolean;
}

// 故障预警
export interface FaultWarning {
  id: string;
  deviceId: string;
  deviceName: string;
  roomNumber: string;
  warningType: 'temperature_abnormal' | 'power_failure' | 'sensor_error' | 'maintenance_due' | 'energy_overconsumption';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved' | 'false_alarm';
  timestamp: string;
  description: string;
  predictedFailureTime?: string;
  recommendedAction: string;
  estimatedCost?: number;
}

// 设备联动场景
export interface DeviceLinkage {
  id: string;
  name: string;
  description: string;
  triggerType: 'manual' | 'time_based' | 'sensor_based' | 'guest_checkin' | 'guest_checkout';
  triggerCondition: string;
  actions: {
    deviceId: string;
    deviceName: string;
    action: string;
    parameters: Record<string, any>;
  }[];
  isEnabled: boolean;
  roomNumbers: string[];
  executionCount: number;
  lastExecuted?: string;
}

// 运营分析数据
export interface OperationData {
  date: string;
  roomOccupancyRate: number;
  energyConsumption: number;
  energyCost: number;
  maintenanceCost: number;
  deviceUptime: number;
  guestSatisfaction: number;
  averageRoomTemperature: number;
  peakEnergyHour: number;
  co2Emission: number;
}

// 设备调节记录
export interface DeviceAdjustment {
  id: string;
  deviceId: string;
  deviceName: string;
  roomNumber: string;
  adjustmentType: 'temperature' | 'brightness' | 'volume' | 'power' | 'schedule';
  oldValue: number | string;
  newValue: number | string;
  adjustedBy: 'guest' | 'staff' | 'auto_system';
  timestamp: string;
  reason: string;
  energyImpact?: number;
}

// 酒店规模配置
const HOTEL_CONFIG = {
  FLOORS: 20,           // 20层
  ROOMS_PER_FLOOR: 15,  // 每层15间
  ROOM_TYPES: {
    STANDARD: { floors: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], roomsPerFloor: 12 },    // 标准间
    DELUXE: { floors: [11, 12, 13, 14, 15], roomsPerFloor: 10 },                 // 豪华间
    SUITE: { floors: [16, 17, 18], roomsPerFloor: 8 },                           // 套房
    PRESIDENTIAL: { floors: [19, 20], roomsPerFloor: 4 }                         // 总统套房
  },
  DELIVERY_ROBOTS: 10,  // 10台送餐机器人
  ELEVATORS: 6,         // 6部电梯
  CCTV_PER_FLOOR: 8,    // 每层8个监控
  ACCESS_CONTROLS: 4    // 每层4个门禁
};

// 更新设备数据生成函数
function generateHotelDevices(): HotelDevice[] {
  let devices: HotelDevice[] = [];
  
  // 生成客房设备
  for (let floor = 1; floor <= HOTEL_CONFIG.FLOORS; floor++) {
    let roomsOnFloor = HOTEL_CONFIG.ROOMS_PER_FLOOR;
    let roomType: 'standard' | 'deluxe' | 'suite' | 'presidential' = 'standard';
    
    // 确定房间类型
    if (floor >= 19) roomType = 'presidential';
    else if (floor >= 16) roomType = 'suite';
    else if (floor >= 11) roomType = 'deluxe';
    
    for (let room = 1; room <= roomsOnFloor; room++) {
      let roomNumber = `${floor.toString().padStart(2, '0')}${room.toString().padStart(2, '0')}`;
      
      // 基础设备
      devices.push({
        id: `room${roomNumber}_ac`,
        name: `中央空调-客房${roomNumber}`,
    type: 'air_conditioner',
    category: 'hvac',
    status: 'online',
        roomNumber: roomNumber,
        floor: floor,
        location: `${floor}楼${roomNumber}房间`,
    lastUpdate: '2025-08-05 14:30:00',
        temperature: Number((20 + Math.random() * 4).toFixed(1)),  // 温度保留1位小数
        humidity: Math.round(40 + Math.random() * 20),  // 湿度取整数
    power: 1200,
        energyConsumption: Number((5 + Math.random() * 5).toFixed(2)),  // 能耗保留2位小数
    isOnline: true,
        signal: Math.round(85 + Math.random() * 15)  // 信号强度取整数
      });
      
      // 其他房间设备...
      devices.push({
        id: `room${roomNumber}_light`,
        name: `智能照明-客房${roomNumber}`,
    type: 'lighting',
    category: 'lighting',
    status: 'online',
        roomNumber: roomNumber,
        floor: floor,
        location: `${floor}楼${roomNumber}房间`,
    lastUpdate: '2025-08-05 14:30:00',
        brightness: Math.round(Math.random() * 100),  // 亮度取整数
    power: 45,
        energyConsumption: Number((Math.random() * 3).toFixed(2)),  // 能耗保留2位小数
    isOnline: true,
        signal: Math.round(85 + Math.random() * 15)
      });
      
      // 根据房间类型添加额外设备
      if (roomType !== 'standard') {
        devices.push({
          id: `room${roomNumber}_minibar`,
          name: `智能迷你吧-客房${roomNumber}`,
          type: 'mini_bar',
    category: 'comfort',
    status: 'online',
          roomNumber: roomNumber,
          floor: floor,
          location: `${floor}楼${roomNumber}房间`,
    lastUpdate: '2025-08-05 14:30:00',
          temperature: Number((4 + Math.random() * 2).toFixed(1)),  // 温度保留1位小数
          power: 80,
          energyConsumption: Number((Math.random() * 2).toFixed(2)),  // 能耗保留2位小数
    isOnline: true,
          signal: Math.round(85 + Math.random() * 15)
        });
      }
    }
    
    // 每层公共区域设备
    // 监控摄像头
    for (let i = 1; i <= HOTEL_CONFIG.CCTV_PER_FLOOR; i++) {
      devices.push({
        id: `cctv_f${floor}_${i}`,
        name: `监控摄像头-${floor}楼-${i}号`,
        type: 'cctv_camera',
    category: 'security',
    status: 'online',
        floor: floor,
        location: `${floor}楼走廊`,
    lastUpdate: '2025-08-05 14:30:00',
        power: 25,
        energyConsumption: 0.6,
    isOnline: true,
        signal: 90 + Math.random() * 10,
        recordingStatus: true,
        motionDetection: true
      });
    }
    
    // 门禁系统
    for (let i = 1; i <= HOTEL_CONFIG.ACCESS_CONTROLS; i++) {
      devices.push({
        id: `access_f${floor}_${i}`,
        name: `门禁系统-${floor}楼-${i}号`,
    type: 'access_control',
    category: 'security',
    status: 'online',
        floor: floor,
        location: `${floor}楼安全门`,
    lastUpdate: '2025-08-05 14:30:00',
    power: 15,
    energyConsumption: 0.3,
    isOnline: true,
        signal: 90 + Math.random() * 10
      });
    }
  }
  
  // 电梯
  for (let i = 1; i <= HOTEL_CONFIG.ELEVATORS; i++) {
    devices.push({
      id: `elevator_${i.toString().padStart(2, '0')}`,
      name: `客梯-${i.toString().padStart(2, '0')}`,
    type: 'elevator',
    category: 'service',
    status: 'online',
      floor: Math.floor(Math.random() * HOTEL_CONFIG.FLOORS) + 1,
      location: '电梯井',
    lastUpdate: '2025-08-05 14:30:00',
    power: 500,
      energyConsumption: 7 + Math.random() * 3,
    isOnline: true,
      signal: 95 + Math.random() * 5,
      currentFloor: Math.floor(Math.random() * HOTEL_CONFIG.FLOORS) + 1,
      targetFloor: Math.floor(Math.random() * HOTEL_CONFIG.FLOORS) + 1,
      direction: Math.random() > 0.5 ? 'up' : 'down'
    });
  }
  
  // 送餐机器人
  for (let i = 1; i <= HOTEL_CONFIG.DELIVERY_ROBOTS; i++) {
    devices.push({
      id: `robot_${i.toString().padStart(2, '0')}`,
      name: `送餐机器人-${i.toString().padStart(2, '0')}`,
      type: 'delivery_robot',
    category: 'service',
    status: 'online',
      floor: Math.floor(Math.random() * HOTEL_CONFIG.FLOORS) + 1,
      location: '正在服务中',
    lastUpdate: '2025-08-05 14:30:00',
      battery: 60 + Math.random() * 40,
      power: 200,
      energyConsumption: 2 + Math.random() * 2,
    isOnline: true,
      signal: 90 + Math.random() * 10,
      currentTask: Math.random() > 0.3 ? '送餐中' : '空闲',
      destination: Math.random() > 0.3 ? `${Math.floor(Math.random() * HOTEL_CONFIG.FLOORS) + 1}${Math.floor(Math.random() * HOTEL_CONFIG.ROOMS_PER_FLOOR) + 1}` : '',
      estimatedArrival: '2025-08-05 14:35:00'
    });
  }
  
  return devices;
}

// 更新房间数据生成函数
function generateHotelRooms(): HotelRoom[] {
  let rooms: HotelRoom[] = [];
  
  for (let floor = 1; floor <= HOTEL_CONFIG.FLOORS; floor++) {
    let roomsOnFloor = HOTEL_CONFIG.ROOMS_PER_FLOOR;
    let roomType: 'standard' | 'deluxe' | 'suite' | 'presidential' = 'standard';
    let deviceCount = 5;
    
    // 确定房间类型和设备数量
    if (floor >= 19) {
      roomType = 'presidential';
      deviceCount = 15;
    } else if (floor >= 16) {
      roomType = 'suite';
      deviceCount = 12;
    } else if (floor >= 11) {
      roomType = 'deluxe';
      deviceCount = 8;
    }
    
    for (let room = 1; room <= roomsOnFloor; room++) {
      let roomNumber = `${floor.toString().padStart(2, '0')}${room.toString().padStart(2, '0')}`;
      // 计算当前房间索引，用于控制入住率
      const roomIndex = (floor - 1) * roomsOnFloor + room;
      // 前160间房设为已入住，其余为空闲
      let isOccupied = roomIndex <= 160;
      
      rooms.push({
        id: `room_${roomNumber}`,
        roomNumber: roomNumber,
        floor: floor,
        type: roomType,
        status: isOccupied ? 'occupied' : (Math.random() > 0.5 ? 'vacant_clean' : 'vacant_dirty'),
        guestName: isOccupied ? `客人${Math.floor(Math.random() * 1000)}` : undefined,
        checkInTime: isOccupied ? '2025-08-05 14:00:00' : undefined,
        checkOutTime: isOccupied ? '2025-07-25 12:00:00' : undefined,
        deviceCount: deviceCount,
        onlineDeviceCount: deviceCount - Math.floor(Math.random() * 2),
        temperature: Number((20 + Math.random() * 6).toFixed(1)),  // 温度保留1位小数
        humidity: Math.round(40 + Math.random() * 20),  // 湿度取整数
        lightLevel: isOccupied ? Math.round(Math.random() * 100) : 0,  // 亮度取整数
        energyConsumption: Number((isOccupied ? 10 + Math.random() * 10 : 2 + Math.random() * 3).toFixed(2)),  // 能耗保留2位小数
        lastCleanTime: '2025-08-05 09:30:00',
        maintenanceScheduled: Math.random() > 0.95
      });
    }
  }
  
  return rooms;
}

// 更新数据
export const hotelDevices = generateHotelDevices();
export const hotelRooms = generateHotelRooms();

// 故障预警数据
export const faultWarnings: FaultWarning[] = [
  {
    id: 'warning_001',
    deviceId: 'room0102_sensor',
    deviceName: '环境传感器-客房0102',
    roomNumber: '0102',
    warningType: 'sensor_error',
    severity: 'high',
    status: 'active',
    timestamp: '2025-08-05 14:20:00',
    description: '环境传感器连接断开，无法获取温湿度数据',
    recommendedAction: '检查传感器电源和网络连接，必要时更换传感器',
    estimatedCost: 280
  },
  {
    id: 'warning_002',
    deviceId: 'room0102_ac',
    deviceName: '中央空调-客房0102',
    roomNumber: '0102',
    warningType: 'temperature_abnormal',
    severity: 'medium',
    status: 'acknowledged',
    timestamp: '2025-08-05 14:25:00',
    description: '空调温度传感器读数异常，可能影响温控效果',
    predictedFailureTime: '2025-07-16 08:00:00',
    recommendedAction: '校准温度传感器或安排维修检查',
    estimatedCost: 150
  },
  {
    id: 'warning_003',
    deviceId: 'room0301_ac',
    deviceName: '中央空调-套房0301',
    roomNumber: '0301',
    warningType: 'maintenance_due',
    severity: 'low',
    status: 'active',
    timestamp: '2025-08-05 09:00:00',
    description: '设备运行时间已达到维护周期，建议进行预防性维护',
    recommendedAction: '安排设备维护保养，更换滤网和检查制冷剂',
    estimatedCost: 450
  },
  {
    id: 'warning_004',
    deviceId: 'room0201_minibar',
    deviceName: '智能迷你吧-客房0201',
    roomNumber: '0201',
    warningType: 'energy_overconsumption',
    severity: 'medium',
    status: 'active',
    timestamp: '2025-08-05 13:30:00',
    description: '迷你吧能耗超出正常范围30%，可能存在制冷系统问题',
    recommendedAction: '检查制冷系统密封性和温控设置',
    estimatedCost: 320
  },
  // 新增更多预警数据
  {
    id: 'warning_005',
    deviceId: 'elevator_01',
    deviceName: '客梯-01',
    roomNumber: 'elevator_01',
    warningType: 'power_failure',
    severity: 'critical',
    status: 'active',
    timestamp: '2025-08-05 15:45:00',
    description: '电梯主控制器电源异常，可能导致电梯停运',
    predictedFailureTime: '2025-08-05 16:30:00',
    recommendedAction: '立即检查电源系统，联系电梯维保公司',
    estimatedCost: 1200
  },
  {
    id: 'warning_006',
    deviceId: 'fire_alarm_01',
    deviceName: '火灾报警器-大门',
    roomNumber: 'lobby',
    warningType: 'sensor_error',
    severity: 'high',
    status: 'active',
    timestamp: '2025-08-05 15:30:00',
    description: '烟雾传感器检测灵敏度下降，可能影响火灾预警',
    recommendedAction: '清洁传感器或更换感烟元件',
    estimatedCost: 180
  },
  {
    id: 'warning_007',
    deviceId: 'access_main',
    deviceName: '主门禁系统',
    roomNumber: 'main_entrance',
    warningType: 'maintenance_due',
    severity: 'medium',
    status: 'acknowledged',
    timestamp: '2025-08-05 08:00:00',
    description: '门禁控制器运行12个月，需要进行定期保养',
    recommendedAction: '安排门禁系统维护，更新软件和清理设备',
    estimatedCost: 300
  },
  {
    id: 'warning_008',
    deviceId: 'cctv_lobby',
    deviceName: '监控摄像头-大门',
    roomNumber: 'lobby',
    warningType: 'sensor_error',
    severity: 'medium',
    status: 'resolved',
    timestamp: '2025-08-05 12:15:00',
    description: '摄像头图像模糊，影响监控效果',
    recommendedAction: '清洁镜头或调整焦距',
    estimatedCost: 50
  },
  {
    id: 'warning_009',
    deviceId: 'room203_light',
    deviceName: '智能照明-客房203',
    roomNumber: '203',
    warningType: 'power_failure',
    severity: 'low',
    status: 'active',
    timestamp: '2025-08-05 16:20:00',
    description: '部分LED灯条无法正常点亮',
    recommendedAction: '检查LED驱动器和线路连接',
    estimatedCost: 120
  },
  {
    id: 'warning_010',
    deviceId: 'room105_tv',
    deviceName: '智能电视-客房105',
    roomNumber: '105',
    warningType: 'temperature_abnormal',
    severity: 'low',
    status: 'false_alarm',
    timestamp: '2025-08-05 11:45:00',
    description: '电视背板温度偏高报警',
    recommendedAction: '检查散热系统和环境温度',
    estimatedCost: 0
  },
  {
    id: 'warning_011',
    deviceId: 'robot_001',
    deviceName: '送餐机器人-01',
    roomNumber: 'lobby',
    warningType: 'power_failure',
    severity: 'medium',
    status: 'acknowledged',
    timestamp: '2025-08-05 14:50:00',
    description: '机器人电池续航能力下降，充电时间延长',
    predictedFailureTime: '2025-07-16 10:00:00',
    recommendedAction: '检查电池状态，必要时更换电池组',
    estimatedCost: 800
  },
  {
    id: 'warning_012',
    deviceId: 'room302_curtain',
    deviceName: '电动窗帘-套房302',
    roomNumber: '302',
    warningType: 'maintenance_due',
    severity: 'low',
    status: 'active',
    timestamp: '2025-08-05 07:30:00',
    description: '窗帘电机运行声音异常，需要润滑保养',
    recommendedAction: '对电机进行润滑保养，检查传动机构',
    estimatedCost: 150
  },
  {
    id: 'warning_013',
    deviceId: 'room401_ac',
    deviceName: '中央空调-总统套房401',
    roomNumber: '401',
    warningType: 'energy_overconsumption',
    severity: 'high',
    status: 'active',
    timestamp: '2025-08-05 16:00:00',
    description: '空调能耗超出正常值40%，疑似制冷剂泄漏',
    predictedFailureTime: '2025-07-16 12:00:00',
    recommendedAction: '检查制冷剂管路，补充制冷剂或维修泄漏点',
    estimatedCost: 600
  },
  {
    id: 'warning_014',
    deviceId: 'cctv_parking',
    deviceName: '监控摄像头-停车场',
    roomNumber: 'parking',
    warningType: 'power_failure',
    severity: 'medium',
    status: 'active',
    timestamp: '2025-08-05 15:15:00',
    description: '摄像头间歇性断电，影响录像连续性',
    recommendedAction: '检查电源适配器和供电线路',
    estimatedCost: 200
  },
  {
    id: 'warning_015',
    deviceId: 'room204_sensor',
    deviceName: '环境传感器-客房204',
    roomNumber: '204',
    warningType: 'sensor_error',
    severity: 'medium',
    status: 'resolved',
    timestamp: '2025-08-05 10:30:00',
    description: '湿度传感器读数异常，显示100%湿度',
    recommendedAction: '重新校准传感器或更换感湿元件',
    estimatedCost: 160
  },
  {
    id: 'warning_016',
    deviceId: 'access_parking',
    deviceName: '停车场门禁',
    roomNumber: 'parking',
    warningType: 'maintenance_due',
    severity: 'low',
    status: 'acknowledged',
    timestamp: '2025-08-05 06:00:00',
    description: '门禁读卡器需要清洁维护',
    recommendedAction: '清洁读卡器感应区域，检查天线连接',
    estimatedCost: 80
  },
  {
    id: 'warning_017',
    deviceId: 'elevator_02',
    deviceName: '客梯-02',
    roomNumber: 'elevator_02',
    warningType: 'temperature_abnormal',
    severity: 'medium',
    status: 'active',
    timestamp: '2025-08-05 15:00:00',
    description: '电梯机房温度过高，影响设备运行',
    recommendedAction: '检查通风系统，确保机房散热正常',
    estimatedCost: 350
  },
  {
    id: 'warning_018',
    deviceId: 'room303_minibar',
    deviceName: '智能迷你吧-套房303',
    roomNumber: '303',
    warningType: 'energy_overconsumption',
    severity: 'low',
    status: 'resolved',
    timestamp: '2025-08-05 13:00:00',
    description: '迷你吧制冷效率下降，能耗增加15%',
    recommendedAction: '清洁冷凝器，检查制冷剂充注量',
    estimatedCost: 100
  },
  {
    id: 'warning_019',
    deviceId: 'fire_alarm_02',
    deviceName: '火灾报警器-客房区',
    roomNumber: 'guest_area',
    warningType: 'power_failure',
    severity: 'critical',
    status: 'active',
    timestamp: '2025-08-05 16:30:00',
    description: '报警器主电源故障，已切换到备用电源',
    predictedFailureTime: '2025-08-05 20:00:00',
    recommendedAction: '立即检查主电源线路，修复供电故障',
    estimatedCost: 400
  },
  {
    id: 'warning_020',
    deviceId: 'room106_doorlock',
    deviceName: '智能门锁-客房106',
    roomNumber: '106',
    warningType: 'maintenance_due',
    severity: 'medium',
    status: 'active',
    timestamp: '2025-08-05 14:00:00',
    description: '门锁机械部件磨损，开锁时间延长',
    recommendedAction: '润滑锁体机械部件，检查电机状态',
    estimatedCost: 200
  },
  {
    id: 'warning_021',
    deviceId: 'cctv_elevator',
    deviceName: '监控摄像头-电梯',
    roomNumber: 'elevator_01',
    warningType: 'sensor_error',
    severity: 'low',
    status: 'acknowledged',
    timestamp: '2025-08-05 09:30:00',
    description: '电梯内摄像头夜视功能异常',
    recommendedAction: '检查红外补光灯和摄像头设置',
    estimatedCost: 120
  },
  {
    id: 'warning_022',
    deviceId: 'robot_002',
    deviceName: '送餐机器人-02',
    roomNumber: 'kitchen',
    warningType: 'sensor_error',
    severity: 'medium',
    status: 'active',
    timestamp: '2025-08-05 15:40:00',
    description: '激光雷达传感器精度下降，影响导航',
    recommendedAction: '清洁激光雷达镜面，重新校准导航系统',
    estimatedCost: 250
  },
  {
    id: 'warning_023',
    deviceId: 'room207_ac',
    deviceName: '中央空调-客房207',
    roomNumber: '207',
    warningType: 'temperature_abnormal',
    severity: 'high',
    status: 'active',
    timestamp: '2025-08-05 16:10:00',
    description: '压缩机过热保护频繁触发',
    predictedFailureTime: '2025-08-05 18:00:00',
    recommendedAction: '立即停机检查，清洁冷凝器和检查制冷剂',
    estimatedCost: 500
  },
  {
    id: 'warning_024',
    deviceId: 'room108_light',
    deviceName: '智能照明-客房108',
    roomNumber: '108',
    warningType: 'power_failure',
    severity: 'low',
    status: 'resolved',
    timestamp: '2025-08-05 12:45:00',
    description: '调光器故障，无法调节亮度',
    recommendedAction: '更换调光模块',
    estimatedCost: 80
  },
  {
    id: 'warning_025',
    deviceId: 'room402_sensor',
    deviceName: '环境传感器-总统套房402',
    roomNumber: '402',
    warningType: 'maintenance_due',
    severity: 'low',
    status: 'active',
    timestamp: '2025-08-05 05:00:00',
    description: '传感器校准周期到期，需要重新校准',
    recommendedAction: '使用标准样品对传感器进行校准',
    estimatedCost: 100
  }
];

// 设备联动场景
export const deviceLinkages: DeviceLinkage[] = [
  {
    id: 'linkage_001',
    name: '客人入住场景',
    description: '客人刷卡入房时自动开启照明、空调和窗帘',
    triggerType: 'guest_checkin',
    triggerCondition: '房卡刷卡开门',
    actions: [
      {
        deviceId: 'light',
        deviceName: '照明系统',
        action: 'turn_on',
        parameters: { brightness: 70 }
      },
      {
        deviceId: 'ac',
        deviceName: '空调系统',
        action: 'set_temperature',
        parameters: { temperature: 22, mode: 'auto' }
      },
      {
        deviceId: 'curtain',
        deviceName: '电动窗帘',
        action: 'open',
        parameters: { position: 50 }
      }
    ],
    isEnabled: true,
    roomNumbers: ['101', '102', '201', '202'],
    executionCount: 24,
    lastExecuted: '2025-08-05 16:00:00'
  },
  {
    id: 'linkage_002',
    name: '节能模式',
    description: '客人离房超过30分钟自动开启节能模式',
    triggerType: 'sensor_based',
    triggerCondition: '人体传感器30分钟无检测',
    actions: [
      {
        deviceId: 'ac',
        deviceName: '空调系统',
        action: 'set_temperature',
        parameters: { temperature: 26, mode: 'eco' }
      },
      {
        deviceId: 'light',
        deviceName: '照明系统',
        action: 'turn_off',
        parameters: {}
      },
      {
        deviceId: 'tv',
        deviceName: '电视',
        action: 'turn_off',
        parameters: {}
      }
    ],
    isEnabled: true,
    roomNumbers: ['101', '102', '201', '202', '301'],
    executionCount: 156,
    lastExecuted: '2025-08-05 13:45:00'
  },
  {
    id: 'linkage_003',
    name: '夜间模式',
    description: '晚上11点自动调整所有设备到夜间模式',
    triggerType: 'time_based',
    triggerCondition: '每日23:00',
    actions: [
      {
        deviceId: 'light',
        deviceName: '照明系统',
        action: 'dim',
        parameters: { brightness: 20 }
      },
      {
        deviceId: 'ac',
        deviceName: '空调系统',
        action: 'set_mode',
        parameters: { mode: 'sleep', temperature: 24 }
      },
      {
        deviceId: 'tv',
        deviceName: '电视',
        action: 'set_volume',
        parameters: { volume: 15 }
      }
    ],
    isEnabled: true,
    roomNumbers: ['101', '201'],
    executionCount: 8,
    lastExecuted: '2025-07-14 23:00:00'
  }
];

// 生成运营分析数据
function generateOperationData(days: number): OperationData[] {
  const data: OperationData[] = [];
  const currentDate = new Date();
  
  // 基础参数
  const baseOccupancy = 75; // 基础入住率
  const baseEnergy = 1800;  // 基础能耗 kWh
  const baseEnergyCost = 1.2; // 每kWh电费
  const baseMaintenance = 500; // 基础维护成本
  const baseUptime = 98.5;  // 基础设备运行率
  const baseSatisfaction = 4.5; // 基础满意度
  const baseTemperature = 23; // 基础室温
  
  // 生成每天的数据
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // 考虑周末效应
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const weekendFactor = isWeekend ? 1.2 : 1.0;
    
    // 考虑季节效应（假设现在是夏季）
    const seasonalFactor = 1.15; // 夏季能耗较高
    
    // 生成当天数据
    const dayData: OperationData = {
      date: dateStr,
      // 入住率：基础值±10%，周末上升20%
      roomOccupancyRate: Number((baseOccupancy * weekendFactor * (0.9 + Math.random() * 0.2)).toFixed(1)),
      
      // 能耗：基础值±15%，考虑季节和周末因素
      energyConsumption: Math.round(baseEnergy * seasonalFactor * weekendFactor * (0.85 + Math.random() * 0.3)),
      
      // 能源成本：根据能耗计算
      energyCost: 0, // 临时值，后面计算
      
      // 维护成本：基础值±30%
      maintenanceCost: Math.round(baseMaintenance * (0.7 + Math.random() * 0.6)),
      
      // 设备运行率：基础值±2%
      deviceUptime: Number((baseUptime * (0.98 + Math.random() * 0.04)).toFixed(1)),
      
      // 客户满意度：基础值±0.5
      guestSatisfaction: Number((baseSatisfaction * (0.9 + Math.random() * 0.2)).toFixed(1)),
      
      // 平均室温：基础值±2℃
      averageRoomTemperature: Number((baseTemperature + (Math.random() * 4 - 2)).toFixed(1)),
      
      // 用电高峰时段：考虑时段分布
      peakEnergyHour: isWeekend ? 
        Math.floor(Math.random() * 4) + 14 : // 周末14-17点
        Math.floor(Math.random() * 3) + 19,  // 工作日19-21点
      
      // 碳排放：根据能耗计算（假设每kWh电产生0.5kg CO2）
      co2Emission: 0 // 临时值，后面计算
    };
    
    // 计算能源成本和碳排放
    dayData.energyCost = Math.round(dayData.energyConsumption * baseEnergyCost);
    dayData.co2Emission = Math.round(dayData.energyConsumption * 0.5);
    
    data.push(dayData);
  }
  
  return data;
}

// 生成30天的运营数据
export const operationData: OperationData[] = generateOperationData(30);

// 生成设备调节记录函数
function generateDeviceAdjustments(count: number): DeviceAdjustment[] {
  const adjustments: DeviceAdjustment[] = [];
  
  // 计算最近30天的起止时间
  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  // 计算每天大约需要生成的记录数
  const recordsPerDay = Math.floor(count / 30);
  const minutesPerRecord = Math.floor(24 * 60 / recordsPerDay); // 每条记录间隔的分钟数
  
  // 调节原因库扩充
  const temperatureReasons = [
    '客人感觉偏冷',
    '客人感觉偏热',
    '响应客人要求',
    '根据室外温度自动调节',
    '能源优化调节',
    '定时温控计划执行',
    '客人入住前预调节',
    '夜间温度自动调节',
    '节能模式温度调整',
    '季节性温度优化',
    '会议室温度预设',
    '餐饮区域温度调节',
    '健身区温度调节',
    '大门温度调节',
    '早餐时段温度调节'
  ];
  
  const brightnessReasons = [
    '根据日光强度自动调节',
    '客人需要更亮的照明',
    '客人需要柔和灯光',
    '夜间自动调光',
    '节能模式启动',
    '场景模式切换',
    '客人阅读模式',
    '清洁模式照明',
    '会议模式照明',
    '休息模式照明',
    '化妆模式照明',
    '工作模式照明',
    '娱乐模式照明',
    '用餐模式照明',
    '迎宾模式照明'
  ];

  // 按时段设置调节频率权重（更细致的时间划分）
  const getTimeWeight = (hour: number): number => {
    if (hour >= 23 || hour < 5) return 0.3;  // 深夜频率最低
    if (hour >= 5 && hour < 7) return 0.8;   // 清晨逐渐增加
    if (hour >= 7 && hour < 9) return 2.5;   // 早餐高峰
    if (hour >= 9 && hour < 11) return 2.0;  // 上午高峰
    if (hour >= 11 && hour < 14) return 1.8; // 午餐时段
    if (hour >= 14 && hour < 17) return 1.5; // 下午时段
    if (hour >= 17 && hour < 19) return 2.2; // 晚餐高峰
    if (hour >= 19 && hour < 21) return 1.8; // 晚间活动
    if (hour >= 21 && hour < 23) return 1.2; // 夜间逐渐降低
    return 1.0;
  };

  // 按房型设置调节频率权重（更细致的权重划分）
  const getRoomWeight = (floor: number): number => {
    if (floor >= 19) return 4.0;      // 总统套房调节频率最高
    if (floor >= 16) return 3.0;      // 豪华套房调节频率较高
    if (floor >= 13) return 2.0;      // 高层豪华间
    if (floor >= 11) return 1.5;      // 中层豪华间
    if (floor >= 6) return 1.2;       // 中层标准间
    return 1.0;                       // 低层标准间
  };

  // 生成房间号列表（1-20层，每层15间）
  const roomNumbers: string[] = [];
  for (let floor = 1; floor <= 20; floor++) {
    for (let room = 1; room <= 15; room++) {
      roomNumbers.push(`${floor.toString().padStart(2, '0')}${room.toString().padStart(2, '0')}`);
    }
  }

  let currentTime = new Date(endTime.getTime());
  let recordCount = 0;

  while (currentTime > startTime && recordCount < count) {
    const hour = currentTime.getHours();
    const timeWeight = getTimeWeight(hour);
    
    // 根据时间权重决定是否生成记录
    if (Math.random() < timeWeight) {
      // 每个时间点生成1-5条记录
      const recordsThisTime = Math.floor(Math.random() * 5) + 1;
      
      for (let i = 0; i < recordsThisTime && recordCount < count; i++) {
        // 选择房间时考虑房型权重
        let roomNumber;
        const roomTypeRand = Math.random();
        if (roomTypeRand < 0.4) {  // 40%概率选择高级房型
          const floor = 16 + Math.floor(Math.random() * 5);  // 16-20层
          const room = Math.floor(Math.random() * 15) + 1;
          roomNumber = `${floor.toString().padStart(2, '0')}${room.toString().padStart(2, '0')}`;
        } else {
          roomNumber = roomNumbers[Math.floor(Math.random() * roomNumbers.length)];
        }
        const floor = parseInt(roomNumber.substring(0, 2));
        
        // 根据时间和房型调整调节类型的概率
        const isTemperature = hour >= 22 || hour <= 6 ? 
          Math.random() < 0.85 :  // 夜间主要调节温度
          Math.random() < 0.65;   // 白天温度和亮度都调节
        
        // 根据时间段调整调节者的概率
        let adjustedBy: 'guest' | 'staff' | 'auto_system';
        if (hour >= 22 || hour < 6) {
          adjustedBy = Math.random() < 0.75 ? 'auto_system' : (Math.random() < 0.9 ? 'guest' : 'staff');
        } else if (hour >= 9 && hour <= 17) {
          adjustedBy = Math.random() < 0.45 ? 'staff' : (Math.random() < 0.75 ? 'auto_system' : 'guest');
        } else {
          adjustedBy = Math.random() < 0.55 ? 'guest' : (Math.random() < 0.85 ? 'auto_system' : 'staff');
        }
        
        // 根据房间类型确定设备名称前缀
        let devicePrefix = '标准间';
        if (floor >= 19) devicePrefix = '总统套房';
        else if (floor >= 16) devicePrefix = '豪华套房';
        else if (floor >= 11) devicePrefix = '豪华间';
        
        // 生成调节记录
        const adjustment: DeviceAdjustment = {
          id: `adj_${recordCount.toString().padStart(5, '0')}`,
          deviceId: `room${roomNumber}_${isTemperature ? 'ac' : 'light'}`,
          deviceName: `${devicePrefix}${roomNumber}-${isTemperature ? '中央空调' : '智能照明'}`,
          roomNumber: roomNumber,
          adjustmentType: isTemperature ? 'temperature' : 'brightness',
          oldValue: isTemperature ? 
            Number((21 + Math.random() * 5).toFixed(1)) :
            Math.round(30 + Math.random() * 70),
          newValue: 0,
          adjustedBy: adjustedBy,
          timestamp: currentTime.toISOString().replace('T', ' ').substring(0, 19),
          reason: isTemperature ? 
            temperatureReasons[Math.floor(Math.random() * temperatureReasons.length)] :
            brightnessReasons[Math.floor(Math.random() * brightnessReasons.length)],
          energyImpact: 0
        };
        
        // 根据oldValue计算合理的newValue和energyImpact
        if (isTemperature) {
          // 温度调节范围：±3度
          const change = (Math.random() * 3) * (Math.random() > 0.5 ? 1 : -1);
          adjustment.newValue = Number((Number(adjustment.oldValue) + change).toFixed(1));
          // 能耗影响：每度温度变化影响0.8kWh
          adjustment.energyImpact = Number((change * 0.8).toFixed(2));
        } else {
          // 亮度调节范围：±30%
          const change = Math.round((Math.random() * 30) * (Math.random() > 0.5 ? 1 : -1));
          adjustment.newValue = Math.max(0, Math.min(100, Number(adjustment.oldValue) + change));
          // 能耗影响：每10%亮度变化影响0.2kWh
          adjustment.energyImpact = Number((change * 0.02).toFixed(2));
        }
        
        adjustments.push(adjustment);
        recordCount++;
      }
    }
    
    // 向前移动时间
    currentTime = new Date(currentTime.getTime() - minutesPerRecord * 60 * 1000);
  }
  
  // 按时间倒序排列（最新的在前面）
  return adjustments.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

// 生成20000条设备调节记录（约30天的数据）
export const deviceAdjustments = generateDeviceAdjustments(20000);

// 添加日志输出
console.log('Generated device adjustments:', deviceAdjustments.length, 'records');
console.log('Sample records:', deviceAdjustments.slice(0, 3));

// 导出所有数据的汇总对象
export const hotelMockData = {
  devices: hotelDevices,
  rooms: hotelRooms,
  warnings: faultWarnings,
  linkages: deviceLinkages,
  operationData: operationData,
  adjustments: deviceAdjustments
}; 