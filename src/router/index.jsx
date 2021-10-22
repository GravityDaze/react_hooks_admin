import React from 'react'
import Login from '../veiws/login'
import SandBox from '../veiws/sandBox'
import { HashRouter, Route, Switch } from 'react-router-dom'


export default function index() {
    return (
        <HashRouter>
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/" render={() =>
                    localStorage.getItem('token') ?
                        <SandBox /> : <SandBox /> 
                        // <Redirect to="/login" ></Redirect>
                } />
            </Switch>
        </HashRouter>
    )
}
