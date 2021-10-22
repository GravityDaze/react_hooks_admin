import React, { useState } from 'react'
import { Layout, Avatar, Dropdown, Menu } from 'antd';
import './index.css'
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined
} from '@ant-design/icons';
import { withRouter } from 'react-router';


export default withRouter((props) => {
    const { Header } = Layout;
    const [collapsed, setCollapse] = useState(false)
    const { role:{roleName},username } = JSON.parse(localStorage.getItem('token'))

    const menu = (
        <Menu>
            <Menu.Item disabled>
                <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">{ roleName }</a>
            </Menu.Item>
            <Menu.Item danger onClick={
                () => {
                    localStorage.clear()
                    props.history.replace('/login')
                }
            }
            >退出</Menu.Item>
        </Menu>
    )

    return (
        <Header className="site-layout-background" style={{ padding: '0 16px' }}>
            <div className="header-wrapper">
                {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                    className: 'trigger',
                    onClick: () => setCollapse(v => !v)
                })}
                <div className="right-content">
                    <span>欢迎{username}回来</span>
                    <Dropdown overlay={menu}>
                        <Avatar icon={<UserOutlined />} />
                    </Dropdown>,
                </div>
            </div>
        </Header>
    )
})
