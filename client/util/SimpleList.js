import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import ArrowForward from '@material-ui/icons/ArrowForward'
import Person from '@material-ui/icons/Person'


const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    padding: theme.spacing(1),
    margin: theme.spacing(5)
  }),
  title: {
    margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
    color: theme.palette.openTitle
  }
}))

export default function SimpleList({title, emptyMesg, items, primaryTextKey, linkAccessor}) {
  console.log('List', items)
  const classes = useStyles()

    return (
      <Paper className={classes.root} elevation={4}>
        {title && <Typography variant="h6" className={classes.title}>
          {title}
        </Typography>}
        {items.length >= 1 ? 
          <List dense>
          {items.map((item, i) => {
            return <Link to={linkAccessor(item, i)} key={i}>
                      <ListItem button>
                        <ListItemAvatar>
                          <Avatar>
                            <Person/>
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={item[primaryTextKey]}/>
                        <ListItemSecondaryAction>
                        <IconButton>
                            <ArrowForward/>
                        </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                  </Link>
                })
              }
          </List>
          :
          <div>{emptyMesg}</div>
        }
      </Paper>
    )
}

SimpleList.defaultProps = {
    emptyMesg:'None',
    linkAccessor:item => '/'
}
