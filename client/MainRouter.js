import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Home from './core/Home'
//import UsersContainer from './user/containers/UsersContainer'
import Signup from './user/Signup'
import SigninContainer from './auth/containers/SigninContainer'
import EditUserProfileContainer from './user/containers/EditUserProfileContainer'
import UserContainer from './user/containers/UserContainer'
import PrivateRoute from './auth/PrivateRoute'
import MenuContainer from './core/containers/MenuContainer'

const MainRouter = () => {
  return (<div>
    <MenuContainer/>
    <Switch>
      <Route exact path="/" component={Home}/>
      {/**<Route path="/users" component={UsersContainer}/>**/}
      <Route path="/signup" component={Signup}/>
      <Route path="/signin" component={SigninContainer}/>
      <PrivateRoute path="/user/edit/:userId" component={EditUserProfileContainer}/>
      <Route path="/user/:userId" component={UserContainer}/>
    </Switch>
  </div>)
}

export default MainRouter
