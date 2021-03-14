import React, { useState, useEffect } from 'react'
//styles
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import PersonAddIcon from '@material-ui/icons/AddCircle';
import ArrowForward from '@material-ui/icons/ArrowForward'
//children
import DatasetProfile from './DatasetProfile';
import UsersContainer from '../user/containers/UsersContainer'
import { withLoader } from '../util/HOCs';
import SimpleList from '../util/SimpleList';
import { isSameById } from '../util/ArrayHelpers';
import auth from '../auth/auth-helper'

const useStyles = makeStyles(theme => ({
  dashboard:{
    margin:'50px'
  },
  list:{
    width:'400px',
    maxWidth:'90vw'

  }
}))

//component
function Dataset(props) {
  const { dataset, updateDatapoints, datapointsUpdating, datapointsUpdated, datapointUpdateError } = props;
  const classes = useStyles();
  const [showDatapointsToAdd, setShowDatapointsToAdd] =  useState(false);
  const [updatedDatapoints, setUpdatedDatapoints] = useState(dataset.datapoints);

  useEffect(() => {
    return () => {
      //todo - ask user if they wish to save if there is unsaved changes
      //reset
      //closeDialog();
    };
  }, []); // will only apply once, not resetting the dialog at teh end of every render eg re-renders

  //helper
  const datapointsHaveChanged = !isSameById(dataset.datapoints, updatedDatapoints);
  
  const onAddDatapoint= user =>{
    setUpdatedDatapoints(prevState => [...prevState, user])
  }

  const onRemoveDatapoint = user =>{
    setUpdatedDatapoints(prevState => prevState.filter(us => us._id !== user._id))
  }

  const onClickCancel = () =>{
    setShowDatapointsToAdd(false);
    setUpdatedDatapoints(dataset.datapoints);
  }

  const onClickSubmit = () =>{
      setShowDatapointsToAdd(false)
      //we use form data as that is required for updateDataset request
      let formData = new FormData();
      formData.append('datapoints', updatedDatapoints.map(us => us._id))
      //we dont pass history as we dont need to redirect
      updateDatapoints(dataset._id, formData)
      //note - we will open dialog that saves saving, then saved, then disappears by itself (unless error)
  }
  const addButton = (key) => 
      <IconButton aria-label="add-datapoint" color="primary" key={key}
        onClick={() => setShowDatapointsToAdd(true)}>
        <EditIcon/>
      </IconButton>

  const cancelButton = (key) => 
      <Button aria-label="add-datapoint" color="secondary" key={key}
        onClick={onClickCancel}>
        Cancel
      </Button>

  const saveButton = (key) => 
      <Button aria-label="add-datapoint" color="secondary" key={key}
        onClick={onClickSubmit}>
        Save changes
      </Button>
  var adminActionButtons = [];
  if(!showDatapointsToAdd){
    adminActionButtons.push(addButton);
  }else{
    adminActionButtons.push(cancelButton);
  }
  if(datapointsHaveChanged){
    adminActionButtons =  [saveButton, cancelButton];
  }
 
  const nonAdminActionButtons = [];
  const jwt = auth.isAuthenticated();
  
  //dataset.admin has been loaded up in DatasetContainer so not just id
  const actionButtons = jwt && dataset.admin.find(user => user._id === jwt.user._id) ? 
    adminActionButtons : nonAdminActionButtons;

  const addDatapointItemActions = {
    main:{
      onItemClick:onAddDatapoint,
      ItemIcon:({}) => <AddCircleIcon/>
    }
  }
  //we want buttons to switch from the main froward arrow (for datapoint link)
  //when not editing, to the delete idon when editing.
  //using main and other gives a positional difference to make it obvious
  const removeDatapointItemActions = {
    main:{
      itemLinkPath:(item) =>'/user/'+item._id, 
      ItemIcon:showDatapointsToAdd ? () => null : ArrowForward
    },
    other:[{
      onClick:showDatapointsToAdd ? onRemoveDatapoint : () => {},
      ItemIcon: showDatapointsToAdd ? DeleteIcon : () => null
    }]
  }

  //we exclude datapoints that are in the new version of dataset from datapoints to add list, even before saved
  //note that all dataset datapoints are also put into loadedusers list in store when dataset is loaded
  //although these will be reloaded anyway if users havent all been loaded yet (as currently set up)
  return (
    <div>
      <DatasetProfile profile={dataset} />
      <div className={classes.lists}>
          <SimpleList 
            title='Datapoints in dataset' 
            emptyMesg='No datapoints yet' 
            items={updatedDatapoints}
            itemActions={removeDatapointItemActions}
            actionButtons={actionButtons}
            primaryText={user => user.firstname + ' ' +user.surname}/>

          {showDatapointsToAdd && <div className={classes.list}>
            <UsersContainer
              title='Datapoints to add'
              emptyMesg='No datapoints left to add'
              exclude={updatedDatapoints.map(us => us._id)}
              itemActions={addDatapointItemActions}
              actionButtons={[]} />
          </div>}
      </div>
      <div className={classes.dashboard}>
        This datasets profile and dashboard (includes links for editing/deleting
         - but only if this dataset is administered by signedin user])
      </div>
    </div>
  )
}
const Loading = <div>Dataset is loading</div>
//must load user if we dont have the deep version eg has datapoints property
export default withLoader(Dataset, ['dataset.datapoints'], {alwaysRender:false, LoadingPlaceholder:Loading});
