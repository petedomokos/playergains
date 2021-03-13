import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Edit from '@material-ui/icons/Edit'
import Person from '@material-ui/icons/Person'
import Divider from '@material-ui/core/Divider'
import DeleteUserContainer from './containers/DeleteUserContainer'
import auth from '../auth/auth-helper'
import { Link } from 'react-router-dom'
import { SurroundSoundSharp } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    //minWidth:300,
    //maxWidth: 600,
    width:300,
    height:150,
    //margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(2)
  }),
  title: {
    marginTop: theme.spacing(3),
    color: theme.palette.protectedTitle
  }
}))

export default function UserProfile({ profile }) {
  console.log('profile', profile)
  const { _id, username, firstname, surname, email, created, admin } = profile;
  const classes = useStyles()
  const jwt = auth.isAuthenticated();
  //note - it is possible that group may have been fully loaded, in which case
  //arrays like admin will not just be id but will be an object. But if user or group was just created,
  //then only ids are returned. Therefore, we handle both cases.
  //todo - better soln is to send the admin as objects in create methiods in controllers
  //but to do that we need to go into teh database to get them, so need to chain promises
  const adminIds = admin[0] && typeof admin[0] === 'string' ? admin : admin.map(us => us._id);
  const userHasAdminAuth =  jwt && (jwt.user._id === _id || adminIds.find(userId => userId === jwt.user._id));
  return (
      <Paper className={classes.root} elevation={4}>
        <Typography variant="h6" className={classes.title}>
          Profile
        </Typography>
        <List dense>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <Person/>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={username} secondary={firstname + ' ' +surname}/>
            {userHasAdminAuth &&
              (<ListItemSecondaryAction>
                <Link to={"/user/edit/" + _id} >
                  <IconButton aria-label="Edit" color="primary">
                    <Edit/>
                  </IconButton>
                </Link>
                <DeleteUserContainer userId={_id}/>
              </ListItemSecondaryAction>)
            }
          </ListItem>
          <Divider/>
          <ListItem>
            <ListItemText primary={created ? "Joined: " + (new Date(created)).toDateString() : ''}/>
          </ListItem>
        </List>
      </Paper>
    )
}

UserProfile.defaultProps = {
  profile: {
    _id:'',
    username:'',
    firstname:'',
    surname:'',
    email:'',
    admin:[]
  }
}