import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import SketchpadWrapper from '../random/SketchpadWrapper'
//children
import SimpleList from '../util/SimpleList'
import auth from '../auth/auth-helper'


const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2)
  },
  strapline: {
    padding:`${theme.spacing(1)}px ${theme.spacing(1)}px ${theme.spacing(1)}px`,
    color: theme.palette.openTitle
  }
}))

export default function NonUserHome(){
  const classes = useStyles()
  return (
      <div className={classes.root}>
        <Typography className={classes.strapline} type="body1" component="p">
          Data visuals for player development 
        </Typography>
        <SketchpadWrapper/>
      </div>
  )
}
