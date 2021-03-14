import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
//children
import UserProfile from '../user/UserProfile'
import UsersContainer from '../user/containers/UsersContainer'
import GroupsContainer from '../group/containers/GroupsContainer'
import { withLoader } from '../util/HOCs';
//helpers
import { userProfile } from '../util/ReduxHelpers'
import { withRouter } from 'react-router'

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2),
    display:'flex',
    alignItems:'flex-start', //note - when removing this, it makes item stretch more
    flexDirection:'column'
  },
  title: {
    padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
    color: theme.palette.openTitle
  },
  lists:{
    height:'calc(70vh - 150px)',
    marginTop:`${theme.spacing(4)}px`,
    alignSelf:'stretch',
    display:'flex',
    justifyContent:'space-around',
    flexWrap:'wrap'
  },
  list:{
    flex:'400px 0 0',
    maxWidth:'90vw', //keeps it on small mobile screens
    height:'100%',
  }
}))

const UserHome = ({user, loading, loadingError}) => {
  const classes = useStyles() 
  //for now, keep it simple for page refreshes - until user reloads, dont render the children.
  //note - cant use withRouter in MainRouter as we only want it to load user if signed in
  return (
    <div className={classes.root}>
      {user._id && 
        <>
          <UserProfile profile={user} />
          <div className={classes.lists}>
              <div className={classes.list}>
                <UsersContainer/>
          </div>
              <div className={classes.list}>
                <GroupsContainer/>
              </div>
          </div>
        </>}
    </div>
  )
}

UserHome.defaultProps = {
}

export default UserHome 
