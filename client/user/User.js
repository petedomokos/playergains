import React, { } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import UserProfile from './UserProfile'
import { withLoader } from '../util/HOCs';
//helper
import { userProfile } from '../util/ReduxHelpers'

const useStyles = makeStyles(theme => ({
  dashboard:{
    margin:'50px'
  }
}))


function User(props) {
  console.log('User props', props)
  const { user } = props;
  const classes = useStyles()
  //note may need useEffect for window.scrollTo(0, 0)

  return (
    <div>
      <UserProfile profile={userProfile(user)} />
      <div className={classes.dashboard}>
        This players profile and dashboard (includes links for editing/deleting
         - but only if this player is administered by signedin user])
      </div>
    </div>
  )
}
const Loading = <div>User is loading</div>
//props for user will be passed to this component below instead
export default withLoader(User, ['user'], {alwaysRender:false, LoadingPlaceholder:Loading});
