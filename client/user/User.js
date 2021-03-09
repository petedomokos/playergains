import React, { } from 'react'
import UserProfile from './UserProfile'
import { withLoader } from '../util/HOCs';
//helper
import { userProfile } from '../util/ReduxHelpers'


function User(props) {
  console.log('User props', props)
  const { user } = props;
  console.log('User', user)
  //note may need useEffect for window.scrollTo(0, 0)

  return (
    <div>
      <UserProfile profile={userProfile(user)} />
    </div>
  )
}
const Loading = <div>User is loading</div>
//props for user will be passed to this component below instead
export default withLoader(User, ['user'], {alwaysRender:false, LoadingPlaceholder:Loading});
