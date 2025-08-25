import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Space,
  Form,
  Input,
  Select,
  TimePicker,
  DatePicker,
  Switch,
  Table,
  Tag,
  Modal,
  message,
  Calendar,
  Badge,
  List,
  Avatar,
  Typography,
  Divider,
  Alert,
  Statistic,
  Tabs
} from 'antd';
import {
  ScheduleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  AudioOutlined,
  SoundOutlined,
  VideoCameraOutlined,
  PartitionOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import ReactECharts from 'echarts-for-react';
import { scheduledTasks as initialScheduledTasks } from '../data/broadcastData';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

/**
 * 定时广播页面
 * 支持设置定时任务、重复规则、日历视图等功能
 */
const ScheduledBroadcast: React.FC = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [scheduledTasks, setScheduledTasks] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // 使用统一的定时任务数据
  useEffect(() => {
    setScheduledTasks(initialScheduledTasks);
  }, []);

  // 快速任务创建：预填表单并打开弹窗
  const openQuickTask = (preset: 'greet' | 'meal' | 'goodnight' | 'emergency') => {
    const now = dayjs();
    const presets: Record<string, any> = {
      greet: {
        name: '每日问候',
        type: 'voice',
        content: '早上好，祝您一天好心情。',
        zones: ['前厅', '客房区域'],
        scheduledTime: dayjs('07:00:00', 'HH:mm:ss'),
        startDate: now,
        endDate: now.add(1, 'year'),
        repeatType: 'daily',
        priority: 'normal',
        volume: 75,
      },
      meal: {
        name: '用餐提醒',
        type: 'voice',
        content: '用餐时间到了，欢迎前往餐厅就餐。',
        zones: ['餐厅', '前厅'],
        scheduledTime: dayjs('12:00:00', 'HH:mm:ss'),
        startDate: now,
        endDate: now.add(1, 'year'),
        repeatType: 'daily',
        priority: 'normal',
        volume: 70,
      },
      goodnight: {
        name: '晚安广播',
        type: 'voice',
        content: '晚安，祝您有个美好的夜晚。',
        zones: ['客房区域'],
        scheduledTime: dayjs('22:00:00', 'HH:mm:ss'),
        startDate: now,
        endDate: now.add(1, 'year'),
        repeatType: 'daily',
        priority: 'low',
        volume: 60,
      },
      emergency: {
        name: '紧急广播',
        type: 'voice',
        content: '紧急情况，请按指示迅速有序撤离！',
        zones: ['全区域'],
        scheduledTime: dayjs(),
        startDate: now,
        endDate: now.add(1, 'year'),
        repeatType: 'once',
        priority: 'high',
        volume: 90,
      }
    };
    setEditingTask(null);
    form.setFieldsValue(presets[preset]);
    setIsModalVisible(true);
  };

  // 处理添加/编辑任务
  const handleSubmit = async (values: any) => {
    try {
      const taskData = {
        ...values,
        scheduledTime: values.scheduledTime.format('HH:mm:ss'),
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
        id: editingTask ? editingTask.id : Date.now(),
        status: editingTask ? editingTask.status : 'active'
      };

      if (editingTask) {
        setScheduledTasks(prev => 
          prev.map(task => task.id === editingTask.id ? taskData : task)
        );
        message.success('定时任务更新成功');
      } else {
        setScheduledTasks(prev => [taskData, ...prev]);
        message.success('定时任务创建成功');
      }

      setIsModalVisible(false);
      setEditingTask(null);
      form.resetFields();
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 处理编辑任务
  const handleEdit = (task: any) => {
    setEditingTask(task);
    form.setFieldsValue({
      ...task,
      scheduledTime: dayjs(task.scheduledTime, 'HH:mm:ss'),
      startDate: dayjs(task.startDate),
      endDate: dayjs(task.endDate)
    });
    setIsModalVisible(true);
  };

  // 处理删除任务
  const handleDelete = (taskId: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个定时任务吗？',
      onOk: () => {
        setScheduledTasks(prev => prev.filter(task => task.id !== taskId));
        message.success('定时任务删除成功');
      }
    });
  };

  // 处理任务状态切换
  const handleStatusToggle = (taskId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    setScheduledTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    message.success(`任务已${newStatus === 'active' ? '启用' : '暂停'}`);
  };

  // 获取状态标签颜色
  const getStatusColor = (status: string) => {
    const statusMap: { [key: string]: string } = {
      active: 'green',
      paused: 'orange',
      completed: 'blue',
      failed: 'red'
    };
    return statusMap[status] || 'default';
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      active: '运行中',
      paused: '已暂停',
      completed: '已完成',
      failed: '失败'
    };
    return statusMap[status] || status;
  };

  // 获取优先级标签颜色
  const getPriorityColor = (priority: string) => {
    const priorityMap: { [key: string]: string } = {
      high: 'red',
      normal: 'blue',
      low: 'green'
    };
    return priorityMap[priority] || 'default';
  };

  // 获取重复类型文本
  const getRepeatTypeText = (repeatType: string) => {
    const repeatMap: { [key: string]: string } = {
      once: '仅一次',
      daily: '每天',
      weekly: '每周',
      monthly: '每月',
      yearly: '每年'
    };
    return repeatMap[repeatType] || repeatType;
  };

  // 计算图表数据
  const getChartData = () => {
    // 任务状态分布数据
    const statusData = [
      { name: '运行中', value: scheduledTasks.filter(task => task.status === 'active').length },
      { name: '已暂停', value: scheduledTasks.filter(task => task.status === 'paused').length },
      { name: '已完成', value: scheduledTasks.filter(task => task.status === 'completed').length },
      { name: '失败', value: scheduledTasks.filter(task => task.status === 'failed').length }
    ];

    // 优先级分布数据
    const priorityData = [
      { name: '高优先级', value: scheduledTasks.filter(task => task.priority === 'high').length },
      { name: '中优先级', value: scheduledTasks.filter(task => task.priority === 'normal').length },
      { name: '低优先级', value: scheduledTasks.filter(task => task.priority === 'low').length }
    ];

    // 广播类型分布数据
    const typeData = [
      { name: '语音合成', value: scheduledTasks.filter(task => task.type === 'voice').length },
      { name: '音频文件', value: scheduledTasks.filter(task => task.type === 'audio').length },
      { name: '视频文件', value: scheduledTasks.filter(task => task.type === 'video').length }
    ];

    // 执行趋势数据（最近7天）
    const trendData = Array.from({ length: 7 }, (_, i) => {
      const date = dayjs().subtract(6 - i, 'day');
      const dayTasks = scheduledTasks.filter(task => {
        if (task.repeatType === 'daily') return true;
        if (task.repeatType === 'weekly' && date.day() === dayjs(task.startDate).day()) return true;
        if (task.repeatType === 'monthly' && date.date() === dayjs(task.startDate).date()) return true;
        return false;
      });
      return {
        date: date.format('MM-DD'),
        tasks: dayTasks.length,
        completed: dayTasks.filter(task => task.status === 'completed').length,
        failed: dayTasks.filter(task => task.status === 'failed').length
      };
    });

    return { statusData, priorityData, typeData, trendData };
  };

  // 表格列定义
  const columns = [
    {
      title: '任务名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string, record: any) => (
        <Space>
          {record.type === 'audio' ? <AudioOutlined /> : 
           record.type === 'voice' ? <SoundOutlined /> : <VideoCameraOutlined />}
          <div>
            <div style={{ fontWeight: 'bold' }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#999' }}>
              {record.content.length > 30 ? record.content.substring(0, 30) + '...' : record.content}
            </div>
          </div>
        </Space>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type: string) => {
        const typeMap: { [key: string]: string } = {
          audio: '音频',
          voice: '语音',
          video: '视频'
        };
        return typeMap[type] || type;
      }
    },
    {
      title: '区域',
      dataIndex: 'zones',
      key: 'zones',
      width: 120,
      render: (zones: string[]) => (
        <div>
          {zones.map((zone, index) => (
            <Tag key={index} color="blue" style={{ marginBottom: '2px' }}>
              {zone}
            </Tag>
          ))}
        </div>
      )
    },
    {
      title: '执行时间',
      dataIndex: 'scheduledTime',
      key: 'scheduledTime',
      width: 100,
      render: (time: string) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{time}</div>
        </div>
      )
    },
    {
      title: '下次执行',
      dataIndex: 'nextExecution',
      key: 'nextExecution',
      width: 150,
      render: (nextExec: string) => (
        <div style={{ fontSize: '12px' }}>
          {nextExec ? dayjs(nextExec).format('MM-DD HH:mm') : '-'}
        </div>
      )
    },
    {
      title: '重复类型',
      dataIndex: 'repeatType',
      key: 'repeatType',
      width: 100,
      render: (repeatType: string) => (
        <Tag color="blue">{getRepeatTypeText(repeatType)}</Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {priority === 'high' ? '高' : priority === 'normal' ? '中' : '低'}
        </Tag>
      )
    },
    {
      title: '执行统计',
      key: 'statistics',
      width: 120,
      render: (_: any, record: any) => (
        <div style={{ fontSize: '12px' }}>
          <div>执行: {record.executionCount}次</div>
          <div>成功率: {record.successRate}%</div>
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="small" direction="vertical">
          <Button 
            type="link" 
            size="small"
            icon={record.status === 'active' ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={() => handleStatusToggle(record.id, record.status)}
          >
            {record.status === 'active' ? '暂停' : '启用'}
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
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 日历单元格渲染
  const dateCellRender = (value: dayjs.Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD');
    const dayTasks = scheduledTasks.filter(task => {
      if (task.repeatType === 'daily') return true;
      if (task.repeatType === 'weekly') {
        const startDate = dayjs(task.startDate);
        const diffWeeks = value.diff(startDate, 'week');
        return diffWeeks >= 0 && diffWeeks % 1 === 0;
      }
      if (task.repeatType === 'monthly') {
        const startDate = dayjs(task.startDate);
        return value.date() === startDate.date();
      }
      if (task.repeatType === 'yearly') {
        const startDate = dayjs(task.startDate);
        return value.month() === startDate.month() && value.date() === startDate.date();
      }
      return task.startDate === dateStr;
    });

    return (
      <div>
        {dayTasks.map(task => (
          <div key={task.id} style={{ marginBottom: '2px' }}>
            <Badge 
              status={task.status === 'active' ? 'processing' : 'default'} 
              text={
                <Text style={{ fontSize: '10px' }}>
                  {task.scheduledTime} {task.name}
                </Text>
              } 
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="scheduled-broadcast">
      <div style={{ marginBottom: 24 }}>
        <Button 
          type="link" 
          icon={<ScheduleOutlined />} 
          onClick={() => navigate('/broadcast-system')}
          style={{ padding: 0, marginBottom: '16px' }}
        >
          返回广播系统
        </Button>
        <Title level={2}>
          <ClockCircleOutlined style={{ marginRight: '8px' }} />
          定时广播
        </Title>
        <Text type="secondary">
          设置定时任务，在指定时间自动播放广播内容
        </Text>
      </div>

      {/* 主要内容区域 - Tabs样式 */}
      <Card>
        <Tabs defaultActiveKey="overview" type="card" size="large">
          {/* 概览标签页 */}
          <Tabs.TabPane tab="系统概览" key="overview">
            {/* 系统状态概览 */}
            <Alert
              message="系统状态"
              description={
                <Space>
                  <span>🟢 定时广播系统运行正常</span>
                  <span>📅 今日待执行任务: {scheduledTasks.filter(task => task.status === 'active' && task.repeatType === 'daily').length} 个</span>
                  <span>⏰ 下次执行时间: {scheduledTasks.filter(task => task.status === 'active').sort((a, b) => dayjs(a.nextExecution).diff(dayjs(b.nextExecution)))[0]?.scheduledTime || '无'}</span>
                </Space>
              }
              type="success"
              showIcon
              style={{ marginBottom: 24 }}
            />

            {/* 统计信息 */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="总任务数"
                    value={scheduledTasks.length}
                    prefix={<ScheduleOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="运行中"
                    value={scheduledTasks.filter(task => task.status === 'active').length}
                    prefix={<PlayCircleOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="已暂停"
                    value={scheduledTasks.filter(task => task.status === 'paused').length}
                    prefix={<PauseCircleOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="今日任务"
                    value={scheduledTasks.filter(task => task.repeatType === 'daily').length}
                    prefix={<CalendarOutlined />}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>
            </Row>

            {/* 详细统计信息 */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="平均成功率"
                    value={Math.round(scheduledTasks.reduce((sum, task) => sum + task.successRate, 0) / scheduledTasks.length)}
                    suffix="%"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="总执行次数"
                    value={scheduledTasks.reduce((sum, task) => sum + task.executionCount, 0)}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="高优先级任务"
                    value={scheduledTasks.filter(task => task.priority === 'high').length}
                    prefix={<ExclamationCircleOutlined />}
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                </Card>
              </Col>
            </Row>

            {/* 快速任务创建 */}
            <Card title="快速任务创建" style={{ marginBottom: 24 }}>
              <Row gutter={16}>
                <Col span={6}>
                  <Card size="small" hoverable style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => openQuickTask('greet')}>
                    <AudioOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
                    <div>每日问候</div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>早上7点问候</Text>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small" hoverable style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => openQuickTask('meal')}>
                    <SoundOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '8px' }} />
                    <div>用餐提醒</div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>三餐时间提醒</Text>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small" hoverable style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => openQuickTask('goodnight')}>
                    <VideoCameraOutlined style={{ fontSize: '24px', color: '#722ed1', marginBottom: '8px' }} />
                    <div>晚安广播</div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>晚上10点晚安</Text>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small" hoverable style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => openQuickTask('emergency')}>
                    <ExclamationCircleOutlined style={{ fontSize: '24px', color: '#ff4d4f', marginBottom: '8px' }} />
                    <div>紧急广播</div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>紧急情况广播</Text>
                  </Card>
                </Col>
              </Row>
            </Card>
          </Tabs.TabPane>

          {/* 任务管理标签页 */}
          <Tabs.TabPane tab="任务管理" key="tasks">
            {/* 操作按钮 */}
            <Card style={{ marginBottom: 24 }}>
              <Row justify="space-between" align="middle">
                <Col>
                  <Space>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />}
                      onClick={() => {
                        setEditingTask(null);
                        form.resetFields();
                        setIsModalVisible(true);
                      }}
                    >
                      新建定时任务
                    </Button>
                    <Button icon={<ReloadOutlined />}>
                      刷新状态
                    </Button>
                    <Button icon={<PlayCircleOutlined />}>
                      批量启用
                    </Button>
                    <Button icon={<PauseCircleOutlined />}>
                      批量暂停
                    </Button>
                  </Space>
                </Col>
                <Col>
                  <Space>
                    <Button icon={<CalendarOutlined />}>
                      导出任务
                    </Button>
                    <Button icon={<PartitionOutlined />}>
                      任务模板
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>

            {/* 任务列表 */}
            <Table 
              columns={columns} 
              dataSource={scheduledTasks} 
              rowKey="id"
              pagination={{ 
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
              }}
              scroll={{ x: 1200 }}
              size="middle"
              bordered
            />
          </Tabs.TabPane>

          {/* 日历视图标签页 */}
          <Tabs.TabPane tab="日历视图" key="calendar">
            <Calendar 
              dateCellRender={dateCellRender}
              value={selectedDate}
              onChange={setSelectedDate}
            />
          </Tabs.TabPane>

          {/* 任务统计标签页 */}
          <Tabs.TabPane tab="任务统计" key="statistics">
            {(() => {
              const { statusData, priorityData, typeData, trendData } = getChartData();
              return (
                <>
                  <Row gutter={24}>
                    <Col span={8}>
                      <Card title="任务状态分布" style={{ marginBottom: 24 }}>
                        <ReactECharts
                          option={{
                            tooltip: {
                              trigger: 'item',
                              formatter: '{a} <br/>{b}: {c} ({d}%)'
                            },
                            legend: {
                              orient: 'vertical',
                              left: 'left'
                            },
                            series: [
                              {
                                name: '任务状态',
                                type: 'pie',
                                radius: '50%',
                                data: statusData,
                                emphasis: {
                                  itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                  }
                                }
                              }
                            ]
                          }}
                          style={{ height: '200px' }}
                        />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card title="优先级分布" style={{ marginBottom: 24 }}>
                        <ReactECharts
                          option={{
                            tooltip: {
                              trigger: 'item',
                              formatter: '{a} <br/>{b}: {c} ({d}%)'
                            },
                            legend: {
                              orient: 'vertical',
                              left: 'left'
                            },
                            series: [
                              {
                                name: '优先级',
                                type: 'pie',
                                radius: '50%',
                                data: priorityData,
                                emphasis: {
                                  itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                  }
                                }
                              }
                            ]
                          }}
                          style={{ height: '200px' }}
                        />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card title="广播类型分布" style={{ marginBottom: 24 }}>
                        <ReactECharts
                          option={{
                            tooltip: {
                              trigger: 'item',
                              formatter: '{a} <br/>{b}: {c} ({d}%)'
                            },
                            legend: {
                              orient: 'vertical',
                              left: 'left'
                            },
                            series: [
                              {
                                name: '广播类型',
                                type: 'pie',
                                radius: '50%',
                                data: typeData,
                                emphasis: {
                                  itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                  }
                                }
                              }
                            ]
                          }}
                          style={{ height: '200px' }}
                        />
                      </Card>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Card title="任务数量趋势" style={{ marginBottom: 24 }}>
                        <ReactECharts
                          option={{
                            tooltip: {
                              trigger: 'axis',
                              axisPointer: {
                                type: 'shadow'
                              }
                            },
                            xAxis: {
                              type: 'category',
                              data: trendData.map(item => item.date)
                            },
                            yAxis: {
                              type: 'value'
                            },
                            series: [
                              {
                                name: '任务数量',
                                type: 'bar',
                                data: trendData.map(item => item.tasks),
                                itemStyle: {
                                  color: '#1890ff'
                                }
                              }
                            ]
                          }}
                          style={{ height: '200px' }}
                        />
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card title="执行结果趋势" style={{ marginBottom: 24 }}>
                        <ReactECharts
                          option={{
                            tooltip: {
                              trigger: 'axis'
                            },
                            legend: {
                              data: ['总任务', '已完成', '失败']
                            },
                            xAxis: {
                              type: 'category',
                              data: trendData.map(item => item.date)
                            },
                            yAxis: {
                              type: 'value'
                            },
                            series: [
                              {
                                name: '总任务',
                                type: 'line',
                                data: trendData.map(item => item.tasks),
                                itemStyle: { color: '#1890ff' }
                              },
                              {
                                name: '已完成',
                                type: 'line',
                                data: trendData.map(item => item.completed),
                                itemStyle: { color: '#52c41a' }
                              },
                              {
                                name: '失败',
                                type: 'line',
                                data: trendData.map(item => item.failed),
                                itemStyle: { color: '#ff4d4f' }
                              }
                            ]
                          }}
                          style={{ height: '200px' }}
                        />
                      </Card>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={24}>
                      <Card title="执行统计概览">
                        <Row gutter={16}>
                          <Col span={6}>
                            <Statistic
                              title="平均每日任务数"
                              value={Math.round(trendData.reduce((sum, item) => sum + item.tasks, 0) / 7)}
                              suffix="个"
                              valueStyle={{ color: '#1890ff' }}
                            />
                          </Col>
                          <Col span={6}>
                            <Statistic
                              title="平均完成率"
                              value={Math.round(
                                (trendData.reduce((sum, item) => sum + item.completed, 0) / 
                                 Math.max(trendData.reduce((sum, item) => sum + item.tasks, 0), 1)) * 100
                              )}
                              suffix="%"
                              valueStyle={{ color: '#52c41a' }}
                            />
                          </Col>
                          <Col span={6}>
                            <Statistic
                              title="平均失败率"
                              value={Math.round(
                                (trendData.reduce((sum, item) => sum + item.failed, 0) / 
                                 Math.max(trendData.reduce((sum, item) => sum + item.tasks, 0), 1)) * 100
                              )}
                              suffix="%"
                              valueStyle={{ color: '#ff4d4f' }}
                            />
                          </Col>
                          <Col span={6}>
                            <Statistic
                              title="最忙时段"
                              value={(() => {
                                const hourTasks = Array.from({ length: 24 }, (_, hour) => ({
                                  hour,
                                  count: scheduledTasks.filter(task => 
                                    task.status === 'active' && 
                                    parseInt(task.scheduledTime.split(':')[0]) === hour
                                  ).length
                                }));
                                const maxHour = hourTasks.reduce((max, item) => 
                                  item.count > max.count ? item : max
                                );
                                return `${maxHour.hour}:00`;
                              })()}
                              valueStyle={{ color: '#722ed1' }}
                            />
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Row>
                </>
              );
            })()}
          </Tabs.TabPane>
        </Tabs>
      </Card>

      {/* 添加/编辑任务弹窗 */}
      <Modal
        title={editingTask ? '编辑定时任务' : '新建定时任务'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingTask(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            repeatType: 'daily',
            priority: 'normal',
            volume: 75
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="任务名称"
                rules={[{ required: true, message: '请输入任务名称' }]}
              >
                <Input placeholder="请输入任务名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="广播类型"
                rules={[{ required: true, message: '请选择广播类型' }]}
              >
                <Select placeholder="请选择广播类型">
                  <Option value="audio">音频文件</Option>
                  <Option value="voice">语音合成</Option>
                  <Option value="video">视频文件</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="content"
            label="广播内容"
            rules={[{ required: true, message: '请输入广播内容' }]}
          >
            <TextArea rows={3} placeholder="请输入广播内容" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="zones"
                label="广播区域"
                rules={[{ required: true, message: '请选择广播区域' }]}
              >
                <Select mode="multiple" placeholder="请选择广播区域">
                  <Option value="前厅">前厅</Option>
                  <Option value="餐厅">餐厅</Option>
                  <Option value="客房区域">客房区域</Option>
                  <Option value="停车场">停车场</Option>
                  <Option value="花园">花园</Option>
                  <Option value="游泳池">游泳池</Option>
                  <Option value="健身房">健身房</Option>
                  <Option value="SPA中心">SPA中心</Option>
                  <Option value="全区域">全区域</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="scheduledTime"
                label="执行时间"
                rules={[{ required: true, message: '请选择执行时间' }]}
              >
                <TimePicker format="HH:mm:ss" placeholder="请选择执行时间" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="开始日期"
                rules={[{ required: true, message: '请选择开始日期' }]}
              >
                <DatePicker placeholder="请选择开始日期" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="结束日期"
                rules={[{ required: true, message: '请选择结束日期' }]}
              >
                <DatePicker placeholder="请选择结束日期" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="repeatType"
                label="重复类型"
                rules={[{ required: true, message: '请选择重复类型' }]}
              >
                <Select placeholder="请选择重复类型">
                  <Option value="once">仅一次</Option>
                  <Option value="daily">每天</Option>
                  <Option value="weekly">每周</Option>
                  <Option value="monthly">每月</Option>
                  <Option value="yearly">每年</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="priority"
                label="优先级"
                rules={[{ required: true, message: '请选择优先级' }]}
              >
                <Select placeholder="请选择优先级">
                  <Option value="high">高</Option>
                  <Option value="normal">中</Option>
                  <Option value="low">低</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="volume"
                label="音量"
                rules={[{ required: true, message: '请设置音量' }]}
              >
                <Select placeholder="请设置音量">
                  <Option value={50}>50%</Option>
                  <Option value={60}>60%</Option>
                  <Option value={70}>70%</Option>
                  <Option value={75}>75%</Option>
                  <Option value={80}>80%</Option>
                  <Option value={90}>90%</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="autoRetry"
                label="自动重试"
                valuePropName="checked"
              >
                <Switch checkedChildren="启用" unCheckedChildren="禁用" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="retryCount"
                label="重试次数"
              >
                <Select placeholder="重试次数" disabled>
                  <Option value={1}>1次</Option>
                  <Option value={2}>2次</Option>
                  <Option value={3}>3次</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="任务描述"
          >
            <TextArea rows={2} placeholder="请输入任务描述（可选）" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingTask ? '更新任务' : '创建任务'}
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                setEditingTask(null);
                form.resetFields();
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

export default ScheduledBroadcast;
