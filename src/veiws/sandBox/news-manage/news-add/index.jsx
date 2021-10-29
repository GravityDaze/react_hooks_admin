import React, { Fragment, useState, useEffect } from 'react'
import { PageHeader, Steps, Button, Space, Form, Input, Select } from 'antd'
import NewsEditor from  '../../../../components/NewsEditor'
import axios from 'axios'

export default () => {
    // 表单数据
    const [form] = Form.useForm()

    // 步骤条状态
    const { Step } = Steps
    const [currentStep, setCurrentStep] = useState(0)

    // 新闻分类状态
    const [categories , setCategories] = useState([])
    useEffect(()=>{
        axios.get('/categories').then(res=>{
            setCategories(res.data)
        })
    },[])

    // 新闻完成时预览??
    const [content,setContent] = useState('')

    return (
        <Fragment>
            <PageHeader
                title="撰写新闻"
                subTitle="addNews"
            />
            <Steps current={currentStep}>
                <Step title="基本信息" description="新闻标题" />
                <Step title="新闻内容" description="新闻主体内容" />
                <Step title="新闻提交" description="保存草稿或者提交审核" />
            </Steps>
            <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                >
                    <Form.Item
                        name="title"
                        label="新闻内容"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the title of collection!'
                            },
                        ]}
                    >
                        <Input placeholder="请输入新闻内容" />
                    </Form.Item>
                    <Form.Item
                        name="categoryId"
                        label="新闻分类"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!'
                            }
                        ]}
                    >
                        <Select placeholder="请选择分类" >
                            {
                                categories.map(v => <Select.Option key={v.id} value={v.value}>{v.title}</Select.Option>)
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </div>
            <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
                <NewsEditor getContent={ htmlStr=>{
                    setContent(htmlStr)
                }  } />
            </div>
            <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
                { news } 
            </div>
            <Space style={{ width: '100%' }}>
                <Button onClick={() => setCurrentStep(currentStep - 1)} style={{ display: currentStep > 0 ? 'block' : 'none' }}>上一步</Button>
                <Button onClick={() => setCurrentStep(currentStep + 1)} style={{ display: currentStep < 2 ? 'block' : 'none' }} type="primary" >下一步</Button>
            </Space>
        </Fragment>
    )
}