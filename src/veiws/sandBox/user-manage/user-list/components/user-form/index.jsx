import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Form, Input, Select, Modal } from 'antd'

export default ({ visible, onOk, onCancel, currentUser, title,regions,roles }) => {

    // 对区域进行权限过滤
    const rightMap = new Map([
        [ 1, '超级管理员'],
        [ 2, '区域管理员'],
        [ 3, '区域编辑'],
    ])
    const { role:{ id },region }  = JSON.parse(localStorage.getItem('token'))
    const handleRegionRight = title =>{
        console.log(region,title)
        if( region === '超级管理员' ){
            return false
        }else{
            return title === region
        }
    }   

    // 表单数据
    const [form] = Form.useForm();

     // 记录当前选择框是否选择超级管理员
     const [currentChecked, setCurrentChecked] = useState(null)
     useEffect(() => {
         if (currentChecked === 1) {
             form.setFieldsValue({
                 region: ''
             })
         }else{
            //  非超级管理员时 恢复region字段
            if(regions[0]){
                form.setFieldsValue({
                    region:regions[0].value
                })
            }
         }
     }, [currentChecked])
 

     // 监听对话框打开时回填数据
     useEffect(() => {
        if (visible) {  
            form.setFieldsValue(currentUser)
            setCurrentChecked(currentUser?.role?.id)
        }
    }, [visible])


    // 提交表单
    const submit = () => {
        form
            .validateFields()
            .then((values) => {
                form.resetFields();
                setCurrentChecked(null)
                onOk(values);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });

    }


    return (
        <Modal title={ title } visible={visible} onOk={submit} onCancel={() => {
            // 重置表单
            form.resetFields()
            setCurrentChecked(null)
            onCancel()
        }}>
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
            >
                <Form.Item
                    name="username"
                    label="用户名"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the title of collection!'
                        },
                    ]}
                >
                    <Input placeholder="请输入用户名" />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="密码"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!'
                        }
                    ]}
                >
                    <Input placeholder="请输入密码" />
                </Form.Item>
                <Form.Item name="region" label="区域">
                    <Select placeholder="请选择区域" disabled={currentChecked === 1} >
                        {
                            regions.map(v => <Select.Option key={v.id} value={v.value}>{v.title}</Select.Option>)
                        }
                    </Select>
                </Form.Item>
                <Form.Item name="roleId" label="角色">
                    <Select placeholder="请选择角色" onChange={id => setCurrentChecked(id)} >
                        {
                            roles.map(v => <Select.Option key={v.id} value={v.id}>{v.roleName}</Select.Option>)
                        }
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    )
}
