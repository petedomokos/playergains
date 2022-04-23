import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/core/styles'
import { DIMNS } from "./constants"

const useStyles = makeStyles(theme => ({
  root: {
      width:"100%",
      display:"flex",
      flexDirection:"column",
      alignItems:"center"
  },
  title: {
    margin: theme.spacing(1),
    marginTop:0,
    color: theme.palette.openTitle,
    fontSize:"10px",
    display:"flex",
    display:"flex",
    height:"40px",
    [theme.breakpoints.down('md')]: {
      width:"80%",
      //fontSize:"40px"
    },
    [theme.breakpoints.up('lg')]: {
      width:"400px"
    },
  },
}))

export default function MeasureFields({ }) {
    const styleProps = { };
    const classes = useStyles(styleProps) 

    return (
        <div className={classes.root}>
            <Typography variant="h6" className={classes.title}>
            Measures
          </Typography>
        </div>
        )
}
