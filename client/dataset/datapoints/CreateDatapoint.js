import React, { useState, useEffect } from 'react'
import {Link} from 'react-router-dom'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { withLoader } from '../../util/HOCs';
import { DropdownSelector } from "../../util/Selector";
import SelectPlayer from "./SelectPlayer";
import SelectEventDate from "./SelectEventDate";
import EnterGeneralValues from "./EnterGeneralValues";
import EnterMeasureValues from "./EnterMeasureValues";
import { fatigueLevel, surface } from "../../data/datapointOptions";

const useStyles = makeStyles(theme => ({
  card: {
    width:'90vw',
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
    display:'flex',
    flexDirection:'column',
    alignItems:'center'
  },
  error: {
    verticalAlign: 'middle'
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '90%'
  },
  dateContainer:{
    marginTop: theme.spacing(6)
  },
  generalValuesContainer:{
    marginTop: theme.spacing(10),
    display:"flex",
    flexDirection:"column",
    alignItems:'center',
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  },
  otherBtn:{
    margin: theme.spacing(1)
  }
}))

function CreateDatapoint({ userId, datasets, players, creating, error, success, open, submit, closeDialog, userLoadsComplete, loadUsers, loadingUsers, loadDataset, loadingDataset }) {
  console.log("create datapoint", datasets)
  console.log("loadingUsers", loadingUsers)
  const classes = useStyles()
  const _fatigueLevel = fatigueLevel || {};
  const _surface = surface || {};
  const initState = {
      dataset:null,
      player: null,
      notes:"",
      surface:surface.default || "",
      fatigueLevel:fatigueLevel.default || "",
      eventDate:Date.now(),
      isTarget:false,
      //location:"", //todo - location geography
      measureValues:[],
  }
  const [values, setValues] = useState(initState)
  const [showGeneralMeasures, setShowGeneralMeasures] = useState(false)
  console.log("values", values)
  useEffect(() =>{
    //update dataset in state once the dataset measures have been loaded from the server for the selected dataset
    //(needed so select options are in sync with selection, and for easy access of dataset measures)
    if(values.dataset){
      const updatedDataset = datasets.find(d => d._id === values.dataset._id);
      const updatedMeasureValues = updatedDataset.measures ? 
        updatedDataset.measures.map(m => ({
          measure:m._id,
          value:""
      })) : [];
      setValues(prevState => ({ 
          ...prevState, 
          dataset: updatedDataset,
          measureValues: updatedMeasureValues
      }))
    }
  }, [datasets])


  //useEffect to reset dialog and error when unmounting (in case user moves away from component)
  //if this doesnt work, we can always reset in useEffcet itself if need be, although thats a bit wierd
  useEffect(() => {
    //note - if we check open here, it gives false, dont know why, so we just closeDialog always.
    return () => {
        closeDialog();
      //if(error || success){
        //resetAsyncProcesses
     // }
    };
  }, []); // will only apply once, not resetting the dialog at teh end of every render eg re-renders

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value })
  }

  const handleDateChange = event => {
    const now = new Date()
    const date = new Date(event.target.value) 
    const _isTarget = now < date ? true : false
    console.log('now < date ? ', (now < date))
    setValues({...values, eventDate:date.getTime(), isTarget:_isTarget})
  }

  const clickSubmit = () => {
    /*
    if(...){
      alert('...')
    }
    else if(...){
      alert('....')
    }
    else{
        */
      const datapoint = {
        parent: values.parent || undefined,
        name: values.name || undefined,
        initials: values.initials || undefined,
        desc: values.desc || undefined,
        datapointType: values.datapointType || undefined,
        //we dont save measure._id to server, as it is given an _id in db
        measures: values.measureValues.map(m => ({ ...m, _id:undefined })),
        createdBy:userId,
      };

      submit(datapoint);
    //}
  }

  const reset = () =>{
    //console.log('reset-------')
      closeDialog();
      setValues(initState)
  }

  const handleMeasureChange = (event, measure) =>{
    //note - in measureValue, measure is just the measure _id ref(see value.model)
    const measureValueToUpdate = values.measureValues.find(m => m.measure === measure._id);
    const updatedMeasureValue = { ...measureValueToUpdate, value : event.target.value };
    const otherMeasureValues = values.measureValues.filter(m => m.measure !== measure._id)
    setValues(prevState => ({ ...prevState, measureValues:[...otherMeasureValues, updatedMeasureValue] }));
  }

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
            <Typography variant="h6" className={classes.title}>
              Create Datapoint
            </Typography>
            <DropdownSelector
                description="Dataset"
                selected={values.dataset}
                options={datasets}
                labelAccessor = {option => option.name}
                handleChange={handleChange('dataset')} 
                style={{width:"350px"}}
                />
            <SelectPlayer
                selected={values.player}
                players={players}
                handleChange={handleChange('player')}
                userLoadsComplete={userLoadsComplete}
                onLoad={loadUsers}
                loading={loadingUsers}
                style={{width:"350px"}}
                />
            <SelectEventDate 
              handleChange={handleDateChange} 
              selectedDate={values.eventDate}
              classes={classes}
            />
            {values.dataset && values.player && <EnterMeasureValues
                measures={values.dataset.measures}
                values={values.measureValues}
                handleChange= {handleMeasureChange}
                onLoad={() => loadDataset(values.dataset._id)}
                loading={loadingDataset}
            />}
            <div className={classes.generalValuesContainer}>
                <Button
                  onClick={() => setShowGeneralMeasures(prevState => !prevState)}
                  className={classes.otherBtn}
                  color="primary" autoFocus="autoFocus" variant="contained">
                  {showGeneralMeasures ? "Hide options" : "Show more options"}
                </Button>
                {showGeneralMeasures && <EnterGeneralValues
                      values={values}
                      optionObjects = {{
                        fatigueLevel:fatigueLevel,
                        surface:surface
                      }}
                      handleChange={handleChange}
                      />}
            </div>
        </CardContent>
        <CardActions>
            <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Submit</Button>
        </CardActions>
      </Card>
      <Dialog open={open} disableBackdropClick={true}>
          <DialogTitle>New Datapoint</DialogTitle>
          <DialogContent>
            <DialogContentText>
              New datapoint successfully created.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={reset} color="primary" autoFocus="autoFocus" variant="contained">
            Create another
            </Button>
            <Link to={"/"} >
                <Button color="primary" autoFocus="autoFocus" variant="contained">
                Return home
                </Button>
            </Link>
          </DialogActions>
      </Dialog>
    </div>
  )
}

CreateDatapoint.defaultProps = {
  availableMeasures:[],
  open:false,
  loadDataset:() =>{}
}

//note - loader will load user if no datapoints
export default withLoader(CreateDatapoint, ['datasets', /* 'measures'*/]);