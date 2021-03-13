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
      <UserProfile profile={user} />
      <div className={classes.dashboard}>
        This players profile and dashboard (includes links for editing/deleting
         - but only if this player is administered by signedin user])
      </div>
    </div>
  )
}
const Loading = <div>User is loading</div>
//must load user if we dont have the deep version eg has groupsMemberof property
export default withLoader(User, ['user.groupsMemberOf'], {alwaysRender:false, LoadingPlaceholder:Loading});
