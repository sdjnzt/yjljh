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
  Alert,
  InputNumber,
  Upload,
} from 'antd';
import {
  DatabaseOutlined,
  PlusOutlined,
  MinusOutlined,
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
  ShoppingCartOutlined,
  TruckOutlined,
  WarningOutlined,
  FileTextOutlined,
  BarChartOutlined,
  ReloadOutlined,
  UploadOutlined,
  StarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  barcode: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  price: number;
  supplier: string;
  location: string;
  status: 'normal' | 'low' | 'out' | 'overstock';
  lastUpdated: string;
  expiryDate?: string;
  description: string;
}

interface Transaction {
  id: string;
  type: 'in' | 'out' | 'adjustment';
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  price: number;
  totalAmount: number;
  operator: string;
  date: string;
  reference: string;
  notes?: string;
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  category: string;
  categories: string[];  // 添加categories字段
  status: 'active' | 'inactive';
  rating: number;
  lastOrder: string;
  totalOrders: number;
}

// 商品分类配置
const ITEM_CATEGORIES = {
  ROOM_SUPPLIES: {
    name: '客房用品',
    items: [
      { name: '毛巾', unit: '条', minStock: 500, maxStock: 2000, basePrice: 15.5 },
      { name: '浴巾', unit: '条', minStock: 300, maxStock: 1000, basePrice: 35.0 },
      { name: '床单', unit: '套', minStock: 200, maxStock: 600, basePrice: 45.0 },
      { name: '枕套', unit: '个', minStock: 200, maxStock: 600, basePrice: 12.0 },
      { name: '被套', unit: '套', minStock: 200, maxStock: 600, basePrice: 65.0 },
      { name: '浴袍', unit: '件', minStock: 100, maxStock: 300, basePrice: 88.0 },
      { name: '拖鞋', unit: '双', minStock: 1000, maxStock: 3000, basePrice: 3.5 }
    ]
  },
  TOILETRIES: {
    name: '洗护用品',
    items: [
      { name: '洗发水', unit: '瓶', minStock: 500, maxStock: 1500, basePrice: 8.5 },
      { name: '沐浴露', unit: '瓶', minStock: 500, maxStock: 1500, basePrice: 8.5 },
      { name: '牙刷', unit: '支', minStock: 1000, maxStock: 3000, basePrice: 2.5 },
      { name: '牙膏', unit: '支', minStock: 1000, maxStock: 3000, basePrice: 3.5 },
      { name: '香皂', unit: '块', minStock: 1000, maxStock: 3000, basePrice: 2.0 },
      { name: '梳子', unit: '把', minStock: 500, maxStock: 1500, basePrice: 1.5 },
      { name: '浴帽', unit: '个', minStock: 1000, maxStock: 3000, basePrice: 0.5 }
    ]
  },
  CLEANING: {
    name: '清洁用品',
    items: [
      { name: '地毯清洁剂', unit: '瓶', minStock: 50, maxStock: 150, basePrice: 35.0 },
      { name: '玻璃清洁剂', unit: '瓶', minStock: 100, maxStock: 300, basePrice: 12.5 },
      { name: '消毒液', unit: '瓶', minStock: 200, maxStock: 600, basePrice: 18.0 },
      { name: '洁厕剂', unit: '瓶', minStock: 100, maxStock: 300, basePrice: 15.0 },
      { name: '空气清新剂', unit: '瓶', minStock: 100, maxStock: 300, basePrice: 22.0 },
      { name: '清洁抹布', unit: '包', minStock: 200, maxStock: 600, basePrice: 8.0 },
      { name: '垃圾袋', unit: '包', minStock: 300, maxStock: 900, basePrice: 5.0 }
    ]
  },
  FOOD_BEVERAGE: {
    name: '餐饮用品',
    items: [
      { name: '咖啡豆', unit: 'kg', minStock: 50, maxStock: 150, basePrice: 85.0 },
      { name: '茶包', unit: '盒', minStock: 100, maxStock: 300, basePrice: 45.0 },
      { name: '矿泉水', unit: '箱', minStock: 200, maxStock: 600, basePrice: 24.0 },
      { name: '一次性餐具', unit: '套', minStock: 1000, maxStock: 3000, basePrice: 1.5 },
      { name: '餐巾纸', unit: '包', minStock: 500, maxStock: 1500, basePrice: 2.0 },
      { name: '饮料杯', unit: '个', minStock: 1000, maxStock: 3000, basePrice: 0.8 },
      { name: '吸管', unit: '包', minStock: 200, maxStock: 600, basePrice: 3.0 }
    ]
  },
  OFFICE: {
    name: '办公用品',
    items: [
      { name: '打印纸', unit: '包', minStock: 50, maxStock: 150, basePrice: 25.0 },
      { name: '圆珠笔', unit: '盒', minStock: 20, maxStock: 60, basePrice: 15.0 },
      { name: '便签纸', unit: '本', minStock: 100, maxStock: 300, basePrice: 2.5 },
      { name: '订书钉', unit: '盒', minStock: 50, maxStock: 150, basePrice: 3.0 },
      { name: '文件夹', unit: '个', minStock: 100, maxStock: 300, basePrice: 4.0 },
      { name: '复印纸', unit: '箱', minStock: 10, maxStock: 30, basePrice: 180.0 },
      { name: '墨盒', unit: '个', minStock: 10, maxStock: 30, basePrice: 150.0 }
    ]
  }
};

// 供应商配置
const SUPPLIERS = [
    {
      id: '1',
    name: '邹城市优质纺织品有限公司',
      contact: '陈经理',
      phone: '0537-15698752',
      email: 'chen@textile.com',
    address: '山东省济宁市邹城市纺织工业园区A区12号',
    category: '客房用品',
    categories: ['客房用品'],
    baseDiscount: 0.85
    },
    {
      id: '2',
    name: '邹城市洁雅日化有限公司',
      contact: '李总',
      phone: '0537-86956736',
      email: 'li@clean.com',
    address: '山东省济宁市邹城市化工园区B区23号',
    category: '洗护用品',
    categories: ['洗护用品', '清洁用品'],
    baseDiscount: 0.88
    },
    {
      id: '3',
    name: '邹城市品味食品有限公司',
      contact: '王经理',
      phone: '0537-15976954',
    email: 'wang@food.com',
    address: '山东省济宁市邹城市食品工业园区C区34号',
    category: '餐饮用品',
    categories: ['餐饮用品'],
    baseDiscount: 0.9
    },
    {
      id: '4',
    name: '邹城市办公伙伴贸易有限公司',
      contact: '赵总',
      phone: '0537-15987536',
    email: 'zhao@office.com',
    address: '山东省济宁市邹城市商贸城D区45号',
    category: '办公用品',
    categories: ['办公用品'],
    baseDiscount: 0.92
  }
];

// 生成更真实的库存数据
function generateInventoryItems(): InventoryItem[] {
  const items: InventoryItem[] = [];
  let id = 1;

  Object.entries(ITEM_CATEGORIES).forEach(([categoryKey, category]) => {
    category.items.forEach(item => {
      // 生成当前库存（在最小和最大库存之间随机）
      const currentStock = Math.floor(
        item.minStock + Math.random() * (item.maxStock - item.minStock)
      );

      // 确定库存状态
      const stockRatio = currentStock / item.maxStock;
      const status: 'normal' | 'low' | 'out' | 'overstock' =
        currentStock === 0 ? 'out' :
        stockRatio < 0.2 ? 'low' :
        stockRatio > 0.9 ? 'overstock' : 'normal';

      // 找到对应的供应商
      const supplier = SUPPLIERS.find(s => s.categories.includes(category.name));

      // 生成SKU和条码
      const sku = `${categoryKey.slice(0, 3)}-${String(id).padStart(3, '0')}`;
      const barcode = `${Math.floor(Math.random() * 900000000 + 100000000)}`;

      // 生成价格（基础价格±10%）
      const price = Number((item.basePrice * (0.9 + Math.random() * 0.2)).toFixed(2));

      // 生成最后更新时间（最近7天内）
      const lastUpdated = dayjs()
        .subtract(Math.floor(Math.random() * 7), 'days')
        .subtract(Math.floor(Math.random() * 24), 'hours')
        .format('YYYY-MM-DD HH:mm');

      // 生成过期时间（如果是消耗品）
      const needsExpiry = ['洗护用品', '清洁用品', '餐饮用品'].includes(category.name);
      const expiryDate = needsExpiry ?
        dayjs().add(Math.floor(Math.random() * 12 + 6), 'months').format('YYYY-MM-DD') :
        undefined;

      items.push({
        id: id.toString(),
        name: item.name,
        category: category.name,
        sku,
        barcode,
        currentStock,
        minStock: item.minStock,
        maxStock: item.maxStock,
        unit: item.unit,
        price,
        supplier: supplier?.name || '未指定',
        location: `${categoryKey.slice(0, 1)}区-${Math.floor(id / 10 + 1).toString().padStart(2, '0')}-${(id % 10 + 1).toString().padStart(2, '0')}`,
        status,
        lastUpdated,
        expiryDate,
        description: `${category.name}类${item.name}，规格：每${item.unit}`
      });

      id++;
    });
  });

  return items;
}

// 生成更真实的交易记录
function generateTransactions(items: InventoryItem[]): Transaction[] {
  const transactions: Transaction[] = [];
  let id = 1;

  // 生成最近30天的交易记录
  for (let i = 30; i >= 0; i--) {
    const date = dayjs().subtract(i, 'days');
    
    // 每天生成2-5条记录
    const dailyTransactions = Math.floor(Math.random() * 4 + 2);
    
    for (let j = 0; j < dailyTransactions; j++) {
      // 随机选择一个商品
      const item = items[Math.floor(Math.random() * items.length)];
      
      // 生成交易类型（入库概率较小）
      const type: 'in' | 'out' | 'adjustment' = 
        Math.random() > 0.8 ? 'in' :
        Math.random() > 0.1 ? 'out' : 'adjustment';

      // 生成数量（入库量较大，出库量较小）
      const quantity = type === 'in' ?
        Math.floor(item.maxStock * (0.3 + Math.random() * 0.3)) :
        Math.floor(item.minStock * (0.1 + Math.random() * 0.2));

      // 生成操作员
      const operators = {
        in: ['张库管', '李库管', '王库管'],
        out: ['赵服务员', '钱服务员', '孙服务员'],
        adjustment: ['刘主管', '周主管']
      };
      const operator = operators[type][Math.floor(Math.random() * operators[type].length)];

      // 生成参考号
      const refPrefix = {
        in: 'PO',
        out: 'REQ',
        adjustment: 'ADJ'
      };
      const reference = `${refPrefix[type]}-${dayjs().format('YYYYMM')}-${String(id).padStart(3, '0')}`;

      // 生成备注
      const notes = {
        in: ['正常补货', '紧急补货', '批量采购'],
        out: ['客房补充', '餐厅领用', '会议室准备'],
        adjustment: ['盘点调整', '损耗记录', '质量问题']
      };
      const note = notes[type][Math.floor(Math.random() * notes[type].length)];

      transactions.push({
        id: id.toString(),
        type,
        itemId: item.id,
        itemName: item.name,
        quantity,
        unit: item.unit,
        price: item.price,
        totalAmount: Number((quantity * item.price).toFixed(2)),
        operator,
        date: date.add(Math.floor(Math.random() * 24), 'hours').format('YYYY-MM-DD HH:mm'),
        reference,
        notes: note
      });

      id++;
    }
  }

  return transactions.sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix());
}

// 生成更真实的供应商数据
function generateSuppliers(): Supplier[] {
  return SUPPLIERS.map(supplier => {
    // 生成订单数量（基于供应商折扣）
    const totalOrders = Math.floor((1 - supplier.baseDiscount) * 1000);
    
    // 生成最后订单日期（最近7天内）
    const lastOrder = dayjs()
      .subtract(Math.floor(Math.random() * 7), 'days')
      .format('YYYY-MM-DD');

    // 生成评分（基于折扣）
    const rating = Number((4 + (1 - supplier.baseDiscount) * 10).toFixed(1));

    return {
      id: supplier.id,
      name: supplier.name,
      contact: supplier.contact,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      category: supplier.category,
      categories: supplier.categories, // 确保categories字段存在
      status: Math.random() > 0.1 ? 'active' : 'inactive',
      rating,
      lastOrder,
      totalOrders
    };
  });
}

const InventoryManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [inModalVisible, setInModalVisible] = useState(false);
  const [outModalVisible, setOutModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  const [activeTab, setActiveTab] = useState('inventory');
  const [addSupplierModalVisible, setAddSupplierModalVisible] = useState(false);
  const [supplierForm] = Form.useForm();
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [itemForm] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [addTransactionModalVisible, setAddTransactionModalVisible] = useState(false);
  const [transactionForm] = Form.useForm();
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    // 生成数据
    const itemData = generateInventoryItems();
    const transactionData = generateTransactions(itemData);
    const supplierData = generateSuppliers();

    setInventoryItems(itemData);
    setTransactions(transactionData);
    setSuppliers(supplierData);
      setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
      case 'active':
        return 'green';
      case 'low':
        return 'orange';
      case 'out':
      case 'inactive':
        return 'red';
      case 'overstock':
        return 'purple';
      case 'in':
        return 'blue';
      case 'out':
        return 'red';
      case 'adjustment':
        return 'gold';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return '正常';
      case 'low':
        return '库存不足';
      case 'out':
        return '缺货';
      case 'overstock':
        return '库存过多';
      case 'active':
        return '活跃';
      case 'inactive':
        return '停用';
      case 'in':
        return '入库';
      case 'adjustment':
        return '调整';
      default:
        return '未知';
    }
  };

  const inventoryColumns = [
    {
      title: '商品信息',
      key: 'info',
      render: (_: any, record: InventoryItem) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong>{record.name}</Text>
            <Tag color="blue" style={{ marginLeft: 8 }}>{record.category}</Tag>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            SKU: {record.sku} | 条码: {record.barcode}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            位置: {record.location}
          </div>
        </Space>
      ),
    },
    {
      title: '库存状态',
      key: 'stock',
      render: (_: any, record: InventoryItem) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong style={{ fontSize: '16px' }}>
              {record.currentStock} {record.unit}
            </Text>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            最小: {record.minStock} | 最大: {record.maxStock}
          </div>
          <Progress
            percent={Math.round((record.currentStock / record.maxStock) * 100)}
            size="small"
            status={record.status === 'low' ? 'exception' : record.status === 'out' ? 'exception' : 'normal'}
          />
        </Space>
      ),
    },
    {
      title: '状态',
      key: 'status',
      render: (_: any, record: InventoryItem) => (
        <Space direction="vertical" size="small">
          <Badge
            status={getStatusColor(record.status) as any}
            text={getStatusText(record.status)}
          />
          {record.expiryDate && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              过期: {record.expiryDate}
            </div>
          )}
        </Space>
      ),
    },
    {
      title: '价格信息',
      key: 'price',
      render: (_: any, record: InventoryItem) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong style={{ color: '#1890ff' }}>
              ¥{record.price.toFixed(2)}
            </Text>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            总价值: ¥{(record.currentStock * record.price).toFixed(2)}
          </div>
        </Space>
      ),
    },
    {
      title: '供应商',
      key: 'supplier',
      render: (_: any, record: InventoryItem) => (
        <Text>{record.supplier}</Text>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: InventoryItem) => (
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
            icon={<PlusOutlined />}
            onClick={() => handleInStock(record)}
          >
            入库
          </Button>
          <Button
            type="link"
            size="small"
            icon={<MinusOutlined />}
            onClick={() => handleOutStock(record)}
          >
            出库
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  const transactionColumns = [
    {
      title: '交易信息',
      key: 'transaction',
      render: (_: any, record: Transaction) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong>{record.itemName}</Text>
            <Tag color={getStatusColor(record.type)} style={{ marginLeft: 8 }}>
              {getStatusText(record.type)}
            </Tag>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            数量: {record.quantity} {record.unit}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            参考号: {record.reference}
          </div>
        </Space>
      ),
    },
    {
      title: '金额',
      key: 'amount',
      render: (_: any, record: Transaction) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong style={{ color: '#1890ff' }}>
              ¥{record.totalAmount.toFixed(2)}
            </Text>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            单价: ¥{record.price.toFixed(2)}
          </div>
        </Space>
      ),
    },
    {
      title: '操作员',
      key: 'operator',
      render: (_: any, record: Transaction) => (
        <Text>{record.operator}</Text>
      ),
    },
    {
      title: '时间',
      key: 'date',
      render: (_: any, record: Transaction) => (
        <Text>{record.date}</Text>
      ),
    },
    {
      title: '备注',
      key: 'notes',
      render: (_: any, record: Transaction) => (
        <Text type="secondary">{record.notes || '-'}</Text>
      ),
    },
  ];

  const supplierColumns = [
    {
      title: '供应商信息',
      key: 'info',
      render: (_: any, record: Supplier) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong>{record.name}</Text>
            <Tag color="blue" style={{ marginLeft: 8 }}>{record.category}</Tag>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            联系人: {record.contact}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.phone} | {record.email}
          </div>
        </Space>
      ),
    },
    {
      title: '状态',
      key: 'status',
      render: (_: any, record: Supplier) => (
        <Space direction="vertical" size="small">
          <Badge
            status={getStatusColor(record.status) as any}
            text={getStatusText(record.status)}
          />
          <div style={{ fontSize: '12px', color: '#666' }}>
            评分: <StarOutlined style={{ color: '#faad14' }} /> {record.rating}
          </div>
        </Space>
      ),
    },
    {
      title: '订单信息',
      key: 'orders',
      render: (_: any, record: Supplier) => (
        <Space direction="vertical" size="small">
          <div>总订单: {record.totalOrders}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            最后订单: {record.lastOrder}
          </div>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Supplier) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewSupplier(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditSupplier(record)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewDetails = (record: InventoryItem) => {
    setCurrentItem(record);
    setDetailsModalVisible(true);
  };

  const handleEdit = (record: InventoryItem) => {
    setCurrentItem(record);
    setEditModalVisible(true);
  };

  const handleInStock = (record: InventoryItem) => {
    setCurrentItem(record);
    setInModalVisible(true);
  };

  const handleOutStock = (record: InventoryItem) => {
    setCurrentItem(record);
    setOutModalVisible(true);
  };

  const handleViewSupplier = (record: Supplier) => {
    message.info('查看供应商详情');
  };

  const handleEditSupplier = (record: Supplier) => {
    message.info('编辑供应商信息');
  };

  const handleExport = () => {
    message.success('数据导出成功');
  };

  const handleImport = () => {
    message.info('数据导入功能开发中...');
  };

  // 处理新增供应商
  const handleAddSupplier = (values: any) => {
    const newSupplier: Supplier = {
      id: `SUP${dayjs().format('YYMMDDHHmmss')}`,
      name: values.name,
      contact: values.contact,
      phone: values.phone,
      email: values.email,
      address: values.address,
      category: values.category,
      categories: [values.category],
      status: 'active',
      rating: 5.0,
      lastOrder: dayjs().format('YYYY-MM-DD'),
      totalOrders: 0
    };

    setSuppliers([newSupplier, ...suppliers]);
    message.success('供应商添加成功');
    setAddSupplierModalVisible(false);
    supplierForm.resetFields();
  };

  // 处理新增商品
  const handleAddItem = (values: any) => {
    const categoryKey = Object.keys(ITEM_CATEGORIES).find(
      key => ITEM_CATEGORIES[key as keyof typeof ITEM_CATEGORIES].name === values.category
    );

    if (!categoryKey) {
      message.error('无效的商品类别');
      return;
    }

    const category = ITEM_CATEGORIES[categoryKey as keyof typeof ITEM_CATEGORIES];
    const supplier = SUPPLIERS.find(s => s.name === values.supplier);

    const newItem: InventoryItem = {
      id: `ITEM${dayjs().format('YYMMDDHHmmss')}`,
      name: values.name,
      category: values.category,
      sku: `${values.category.slice(0, 3)}-${dayjs().format('MMDD')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      barcode: Math.floor(Math.random() * 9000000000000 + 1000000000000).toString(),
      currentStock: values.currentStock,
      minStock: values.minStock,
      maxStock: values.maxStock,
      unit: values.unit,
      price: values.price,
      supplier: values.supplier,
      location: values.location,
      status: values.currentStock === 0 ? 'out' :
        values.currentStock < values.minStock ? 'low' :
        values.currentStock > values.maxStock ? 'overstock' : 'normal',
      lastUpdated: dayjs().format('YYYY-MM-DD HH:mm'),
      expiryDate: values.expiryDate ? dayjs(values.expiryDate).format('YYYY-MM-DD') : undefined,
      description: values.description
    };

    setInventoryItems([newItem, ...inventoryItems]);
    message.success('商品添加成功');
    setAddItemModalVisible(false);
    itemForm.resetFields();
  };

  // 处理新增记录
  const handleAddTransaction = (values: any) => {
    const item = inventoryItems.find(i => i.id === values.itemId);
    if (!item) {
      message.error('商品不存在');
      return;
    }

    // 计算总金额
    const totalAmount = Number((values.quantity * values.price).toFixed(2));

    const newTransaction: Transaction = {
      id: `TR${dayjs().format('YYMMDDHHmmss')}`,
      type: values.type,
      itemId: values.itemId,
      itemName: item.name,
      quantity: values.quantity,
      unit: item.unit,
      price: values.price,
      totalAmount,
      operator: values.operator,
      date: dayjs().format('YYYY-MM-DD HH:mm'),
      reference: values.reference,
      notes: values.notes
    };

    // 更新库存
    const newStock = values.type === 'in' 
      ? item.currentStock + values.quantity
      : item.currentStock - values.quantity;

    if (values.type === 'out' && newStock < 0) {
      message.error('库存不足，无法出库');
      return;
    }

    // 更新商品库存和状态
    const updatedItem = {
      ...item,
      currentStock: newStock,
      status: newStock === 0 ? 'out' as const :
        newStock < item.minStock ? 'low' as const :
        newStock > item.maxStock ? 'overstock' as const : 'normal' as const,
      lastUpdated: dayjs().format('YYYY-MM-DD HH:mm')
    };

    setInventoryItems(
      inventoryItems.map(i => i.id === item.id ? updatedItem : i)
    );
    setTransactions([newTransaction, ...transactions]);
    
    message.success('记录添加成功');
    setAddTransactionModalVisible(false);
    transactionForm.resetFields();
    setSelectedItem(null);
  };

  // 处理商品选择变更
  const handleItemSelect = (itemId: string) => {
    const item = inventoryItems.find(i => i.id === itemId);
    setSelectedItem(item || null);
    if (item) {
      transactionForm.setFieldsValue({
        price: item.price,
        unit: item.unit
      });
    }
  };

  // 根据选择的类别获取建议的库存范围
  const getStockSuggestion = (categoryName: string) => {
    const category = Object.values(ITEM_CATEGORIES).find(cat => cat.name === categoryName);
    if (category) {
      const item = category.items.find(item => item.name === itemForm.getFieldValue('name'));
      if (item) {
        return {
          minStock: item.minStock,
          maxStock: item.maxStock,
          basePrice: item.basePrice,
          unit: item.unit
        };
      }
    }
    return null;
  };

  // 处理类别变更
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    itemForm.setFieldsValue({
      name: undefined,
      unit: undefined,
      minStock: undefined,
      maxStock: undefined,
      price: undefined,
      supplier: undefined
    });
  };

  // 处理商品名称变更
  const handleNameChange = (value: string) => {
    const suggestion = getStockSuggestion(itemForm.getFieldValue('category'));
    if (suggestion) {
      itemForm.setFieldsValue({
        unit: suggestion.unit,
        minStock: suggestion.minStock,
        maxStock: suggestion.maxStock,
        price: suggestion.basePrice
      });
    }
  };

  // 统计数据
  const totalItems = inventoryItems.length;
  const normalItems = inventoryItems.filter(item => item.status === 'normal').length;
  const lowItems = inventoryItems.filter(item => item.status === 'low').length;
  const outItems = inventoryItems.filter(item => item.status === 'out').length;
  const overstockItems = inventoryItems.filter(item => item.status === 'overstock').length;
  const totalValue = Number(inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.price), 0).toFixed(2));
  const activeSuppliers = suppliers.filter(supplier => supplier.status === 'active').length;

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <DatabaseOutlined style={{ marginRight: 8 }} />
        库存管理
      </Title>

      {/* 库存预警 */}
      {(lowItems > 0 || outItems > 0) && (
        <Alert
          message="库存预警"
          description={`有 ${lowItems} 个商品库存不足，${outItems} 个商品缺货，请及时补货！`}
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
          action={
            <Button size="small" type="link">
              查看详情
            </Button>
          }
        />
      )}

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="商品总数"
              value={totalItems}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="库存正常"
              value={normalItems}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="库存不足"
              value={lowItems}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="缺货商品"
              value={outItems}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="库存总值"
              value={totalValue}
              prefix="¥"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="活跃供应商"
              value={activeSuppliers}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="库存管理" key="inventory">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setAddItemModalVisible(true)}
                >
                  新增商品
                </Button>
                <Button icon={<ExportOutlined />} onClick={handleExport}>
                  导出数据
                </Button>
                <Button icon={<ImportOutlined />} onClick={handleImport}>
                  导入数据
                </Button>
                <Button icon={<SearchOutlined />}>
                  高级搜索
                </Button>
                <Button icon={<ReloadOutlined />} onClick={loadData}>
                  刷新
                </Button>
              </Space>
            </div>
            <Table
              columns={inventoryColumns}
              dataSource={inventoryItems}
              rowKey="id"
              loading={loading}
              pagination={{
                total: inventoryItems.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          
          <TabPane tab="出入库记录" key="transactions">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setAddTransactionModalVisible(true)}
                >
                  新增记录
                </Button>
                <Button icon={<ExportOutlined />}>
                  导出记录
                </Button>
                <Button icon={<SearchOutlined />}>
                  搜索记录
                </Button>
              </Space>
            </div>
            <Table
              columns={transactionColumns}
              dataSource={transactions}
              rowKey="id"
              loading={loading}
              pagination={{
                total: transactions.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>

          <TabPane tab="供应商管理" key="suppliers">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setAddSupplierModalVisible(true)}
                >
                  新增供应商
                </Button>
                <Button icon={<ExportOutlined />}>
                  导出供应商
                </Button>
                <Button icon={<SearchOutlined />}>
                  搜索供应商
                </Button>
              </Space>
            </div>
            <Table
              columns={supplierColumns}
              dataSource={suppliers}
              rowKey="id"
              loading={loading}
              pagination={{
                total: suppliers.length,
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

      {/* 商品详情模态框 */}
      <Modal
        title="商品详情"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={600}
      >
        {currentItem && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="商品名称">{currentItem.name}</Descriptions.Item>
            <Descriptions.Item label="商品分类">{currentItem.category}</Descriptions.Item>
            <Descriptions.Item label="SKU">{currentItem.sku}</Descriptions.Item>
            <Descriptions.Item label="条码">{currentItem.barcode}</Descriptions.Item>
            <Descriptions.Item label="当前库存">{currentItem.currentStock} {currentItem.unit}</Descriptions.Item>
            <Descriptions.Item label="库存状态">
              <Badge
                status={getStatusColor(currentItem.status) as any}
                text={getStatusText(currentItem.status)}
              />
            </Descriptions.Item>
            <Descriptions.Item label="最小库存">{currentItem.minStock} {currentItem.unit}</Descriptions.Item>
            <Descriptions.Item label="最大库存">{currentItem.maxStock} {currentItem.unit}</Descriptions.Item>
            <Descriptions.Item label="单价">¥{currentItem.price.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="库存总值">¥{(currentItem.currentStock * currentItem.price).toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="供应商">{currentItem.supplier}</Descriptions.Item>
            <Descriptions.Item label="存储位置">{currentItem.location}</Descriptions.Item>
            {currentItem.expiryDate && (
              <Descriptions.Item label="过期日期">{currentItem.expiryDate}</Descriptions.Item>
            )}
            <Descriptions.Item label="最后更新">{currentItem.lastUpdated}</Descriptions.Item>
            <Descriptions.Item label="商品描述" span={2}>
              {currentItem.description}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 编辑商品模态框 */}
      <Modal
        title="编辑商品"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => {
          message.success('商品信息更新成功');
          setEditModalVisible(false);
        }}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="商品名称">
                <Input defaultValue={currentItem?.name} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="商品分类">
                <Select defaultValue={currentItem?.category}>
                  <Option value="客房用品">客房用品</Option>
                  <Option value="洗护用品">洗护用品</Option>
                  <Option value="餐饮用品">餐饮用品</Option>
                  <Option value="清洁用品">清洁用品</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="最小库存">
                <InputNumber style={{ width: '100%' }} defaultValue={currentItem?.minStock} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="最大库存">
                <InputNumber style={{ width: '100%' }} defaultValue={currentItem?.maxStock} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="单价">
                <InputNumber style={{ width: '100%' }} defaultValue={currentItem?.price} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="存储位置">
                <Input defaultValue={currentItem?.location} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="商品描述">
            <TextArea rows={3} defaultValue={currentItem?.description} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 入库模态框 */}
      <Modal
        title="商品入库"
        open={inModalVisible}
        onCancel={() => setInModalVisible(false)}
        onOk={() => {
          message.success('入库成功');
          setInModalVisible(false);
        }}
        width={500}
      >
        <Form layout="vertical">
          <Form.Item label="商品名称">
            <Input value={currentItem?.name} disabled />
          </Form.Item>
          <Form.Item label="入库数量" required>
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
          <Form.Item label="入库价格">
            <InputNumber style={{ width: '100%' }} defaultValue={currentItem?.price} />
          </Form.Item>
          <Form.Item label="参考号">
            <Input placeholder="请输入采购单号或参考号" />
          </Form.Item>
          <Form.Item label="备注">
            <TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 出库模态框 */}
      <Modal
        title="商品出库"
        open={outModalVisible}
        onCancel={() => setOutModalVisible(false)}
        onOk={() => {
          message.success('出库成功');
          setOutModalVisible(false);
        }}
        width={500}
      >
        <Form layout="vertical">
          <Form.Item label="商品名称">
            <Input value={currentItem?.name} disabled />
          </Form.Item>
          <Form.Item label="当前库存">
            <Input value={`${currentItem?.currentStock} ${currentItem?.unit}`} disabled />
          </Form.Item>
          <Form.Item label="出库数量" required>
            <InputNumber style={{ width: '100%' }} min={1} max={currentItem?.currentStock} />
          </Form.Item>
          <Form.Item label="参考号">
            <Input placeholder="请输入领用单号或参考号" />
          </Form.Item>
          <Form.Item label="备注">
            <TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 新增供应商模态框 */}
      <Modal
        title="新增供应商"
        open={addSupplierModalVisible}
        onCancel={() => {
          setAddSupplierModalVisible(false);
          supplierForm.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={supplierForm}
          layout="vertical"
          onFinish={handleAddSupplier}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="供应商名称"
                rules={[
                  { required: true, message: '请输入供应商名称' },
                  { min: 4, message: '名称至少4个字符' },
                  { max: 50, message: '名称最多50个字符' }
                ]}
              >
                <Input placeholder="请输入供应商名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="主营类别"
                rules={[{ required: true, message: '请选择主营类别' }]}
              >
                <Select placeholder="请选择主营类别">
                  {Object.values(ITEM_CATEGORIES).map(category => (
                    <Option key={category.name} value={category.name}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contact"
                label="联系人"
                rules={[
                  { required: true, message: '请输入联系人姓名' },
                  { pattern: /^[\u4e00-\u9fa5]{2,4}$/, message: '请输入2-4个汉字的姓名' }
                ]}
              >
                <Input placeholder="请输入联系人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="联系电话"
                rules={[
                  { required: true, message: '请输入联系电话' },
                  { pattern: /^0\d{2,3}-\d{7,8}$/, message: '请输入正确的座机号码格式，如：0537-12345678' }
                ]}
              >
                <Input placeholder="请输入联系电话（座机）" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="电子邮箱"
                rules={[
                  { required: true, message: '请输入电子邮箱' },
                  { type: 'email', message: '请输入正确的邮箱格式' }
                ]}
              >
                <Input placeholder="请输入电子邮箱" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="mobile"
                label="手机号码"
                rules={[
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码格式' }
                ]}
              >
                <Input placeholder="请输入手机号码（选填）" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="详细地址"
            rules={[
              { required: true, message: '请输入详细地址' },
              { min: 10, message: '地址至少10个字符' },
              { max: 100, message: '地址最多100个字符' }
            ]}
          >
            <Input.TextArea
              placeholder="请输入详细地址，包含省市区街道等信息"
              rows={3}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                确认添加
              </Button>
              <Button onClick={() => {
                setAddSupplierModalVisible(false);
                supplierForm.resetFields();
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 新增商品模态框 */}
      <Modal
        title="新增商品"
        open={addItemModalVisible}
        onCancel={() => {
          setAddItemModalVisible(false);
          itemForm.resetFields();
          setSelectedCategory('');
        }}
        footer={null}
        width={800}
      >
        <Form
          form={itemForm}
          layout="vertical"
          onFinish={handleAddItem}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="商品类别"
                rules={[{ required: true, message: '请选择商品类别' }]}
              >
                <Select
                  placeholder="请选择商品类别"
                  onChange={handleCategoryChange}
                >
                  {Object.values(ITEM_CATEGORIES).map(category => (
                    <Option key={category.name} value={category.name}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="商品名称"
                rules={[{ required: true, message: '请选择商品名称' }]}
              >
                <Select
                  placeholder="请选择商品名称"
                  disabled={!selectedCategory}
                  onChange={handleNameChange}
                >
                  {selectedCategory &&
                    Object.values(ITEM_CATEGORIES)
                      .find(cat => cat.name === selectedCategory)
                      ?.items.map(item => (
                        <Option key={item.name} value={item.name}>
                          {item.name}
                        </Option>
                      ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="currentStock"
                label="当前库存"
                rules={[{ required: true, message: '请输入当前库存' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="请输入当前库存"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="minStock"
                label="最小库存"
                rules={[{ required: true, message: '请输入最小库存' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="请输入最小库存"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="maxStock"
                label="最大库存"
                rules={[{ required: true, message: '请输入最大库存' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="请输入最大库存"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="unit"
                label="计量单位"
                rules={[{ required: true, message: '请输入计量单位' }]}
              >
                <Input placeholder="请输入计量单位" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="price"
                label="单价"
                rules={[{ required: true, message: '请输入单价' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                  prefix="¥"
                  placeholder="请输入单价"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="location"
                label="存储位置"
                rules={[{ required: true, message: '请输入存储位置' }]}
              >
                <Input placeholder="请输入存储位置" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="supplier"
                label="供应商"
                rules={[{ required: true, message: '请选择供应商' }]}
              >
                <Select placeholder="请选择供应商">
                  {suppliers
                    .filter(s => s.status === 'active' && (!selectedCategory || s.categories.includes(selectedCategory)))
                    .map(supplier => (
                      <Option key={supplier.id} value={supplier.name}>
                        {supplier.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="expiryDate"
                label="过期日期"
              >
                <DatePicker
                  style={{ width: '100%' }}
                  disabledDate={current => current && current < dayjs().endOf('day')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="商品描述"
            rules={[{ required: true, message: '请输入商品描述' }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="请输入商品描述"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                确认添加
              </Button>
              <Button onClick={() => {
                setAddItemModalVisible(false);
                itemForm.resetFields();
                setSelectedCategory('');
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 新增记录模态框 */}
      <Modal
        title="新增出入库记录"
        open={addTransactionModalVisible}
        onCancel={() => {
          setAddTransactionModalVisible(false);
          transactionForm.resetFields();
          setSelectedItem(null);
        }}
        footer={null}
        width={800}
      >
        <Form
          form={transactionForm}
          layout="vertical"
          onFinish={handleAddTransaction}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="记录类型"
                rules={[{ required: true, message: '请选择记录类型' }]}
              >
                <Select placeholder="请选择记录类型">
                  <Option value="in">入库</Option>
                  <Option value="out">出库</Option>
                  <Option value="adjustment">库存调整</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="itemId"
                label="商品"
                rules={[{ required: true, message: '请选择商品' }]}
              >
                <Select
                  placeholder="请选择商品"
                  onChange={handleItemSelect}
                  showSearch
                  optionFilterProp="children"
                >
                  {inventoryItems.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.name} ({item.category})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {selectedItem && (
            <Alert
              message="当前库存信息"
              description={
                <div>
                  <p>当前库存：{selectedItem.currentStock} {selectedItem.unit}</p>
                  <p>库存状态：{getStatusText(selectedItem.status)}</p>
                  <p>建议库存范围：{selectedItem.minStock} - {selectedItem.maxStock} {selectedItem.unit}</p>
                </div>
              }
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="quantity"
                label="数量"
                rules={[
                  { required: true, message: '请输入数量' },
                  { type: 'number', min: 0.01, message: '数量必须大于0' }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0.01}
                  precision={2}
                  placeholder="请输入数量"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="price"
                label="单价"
                rules={[
                  { required: true, message: '请输入单价' },
                  { type: 'number', min: 0.01, message: '单价必须大于0' }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0.01}
                  precision={2}
                  prefix="¥"
                  placeholder="请输入单价"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="operator"
                label="操作员"
                rules={[
                  { required: true, message: '请输入操作员姓名' },
                  { pattern: /^[\u4e00-\u9fa5]{2,4}$/, message: '请输入2-4个汉字的姓名' }
                ]}
              >
                <Input placeholder="请输入操作员姓名" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="reference"
                label="参考号"
                rules={[
                  { required: true, message: '请输入参考号' },
                  { pattern: /^(PO|REQ|ADJ)-\d{6}-\d{3}$/, message: '参考号格式：类型-年月-序号，如：REQ-202507-001' }
                ]}
              >
                <Input placeholder="请输入参考号，如：REQ-202507-001" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="notes"
                label="备注"
              >
                <Input.TextArea
                  rows={1}
                  placeholder="请输入备注信息（选填）"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                确认添加
              </Button>
              <Button onClick={() => {
                setAddTransactionModalVisible(false);
                transactionForm.resetFields();
                setSelectedItem(null);
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

export default InventoryManagement; 