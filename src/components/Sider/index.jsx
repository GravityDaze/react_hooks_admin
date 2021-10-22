import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Layout, Menu } from 'antd';
import './index.css'
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import axios from 'axios'
const { Sider } = Layout;
const { SubMenu } = Menu

export default withRouter(props => {
  
  // 获取菜单数据
  const [menu, setMenu] = useState([])
  const getMenuData = async () => {
    const res = await axios.get(' http://localhost:5000/rights?_embed=children')
    setMenu(res.data )
  }
 
  useEffect( () => {
    getMenuData()
  }, [])

  // 创建图标与菜单的映射
  const iconMap = new Map([
    ['/home', <UserOutlined />],
    ['/user-manage', <VideoCameraOutlined />],
    ['/right-manage', <UploadOutlined />],
  ])

  // 渲染菜单
  const { role:{rights} } = JSON.parse(localStorage.getItem('token'))
  const renderMenu = menuData => (
    menuData.map(v => {
      if (v.pagepermisson && rights.includes(v.key) ) {
        return v.children?.length ?
          <SubMenu key={v.key} icon={iconMap.get(v.key)} title={v.title}>
            {renderMenu(v.children)}
          </SubMenu>
          :
          <Menu.Item key={v.key} icon={iconMap.get(v.key)} onClick={() => props.history.push(v.key)}>
            {v.title}
          </Menu.Item>
      }
    })
  )

  const selectKeys = props.location.pathname
  const openKeys = [ `/${props.location.pathname.split('/')[1]}` ]

  return (
    <Sider trigger={null} collapsible collapsed={() => { }}>
      <div className="main-logo">造谣系统</div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={ selectKeys }
        selectedKeys={ selectKeys }
        defaultOpenKeys={ openKeys }
      >
        {
          renderMenu(menu)
        }
      </Menu>
    </Sider>
  )
})
