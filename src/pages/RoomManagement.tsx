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
  Calendar,
  Typography,
  Divider,
  Tooltip,
  Badge,
  Tabs,
  List,
  Descriptions,
  Progress,
  Switch,
  message,
} from 'antd';
import dayjs from 'dayjs';
import {
  HomeOutlined,
  UserOutlined,
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExportOutlined,
  ImportOutlined,
  SearchOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  StarOutlined,
  WifiOutlined,
  BulbOutlined,
  ToolOutlined,
  ClearOutlined,
  KeyOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface Room {
  id: string;
  roomNumber: string;
  type: string;
  floor: number;
  status: 'occupied' | 'vacant' | 'cleaning' | 'maintenance' | 'reserved';
  guestName?: string;
  checkInDate?: string;
  checkOutDate?: string;
  price: number;
  amenities: string[];
  cleaningStatus: 'clean' | 'dirty' | 'cleaning';
  maintenanceStatus: 'normal' | 'minor' | 'major';
  lastCleaned: string;
  nextCleaning: string;
}

interface Booking {
  id: string;
  roomNumber: string;
  guestName: string;
  phone: string;
  checkInDate: string;
  checkOutDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  totalAmount: number;
  deposit: number;
  specialRequests?: string;
}

// 房型配置
const ROOM_TYPES = {
  standard: {
    name: '标准间',
    basePrice: 288,
    amenities: ['WiFi', '空调', '电视', '独立卫浴'],
    count: { min: 40, max: 50 }
  },
  deluxe: {
    name: '豪华间',
    basePrice: 388,
    amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台'],
    count: { min: 30, max: 40 }
  },
  suite: {
    name: '套房',
    basePrice: 688,
    amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '厨房'],
    count: { min: 15, max: 20 }
  },
  business: {
    name: '商务套房',
    basePrice: 888,
    amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '办公桌', '会议设施'],
    count: { min: 10, max: 15 }
  },
  family: {
    name: '家庭套房',
    basePrice: 988,
    amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '儿童房', '游戏区'],
    count: { min: 8, max: 12 }
  },
  presidential: {
    name: '总统套房',
    basePrice: 1288,
    amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '厨房', '会议室', '健身房', '私人管家'],
    count: { min: 2, max: 4 }
  },
  honeymoon: {
    name: '蜜月套房',
    basePrice: 1088,
    amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
    count: { min: 5, max: 8 }
  }
};

// 生成更真实的房间数据
function generateRoomData(): Room[] {
  const rooms: Room[] = [];
  let id = 1;

  // 遍历每个楼层（1-20层）
  for (let floor = 1; floor <= 20; floor++) {
    // 确定这个楼层的房型分布
    let floorRoomTypes: string[] = [];
    
    if (floor >= 18) { // 18-20层
      floorRoomTypes = ['presidential', 'honeymoon'];
    } else if (floor >= 15) { // 15-17层
      floorRoomTypes = ['business', 'suite'];
    } else if (floor >= 12) { // 12-14层
      floorRoomTypes = ['family', 'suite'];
    } else if (floor >= 8) { // 8-11层
      floorRoomTypes = ['deluxe', 'suite'];
    } else if (floor >= 4) { // 4-7层
      floorRoomTypes = ['deluxe', 'standard'];
    } else { // 1-3层
      floorRoomTypes = ['standard'];
    }

    // 生成每层的房间
    for (let roomNum = 1; roomNum <= 12; roomNum++) {
      // 选择房型
      const roomType = floorRoomTypes[Math.floor(Math.random() * floorRoomTypes.length)];
      const typeConfig = ROOM_TYPES[roomType as keyof typeof ROOM_TYPES];

      // 生成房间号（例如：0301表示3层01号房）
      const roomNumber = `${floor.toString().padStart(2, '0')}${roomNum.toString().padStart(2, '0')}`;

      // 生成房间状态
      const rand = Math.random();
      const status: 'occupied' | 'vacant' | 'cleaning' | 'maintenance' | 'reserved' =
        rand > 0.9 ? 'maintenance' :
        rand > 0.8 ? 'cleaning' :
        rand > 0.6 ? 'occupied' :
        rand > 0.45 ? 'reserved' : 'vacant';

      // 生成清洁状态
      const cleaningStatus: 'clean' | 'dirty' | 'cleaning' =
        status === 'cleaning' ? 'cleaning' :
        status === 'occupied' ? (Math.random() > 0.7 ? 'dirty' : 'clean') :
        status === 'maintenance' ? 'dirty' : 'clean';

      // 生成维护状态
      const maintenanceStatus: 'normal' | 'minor' | 'major' =
        status === 'maintenance' ? (Math.random() > 0.7 ? 'major' : 'minor') : 'normal';

      // 生成价格（基础价格±10%）
      const price = Math.round(typeConfig.basePrice * (0.9 + Math.random() * 0.2));

      // 生成清洁时间
      const now = dayjs();
      const lastCleaned = cleaningStatus === 'clean' ? 
        now.subtract(Math.floor(Math.random() * 24), 'hours').format('YYYY-MM-DD HH:mm') :
        now.subtract(Math.floor(Math.random() * 72 + 24), 'hours').format('YYYY-MM-DD HH:mm');
      const nextCleaning = dayjs(lastCleaned).add(24, 'hours').format('YYYY-MM-DD HH:mm');

      // 生成客人信息（如果房间已入住或已预订）
      let guestName, checkInDate, checkOutDate;
      if (status === 'occupied' || status === 'reserved') {
        const lastNames = ['张', '李', '王', '刘', '陈', '杨', '黄', '赵', '吴', '周'];
        const titles = ['先生', '女士'];
        guestName = lastNames[Math.floor(Math.random() * lastNames.length)] + 
                   titles[Math.floor(Math.random() * titles.length)];
        
        if (status === 'occupied') {
          checkInDate = now.subtract(Math.floor(Math.random() * 5), 'days').format('YYYY-MM-DD');
          checkOutDate = dayjs(checkInDate).add(Math.floor(Math.random() * 5 + 1), 'days').format('YYYY-MM-DD');
        } else { // reserved
          checkInDate = now.add(Math.floor(Math.random() * 10), 'days').format('YYYY-MM-DD');
          checkOutDate = dayjs(checkInDate).add(Math.floor(Math.random() * 5 + 1), 'days').format('YYYY-MM-DD');
        }
      }

      rooms.push({
        id: id.toString(),
        roomNumber,
        type: typeConfig.name,
        floor,
        status,
        guestName,
        checkInDate,
        checkOutDate,
        price,
        amenities: typeConfig.amenities,
        cleaningStatus,
        maintenanceStatus,
        lastCleaned,
        nextCleaning
      });

      id++;
    }
  }

  return rooms;
}

// 生成更真实的预订数据
function generateBookingData(rooms: Room[]): Booking[] {
  const bookings: Booking[] = [];
  let id = 1;

  // 获取所有可预订的房间（空闲或预订状态）
  const bookableRooms = rooms.filter(room => room.status === 'vacant' || room.status === 'reserved');

  // 为30%的可预订房间生成预订记录
  const bookingCount = Math.floor(bookableRooms.length * 0.3);
  
  for (let i = 0; i < bookingCount; i++) {
    const room = bookableRooms[Math.floor(Math.random() * bookableRooms.length)];
    
    // 生成客人信息
    const lastNames = ['张', '李', '王', '刘', '陈', '杨', '黄', '赵', '吴', '周'];
    const titles = ['先生', '女士'];
    const guestName = lastNames[Math.floor(Math.random() * lastNames.length)] + 
                     titles[Math.floor(Math.random() * titles.length)];

    // 生成手机号 - 按顺序循环使用
    const phones = [
      '18766845069',
      '13964907636',
      '18253727866',
      '18266899909',
      '13793790407',
      '13791713736',
      '15020588089',
      '13287217849',
      '13356650225',
      '19853761734'
    ];
    const phone = phones[(id - 1) % phones.length];

    // 生成入住日期（未来10天内）
    const checkInDate = dayjs().add(Math.floor(Math.random() * 10), 'days').format('YYYY-MM-DD');
    const checkOutDate = dayjs(checkInDate).add(Math.floor(Math.random() * 5 + 1), 'days').format('YYYY-MM-DD');

    // 计算总金额（房价 * 天数）
    const days = dayjs(checkOutDate).diff(dayjs(checkInDate), 'days');
    const totalAmount = room.price * days;

    // 生成订金（总金额的20-30%）
    const deposit = Math.round(totalAmount * (0.2 + Math.random() * 0.1));

    // 生成预订状态
    const status: 'confirmed' | 'pending' | 'cancelled' =
      Math.random() > 0.8 ? 'pending' :
      Math.random() > 0.1 ? 'confirmed' : 'cancelled';

    // 生成特殊要求
    const specialRequests = Math.random() > 0.7 ? [
      '需要婴儿床',
      '希望安静的房间',
      '需要加床',
      '高层房间',
      '靠近电梯',
      '禁烟房间',
      '有浴缸的房间',
      '需要接送机服务'
    ][Math.floor(Math.random() * 8)] : undefined;

    bookings.push({
      id: id.toString(),
      roomNumber: room.roomNumber,
      guestName,
      phone,
      checkInDate,
      checkOutDate,
      status,
      totalAmount,
      deposit,
      specialRequests
    });

    id++;
  }

  return bookings.sort((a, b) => dayjs(a.checkInDate).unix() - dayjs(b.checkInDate).unix());
}

const RoomManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [roomList, setRoomList] = useState<Room[]>([]);
  const [bookingList, setBookingList] = useState<Booking[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [addBookingModalVisible, setAddBookingModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState('rooms');
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    const roomData = generateRoomData();
    const bookingData = generateBookingData(roomData);

    setRoomList(roomData);
    setBookingList(bookingData);
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

  // 生成房型分布图表配置
  const getRoomTypeDistributionOption = () => {
    const roomTypes = Array.from(new Set(roomList.map(room => room.type)));
    const data = roomTypes.map(type => {
      const count = roomList.filter(room => room.type === type).length;
      return { value: count, name: type };
    });

    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}间 ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle'
      },
      series: [
        {
          type: 'pie',
          radius: '70%',
          center: ['60%', '50%'],
          data: data,
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
  };

  // 生成房间状态分布图表配置
  const getRoomStatusOption = () => {
    const floors = Array.from(new Set(roomList.map(room => room.floor))).sort((a, b) => a - b);
    const statuses = ['occupied', 'vacant', 'cleaning', 'maintenance', 'reserved'];
    const statusNames = {
      occupied: '已入住',
      vacant: '空闲',
      cleaning: '清洁中',
      maintenance: '维护中',
      reserved: '已预订'
    };

    const data = floors.map(floor => {
      const floorRooms = roomList.filter(room => room.floor === floor);
      return statuses.map(status => 
        floorRooms.filter(room => room.status === status).length
      );
    });

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: statuses.map(status => statusNames[status as keyof typeof statusNames]),
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
        data: floors.map(f => `${f}层`)
      },
      series: statuses.map((status, index) => ({
        name: statusNames[status as keyof typeof statusNames],
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        data: floors.map((_, floorIndex) => data[floorIndex][index]),
        itemStyle: {
          color: status === 'occupied' ? '#52c41a' :
                status === 'vacant' ? '#1890ff' :
                status === 'cleaning' ? '#faad14' :
                status === 'maintenance' ? '#ff4d4f' :
                '#722ed1'
        }
      }))
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied':
      case 'confirmed':
        return 'green';
      case 'vacant':
      case 'clean':
        return 'blue';
      case 'cleaning':
      case 'pending':
        return 'orange';
      case 'maintenance':
      case 'dirty':
        return 'red';
      case 'reserved':
        return 'purple';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'occupied':
        return '已入住';
      case 'vacant':
        return '空闲';
      case 'cleaning':
        return '清洁中';
      case 'maintenance':
        return '维护中';
      case 'reserved':
        return '已预订';
      case 'confirmed':
        return '已确认';
      case 'pending':
        return '待确认';
      case 'cancelled':
        return '已取消';
      case 'clean':
        return '清洁';
      case 'dirty':
        return '待清洁';
      case 'normal':
        return '正常';
      case 'minor':
        return '轻微';
      case 'major':
        return '严重';
      default:
        return '未知';
    }
  };

  const roomColumns = [
    {
      title: '房间信息',
      key: 'info',
      render: (_: any, record: Room) => (
        <Space>
          <div style={{ textAlign: 'center' }}>
            <HomeOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
            <div style={{ fontSize: '12px', color: '#666' }}>{record.floor}层</div>
          </div>
          <div>
            <div>
              <Text strong style={{ fontSize: '16px' }}>{record.roomNumber}</Text>
              <Tag color="blue" style={{ marginLeft: 8 }}>{record.type}</Tag>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              ¥{record.price}/晚
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '状态',
      key: 'status',
      render: (_: any, record: Room) => (
        <Space direction="vertical" size="small">
          <Badge
            status={getStatusColor(record.status) as any}
            text={getStatusText(record.status)}
          />
          {record.guestName && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              客人: {record.guestName}
            </div>
          )}
        </Space>
      ),
    },
    {
      title: '清洁状态',
      key: 'cleaning',
      render: (_: any, record: Room) => (
        <Space direction="vertical" size="small">
          <Badge
            status={getStatusColor(record.cleaningStatus) as any}
            text={getStatusText(record.cleaningStatus)}
          />
          <div style={{ fontSize: '12px', color: '#666' }}>
            下次清洁: {record.nextCleaning}
          </div>
        </Space>
      ),
    },
    {
      title: '设施',
      key: 'amenities',
      render: (_: any, record: Room) => (
        <Space wrap>
          {record.amenities.map((amenity, index) => (
            <Tag key={index} color="blue">
              {amenity}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Room) => (
        <Space size="small" wrap>
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
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteRoom(record.id)}
          >
            删除
          </Button>
          {record.status === 'vacant' && (
            <Button
              type="link"
              size="small"
              icon={<CalendarOutlined />}
              onClick={() => handleBooking(record)}
            >
              预订
            </Button>
          )}
          {record.status === 'reserved' && (
            <Button
              type="link"
              size="small"
              icon={<KeyOutlined />}
              onClick={() => handleCheckIn(record)}
            >
              入住
            </Button>
          )}
          {record.status === 'occupied' && (
            <Button
              type="link"
              size="small"
              icon={<KeyOutlined />}
              onClick={() => handleCheckOut(record)}
            >
              退房
            </Button>
          )}
          {record.cleaningStatus === 'dirty' && (
            <Button
              type="link"
              size="small"
              icon={<ClearOutlined />}
              onClick={() => handleStartCleaning(record)}
            >
              开始清洁
            </Button>
          )}
          {record.cleaningStatus === 'cleaning' && (
            <Button
              type="link"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handleFinishCleaning(record)}
            >
              完成清洁
            </Button>
          )}
          {record.maintenanceStatus !== 'normal' && record.status !== 'maintenance' && (
            <Button
              type="link"
              size="small"
              icon={<ToolOutlined />}
              onClick={() => handleStartMaintenance(record)}
            >
              开始维护
            </Button>
          )}
          {record.status === 'maintenance' && (
            <Button
              type="link"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handleFinishMaintenance(record)}
            >
              完成维护
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const bookingColumns = [
    {
      title: '预订信息',
      key: 'info',
      render: (_: any, record: Booking) => (
        <Space>
          <div>
            <div>
              <Text strong>{record.guestName}</Text>
              <Text code style={{ marginLeft: 8 }}>{record.roomNumber}</Text>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.phone}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '入住时间',
      key: 'dates',
      render: (_: any, record: Booking) => (
        <Space direction="vertical" size="small">
          <div>入住: {record.checkInDate}</div>
          <div>退房: {record.checkOutDate}</div>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge
          status={getStatusColor(status) as any}
          text={getStatusText(status)}
        />
      ),
    },
    {
      title: '金额',
      key: 'amount',
      render: (_: any, record: Booking) => (
        <Space direction="vertical" size="small">
          <div>总金额: ¥{record.totalAmount}</div>
          <div>押金: ¥{record.deposit}</div>
        </Space>
      ),
    },
    {
      title: '特殊要求',
      dataIndex: 'specialRequests',
      key: 'specialRequests',
      render: (requests: string) => (
        requests ? (
          <Tooltip title={requests}>
            <Text type="secondary">有特殊要求</Text>
          </Tooltip>
        ) : (
          <Text type="secondary">无</Text>
        )
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Booking) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditBooking(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleCancelBooking(record)}
          >
            取消
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewDetails = (record: Room) => {
    setCurrentRoom(record);
    setDetailsModalVisible(true);
  };

  const handleEdit = (record: Room) => {
    setCurrentRoom(record);
    setEditModalVisible(true);
  };

  const handleBooking = (record: Room) => {
    setCurrentRoom(record);
    setBookingModalVisible(true);
  };

  const handleEditBooking = (record: Booking) => {
    // 实现编辑预订功能
    message.info('编辑预订功能开发中...');
  };

  const handleCancelBooking = (record: Booking) => {
    Modal.confirm({
      title: '确认取消预订',
      content: `确定要取消 ${record.guestName} 的预订吗？`,
      onOk: () => {
        setBookingList(bookingList.filter(b => b.id !== record.id));
        message.success('预订已取消');
      },
    });
  };

  const handleExport = () => {
    message.success('房间数据导出成功');
  };

  const handleImport = () => {
    message.info('房间数据导入功能开发中...');
  };

  const handleAddRoom = () => {
    setCurrentRoom(null);
    setAddModalVisible(true);
  };

  const handleSaveRoom = (values: any) => {
    if (currentRoom) {
      // 编辑房间
      setRoomList(roomList.map(room => 
        room.id === currentRoom.id ? { ...room, ...values } : room
      ));
      message.success('房间信息更新成功');
    } else {
      // 添加房间
      const newRoom: Room = {
        id: `room${Date.now()}`,
        ...values,
        status: 'vacant',
        cleaningStatus: 'clean',
        maintenanceStatus: 'normal',
        lastCleaned: new Date().toLocaleString(),
        nextCleaning: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString(),
      };
      setRoomList([...roomList, newRoom]);
      message.success('房间添加成功');
    }
    setAddModalVisible(false);
    setEditModalVisible(false);
  };

  const handleAddBooking = () => {
    setCurrentBooking(null);
    setAddBookingModalVisible(true);
  };

  const handleSaveBooking = (values: any) => {
    if (currentBooking) {
      // 编辑预订
      setBookingList(bookingList.map(booking => 
        booking.id === currentBooking.id ? { ...booking, ...values } : booking
      ));
      message.success('预订信息更新成功');
    } else {
      // 新增预订
      const newBooking: Booking = {
        id: `booking${Date.now()}`,
        ...values,
        status: 'confirmed',
        totalAmount: values.totalAmount || 0,
        deposit: values.deposit || 0,
      };
      setBookingList([...bookingList, newBooking]);
      
      // 更新房间状态为已预订
      if (values.roomNumber) {
        setRoomList(roomList.map(room => 
          room.roomNumber === values.roomNumber 
            ? { ...room, status: 'reserved', guestName: values.guestName }
            : room
        ));
      }
      
      message.success('预订创建成功');
    }
    setBookingModalVisible(false);
    setAddBookingModalVisible(false);
  };

  const handleDeleteRoom = (roomId: string) => {
    Modal.confirm({
      title: '确认删除房间',
      content: '确定要删除该房间吗？此操作不可恢复。',
      onOk: () => {
        setRoomList(roomList.filter(room => room.id !== roomId));
        message.success('房间删除成功');
      },
    });
  };

  const handleCheckIn = (record: Room) => {
    Modal.confirm({
      title: '确认入住',
      content: `确定要为房间 ${record.roomNumber} 办理入住吗？`,
      onOk: () => {
        setRoomList(roomList.map(room => 
          room.id === record.id 
            ? { ...room, status: 'occupied' }
            : room
        ));
        message.success('入住办理成功');
      },
    });
  };

  const handleCheckOut = (record: Room) => {
    Modal.confirm({
      title: '确认退房',
      content: `确定要为房间 ${record.roomNumber} 办理退房吗？`,
      onOk: () => {
        setRoomList(roomList.map(room => 
          room.id === record.id 
            ? { 
                ...room, 
                status: 'cleaning', 
                guestName: undefined,
                checkInDate: undefined,
                checkOutDate: undefined,
                cleaningStatus: 'dirty'
              }
            : room
        ));
        message.success('退房办理成功');
      },
    });
  };

  const handleStartCleaning = (record: Room) => {
    setRoomList(roomList.map(room => 
      room.id === record.id 
        ? { ...room, cleaningStatus: 'cleaning' }
        : room
    ));
    message.success('开始清洁房间');
  };

  const handleFinishCleaning = (record: Room) => {
    setRoomList(roomList.map(room => 
      room.id === record.id 
        ? { 
            ...room, 
            cleaningStatus: 'clean',
            status: room.status === 'cleaning' ? 'vacant' : room.status,
            lastCleaned: new Date().toLocaleString(),
            nextCleaning: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString()
          }
        : room
    ));
    message.success('房间清洁完成');
  };

  const handleStartMaintenance = (record: Room) => {
    setRoomList(roomList.map(room => 
      room.id === record.id 
        ? { ...room, status: 'maintenance' }
        : room
    ));
    message.success('开始维护房间');
  };

  const handleFinishMaintenance = (record: Room) => {
    setRoomList(roomList.map(room => 
      room.id === record.id 
        ? { 
            ...room, 
            status: 'vacant',
            maintenanceStatus: 'normal'
          }
        : room
    ));
    message.success('房间维护完成');
  };

  // 统计数据
  const statistics = {
    totalRooms: roomList.length,
    occupiedRooms: roomList.filter(room => room.status === 'occupied').length,
    vacantRooms: roomList.filter(room => room.status === 'vacant').length,
    cleaningRooms: roomList.filter(room => room.status === 'cleaning').length,
    maintenanceRooms: roomList.filter(room => room.status === 'maintenance').length,
    reservedRooms: roomList.filter(room => room.status === 'reserved').length,
    dirtyRooms: roomList.filter(room => room.cleaningStatus === 'dirty').length,
    cleaningInProgress: roomList.filter(room => room.cleaningStatus === 'cleaning').length,
    cleanRooms: roomList.filter(room => room.cleaningStatus === 'clean').length,
    totalBookings: bookingList.length,
    confirmedBookings: bookingList.filter(booking => booking.status === 'confirmed').length,
    pendingBookings: bookingList.filter(booking => booking.status === 'pending').length,
    cancelledBookings: bookingList.filter(booking => booking.status === 'cancelled').length,
    occupancyRate: roomList.length > 0 ? Math.round((roomList.filter(room => room.status === 'occupied').length / roomList.length) * 100) : 0,
    revenue: roomList.filter(room => room.status === 'occupied').reduce((sum, room) => sum + room.price, 0),
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <HomeOutlined style={{ marginRight: 8 }} />
        房间管理
      </Title>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={4}>
          <Card>房间总数
            <Statistic
              title="总房间数"
              value={260}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>房间总数
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="已入住"
              value={140}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="空闲房间"
              value={120}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="清洁中"
              value={statistics.cleaningInProgress}
              prefix={<ClearOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="维护中"
              value={statistics.maintenanceRooms}
              prefix={<ToolOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="入住率"
              value={53.8}
              suffix="%"
              prefix={<StarOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="房间状态" key="rooms">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button type="primary" icon={<CalendarOutlined />} onClick={handleAddRoom}>
                  新增房间
                </Button>
                <Button icon={<ExportOutlined />} onClick={handleExport}>
                  导出数据
                </Button>
                <Button icon={<ImportOutlined />} onClick={handleImport}>
                  导入数据
                </Button>
                <Button icon={<LineChartOutlined />} onClick={handleTrendAnalysis}>
                  数据分析
                </Button>
                <Button icon={<SearchOutlined />}>
                  高级搜索
                </Button>
              </Space>
            </div>
            <Table
              columns={roomColumns}
              dataSource={roomList}
              rowKey="id"
              loading={loading}
              pagination={{
                total: roomList.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          
          <TabPane tab="预订管理" key="bookings">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button type="primary" icon={<CalendarOutlined />} onClick={handleAddBooking}>
                  新增预订
                </Button>
                <Button icon={<ExportOutlined />}>
                  导出预订
                </Button>
                <Button icon={<SearchOutlined />}>
                  搜索预订
                </Button>
              </Space>
            </div>
            <Table
              columns={bookingColumns}
              dataSource={bookingList}
              rowKey="id"
              loading={loading}
              pagination={{
                total: bookingList.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>

          <TabPane tab="房间日历" key="calendar">
            <Calendar
              fullscreen={false}
              headerRender={({ value, onChange }) => {
                const start = 0;
                const current = value.month();
                const months = [...Array(12)].map((_, i) => {
                  const month = (i + start) % 12;
                  return {
                    label: `${month + 1}月`,
                    value: month,
                  };
                });

                return (
                  <div style={{ padding: '8px 0' }}>
                    <Select
                      size="small"
                      dropdownMatchSelectWidth={false}
                      value={current}
                      style={{ width: 80 }}
                      onChange={(newMonth) => {
                        const now = value.clone().month(newMonth);
                        onChange(now);
                      }}
                    >
                      {months.map((month) => (
                        <Option key={month.value} value={month.value}>
                          {month.label}
                        </Option>
                      ))}
                    </Select>
                  </div>
                );
              }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 房间详情模态框 */}
      <Modal
        title="房间详情"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailsModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {currentRoom && (
          <div>
            <Row gutter={24}>
              <Col span={12}>
                <Card title="基本信息" size="small">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="房间号">
                      <Text strong>{currentRoom.roomNumber}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="房间类型">
                      <Tag color="blue">{currentRoom.type}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="楼层">
                      {currentRoom.floor}层
                    </Descriptions.Item>
                    <Descriptions.Item label="价格">
                      ¥{currentRoom.price}/晚
                    </Descriptions.Item>
                    <Descriptions.Item label="房间状态">
                      <Badge
                        status={getStatusColor(currentRoom.status) as any}
                        text={getStatusText(currentRoom.status)}
                      />
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="清洁维护" size="small">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="清洁状态">
                      <Badge
                        status={getStatusColor(currentRoom.cleaningStatus) as any}
                        text={getStatusText(currentRoom.cleaningStatus)}
                      />
                    </Descriptions.Item>
                    <Descriptions.Item label="维护状态">
                      <Badge
                        status={getStatusColor(currentRoom.maintenanceStatus) as any}
                        text={getStatusText(currentRoom.maintenanceStatus)}
                      />
                    </Descriptions.Item>
                    <Descriptions.Item label="最后清洁">
                      {currentRoom.lastCleaned}
                    </Descriptions.Item>
                    <Descriptions.Item label="下次清洁">
                      {currentRoom.nextCleaning}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>
            
            {currentRoom.guestName && (
              <Card title="客人信息" size="small" style={{ marginTop: 16 }}>
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="客人姓名">
                    <Text strong>{currentRoom.guestName}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="入住日期">
                    {currentRoom.checkInDate}
                  </Descriptions.Item>
                  <Descriptions.Item label="退房日期">
                    {currentRoom.checkOutDate}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            )}
            
            <Card title="房间设施" size="small" style={{ marginTop: 16 }}>
              <div>
                {currentRoom.amenities.map((amenity, index) => (
                  <Tag key={index} color="green" style={{ marginBottom: 8 }}>
                    {amenity}
                  </Tag>
                ))}
              </div>
            </Card>
            
            <Card title="操作历史" size="small" style={{ marginTop: 16 }}>
              <List
                size="small"
                dataSource={[
                  { time: currentRoom.lastCleaned, action: '房间清洁完成' },
                  { time: '2025-07-14 10:00', action: '客人入住' },
                  { time: '2025-07-13 15:30', action: '房间预订确认' },
                  { time: '2025-07-13 09:00', action: '房间检查完成' },
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <Space>
                      <ClockCircleOutlined style={{ color: '#999' }} />
                      <Text type="secondary">{item.time}</Text>
                      <Text>{item.action}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </div>
        )}
      </Modal>

      {/* 编辑房间模态框 */}
      <Modal
        title={currentRoom ? "编辑房间" : "新增房间"}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => handleSaveRoom(currentRoom ? currentRoom : {})}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="房间号" rules={[{ required: true, message: '请输入房间号' }]}>
                <Input 
                  defaultValue={currentRoom?.roomNumber} 
                  onChange={(e) => setCurrentRoom(prev => prev ? { ...prev, roomNumber: e.target.value } : null)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="房间类型" rules={[{ required: true, message: '请选择房间类型' }]}>
                <Select 
                  defaultValue={currentRoom?.type} 
                  onChange={(value) => setCurrentRoom(prev => prev ? { ...prev, type: value } : null)}
                >
                  <Option value="标准间">标准间</Option>
                  <Option value="豪华间">豪华间</Option>
                  <Option value="套房">套房</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="楼层" rules={[{ required: true, message: '请输入楼层' }]}>
                <Input 
                  type="number" 
                  defaultValue={currentRoom?.floor} 
                  onChange={(e) => setCurrentRoom(prev => prev ? { ...prev, floor: parseInt(e.target.value, 10) } : null)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="价格" rules={[{ required: true, message: '请输入价格' }]}>
                <Input 
                  type="number" 
                  defaultValue={currentRoom?.price} 
                  onChange={(e) => setCurrentRoom(prev => prev ? { ...prev, price: parseFloat(e.target.value) } : null)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="状态" rules={[{ required: true, message: '请选择房间状态' }]}>
            <Select 
              defaultValue={currentRoom?.status} 
              onChange={(value) => setCurrentRoom(prev => prev ? { ...prev, status: value } : null)}
            >
              <Option value="vacant">空闲</Option>
              <Option value="occupied">已入住</Option>
              <Option value="cleaning">清洁中</Option>
              <Option value="maintenance">维护中</Option>
              <Option value="reserved">已预订</Option>
            </Select>
          </Form.Item>
          <Form.Item label="清洁状态" rules={[{ required: true, message: '请选择清洁状态' }]}>
            <Select 
              defaultValue={currentRoom?.cleaningStatus} 
              onChange={(value) => setCurrentRoom(prev => prev ? { ...prev, cleaningStatus: value } : null)}
            >
              <Option value="clean">清洁</Option>
              <Option value="dirty">待清洁</Option>
              <Option value="cleaning">清洁中</Option>
            </Select>
          </Form.Item>
          <Form.Item label="维护状态" rules={[{ required: true, message: '请选择维护状态' }]}>
            <Select 
              defaultValue={currentRoom?.maintenanceStatus} 
              onChange={(value) => setCurrentRoom(prev => prev ? { ...prev, maintenanceStatus: value } : null)}
            >
              <Option value="normal">正常</Option>
              <Option value="minor">轻微</Option>
              <Option value="major">严重</Option>
            </Select>
          </Form.Item>
                     <Form.Item label="最后清洁时间" rules={[{ required: true, message: '请选择最后清洁时间' }]}>
             <DatePicker 
               style={{ width: '100%' }} 
               defaultValue={currentRoom?.lastCleaned ? dayjs(currentRoom.lastCleaned) : null}
               onChange={(date) => setCurrentRoom(prev => prev ? { ...prev, lastCleaned: date?.toISOString() } : null)}
             />
           </Form.Item>
           <Form.Item label="下次清洁时间" rules={[{ required: true, message: '请选择下次清洁时间' }]}>
             <DatePicker 
               style={{ width: '100%' }} 
               defaultValue={currentRoom?.nextCleaning ? dayjs(currentRoom.nextCleaning) : null}
               onChange={(date) => setCurrentRoom(prev => prev ? { ...prev, nextCleaning: date?.toISOString() } : null)}
             />
           </Form.Item>
          <Form.Item label="设施" rules={[{ required: true, message: '请至少选择一个设施' }]}>
            <Select
              mode="multiple"
              placeholder="请选择设施"
              defaultValue={currentRoom?.amenities}
              onChange={(values) => setCurrentRoom(prev => prev ? { ...prev, amenities: values } : null)}
            >
              <Option value="WiFi">WiFi</Option>
              <Option value="空调">空调</Option>
              <Option value="电视">电视</Option>
              <Option value="独立卫浴">独立卫浴</Option>
              <Option value="迷你吧">迷你吧</Option>
              <Option value="景观阳台">景观阳台</Option>
              <Option value="客厅">客厅</Option>
              <Option value="厨房">厨房</Option>
              <Option value="会议室">会议室</Option>
              <Option value="健身房">健身房</Option>
              <Option value="儿童房">儿童房</Option>
              <Option value="游戏区">游戏区</Option>
              <Option value="按摩浴缸">按摩浴缸</Option>
              <Option value="浪漫装饰">浪漫装饰</Option>
              <Option value="办公桌">办公桌</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 预订房间模态框 */}
      <Modal
        title="预订房间"
        open={bookingModalVisible}
        onCancel={() => setBookingModalVisible(false)}
        onOk={() => handleSaveBooking(currentRoom ? currentRoom : {})}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="房间号" rules={[{ required: true, message: '请选择房间' }]}>
                <Input 
                  value={currentRoom?.roomNumber} 
                  disabled 
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="房间类型" rules={[{ required: true, message: '请选择房间类型' }]}>
                <Input 
                  value={currentRoom?.type} 
                  disabled 
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="客人姓名" rules={[{ required: true, message: '请输入客人姓名' }]}>
                <Input 
                  placeholder="请输入客人姓名" 
                  onChange={(e) => setCurrentRoom(prev => prev ? { ...prev, guestName: e.target.value } : null)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="联系电话" rules={[{ required: true, message: '请输入联系电话' }]}>
                <Input 
                  placeholder="请输入联系电话" 
                  onChange={(e) => setCurrentRoom(prev => prev ? { ...prev, phone: e.target.value } : null)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="入住日期" rules={[{ required: true, message: '请选择入住日期' }]}>
                <DatePicker 
                  style={{ width: '100%' }} 
                  onChange={(date) => setCurrentRoom(prev => prev ? { ...prev, checkInDate: date?.toISOString() } : null)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="退房日期" rules={[{ required: true, message: '请选择退房日期' }]}>
                <DatePicker 
                  style={{ width: '100%' }} 
                  onChange={(date) => setCurrentRoom(prev => prev ? { ...prev, checkOutDate: date?.toISOString() } : null)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="特殊要求">
            <Input.TextArea 
              rows={3} 
              placeholder="请输入特殊要求" 
              onChange={(e) => setCurrentRoom(prev => prev ? { ...prev, specialRequests: e.target.value } : null)}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 新增房间模态框 */}
      <Modal
        title="新增房间"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onOk={() => handleSaveRoom({})}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="房间号" rules={[{ required: true, message: '请输入房间号' }]}>
                <Input placeholder="请输入房间号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="房间类型" rules={[{ required: true, message: '请选择房间类型' }]}>
                <Select placeholder="请选择房间类型">
                  <Option value="标准间">标准间</Option>
                  <Option value="豪华间">豪华间</Option>
                  <Option value="套房">套房</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="楼层" rules={[{ required: true, message: '请输入楼层' }]}>
                <Input type="number" placeholder="请输入楼层" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="价格" rules={[{ required: true, message: '请输入价格' }]}>
                <Input type="number" placeholder="请输入价格" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="状态" rules={[{ required: true, message: '请选择房间状态' }]}>
            <Select placeholder="请选择房间状态">
              <Option value="vacant">空闲</Option>
              <Option value="occupied">已入住</Option>
              <Option value="cleaning">清洁中</Option>
              <Option value="maintenance">维护中</Option>
              <Option value="reserved">已预订</Option>
            </Select>
          </Form.Item>
          <Form.Item label="清洁状态" rules={[{ required: true, message: '请选择清洁状态' }]}>
            <Select placeholder="请选择清洁状态">
              <Option value="clean">清洁</Option>
              <Option value="dirty">待清洁</Option>
              <Option value="cleaning">清洁中</Option>
            </Select>
          </Form.Item>
          <Form.Item label="维护状态" rules={[{ required: true, message: '请选择维护状态' }]}>
            <Select placeholder="请选择维护状态">
              <Option value="normal">正常</Option>
              <Option value="minor">轻微</Option>
              <Option value="major">严重</Option>
            </Select>
          </Form.Item>
          <Form.Item label="最后清洁时间" rules={[{ required: true, message: '请选择最后清洁时间' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="下次清洁时间" rules={[{ required: true, message: '请选择下次清洁时间' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="设施" rules={[{ required: true, message: '请至少选择一个设施' }]}>
            <Select
              mode="multiple"
              placeholder="请选择设施"
            >
              <Option value="WiFi">WiFi</Option>
              <Option value="空调">空调</Option>
              <Option value="电视">电视</Option>
              <Option value="独立卫浴">独立卫浴</Option>
              <Option value="迷你吧">迷你吧</Option>
              <Option value="景观阳台">景观阳台</Option>
              <Option value="客厅">客厅</Option>
              <Option value="厨房">厨房</Option>
              <Option value="会议室">会议室</Option>
              <Option value="健身房">健身房</Option>
              <Option value="儿童房">儿童房</Option>
              <Option value="游戏区">游戏区</Option>
              <Option value="按摩浴缸">按摩浴缸</Option>
              <Option value="浪漫装饰">浪漫装饰</Option>
              <Option value="办公桌">办公桌</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 新增预订模态框 */}
      <Modal
        title="新增预订"
        open={addBookingModalVisible}
        onCancel={() => setAddBookingModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setAddBookingModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => {
            // 这里需要获取表单数据并提交
            const formData = {
              roomNumber: '待选择',
              guestName: '待填写',
              phone: '待填写',
              checkInDate: new Date().toISOString(),
              checkOutDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              totalAmount: 0,
              deposit: 0,
              specialRequests: ''
            };
            handleSaveBooking(formData);
          }}>
            确认预订
          </Button>,
        ]}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="房间号" rules={[{ required: true, message: '请选择房间' }]}>
                <Select placeholder="请选择房间">
                  {roomList.filter(room => room.status === 'vacant').map(room => (
                    <Option key={room.roomNumber} value={room.roomNumber}>
                      {room.roomNumber} - {room.type}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="预订状态" rules={[{ required: true, message: '请选择预订状态' }]}>
                <Select placeholder="请选择预订状态" defaultValue="confirmed">
                  <Option value="confirmed">已确认</Option>
                  <Option value="pending">待确认</Option>
                  <Option value="cancelled">已取消</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="客人姓名" rules={[{ required: true, message: '请输入客人姓名' }]}>
                <Input placeholder="请输入客人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="联系电话" rules={[{ required: true, message: '请输入联系电话' }]}>
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="入住日期" rules={[{ required: true, message: '请选择入住日期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="退房日期" rules={[{ required: true, message: '请选择退房日期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="总金额" rules={[{ required: true, message: '请输入总金额' }]}>
                <Input type="number" placeholder="请输入总金额" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="押金" rules={[{ required: true, message: '请输入押金' }]}>
                <Input type="number" placeholder="请输入押金" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="特殊要求">
            <Input.TextArea rows={3} placeholder="请输入特殊要求" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 趋势分析模态框 */}
      <Modal
        title="房间数据分析"
        open={trendModalVisible}
        onCancel={() => setTrendModalVisible(false)}
        width={1000}
        footer={null}
      >
        <Tabs defaultActiveKey="type">
          <TabPane tab="房型分布" key="type">
            <Card>
              <ReactECharts option={getRoomTypeDistributionOption()} style={{ height: 400 }} />
            </Card>
          </TabPane>
          <TabPane tab="房间状态" key="status">
            <Card>
              <ReactECharts option={getRoomStatusOption()} style={{ height: 600 }} />
            </Card>
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default RoomManagement; 