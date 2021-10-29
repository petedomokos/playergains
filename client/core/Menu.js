import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import Button from '@material-ui/core/Button'
import auth from '../auth/auth-helper'
import {Link, withRouter} from 'react-router-dom'
import { slide as ElasticMenu } from 'react-burger-menu'

const isActive = (history, path) => {
  if (history.location.pathname == path)
    return {color: '#ff4081'}
  else
    return {color: '#ffffff'}
}


const useStyles = makeStyles(theme => ({
  root: {
  },
  items:{
    //flexDirection:props => ["s", "m"].includes(props.screenSize) ? "column" : "column"
  },
  logo:{
    [theme.breakpoints.down('sm')]: {
      fontSize:"12px",
    },
    [theme.breakpoints.up('lg')]: {
      //fontSize:"16px",
    },

  },
  homeIcon:{
    [theme.breakpoints.down('sm')]: {
      height:"20px",
      //width:"50px",
    },
    [theme.breakpoints.up('lg')]: {
    },

  },
  menuBtn: {
    [theme.breakpoints.down('md')]: {
      fontSize:"12px",
    },
    [theme.breakpoints.up('lg')]: {
      //fontSize:"16px",
    },
    
  }
}))

const Menu = withRouter(({ history, signingOut, screenSize, onSignout }) => {
  //const styleProps = { screenSize };
  const classes = useStyles(/*styleProps*/) 
  const user = auth.isAuthenticated() ? auth.isAuthenticated().user : null;
  return(
    <>
      {["s", "m"].includes(screenSize)  ?
        <ElasticMenu width={150}>
          <div style={{display:"flex", flexDirection:"column"}}>
            <MenuItems user={user} history={history} signingOut={signingOut} 
                                screenSize={screenSize} onSignout={onSignout} classes={classes}/>
          </div>
        </ElasticMenu>
        :
        <MenuItemsWrapper classes={classes}>
          <MenuItems user={user} history={history} signingOut={signingOut} 
                      screenSize={screenSize} onSignout={onSignout} classes={classes} />
        </MenuItemsWrapper>
      }
    </>
  )
})

const MenuItemsWrapper = ({ children, classes }) =>
  <AppBar position="static" className={classes.root}>
      <Toolbar className={classes.items}>
          {children}
      </Toolbar>
  </AppBar>

const MenuItems = ({ user, history, signingOut, screenSize, onSignout, classes }) =>
    <>
       <Typography variant="h6" color="inherit" className={classes.logo}>
          Switchplay
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
        <Link to={"/expression"}>
              <Button
                className={classes.menuBtn}
                style={isActive(history, "/expression")}>expression
              </Button>
            </Link>
    </>

export default Menu
