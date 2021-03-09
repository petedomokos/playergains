import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
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
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'


const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    //padding: theme.spacing(1),
    margin: `${theme.spacing(1)}px`,
    paddingTop: theme.spacing(2),
    height:'calc(100% - '+theme.spacing(4) +'px)'
  }),
  content:{
    height:'calc(100% - 60px - '+theme.spacing(6) +'px)',
    overflowY:'auto'
  },
  actions:{
    height:'50px',
    display:'flex',
    justifyContent:'flex-end'
  },
  title: {
    margin: `0 ${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(2)}px`,
    color: theme.palette.openTitle
  }
}))

export default function SimpleList({title, emptyMesg, items, actionButtons, primaryText, linkAccessor, styles}) {
  console.log('List', items)
  const classes = useStyles(styles);

    return (
      <Card className={classes.root} elevation={4}>
         <CardContent className={classes.content}>
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
                          <ListItemText primary={primaryText(item,i)}/>
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
            <div  className={classes.title}>{emptyMesg}</div>
          }
         </CardContent>
         <CardActions className={classes.actions}>
          {actionButtons.map((btn,i) => btn(title+i))}
        </CardActions>
      </Card>
    )
}

SimpleList.defaultProps = {
    title:'',
    emptyMesg:'None',
    linkAccessor:item => '/',
    styles:{}
}
