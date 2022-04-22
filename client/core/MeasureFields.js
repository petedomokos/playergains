import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/core/styles'
import { DIMNS } from "./constants"

const useStyles = makeStyles(theme => ({
  root: {
  }
}))

export default function MeasureFields({ }) {
    const styleProps = { };
    const classes = useStyles(styleProps) 

    return (
        <div className={classes.root}>
           Measures
        </div>
        )
}
