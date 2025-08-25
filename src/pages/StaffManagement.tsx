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
  Upload,
  Avatar,
  Typography,
  Divider,
  Tooltip,
  Badge,
  Tabs,
  Calendar,
  List,
  Descriptions,
} from 'antd';
import {
  TeamOutlined,
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExportOutlined,
  ImportOutlined,
  SearchOutlined,
  FilterOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  PhoneOutlined,
  IdcardOutlined,
  BankOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

interface Staff {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  position: string;
  phone: string;
  status: 'active' | 'inactive' | 'leave';
  joinDate: string;
  avatar?: string;
  salary: number;
  workSchedule: string;
  lastAttendance: string;
}

interface Attendance {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  workHours: number;
}

// 生成更真实的员工数据
function generateStaffData(count: number): Staff[] {
  const staff: Staff[] = [];
  const lastNames = ['张', '李', '王', '刘', '陈', '杨', '黄', '赵', '吴', '周', '徐', '孙', '马', '朱', '胡', '郭', '何', '高', '林', '郑'];
  const firstNames = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛', '明', '超', '秀兰', '霞', '平', '刚'];
  
  const departments = [
    {
      name: '前厅部',
      positions: ['前台经理', '前台主管', '前台接待', '礼宾员', '行李员'],
      baseSalary: 4000
    },
    {
      name: '客房部',
      positions: ['客房经理', '楼层主管', '客房服务员', '布草员'],
      baseSalary: 3800
    },
    {
      name: '餐饮部',
      positions: ['餐饮经理', '餐厅主管', '服务员', '厨师长', '厨师', '传菜员'],
      baseSalary: 4200
    },
    {
      name: '工程部',
      positions: ['工程经理', '维修主管', '维修工程师', '空调技工', '电工'],
      baseSalary: 4500
    },
    {
      name: '保安部',
      positions: ['保安经理', '保安队长', '保安员', '监控员'],
      baseSalary: 3500
    },
    {
      name: '人事部',
      positions: ['人事经理', '人事主管', '招聘专员', '培训专员'],
      baseSalary: 5000
    },
    {
      name: '财务部',
      positions: ['财务经理', '会计主管', '会计', '出纳'],
      baseSalary: 5500
    },
    {
      name: '销售部',
      positions: ['销售经理', '销售主管', '销售代表', '客户经理'],
      baseSalary: 4800
    }
  ];

  const shifts = [
    { name: '早班', time: '8:00-16:00', type: 'morning' },
    { name: '中班', time: '16:00-24:00', type: 'afternoon' },
    { name: '夜班', time: '0:00-8:00', type: 'night' }
  ];

  for (let i = 1; i <= count; i++) {
    // 生成部门和职位
    const department = departments[Math.floor(Math.random() * departments.length)];
    const position = department.positions[Math.floor(Math.random() * department.positions.length)];
    
    // 根据职位计算薪资
    let salaryMultiplier = 1;
    if (position.includes('经理')) salaryMultiplier = 1.8;
    else if (position.includes('主管')) salaryMultiplier = 1.4;
    else if (position.includes('工程师')) salaryMultiplier = 1.3;
    
    const baseSalary = department.baseSalary;
    const salary = Math.round(baseSalary * salaryMultiplier * (0.9 + Math.random() * 0.2));

    // 生成入职日期（1-3年内）
    const joinDate = dayjs().subtract(Math.floor(Math.random() * 1000 + 100), 'days');

    // 生成工作班次
    const shift = shifts[Math.floor(Math.random() * shifts.length)];
    const workSchedule = `${shift.name} ${shift.time}`;

    // 生成最后考勤时间（今天）
    const shiftStartHour = parseInt(shift.time.split(':')[0]);
    const lastAttendance = dayjs().hour(shiftStartHour).minute(Math.floor(Math.random() * 10)).format('YYYY-MM-DD HH:mm');

    // 生成员工状态（大部分在职，少部分请假或离职）
    const status: 'active' | 'inactive' | 'leave' = 
      Math.random() > 0.9 ? 'inactive' :
      Math.random() > 0.85 ? 'leave' : 'active';

    staff.push({
      id: i.toString().padStart(3, '0'),
      name: lastNames[Math.floor(Math.random() * lastNames.length)] + 
            firstNames[Math.floor(Math.random() * firstNames.length)],
      employeeId: `EMP${i.toString().padStart(3, '0')}`,
      department: department.name,
      position,
      phone: [
        '15589782773',
        '13562797756',
        '18678701902',
        '17626051592',
        '19811860915',
        '19506230539',
        '19853700667',
        '17865216854',
        '18905378825',
        '18754759756'
      ][(i - 1) % 10],
      status,
      joinDate: joinDate.format('YYYY-MM-DD'),
      salary,
      workSchedule,
      lastAttendance
    });
  }

  return staff.sort((a, b) => a.employeeId.localeCompare(b.employeeId));
}

// 生成更真实的考勤数据
function generateAttendanceData(staff: Staff[]): Attendance[] {
  const attendance: Attendance[] = [];
  let id = 1;

  staff.forEach(employee => {
    // 只为在职和请假的员工生成考勤记录
    if (employee.status !== 'inactive') {
      const shift = employee.workSchedule.split(' ')[1];
      const [startTime, endTime] = shift.split('-');
      const startHour = parseInt(startTime.split(':')[0]);
      
      // 生成考勤状态
      let status: 'present' | 'absent' | 'late' | 'leave';
      let checkIn = '';
      let checkOut = '';
      let workHours = 0;

      if (employee.status === 'leave') {
        status = 'leave';
        checkIn = '00:00';
        checkOut = '00:00';
      } else {
        const rand = Math.random();
        if (rand > 0.95) {
          status = 'absent';
          checkIn = '00:00';
          checkOut = '00:00';
        } else if (rand > 0.85) {
          status = 'late';
          checkIn = `${startHour.toString().padStart(2, '0')}:${(Math.floor(Math.random() * 20) + 5).toString().padStart(2, '0')}`;
          const endHour = (startHour + 8) % 24;
          checkOut = `${endHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 15).toString().padStart(2, '0')}`;
          workHours = 7.8;
        } else {
          status = 'present';
          checkIn = `${startHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 5).toString().padStart(2, '0')}`;
          const endHour = (startHour + 8) % 24;
          checkOut = `${endHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 15).toString().padStart(2, '0')}`;
          workHours = 8.1;
        }
      }

      attendance.push({
        id: id.toString(),
        staffId: employee.id,
        staffName: employee.name,
        date: dayjs().format('YYYY-MM-DD'),
        checkIn,
        checkOut,
        status,
        workHours
      });
      id++;
    }
  });

  return attendance;
}

const StaffManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);
  const [activeTab, setActiveTab] = useState('staff');
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
    const staffData = generateStaffData(100);
    const attendanceData = generateAttendanceData(staffData);

    setStaffList(staffData);
    setAttendanceList(attendanceData);
      setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'present':
        return 'green';
      case 'inactive':
      case 'absent':
        return 'red';
      case 'leave':
        return 'orange';
      case 'late':
        return 'gold';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '在职';
      case 'inactive':
        return '离职';
      case 'leave':
        return '请假';
      case 'present':
        return '正常';
      case 'absent':
        return '缺勤';
      case 'late':
        return '迟到';
      default:
        return '未知';
    }
  };

  const staffColumns = [
    {
      title: '员工信息',
      key: 'info',
      render: (_: any, record: Staff) => (
        <Space>
          <Avatar size="large" icon={<UserAddOutlined />} />
          <div>
            <div>
              <Text strong>{record.name}</Text>
              <Text code style={{ marginLeft: 8 }}>{record.employeeId}</Text>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.department} - {record.position}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '联系方式',
      key: 'contact',
      render: (_: any, record: Staff) => (
        <Space>
          <PhoneOutlined />
          <Text>{record.phone}</Text>
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
      title: '薪资',
      dataIndex: 'salary',
      key: 'salary',
      render: (value: number) => (
        <Text strong style={{ color: '#1890ff' }}>
          ¥{value.toLocaleString()}
        </Text>
      ),
    },
    {
      title: '工作班次',
      dataIndex: 'workSchedule',
      key: 'workSchedule',
    },
    {
      title: '最后考勤',
      dataIndex: 'lastAttendance',
      key: 'lastAttendance',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Staff) => (
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

  const attendanceColumns = [
    {
      title: '员工姓名',
      dataIndex: 'staffName',
      key: 'staffName',
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '签到时间',
      dataIndex: 'checkIn',
      key: 'checkIn',
    },
    {
      title: '签退时间',
      dataIndex: 'checkOut',
      key: 'checkOut',
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
      title: '工作时长',
      dataIndex: 'workHours',
      key: 'workHours',
      render: (value: number) => (
        <Text strong>{value} 小时</Text>
      ),
    },
  ];

  const handleViewDetails = (record: Staff) => {
    setCurrentStaff(record);
    setDetailsModalVisible(true);
  };

  const handleEdit = (record: Staff) => {
    setCurrentStaff(record);
    setEditModalVisible(true);
  };

  const handleDelete = (record: Staff) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除员工 ${record.name} 吗？`,
      onOk: () => {
        setStaffList(staffList.filter(item => item.id !== record.id));
        Modal.success({
          title: '删除成功',
          content: '员工信息已成功删除',
        });
      },
    });
  };

  const handleAdd = () => {
    setAddModalVisible(true);
  };

  const handleExport = () => {
    Modal.success({
      title: '导出成功',
      content: '员工数据已成功导出到Excel文件',
    });
  };

  const handleImport = () => {
    Modal.info({
      title: '导入功能',
      content: '员工数据导入功能将在这里实现',
    });
  };

  const staffRowSelection = {
    selectedRowKeys: selectedStaff,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedStaff(selectedRowKeys as string[]);
    },
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

  // 生成部门人员分布图表配置
  const getDepartmentDistributionOption = () => {
    const departments = Array.from(new Set(staffList.map(staff => staff.department)));
    const data = departments.map(dept => {
      const staffCount = staffList.filter(staff => staff.department === dept).length;
      return { value: staffCount, name: dept };
    });

    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}人 ({d}%)'
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

  // 生成考勤状态分布图表配置
  const getAttendanceStatusOption = () => {
    const departments = Array.from(new Set(staffList.map(staff => staff.department)));
    const statuses = ['present', 'late', 'absent', 'leave'];
    const statusNames = {
      present: '正常',
      late: '迟到',
      absent: '缺勤',
      leave: '请假'
    };

    const data = departments.map(dept => {
      const deptStaff = staffList.filter(staff => staff.department === dept);
      const deptAttendance = attendanceList.filter(att => 
        deptStaff.some(staff => staff.id === att.staffId)
      );

      return statuses.map(status => 
        deptAttendance.filter(att => att.status === status).length
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
        data: departments
      },
      series: statuses.map((status, index) => ({
        name: statusNames[status as keyof typeof statusNames],
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        data: departments.map((_, deptIndex) => data[deptIndex][index]),
        itemStyle: {
          color: status === 'present' ? '#52c41a' :
                status === 'late' ? '#faad14' :
                status === 'absent' ? '#ff4d4f' :
                '#1890ff'
        }
      }))
    };
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <TeamOutlined style={{ marginRight: 8 }} />
          员工管理
        </Title>
        <Text type="secondary">
          管理酒店员工信息、排班安排和考勤记录
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="员工总数"
              value={staffList.length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在职员工"
              value={staffList.filter(item => item.status === 'active').length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="请假员工"
              value={staffList.filter(item => item.status === 'leave').length}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日出勤率"
              value={Math.round((attendanceList.filter(item => item.status === 'present').length / attendanceList.length) * 100)}
              suffix="%"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 操作工具栏 */}
      <Card style={{ marginBottom: '24px' }}>
        <Space wrap>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={handleAdd}
          >
            添加员工
          </Button>
          <Button
            icon={<ImportOutlined />}
            onClick={handleImport}
          >
            导入数据
          </Button>
          <Button
            icon={<ExportOutlined />}
            onClick={handleExport}
          >
            导出数据
          </Button>
          <Button
            icon={<LineChartOutlined />}
            onClick={handleTrendAnalysis}
          >
            数据分析
          </Button>
          {selectedStaff.length > 0 && (
            <Button
              type="default"
            >
              批量操作 ({selectedStaff.length})
            </Button>
          )}
        </Space>
      </Card>

      {/* 主要内容区域 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="员工信息" key="staff">
            <Table
              columns={staffColumns}
              dataSource={staffList}
              rowKey="id"
              loading={loading}
              rowSelection={staffRowSelection}
              pagination={{
                total: staffList.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          <TabPane tab="考勤记录" key="attendance">
            <Table
              columns={attendanceColumns}
              dataSource={attendanceList}
              rowKey="id"
              loading={loading}
              pagination={{
                total: attendanceList.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          <TabPane tab="排班管理" key="schedule">
            <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text type="secondary">排班管理功能将在这里实现</Text>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* 员工详情模态框 */}
      <Modal
        title="员工详情"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={600}
      >
        {currentStaff && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="姓名" span={2}>
              {currentStaff.name}
            </Descriptions.Item>
            <Descriptions.Item label="员工编号">
              {currentStaff.employeeId}
            </Descriptions.Item>
            <Descriptions.Item label="部门">
              {currentStaff.department}
            </Descriptions.Item>
            <Descriptions.Item label="职位">
              {currentStaff.position}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Badge
                status={getStatusColor(currentStaff.status) as any}
                text={getStatusText(currentStaff.status)}
              />
            </Descriptions.Item>
            <Descriptions.Item label="联系电话">
              {currentStaff.phone}
            </Descriptions.Item>

            <Descriptions.Item label="入职日期">
              {currentStaff.joinDate}
            </Descriptions.Item>
            <Descriptions.Item label="薪资">
              ¥{currentStaff.salary.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="工作班次">
              {currentStaff.workSchedule}
            </Descriptions.Item>
            <Descriptions.Item label="最后考勤" span={2}>
              {currentStaff.lastAttendance}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 添加员工模态框 */}
      <Modal
        title="添加员工"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setAddModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary">
            添加
          </Button>,
        ]}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="姓名" required>
                <Input placeholder="请输入员工姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="员工编号" required>
                <Input placeholder="请输入员工编号" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="部门" required>
                <Select placeholder="请选择部门">
                  <Select.Option value="前厅部">前厅部</Select.Option>
                  <Select.Option value="客房部">客房部</Select.Option>
                  <Select.Option value="餐饮部">餐饮部</Select.Option>
                  <Select.Option value="工程部">工程部</Select.Option>
                  <Select.Option value="保安部">保安部</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="职位" required>
                <Input placeholder="请输入职位" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="联系电话" required>
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>

          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="入职日期" required>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="薪资" required>
                <Input placeholder="请输入薪资" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="工作班次">
            <Select placeholder="请选择工作班次">
              <Select.Option value="早班 8:00-16:00">早班 8:00-16:00</Select.Option>
              <Select.Option value="中班 16:00-24:00">中班 16:00-24:00</Select.Option>
              <Select.Option value="夜班 0:00-8:00">夜班 0:00-8:00</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑员工模态框 */}
      <Modal
        title="编辑员工"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setEditModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary">
            保存
          </Button>,
        ]}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="姓名" required>
                <Input placeholder="请输入员工姓名" defaultValue={currentStaff?.name} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="员工编号" required>
                <Input placeholder="请输入员工编号" defaultValue={currentStaff?.employeeId} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="部门" required>
                <Select placeholder="请选择部门" defaultValue={currentStaff?.department}>
                  <Select.Option value="前厅部">前厅部</Select.Option>
                  <Select.Option value="客房部">客房部</Select.Option>
                  <Select.Option value="餐饮部">餐饮部</Select.Option>
                  <Select.Option value="工程部">工程部</Select.Option>
                  <Select.Option value="保安部">保安部</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="职位" required>
                <Input placeholder="请输入职位" defaultValue={currentStaff?.position} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="联系电话" required>
                <Input placeholder="请输入联系电话" defaultValue={currentStaff?.phone} />
              </Form.Item>
            </Col>

          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="状态">
                <Select defaultValue={currentStaff?.status}>
                  <Select.Option value="active">在职</Select.Option>
                  <Select.Option value="inactive">离职</Select.Option>
                  <Select.Option value="leave">请假</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="薪资" required>
                <Input placeholder="请输入薪资" defaultValue={currentStaff?.salary.toString()} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="工作班次">
            <Select placeholder="请选择工作班次" defaultValue={currentStaff?.workSchedule}>
              <Select.Option value="早班 8:00-16:00">早班 8:00-16:00</Select.Option>
              <Select.Option value="中班 16:00-24:00">中班 16:00-24:00</Select.Option>
              <Select.Option value="夜班 0:00-8:00">夜班 0:00-8:00</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 趋势分析模态框 */}
      <Modal
        title="员工数据分析"
        open={trendModalVisible}
        onCancel={() => setTrendModalVisible(false)}
        width={1000}
        footer={null}
      >
        <Tabs defaultActiveKey="department">
          <TabPane tab="部门分布" key="department">
            <Card>
              <ReactECharts option={getDepartmentDistributionOption()} style={{ height: 400 }} />
            </Card>
          </TabPane>
          <TabPane tab="考勤状态" key="attendance">
            <Card>
              <ReactECharts option={getAttendanceStatusOption()} style={{ height: 600 }} />
            </Card>
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default StaffManagement; 