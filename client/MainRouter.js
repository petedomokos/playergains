import React, { useEffect } from 'react'
import {Route, Switch} from 'react-router-dom'
import NonUserHome from './core/NonUserHome'
import UserHomeContainer from './core/containers/UserHomeContainer'
//import UsersContainer from './user/containers/UsersContainer'
import SigninContainer from './auth/containers/SigninContainer'
import EditUserProfileContainer from './user/containers/EditUserProfileContainer'
import UserContainer from './user/containers/UserContainer'
import GroupContainer from './group/containers/GroupContainer'
import DatasetContainer from './dataset/containers/DatasetContainer'
import CreateUserContainer from './user/containers/CreateUserContainer'
import CreateGroupContainer from './group/containers/CreateGroupContainer'
import CreateDatasetContainer from './dataset/containers/CreateDatasetContainer'
import PrivateRoute from './auth/PrivateRoute'
import MenuContainer from './core/containers/MenuContainer'
import auth from './auth/auth-helper'

const MainRouter = ({userId, loadUser, loadingUser}) => {
  //load user if page is refreshed. MainRouter is under the store so can 
  //trigger re-render once loaded
  const jwt = auth.isAuthenticated();
  useEffect(() => {
    if(jwt && !userId && !loadingUser){
      loadUser(jwt.user._id)
    }
  }); 
  
 //we dont use?: because we if there is a loading delay for User, we dont want display to revert to NonUserHome 
 //todo - find a graceful way of handling this potential issue

  return (
    <div>
      <MenuContainer/>
      <Switch>
        {jwt ?
          <Route exact path="/" component={UserHomeContainer}/>
          :
          <Route exact path="/" component={NonUserHome}/>
        }
        <Route path="/signup" component={CreateUserContainer}/>
        <Route path="/signin" component={SigninContainer}/>
        <PrivateRoute path="/user/edit/:userId" component={EditUserProfileContainer}/>
        <PrivateRoute path="/users/new" component={CreateUserContainer}/>
        <PrivateRoute path="/groups/new" component={CreateGroupContainer}/>
        <PrivateRoute path="/datasets/new" component={CreateDatasetContainer}/>
        {userId && <Route path="/user/:userId" component={UserContainer}/>}
        {userId && <Route path="/group/:groupId" component={GroupContainer}/>}
        {userId && <Route path="/dataset/:datasetId" component={DatasetContainer}/>}
      </Switch>
    </div>
    )
}

export default MainRouter
