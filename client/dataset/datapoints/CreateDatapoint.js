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

const useStyles = makeStyles(theme => ({
  card: {
    width:'90vw',
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2)
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
  measuresContainer:{
    display:"flex",
    flexDirection:"column",
    alignItems:'center',
  },
  calculationsContainer:{
    display:"flex",
    flexDirection:"column",
    alignItems:'center',
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  }
}))

function CreateDatapoint({ userId, availableMeasures, creating, error, success, open, submit, closeDialog }) {
    console.log("create datapoint")
  const classes = useStyles()
  const initState = {
      name: '', //must be unique to this user
      initials:'', //max 5 chars
      desc:'',
      datapointType:'',
      measures:[],
      calculations:[],
      admin:[userId]
  }
  const [values, setValues] = useState(initState)


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
        measures: values.measures.map(m => ({ ...m, _id:undefined })),
        calculations: values.calculations.map(c => ({ ...c, _id:undefined })),
        admin:values.admin || [userId]
      };

      submit(datapoint);
    //}
  }

  const reset = () =>{
    //console.log('reset-------')
      closeDialog();
      setValues(initState)
  }

  const addItemToProperty = key => item =>{
    setValues(prevState => ({ ...prevState, [key]:[...prevState[key], item] }))
  }

  const updateItemInProperty = key => (id, propertiesToUpdate) =>{
    const itemToUpdate = values[key].find(item => item._id === id);
    const updatedItem = {...itemToUpdate, ...propertiesToUpdate};
    const otherItems = values[key].filter(item => item._id !== id)
    setValues(prevState => ({ ...prevState, [key]:[...otherItems, updatedItem] }));
  }

  const removeItemFromProperty = key => item =>{
    setValues(prevState => ({
      ...prevState,
      [key]:prevState[key].filter(it => it._id !== item._id) 
    }));
  }

  return (<div>
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" className={classes.title}>
          Create Datapoint
        </Typography>
        <TextField 
              id="name" label="name" className={classes.textField} value={values.name} 
              onChange={handleChange('name')} margin="normal"/><br/>
        <TextField 
            id="initials" label="Initials (max 5)" className={classes.textField} 
        value={values.initials} onChange={handleChange('initials')} margin="normal"/><br/>
        <TextField 
            id="desc" label="Description" className={classes.textField} 
            value={values.desc} onChange={handleChange('desc')} margin="normal"/><br/>
        <br/> {
          values.error && (<Typography component="p" color="error">
            <Icon color="error" className={classes.error}>error</Icon>
            {values.error}</Typography>)
        }
        {/**<div className={classes.measuresContainer}>
          <CreateDatapointMeasureValues
              available={availableMeasures} 
              current={values.measures}
              add={addItemToProperty("measures")}
              update={updateItemInProperty("measures")}
              remove={removeItemFromProperty("measures")} />
            </div>**/}

         {/**current.length != 0 && <SelectMainDisplayValue calculations={current} />  can be a measure or a calculation**/}
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
  availableMeasures:[]
}

//note - loader will load user if no datapoints
export default withLoader(CreateDatapoint, ['datasets',/* 'measures'*/]);