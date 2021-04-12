import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import Button from '@material-ui/core/Button'
import auth from './../auth/auth-helper'
import {Link, withRouter} from 'react-router-dom'

const isActive = (history, path) => {
  if (history.location.pathname == path)
    return {color: '#ff4081'}
  else
    return {color: '#ffffff'}
}


const useStyles = makeStyles(theme => ({
  root: {
  },
  toolbar:{

  },
  logo:{
    [theme.breakpoints.down('md')]: {
      fontSize:"24px",
    },
    [theme.breakpoints.up('lg')]: {
      fontSize:"16px",
    },

  },
  homeIcon:{
    [theme.breakpoints.down('md')]: {
      height:"50px",
      width:"50px",
    },
    [theme.breakpoints.up('lg')]: {
    },

  },
  menuBtn: {
    [theme.breakpoints.down('md')]: {
      fontSize:"24px",
    },
    [theme.breakpoints.up('lg')]: {
      fontSize:"16px",
    },
    
  }
}))
const Menu = withRouter(({history, onSignout}) => {
  const classes = useStyles()
  const user = auth.isAuthenticated() ? auth.isAuthenticated().user : null;
  return(
    <AppBar 
        position="static" className={classes.root}>
      <Toolbar 
          className={classes.toolbar}>
        <Typography variant="h6" color="inherit" className={classes.logo}>
          Switchplay (dev)
        </Typography>
        <Link to="/">
          <IconButton 
              aria-label="Home" 
              style={isActive(history, "/")}>
              <HomeIcon
                  className={classes.homeIcon}/>
          </IconButton>
        </Link>
        {
          !user && (<span>
            <Link to="/signup">
              <Button
                className={classes.menuBtn}
                style={isActive(history, "/signup")}>Sign up
              </Button>
          </Link>
            <Link to="/signin">
              <Button 
                className={classes.menuBtn}
                style={isActive(history, "/signin")}>Sign In
              </Button>
            </Link>
          </span>)
        }
        {
          user && (<span>
            <Link to={"/user/" + auth.isAuthenticated().user._id}>
              <Button
                className={classes.menuBtn}
                style={isActive(history, "/user/" + auth.isAuthenticated().user._id)}>My Profile
              </Button>
            </Link>
          </span>)
        }
        {
          user && user.isPlayer && (<span>
            <Link to={"/user/" + auth.isAuthenticated().user._id+"/dashboard"}>
              <Button
                className={classes.menuBtn}
                style={isActive(history, "/user/" + auth.isAuthenticated().user._id+"/dashboard")}>My Dashboard
              </Button>
            </Link>
          </span>)
        }
        {
          user && (<span>
            <Button
              className={classes.menuBtn}
              color="inherit" 
              onClick={() => onSignout(history)}>Sign out
            </Button>
          </span>)
        }
      </Toolbar>
    </AppBar>
  )
})

export default Menu
