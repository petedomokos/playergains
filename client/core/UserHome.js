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

export default withLoader(function UserHome(props){
  const { user } = props;
  const classes = useStyles()
  console.log('UserHome props', props)

  
  return (
    <div className={classes.root}>
      <UserProfile profile={userProfile(user)} />
      <div className={classes.lists}>
        <div className={classes.list}>
          <UsersContainer/>
        </div>
        <div className={classes.list}>
          <GroupsContainer/>
        </div>
      </div>
    </div>
  )
}, ['user'])
