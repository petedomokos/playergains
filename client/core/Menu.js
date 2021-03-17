import React from 'react'
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
const Menu = withRouter(({history, onSignout}) => {
  const user = auth.isAuthenticated() ? auth.isAuthenticated().user : null;
  return(
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit">
          Switchplay (dev)
        </Typography>
        <Link to="/">
          <IconButton aria-label="Home" style={isActive(history, "/")}>
            <HomeIcon/>
          </IconButton>
        </Link>
        {
          !user && (<span>
            {/**<Link to="/signup">
              <Button style={isActive(history, "/signup")}>Sign up
              </Button>
          </Link>**/}
            <Link to="/signin">
              <Button style={isActive(history, "/signin")}>Sign In
              </Button>
            </Link>
          </span>)
        }
        {
          user && user.isPlayer && (<span>
            <Link to={"/user/" + auth.isAuthenticated().user._id}>
              <Button style={isActive(history, "/user/" + auth.isAuthenticated().user._id)}>My Dashboard</Button>
            </Link>
          </span>)
        }
        {
          user && (<span>
            <Button color="inherit" onClick={() => onSignout(history)}>Sign out</Button>
          </span>)
        }
      </Toolbar>
    </AppBar>
  )
})

export default Menu
