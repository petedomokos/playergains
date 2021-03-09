import React, {useState, useEffect} from 'react'
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
import {Link} from 'react-router-dom'
import SimpleList from '../util/SimpleList'
import { withLoader } from '../util/HOCs';

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

export default withLoader(function Groups(props) {
  console.log('Groups', props)
  const { groups } = props;
  const classes = useStyles()

    return (
      <Paper className={classes.root} elevation={4}>
        <Typography variant="h6" className={classes.title}>
          Groups
        </Typography>
        {groups.length >= 1 ? 
          <List dense>
          {groups.map((item, i) => {
            console.log('id', item._id)
            return <Link to={"/group/" + item._id} key={i}>
                      <ListItem button>
                        <ListItemAvatar>
                          <Avatar>
                            <Person/>
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={item.name}/>
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
          <div>no groups</div>
        }
      </Paper>
    )
}, ['groups'])
