import React from 'react'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import Home from './home'
import Nopermission from './nopermission'
import UserList from './user-manage/user-list'
import RightManage from './right-manage/right-list'
import RoleList from './right-manage/role-list'
import SideMenu from '../../components/Sider'
import TopHeader from '../../components/Header'
// antd
import { Layout } from 'antd';
import './index.css'


export default function index() {

    const { Content } = Layout;

    return (
        <Layout>
            <SideMenu />
            <Layout className="site-layout">
                <TopHeader />
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    <HashRouter>
                        <Switch>
                            <Route path="/home" component={Home}></Route>
                            <Route path="/nopermission" component={Nopermission}></Route>
                            <Route path="/user-manage/list" component={UserList}></Route>
                            <Route path="/right-manage/right/list" component={RightManage}></Route>
                            <Route path="/right-manage/role/list" component={RoleList}></Route>
                            <Redirect to="/home" ></Redirect>
                        </Switch>
                    </HashRouter>
                </Content>
            </Layout>
        </Layout>
    )
}
