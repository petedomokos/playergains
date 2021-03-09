import React, { } from 'react'
import UserProfile from './UserProfile'
import { withLoader } from '../util/HOCs';

function User(props) {
  console.log('User props', props)
  const { user } = props;
  console.log('User', user)
  //note may need useEffect for window.scrollTo(0, 0)
  const userProfile = {
    _id:user._id, name:user.name, email:user.email, created:user.created
  }
  return (
    <div>
      <UserProfile {...userProfile}/>
    </div>
  )
}
const Loading = <div>User is loading</div>
//props for user will be passed to this component below instead
export default withLoader(User, ['user'], {alwaysRender:false, LoadingPlaceholder:Loading});
