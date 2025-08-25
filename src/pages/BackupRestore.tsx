import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Progress,
  message,
  Upload,
  Alert,
  Typography,
  Descriptions,
  Tooltip,
  Popconfirm
} from 'antd';
import {
  CloudUploadOutlined,
  CloudDownloadOutlined,
  DeleteOutlined,
  ReloadOutlined,
  InboxOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { Dragger } = Upload;

interface BackupRecord {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'config';
  size: string;
  createTime: string;
  creator: string;
  status: 'running' | 'success' | 'failed';
  progress?: number;
  path?: string;
  error?: string;
}

const BACKUP_TYPES = {
  full: { name: '全量备份', description: '备份整个系统的所有数据' },
  incremental: { name: '增量备份', description: '仅备份上次备份后的变更数据' },
  config: { name: '配置备份', description: '仅备份系统配置信息' }
};

const BackupRestore: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [backupList, setBackupList] = useState<BackupRecord[]>([]);
  const [createBackupVisible, setCreateBackupVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [currentBackup, setCurrentBackup] = useState<BackupRecord | null>(null);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [restoreModalVisible, setRestoreModalVisible] = useState(false);
  const [restoreInProgress, setRestoreInProgress] = useState(false);
  const [backupForm] = Form.useForm();

  // 生成模拟数据
  const generateMockData = () => {
    const records: BackupRecord[] = Array.from({ length: 10 }, (_, index) => {
      const type = ['full', 'incremental', 'config'][Math.floor(Math.random() * 3)] as 'full' | 'incremental' | 'config';
      const status = ['success', 'failed', 'running'][Math.floor(Math.random() * 3)] as 'running' | 'success' | 'failed';
      const size = type === 'full' ? 
        `${Math.floor(Math.random() * 900 + 100)}MB` :
        type === 'incremental' ? 
        `${Math.floor(Math.random() * 90 + 10)}MB` :
        `${Math.floor(Math.random() * 9 + 1)}MB`;

      return {
        id: (index + 1).toString().padStart(6, '0'),
        name: `${type}_backup_${dayjs().format('YYYYMMDD')}_${index + 1}`,
        type,
        size,
        createTime: dayjs().subtract(Math.floor(Math.random() * 7), 'day').format('YYYY-MM-DD HH:mm:ss'),
        creator: ['张志强', '王德明', '李建军'][Math.floor(Math.random() * 3)],
        status,
        progress: status === 'running' ? Math.floor(Math.random() * 100) : undefined,
        path: `/backups/${type}/${dayjs().format('YYYYMMDD')}/${index + 1}`,
        error: status === 'failed' ? [
          '网络连接中断',
          '存储空间不足',
          '数据库连接失败',
          '备份进程异常退出',
          '文件系统权限不足'
        ][Math.floor(Math.random() * 5)] : undefined
      };
    });

    return records.sort((a, b) => dayjs(b.createTime).valueOf() - dayjs(a.createTime).valueOf());
  };

  // 初始化加载数据
  useEffect(() => {
    const mockData = generateMockData();
    setBackupList(mockData);
  }, []);

  // 刷新数据
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      const mockData = generateMockData();
      setBackupList(mockData);
      setLoading(false);
      message.success('刷新成功');
    }, 500);
  };

  // 创建备份
  const handleCreateBackup = async (values: any) => {
    setBackupInProgress(true);
    const newBackup: BackupRecord = {
      id: (backupList.length + 1).toString().padStart(6, '0'),
      name: values.name,
      type: values.type,
      size: '计算中...',
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      creator: '张志强',
      status: 'running',
      progress: 0,
      path: `/backups/${values.type}/${dayjs().format('YYYYMMDD')}/${backupList.length + 1}`
    };

    setBackupList([newBackup, ...backupList]);
    setCreateBackupVisible(false);
    backupForm.resetFields();

    // 模拟备份进度
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 1;
      if (progress >= 100) {
        clearInterval(interval);
        setBackupList(prev => {
          const updated = [...prev];
          const index = updated.findIndex(b => b.id === newBackup.id);
          if (index !== -1) {
            updated[index] = {
              ...updated[index],
              status: 'success',
              progress: 100,
              size: values.type === 'full' ? 
                `${Math.floor(Math.random() * 900 + 100)}MB` :
                values.type === 'incremental' ? 
                `${Math.floor(Math.random() * 90 + 10)}MB` :
                `${Math.floor(Math.random() * 9 + 1)}MB`
            };
          }
          return updated;
        });
        setBackupInProgress(false);
        message.success('备份完成');
      } else {
        setBackupList(prev => {
          const updated = [...prev];
          const index = updated.findIndex(b => b.id === newBackup.id);
          if (index !== -1) {
            updated[index] = {
              ...updated[index],
              progress
            };
          }
          return updated;
        });
      }
    }, 500);
  };

  // 上传备份
  const handleUpload = (info: any) => {
    const { status } = info.file;
    if (status === 'done') {
      message.success(`${info.file.name} 上传成功`);
      setUploadModalVisible(false);
    } else if (status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  };

  // 下载备份
  const handleDownload = (record: BackupRecord) => {
    message.loading('准备下载...', 1)
      .then(() => message.success('开始下载'));
  };

  // 恢复备份
  const handleRestore = (record: BackupRecord) => {
    setCurrentBackup(record);
    setRestoreModalVisible(true);
  };

  // 确认恢复
  const handleConfirmRestore = () => {
    if (!currentBackup) return;
    
    setRestoreInProgress(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 1;
      if (progress >= 100) {
        clearInterval(interval);
        setRestoreInProgress(false);
        setRestoreModalVisible(false);
        message.success('系统恢复完成');
      }
    }, 500);
  };

  // 删除备份
  const handleDelete = (record: BackupRecord) => {
    setBackupList(prev => prev.filter(item => item.id !== record.id));
    message.success('删除成功');
  };

  // 获取状态样式
  const getStatusTag = (status: string, progress?: number) => {
    switch (status) {
      case 'running':
        return (
          <Tag icon={<SyncOutlined spin />} color="processing">
            进行中 {progress !== undefined && `${progress}%`}
          </Tag>
        );
      case 'success':
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            完成
          </Tag>
        );
      case 'failed':
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            失败
          </Tag>
        );
      default:
        return (
          <Tag icon={<ClockCircleOutlined />} color="default">
            未知
          </Tag>
        );
    }
  };

  const columns = [
    {
      title: '备份ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => (
        <Tag color="blue">
          {BACKUP_TYPES[type as keyof typeof BACKUP_TYPES].name}
            </Tag>
      ),
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '创建者',
      dataIndex: 'creator',
      key: 'creator',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: string, record: BackupRecord) => getStatusTag(status, record.progress),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: BackupRecord) => (
        <Space>
          <Button
            type="link"
            size="small"
            disabled={record.status === 'running' || record.status === 'failed'}
            onClick={() => handleDownload(record)}
          >
            下载
          </Button>
          <Button
            type="link"
            size="small"
            disabled={record.status === 'running' || record.status === 'failed'}
            onClick={() => handleRestore(record)}
          >
            恢复
          </Button>
          <Popconfirm
            title="确定要删除这个备份吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
          <Button
            type="link"
            danger
              size="small"
              disabled={record.status === 'running'}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button
              type="primary"
              icon={<CloudUploadOutlined />}
              onClick={() => setCreateBackupVisible(true)}
              disabled={backupInProgress}
            >
              创建备份
            </Button>
            <Button
              icon={<CloudDownloadOutlined />}
              onClick={() => setUploadModalVisible(true)}
            >
              上传备份
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
            >
              刷新
            </Button>
          </Space>
        </div>

            <Table
          columns={columns}
              dataSource={backupList}
              rowKey="id"
              loading={loading}
              pagination={{
                total: backupList.length,
                pageSize: 10,
            showQuickJumper: true,
                showSizeChanger: true,
          }}
        />

        {/* 创建备份模态框 */}
        <Modal
          title="创建备份"
          open={createBackupVisible}
          onCancel={() => {
            setCreateBackupVisible(false);
            backupForm.resetFields();
          }}
          footer={null}
        >
          <Form
            form={backupForm}
            layout="vertical"
            onFinish={handleCreateBackup}
          >
            <Form.Item
              name="type"
              label="备份类型"
              rules={[{ required: true, message: '请选择备份类型' }]}
            >
              <Select>
                {Object.entries(BACKUP_TYPES).map(([key, value]) => (
                  <Option key={key} value={key}>
                    <Space>
                      {value.name}
                      <Text type="secondary">({value.description})</Text>
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="name"
              label="备份名称"
              rules={[{ required: true, message: '请输入备份名称' }]}
            >
              <Input placeholder="请输入备份名称" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={backupInProgress}>
                  开始备份
                </Button>
                <Button onClick={() => {
                  setCreateBackupVisible(false);
                  backupForm.resetFields();
                }}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* 上传备份模态框 */}
      <Modal
          title="上传备份"
          open={uploadModalVisible}
          onCancel={() => setUploadModalVisible(false)}
        footer={null}
        >
          <Alert
            message="请上传有效的备份文件"
            description="支持 .bak, .zip 格式的备份文件，文件大小不超过 1GB"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
          <Dragger
            name="file"
            multiple={false}
            action="/api/upload"
            onChange={handleUpload}
            accept=".bak,.zip"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">
              支持单个或批量上传，严禁上传公司内部资料或其他违禁文件
            </p>
          </Dragger>
      </Modal>

        {/* 恢复确认模态框 */}
      <Modal
          title="恢复确认"
        open={restoreModalVisible}
        onCancel={() => setRestoreModalVisible(false)}
          footer={null}
      >
        {currentBackup && (
            <>
            <Alert
                message="警告"
                description="系统恢复将会覆盖当前数据，请确保已经做好相应的备份。恢复过程中系统将暂停服务，请在业务低峰期进行操作。"
              type="warning"
              showIcon
                style={{ marginBottom: 24 }}
              />

              <Descriptions column={2} bordered>
                <Descriptions.Item label="备份ID" span={2}>
                  {currentBackup.id}
                </Descriptions.Item>
                <Descriptions.Item label="备份名称" span={2}>
                  {currentBackup.name}
                </Descriptions.Item>
              <Descriptions.Item label="备份类型">
                  <Tag color="blue">
                    {BACKUP_TYPES[currentBackup.type].name}
                </Tag>
              </Descriptions.Item>
                <Descriptions.Item label="备份大小">
                  {currentBackup.size}
                </Descriptions.Item>
                <Descriptions.Item label="创建时间">
                  {currentBackup.createTime}
                </Descriptions.Item>
                <Descriptions.Item label="创建者">
                  {currentBackup.creator}
                </Descriptions.Item>
            </Descriptions>

              {restoreInProgress ? (
                <div style={{ marginTop: 24, textAlign: 'center' }}>
                  <Progress type="circle" status="active" />
                  <div style={{ marginTop: 16 }}>
                    <Text type="secondary">系统恢复中，请勿关闭窗口...</Text>
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: 24 }}>
                  <Space>
                    <Button type="primary" danger onClick={handleConfirmRestore}>
                      确认恢复
                    </Button>
                    <Button onClick={() => setRestoreModalVisible(false)}>
                      取消
                    </Button>
                  </Space>
          </div>
              )}
            </>
        )}
      </Modal>
      </Card>
    </div>
  );
};

export default BackupRestore; 