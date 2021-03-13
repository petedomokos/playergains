import React, { } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import GroupProfile from './GroupProfile';
import UsersContainer from '../user/containers/UsersContainer'
import { withLoader } from '../util/HOCs';
import SimpleList from '../util/SimpleList'
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import PersonAddIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton'
//helper

const useStyles = makeStyles(theme => ({
  dashboard:{
    margin:'50px'
  },
  list:{
    width:'400px',
    maxWidth:'90vw'

  }
}))

function Group(props) {
  console.log('Group props', props)
  const { group } = props;
  const classes = useStyles();

  const addButton = (key) => 
      <IconButton aria-label="add-player" color="primary" key={key}
        onClick={() => alert('add player')}>
        <PersonAddIcon/>
      </IconButton>
  const actionButtons = [addButton]

  const addPlayerItemAction = {
    onItemClick:(item, i) => { alert('add item '+i)},
    ItemIcon:({}) => <AddCircleIcon/>
  }
  const removePlayerItemAction = {
    onItemClick:(item, i) => { alert('remove item '+i)},
    ItemIcon:({}) => <RemoveCircleIcon/>
  }

  return (
    <div>
      <GroupProfile profile={group} />
      <div className={classes.lists}>
          <SimpleList 
            title='Players in group' 
            emptyMesg='No players yet' 
            items={group.players}
            itemAction={removePlayerItemAction}
            actionButtons={actionButtons}
            primaryText={user => user.firstname + ' ' +user.surname}/>

          <div className={classes.list}>
            <UsersContainer
              title='Players to add'
              emptyMesg='No players left to add'
              exclude={group.players.map(us => us._id)}
              itemAction={addPlayerItemAction} />
        </div>
      </div>
      <div className={classes.dashboard}>
        This groups profile and dashboard (includes links for editing/deleting
         - but only if this group is administered by signedin user])
      </div>
    </div>
  )
}
const Loading = <div>Group is loading</div>
//must load user if we dont have the deep version eg has players property
export default withLoader(Group, ['group.players'], {alwaysRender:false, LoadingPlaceholder:Loading});
