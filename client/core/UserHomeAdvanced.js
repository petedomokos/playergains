import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import SimpleList from '../util/SimpleList'
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
  const [usersOpen, setUsersOpen] = useState(false);
  const [groupsOpen, setGroupsOpen] = useState(false);
  console.log('UserHome props', props)
  const myPeople = filterUniqueById([...user.administeredUsers,  ...user.usersIFollow])
  const myGroups = filterUniqueById([...user.administeredGroups, ...user.groupsMemberOf, ...user.groupsIFollow])
  const peopleActions = [
      {icon:'find', onclick:() => {setUsersOpen(true)}}, 
      {icon:'create', link:'/users/new'}
  ]
  const groupActions = [
    {icon:'find', onclick:() => {setGroupsOpen(true)}}, 
    {icon:'create', link:'/groups/new'}
  ]
  const peopleItemActions = [
    {icon:'follow', onclick:() => {setUsersOpen(true)}}, 
    {icon:'view', link:'/user/new'}
  ]
  return (
    <div className={classes.root}>
      <Typography variant="h6" className={classes.title}>
        Home Page
      </Typography>
        <SimpleList title='Players' emptyMesg='No people yet' items={myPeople} primaryTextKey='username'
            linkAccessor={item => '/user/'+item._id}/>
        {usersOpen && <div>all users component here (with loader) and x box</div>}
        <SimpleList title='Groups' emptyMesg='No groups yet' items={myGroups} primaryTextKey='name'
            linkAccessor={item => '/group/'+item._id}/>
          {groupsOpen && <div>all groups component here (with loader) and x box</div>}
    </div>
  )
}, ['user'])
