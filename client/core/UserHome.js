import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
//children
import UsersContainer from '../user/containers/UsersContainer'
import GroupsContainer from '../group/containers/GroupsContainer'
import { withLoader } from '../util/HOCs';
import { filterUniqueById } from '../util/ArrayHelpers'

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5)
  },
  title: {
    padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
    color: theme.palette.openTitle
  },
  media: {
    minHeight: 400
  },
  credit: {
    padding: 10,
    textAlign: 'right',
    backgroundColor: '#ededed',
    borderBottom: '1px solid #d0d0d0',
    '& a':{
      color: '#3f4771'
    } 
  },
  lists:{

  }
}))

export default withLoader(function UserHome(props){
  const { user } = props;
  const classes = useStyles()
  console.log('UserHome props', props)

  return (
    <div className={classes.root}>
      <Typography variant="h6" className={classes.title}>
        Home Page
      </Typography>
        <UsersContainer/>
        <GroupsContainer/>
    </div>
  )
}, ['user'])
