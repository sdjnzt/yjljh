import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Tabs, Checkbox, Row, Col, Modal, Space, Tooltip, Typography, Divider, Alert } from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  SafetyOutlined, 
  HomeOutlined, 
  MobileOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  DatabaseOutlined,
  ClockCircleOutlined,
  AudioOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const { Title, Text } = Typography;

interface LoginForm {
  username: string;
  password: string;
  remember?: boolean;
}

interface MobileLoginForm {
  mobile: string;
  verificationCode: string;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  const [countdown, setCountdown] = useState(0);
  // 顶部公告已移除
  const [mobileForm] = Form.useForm();
  const [accountForm] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      accountForm.setFieldsValue({ username: savedUsername });
    }
  }, [accountForm]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const validateMobile = (mobile: string) => {
    if (!mobile) {
      return '请输入手机号码';
    }
    if (!/^1[3-9]\d{9}$/.test(mobile)) {
      return '请输入正确的手机号码';
    }
    return '';
  };

  const handleSendCode = async () => {
    try {
      const mobile = mobileForm.getFieldValue('mobile');
      const error = validateMobile(mobile);
      if (error) {
        message.error(error);
        return;
      }

      const btn = document.querySelector('.verification-code-button') as HTMLButtonElement;
      if (btn) btn.disabled = true;

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCountdown(60);
      message.success('验证码已发送至您的手机，请注意查收！');
      
      mobileForm.getFieldInstance('verificationCode')?.focus();
    } catch (error) {
      message.error('验证码发送失败，请稍后重试');
    } finally {
      const btn = document.querySelector('.verification-code-button') as HTMLButtonElement;
      if (btn) btn.disabled = false;
    }
  };

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (values.username === 'admin' && values.password === 'admin123') {
        if (values.remember) {
          localStorage.setItem('rememberedUsername', values.username);
        } else {
          localStorage.removeItem('rememberedUsername');
        }

        localStorage.setItem('userToken', 'demo-token');
        localStorage.setItem('userName', values.username);
        message.success('登录成功，正在进入系统...');
        navigate('/');
      } else {
        message.error('账号或密码错误，请重试！');
      }
    } catch (error) {
      message.error('登录失败，请检查网络后重试！');
    } finally {
      setLoading(false);
    }
  };

  const onMobileFinish = async (values: MobileLoginForm) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (values.mobile === '13800138000' && values.verificationCode === '123456') {
        localStorage.setItem('userToken', 'demo-token');
        localStorage.setItem('userMobile', values.mobile);
        
        message.success('登录成功，正在进入系统...');
        navigate('/');
      } else {
        message.error('验证码错误或已过期，请重新获取！');
        mobileForm.setFieldValue('verificationCode', '');
        mobileForm.getFieldInstance('verificationCode')?.focus();
      }
    } catch (error) {
      message.error('登录失败，请检查网络后重试！');
    } finally {
      setLoading(false);
    }
  };

  // 左侧功能卡片已移除

  const handleForgotPassword = () => {
    Modal.info({
      title: '找回密码',
      content: (
        <div style={{ fontSize: '16px', lineHeight: '2' }}>
          <p>请联系系统管理员重置密码：</p>
          <p><strong>电话：</strong>15864126115</p>
          <p><strong>邮箱：</strong>admin@yujiali.com</p>
        </div>
      ),
      width: 400,
      okText: '知道了',
      className: 'custom-modal'
    });
  };

  const items = [
    {
      key: 'account',
      label: (
        <span>
          <UserOutlined style={{ marginRight: '8px' }} />
          账号密码登录
        </span>
      ),
      children: (
        <Form
          form={accountForm}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入账号！' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#667eea' }} />}
              placeholder="请输入账号"
              autoComplete="username"
              style={{ 
                borderRadius: '12px', 
                height: '50px',
                border: '2px solid #f0f0f0',
                transition: 'all 0.3s ease',
                fontSize: '16px'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#f0f0f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#667eea' }} />}
              placeholder="请输入密码"
              autoComplete="current-password"
              style={{ 
                borderRadius: '12px', 
                height: '50px',
                border: '2px solid #f0f0f0',
                transition: 'all 0.3s ease',
                fontSize: '16px'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#f0f0f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </Form.Item>

          <Form.Item>
            <Row justify="space-between" align="middle">
              <Col>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox style={{ fontSize: '14px', color: '#666' }}>记住账号</Checkbox>
                </Form.Item>
              </Col>
              <Col>
                <Button type="link" onClick={handleForgotPassword} style={{ fontSize: '14px', color: '#667eea' }}>
                  忘记密码
                </Button>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{ 
                height: '50px', 
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
              }}
            >
              {loading ? '登录中...' : '登录系统'}
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'mobile',
      label: (
        <span>
          <MobileOutlined style={{ marginRight: '8px' }} />
          手机验证码登录
        </span>
      ),
      children: (
        <Form
          form={mobileForm}
          name="mobileLogin"
          onFinish={onMobileFinish}
          autoComplete="off"
          size="large"
          className="mobile-login-form"
        >
          <Form.Item
            name="mobile"
            rules={[
              { required: true, message: '请输入手机号码' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
            ]}
          >
            <Input
              prefix={<MobileOutlined className="form-icon" style={{ color: '#667eea' }} />}
              placeholder="请输入手机号码"
              autoComplete="tel"
              maxLength={11}
              showCount
              style={{ 
                borderRadius: '12px', 
                height: '50px',
                border: '2px solid #f0f0f0',
                transition: 'all 0.3s ease',
                fontSize: '16px'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#f0f0f0';
                e.target.style.boxShadow = 'none';
              }}
              suffix={
                <Tooltip title="未注册的手机号将自动创建账号">
                  <InfoCircleOutlined style={{ color: '#999' }} />
                </Tooltip>
              }
            />
          </Form.Item>

          <Form.Item
            name="verificationCode"
            rules={[
              { required: true, message: '请输入验证码' },
              { pattern: /^\d{6}$/, message: '验证码为6位数字' }
            ]}
          >
            <Row gutter={8}>
              <Col flex="auto">
                <Input
                  prefix={<SafetyOutlined className="form-icon" style={{ color: '#667eea' }} />}
                  placeholder="请输入验证码"
                  maxLength={6}
                  autoComplete="off"
                  style={{ 
                    borderRadius: '12px', 
                    height: '50px',
                    border: '2px solid #f0f0f0',
                    transition: 'all 0.3s ease',
                    fontSize: '16px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#f0f0f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </Col>
              <Col>
                <Button
                  className="verification-code-button"
                  disabled={countdown > 0}
                  onClick={handleSendCode}
                  style={{ 
                    height: '50px', 
                    borderRadius: '12px',
                    background: countdown > 0 ? '#f5f5f5' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    color: countdown > 0 ? '#999' : 'white',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
                </Button>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{ 
                height: '50px', 
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
              }}
            >
              {loading ? '登录中...' : '登录系统'}
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 背景装饰 */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-50%',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        animation: 'float 20s ease-in-out infinite'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '-50%',
        left: '-50%',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
        animation: 'float 25s ease-in-out infinite reverse'
      }} />

      {/* 顶部公告已移除 */}

      <div style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* 左侧品牌展示区已移除，居中显示登录卡片 */}

        <div style={{ flex: '0 0 450px' }}>
          <Card style={{
            borderRadius: '24px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
            border: 'none',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            animation: 'fadeInRight 1s ease-out'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              {/*<div style={{*/}
              {/*  width: '70px',*/}
              {/*  height: '70px',*/}
              {/*  borderRadius: '20px',*/}
              {/*  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',*/}
              {/*  display: 'flex',*/}
              {/*  alignItems: 'center',*/}
              {/*  justifyContent: 'center',*/}
              {/*  margin: '0 auto 20px auto',*/}
              {/*  boxShadow: '0 12px 30px rgba(102, 126, 234, 0.3)'*/}
              {/*}}>*/}
              {/*  <HomeOutlined style={{ fontSize: '28px', color: 'white' }} />*/}
              {/*</div>*/}
              <Title level={2} style={{ margin: '0 0 8px 0', color: '#333', fontSize: '28px' }}>
                用户登录
              </Title>
              {/*<Text style={{ fontSize: '14px', color: '#666' }}>*/}
              {/*  请登录您的账户以继续使用系统*/}
              {/*</Text>*/}
            </div>
            
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={items}
              centered
              style={{ marginTop: '24px' }}
              tabBarStyle={{
                marginBottom: '24px'
              }}
            />
            
            <Divider style={{ margin: '32px 0 24px 0' }}>
              <Text style={{ fontSize: '12px', color: '#999' }}>
                安防管理 · 智能广播 · 权限控制
              </Text>
            </Divider>
          </Card>
        </div>
      </div>


    </div>
  );
};

export default Login; 