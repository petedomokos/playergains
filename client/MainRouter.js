import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Home from './core/Home'
import Users from './user/Users'
import Signup from './user/Signup'
import SigninContainer from './auth/containers/SigninContainer'
import EditProfile from './user/EditProfile'
import UserContainer from './user/containers/UserContainer'
import PrivateRoute from './auth/PrivateRoute'
import MenuContainer from './core/containers/MenuContainer'

const MainRouter = () => {
    return (<div>
      <MenuContainer/>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/users" component={Users}/>
        <Route path="/signup" component={Signup}/>
        <Route path="/signin" component={SigninContainer}/>
        <PrivateRoute path="/user/edit/:userId" component={EditProfile}/>
        <Route path="/user/:userId" component={UserContainer}/>
      </Switch>
    </div>)
}

export default MainRouter
