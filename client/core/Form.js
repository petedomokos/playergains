import React, {useState} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/core/styles'
import MeasureFields from "./MeasureFields";
import { DIMNS } from "./constants"

const useStyles = makeStyles(theme => ({
  card: {
    [theme.breakpoints.down('md')]: {
      width: "100%",
      height:"100%",
    },
    [theme.breakpoints.up('lg')]: {
      width: "500px",
      height:"700px",
    },
    margin: 'auto',
    textAlign: 'center',
    marginTop: 0, // props => props.fullEdit ? 0 : 10,
    paddingBottom: props => props.fullEdit ? theme.spacing(1) : 0,
  },
  cardContent:{
      //border:"solid",
      padding:0
  },
  error: {
    verticalAlign: 'middle'
  },
  textField: {
    //border:"solid",
    margin: theme.spacing(1),
    height:"40px",
    [theme.breakpoints.down('md')]: {
      width:"80%",
      //fontSize:"40px"
    },
    [theme.breakpoints.up('lg')]: {
      width:"400px"
    },
  },
  resize:{
    margin:0,
    fontSize:"12px",
    [theme.breakpoints.down('md')]: {
      fontSize:"10px"
    },
    [theme.breakpoints.up('lg')]: {
      fontSize:"12px"
    },
  },
}))

export default function Form({ data, onUpdate, onClose }) {
    const { d } = data;
    const styleProps = { };
    const classes = useStyles(styleProps) 
    const [values, setValues] = useState({
        name: d?.name || "",
        error: ""
    })

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value })
        onUpdate(name, event.target.value)
    }

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
                id="name" type="name" placeholder="Name" 
                className={classes.textField} 
                autoComplete='off'
                value={values.name} 
                onChange={handleChange('name')}
                onKeyDown={handleKeyDown}
                margin="none"
                size="small"
                InputProps={{
                    classes: {
                        input: classes.resize,
                    },
                }}
            /><br/>
            <MeasureFields/>
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
