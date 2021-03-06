import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import { Table, Button, Space, Modal, Switch } from 'antd'
import { DeleteOutlined, LeftSquareOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import AddUserForm from './components/user-form';
const { confirm } = Modal;

export default () => {
    // 获取表头数据
    const initColumns = () => [
        {
            title: '区域',
            dataIndex: 'region',
            render: text => (
                <b>{!text ? '全球' : text}</b>
            ),
            filters: regions.map(v => ({ text: v.value, value: v.value })),
            onFilter: (value, self) => self.region === value
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render: ({ roleName }) => roleName
        },
        {
            title: '用户名',
            dataIndex: 'username'
        },
        {
            title: '角色状态',
            render: (item, row) => (
                <Switch checked={item.roleState} disabled={row.default} onChange={e => switchMethod(e, item)}></Switch>
            )
        },
        {
            title: '操作',
            render: (item, row) => (
                <Space size="middle">
                    <Button disabled={row.default} type="primary" onClick={() => openModal(item, '编辑')} shape="circle" icon={<LeftSquareOutlined />}></Button>
                    <Button disabled={row.default} type="danger" onClick={() => confirmMethod(item)} shape="circle" icon={<DeleteOutlined />}></Button>
                </Space>
            )
        }
    ];
    // 表格数据
    const [dataSource, setDataSource] = useState([])
    // 表单数据
    const [regions, setRegions] = useState([])
    const [roles, setRoles] = useState([])
    // 表单回填数据
    const [currentUser, setcurrentUser] = useState(null)

    // 获取到该用户的权限用于鉴权
    const rightMap = new Map([
        [ 1, '超级管理员'],
        [ 2, '区域管理员'],
        [ 3, '区域编辑'],
    ])
    const { role:{ roleName },roleId,region } = JSON.parse( localStorage.getItem('token') )

    const getTableData = async () => {
        const res = await axios.get('/users?_expand=role')
        // 获取到该用户的权限
        setDataSource(res.data.filter(v=>rightMap.get(roleId) === '超级管理员' || ( rightMap.get(v.roleId) === '区域编辑' && v.region === region )))
    }

    // 获取到下拉框的区域和角色数据
    const getRegions = async () => {
        const res = await axios.get('/regions')
        setRegions(res.data.filter(v=> rightMap.get(roleId) === '超级管理员' || v.title === region))
    }

    const getRoles = async () => {
        const res = await axios.get('/roles')
        setRoles(res.data.filter(v=> rightMap.get(roleId) === '超级管理员' || rightMap.get(v.id) === '区域编辑'))
    }

    // 获取表格和表单数据
    useEffect(() => {
        getTableData()
        getRegions()
        getRoles()
    }, [])


    // 模态框状态
    const [visible, setVisible] = useState(false);

    // 模态框标题
    const [modalTitle, setModalTitle] = useState('')

    // 打开模态框
    const openModal = (item, title) => {
        // 当前选择用户
        setcurrentUser(item)
        // 当前是编辑还是新建
        setModalTitle(title)
        setVisible(true)
    }

    // 确认模态框
    const onOk = async values => {
        modalTitle === '新增' ? addUser(values) : editUser(values)
        getTableData()
        setVisible(false)

    }

    // 新建用户
    const addUser = async values => {
        console.log(values)
        await axios.post('/users', {
            ...values,
            roleState: true,
            default: false
        })
        getTableData()
        setVisible(false)
    }

    // 编辑用户
    const editUser = async values => {
        await axios.patch(`/users/${currentUser.id}`, values)
        getTableData()
        setVisible(false)
    }

    // 关闭模态框
    const onCancel = () => {
        setVisible(false)
    }

    // 删除用户
    const confirmMethod = item => {
        confirm({
            title: '是否要删除该用户',
            icon: <ExclamationCircleOutlined />,
            content: '删除以后无法恢复',
            onOk: () => deletUser(item)
        });
    }

    const deletUser = async item => {
        await axios.delete(`/users/${item.id}`)
        getTableData()
    }

    // 开关相关功能
    const switchMethod = (roleState, item) => {
        const newDataSource = dataSource.map(v => {
            if (v.id === item.id) {
                return { ...v, roleState }
            } else {
                return v
            }
        })
        setDataSource(newDataSource)
        // 请求后端接口
        updateBackEndStatus(item, roleState)
    }

    const updateBackEndStatus = async ({ id }, roleState) => {
        await axios.patch(`/users/${id}`, { roleState })
    }


    return (
        <Fragment>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Button type="primary" onClick={() => openModal({}, '新增')}>添加用户</Button>
                <Table
                    rowKey={item => item.id}
                    dataSource={dataSource}
                    columns={initColumns()}
                />
            </Space>
            <AddUserForm
                regions={regions}
                roles={roles}
                visible={visible}
                onOk={onOk}
                onCancel={onCancel}
                currentUser={currentUser}
                title={modalTitle}
            />
        </Fragment>

    )
}
