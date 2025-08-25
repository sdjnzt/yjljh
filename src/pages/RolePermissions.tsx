import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Typography,
  Divider,
  Tooltip,
  Badge,
  Tabs,
  List,
  Descriptions,
  Tree,
  Checkbox,
  message,
  Drawer,
  Alert,
  Upload,
  DatePicker,
} from 'antd';
import {
  KeyOutlined,
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExportOutlined,
  ImportOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  StarOutlined,
  UserOutlined,
  DatabaseOutlined,
  InfoCircleOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  permissions: string[];
  userCount: number;
  status: 'active' | 'inactive';
  createTime: string;
  updateTime: string;
  level: number;
  parentRole?: string;
  children?: Role[];
}

interface Permission {
  id: string;
  name: string;
  code: string;
  description: string;
  module: string;
  type: 'menu' | 'button' | 'api';
  status: 'active' | 'inactive';
  createTime: string;
}

interface PermissionGroup {
  title: string;
  key: string;
  children: Permission[];
}

// 权限模块配置
const PERMISSIONS = {
  system: {
    name: '系统管理',
    prefix: 'system',
    permissions: [
      { code: 'admin:view', name: '查看系统管理', description: '查看系统管理页面及基本信息' },
      { code: 'admin:edit', name: '编辑系统设置', description: '修改系统基本设置和配置项' },
      { code: 'config:view', name: '查看系统配置', description: '查看系统配置信息' },
      { code: 'config:edit', name: '编辑系统配置', description: '修改系统配置参数' },
      { code: 'log:view', name: '查看系统日志', description: '查看系统操作日志' },
      { code: 'log:export', name: '导出系统日志', description: '导出系统日志数据' }
    ]
  },
  user: {
    name: '用户管理',
    prefix: 'user',
    permissions: [
      { code: 'list:view', name: '查看用户列表', description: '查看用户列表及基本信息' },
      { code: 'detail:view', name: '查看用户详情', description: '查看用户详细信息' },
      { code: 'create', name: '创建用户', description: '创建新用户账号' },
      { code: 'edit', name: '编辑用户', description: '修改用户信息' },
      { code: 'delete', name: '删除用户', description: '删除用户账号' },
      { code: 'import', name: '导入用户', description: '批量导入用户数据' },
      { code: 'export', name: '导出用户', description: '导出用户数据' }
    ]
  },
  role: {
    name: '角色管理',
    prefix: 'role',
    permissions: [
      { code: 'list:view', name: '查看角色列表', description: '查看角色列表及基本信息' },
      { code: 'detail:view', name: '查看角色详情', description: '查看角色详细信息' },
      { code: 'create', name: '创建角色', description: '创建新角色' },
      { code: 'edit', name: '编辑角色', description: '修改角色信息' },
      { code: 'delete', name: '删除角色', description: '删除角色' },
      { code: 'assign', name: '分配权限', description: '为角色分配权限' }
    ]
  },
  room: {
    name: '房间管理',
    prefix: 'room',
    permissions: [
      { code: 'list:view', name: '查看房间列表', description: '查看房间列表及基本信息' },
      { code: 'detail:view', name: '查看房间详情', description: '查看房间详细信息' },
      { code: 'create', name: '创建房间', description: '创建新房间' },
      { code: 'edit', name: '编辑房间', description: '修改房间信息' },
      { code: 'delete', name: '删除房间', description: '删除房间' },
      { code: 'status:edit', name: '修改房间状态', description: '修改房间状态(空闲/占用/维护等)' },
      { code: 'price:edit', name: '修改房间价格', description: '修改房间价格设置' }
    ]
  },
  booking: {
    name: '预订管理',
    prefix: 'booking',
    permissions: [
      { code: 'list:view', name: '查看预订列表', description: '查看预订列表及基本信息' },
      { code: 'detail:view', name: '查看预订详情', description: '查看预订详细信息' },
      { code: 'create', name: '创建预订', description: '创建新预订' },
      { code: 'edit', name: '编辑预订', description: '修改预订信息' },
      { code: 'cancel', name: '取消预订', description: '取消预订' },
      { code: 'checkin', name: '办理入住', description: '为预订办理入住' },
      { code: 'checkout', name: '办理退房', description: '为预订办理退房' }
    ]
  },
  finance: {
    name: '财务管理',
    prefix: 'finance',
    permissions: [
      { code: 'bill:view', name: '查看账单', description: '查看账单信息' },
      { code: 'bill:create', name: '创建账单', description: '创建新账单' },
      { code: 'bill:edit', name: '编辑账单', description: '修改账单信息' },
      { code: 'payment:view', name: '查看支付记录', description: '查看支付记录' },
      { code: 'payment:process', name: '处理支付', description: '处理支付操作' },
      { code: 'refund:process', name: '处理退款', description: '处理退款操作' },
      { code: 'report:view', name: '查看财务报表', description: '查看财务统计报表' }
    ]
  },
  inventory: {
    name: '库存管理',
    prefix: 'inventory',
    permissions: [
      { code: 'list:view', name: '查看库存列表', description: '查看库存列表及基本信息' },
      { code: 'detail:view', name: '查看库存详情', description: '查看库存详细信息' },
      { code: 'in', name: '入库操作', description: '执行入库操作' },
      { code: 'out', name: '出库操作', description: '执行出库操作' },
      { code: 'adjust', name: '调整库存', description: '调整库存数量' },
      { code: 'check', name: '库存盘点', description: '执行库存盘点' },
      { code: 'report:view', name: '查看库存报表', description: '查看库存统计报表' }
    ]
  }
};

// 生成权限名称映射
const PERMISSION_NAMES = Object.entries(PERMISSIONS).reduce((acc, [moduleKey, moduleConfig]) => {
  moduleConfig.permissions.forEach(permission => {
    const key = `${moduleConfig.prefix}:${permission.code}`;
    acc[key] = permission.name;
  });
  return acc;
}, {} as { [key: string]: string });

const RolePermissions: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [roleList, setRoleList] = useState<Role[]>([]);
  const [permissionList, setPermissionList] = useState<Permission[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [activeTab, setActiveTab] = useState('roles');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [addPermissionModalVisible, setAddPermissionModalVisible] = useState(false);
  const [searchForm] = Form.useForm();
  const [permissionForm] = Form.useForm();
  const [searchParams, setSearchParams] = useState<any>(null);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [timeKey, setTimeKey] = useState(0); // 添加用于触发重新渲染的key

  // 添加定时器以更新时间显示
  useEffect(() => {
    // 每分钟更新一次时间显示
    const timer = setInterval(() => {
      setTimeKey(prev => prev + 1);
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // 模拟数据
  const mockRoles: Role[] = [
    {
      id: '1',
      name: '超级管理员',
      code: 'SUPER_ADMIN',
      description: '拥有系统所有权限，可以管理所有用户和系统设置',
      permissions: ['*'],
      userCount: 1,
      status: 'active',
      createTime: '2023-01-01',
      updateTime: '2025-07-10',
      level: 1,
    },
    {
      id: '2',
      name: '系统管理员',
      code: 'SYSTEM_ADMIN',
      description: '系统管理权限，可以管理用户、角色和系统配置',
      permissions: ['user:*', 'role:*', 'system:*'],
      userCount: 2,
      status: 'active',
      createTime: '2023-02-01',
      updateTime: '2025-07-05',
      level: 2,
      parentRole: '1',
    },
    {
      id: '3',
      name: '部门经理',
      code: 'DEPT_MANAGER',
      description: '部门管理权限，可以管理本部门用户和数据',
      permissions: ['user:read', 'user:write', 'room:*', 'staff:*'],
      userCount: 5,
      status: 'active',
      createTime: '2023-03-01',
      updateTime: '2025-07-01',
      level: 3,
      parentRole: '2',
    },
    {
      id: '4',
      name: '普通员工',
      code: 'STAFF',
      description: '基础操作权限，可以查看和操作分配的功能',
      permissions: ['room:read', 'inventory:read', 'report:read'],
      userCount: 20,
      status: 'active',
      createTime: '2023-04-01',
      updateTime: '2025-07-01',
      level: 4,
      parentRole: '3',
    },
    {
      id: '5',
      name: '财务专员',
      code: 'FINANCE',
      description: '财务相关操作权限',
      permissions: ['finance:*', 'report:read', 'inventory:read'],
      userCount: 3,
      status: 'active',
      createTime: '2023-05-01',
      updateTime: '2025-07-08',
      level: 3,
      parentRole: '2',
    },
    {
      id: '6',
      name: '访客',
      code: 'GUEST',
      description: '仅可查看公开信息',
      permissions: ['public:read'],
      userCount: 10,
      status: 'active',
      createTime: '2025-07-01',
      updateTime: '2025-07-10',
      level: 5,
      parentRole: '4',
    },
  ];

  // 生成一个月内的随机时间
  const generateRandomTimeInLastMonth = () => {
    const now = dayjs();
    const oneMonthAgo = now.subtract(1, 'month');
    const randomDays = Math.floor(Math.random() * 30); // 0-29天
    const randomHours = Math.floor(Math.random() * 24); // 0-23小时
    const randomMinutes = Math.floor(Math.random() * 60); // 0-59分钟
    return oneMonthAgo.add(randomDays, 'day').add(randomHours, 'hour').add(randomMinutes, 'minute').format('YYYY-MM-DD HH:mm:ss');
  };

  const mockPermissions: Permission[] = [
    // 用户管理权限
    { id: '1', name: '查看用户', code: 'user:read', description: '查看用户列表和详情', module: '用户管理', type: 'menu', status: 'active', createTime: generateRandomTimeInLastMonth() },
    { id: '2', name: '创建用户', code: 'user:create', description: '创建新用户', module: '用户管理', type: 'button', status: 'active', createTime: generateRandomTimeInLastMonth() },
    { id: '3', name: '编辑用户', code: 'user:write', description: '编辑用户信息', module: '用户管理', type: 'button', status: 'active', createTime: generateRandomTimeInLastMonth() },
    { id: '4', name: '删除用户', code: 'user:delete', description: '删除用户', module: '用户管理', type: 'button', status: 'active', createTime: generateRandomTimeInLastMonth() },
    
    // 角色管理权限
    { id: '5', name: '查看角色', code: 'role:read', description: '查看角色列表和详情', module: '角色管理', type: 'menu', status: 'active', createTime: generateRandomTimeInLastMonth() },
    { id: '6', name: '创建角色', code: 'role:create', description: '创建新角色', module: '角色管理', type: 'button', status: 'active', createTime: generateRandomTimeInLastMonth() },
    { id: '7', name: '编辑角色', code: 'role:write', description: '编辑角色信息', module: '角色管理', type: 'button', status: 'active', createTime: generateRandomTimeInLastMonth() },
    { id: '8', name: '删除角色', code: 'role:delete', description: '删除角色', module: '角色管理', type: 'button', status: 'active', createTime: generateRandomTimeInLastMonth() },
    
    // 房间管理权限
    { id: '9', name: '查看房间', code: 'room:read', description: '查看房间列表和详情', module: '房间管理', type: 'menu', status: 'active', createTime: generateRandomTimeInLastMonth() },
    { id: '10', name: '创建房间', code: 'room:create', description: '创建新房间', module: '房间管理', type: 'button', status: 'active', createTime: generateRandomTimeInLastMonth() },
    { id: '11', name: '编辑房间', code: 'room:write', description: '编辑房间信息', module: '房间管理', type: 'button', status: 'active', createTime: generateRandomTimeInLastMonth() },
    { id: '12', name: '删除房间', code: 'room:delete', description: '删除房间', module: '房间管理', type: 'button', status: 'active', createTime: generateRandomTimeInLastMonth() },
    
    // 库存管理权限
    { id: '13', name: '查看库存', code: 'inventory:read', description: '查看库存列表和详情', module: '库存管理', type: 'menu', status: 'active', createTime: generateRandomTimeInLastMonth() },
    { id: '14', name: '入库操作', code: 'inventory:in', description: '执行入库操作', module: '库存管理', type: 'button', status: 'active', createTime: generateRandomTimeInLastMonth() },
    { id: '15', name: '出库操作', code: 'inventory:out', description: '执行出库操作', module: '库存管理', type: 'button', status: 'active', createTime: generateRandomTimeInLastMonth() },
    { id: '16', name: '库存调整', code: 'inventory:adjust', description: '调整库存数量', module: '库存管理', type: 'button', status: 'active', createTime: generateRandomTimeInLastMonth() },
    
    // 财务权限
    { id: '17', name: '查看财务', code: 'finance:read', description: '查看财务数据', module: '财务管理', type: 'menu', status: 'active', createTime: generateRandomTimeInLastMonth() },
    { id: '18', name: '财务录入', code: 'finance:write', description: '录入财务数据', module: '财务管理', type: 'button', status: 'active', createTime: generateRandomTimeInLastMonth() },
    { id: '19', name: '财务审核', code: 'finance:approve', description: '审核财务数据', module: '财务管理', type: 'button', status: 'active', createTime: generateRandomTimeInLastMonth() },
    
    // 系统管理权限
    { id: '20', name: '系统设置', code: 'system:config', description: '系统配置管理', module: '系统管理', type: 'menu', status: 'active', createTime: generateRandomTimeInLastMonth() },
    { id: '21', name: '日志查看', code: 'system:log', description: '查看系统日志', module: '系统管理', type: 'menu', status: 'active', createTime: generateRandomTimeInLastMonth() },
    { id: '22', name: '备份恢复', code: 'system:backup', description: '系统备份恢复', module: '系统管理', type: 'menu', status: 'active', createTime: generateRandomTimeInLastMonth() },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setRoleList(mockRoles);
      setPermissionList(mockPermissions);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '启用';
      case 'inactive':
        return '停用';
      default:
        return '未知';
    }
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return 'red';
      case 2:
        return 'orange';
      case 3:
        return 'blue';
      case 4:
        return 'green';
      case 5:
        return 'purple';
      default:
        return 'default';
    }
  };

  const handleViewDetails = (record: Role) => {
    setCurrentRole(record);
    setDetailsModalVisible(true);
  };

  const handleEdit = (record: Role) => {
    setCurrentRole(record);
    setEditModalVisible(true);
  };

  const handleManagePermissions = (record: Role) => {
    setCurrentRole(record);
    setPermissionModalVisible(true);
  };

  const handleDelete = (record: Role) => {
    Modal.confirm({
      title: '确认删除角色',
      content: `确定要删除角色 ${record.name} 吗？此操作不可恢复！`,
      onOk: () => {
        message.success('角色已删除');
      },
    });
  };

  const handleEditPermission = (record: Permission) => {
    message.info('编辑权限信息');
  };

  const handleDeletePermission = (record: Permission) => {
    Modal.confirm({
      title: '确认删除权限',
      content: `确定要删除权限 ${record.name} 吗？`,
      onOk: () => {
        message.success('权限已删除');
      },
    });
  };

  const handleExport = () => {
    message.success('数据导出成功');
  };

  const handleImport = () => {
    message.info('数据导入功能开发中...');
  };

  // 添加新角色
  const handleAddRole = () => {
    setAddModalVisible(true);
  };

  // 保存新角色
  const handleSaveNewRole = (values: any) => {
    const newRole: Role = {
      id: (roleList.length + 1).toString(),
      name: values.name,
      code: values.code,
      description: values.description,
      permissions: values.permissions || [],
      status: values.status,
      level: values.level,
      userCount: 0,
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
    };

    setRoleList([newRole, ...roleList]);
    message.success('角色创建成功');
    setAddModalVisible(false);
  };

  // 保存权限更新
  const handleSavePermissions = (permissions: string[]) => {
    if (!currentRole) return;

    const updatedRole: Role = {
      ...currentRole,
      permissions,
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
    };

    setRoleList(roleList.map(role => 
      role.id === currentRole.id ? updatedRole : role
    ));

    message.success('权限更新成功');
    setPermissionModalVisible(false);
  };

  // 构建权限树数据
  const buildPermissionTree = () => {
    return Object.entries(PERMISSIONS).map(([key, config]) => ({
      title: config.name,
      key: key,
      children: config.permissions.map(permission => {
        const permissionKey = `${config.prefix}:${permission.code}`;
        return {
          title: (
            <Space>
              <span>{permission.name}</span>
              <Tooltip title={permission.description}>
                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
              </Tooltip>
            </Space>
          ),
          key: permissionKey,
          description: permission.description
        };
      })
    }));
  };

  // 统计数据
  const totalRoles = roleList.length;
  const activeRoles = roleList.filter(role => role.status === 'active').length;
  const totalPermissions = permissionList.length;
  const activePermissions = permissionList.filter(p => p.status === 'active').length;
  const totalUsers = roleList.reduce((sum, role) => sum + role.userCount, 0);

  // 修改权限管理模态框内容
  const PermissionManagement: React.FC<{
    role: Role;
    onSave: (permissions: string[]) => void;
    onCancel: () => void;
  }> = ({ role, onSave, onCancel }) => {
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
      role.permissions.includes('*') ? [] : role.permissions
    );
    const [expandedKeys, setExpandedKeys] = useState<string[]>(
      Object.keys(PERMISSIONS)
    );
    const [searchValue, setSearchValue] = useState('');

    const treeData = useMemo(() => buildPermissionTree(), []);

    const handleSearch = (value: string) => {
      setSearchValue(value);
      if (value) {
        // 展开所有节点以显示搜索结果
        setExpandedKeys(Object.keys(PERMISSIONS));
      }
    };

    const handleCheck = (checkedKeys: any) => {
      setSelectedPermissions(checkedKeys as string[]);
    };

    const handleSelectAll = (moduleKey: string) => {
      const modulePermissions = PERMISSIONS[moduleKey as keyof typeof PERMISSIONS].permissions.map(
        p => `${PERMISSIONS[moduleKey as keyof typeof PERMISSIONS].prefix}:${p.code}`
      );
      
      const newSelectedPermissions = [...selectedPermissions];
      modulePermissions.forEach(permission => {
        if (!newSelectedPermissions.includes(permission)) {
          newSelectedPermissions.push(permission);
        }
      });
      
      setSelectedPermissions(newSelectedPermissions);
    };

    const handleUnselectAll = (moduleKey: string) => {
      const modulePermissions = PERMISSIONS[moduleKey as keyof typeof PERMISSIONS].permissions.map(
        p => `${PERMISSIONS[moduleKey as keyof typeof PERMISSIONS].prefix}:${p.code}`
      );
      
      setSelectedPermissions(
        selectedPermissions.filter(p => !modulePermissions.includes(p))
      );
    };

    return (
      <div>
        <Alert
          message="权限说明"
          description="选择该角色拥有的权限。每个权限代表特定的操作权限，请谨慎分配。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Input.Search
          placeholder="搜索权限"
          allowClear
          onChange={e => handleSearch(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        <div style={{ marginBottom: 16 }}>
          {Object.entries(PERMISSIONS).map(([key, config]) => (
            <Space key={key} style={{ marginRight: 16 }}>
              <Text strong>{config.name}:</Text>
              <Button size="small" onClick={() => handleSelectAll(key)}>全选</Button>
              <Button size="small" onClick={() => handleUnselectAll(key)}>取消全选</Button>
            </Space>
          ))}
        </div>

        <Tree
          checkable
          checkedKeys={selectedPermissions}
          expandedKeys={expandedKeys}
          onExpand={keys => setExpandedKeys(keys as string[])}
          onCheck={handleCheck}
          treeData={treeData}
          height={400}
          showLine
          disabled={role.permissions.includes('*')}
        />

        {role.permissions.includes('*') && (
          <Alert
            message="该角色拥有所有权限"
            type="warning"
            showIcon
            style={{ marginTop: 16 }}
          />
        )}

        <div style={{ marginTop: 16 }}>
          <Space>
            <Button type="primary" onClick={() => onSave(selectedPermissions)}>
              保存
            </Button>
            <Button onClick={onCancel}>
              取消
            </Button>
          </Space>
        </div>
      </div>
    );
  };

  // 修改 buildMatrixColumns 函数
  const buildMatrixColumns = () => {
    const baseColumns = {
      title: '角色',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left' as const,
      width: 150,
      render: (text: string, record: Role) => (
        <Space>
          <Text strong>{text}</Text>
          <Tag color={getLevelColor(record.level)}>级别 {record.level}</Tag>
        </Space>
      )
    };

    const permissionColumns = Object.entries(PERMISSIONS).map(([moduleKey, moduleConfig]) => ({
      title: moduleConfig.name,
      key: moduleKey,
      children: moduleConfig.permissions.map(permission => {
        const permissionKey = `${moduleConfig.prefix}:${permission.code}`;
        return {
          title: (
            <Tooltip title={permission.description}>
              <span>{permission.name}</span>
            </Tooltip>
          ),
          key: permissionKey,
          dataIndex: permissionKey,
          width: 100,
          render: (_: any, record: Role) => (
            <Checkbox
              checked={record.permissions.includes('*') || record.permissions.includes(permissionKey)}
              disabled={record.permissions.includes('*')}
            />
          )
        };
      })
    }));

    return [baseColumns, ...permissionColumns];
  };

  // 高级搜索
  const handleSearch = (values: any) => {
    setSearchParams(values);
    setSearchModalVisible(false);
    searchForm.resetFields();
  };

  // 导出数据
  const handleExportData = () => {
    const data = roleList.map(role => ({
      角色名称: role.name,
      角色代码: role.code,
      角色级别: role.level,
      角色描述: role.description,
      状态: role.status === 'active' ? '启用' : '停用',
      用户数量: role.userCount,
      创建时间: role.createTime,
      更新时间: role.updateTime,
      权限列表: role.permissions.map(p => PERMISSION_NAMES[p] || p).join(', ')
    }));

    // 创建CSV内容
    const headers = ['角色名称', '角色代码', '角色级别', '角色描述', '状态', '用户数量', '创建时间', '更新时间', '权限列表'];
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n');

    // 创建Blob并下载
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `角色权限数据_${dayjs().format('YYYYMMDD_HHmmss')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    message.success('数据导出成功');
  };

  // 导入数据
  const handleImportData = (info: any) => {
    if (info.file.status === 'done') {
      message.success('数据导入成功');
      setUploadModalVisible(false);
    } else if (info.file.status === 'error') {
      message.error('数据导入失败');
    }
  };

  // 新增权限
  const handleAddPermission = (values: any) => {
    const newPermission: Permission = {
      id: (permissionList.length + 1).toString(),
      name: values.name,
      code: values.code,
      description: values.description,
      module: values.module,
      type: values.type as 'menu' | 'button' | 'api',
      status: 'active' as const,
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
    };

    setPermissionList([newPermission, ...permissionList]);
    message.success('权限创建成功');
    setAddPermissionModalVisible(false);
    permissionForm.resetFields();
  };

  // 导出权限
  const handleExportPermissions = () => {
    const data = permissionList.map(permission => ({
      权限名称: permission.name,
      权限代码: permission.code,
      权限描述: permission.description,
      所属模块: permission.module,
      类型: permission.type === 'menu' ? '菜单' : permission.type === 'button' ? '按钮' : 'API',
      状态: permission.status === 'active' ? '启用' : '停用',
      创建时间: permission.createTime
    }));

    // 创建CSV内容
    const headers = ['权限名称', '权限代码', '权限描述', '所属模块', '类型', '状态', '创建时间'];
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n');

    // 创建Blob并下载
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `权限数据_${dayjs().format('YYYYMMDD_HHmmss')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    message.success('权限数据导出成功');
  };

  // 搜索权限
  const handleSearchPermission = (value: string) => {
    if (!value) {
      loadData();
      return;
    }

    const filteredPermissions = permissionList.filter(permission => 
      permission.name.toLowerCase().includes(value.toLowerCase()) ||
      permission.code.toLowerCase().includes(value.toLowerCase()) ||
      permission.description.toLowerCase().includes(value.toLowerCase()) ||
      permission.module.toLowerCase().includes(value.toLowerCase())
    );

    setPermissionList(filteredPermissions);
  };

  // 获取相对时间显示
  const getRelativeTime = (time: string) => {
    return dayjs(time).fromNow();
  };

  // 修改表格列配置,添加相对时间显示
  const roleColumns = [
    {
      title: '角色信息',
      key: 'info',
      render: (_: any, record: Role) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong>{record.name}</Text>
            <Tag color={getLevelColor(record.level)} style={{ marginLeft: 8 }}>
              级别 {record.level}
            </Tag>
            <Tag color="blue" style={{ marginLeft: 8 }}>
              {record.userCount} 用户
            </Tag>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            代码: {record.code}
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
      render: (_: any, record: Role) => (
        <Badge
          status={getStatusColor(record.status) as any}
          text={getStatusText(record.status)}
        />
      ),
    },
    {
      title: '权限数量',
      key: 'permissions',
      render: (_: any, record: Role) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong>{record.permissions.length}</Text> 个权限
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.permissions.includes('*') ? '所有权限' : '部分权限'}
          </div>
        </Space>
      ),
    },
    {
      title: '更新时间',
      key: 'updateTime',
      render: (_: any, record: Role) => (
        <Tooltip title={record.updateTime} key={timeKey}>
          {getRelativeTime(record.updateTime)}
        </Tooltip>
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
            onClick={() => handleViewDetails(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<KeyOutlined />}
            onClick={() => handleManagePermissions(record)}
          >
            权限
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

  const permissionColumns = [
    {
      title: '权限信息',
      key: 'info',
      render: (_: any, record: Permission) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong>{record.name}</Text>
            <Tag color="blue" style={{ marginLeft: 8 }}>
              {record.module}
            </Tag>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            代码: {record.code}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.description}
          </div>
        </Space>
      ),
    },
    {
      title: '类型',
      key: 'type',
      render: (_: any, record: Permission) => (
        <Tag color={record.type === 'menu' ? 'green' : record.type === 'button' ? 'blue' : 'orange'}>
          {record.type === 'menu' ? '菜单' : record.type === 'button' ? '按钮' : 'API'}
        </Tag>
      ),
    },
    {
      title: '状态',
      key: 'status',
      render: (_: any, record: Permission) => (
        <Badge
          status={getStatusColor(record.status) as any}
          text={getStatusText(record.status)}
        />
      ),
    },
    {
      title: '创建时间',
      key: 'createTime',
      render: (_: any, record: Permission) => (
        <Tooltip title={record.createTime} key={timeKey}>
          {getRelativeTime(record.createTime)}
        </Tooltip>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Permission) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditPermission(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeletePermission(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <KeyOutlined style={{ marginRight: 8 }} />
        角色权限管理
      </Title>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="角色总数"
              value={totalRoles}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="活跃角色"
              value={activeRoles}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="权限总数"
              value={totalPermissions}
              prefix={<KeyOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="活跃权限"
              value={activePermissions}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="用户总数"
              value={totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="权限模块"
              value={Array.from(new Set(permissionList.map(p => p.module))).length}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="角色管理" key="roles">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button type="primary" icon={<UserAddOutlined />} onClick={handleAddRole}>
                  新增角色
                </Button>
                <Button icon={<ExportOutlined />} onClick={handleExportData}>
                  导出数据
                </Button>
                <Button icon={<ImportOutlined />} onClick={() => setUploadModalVisible(true)}>
                  导入数据
                </Button>
                <Button icon={<SearchOutlined />} onClick={() => setSearchModalVisible(true)}>
                  高级搜索
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
          
          <TabPane tab="权限管理" key="permissions">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button type="primary" icon={<KeyOutlined />} onClick={() => setAddPermissionModalVisible(true)}>
                  新增权限
                </Button>
                <Button icon={<ExportOutlined />} onClick={handleExportPermissions}>
                  导出权限
                </Button>
                <Input.Search
                  placeholder="搜索权限"
                  allowClear
                  onSearch={handleSearchPermission}
                  style={{ width: 200 }}
                />
              </Space>
            </div>
            <Table
              columns={permissionColumns}
              dataSource={permissionList}
              rowKey="id"
              loading={loading}
              pagination={{
                total: permissionList.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>

          <TabPane tab="权限矩阵" key="matrix">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Text type="secondary">显示角色与权限的对应关系</Text>
                <Tooltip title="勾选表示拥有该权限">
                  <InfoCircleOutlined />
                </Tooltip>
              </Space>
            </div>
            <Table
              columns={buildMatrixColumns()}
              dataSource={roleList}
              rowKey="id"
              scroll={{ x: 'max-content' }}
              pagination={false}
              size="small"
              bordered
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 角色详情模态框 */}
      <Modal
        title="角色详情"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={700}
      >
        {currentRole && (
          <div>
            <Descriptions column={2} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="角色名称">{currentRole.name}</Descriptions.Item>
              <Descriptions.Item label="角色代码">{currentRole.code}</Descriptions.Item>
              <Descriptions.Item label="角色级别">
                <Tag color={getLevelColor(currentRole.level)}>级别 {currentRole.level}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="用户数量">{currentRole.userCount}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Badge
                  status={getStatusColor(currentRole.status) as any}
                  text={getStatusText(currentRole.status)}
                />
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">{currentRole.createTime}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{currentRole.updateTime}</Descriptions.Item>
              <Descriptions.Item label="描述" span={2}>
                {currentRole.description}
              </Descriptions.Item>
            </Descriptions>
            
            <Divider>权限列表</Divider>
            <Space wrap>
              {currentRole.permissions.includes('*') ? (
                <Tag color="red">所有权限</Tag>
              ) : (
                currentRole.permissions.map((permission, index) => (
                  <Tag key={index} color="blue">{permission}</Tag>
                ))
              )}
            </Space>
          </div>
        )}
      </Modal>

      {/* 新增角色模态框 */}
      <Modal
        title="新增角色"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form layout="vertical" onFinish={handleSaveNewRole}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="角色名称"
                rules={[
                  { required: true, message: '请输入角色名称' },
                  { min: 2, max: 20, message: '角色名称长度为2-20个字符' }
                ]}
              >
                <Input placeholder="请输入角色名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="角色代码"
                rules={[
                  { required: true, message: '请输入角色代码' },
                  { pattern: /^[A-Z_]+$/, message: '角色代码只能包含大写字母和下划线' }
                ]}
              >
                <Input placeholder="请输入角色代码" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="level"
            label="角色级别"
            rules={[{ required: true, message: '请选择角色级别' }]}
          >
            <Select>
              <Option value={1}>级别 1 - 超级管理员</Option>
              <Option value={2}>级别 2 - 系统管理员</Option>
              <Option value={3}>级别 3 - 部门经理</Option>
              <Option value={4}>级别 4 - 普通员工</Option>
              <Option value={5}>级别 5 - 访客</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Option value="active">启用</Option>
              <Option value="inactive">停用</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="角色描述"
            rules={[
              { required: true, message: '请输入角色描述' },
              { min: 10, max: 200, message: '角色描述长度为10-200个字符' }
            ]}
          >
            <Input.TextArea rows={3} placeholder="请输入角色描述" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                创建
              </Button>
              <Button onClick={() => setAddModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑角色模态框 */}
      <Modal
        title="编辑角色"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => {
          message.success('角色信息更新成功');
          setEditModalVisible(false);
        }}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="角色名称">
                <Input defaultValue={currentRole?.name} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="角色代码">
                <Input defaultValue={currentRole?.code} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="角色级别">
            <Select defaultValue={currentRole?.level}>
              <Option value={1}>级别 1 - 超级管理员</Option>
              <Option value={2}>级别 2 - 系统管理员</Option>
              <Option value={3}>级别 3 - 部门经理</Option>
              <Option value={4}>级别 4 - 普通员工</Option>
              <Option value={5}>级别 5 - 访客</Option>
            </Select>
          </Form.Item>
          <Form.Item label="状态">
            <Select defaultValue={currentRole?.status}>
              <Option value="active">启用</Option>
              <Option value="inactive">停用</Option>
            </Select>
          </Form.Item>
          <Form.Item label="角色描述">
            <TextArea rows={3} defaultValue={currentRole?.description} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 权限管理抽屉 */}
      <Drawer
        title={`管理权限 - ${currentRole?.name}`}
        open={permissionModalVisible}
        onClose={() => setPermissionModalVisible(false)}
        width={800}
      >
        {currentRole && (
          <PermissionManagement
            role={currentRole}
            onSave={handleSavePermissions}
            onCancel={() => setPermissionModalVisible(false)}
          />
        )}
      </Drawer>

      {/* 高级搜索模态框 */}
      <Modal
        title="高级搜索"
        open={searchModalVisible}
        onCancel={() => setSearchModalVisible(false)}
        footer={null}
      >
        <Form
          form={searchForm}
          layout="vertical"
          onFinish={handleSearch}
        >
          <Form.Item name="name" label="角色名称">
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item name="code" label="角色代码">
            <Input placeholder="请输入角色代码" />
          </Form.Item>
          <Form.Item name="level" label="角色级别">
            <Select allowClear>
              <Option value={1}>级别 1 - 超级管理员</Option>
              <Option value={2}>级别 2 - 系统管理员</Option>
              <Option value={3}>级别 3 - 部门经理</Option>
              <Option value={4}>级别 4 - 普通员工</Option>
              <Option value={5}>级别 5 - 访客</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select allowClear>
              <Option value="active">启用</Option>
              <Option value="inactive">停用</Option>
            </Select>
          </Form.Item>
          <Form.Item name="timeRange" label="更新时间">
            <DatePicker.RangePicker showTime />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
              <Button onClick={() => {
                searchForm.resetFields();
                setSearchParams(null);
              }}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 新增权限模态框 */}
      <Modal
        title="新增权限"
        open={addPermissionModalVisible}
        onCancel={() => setAddPermissionModalVisible(false)}
        footer={null}
      >
        <Form
          form={permissionForm}
          layout="vertical"
          onFinish={handleAddPermission}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="权限名称"
                rules={[
                  { required: true, message: '请输入权限名称' },
                  { min: 2, max: 20, message: '权限名称长度为2-20个字符' }
                ]}
              >
                <Input placeholder="请输入权限名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="权限代码"
                rules={[
                  { required: true, message: '请输入权限代码' },
                  { pattern: /^[a-z]+:[a-z]+(?::[a-z]+)?$/, message: '权限代码格式为 module:action 或 module:resource:action' }
                ]}
              >
                <Input placeholder="请输入权限代码" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="module"
            label="所属模块"
            rules={[{ required: true, message: '请选择所属模块' }]}
          >
            <Select>
              {Object.entries(PERMISSIONS).map(([key, config]) => (
                <Option key={key} value={key}>{config.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="type"
            label="权限类型"
            rules={[{ required: true, message: '请选择权限类型' }]}
          >
            <Select>
              <Option value="menu">菜单</Option>
              <Option value="button">按钮</Option>
              <Option value="api">API</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="权限描述"
            rules={[
              { required: true, message: '请输入权限描述' },
              { min: 10, max: 200, message: '权限描述长度为10-200个字符' }
            ]}
          >
            <Input.TextArea rows={3} placeholder="请输入权限描述" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                创建
              </Button>
              <Button onClick={() => {
                setAddPermissionModalVisible(false);
                permissionForm.resetFields();
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 导入数据模态框 */}
      <Modal
        title="导入数据"
        open={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={null}
      >
        <Upload.Dragger
          name="file"
          multiple={false}
          action="/api/role/import"
          onChange={handleImportData}
          accept=".csv,.xlsx,.xls"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">
            支持 .csv、.xlsx、.xls 格式的文件
          </p>
        </Upload.Dragger>
      </Modal>
    </div>
  );
};

export default RolePermissions; 