import React from 'react'
import { Form, Input, Button,message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios'
import './index.css'

export default (props) => {

    const onFinish = async values => {
        const { username,password } = values
        const res = await axios.get(`/users?username=${username}&password=${password}&roleState=true&_expand=role`)
        if(res.data.length){
            // 登录成功
            message.success('登陆成功')
            localStorage.setItem('token',JSON.stringify(res.data[0]))
            props.history.replace('/')
        }else{
            // 登录失败
            message.error('密码不匹配')
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="bkg">
            <div className="wrapper">
                <div className="title">造谣系统</div>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="请输入用户名" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="请输入密码"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{width:'100%'}}>
                           登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>

        </div>

    );


}
