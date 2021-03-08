import React, { } from 'react'
import {Redirect, Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import UserProfile from './UserProfile'
import auth from './../auth/auth-helper'
import { withLoader } from '../util/HOCs';

//function User({ user }) {
function User(props) {
  console.log('User props', props)
  //console.log('user', user)
  //note may need useEffect for window.scrollTo(0, 0)
  return (
    <div>
      User
      {/**<UserProfile user={user}/>**/}
    </div>
  )
}
const Loading = <div>User is loading</div>
//props for user will be passed to this component below instead
export default withLoader(User, ['user'], {alwaysRender:false, LoadingPlaceholder:Loading});
