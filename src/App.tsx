import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, theme, Button, Avatar, Dropdown, Space, Typography } from 'antd';
import {
  HomeOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  CloudOutlined,
  
  DatabaseOutlined,
  ToolOutlined,
  QuestionCircleOutlined,
  
  AlertOutlined,
  SafetyCertificateOutlined,
  AudioOutlined,
  VideoCameraOutlined,
  PartitionOutlined,
  ScheduleOutlined,
  SecurityScanOutlined,
  LockOutlined,
  IeOutlined,
  FireOutlined,
  

} from '@ant-design/icons';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import FacialRecognition from './pages/FacialRecognition';
import VideoMonitor from './pages/VideoMonitor';

import AlarmSystem from './pages/AlarmSystem';
import EmergencyManagement from './pages/EmergencyManagement';
import DeviceMonitor from './pages/DeviceMonitor';
import RemoteControl from './pages/RemoteControl';
import FaultWarning from './pages/FaultWarning';
import DeviceAdjustment from './pages/DeviceAdjustment';
import DeviceLinkage from './pages/DeviceLinkage';
import OperationAnalysis from './pages/OperationAnalysis';
import DeliveryRobot from './pages/DeliveryRobot';
import EnvironmentMonitor from './pages/EnvironmentMonitor';
import NetworkStatus from './pages/NetworkStatus';
// import StaffManagement from './pages/StaffManagement';
import UserGuide from './pages/UserGuide';
import CleaningRobot from './pages/CleaningRobot';
import SecuritySystem from './pages/SecuritySystem';
import AccessControl from './pages/AccessControl';

import MaintenanceSchedule from './pages/MaintenanceSchedule';
import InventoryManagement from './pages/InventoryManagement';
import UserManagement from './pages/UserManagement';
import RolePermissions from './pages/RolePermissions';
import SystemLogs from './pages/SystemLogs';
import BackupRestore from './pages/BackupRestore';
import Login from './pages/Login';
import DataStorage from './pages/DataStorage';

// 新增页面导入 - 暂时注释掉，等创建后再启用
// import SecurityManagement from './pages/SecurityManagement';
// import BroadcastSystem from './pages/BroadcastSystem';
import RealTimeBroadcast from './pages/RealTimeBroadcast';
import ScheduledBroadcast from './pages/ScheduledBroadcast';
import ZoneBroadcast from './pages/ZoneBroadcast';
import PermissionManagement from './pages/PermissionManagement';
// import HotelOperations from './pages/HotelOperations';
// import GuestServices from './pages/GuestServices';
// import FinancialManagement from './pages/FinancialManagement';
// import ReportCenter from './pages/ReportCenter';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const menuItems = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: '欢迎页面',
  },
  {
    type: 'divider' as const,
  },

  {
    key: 'security-management',
    icon: <IeOutlined />,
    label: '安防管理',
    children: [
      {
        key: '/security-system',
        icon: <SafetyCertificateOutlined />,
        label: '安全总览',
      },
      {
        key: '/access-control',
        icon: <LockOutlined />,
        label: '通行管理',
      },
      // {
      //   key: '/facial-recognition',
      //   icon: <UserOutlined />,
      //   label: '人脸识别',
      // },
      // {
      //   key: '/video-monitor',
      //   icon: <CameraOutlined />,
      //   label: '视频监控',
      // },
      {
        key: '/alarm-system',
        icon: <AlertOutlined />,
        label: '报警中心',
      },
      {
        key: '/emergency-management',
        icon: <FireOutlined />,
        label: '应急指挥',
      },
    ],
  },
  {
    key: 'broadcast-system',
    icon: <AudioOutlined />,
    label: '广播系统',
    children: [
      {
        key: '/real-time-broadcast',
        icon: <VideoCameraOutlined />,
        label: '实时广播',
      },
      {
        key: '/scheduled-broadcast',
        icon: <ScheduleOutlined />,
        label: '定时广播',
      },
      {
        key: '/zone-broadcast',
        icon: <PartitionOutlined />,
        label: '分区广播',
      },
    ],
  },

  {
    key: 'system-management',
    icon: <ToolOutlined />,
    label: '系统管理',
    children: [
      {
        key: '/user-management',
        icon: <UserOutlined />,
        label: '用户管理',
      },
      // {
      //   key: '/role-permissions',
      //   icon: <KeyOutlined />,
      //   label: '角色权限',
      // },
      {
        key: '/permission-management',
        icon: <SecurityScanOutlined />,
        label: '权限管理',
      },
      {
        key: '/data-storage',
        icon: <DatabaseOutlined />,
        label: '数据存储',
      },
      // {
      //   key: '/system-logs',
      //   icon: <FileTextOutlined />,
      //   label: '系统日志',
      // },
      // {
      //   key: '/backup-restore',
      //   icon: <CloudOutlined />,
      //   label: '备份恢复',
      // },
    ],
  },

  {
    type: 'divider' as const,
  },
];

// 添加路由保护组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    setIsAuthenticated(!!token);
    
    if (!token && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  }, [navigate, location]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 监听路由变化，自动滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // 管理员下拉菜单项
  const adminMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
    // {
    //   key: 'notifications',
    //   icon: <BellOutlined />,
    //   label: '消息通知',
    // },
    // {
    //   key: 'language',
    //   icon: <GlobalOutlined />,
    //   label: '语言设置',
    // },
    // {
    //   key: 'theme',
    //   icon: <StarOutlined />,
    //   label: '主题切换',
    // },
    // {
    //   type: 'divider' as const,
    // },
    // {
    //   key: 'help',
    //   icon: <QuestionCircleOutlined />,
    //   label: '帮助文档',
    // },
    // {
    //   key: 'about',
    //   icon: <InfoCircleOutlined />,
    //   label: '关于系统',
    // },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  // 处理管理员菜单点击
  const handleAdminMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'profile':
        // 跳转到个人资料页面
        navigate('/user-profile');
        window.scrollTo(0, 0);
        break;
      case 'settings':
        // 跳转到系统设置页面
        navigate('/system-settings');
        window.scrollTo(0, 0);
        break;
      case 'notifications':
        // 跳转到消息通知页面
        navigate('/notifications');
        window.scrollTo(0, 0);
        break;
      case 'language':
        // 处理语言设置
        console.log('打开语言设置');
        break;
      case 'theme':
        // 处理主题切换
        console.log('切换主题');
        break;
      case 'help':
        // 跳转到帮助文档
        navigate('/user-guide');
        window.scrollTo(0, 0);
        break;
      case 'about':
        // 跳转到关于系统
        navigate('/about-system');
        window.scrollTo(0, 0);
        break;
      case 'logout':
        // 处理退出登录
        localStorage.removeItem('userToken');
        localStorage.removeItem('userName');
        navigate('/login');
        break;
      default:
        break;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          height: '100vh',
          zIndex: 1000,
          overflow: 'auto'
        }}
      >
        <div className="logo">
          {collapsed ? '渔家里' : '渔家里京杭假日酒店管理系统'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultSelectedKeys={['/']}
          items={menuItems}
          onClick={({ key }) => {
            navigate(key);
            // 页面切换后滚动到顶部
            window.scrollTo(0, 0);
          }}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        <Header style={{ 
          padding: 0, 
          background: colorBgContainer,
          position: 'fixed',
          top: 0,
          right: 0,
          left: collapsed ? 80 : 200,
          zIndex: 999,
          transition: 'left 0.2s',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              渔家里京杭假日酒店管理系统
            </div>
          </div>
          
          {/* 管理员区域 */}
          <div style={{ display: 'flex', alignItems: 'center', marginRight: 24 }}>
            <Space size="middle">              
              {/* 系统状态 */}
              <Button
                type="text"
                icon={<CloudOutlined />}
                style={{
                  fontSize: '16px',
                  width: 40,
                  height: 40,
                }}
                title="系统状态"
              />
              
              {/* 通知图标 */}
              <Button
                type="text"
                icon={<BellOutlined />}
                style={{
                  fontSize: '16px',
                  width: 40,
                  height: 40,
                }}
                title="消息通知"
              />
              
              {/* 帮助按钮 */}
              <Button
                type="text"
                icon={<QuestionCircleOutlined />}
                style={{
                  fontSize: '16px',
                  width: 40,
                  height: 40,
                }}
                title="帮助"
                onClick={() => navigate('/user-guide')}
              />
              
              {/* 管理员头像和下拉菜单 */}
              <Dropdown
                menu={{
                  items: adminMenuItems,
                  onClick: handleAdminMenuClick,
                }}
                placement="bottomRight"
                arrow
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                >
                  <Avatar 
                    size="small" 
                    icon={<UserOutlined />}
                    style={{ marginRight: 8 }}
                  />
                  <Space direction="vertical" size={0} style={{ lineHeight: 1 }}>
                    <Text strong style={{ fontSize: '14px' }}>管理员</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>系统管理员</Text>
                  </Space>
                </div>
              </Dropdown>
            </Space>
          </div>
        </Header>
        <Content style={{ 
          margin: '88px 16px 16px', 
          padding: 24, 
          minHeight: 280,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          overflow: 'initial'
        }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            

            
            {/* 安防管理 */}
            <Route path="/security-system" element={<ProtectedRoute><SecuritySystem /></ProtectedRoute>} />
            <Route path="/access-control" element={<ProtectedRoute><AccessControl /></ProtectedRoute>} />
            <Route path="/facial-recognition" element={<ProtectedRoute><FacialRecognition /></ProtectedRoute>} />
            <Route path="/video-monitor" element={<ProtectedRoute><VideoMonitor /></ProtectedRoute>} />
            <Route path="/alarm-system" element={<ProtectedRoute><AlarmSystem /></ProtectedRoute>} />
            <Route path="/emergency-management" element={<ProtectedRoute><EmergencyManagement /></ProtectedRoute>} />
            
            {/* 广播系统 */}
            <Route path="/real-time-broadcast" element={<ProtectedRoute><RealTimeBroadcast /></ProtectedRoute>} />
            <Route path="/scheduled-broadcast" element={<ProtectedRoute><ScheduledBroadcast /></ProtectedRoute>} />
            <Route path="/zone-broadcast" element={<ProtectedRoute><ZoneBroadcast /></ProtectedRoute>} />
            

            
            {/* 系统管理 */}
            <Route path="/user-management" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
            <Route path="/role-permissions" element={<ProtectedRoute><RolePermissions /></ProtectedRoute>} />
            <Route path="/permission-management" element={<ProtectedRoute><PermissionManagement /></ProtectedRoute>} />
            <Route path="/data-storage" element={<ProtectedRoute><DataStorage /></ProtectedRoute>} />
            <Route path="/system-logs" element={<ProtectedRoute><SystemLogs /></ProtectedRoute>} />
            <Route path="/backup-restore" element={<ProtectedRoute><BackupRestore /></ProtectedRoute>} />
            

            
            {/* 其他功能 */}
            <Route path="/device-monitor" element={<ProtectedRoute><DeviceMonitor /></ProtectedRoute>} />
            <Route path="/remote-control" element={<ProtectedRoute><RemoteControl /></ProtectedRoute>} />
            <Route path="/fault-warning" element={<ProtectedRoute><FaultWarning /></ProtectedRoute>} />
            <Route path="/device-adjustment" element={<ProtectedRoute><DeviceAdjustment /></ProtectedRoute>} />
            <Route path="/device-linkage" element={<ProtectedRoute><DeviceLinkage /></ProtectedRoute>} />
            <Route path="/operation-analysis" element={<ProtectedRoute><OperationAnalysis /></ProtectedRoute>} />
            <Route path="/delivery-robot" element={<ProtectedRoute><DeliveryRobot /></ProtectedRoute>} />
            <Route path="/environment-monitor" element={<ProtectedRoute><EnvironmentMonitor /></ProtectedRoute>} />
            <Route path="/network-status" element={<ProtectedRoute><NetworkStatus /></ProtectedRoute>} />
            <Route path="/user-guide" element={<ProtectedRoute><UserGuide /></ProtectedRoute>} />
            <Route path="/cleaning-robot" element={<ProtectedRoute><CleaningRobot /></ProtectedRoute>} />
            <Route path="/maintenance-schedule" element={<ProtectedRoute><MaintenanceSchedule /></ProtectedRoute>} />
            <Route path="/inventory-management" element={<ProtectedRoute><InventoryManagement /></ProtectedRoute>} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App; 