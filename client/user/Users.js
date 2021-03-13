import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {Link} from 'react-router-dom'
import SimpleList from '../util/SimpleList'
import { withLoader } from '../util/HOCs';
import IconButton from '@material-ui/core/IconButton'
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ArrowForward from '@material-ui/icons/ArrowForward'

const useStyles = makeStyles(theme => ({
}))

export default withLoader(function Users(props) {
  const { users, /*administeredUsers,*/ title, actionButtons, itemAction, emptyMesg } = props;
  const classes = useStyles()

  const addButton = (key) => 
    <Link to={"/users/new"} key={key}>
      <IconButton aria-label="add-player" color="primary">
        <PersonAddIcon/>
      </IconButton>
    </Link>
  const defaultActionButtons = [addButton]
  
  const defaultItemAction = {
    itemLinkPath:user => '/user/'+user._id,
    //onItemClick:(item, i) => { alert('item '+i)},
    ItemIcon:({}) => <ArrowForward/>
  }

  //todo - sort so administreed users first //remeber its just id now

  return (
    <SimpleList 
      title={title || 'Players'} 
      emptyMesg={emptyMesg || 'No users'}
      items={users} 
      primaryText={user => user.firstname + ' ' +user.surname}
      itemAction={itemAction || defaultItemAction}
      actionButtons={actionButtons || defaultActionButtons}/>
  )
}, ['userLoadsComplete'])
