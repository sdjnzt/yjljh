import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Modal,
  Tag,
  Descriptions,
  Badge,
  Typography,
  Alert
} from 'antd';
import {
  ReloadOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  BugOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

// 日志类型和级别定义
const LOG_TYPES = {
  operation: { 
    name: '操作日志',
    levels: ['info', 'warning', 'error'],
    messages: [
      '办理客人入住手续',
      '处理客人退房结算',
      '修改房间状态为维护中',
      '更新房间价格设置',
      '调整客房预订信息',
      '处理团队预订变更',
      '修改会员等级设置',
      '处理订单退款申请',
      '更新餐饮预订信息',
      '处理会员积分兑换'
    ]
  },
  security: { 
    name: '安全日志',
    levels: ['warning', 'error'],
    messages: [
      '门禁系统异常刷卡',
      '客房保险箱异常开启',
      '监控系统离线告警',
      '消防系统告警触发',
      '电梯系统故障报警',
      '停车场道闸故障',
      '后厨燃气泄漏预警',
      '员工通道未授权进入',
      '贵重物品室异常访问',
      '紧急出口门异常打开'
    ]
  },
  system: { 
    name: '系统日志',
    levels: ['info', 'warning', 'error'],
    messages: [
      '客房管理系统更新',
      '会员管理系统维护',
      '预订系统数据同步',
      '收银系统版本升级',
      '门禁系统配置更新',
      '餐饮系统服务重启',
      '客房空调系统检测',
      '能源管理系统告警',
      '电子发票系统异常',
      '物料库存系统预警'
    ]
  },
  device: { 
    name: '设备日志',
    levels: ['info', 'warning', 'error'],
    messages: [
      '客房空调温控异常',
      '热水系统压力异常',
      '电梯定期维护完成',
      '客房电视信号丢失',
      '房间门锁电量不足',
      '客房小冰箱故障',
      '走廊应急灯故障',
      '健身房设备维护',
      '洗衣房设备检修',
      '游泳池设备维护'
    ]
  },
  service: { 
    name: '服务日志',
    levels: ['info', 'warning', 'error'],
    messages: [
      '客房送餐服务完成',
      '客房清洁任务分配',
      '叫醒服务预约登记',
      '行李寄存服务处理',
      '客房维修工单创建',
      '餐厅预订位置变更',
      '班车服务时间调整',
      '会议室设备检查',
      '客人投诉意见处理',
      '失物招领信息登记'
    ]
  }
};

const LOG_LEVELS = {
  info: { 
    icon: <InfoCircleOutlined />, 
    text: '信息', 
    color: 'blue',
    details: [
      '操作已完成，服务正常',
      '系统运行状态良好',
      '设备运行参数正常',
      '服务请求处理完成',
      '日常维护工作完成'
    ]
  },
  warning: { 
    icon: <WarningOutlined />, 
    text: '警告', 
    color: 'orange',
    details: [
      '设备运行参数异常',
      '系统响应时间较长',
      '服务质量需要提升',
      '设备需要维护保养',
      '任务执行时间超时'
    ]
  },
  error: { 
    icon: <ExclamationCircleOutlined />, 
    text: '错误', 
    color: 'red',
    details: [
      '设备运行故障停止',
      '系统服务执行失败',
      '关键操作执行错误',
      '设备离线无法访问',
      '服务请求处理失败'
    ]
  }
};

const USERS = [
  { username: 'admin', name: '张志强', roles: ['酒店经理'] },
  { username: 'front001', name: '王丽娜', roles: ['前台主管'] },
  { username: 'front002', name: '李小梅', roles: ['前台接待'] },
  { username: 'front003', name: '赵雨婷', roles: ['前台接待'] },
  { username: 'front004', name: '刘佳怡', roles: ['前台接待'] },
  { username: 'house001', name: '陈晓华', roles: ['客房部主管'] },
  { username: 'house002', name: '杨雪梅', roles: ['楼层主管'] },
  { username: 'house003', name: '孙丽华', roles: ['楼层主管'] },
  { username: 'house004', name: '周玉兰', roles: ['客房服务员'] },
  { username: 'house005', name: '吴秀珍', roles: ['客房服务员'] },
  { username: 'eng001', name: '郑建国', roles: ['工程部主管'] },
  { username: 'eng002', name: '王德明', roles: ['维修工程师'] },
  { username: 'eng003', name: '张大伟', roles: ['维修工程师'] },
  { username: 'eng004', name: '李建军', roles: ['维修工程师'] },
  { username: 'security001', name: '刘卫东', roles: ['安保主管'] },
  { username: 'security002', name: '陈国强', roles: ['安保队长'] },
  { username: 'security003', name: '赵志刚', roles: ['安保员'] },
  { username: 'security004', name: '钱铁军', roles: ['安保员'] },
  { username: 'restaurant001', name: '王凤英', roles: ['餐饮部主管'] },
  { username: 'restaurant002', name: '张国华', roles: ['中餐厅主管'] },
  { username: 'restaurant003', name: '李志勇', roles: ['西餐厅主管'] },
  { username: 'restaurant004', name: '陈师傅', roles: ['中餐厨师长'] },
  { username: 'restaurant005', name: '马大厨', roles: ['西餐厨师长'] }
];

const SOURCES = [
  { 
    name: '前台系统', 
    modules: [
      '入住登记模块', 
      '预订管理模块', 
      '结算收银模块', 
      '会员管理模块', 
      '发票管理模块'
    ] 
  },
  { 
    name: '客房管理', 
    modules: [
      '房态管理模块', 
      '清洁管理模块', 
      '维修管理模块', 
      '客房用品模块', 
      'minibar管理模块'
    ] 
  },
  { 
    name: '安保系统', 
    modules: [
      '门禁控制模块', 
      '监控管理模块', 
      '消防系统模块', 
      '停车管理模块', 
      '巡更管理模块'
    ] 
  },
  { 
    name: '工程系统', 
    modules: [
      '设备维护模块', 
      '能源管理模块', 
      '空调控制模块', 
      '电梯管理模块', 
      '给排水模块'
    ] 
  },
  { 
    name: '餐饮系统', 
    modules: [
      '餐厅预订模块', 
      '点餐管理模块', 
      '厨房管理模块', 
      '库存管理模块', 
      '送餐管理模块'
    ] 
  }
];

// 日志接口定义
interface LogEntry {
  id: string;
  type: string;
  level: string;
  message: string;
  details: string;
  source: string;
  username: string;
  ip: string;
  timestamp: string;
  status: 'pending' | 'processed' | 'ignored';
  handler?: string;
  handleTime?: string;
  handleResult?: string;
}

const SystemLogs: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [logList, setLogList] = useState<LogEntry[]>([]);
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [currentLog, setCurrentLog] = useState<LogEntry | null>(null);

  // 生成更真实的时间
  const generateTodayTime = () => {
    const now = dayjs();
    const randomMinutes = Math.floor(Math.random() * 60);
    const randomSeconds = Math.floor(Math.random() * 60);
    return now.subtract(randomMinutes, 'minute')
              .subtract(randomSeconds, 'second')
              .format('YYYY-MM-DD HH:mm:ss');
  };

  // 生成更真实的模拟数据
  const generateMockLogs = () => {
    const logs: LogEntry[] = Array.from({ length: 100 }, (_, index) => {
      // 随机选择日志类型
      const type = Object.keys(LOG_TYPES)[Math.floor(Math.random() * Object.keys(LOG_TYPES).length)];
      const typeConfig = LOG_TYPES[type as keyof typeof LOG_TYPES];
      
      // 根据日志类型选择合适的级别
      const level = typeConfig.levels[Math.floor(Math.random() * typeConfig.levels.length)];
      const levelConfig = LOG_LEVELS[level as keyof typeof LOG_LEVELS];
      
      // 随机选择用户
      const user = USERS[Math.floor(Math.random() * USERS.length)];
      
      // 随机选择来源
      const source = SOURCES[Math.floor(Math.random() * SOURCES.length)];
      const sourceModule = source.modules[Math.floor(Math.random() * source.modules.length)];
      
      // 生成状态和处理信息
      const status = ['pending', 'processed', 'ignored'][Math.floor(Math.random() * 3)] as 'pending' | 'processed' | 'ignored';
      const isHandled = status === 'processed' || status === 'ignored';
      
      // 生成消息和详情
      const message = typeConfig.messages[Math.floor(Math.random() * typeConfig.messages.length)];
      const timestamp = generateTodayTime();
      const ip = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

      // 更新详情生成逻辑
      const details = `${levelConfig.details[Math.floor(Math.random() * levelConfig.details.length)]}
操作模块：${sourceModule}
操作人员：${user.name}（${user.roles.join('，')}）
操作终端：前台${Math.floor(Math.random() * 5 + 1)}号工作站
登录IP：${ip}
操作时间：${timestamp}
关联单号：${dayjs().format('YYYYMMDD')}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}
处理状态：${status === 'processed' ? '已完成' : status === 'ignored' ? '已忽略' : '待处理'}
执行耗时：${Math.floor(Math.random() * 1000)}ms`;

      return {
        id: (index + 1).toString().padStart(6, '0'),
        type,
        level,
        message: `${user.name}${message}`,
        details,
        source: `${source.name} - ${sourceModule}`,
        username: user.username,
        ip,
        timestamp,
        status,
        ...(isHandled ? {
          handler: USERS[Math.floor(Math.random() * USERS.length)].name,
          handleTime: generateTodayTime(),
          handleResult: status === 'processed' ? 
            ['处理完成', '已解决', '已修复', '已确认', '已完成'][Math.floor(Math.random() * 5)] :
            ['已忽略 - 误报', '已忽略 - 测试数据', '已忽略 - 重复告警', '已忽略 - 非必要处理'][Math.floor(Math.random() * 4)]
        } : {})
      };
    });

    // 按时间倒序排序
    return logs.sort((a, b) => dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf());
  };

  // 初始化加载数据
  useEffect(() => {
    const mockLogs = generateMockLogs();
    setLogList(mockLogs);
  }, []);

  // 刷新数据
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      const mockLogs = generateMockLogs();
      setLogList(mockLogs);
      setLoading(false);
    }, 500);
  };

  // 获取日志类型样式
  const getTypeStyle = (type: string) => {
    const typeConfig = LOG_TYPES[type as keyof typeof LOG_TYPES];
    return {
      color: 'blue',
      text: typeConfig?.name || type
    };
  };

  // 获取日志级别样式
  const getLevelStyle = (level: string) => {
    const levelConfig = LOG_LEVELS[level as keyof typeof LOG_LEVELS];
    return {
      icon: levelConfig?.icon,
      color: levelConfig?.color || 'default',
      text: levelConfig?.text || level
    };
  };

  // 获取状态样式
  const getStatusStyle = (status: 'pending' | 'processed' | 'ignored') => {
    switch (status) {
      case 'processed':
        return { color: '#52c41a', text: '已处理' };
      case 'ignored':
        return { color: '#666666', text: '已忽略' };
      case 'pending':
        return { color: '#faad14', text: '待处理' };
      default:
        return { color: 'default', text: '未知' } as const;
    }
  };

  // 表格列配置
  const columns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: () => generateTodayTime(),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const style = getTypeStyle(type);
        return <Tag color={style.color}>{style.text}</Tag>;
      },
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (level: string) => {
        const style = getLevelStyle(level);
        return (
          <Tag icon={style.icon} color={style.color}>
            {style.text}
        </Tag>
        );
      },
    },
    {
      title: '消息',
      dataIndex: 'message',
      key: 'message',
      width: 200,
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 120,
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: '用户',
      dataIndex: 'username',
      key: 'username',
      width: 100,
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 120,
      render: (text: string) => <Text code>{text}</Text>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: 'pending' | 'processed' | 'ignored') => {
        const style = getStatusStyle(status);
        return <Tag color={style.color}>{style.text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: unknown, record: LogEntry) => (
        <Space>
          <Button type="link" onClick={() => handleViewDetails(record)}>
            详情
          </Button>
        </Space>
      ),
    },
  ];

  // 查看详情
  const handleViewDetails = (log: LogEntry) => {
    setCurrentLog(log);
    setDetailsModalVisible(true);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
              刷新
            </Button>
          </Space>
        </div>

            <Table
          loading={loading}
          columns={columns}
              dataSource={logList}
              rowKey="id"
          rowSelection={{
            selectedRowKeys: selectedLogs,
            onChange: (selectedRowKeys) => setSelectedLogs(selectedRowKeys as string[]),
          }}
              pagination={{
                total: logList.length,
            pageSize: 10,
                showQuickJumper: true,
                showSizeChanger: true,
          }}
        />

      <Modal
        title="日志详情"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
          width={800}
      >
        {currentLog && (
            <>
              <Alert
                message={currentLog.message}
                type={currentLog.level as any}
                showIcon
                style={{ marginBottom: 24 }}
              />

          <Descriptions column={2} bordered>
                <Descriptions.Item label="日志ID" span={2}>
                  {currentLog.id}
                </Descriptions.Item>
                <Descriptions.Item label="时间">
                  {generateTodayTime()}
                </Descriptions.Item>
                <Descriptions.Item label="类型">
                  <Tag color={getTypeStyle(currentLog.type).color}>
                    {getTypeStyle(currentLog.type).text}
                  </Tag>
                </Descriptions.Item>
            <Descriptions.Item label="级别">
                  <Tag
                    icon={getLevelStyle(currentLog.level).icon}
                    color={getLevelStyle(currentLog.level).color}
                  >
                    {getLevelStyle(currentLog.level).text}
              </Tag>
            </Descriptions.Item>
                <Descriptions.Item label="来源">
                  {currentLog.source}
                </Descriptions.Item>
                <Descriptions.Item label="用户">
                  {currentLog.username}
                </Descriptions.Item>
                <Descriptions.Item label="IP地址">
                  {currentLog.ip}
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag color={getStatusStyle(currentLog.status).color}>
                    {getStatusStyle(currentLog.status).text}
              </Tag>
            </Descriptions.Item>
                <Descriptions.Item label="处理人">
                  {currentLog.handler || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="处理时间">
                  {generateTodayTime()}
            </Descriptions.Item>
                <Descriptions.Item label="处理结果" span={2}>
                  {currentLog.handleResult || '-'}
            </Descriptions.Item>
              <Descriptions.Item label="详细信息" span={2}>
                  {currentLog.details}
              </Descriptions.Item>
          </Descriptions>
            </>
        )}
      </Modal>
      </Card>
    </div>
  );
};

export default SystemLogs; 