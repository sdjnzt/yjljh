import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Select, 
  DatePicker, 
  Button, 
  Statistic, 
  Tag, 
  Progress, 
  Table,
  Input,
  Space,
  Tabs,
  Timeline,
  Alert,
  Badge,
  Tooltip,
  Switch,
  Radio,
  Divider,
  message,
  Modal,
  Form,
  InputNumber,
  Dropdown,
  Menu
} from 'antd';
import { 
  BarChartOutlined, 
  LineChartOutlined,
  RiseOutlined,
  FallOutlined,
  SyncOutlined,
  ExportOutlined,
  FilterOutlined,
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
  EyeOutlined,
  FireOutlined,
  ThunderboltOutlined,
  CloudOutlined,
  EnvironmentOutlined,
  BellOutlined,
  DownloadOutlined,
  FileTextOutlined,
  CalendarOutlined,
  DashboardOutlined,
  PieChartOutlined,
  AreaChartOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { chartData, dataRecords, devices } from '../data/mockData';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;

interface DataPoint {
  time: string;
  peopleFlow: number;
  deviceEfficiency: number;
  securityRisk: number;
  deviceId: string;
  status: string;
}

interface AnalysisMetrics {
  totalRecords: number;
  peopleFlow: number;
  deviceEfficiency: number;
  anomalyCount: number;
  predictionAccuracy: number;
  qualityScore: number;
  realtimeConnections: number;
  aiModelStatus: string;
}

const DataAnalysis: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState('peopleFlow');
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [filterType, setFilterType] = useState('all');
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [aiModelStatus, setAiModelStatus] = useState('running');
  
  const [metrics, setMetrics] = useState<AnalysisMetrics>({
    totalRecords: 0,
    peopleFlow: 0,
    deviceEfficiency: 0,
    anomalyCount: 0,
    predictionAccuracy: 0,
    qualityScore: 0,
    realtimeConnections: 0,
    aiModelStatus: 'running'
  });

  const [realtimeData, setRealtimeData] = useState<DataPoint[]>([
    {
      time: new Date().toLocaleTimeString(),
      peopleFlow: 150,
      deviceEfficiency: 85,
      securityRisk: 20,
      deviceId: 'ai-model-1',
      status: 'normal'
    }
  ]);
  const [trendData, setTrendData] = useState<any[]>([
    {
      hour: '00:00',
      peopleFlow: 150,
      deviceEfficiency: 85,
      securityRisk: 20,
      energyConsumption: 1000
    }
  ]);

  // 模拟实时数据更新
  useEffect(() => {
    const updateMetrics = () => {
      const newMetrics = {
        totalRecords: dataRecords.length + Math.floor(Math.random() * 10),
        peopleFlow: 150 + Math.floor(Math.random() * 50),
        deviceEfficiency: 85 + Math.random() * 10,
        anomalyCount: Math.floor(Math.random() * 5),
        predictionAccuracy: 92 + Math.random() * 5,
        qualityScore: 96 + Math.random() * 3,
        realtimeConnections: devices.filter(d => d.status === 'online').length,
        aiModelStatus: 'running'
      };
      setMetrics(newMetrics);

      // 生成AI趋势数据
      const hours = Array.from({ length: 24 }, (_, i) => i);
      const newTrendData = hours.map(hour => ({
        hour: `${hour.toString().padStart(2, '0')}:00`,
        peopleFlow: 150 + Math.sin(hour * Math.PI / 12) * 50 + Math.random() * 20,
        deviceEfficiency: 85 + Math.cos(hour * Math.PI / 12) * 10 + Math.random() * 5,
        securityRisk: 20 + Math.random() * 10,
        energyConsumption: 1000 + Math.random() * 200 - 100
      }));
      setTrendData(newTrendData);

      // 生成AI实时数据流
      const newRealtimeData = Array.from({ length: 20 }, (_, i) => ({
        time: new Date(Date.now() - i * 30000).toLocaleTimeString(),
        peopleFlow: 150 + Math.random() * 50,
        deviceEfficiency: 85 + Math.random() * 10,
        securityRisk: 20 + Math.random() * 10,
        deviceId: `ai-model-${Math.floor(Math.random() * 5) + 1}`,
        status: Math.random() > 0.1 ? 'normal' : 'anomaly'
      }));
      setRealtimeData(newRealtimeData);
    };

    // 立即执行一次，确保有初始数据
    updateMetrics();
    
    if (autoRefresh) {
      const interval = setInterval(updateMetrics, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  // 自定义图表组件 - 使用Progress条形图
  const BarChart = ({ data, title, color = '#1890ff' }: any) => {
    // 添加安全检查
    if (!data || data.length === 0) {
      return (
        <div style={{ padding: '16px 0', textAlign: 'center', color: '#666' }}>
          暂无数据
        </div>
      );
    }

    // 确保数据有效
    const validData = data.filter((item: any) => item && item.value !== undefined && !isNaN(item.value));
    if (validData.length === 0) {
      return (
        <div style={{ padding: '16px 0', textAlign: 'center', color: '#666' }}>
          暂无有效数据
        </div>
      );
    }

    const maxValue = Math.max(...validData.map((d: any) => d.value));

    return (
      <div style={{ padding: '16px 0' }}>
        <div style={{ marginBottom: 16, fontSize: 14, fontWeight: 'bold' }}>{title}</div>
        {validData.map((item: any, index: number) => (
          <div key={index} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12 }}>{item.name}</span>
              <span style={{ fontSize: 12, fontWeight: 'bold' }}>{item.value}</span>
            </div>
            <Progress 
              percent={Math.min((item.value / maxValue) * 100, 100)} 
              size="small"
              strokeColor={color}
              showInfo={false}
            />
          </div>
        ))}
      </div>
    );
  };

  // 自定义趋势图组件
  const TrendChart = ({ data, field, color = '#1890ff' }: any) => {
    // 添加安全检查
    if (!data || data.length === 0) {
      return (
        <div style={{ padding: '16px 0', textAlign: 'center', color: '#666' }}>
          暂无数据
        </div>
      );
    }

    // 确保field存在且有有效值
    const validData = data.filter((item: any) => item && item[field] !== undefined && !isNaN(item[field]));
    if (validData.length === 0) {
      return (
        <div style={{ padding: '16px 0', textAlign: 'center', color: '#666' }}>
          暂无{field}数据
        </div>
      );
    }

    const minValue = Math.min(...validData.map((d: any) => d[field]));
    const maxValue = Math.max(...validData.map((d: any) => d[field]));
    const range = maxValue - minValue;

    return (
      <div style={{ padding: '16px 0' }}>
        <div style={{ height: 200, position: 'relative', background: '#fafafa', borderRadius: 8 }}>
          <svg width="100%" height="100%" style={{ position: 'absolute' }}>
            {validData.map((item: any, index: number) => {
              if (index === 0) return null;
              const prevItem = validData[index - 1];
              const x1 = ((index - 1) / (validData.length - 1)) * 100;
              const x2 = (index / (validData.length - 1)) * 100;
              const y1 = 100 - ((prevItem[field] - minValue) / range) * 80;
              const y2 = 100 - ((item[field] - minValue) / range) * 80;
              
              return (
                <line
                  key={index}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke={color}
                  strokeWidth="2"
                />
              );
            })}
            {validData.map((item: any, index: number) => {
              const x = (index / (validData.length - 1)) * 100;
              const y = 100 - ((item[field] - minValue) / range) * 80;
              
              return (
                <circle
                  key={index}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="3"
                  fill={color}
                />
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  // AI分析报告导出功能
  const handleExport = (format: string) => {
    message.success(`正在导出${format}格式AI分析报告...`);
    setIsExportModalVisible(false);
  };

  // AI数据质量分析
  const qualityMetrics = [
    { name: '视频数据完整性', value: 98.5, status: 'good' },
    { name: 'AI识别准确率', value: 96.2, status: 'good' },
    { name: '实时处理能力', value: 99.1, status: 'excellent' },
    { name: '预测模型一致性', value: 94.8, status: 'good' },
    { name: '异常检测精度', value: 1.3, status: 'warning' }
  ];

  // AI异常检测数据
  const anomalyData = [
    { time: '14:30:15', type: 'peopleFlow', value: 45.2, threshold: 40, severity: 'high' },
    { time: '14:25:10', type: 'deviceFault', value: 95.8, threshold: 90, severity: 'medium' },
    { time: '14:20:05', type: 'securityRisk', value: 195.3, threshold: 200, severity: 'low' }
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <div>
            <h2 style={{ margin: 0, color: '#1890FF' }}>AI智能数据分析平台</h2>
            <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '14px' }}>
              运用AI机器学习模型，针对曲阜夫子城酒店管理有限公司的视频及各类数据深度挖掘，自动生成人员流量、设备运行等趋势预测图表和异常模式报告，为济宁市统一视频监控下的数字化、可视化管理决策提供智能化支持
            </p>
          </div>
                  <Space>
            <span>AI自动刷新:</span>
            <Switch checked={autoRefresh} onChange={setAutoRefresh} />
            <Select 
              value={refreshInterval} 
              onChange={setRefreshInterval}
              style={{ width: 80 }}
              size="small"
            >
              <Option value={5}>5s</Option>
              <Option value={10}>10s</Option>
              <Option value={30}>30s</Option>
            </Select>
            <Button 
              type="primary" 
              icon={<ReloadOutlined />}
              onClick={() => message.success('AI数据已刷新')}
            >
              刷新
            </Button>
          </Space>
      </div>

      {/* 核心指标概览 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="视频数据量"
              value={metrics.totalRecords}
              suffix="条"
              valueStyle={{ color: '#3f8600' }}
              prefix={<BarChartOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="green">
                <RiseOutlined /> +{Math.floor(Math.random() * 10 + 5)}%
              </Tag>
              <span style={{ fontSize: 12, color: '#666' }}>较昨日</span>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="人员流量"
              value={metrics.peopleFlow}
              suffix="人/小时"
              precision={0}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ThunderboltOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <Progress 
                percent={Math.min(((metrics.peopleFlow || 0) / 200) * 100, 100)} 
                size="small"
                strokeColor="#cf1322"
                showInfo={false}
              />
              <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>AI预测客流趋势</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="设备效率"
              value={metrics.deviceEfficiency}
              suffix="%"
              precision={1}
              valueStyle={{ color: '#1890ff' }}
              prefix={<CloudOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <Progress 
                percent={metrics.deviceEfficiency || 0} 
                size="small"
                strokeColor="#1890ff"
                showInfo={false}
              />
              <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>AI监控运行状态</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="AI预测准确率"
              value={metrics.predictionAccuracy}
              suffix="%"
              precision={1}
              valueStyle={{ color: '#722ed1' }}
              prefix={<CheckCircleOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <Badge 
                status={(metrics.predictionAccuracy || 0) > 90 ? 'success' : 'warning'} 
                text={(metrics.predictionAccuracy || 0) > 90 ? '优秀' : '良好'}
              />
              <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>机器学习模型精度</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 异常告警 */}
      {(metrics.anomalyCount || 0) > 0 && (
        <Alert
          message={`AI检测到 ${metrics.anomalyCount || 0} 个异常模式`}
          description="包括客流高峰预警、设备故障预警、安全风险检测、能耗异常等，建议立即查看AI分析报告"
          type="warning"
          showIcon
          closable
          style={{ marginBottom: 24 }}
          action={
            <Button size="small" type="primary" onClick={() => setActiveTab('anomaly')}>
              查看AI报告
            </Button>
          }
        />
      )}

      {/* 主要分析面板 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={<span><DashboardOutlined />AI分析概览</span>} key="overview">
      <Row gutter={16}>
              <Col span={16}>
                <Card title="AI预测趋势分析" size="small">
                  <div style={{ marginBottom: 16 }}>
                    <Space>
                      <Radio.Group 
                        value={selectedMetric} 
                        onChange={(e) => setSelectedMetric(e.target.value)}
                        size="small"
                      >
                        <Radio.Button value="peopleFlow">人员流量</Radio.Button>
                        <Radio.Button value="deviceEfficiency">设备效率</Radio.Button>
                        <Radio.Button value="securityRisk">安全风险</Radio.Button>
                        <Radio.Button value="energyConsumption">能耗分析</Radio.Button>
                      </Radio.Group>
                      <RangePicker 
                        size="small"
                        onChange={setDateRange}
                      />
                    </Space>
              </div>
                  <TrendChart 
                    data={trendData} 
                    field={selectedMetric}
                    color={
                      selectedMetric === 'peopleFlow' ? '#ff4d4f' :
                      selectedMetric === 'deviceEfficiency' ? '#1890ff' :
                      selectedMetric === 'securityRisk' ? '#52c41a' : '#faad14'
                    }
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card title="AI分析分布" size="small">
                  <BarChart 
                    data={[
                      { name: '视频数据', value: Math.floor((metrics.totalRecords || 0) * 0.45) },
                      { name: '传感器数据', value: Math.floor((metrics.totalRecords || 0) * 0.30) },
                      { name: '设备数据', value: Math.floor((metrics.totalRecords || 0) * 0.20) },
                      { name: '其他数据', value: Math.floor((metrics.totalRecords || 0) * 0.05) }
                    ]}
                    title="AI分析数据类型分布"
                    color="#1890ff"
                  />
                  <div style={{ fontSize: 12, color: '#666', textAlign: 'center', marginTop: 8 }}>
                    基于机器学习的数据分类分析
                  </div>
          </Card>
        </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Card title="AI模型状态" size="small">
                  <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                        {Math.floor(Math.random() * 5 + 8)}
                      </div>
                      <div style={{ fontSize: 12, color: '#666' }}>运行中模型</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>
                        {Math.floor(Math.random() * 3 + 2)}
                      </div>
                      <div style={{ fontSize: 12, color: '#666' }}>训练中模型</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ff4d4f' }}>
                        {Math.floor(Math.random() * 2 + 1)}
                      </div>
                      <div style={{ fontSize: 12, color: '#666' }}>待优化模型</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: '#666', textAlign: 'center', marginTop: 8 }}>
                    深度学习模型实时监控
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="AI预测统计" size="small">
                  <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                        {Math.floor(Math.random() * 20 + 80)}%
                      </div>
                      <div style={{ fontSize: 12, color: '#666' }}>预测准确率</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}>
                        {Math.floor(Math.random() * 10 + 15)}
                      </div>
                      <div style={{ fontSize: 12, color: '#666' }}>异常检测</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 'bold', color: '#eb2f96' }}>
                        {Math.floor(Math.random() * 5 + 8)}
                      </div>
                      <div style={{ fontSize: 12, color: '#666' }}>智能预警</div>
              </div>
            </div>
                  <div style={{ fontSize: 12, color: '#666', textAlign: 'center', marginTop: 8 }}>
                    基于历史数据的智能预测分析
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>
            
          <TabPane tab={<span><AreaChartOutlined />AI实时监控</span>} key="realtime">
            <Row gutter={16}>
              <Col span={16}>
                                <Card title="AI实时数据流" size="small">
              <div style={{ marginBottom: 16 }}>
                    <Space>
                      <Search
                        placeholder="搜索AI分析数据或模型"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 200 }}
                        size="small"
                      />
                      <Select
                        value={filterType}
                        onChange={setFilterType}
                        style={{ width: 120 }}
                        size="small"
                      >
                        <Option value="all">全部</Option>
                        <Option value="normal">正常</Option>
                        <Option value="anomaly">异常</Option>
                        <Option value="prediction">预测</Option>
                      </Select>
                    </Space>
                  </div>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                    实时监控AI模型运行状态和预测结果
                  </div>
                  <div style={{ height: 400, overflowY: 'auto' }}>
                    <Timeline>
                      {realtimeData
                        .filter(item => filterType === 'all' || item.status === filterType)
                        .filter(item => 
                          searchText === '' || 
                          item.deviceId.includes(searchText) ||
                          item.time.includes(searchText)
                        )
                        .map((item, index) => (
                          <Timeline.Item
                            key={index}
                            color={item.status === 'normal' ? 'green' : 'red'}
                            dot={item.status === 'anomaly' ? <WarningOutlined /> : undefined}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <span style={{ fontWeight: 'bold' }}>{item.time}</span>
                                <span style={{ marginLeft: 8, color: '#666' }}>{item.deviceId}</span>
                              </div>
                              <div>
                                <Tag>流量: {item.peopleFlow?.toFixed(0) || '0'}人</Tag>
                                <Tag color="blue">效率: {item.deviceEfficiency?.toFixed(1) || '0.0'}%</Tag>
                                <Tag color="green">风险: {item.securityRisk?.toFixed(1) || '0.0'}</Tag>
              </div>
            </div>
                          </Timeline.Item>
                        ))}
                    </Timeline>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="AI系统监控" size="small">
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>AI计算资源</span>
                      <span>65%</span>
                    </div>
                    <Progress percent={65} size="small" status="active" />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>模型内存占用</span>
                      <span>72%</span>
                    </div>
                    <Progress percent={72} size="small" />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>数据存储使用</span>
                      <span>45%</span>
                    </div>
                    <Progress percent={45} size="small" />
                  </div>
            <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>AI响应延迟</span>
                      <span>12ms</span>
              </div>
                    <Progress percent={12} size="small" strokeColor="#52c41a" />
            </div>
                  
                  <Divider />

            <div style={{ marginBottom: 16 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 8 }}>AI连接状态</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span>活跃连接</span>
                      <Badge status="success" text={metrics.realtimeConnections?.toString() || '0'} />
              </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span>数据流量</span>
                      <span>1.2 MB/s</span>
            </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span>处理队列</span>
                      <span>28 条</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
          </TabPane>

          <TabPane tab={<span><PieChartOutlined />AI数据质量</span>} key="quality">
            <Row gutter={16}>
        <Col span={12}>
                <Card title="质量指标" size="small">
                  {qualityMetrics.map((metric, index) => (
                    <div key={index} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span>{metric.name}</span>
                        <span style={{ fontWeight: 'bold' }}>
                          {metric.value.toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        percent={metric.value} 
                        size="small"
                        strokeColor={
                          metric.status === 'excellent' ? '#52c41a' :
                          metric.status === 'good' ? '#1890ff' :
                          metric.status === 'warning' ? '#faad14' : '#ff4d4f'
                        }
                        showInfo={false}
            />
                    </div>
                  ))}
          </Card>
        </Col>
        <Col span={12}>
                <Card title="AI质量评估" size="small">
                  <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div style={{ fontSize: 48, fontWeight: 'bold', color: '#52c41a' }}>
                      {metrics.qualityScore?.toFixed(1) || '0.0'}
                    </div>
                    <div style={{ fontSize: 16, color: '#666' }}>AI分析质量评分</div>
                    <div style={{ marginTop: 8 }}>
                      <Tag color="green" style={{ fontSize: 14 }}>优秀</Tag>
                    </div>
                  </div>
                  
                  <div style={{ background: '#fafafa', padding: 16, borderRadius: 8 }}>
                    <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 'bold' }}>
                      AI优化建议
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12 }}>
                      <li>优化视频识别算法精度</li>
                      <li>增强异常模式检测能力</li>
                      <li>提升预测模型准确性</li>
                      <li>完善智能预警机制</li>
                    </ul>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab={<span><AlertOutlined />AI异常检测</span>} key="anomaly">
            <Row gutter={16}>
              <Col span={24}>
                <Card title="AI异常事件检测" size="small">
                  <Table
                    dataSource={anomalyData}
                    columns={[
                      {
                        title: '时间',
                        dataIndex: 'time',
                        key: 'time',
                        width: 120
                      },
                      {
                        title: '数据类型',
                        dataIndex: 'type',
                        key: 'type',
                        width: 120,
                        render: (type) => {
                          const config = {
                            peopleFlow: { color: 'red', text: '人员流量' },
                            deviceFault: { color: 'blue', text: '设备故障' },
                            securityRisk: { color: 'green', text: '安全风险' }
                          };
                          return <Tag color={config[type as keyof typeof config].color}>
                            {config[type as keyof typeof config].text}
                          </Tag>;
                        }
                      },
                      {
                        title: '异常值',
                        dataIndex: 'value',
                        key: 'value',
                        width: 100,
                        render: (value) => (
                          <span style={{ fontWeight: 'bold', color: '#ff4d4f' }}>
                            {value}
                          </span>
                        )
                      },
                      {
                        title: '阈值',
                        dataIndex: 'threshold',
                        key: 'threshold',
                        width: 100
                      },
                      {
                        title: '严重程度',
                        dataIndex: 'severity',
                        key: 'severity',
                        width: 120,
                        render: (severity) => {
                          const config = {
                            high: { color: 'red', text: '高' },
                            medium: { color: 'orange', text: '中' },
                            low: { color: 'yellow', text: '低' }
                          };
                          return <Tag color={config[severity as keyof typeof config].color}>
                            {config[severity as keyof typeof config].text}
                          </Tag>;
                        }
                      },
                      {
                        title: '操作',
                        key: 'action',
                        render: () => (
                          <Space>
                            <Button size="small" type="primary">处理</Button>
                            <Button size="small">忽略</Button>
                          </Space>
                        )
                      }
                    ]}
                    pagination={false}
                    size="small"
            />
          </Card>
        </Col>
      </Row>
          </TabPane>

          <TabPane tab={<span><FileTextOutlined />AI报告导出</span>} key="export">
            <Row gutter={16}>
              <Col span={24}>
                <Card title="AI报告导出设置" size="small">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space size="large">
                      <div>
                        <span style={{ marginRight: 8 }}>AI数据类型:</span>
                        <Select defaultValue="all" style={{ width: 120 }}>
                          <Option value="all">全部数据</Option>
                          <Option value="video">视频数据</Option>
                          <Option value="sensor">传感器数据</Option>
                          <Option value="device">设备数据</Option>
                        </Select>
                      </div>
                      <div>
                        <span style={{ marginRight: 8 }}>分析时间:</span>
                        <RangePicker />
                      </div>
                      <div>
                        <span style={{ marginRight: 8 }}>报告格式:</span>
                        <Select defaultValue="excel" style={{ width: 120 }}>
                          <Option value="excel">Excel报告</Option>
                          <Option value="csv">CSV数据</Option>
                          <Option value="json">JSON格式</Option>
                          <Option value="pdf">AI分析报告</Option>
                        </Select>
                      </div>
                    </Space>
                    <Button 
                      type="primary" 
                      icon={<ExportOutlined />}
                      onClick={() => setIsExportModalVisible(true)}
                    >
                      导出AI报告
                    </Button>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* 导出确认模态框 */}
      <Modal
        title="AI分析报告导出"
        visible={isExportModalVisible}
        onCancel={() => setIsExportModalVisible(false)}
        footer={null}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: 24 }}>
            <FileTextOutlined style={{ fontSize: 48, color: '#1890ff' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <p>确认导出AI分析报告？</p>
            <p style={{ color: '#666', fontSize: 12 }}>
              包含人员流量预测、设备运行趋势、异常模式检测等AI分析结果
            </p>
          </div>
          <Space>
            <Button onClick={() => setIsExportModalVisible(false)}>
              取消
            </Button>
            <Button 
              type="primary" 
              onClick={() => handleExport('excel')}
            >
              确认导出
            </Button>
          </Space>
        </div>
      </Modal>
    </div>
  );
};

export default DataAnalysis; 