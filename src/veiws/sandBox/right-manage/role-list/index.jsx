import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import { Table, Tree, Button, Space, Modal } from 'antd'
import { DeleteOutlined, LeftSquareOutlined } from '@ant-design/icons';

export default () => {
    // 表头数据
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
        },
        {
            title: '操作',
            render: item => (
                <Space size="middle">
                    <Button type="primary" onClick={() => openModal(item)} shape="circle" icon={<LeftSquareOutlined />}></Button>
                    <Button type="danger" onClick={() => { }} shape="circle" icon={<DeleteOutlined />}></Button>
                </Space>
            )
        }
    ];

    // 表格数据
    const [dataSource, setDataSource] = useState([])
    // 当前点击的角色权限
    const [currentRights, setCurrentRights] = useState({})
    // 当前保存的半勾选 
    const [halfChecked, sethalfChecked] = useState([])
    // 当前点击的角色id
    const [currentId, setCurrentId] = useState(0)
    // 模态框
    const [isModalVisible, setIsModalVisible] = useState(false);

    // 获取表格数据
    useEffect(() => {
        getTableData()
    }, [])

    const getTableData = async () => {
        const res = await axios.get('http://localhost:5000/roles')
        setDataSource(res.data)
    }

    // 打开模态框
    const openModal = item => {
        setIsModalVisible(true)
        // 保存当前打开角色的id
        setCurrentId(item.id)
        const SingleRights = filterParentsNode(item.rights, treeData)
        setCurrentRights(SingleRights)
    }


    // 去除后端返回的父节点 , 防止antd树状组件被赋值时子节点被完全选择
    const filterParentsNode = (nodeArray, treeData) => {
        const res = []
        treeData.forEach(v => {
            const temp = { ...v }
            if (temp.children?.length) {
                res.push(...filterParentsNode(nodeArray, temp.children))
            } else {
                if (nodeArray.includes(temp.key)) {
                    res.push(temp.key)
                }
            }
        })
        return res
    }


    // 树形权限结构
    const [treeData, setTreeData] = useState([])

    // 获取到权限数据
    const getRightData = async () => {
        const res = await axios.get('http://localhost:5000/rights?_embed=children')
        setTreeData(res.data)
    }

    useEffect(() => {
        getRightData()
    }, [])


    const onCheck = (checkedKeys, { halfCheckedKeys }) => {
        // 保存半勾选状态的父key 使其可以在提交模态框时发送给后端
        sethalfChecked(halfCheckedKeys)
        setCurrentRights(checkedKeys)
    };


    // 点击模态框确认
    const handleOk = async () => {
        setDataSource(dataSource.map(v => {
            if (v.id === currentId) {
                return { ...v, rights: currentRights }
            }
            return v
        }))
        // 更新后端数据
        await axios.patch(`http://localhost:5000/roles/${currentId}`, {
            rights: [...currentRights, ...halfChecked]
        })
        setIsModalVisible(false);
    };


    // 点击模态框关闭
    const handleCancel = () => {
        setIsModalVisible(false);
    };


    return (
        <Fragment><Table rowKey={item => item.id} dataSource={dataSource} columns={columns} />
            <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkable
                    checkedKeys={currentRights}
                    onCheck={onCheck}
                    treeData={treeData}
                />
            </Modal>
        </Fragment>

    )
}
