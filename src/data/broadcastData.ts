/**
 * 统一的数据配置文件
 * 确保所有广播相关页面使用一致的数据结构
 */

// 广播区域数据
export const broadcastZones = [
  {
    id: 1,
    key: 'lobby',
    name: '前厅区域',
    code: 'LOBBY',
    description: '酒店前厅及接待区域',
    deviceCount: 12,
    status: 'active',
    signal: 95,
    volume: 80,
    priority: 'high',
    parentZone: null,
    children: ['前厅', '接待台', '休息区']
  },
  {
    id: 2,
    key: 'restaurant',
    name: '餐饮区域',
    code: 'DINING',
    description: '餐厅、酒吧等餐饮服务区域',
    deviceCount: 15,
    status: 'active',
    signal: 88,
    volume: 75,
    priority: 'high',
    parentZone: null,
    children: ['主餐厅', '酒吧', '咖啡厅', '宴会厅']
  },
  {
    id: 3,
    key: 'rooms',
    name: '客房区域',
    code: 'ROOMS',
    description: '客房楼层及走廊',
    deviceCount: 45,
    status: 'active',
    signal: 92,
    volume: 70,
    priority: 'normal',
    parentZone: null,
    children: ['1楼客房', '2楼客房', '3楼客房', '4楼客房']
  },
  {
    id: 4,
    key: 'leisure',
    name: '休闲娱乐',
    code: 'LEISURE',
    description: '健身房、游泳池、SPA等休闲设施',
    deviceCount: 8,
    status: 'active',
    signal: 89,
    volume: 70,
    priority: 'normal',
    parentZone: null,
    children: ['健身房', '游泳池', 'SPA中心', '花园']
  },
  {
    id: 5,
    key: 'parking',
    name: '停车场',
    code: 'PARKING',
    description: '地下及地面停车场',
    deviceCount: 6,
    status: 'active',
    signal: 85,
    volume: 85,
    priority: 'low',
    parentZone: null,
    children: ['地下停车场', '地面停车场']
  },
  {
    id: 6,
    key: 'garden',
    name: '花园',
    code: 'GARDEN',
    description: '酒店花园及户外休闲区域',
    deviceCount: 6,
    status: 'active',
    signal: 82,
    volume: 65,
    priority: 'normal',
    parentZone: null,
    children: ['主花园', '凉亭', '小径']
  },
  {
    id: 7,
    key: 'pool',
    name: '游泳池',
    code: 'POOL',
    description: '室内外游泳池区域',
    deviceCount: 3,
    status: 'active',
    signal: 90,
    volume: 80,
    priority: 'normal',
    parentZone: null,
    children: ['室内泳池', '室外泳池', '休息区']
  },
  {
    id: 8,
    key: 'gym',
    name: '健身房',
    code: 'GYM',
    description: '健身房及运动设施区域',
    deviceCount: 2,
    status: 'active',
    signal: 87,
    volume: 75,
    priority: 'normal',
    parentZone: null,
    children: ['器械区', '瑜伽室']
  },
  {
    id: 9,
    key: 'spa',
    name: 'SPA中心',
    code: 'SPA',
    description: 'SPA及按摩服务区域',
    deviceCount: 2,
    status: 'active',
    signal: 89,
    volume: 78,
    priority: 'normal',
    parentZone: null,
    children: ['SPA室', '休息区']
  }
  ,
  {
    id: 10,
    key: 'conference',
    name: '会议中心',
    code: 'CONF',
    description: '多功能厅与会议室区域',
    deviceCount: 10,
    status: 'active',
    signal: 90,
    volume: 72,
    priority: 'normal',
    parentZone: null,
    children: ['多功能厅', '会议室A', '会议室B']
  },
  {
    id: 11,
    key: 'corridor',
    name: '公共走廊',
    code: 'CORRIDOR',
    description: '公共区域走廊与通道',
    deviceCount: 12,
    status: 'active',
    signal: 86,
    volume: 68,
    priority: 'low',
    parentZone: null,
    children: ['一层走廊', '二层走廊', '三层走廊']
  },
  {
    id: 12,
    key: 'backyard',
    name: '后勤区',
    code: 'BACK',
    description: '后厨、仓库、员工通道',
    deviceCount: 7,
    status: 'active',
    signal: 84,
    volume: 70,
    priority: 'normal',
    parentZone: null,
    children: ['后厨', '仓库', '员工通道']
  },
  {
    id: 13,
    key: 'rooftop',
    name: '屋顶花园',
    code: 'ROOF',
    description: '屋顶露台与花园',
    deviceCount: 5,
    status: 'active',
    signal: 80,
    volume: 60,
    priority: 'low',
    parentZone: null,
    children: ['观景台', '露台区']
  },
  {
    id: 14,
    key: 'service',
    name: '服务中心',
    code: 'SERVICE',
    description: '客服与礼宾服务区域',
    deviceCount: 6,
    status: 'active',
    signal: 88,
    volume: 70,
    priority: 'normal',
    parentZone: null,
    children: ['客服台', '礼宾台']
  }
];

// 设备数据
export const broadcastDevices = [
  {
    id: 1,
    name: '前厅音响01',
    zoneId: 1,
    zoneName: '前厅区域',
    zoneKey: 'lobby',
    type: 'speaker',
    model: 'JBL-2000',
    ip: '192.168.1.101',
    status: 'online',
    volume: 80,
    lastSeen: '2025-01-15 14:30:00',
    firmware: 'v2.1.0',
    uptime: '99.8%',
    signalStrength: '95%',
    temperature: '42°C',
    powerConsumption: '45W'
  },
  {
    id: 2,
    name: '餐厅音响01',
    zoneId: 2,
    zoneName: '餐饮区域',
    zoneKey: 'restaurant',
    type: 'speaker',
    model: 'JBL-2000',
    ip: '192.168.1.102',
    status: 'online',
    volume: 75,
    lastSeen: '2025-01-15 14:28:00',
    firmware: 'v2.1.0',
    uptime: '99.5%',
    signalStrength: '92%',
    temperature: '45°C',
    powerConsumption: '48W'
  },
  {
    id: 3,
    name: '客房走廊音响01',
    zoneId: 3,
    zoneName: '客房区域',
    zoneKey: 'rooms',
    type: 'speaker',
    model: 'JBL-1500',
    ip: '192.168.1.103',
    status: 'offline',
    volume: 60,
    lastSeen: '2025-01-15 14:20:00',
    firmware: 'v2.0.5',
    uptime: '0%',
    signalStrength: '0%',
    temperature: '25°C',
    powerConsumption: '0W'
  },
  {
    id: 4,
    name: '健身房功放01',
    zoneId: 4,
    zoneName: '休闲娱乐',
    zoneKey: 'leisure',
    type: 'amplifier',
    model: 'Crown-XLS1002',
    ip: '192.168.1.104',
    status: 'online',
    volume: 70,
    lastSeen: '2025-01-15 14:25:00',
    firmware: 'v1.8.2',
    uptime: '99.2%',
    signalStrength: '88%',
    temperature: '52°C',
    powerConsumption: '120W'
  },
  {
    id: 5,
    name: '停车场控制器01',
    zoneId: 5,
    zoneName: '停车场',
    zoneKey: 'parking',
    type: 'controller',
    model: 'DSP-2000',
    ip: '192.168.1.105',
    status: 'online',
    volume: 85,
    lastSeen: '2025-01-15 14:22:00',
    firmware: 'v2.0.1',
    uptime: '99.9%',
    signalStrength: '98%',
    temperature: '38°C',
    powerConsumption: '25W'
  },
  {
    id: 6,
    name: '花园音响01',
    zoneId: 6,
    zoneName: '花园',
    zoneKey: 'garden',
    type: 'speaker',
    model: 'JBL-1500',
    ip: '192.168.1.106',
    status: 'offline',
    volume: 0,
    lastSeen: '2025-01-15 10:15:00',
    firmware: 'v2.0.5',
    uptime: '0%',
    signalStrength: '0%',
    temperature: '20°C',
    powerConsumption: '0W'
  },
  {
    id: 7,
    name: '游泳池音响01',
    zoneId: 7,
    zoneName: '游泳池',
    zoneKey: 'pool',
    type: 'speaker',
    model: 'JBL-2000',
    ip: '192.168.1.107',
    status: 'online',
    volume: 80,
    lastSeen: '2025-01-15 14:18:00',
    firmware: 'v2.1.0',
    uptime: '99.7%',
    signalStrength: '90%',
    temperature: '48°C',
    powerConsumption: '52W'
  },
  {
    id: 8,
    name: '健身房音响01',
    zoneId: 8,
    zoneName: '健身房',
    zoneKey: 'gym',
    type: 'speaker',
    model: 'JBL-1500',
    ip: '192.168.1.108',
    status: 'online',
    volume: 75,
    lastSeen: '2025-01-15 14:16:00',
    firmware: 'v2.0.5',
    uptime: '99.3%',
    signalStrength: '87%',
    temperature: '44°C',
    powerConsumption: '38W'
  },
  {
    id: 9,
    name: 'SPA音响01',
    zoneId: 9,
    zoneName: 'SPA中心',
    zoneKey: 'spa',
    type: 'speaker',
    model: 'JBL-1500',
    ip: '192.168.1.109',
    status: 'online',
    volume: 78,
    lastSeen: '2025-01-15 14:14:00',
    firmware: 'v2.0.5',
    uptime: '99.6%',
    signalStrength: '89%',
    temperature: '46°C',
    powerConsumption: '41W'
  }
];

// 定时任务数据
export const scheduledTasks = [
  {
    id: 1,
    name: '早餐时间提醒',
    type: 'voice',
    content: '亲爱的宾客，早餐时间到了，欢迎到餐厅享用美味的早餐。',
    zones: ['客房区域', '餐厅'],
    zoneKeys: ['rooms', 'restaurant'],
    scheduledTime: '07:00:00',
    startDate: '2025-01-15',
    endDate: '2025-12-31',
    repeatType: 'daily',
    status: 'active',
    volume: 75,
    priority: 'normal',
    lastExecuted: '2025-01-15 07:00:00',
    nextExecution: '2025-01-16 07:00:00',
    executionCount: 15,
    successRate: 100
  },
  {
    id: 2,
    name: '午餐时间提醒',
    type: 'voice',
    content: '午餐时间到了，餐厅为您准备了丰盛的午餐，欢迎品尝。',
    zones: ['餐厅', '客房区域'],
    zoneKeys: ['restaurant', 'rooms'],
    scheduledTime: '12:00:00',
    startDate: '2025-01-15',
    endDate: '2025-12-31',
    repeatType: 'daily',
    status: 'active',
    volume: 70,
    priority: 'normal',
    lastExecuted: '2025-01-15 12:00:00',
    nextExecution: '2025-01-16 12:00:00',
    executionCount: 15,
    successRate: 100
  },
  {
    id: 3,
    name: '晚安广播',
    type: 'voice',
    content: '晚安，祝您有个美好的夜晚，明天见。',
    zones: ['全区域'],
    zoneKeys: ['lobby', 'restaurant', 'rooms', 'leisure', 'parking', 'garden', 'pool', 'gym', 'spa'],
    scheduledTime: '22:00:00',
    startDate: '2025-01-15',
    endDate: '2025-12-31',
    repeatType: 'daily',
    status: 'active',
    volume: 60,
    priority: 'low',
    lastExecuted: '2025-01-14 22:00:00',
    nextExecution: '2025-01-15 22:00:00',
    executionCount: 14,
    successRate: 100
  },
  {
    id: 4,
    name: '周末特别音乐',
    type: 'audio',
    content: '周末特别播放的轻音乐',
    zones: ['前厅', '花园'],
    zoneKeys: ['lobby', 'garden'],
    scheduledTime: '15:00:00',
    startDate: '2025-01-20',
    endDate: '2025-12-31',
    repeatType: 'weekly',
    status: 'paused',
    volume: 65,
    priority: 'normal',
    lastExecuted: '2025-01-13 15:00:00',
    nextExecution: '2025-01-20 15:00:00',
    executionCount: 2,
    successRate: 100
  },
  {
    id: 5,
    name: '紧急疏散演练',
    type: 'voice',
    content: '这是紧急疏散演练广播，请按照指示有序撤离。',
    zones: ['全区域'],
    zoneKeys: ['lobby', 'restaurant', 'rooms', 'leisure', 'parking', 'garden', 'pool', 'gym', 'spa'],
    scheduledTime: '10:00:00',
    startDate: '2025-01-25',
    endDate: '2025-01-25',
    repeatType: 'once',
    status: 'active',
    volume: 90,
    priority: 'high',
    lastExecuted: null,
    nextExecution: '2025-01-25 10:00:00',
    executionCount: 0,
    successRate: 0
  },
  {
    id: 6,
    name: '月度安全提醒',
    type: 'voice',
    content: '请注意消防安全，保持通道畅通，祝您入住愉快。',
    zones: ['客房区域', '公共区域'],
    zoneKeys: ['rooms', 'lobby', 'restaurant', 'leisure'],
    scheduledTime: '09:00:00',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    repeatType: 'monthly',
    status: 'active',
    volume: 80,
    priority: 'normal',
    lastExecuted: '2025-01-01 09:00:00',
    nextExecution: '2025-02-01 09:00:00',
    executionCount: 1,
    successRate: 100
  }
];

// 预设广播模板
export const presetTemplates = [
  {
    id: 1,
    name: '欢迎词模板',
    type: 'voice',
    content: '欢迎光临渔家里京杭假日酒店，祝您入住愉快！',
    zones: ['lobby', 'restaurant'],
    volume: 80,
    priority: 'normal'
  },
  {
    id: 2,
    name: '紧急疏散模板',
    type: 'voice',
    content: '紧急情况，请按照指示有序疏散，保持冷静！',
    zones: ['lobby', 'restaurant', 'rooms', 'parking', 'pool', 'gym', 'spa'],
    volume: 95,
    priority: 'emergency'
  },
  {
    id: 3,
    name: '用餐提醒模板',
    type: 'voice',
    content: '餐厅已为您准备好丰盛的早餐，欢迎享用！',
    zones: ['lobby', 'rooms'],
    volume: 75,
    priority: 'normal'
  },
  {
    id: 4,
    name: '背景音乐模板',
    type: 'audio',
    content: '轻音乐播放',
    zones: ['lobby', 'restaurant', 'spa'],
    volume: 60,
    priority: 'low'
  }
];

// 广播历史数据
export const broadcastHistory = [
  {
    id: 1,
    name: '早餐提醒广播',
    type: 'voice',
    content: '亲爱的宾客，早餐时间到了，欢迎到餐厅享用美味的早餐。',
    zones: ['客房区域', '餐厅'],
    zoneKeys: ['rooms', 'restaurant'],
    status: 'completed',
    startTime: '2025-01-15 07:00:00',
    endTime: '2025-01-15 07:00:30',
    duration: '30秒',
    volume: 75,
    priority: 'normal',
    operator: '系统管理员'
  },
  {
    id: 2,
    name: '欢迎词广播',
    type: 'voice',
    content: '欢迎光临渔家里京杭假日酒店！',
    zones: ['前厅'],
    zoneKeys: ['lobby'],
    status: 'playing',
    startTime: '2025-01-15 14:30:00',
    endTime: null,
    duration: null,
    volume: 80,
    priority: 'normal',
    operator: '前台接待'
  },
  {
    id: 3,
    name: '紧急疏散演练',
    type: 'voice',
    content: '这是紧急疏散演练广播，请按照指示有序撤离。',
    zones: ['全区域'],
    zoneKeys: ['lobby', 'restaurant', 'rooms', 'leisure', 'parking', 'garden', 'pool', 'gym', 'spa'],
    status: 'completed',
    startTime: '2025-01-15 10:00:00',
    endTime: '2025-01-15 10:02:00',
    duration: '2分钟',
    volume: 90,
    priority: 'emergency',
    operator: '安全主管'
  },
  {
    id: 4,
    name: '背景音乐',
    type: 'audio',
    content: '轻音乐播放',
    zones: ['前厅', '餐厅', 'SPA中心'],
    zoneKeys: ['lobby', 'restaurant', 'spa'],
    status: 'completed',
    startTime: '2025-01-15 12:00:00',
    endTime: '2025-01-15 12:30:00',
    duration: '30分钟',
    volume: 60,
    priority: 'low',
    operator: '系统管理员'
  }
];

// 获取区域名称的辅助函数
export const getZoneNameByKey = (zoneKey: string): string => {
  const zone = broadcastZones.find(z => z.key === zoneKey);
  return zone ? zone.name : zoneKey;
};

// 获取区域名称列表的辅助函数
export const getZoneNamesByKeys = (zoneKeys: string[]): string[] => {
  return zoneKeys.map(key => getZoneNameByKey(key));
};

// 获取区域键值列表的辅助函数
export const getZoneKeysByName = (zoneNames: string[]): string[] => {
  return zoneNames.map(name => {
    const zone = broadcastZones.find(z => z.name === name);
    return zone ? zone.key : name;
  });
};
