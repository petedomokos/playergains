import React, {useState} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/core/styles'
import { DIMNS } from "./constants"

const useStyles = makeStyles(theme => ({
  card: {
    width: "100%",
    height:"100%",
    margin: 0,
    textAlign: 'center',
    paddingBottom: 0,
  },
  cardContent:{
      //border:"solid",
      margin:0,
      padding:0
  },
  error: {
    verticalAlign: 'middle'
  },
  textField: {
    //border:"solid",
    margin: 0,//theme.spacing(1),
    width:"100%",
    height:"100%",
    fontSize:"10px",
  },
  resize:{
    margin:0,
  },
}))

export default function NameForm({ data, onUpdate, onClose }) {
    const { d, fullEdit=true } = data;
    const styleProps = { fullEdit };
    const classes = useStyles(styleProps) 
    const [values, setValues] = useState({
        name: d?.name || "",
        error: ""
    })

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value })
        onUpdate(name, event.target.value)
    }

    //fix bug i put in by changing setFormData to recieve d and fullEdit
    //then if not fulEdit, should not zoom etc, just show name textfield over name
    //toido - make name form come up on click name, but just nameform over the name
    const handleKeyDown = (e) =>{
        if(e.keyCode === 13){
            onClose();
        }
    }

    return (
        <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
            <TextField
                type="submit"
                id="name" type="name" label="Name" 
                className={classes.textField} 
                value={values.name} 
                onChange={handleChange('name')}
                onKeyDown={handleKeyDown}
                margin="none"
                InputProps={{
                    classes: {
                        input: classes.resize,
                    },
                }}
            /><br/>
            <br/> {
                values.error && (<Typography component="p" color="error">
                <Icon color="error" className={classes.error}>error</Icon>
                {values.error}
                </Typography>)
            }
            </CardContent>
        </Card>
        )
}
