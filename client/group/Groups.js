import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import {Link} from 'react-router-dom'
import SimpleList from '../util/SimpleList'
import { withLoader } from '../util/HOCs';
import { filterUniqueById } from '../util/ArrayHelpers';
import { user } from '../Reducers';
import ArrowForward from '@material-ui/icons/ArrowForward'


const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    //padding: theme.spacing(1),
    //margin: theme.spacing(5)
  })
}))

export default withLoader(function Groups(props) {
  const { groups, /*administeredGroups, groupsMemberOf,*/ title, actionButtons, itemAction, emptyMesg } = props;
  const classes = useStyles()

  const addButton = (key) => 
    <Link to={"/groups/new"} key={key}>
      <IconButton aria-label="add-group" color="primary">
        <GroupAddIcon/>
      </IconButton>
    </Link>
  const defaultActionButtons = [addButton]

  const defaultItemAction = {
    itemLinkPath:group => '/group/'+group._id,
    ItemIcon:({}) => <ArrowForward/>
  }

  //todo - sort so administered groups first, then groupsMemberOf, then the rest
  //remeber its just id now

  return (
    <SimpleList
      title={title || 'Groups'} 
      emptyMesg={emptyMesg || 'No groups'}
      items={groups} 
      primaryText={group => group.name}
      itemAction={itemAction || defaultItemAction}
      actionButtons={actionButtons || defaultActionButtons} />
  )
}, ['groupLoadsComplete'])