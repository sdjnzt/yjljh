import React, { useState, useEffect, useMemo } from 'react';
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
  Typography,
  Divider,
  Badge,
  Tabs,
  List,
  Descriptions,
  Switch,
  message,
  Avatar,
  Drawer,
  Checkbox,
} from 'antd';
import {
  UserOutlined,
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExportOutlined,
  ImportOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  LockOutlined,
  UnlockOutlined,
  TeamOutlined,
  StarOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { pinyin } from 'pinyin-pro';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// 部门配置
const DEPARTMENTS = {
  IT: {
    name: '信息技术部',
    roles: ['系统管理员', '网络工程师', 'IT支持'],
    prefix: 'IT'
  },
  FO: {
    name: '前厅部',
    roles: ['大门经理', '前台接待', '礼宾员', '行李员'],
    prefix: 'FO'
  },
  HK: {
    name: '客房部',
    roles: ['客房主管', '楼层主管', '客房服务员', '保洁员'],
    prefix: 'HK'
  },
  FB: {
    name: '餐饮部',
    roles: ['餐饮部经理', '厨师长', '厨师', '服务员'],
    prefix: 'FB'
  },
  FIN: {
    name: '财务部',
    roles: ['财务经理', '会计主管', '会计', '出纳'],
    prefix: 'FIN'
  },
  HR: {
    name: '人力资源部',
    roles: ['人力资源经理', '人事专员', '培训专员', '招聘专员'],
    prefix: 'HR'
  },
  ENG: {
    name: '工程部',
    roles: ['工程部经理', '维修主管', '电工', '空调技工'],
    prefix: 'ENG'
  },
  SEC: {
    name: '保安部',
    roles: ['保安队长', '保安班长', '保安员'],
    prefix: 'SEC'
  },
  PUR: {
    name: '采购部',
    roles: ['采购经理', '采购专员', '仓管员'],
    prefix: 'PUR'
  },
  SAL: {
    name: '销售部',
    roles: ['销售总监', '销售经理', '销售代表'],
    prefix: 'SAL'
  }
};

// 权限配置
const PERMISSIONS = {
  SYSTEM: {
    prefix: 'system',
    name: '系统管理',
    permissions: [
      { code: 'admin', name: '系统管理' },
      { code: 'config', name: '系统配置' },
      { code: 'log', name: '系统日志' },
      { code: 'backup', name: '系统备份' }
    ]
  },
  USER: {
    prefix: 'user',
    name: '用户管理',
    permissions: [
      { code: 'read', name: '查看用户' },
      { code: 'write', name: '编辑用户' },
      { code: 'delete', name: '删除用户' }
    ]
  },
  ROOM: {
    prefix: 'room',
    name: '房间管理',
    permissions: [
      { code: 'read', name: '查看房间' },
      { code: 'write', name: '编辑房间' },
      { code: 'assign', name: '分配房间' },
      { code: 'maintain', name: '房间维护' }
    ]
  },
  FINANCE: {
    prefix: 'finance',
    name: '财务管理',
    permissions: [
      { code: 'read', name: '查看财务' },
      { code: 'write', name: '编辑财务' },
      { code: 'approve', name: '审批财务' },
      { code: 'report', name: '财务报表' }
    ]
  },
  HR: {
    prefix: 'hr',
    name: '人力资源',
    permissions: [
      { code: 'read', name: '查看人事' },
      { code: 'write', name: '编辑人事' },
      { code: 'approve', name: '审批人事' },
      { code: 'report', name: '人事报表' }
    ]
  },
  INVENTORY: {
    prefix: 'inventory',
    name: '库存管理',
    permissions: [
      { code: 'read', name: '查看库存' },
      { code: 'write', name: '编辑库存' },
      { code: 'approve', name: '审批库存' },
      { code: 'report', name: '库存报表' }
    ]
  },
  MAINTENANCE: {
    prefix: 'maintenance',
    name: '维护管理',
    permissions: [
      { code: 'read', name: '查看维护' },
      { code: 'write', name: '编辑维护' },
      { code: 'assign', name: '分配维护' },
      { code: 'report', name: '维护报表' }
    ]
  },
  SECURITY: {
    prefix: 'security',
    name: '安全管理',
    permissions: [
      { code: 'read', name: '查看安全' },
      { code: 'write', name: '编辑安全' },
      { code: 'monitor', name: '安全监控' },
      { code: 'report', name: '安全报表' }
    ]
  },
  GUEST: {
    prefix: 'guest',
    name: '客户管理',
    permissions: [
      { code: 'read', name: '查看客户' },
      { code: 'write', name: '编辑客户' },
      { code: 'service', name: '客户服务' }
    ]
  },
  REPORT: {
    prefix: 'report',
    name: '报表管理',
    permissions: [
      { code: 'read', name: '查看报表' },
      { code: 'write', name: '编辑报表' },
      { code: 'export', name: '导出报表' }
    ]
  }
};

// 角色权限映射
const ROLE_PERMISSIONS: { [key: string]: string[] } = {
  '系统管理员': [
    'system:admin', 'system:config', 'system:log', 'system:backup',
    'user:read', 'user:write', 'user:delete'
  ],
  '部门经理': [
    'user:read', 'room:read', 'room:write', 'report:read',
    'inventory:read', 'inventory:write'
  ],
  '前台接待': [
    'guest:read', 'guest:write', 'guest:service',
    'room:read', 'room:assign'
  ],
  '客房服务员': [
    'room:read', 'room:maintain',
    'inventory:read'
  ],
  '财务专员': [
    'finance:read', 'finance:write', 'finance:report',
    'report:read', 'report:export'
  ],
  '人事专员': [
    'hr:read', 'hr:write', 'hr:report',
    'user:read'
  ],
  '工程师': [
    'maintenance:read', 'maintenance:write', 'maintenance:assign',
    'inventory:read'
  ],
  '保安员': [
    'security:read', 'security:monitor',
    'guest:read'
  ]
};

// 生成随机中文名
function generateChineseName(): string {
  const surnames = '赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章';
  const names1 = '玉明永林耀建国华成志伟嘉东洪健一凤兰松江平子晓光正达安荣泽凯';
  const names2 = '芳娜秀娟英华慧巧美娜静淑惠珠翠雅芝玉萍红娥玲芬芳燕彩春菊兴';

  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const name1 = names1[Math.floor(Math.random() * names1.length)];
  const name2 = Math.random() > 0.5 ? names2[Math.floor(Math.random() * names2.length)] : '';

  return surname + name1 + name2;
}

// 生成用户名
function generateUsername(realName: string): string {
  // 将中文名转换为拼音
  const pinyinName = pinyin(realName, { toneType: 'none' })
    .split(' ')
    .map(p => p.toLowerCase())
    .join('');
  
  // 添加随机数字后缀
  return pinyinName + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
}



// 生成手机号
function generatePhone(): string {
  const phones = [
    '18266899989',
    '19853700675',
    '13258004186',
    '13793760074',
    '19533598012',
    '15069772187',
    '18462149566',
    '15163755024',
    '13805378908',
    '15275778037'
  ];
  return phones[Math.floor(Math.random() * phones.length)];
}

// 生成登录记录
function generateLoginHistory(userId: string, count: number): LoginRecord[] {
  const records: LoginRecord[] = [];
  const now = dayjs();
  const locations = ['山东省济宁市邹城市', '山东省济宁市市中区', '山东省济宁市任城区'];
  const userAgents = [
    'Chrome/120.0.0.0',
    'Firefox/121.0',
    'Safari/617.1.76',
    'Edge/120.0.2210.133'
  ];

  // 生成最近30天内的登录记录
  for (let i = 0; i < count; i++) {
    const loginTime = now.subtract(Math.floor(Math.random() * 30), 'days')
      .subtract(Math.floor(Math.random() * 24), 'hours')
      .subtract(Math.floor(Math.random() * 60), 'minutes')
      .format('YYYY-MM-DD HH:mm');

    const logoutTime = Math.random() > 0.1 ? // 10%的登录没有登出时间
      dayjs(loginTime).add(Math.floor(Math.random() * 8), 'hours')
        .add(Math.floor(Math.random() * 60), 'minutes')
        .format('YYYY-MM-DD HH:mm') :
      undefined;

    records.push({
      id: `LOGIN${dayjs().format('YYMMDDHHmmss')}${i}`,
      userId,
      loginTime,
      logoutTime,
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
      status: Math.random() > 0.05 ? 'success' : 'failed', // 5%的登录失败率
      location: locations[Math.floor(Math.random() * locations.length)]
    });
  }

  return records.sort((a, b) => dayjs(b.loginTime).unix() - dayjs(a.loginTime).unix());
}

// 生成用户数据
function generateUsers(count: number): User[] {
  const users: User[] = [];
  const departments = Object.values(DEPARTMENTS);
  const now = dayjs();

  // 确保至少有一个系统管理员
  const adminName = generateChineseName();
  const adminUsername = 'admin';
  const adminLoginCount = Math.floor(Math.random() * 1000) + 500;
  const adminLastLogin = now.format('YYYY-MM-DD HH:mm');

  users.push({
    id: 'USER001',
    username: adminUsername,
    realName: adminName,
    email: `${adminUsername}@yujiali.com`,
    namePinyin: pinyin(adminName, { toneType: 'none' }).split(' ').map(p => p.toLowerCase()).join(''),

    phone: generatePhone(),
    role: '系统管理员',
    department: '信息技术部',
    status: 'active',
    lastLogin: adminLastLogin,
    loginCount: adminLoginCount,
    createTime: now.format('YYYY-MM-DD'),
    lastPasswordChange: now.format('YYYY-MM-DD'),
    permissions: ROLE_PERMISSIONS['系统管理员'],
    twoFactorEnabled: true,
    loginHistory: generateLoginHistory('USER001', Math.min(10, adminLoginCount))
  });

  // 生成其他用户
  for (let i = 1; i < count; i++) {
    const department = departments[Math.floor(Math.random() * departments.length)];
    const role = department.roles[Math.floor(Math.random() * department.roles.length)];
    const realName = generateChineseName();
    const username = generateUsername(realName);
    
    // 创建时间使用当前系统时间
    
    // 登录次数与最后登录时间
    const loginCount = Math.floor(Math.random() * 500);
    const lastLogin = now.format('YYYY-MM-DD HH:mm');

    // 最后密码修改时间不能早于创建时间
    const lastPasswordChange = now.format('YYYY-MM-DD');

    // 用户状态
    const status: User['status'] = Math.random() > 0.15 ? 'active' :
      Math.random() > 0.5 ? 'inactive' :
      Math.random() > 0.5 ? 'locked' : 'pending';

    const user: User = {
      id: `USER${(i + 1).toString().padStart(3, '0')}`,
      username,
      realName,
      email: `${username}@yujiali.com`,
      namePinyin: pinyin(realName, { toneType: 'none' }).split(' ').map(p => p.toLowerCase()).join(''),
  
      phone: generatePhone(),
      role,
      department: department.name,
      status,
      lastLogin,
      loginCount,
      createTime: now.format('YYYY-MM-DD'),
      lastPasswordChange,
      permissions: ROLE_PERMISSIONS[role] || ['public:read'],
      twoFactorEnabled: Math.random() > 0.7, // 30%的用户启用双因素认证
      loginHistory: generateLoginHistory(`USER${(i + 1).toString().padStart(3, '0')}`, Math.min(5, loginCount))
    };

    users.push(user);
  }

  return users;
}

// 生成角色数据
function generateRoles(): Role[] {
  const roles: Role[] = [];
  let id = 1;
  const now = dayjs();

  Object.values(DEPARTMENTS).forEach(department => {
    department.roles.forEach(roleName => {
      const basePermissions = ROLE_PERMISSIONS[roleName] || ['public:read'];
      const userCount = Math.floor(Math.random() * 5) + 1;
      
      // 创建时间在最近2年内
      const createDate = now.subtract(Math.floor(Math.random() * 730), 'days');
      
      // 更新时间在创建时间之后，但不超过当前时间
      const updateDate = dayjs(createDate)
        .add(Math.floor(Math.random() * now.diff(createDate, 'days')), 'days');
      
      roles.push({
        id: id.toString(),
        name: roleName,
        description: `${department.name}${roleName}，负责相关业务管理和操作`,
        permissions: basePermissions,
        userCount,
        status: Math.random() > 0.1 ? 'active' : 'inactive',
        createTime: createDate.format('YYYY-MM-DD'),
        updateTime: updateDate.format('YYYY-MM-DD')
      });

      id++;
    });
  });

  return roles;
}

interface User {
  id: string;
  username: string;
  realName: string;
  phone: string;
  email?: string;
  namePinyin?: string;
  avatar?: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'locked' | 'pending';
  lastLogin: string;
  loginCount: number;
  createTime: string;
  lastPasswordChange: string;
  permissions: string[];
  ipWhitelist?: string[];
  twoFactorEnabled: boolean;
  loginHistory: LoginRecord[];
}

interface LoginRecord {
  id: string;
  userId: string;
  loginTime: string;
  logoutTime?: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed';
  location?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  status: 'active' | 'inactive';
  createTime: string;
  updateTime: string;
}

// 权限名称映射
const PERMISSION_NAMES: { [key: string]: string } = {
  // 系统权限
  'system:admin': '系统管理',
  'system:config': '系统配置',
  'system:log': '系统日志',
  
  // 公共权限
  'public:read': '公共查看',
  'public:write': '公共编辑',
  
  // 客户权限
  'guest:read': '查看客户',
  'guest:write': '编辑客户',
  'guest:service': '客户服务'
};

// 获取权限的中文名称
const getPermissionName = (permission: string): string => {
  return PERMISSION_NAMES[permission] || permission;
};

// 获取权限标签的颜色
const getPermissionTagColor = (permission: string): string => {
  if (permission.startsWith('system:')) {
    return '#ff4d4f';
  }
  if (permission.startsWith('public:')) {
    return '#1890ff';
  }
  if (permission.startsWith('guest:')) {
    return '#52c41a';
  }
  return '#666666';
};

// 获取状态的颜色
const getStatusBadgeStyle = (status: 'active' | 'inactive' | 'locked' | 'pending'): { status: string; text: string } => {
  switch (status) {
    case 'active':
      return { status: 'success', text: '正常' };
    case 'inactive':
      return { status: 'default', text: '停用' };
    case 'locked':
      return { status: 'error', text: '锁定' };
    case 'pending':
      return { status: 'warning', text: '待审核' };
  }
};

// 隐藏联系方式中间几位
function maskPhoneNumber(phone: string): string {
  if (!phone) return '';
  // 常见 11 位手机号，保留前三后四
  if (/^\d{11}$/.test(phone)) {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }
  // 其他长度，隐藏中间部分
  const len = phone.length;
  const keepStart = Math.min(3, Math.floor(len / 3));
  const keepEnd = Math.min(2, Math.floor(len / 4));
  const start = phone.slice(0, keepStart);
  const end = phone.slice(len - keepEnd);
  return `${start}${'*'.repeat(Math.max(3, len - keepStart - keepEnd))}${end}`;
}

const UserManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState<User[]>([]);
  const [roleList, setRoleList] = useState<Role[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filterDepartment, setFilterDepartment] = useState<string | undefined>(undefined);
  const [filterRole, setFilterRole] = useState<string | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [filterKeyword, setFilterKeyword] = useState<string>('');
  // const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  // const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('users');
  const [addUserModalVisible, setAddUserModalVisible] = useState(false);
  const [userForm] = Form.useForm();
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [addRoleModalVisible, setAddRoleModalVisible] = useState(false);
  const [roleForm] = Form.useForm();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [roleDetailsVisible, setRoleDetailsVisible] = useState(false);
  const [roleEditVisible, setRoleEditVisible] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [roleEditForm] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setUserList(generateUsers(100)); // 生成100个用户
      setRoleList(generateRoles());
      setLoading(false);
    }, 1000);
  };

  const userColumns = [
    {
      title: '用户信息',
      key: 'info',
      sorter: (a: User, b: User) => a.realName.localeCompare(b.realName, 'zh-CN'),
      render: (_: any, record: User) => (
        <Space>
          <Avatar size="large" src={record.avatar} icon={<UserOutlined />} />
          <div>
            <div>
              <Text strong>{record.realName}</Text>
              <Text code style={{ marginLeft: 8 }}>{record.username}</Text>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.email || '-'}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.department} - {record.role}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '联系方式',
      key: 'contact',
      render: (_: any, record: User) => (
        <Space direction="vertical" size="small">
          
          <Space>
            <PhoneOutlined />
            <Text>{maskPhoneNumber(record.phone)}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: '状态',
      key: 'status',
      render: (_: any, record: User) => {
        const style = getStatusBadgeStyle(record.status);
        return (
          <Badge status={style.status as any} text={style.text} />
        );
      },
    },
    {
      title: '登录信息',
      key: 'login',
      sorter: (a: User, b: User) => {
        const ax = a.lastLogin === '-' ? 0 : dayjs(a.lastLogin).valueOf();
        const bx = b.lastLogin === '-' ? 0 : dayjs(b.lastLogin).valueOf();
        return ax - bx;
      },
      render: (_: any, record: User) => (
        <Space direction="vertical" size="small">
          <div>最后登录: {record.lastLogin}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            登录次数: {record.loginCount}
          </div>
        </Space>
      ),
    },
    {
      title: '登录次数',
      dataIndex: 'loginCount',
      key: 'loginCount',
      sorter: (a: User, b: User) => a.loginCount - b.loginCount,
    },
    {
      title: '权限',
      key: 'permissions',
      render: (_: any, record: User) => (
        <Space wrap>
          {record.permissions.slice(0, 3).map((permission, index) => (
            <Tag
              key={index}
              color={getPermissionTagColor(permission)}
            >
              {getPermissionName(permission)}
            </Tag>
          ))}
          {record.permissions.length > 3 && (
            <Tag>+{record.permissions.length - 3}</Tag>
          )}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
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
          {record.status === 'locked' ? (
            <Button
              type="link"
              size="small"
              icon={<UnlockOutlined />}
              onClick={() => handleUnlock(record)}
            >
              解锁
            </Button>
          ) : (
            <Button
              type="link"
              size="small"
              icon={<LockOutlined />}
              onClick={() => handleLock(record)}
            >
              锁定
            </Button>
          )}
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const roleColumns = [
    {
      title: '角色信息',
      key: 'info',
      render: (_: any, record: Role) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong>{record.name}</Text>
            <Tag color="blue" style={{ marginLeft: 8 }}>
              {record.userCount} 用户
            </Tag>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.description}
          </div>
        </Space>
      ),
    },
    {
      title: '状态',
      key: 'status',
      render: (_: any, record: Role) => {
        const style = getStatusBadgeStyle(record.status);
        return (
          <Badge status={style.status as any} text={style.text} />
        );
      },
    },
    {
      title: '权限',
      key: 'permissions',
      render: (_: any, record: Role) => {
        // 获取主要权限（最多显示3个）和额外权限数量
        const mainPermissions = record.permissions.slice(0, 3);
        const extraCount = record.permissions.length - 3;

        return (
        <Space wrap>
            {mainPermissions.map(permission => (
              <Tag
                key={permission}
                color={getPermissionTagColor(permission)}
              >
                {getPermissionName(permission)}
            </Tag>
          ))}
            {extraCount > 0 && (
              <Tag>+{extraCount}</Tag>
          )}
        </Space>
        );
      },
    },
    {
      title: '更新时间',
      key: 'updateTime',
      render: (_: any, record: Role) => (
        <Text>{record.updateTime}</Text>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Role) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewRole(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditRole(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteRole(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewDetails = (record: User) => {
    setCurrentUser(record);
    setDetailsModalVisible(true);
  };

  const handleEdit = (record: User) => {
    setCurrentUser(record);
    setEditModalVisible(true);
  };

  const handleLock = (record: User) => {
    Modal.confirm({
      title: '确认锁定用户',
      content: `确定要锁定用户 ${record.realName} 吗？`,
      onOk: () => {
        message.success('用户已锁定');
      },
    });
  };

  const handleUnlock = (record: User) => {
    Modal.confirm({
      title: '确认解锁用户',
      content: `确定要解锁用户 ${record.realName} 吗？`,
      onOk: () => {
        message.success('用户已解锁');
      },
    });
  };

  const handleDelete = (record: User) => {
    Modal.confirm({
      title: '确认删除用户',
      content: `确定要删除用户 ${record.realName} 吗？此操作不可恢复！`,
      onOk: () => {
        message.success('用户已删除');
      },
    });
  };

  // 查看角色详情
  const handleViewRole = (record: Role) => {
    setCurrentRole(record);
    setRoleDetailsVisible(true);
  };

  // 编辑角色
  const handleEditRole = (record: Role) => {
    setCurrentRole(record);
    roleEditForm.setFieldsValue({
      name: record.name,
      description: record.description,
      status: record.status,
      permissions: record.permissions
    });
    setRoleEditVisible(true);
  };

  // 保存角色编辑
  const handleSaveRole = (values: any) => {
    if (!currentRole) return;

    const updatedRole: Role = {
      ...currentRole,
      name: values.name,
      description: values.description,
      status: values.status,
      permissions: values.permissions,
      updateTime: dayjs().format('YYYY-MM-DD')
    };

    setRoleList(roleList.map(role => 
      role.id === currentRole.id ? updatedRole : role
    ));

    message.success('角色更新成功');
    setRoleEditVisible(false);
    roleEditForm.resetFields();
    setCurrentRole(null);
  };

  const handleDeleteRole = (record: Role) => {
    Modal.confirm({
      title: '确认删除角色',
      content: `确定要删除角色 ${record.name} 吗？此操作不可恢复！`,
      onOk: () => {
        message.success('角色已删除');
      },
    });
  };

  // const handleExport = () => {
  //   message.success('数据导出成功');
  // };

  const handleImport = () => {
    message.info('数据导入功能开发中...');
  };

  // 处理部门变更
  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    userForm.setFieldsValue({
      role: undefined
    });
  };

  // 生成随机密码
  const generateRandomPassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    return password;
  };

  // 处理新增用户
  const handleAddUser = (values: any) => {
    const department = Object.values(DEPARTMENTS).find(d => d.name === values.department);
    if (!department) {
      message.error('部门不存在');
      return;
    }

    const realName = values.realName;
    const username = values.username || generateUsername(realName);

    const newUser: User = {
      id: `USER${dayjs().format('YYMMDDHHmmss')}`,
      username,
      realName,

      phone: values.phone,
      role: values.role,
      department: values.department,
      status: 'active',
      lastLogin: '-',
      loginCount: 0,
      createTime: dayjs().format('YYYY-MM-DD'),
      lastPasswordChange: dayjs().format('YYYY-MM-DD'),
      permissions: ROLE_PERMISSIONS[values.role] || ['public:read'],
      twoFactorEnabled: values.twoFactorEnabled,
      loginHistory: []
    };

    setUserList([newUser, ...userList]);
    message.success('用户添加成功');
    setAddUserModalVisible(false);
    userForm.resetFields();
    setSelectedDepartment('');
  };

  // 获取所有可用权限
  const getAllPermissions = () => {
    const permissions: { module: string; moduleName: string; permissions: { code: string; name: string; value: string }[] }[] = [];
    Object.entries(PERMISSIONS).forEach(([module, config]) => {
      const modulePermissions = config.permissions.map(p => ({
        code: p.code,
        name: p.name,
        value: `${config.prefix}:${p.code}`
      }));
      permissions.push({
        module,
        moduleName: config.name,
        permissions: modulePermissions
      });
    });
    return permissions;
  };

  // 处理新增角色
  const handleAddRole = (values: any) => {
    const newRole: Role = {
      id: `ROLE${dayjs().format('YYMMDDHHmmss')}`,
      name: values.name,
      description: values.description,
      permissions: values.permissions,
      userCount: 0, // 新角色初始用户数为0
      status: 'active',
      createTime: dayjs().format('YYYY-MM-DD'),
      updateTime: dayjs().format('YYYY-MM-DD')
    };

    setRoleList([newRole, ...roleList]);
    message.success('角色添加成功');
    setAddRoleModalVisible(false);
    roleForm.resetFields();
    setSelectedPermissions([]);
  };

  // 统计数据
  const totalUsers = userList.length;
  const activeUsers = useMemo(() => userList.filter(user => user.status === 'active').length, [userList]);
  const lockedUsers = useMemo(() => userList.filter(user => user.status === 'locked').length, [userList]);
  const pendingUsers = useMemo(() => userList.filter(user => user.status === 'pending').length, [userList]);
  const totalRoles = roleList.length;
  const activeRoles = useMemo(() => roleList.filter(role => role.status === 'active').length, [roleList]);

  // 用户筛选集合
  const filteredUsers = useMemo(() => {
    const kw = filterKeyword.trim().toLowerCase();
    return userList.filter(user => {
      if (filterDepartment && user.department !== filterDepartment) return false;
      if (filterRole && user.role !== filterRole) return false;
      if (filterStatus && user.status !== (filterStatus as any)) return false;
      if (kw) {
        const hay = `${user.username}${user.realName}${user.namePinyin || ''}${user.phone}${user.department}${user.role}${user.email || ''}`.toLowerCase();
        if (!hay.includes(kw)) return false;
      }
      return true;
    });
  }, [userList, filterDepartment, filterRole, filterStatus, filterKeyword]);

  // 根据用户列表动态更新角色的用户数量
  useEffect(() => {
    setRoleList(prev => prev.map(r => ({
      ...r,
      userCount: userList.filter(u => u.role === r.name).length
    })));
  }, [userList]);

  const resetFilters = () => {
    setFilterDepartment(undefined);
    setFilterRole(undefined);
    setFilterStatus(undefined);
    setFilterKeyword('');
  };

  // 批量操作
  const handleBatchLock = () => {
    if (selectedUsers.length === 0) return;
    Modal.confirm({
      title: '确认锁定选中用户',
      content: `将锁定 ${selectedUsers.length} 个用户，是否继续？`,
      onOk: () => {
        setUserList(prev => prev.map(u => selectedUsers.includes(u.id) ? { ...u, status: 'locked' } : u));
        setSelectedUsers([]);
        message.success('已锁定选中用户');
      }
    });
  };

  const handleBatchUnlock = () => {
    if (selectedUsers.length === 0) return;
    Modal.confirm({
      title: '确认解锁选中用户',
      content: `将解锁 ${selectedUsers.length} 个用户，是否继续？`,
      onOk: () => {
        setUserList(prev => prev.map(u => selectedUsers.includes(u.id) ? { ...u, status: 'active' } : u));
        setSelectedUsers([]);
        message.success('已解锁选中用户');
      }
    });
  };

  const handleBatchDelete = () => {
    if (selectedUsers.length === 0) return;
    Modal.confirm({
      title: '确认删除选中用户',
      content: `将删除 ${selectedUsers.length} 个用户，此操作不可恢复！`,
      onOk: () => {
        setUserList(prev => prev.filter(u => !selectedUsers.includes(u.id)));
        setSelectedUsers([]);
        message.success('已删除选中用户');
      }
    });
  };

  // 导出当前筛选结果 CSV
  const exportFilteredCSV = () => {
    const headers = ['ID','用户名','姓名','电话','部门','角色','状态','最后登录','登录次数','创建时间'];
    const rows = filteredUsers.map(u => [
      u.id,
      u.username,
      u.realName,
      u.phone,
      u.department,
      u.role,
      u.status,
      u.lastLogin,
      u.loginCount,
      u.createTime
    ]);
    const csv = [headers, ...rows]
      .map(r => r.map(field => `"${String(field ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `用户列表_${dayjs().format('YYYYMMDD_HHmmss')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    message.success('已导出当前筛选结果');
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <UserOutlined style={{ marginRight: 8 }} />
        用户管理
      </Title>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="总用户数"
              value={totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="活跃用户"
              value={activeUsers}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="锁定用户"
              value={lockedUsers}
              prefix={<LockOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="待审核用户"
              value={pendingUsers}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="角色总数"
              value={totalRoles}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="活跃角色"
              value={activeRoles}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="用户管理" key="users">
            <div style={{ marginBottom: 16 }}>
              <Row gutter={[8, 8]}>
                <Col xs={24} md={16}>
                  <Space wrap>
                    <Select
                      style={{ width: 160 }}
                      placeholder="所属部门"
                      allowClear
                      value={filterDepartment}
                      onChange={(v) => { setFilterDepartment(v); setFilterRole(undefined); }}
                    >
                      {Object.values(DEPARTMENTS).map(dep => (
                        <Option key={dep.name} value={dep.name}>{dep.name}</Option>
                      ))}
                    </Select>
                    <Select
                      style={{ width: 160 }}
                      placeholder="角色"
                      allowClear
                      value={filterRole}
                      onChange={setFilterRole}
                      disabled={!filterDepartment}
                    >
                      {filterDepartment && Object.values(DEPARTMENTS)
                        .find(d => d.name === filterDepartment)?.roles.map(r => (
                          <Option key={r} value={r}>{r}</Option>
                        ))}
                    </Select>
                    <Select
                      style={{ width: 140 }}
                      placeholder="状态"
                      allowClear
                      value={filterStatus}
                      onChange={setFilterStatus}
                    >
                      <Option value="active">正常</Option>
                      <Option value="inactive">停用</Option>
                      <Option value="locked">锁定</Option>
                      <Option value="pending">待审核</Option>
                    </Select>
                    <Input
                      allowClear
                      style={{ width: 220 }}
                      placeholder="关键词(姓名/用户名/电话)"
                      value={filterKeyword}
                      onChange={e => setFilterKeyword(e.target.value)}
                      prefix={<SearchOutlined />}
                    />
                    <Button onClick={resetFilters}>重置</Button>
                  </Space>
                </Col>
                <Col xs={24} md={8} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button
                      type="primary"
                      icon={<UserAddOutlined />}
                      onClick={() => setAddUserModalVisible(true)}
                    >
                      新增用户
                    </Button>
                    <Button icon={<ExportOutlined />} onClick={exportFilteredCSV}>
                      导出CSV
                    </Button>
                    <Button icon={<ImportOutlined />} onClick={handleImport}>
                      导入数据
                    </Button>
                  </Space>
                </Col>
              </Row>
            </div>

            <div style={{ marginBottom: 8 }}>
              <Space>
                <Button icon={<LockOutlined />} disabled={selectedUsers.length === 0} onClick={handleBatchLock}>
                  批量锁定
                </Button>
                <Button icon={<UnlockOutlined />} disabled={selectedUsers.length === 0} onClick={handleBatchUnlock}>
                  批量解锁
                </Button>
                <Button danger icon={<DeleteOutlined />} disabled={selectedUsers.length === 0} onClick={handleBatchDelete}>
                  批量删除
                </Button>
                <span style={{ color: '#999' }}>已选 {selectedUsers.length} 项</span>
              </Space>
            </div>

            <Table
              columns={userColumns}
              dataSource={filteredUsers}
              rowKey="id"
              loading={loading}
              rowSelection={{
                selectedRowKeys: selectedUsers,
                onChange: (keys: React.Key[]) => setSelectedUsers(keys as string[])
              }}
              pagination={{
                total: filteredUsers.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          
          <TabPane tab="角色管理" key="roles">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button
                  type="primary"
                  icon={<UserAddOutlined />}
                  onClick={() => setAddRoleModalVisible(true)}
                >
                  新增角色
                </Button>
                <Button icon={<ExportOutlined />}>
                  导出角色
                </Button>
                <Button icon={<SearchOutlined />}>
                  搜索角色
                </Button>
              </Space>
            </div>
            <Table
              columns={roleColumns}
              dataSource={roleList}
              rowKey="id"
              loading={loading}
              pagination={{
                total: roleList.length,
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

      {/* 用户详情模态框 */}
      <Modal
        title="用户详情"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={700}
      >
        {currentUser && (
          <div>
            <Descriptions column={2} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="用户名">{currentUser.username}</Descriptions.Item>
              <Descriptions.Item label="真实姓名">{currentUser.realName}</Descriptions.Item>
  
              <Descriptions.Item label="电话">{currentUser.phone}</Descriptions.Item>
              <Descriptions.Item label="角色">{currentUser.role}</Descriptions.Item>
              <Descriptions.Item label="部门">{currentUser.department}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Badge
                  status={getStatusBadgeStyle(currentUser.status).status as any}
                  text={getStatusBadgeStyle(currentUser.status).text}
                />
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">{currentUser.createTime}</Descriptions.Item>
              <Descriptions.Item label="最后登录">{currentUser.lastLogin}</Descriptions.Item>
              <Descriptions.Item label="登录次数">{currentUser.loginCount}</Descriptions.Item>
              <Descriptions.Item label="最后密码修改">{currentUser.lastPasswordChange}</Descriptions.Item>
              <Descriptions.Item label="双因素认证">
                {currentUser.twoFactorEnabled ? '已启用' : '未启用'}
              </Descriptions.Item>
            </Descriptions>
            
            <Divider>权限列表</Divider>
            <Space wrap>
              {currentUser.permissions.map((permission, index) => (
                <Tag key={index} color={getPermissionTagColor(permission)}>
                  {getPermissionName(permission)}
                </Tag>
              ))}
            </Space>

            {currentUser.loginHistory.length > 0 && (
              <>
                <Divider>最近登录记录</Divider>
                <List
                  size="small"
                  dataSource={currentUser.loginHistory}
                  renderItem={(item) => (
                    <List.Item>
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div>
                          <Text strong>{item.loginTime}</Text>
                          <Tag color={item.status === 'success' ? 'green' : 'red'} style={{ marginLeft: 8 }}>
                            {item.status === 'success' ? '成功' : '失败'}
                          </Tag>
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          IP: {item.ipAddress} | 位置: {item.location || '未知'}
                        </div>
                      </Space>
                    </List.Item>
                  )}
                />
              </>
            )}
          </div>
        )}
      </Modal>

      {/* 编辑用户模态框 */}
      <Modal
        title="编辑用户"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => {
          message.success('用户信息更新成功');
          setEditModalVisible(false);
        }}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="用户名">
                <Input defaultValue={currentUser?.username} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="真实姓名">
                <Input defaultValue={currentUser?.realName} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="邮箱">

              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="电话">
                <Input defaultValue={currentUser?.phone} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="角色">
                <Select defaultValue={currentUser?.role}>
                  <Option value="超级管理员">超级管理员</Option>
                  <Option value="部门经理">部门经理</Option>
                  <Option value="普通员工">普通员工</Option>
                  <Option value="财务专员">财务专员</Option>
                  <Option value="访客">访客</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="部门">
                <Select defaultValue={currentUser?.department}>
                  <Option value="信息技术部">信息技术部</Option>
                  <Option value="前厅部">前厅部</Option>
                  <Option value="客房部">客房部</Option>
                  <Option value="财务部">财务部</Option>
                  <Option value="外部用户">外部用户</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="状态">
            <Select defaultValue={currentUser?.status}>
              <Option value="active">正常</Option>
              <Option value="inactive">停用</Option>
              <Option value="locked">锁定</Option>
              <Option value="pending">待审核</Option>
            </Select>
          </Form.Item>
          <Form.Item label="双因素认证">
            <Switch defaultChecked={currentUser?.twoFactorEnabled} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 新增用户模态框 */}
      <Modal
        title="新增用户"
        open={addUserModalVisible}
        onCancel={() => {
          setAddUserModalVisible(false);
          userForm.resetFields();
          setSelectedDepartment('');
        }}
        footer={null}
        width={800}
      >
        <Form
          form={userForm}
          layout="vertical"
          onFinish={handleAddUser}
          initialValues={{
            status: 'active',
            twoFactorEnabled: false
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="realName"
                label="真实姓名"
                rules={[
                  { required: true, message: '请输入真实姓名' },
                  { pattern: /^[\u4e00-\u9fa5]{2,4}$/, message: '请输入2-4个汉字' }
                ]}
              >
                <Input placeholder="请输入真实姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="username"
                label="用户名"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { pattern: /^[a-zA-Z0-9_]{4,20}$/, message: '4-20个字符，只能包含字母、数字和下划线' }
                ]}
              >
                <Input placeholder="请输入用户名，不填将自动生成" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="department"
                label="所属部门"
                rules={[{ required: true, message: '请选择所属部门' }]}
              >
                <Select
                  placeholder="请选择所属部门"
                  onChange={handleDepartmentChange}
                >
                  {Object.values(DEPARTMENTS).map(department => (
                    <Option key={department.name} value={department.name}>
                      {department.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="role"
                label="角色"
                rules={[{ required: true, message: '请选择角色' }]}
              >
                <Select
                  placeholder="请选择角色"
                  disabled={!selectedDepartment}
                >
                  {selectedDepartment &&
                    Object.values(DEPARTMENTS)
                      .find(d => d.name === selectedDepartment)
                      ?.roles.map(role => (
                        <Option key={role} value={role}>
                          {role}
                        </Option>
                      ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="手机号码"
                rules={[
                  { required: true, message: '请输入手机号码' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                ]}
              >
                <Input placeholder="请输入手机号码" />
              </Form.Item>
            </Col>

          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="password"
                label="登录密码"
                rules={[
                  { required: true, message: '请输入登录密码' },
                  { min: 8, message: '密码长度不能小于8位' },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                    message: '密码必须包含大小写字母、数字和特殊字符'
                  }
                ]}
              >
                <Input.Password
                  placeholder="请输入登录密码"
                  visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                  addonAfter={
                    <Button
                      type="link"
                      size="small"
                      onClick={() => {
                        const password = generateRandomPassword();
                        userForm.setFieldsValue({ password });
                        message.success('已生成随机密码');
                      }}
                    >
                      生成随机密码
                    </Button>
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="confirmPassword"
                label="确认密码"
                dependencies={['password']}
                rules={[
                  { required: true, message: '请确认密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="请再次输入密码"
                  visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="twoFactorEnabled"
            valuePropName="checked"
          >
            <Switch checkedChildren="启用双因素认证" unCheckedChildren="禁用双因素认证" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                确认添加
              </Button>
              <Button onClick={() => {
                setAddUserModalVisible(false);
                userForm.resetFields();
                setSelectedDepartment('');
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 新增角色模态框 */}
      <Modal
        title="新增角色"
        open={addRoleModalVisible}
        onCancel={() => {
          setAddRoleModalVisible(false);
          roleForm.resetFields();
          setSelectedPermissions([]);
        }}
        footer={null}
        width={800}
      >
        <Form
          form={roleForm}
          layout="vertical"
          onFinish={handleAddRole}
          initialValues={{
            status: 'active'
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="角色名称"
                rules={[
                  { required: true, message: '请输入角色名称' },
                  { min: 2, max: 20, message: '角色名称长度为2-20个字符' },
                  { pattern: /^[\u4e00-\u9fa5A-Za-z0-9_-]+$/, message: '角色名称只能包含中文、英文、数字、下划线和连字符' }
                ]}
              >
                <Input placeholder="请输入角色名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select>
                  <Option value="active">正常</Option>
                  <Option value="inactive">停用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="角色描述"
            rules={[
              { required: true, message: '请输入角色描述' },
              { min: 10, max: 200, message: '角色描述长度为10-200个字符' }
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder="请输入角色描述"
            />
          </Form.Item>

          {/* 权限设置部分 */}
          <Form.Item
            name="permissions"
            label="权限设置"
            rules={[{ required: true, message: '请至少选择一个权限' }]}
          >
            <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '2px' }}>
              {getAllPermissions().map(({ module, moduleName, permissions }) => (
                <div key={module} style={{ marginBottom: '16px' }}>
                  <Typography.Title level={5}>{moduleName}</Typography.Title>
                  <Space wrap>
                    {permissions.map(permission => (
                      <Checkbox
                        key={permission.value}
                        value={permission.value}
                        onChange={e => {
                          const newPermissions = e.target.checked
                            ? [...selectedPermissions, permission.value]
                            : selectedPermissions.filter(p => p !== permission.value);
                          setSelectedPermissions(newPermissions);
                          roleForm.setFieldsValue({ permissions: newPermissions });
                        }}
                        checked={selectedPermissions.includes(permission.value)}
                      >
                        {permission.name}
                      </Checkbox>
                    ))}
                  </Space>
                </div>
              ))}
            </div>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                确认添加
              </Button>
              <Button onClick={() => {
                setAddRoleModalVisible(false);
                roleForm.resetFields();
                setSelectedPermissions([]);
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 角色详情抽屉 */}
      <Drawer
        title="角色详情"
        width={600}
        open={roleDetailsVisible}
        onClose={() => {
          setRoleDetailsVisible(false);
          setCurrentRole(null);
        }}
        extra={
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setRoleDetailsVisible(false);
              handleEditRole(currentRole!);
            }}
          >
            编辑
          </Button>
        }
      >
        {currentRole && (
          <>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="角色名称" span={2}>
                {currentRole.name}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Badge
                  status={getStatusBadgeStyle(currentRole.status).status as any}
                  text={getStatusBadgeStyle(currentRole.status).text}
                />
              </Descriptions.Item>
              <Descriptions.Item label="用户数量">
                {currentRole.userCount} 人
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {currentRole.createTime}
              </Descriptions.Item>
              <Descriptions.Item label="更新时间">
                {currentRole.updateTime}
              </Descriptions.Item>
              <Descriptions.Item label="角色描述" span={2}>
                {currentRole.description}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">权限列表</Divider>
            <Space wrap style={{ marginBottom: 16 }}>
              {currentRole.permissions.map((permission, index) => (
                <Tag
                  key={index}
                  color={getPermissionTagColor(permission)}
                >
                  {getPermissionName(permission)}
                </Tag>
              ))}
            </Space>

            <Divider orientation="left">用户列表</Divider>
            <List
              size="small"
              bordered
              dataSource={userList.filter(user => user.role === currentRole.name)}
              renderItem={user => (
                <List.Item>
                  <Space>
                    <Avatar size="small" icon={<UserOutlined />} />
                    <Text>{user.realName}</Text>
                    <Text type="secondary">({user.username})</Text>
                  </Space>
                </List.Item>
              )}
              locale={{ emptyText: '暂无用户' }}
            />
          </>
        )}
      </Drawer>

      {/* 编辑角色模态框 */}
      <Modal
        title="编辑角色"
        open={roleEditVisible}
        onCancel={() => {
          setRoleEditVisible(false);
          roleEditForm.resetFields();
          setCurrentRole(null);
        }}
        footer={null}
        width={800}
      >
        <Form
          form={roleEditForm}
          layout="vertical"
          onFinish={handleSaveRole}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="角色名称"
                rules={[
                  { required: true, message: '请输入角色名称' },
                  { min: 2, max: 20, message: '角色名称长度为2-20个字符' },
                  { pattern: /^[\u4e00-\u9fa5A-Za-z0-9_-]+$/, message: '角色名称只能包含中文、英文、数字、下划线和连字符' }
                ]}
              >
                <Input placeholder="请输入角色名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select>
                  <Option value="active">正常</Option>
                  <Option value="inactive">停用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="角色描述"
            rules={[
              { required: true, message: '请输入角色描述' },
              { min: 10, max: 200, message: '角色描述长度为10-200个字符' }
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder="请输入角色描述"
            />
          </Form.Item>

          <Form.Item
            name="permissions"
            label="权限设置"
            rules={[{ required: true, message: '请至少选择一个权限' }]}
          >
            <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '2px' }}>
              {Object.entries(PERMISSIONS).map(([key, config]) => (
                <div key={key} style={{ marginBottom: '16px' }}>
                  <Typography.Title level={5}>{config.name}</Typography.Title>
                  <Space wrap>
                    {config.permissions.map(permission => {
                      const permissionKey = `${config.prefix}:${permission.code}`;
                      return (
                        <Checkbox
                          key={permissionKey}
                          value={permissionKey}
                          onChange={e => {
                            const currentPermissions = roleEditForm.getFieldValue('permissions') || [];
                            if (e.target.checked) {
                              roleEditForm.setFieldsValue({
                                permissions: [...currentPermissions, permissionKey]
                              });
                            } else {
                              roleEditForm.setFieldsValue({
                                permissions: currentPermissions.filter((p: string) => p !== permissionKey)
                              });
                            }
                          }}
                          checked={roleEditForm.getFieldValue('permissions')?.includes(permissionKey)}
                        >
                          {permission.name}
                        </Checkbox>
                      );
                    })}
                  </Space>
                </div>
              ))}
            </div>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存修改
              </Button>
              <Button onClick={() => {
                setRoleEditVisible(false);
                roleEditForm.resetFields();
                setCurrentRole(null);
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement; 