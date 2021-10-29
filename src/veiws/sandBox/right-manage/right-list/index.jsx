import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table, Tag, Button, Space, Modal, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

export default () => {
  // 表头数据
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (text) => (
        <Tag color="green">{text}</Tag>
      )
    },
    {
      title: '状态',
      render: (item) => <Switch
        checked={item.pagepermisson}
        disabled={item.pagepermisson === undefined}
        onChange={e => switchMethod(e, item)}
      ></Switch>
    },
    {
      title: '操作',
      render: (item) => (
        <Space size="middle">
          <Button type="primary" shape="circle" icon={<EditOutlined />}></Button>
          <Button type="danger" onClick={() => confirmMethod(item)} shape="circle" icon={<DeleteOutlined />}></Button>
        </Space>
      ),
    }
  ];

  // 获取表格数据
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    getTableData()
  }, [])

  const getTableData = async () => {
    const res = await axios.get('/rights?_embed=children')
    setDataSource(res.data.map(v => {
      if (!v.children?.length) {
        const { children, ...rest } = v
        return rest
      } else {
        return v
      }
    }))
  }

  // 删除相关功能

  const confirmMethod = item => {
    confirm({
      title: '是否要删除该菜单项',
      icon: <ExclamationCircleOutlined />,
      content: '删除以后无法恢复',
      onOk() {
        deleteMethod(item)
      }
    });
  }

  const deleteMethod = async item => {
    await axios.delete(`/children/${item.id}`)
    getTableData()
  }

  // 开关状态相关功能
  const switchMethod = (status, item) => {
    const newDataSource = dataSource.map(v => {
      if (v.id === item.id) {
        return { ...v, pagepermisson: status ? 1 : 0 }
      } else {
        return v
      }
    })
    setDataSource(newDataSource)
    // 请求后端接口
    updateBackEndStatus(item)
  }

  const updateBackEndStatus = async ({id,pagepermisson}) => {
    await axios.patch( `/rights/${id}`,{ pagepermisson:!pagepermisson } )
  }


  return (
    <Table dataSource={dataSource} columns={columns} />
  )
}
