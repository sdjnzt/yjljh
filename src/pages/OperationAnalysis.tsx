import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Select, DatePicker, Space, Progress, Table, Tag, Typography } from 'antd';
import { BarChartOutlined, LineChartOutlined, TrophyOutlined, EnvironmentOutlined, ThunderboltOutlined, DollarOutlined, SafetyCertificateOutlined, ClockCircleOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { operationData, hotelRooms, hotelDevices, OperationData } from '../data/mockData';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const OperationAnalysisPage: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('week');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(7, 'day'),
    dayjs()
  ]);
  const [filteredData, setFilteredData] = useState<OperationData[]>([]);

  // 根据时间范围筛选数据
  useEffect(() => {
    const startDate = dateRange[0].format('YYYY-MM-DD');
    const endDate = dateRange[1].format('YYYY-MM-DD');
    
    const filtered = operationData.filter(data => 
      data.date >= startDate && data.date <= endDate
    );
    
    setFilteredData(filtered);
  }, [dateRange]);

  // 计算统计数据
  const calculateStats = () => {
    if (filteredData.length === 0) return null;

    const avgOccupancyRate = filteredData.reduce((sum, d) => sum + d.roomOccupancyRate, 0) / filteredData.length;
    const totalEnergyConsumption = filteredData.reduce((sum, d) => sum + d.energyConsumption, 0);
    const totalEnergyCost = filteredData.reduce((sum, d) => sum + d.energyCost, 0);
    const avgDeviceUptime = filteredData.reduce((sum, d) => sum + d.deviceUptime, 0) / filteredData.length;
    const avgGuestSatisfaction = filteredData.reduce((sum, d) => sum + d.guestSatisfaction, 0) / filteredData.length;
    const totalCO2 = filteredData.reduce((sum, d) => sum + d.co2Emission, 0);
    const avgTemperature = filteredData.reduce((sum, d) => sum + d.averageRoomTemperature, 0) / filteredData.length;

    return {
      avgOccupancyRate,
      totalEnergyConsumption,
      totalEnergyCost,
      avgDeviceUptime,
      avgGuestSatisfaction,
      totalCO2,
      avgTemperature
    };
  };

  const stats = calculateStats();

  // 入住率趋势图配置
  const occupancyChartOption = {
    title: {
      text: '客房入住率趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br/>入住率: {c}%'
    },
    xAxis: {
      type: 'category',
      data: filteredData.map(d => d.date.slice(5)),
      axisLabel: {
        rotate: 30
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [{
      data: filteredData.map(d => d.roomOccupancyRate),
      type: 'line',
      smooth: true,
      areaStyle: {
        opacity: 0.3
      },
      lineStyle: {
        color: '#1890ff'
      },
      itemStyle: {
        color: '#1890ff'
      }
    }]
  };

  // 能耗分析图配置
  const energyChartOption = {
    title: {
      text: '能耗与成本分析',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params: any) {
        const date = params[0].axisValue;
        let result = `${date}<br/>`;
        params.forEach((param: any) => {
          if (param.seriesName === '能耗(kWh)') {
            result += `${param.seriesName}: ${param.value} kWh<br/>`;
          } else {
            result += `${param.seriesName}: ¥${param.value}<br/>`;
          }
        });
        return result;
      }
    },
    legend: {
      data: ['能耗(kWh)', '成本(元)'],
      top: 30
    },
    xAxis: {
      type: 'category',
      data: filteredData.map(d => d.date.slice(5)),
      axisLabel: {
        rotate: 30
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '能耗(kWh)',
        position: 'left',
        axisLabel: {
          formatter: '{value} kWh'
        }
      },
      {
        type: 'value',
        name: '成本(元)',
        position: 'right',
        axisLabel: {
          formatter: '¥{value}'
        }
      }
    ],
    series: [
      {
        name: '能耗(kWh)',
        type: 'bar',
        data: filteredData.map(d => d.energyConsumption),
        itemStyle: {
          color: '#52c41a'
        }
      },
      {
        name: '成本(元)',
        type: 'line',
        yAxisIndex: 1,
        data: filteredData.map(d => d.energyCost),
        lineStyle: {
          color: '#fa8c16'
        },
        itemStyle: {
          color: '#fa8c16'
        }
      }
    ]
  };

  // 设备运行时间分析
  const deviceUptimeOption = {
    title: {
      text: '设备运行时间与客户满意度',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params: any) {
        const date = params[0].axisValue;
        let result = `${date}<br/>`;
        params.forEach((param: any) => {
          if (param.seriesName === '设备运行时间') {
            result += `${param.seriesName}: ${param.value}%<br/>`;
          } else {
            result += `${param.seriesName}: ${param.value}分<br/>`;
          }
        });
        return result;
      }
    },
    legend: {
      data: ['设备运行时间', '客户满意度'],
      top: 30
    },
    xAxis: {
      type: 'category',
      data: filteredData.map(d => d.date.slice(5)),
      axisLabel: {
        rotate: 30
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '运行时间(%)',
        min: 90,
        max: 100,
        position: 'left'
      },
      {
        type: 'value',
        name: '满意度',
        min: 3,
        max: 5,
        position: 'right',
        axisLabel: {
          formatter: '{value}分'
        }
      }
    ],
    series: [
      {
        name: '设备运行时间',
        type: 'line',
        data: filteredData.map(d => d.deviceUptime),
        itemStyle: {
          color: '#1890ff'
        }
      },
      {
        name: '客户满意度',
        type: 'line',
        yAxisIndex: 1,
        data: filteredData.map(d => d.guestSatisfaction),
        lineStyle: {
          color: '#f5222d'
        },
        itemStyle: {
          color: '#f5222d'
        }
      }
    ]
  };

  // 每日用电高峰时段分析
  const peakHourOption = {
    title: {
      text: '用电高峰时段分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}次 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle'
    },
    series: [{
      type: 'pie',
      radius: '70%',
      center: ['60%', '50%'],
      data: [
        { 
          value: filteredData.filter(d => d.peakEnergyHour >= 8 && d.peakEnergyHour < 12).length,
          name: '上午(8-12点)',
          itemStyle: { color: '#91cc75' }
        },
        { 
          value: filteredData.filter(d => d.peakEnergyHour >= 12 && d.peakEnergyHour < 14).length,
          name: '中午(12-14点)',
          itemStyle: { color: '#fac858' }
        },
        { 
          value: filteredData.filter(d => d.peakEnergyHour >= 14 && d.peakEnergyHour < 18).length,
          name: '下午(14-18点)',
          itemStyle: { color: '#ee6666' }
        },
        { 
          value: filteredData.filter(d => d.peakEnergyHour >= 18 && d.peakEnergyHour < 22).length,
          name: '晚上(18-22点)',
          itemStyle: { color: '#73c0de' }
        },
        { 
          value: filteredData.filter(d => d.peakEnergyHour >= 22 || d.peakEnergyHour < 8).length,
          name: '夜间(22-8点)',
          itemStyle: { color: '#3ba272' }
        }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  // 房间类型分析表格
  const roomTypeAnalysis = [
    {
      key: '1',
      roomType: '标准房',
      count: hotelRooms.filter(r => r.type === 'standard').length,
      avgOccupancy: 75,
      avgEnergyConsumption: 14.2,
      avgRevenue: 280
    },
    {
      key: '2',
      roomType: '豪华房',
      count: hotelRooms.filter(r => r.type === 'deluxe').length,
      avgOccupancy: 68,
      avgEnergyConsumption: 18.5,
      avgRevenue: 420
    },
    {
      key: '3',
      roomType: '套房',
      count: hotelRooms.filter(r => r.type === 'suite').length,
      avgOccupancy: 45,
      avgEnergyConsumption: 25.3,
      avgRevenue: 680
    }
  ];

  const roomTypeColumns = [
    {
      title: '房间类型',
      dataIndex: 'roomType',
      key: 'roomType',
    },
    {
      title: '房间数量',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: '平均入住率',
      dataIndex: 'avgOccupancy',
      key: 'avgOccupancy',
      render: (value: number) => `${value}%`
    },
    {
      title: '平均能耗',
      dataIndex: 'avgEnergyConsumption',
      key: 'avgEnergyConsumption',
      render: (value: number) => `${value} kWh`
    },
    {
      title: '平均收益',
      dataIndex: 'avgRevenue',
      key: 'avgRevenue',
      render: (value: number) => `¥${value}`
    }
  ];

  // 处理时间范围选择
  const handleTimeRangeChange = (value: string) => {
    setSelectedTimeRange(value);
    let start: dayjs.Dayjs;
    const end = dayjs();
    
    switch (value) {
      case 'day':
        start = end.subtract(1, 'day');
        break;
      case 'week':
        start = end.subtract(7, 'day');
        break;
      case 'month':
        start = end.subtract(30, 'day');
        break;
      case 'year':
        start = end.subtract(365, 'day');
        break;
      default:
        start = end.subtract(7, 'day');
    }
    
    setDateRange([start, end]);
  };

  // 处理日期范围选择器变化
  const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]]);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 时间范围选择 */}
      <Card style={{ marginBottom: 16 }}>
        <Row align="middle" justify="space-between">
          <Col>
            <Space size="large">
              <Space>
                <span>分析时间范围:</span>
                <Select
                  value={selectedTimeRange}
                  onChange={handleTimeRangeChange}
                  style={{ width: 120 }}
                >
                  <Option value="day">今日</Option>
                  <Option value="week">本周</Option>
                  <Option value="month">本月</Option>
                  <Option value="year">今年</Option>
                </Select>
              </Space>
              <RangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                allowClear={false}
              />
            </Space>
          </Col>
          <Col>
            <Tag color="blue">数据更新时间: {dayjs().format('YYYY-MM-DD HH:mm:ss')}</Tag>
          </Col>
        </Row>
      </Card>

      {/* 关键指标统计 */}
      {stats && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="平均入住率"
                value={stats.avgOccupancyRate.toFixed(1)}
                suffix="%"
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
              <Progress
                percent={stats.avgOccupancyRate}
                showInfo={false}
                strokeColor="#3f8600"
                style={{ marginTop: 8 }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="总能耗"
                value={stats.totalEnergyConsumption.toFixed(0)}
                suffix="kWh"
                prefix={<ThunderboltOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
              <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                日均: {(stats.totalEnergyConsumption / filteredData.length).toFixed(1)} kWh
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="总成本"
                value={stats.totalEnergyCost.toFixed(0)}
                prefix="¥"
                valueStyle={{ color: '#fa8c16' }}
              />
              <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                日均: ¥{(stats.totalEnergyCost / filteredData.length).toFixed(0)}
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="客户满意度"
                value={stats.avgGuestSatisfaction.toFixed(1)}
                suffix="/ 5.0"
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
              <Progress
                percent={(stats.avgGuestSatisfaction / 5) * 100}
                showInfo={false}
                strokeColor="#722ed1"
                style={{ marginTop: 8 }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* 图表分析 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card>
            <ReactECharts option={occupancyChartOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <ReactECharts option={energyChartOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card>
            <ReactECharts option={deviceUptimeOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <ReactECharts option={peakHourOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      {/* 详细分析 */}
      <Row gutter={16}>
        <Col span={16}>
          <Card title="房间类型运营分析">
            <Table
              columns={roomTypeColumns}
              dataSource={roomTypeAnalysis}
              pagination={false}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="设备效率统计" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <div>设备总数: {hotelDevices.length}</div>
                <Progress
                  percent={100}
                  showInfo={false}
                  strokeColor="#1890ff"
                />
              </div>
              <div>
                <div>在线设备: {hotelDevices.filter(d => d.status === 'online').length}</div>
                <Progress
                  percent={(hotelDevices.filter(d => d.status === 'online').length / hotelDevices.length) * 100}
                  showInfo={false}
                  strokeColor="#52c41a"
                />
              </div>
              {stats && (
                <div>
                  <div>平均运行时间: {stats.avgDeviceUptime.toFixed(1)}%</div>
                  <Progress
                    percent={stats.avgDeviceUptime}
                    showInfo={false}
                    strokeColor="#faad14"
                  />
                </div>
              )}
            </Space>
          </Card>

          <Card title="环保指标">
            <Space direction="vertical" style={{ width: '100%' }}>
              {stats && (
                <>
                  <Statistic
                    title="碳排放总量"
                    value={stats.totalCO2}
                    suffix="kg CO₂"
                    valueStyle={{ color: '#52c41a' }}
                  />
                  <Statistic
                    title="日均碳排放"
                    value={(stats.totalCO2 / filteredData.length).toFixed(1)}
                    suffix="kg CO₂"
                    valueStyle={{ color: '#fa8c16' }}
                  />
                </>
              )}
              <div style={{ marginTop: 16, padding: 12, backgroundColor: '#f6ffed', borderRadius: 4 }}>
                <div style={{ color: '#52c41a', fontWeight: 'bold' }}>节能建议</div>
                <div style={{ fontSize: '12px', marginTop: 4 }}>
                  通过智能调节，本周已节省 15% 能耗
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OperationAnalysisPage; 