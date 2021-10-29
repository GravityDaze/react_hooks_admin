import React, { useEffect, useState } from 'react'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
// route
import Home from './home'
import Nopermission from './nopermission'
import UserList from './user-manage/user-list'
import RightManage from './right-manage/right-list'
import RoleList from './right-manage/role-list'
import NewsAdd from './news-manage/news-add'
import NewsCategory from './news-manage/news-category'
import NewsDraft from './news-manage/news-draft'
// components
import SideMenu from '../../components/Sider'
import TopHeader from '../../components/Header'
// antd
import { Layout } from 'antd';
import './index.css'
import axios from 'axios'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

export default () => {
    // 进度条
    nProgress.start()
    useEffect(()=> nProgress.done())

    const { Content } = Layout;
    // 通过菜单数据动态加载异步路由
    const [menu, setMenu] = useState([])
    const getMenuData = async () => {
        const res = await axios.get('/rights?_embed=children')
        setMenu(res.data)
    }
    useEffect(() => {
        getMenuData()
    }, [])

    // 获取到本地保存的用户权限
    const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
    // 构建本地路由表
    const localRouter = new Map([
        ["/home", Home],
        ["nopermission", Nopermission],
        ["/user-manage/list", UserList],
        ["/right-manage/right/list", RightManage],
        ["/right-manage/role/list", RoleList],
        ["/news-manage/add", NewsAdd],
        ["/news-manage/category", NewsCategory],
        ["/news-manage/draft", NewsDraft],
    ])

    const initAsyncRouter = (menu) => (
         menu.map(v => {
            if (v.pagepermisson) {
                if (!v.children?.length) {
                 return rights.includes(v.key) ?
                     <Route path={v.key} component={localRouter.get(v.key)} key={v.key} exact></Route>
                     :
                     <Nopermission />
                } else {
                    return initAsyncRouter(v.children)
                }
            }
        })
    )

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
                            {
                                initAsyncRouter(menu)
                            }
                            <Redirect to="/home" ></Redirect>
                        </Switch>
                    </HashRouter>
                </Content>
            </Layout>
        </Layout>
    )
}
