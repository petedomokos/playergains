import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import {Link} from 'react-router-dom'
import SimpleList from '../util/SimpleList'
import { withLoader } from '../util/HOCs';


const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    //padding: theme.spacing(1),
    //margin: theme.spacing(5)
  })
}))

export default withLoader(function Groups(props) {
  console.log('Groups', props)
  const { groups } = props;
  const classes = useStyles()

  const addButton = (key) => 
    <Link to={"/groups/new"} key={key}>
      <IconButton aria-label="add-group" color="primary">
        <GroupAddIcon/>
      </IconButton>
    </Link>
  const actionButtons = [addButton]

  return (
    <SimpleList title='Groups' emptyMesg='No groups' items={groups} 
      primaryText={group => group.name}
      linkPath={group => '/group/'+group._id} actionButtons={actionButtons} />
  )
}, ['groups'])
