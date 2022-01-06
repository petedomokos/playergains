import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
//children
import UserProfile from '../user/UserProfile'
import UsersContainer from '../user/containers/UsersContainer'
import GroupsContainer from '../group/containers/GroupsContainer'
import DatasetsContainer from '../dataset/containers/DatasetsContainer'
import Journey from "./Journey"

const useStyles = makeStyles((theme) => ({
  root: {
    //margin: theme.spacing(2),
    display:'flex',
    alignItems:'flex-start', //note - when removing this, it makes item stretch more
    flexDirection:'column'
  },
  mainVis:{
    height:props => props.availHeight - props.topBarHeight,
    width:props => props.availWidth
  },
  topRow: {
    //padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
    width:"100%",
    display:"flex",
    justifyContent:"space-between",
    flexWrap:"wrap"
  },
  lists:{
    height:'400px',
    marginTop:`${theme.spacing(4)}px`,
    alignSelf:'stretch',
    display:'flex',
    justifyContent:'space-around',
    flexWrap:'wrap'
  },
  list:{
    [theme.breakpoints.down('md')]: {
      width:"90vw"
    },
    [theme.breakpoints.up('lg')]: {
      width:"400px"
    },
    height:'100%',
  },
  quickLinks:{
    height:"50px"
  },
  quickLinkBtn:{

  }
}))

const UserHome = ({user, loading, loadingError}) => {
  const topBarHeight = 100;
  console.log("inner", window.innerHeight)
  console.log("avail", screen.availHeight)
  const styleProps = { 
    availWidth: window.innerWidth, //screen.availWidth, 
    availHeight:window.innerHeight, //screen.availHeight,
    topBarHeight
  };
  const classes = useStyles(styleProps) 
  //for now, keep it simple for page refreshes - until user reloads, dont render the children.
  //note - cant use withRouter in MainRouter as we only want it to load user if signed in

  const quickLinks = [
    {label:"Add datapoint", to:"/datapoints/new"}
  ]

  return (
    <div className={classes.root}>
      {user._id && 
        <>
          <div className={classes.mainVis}>
            <Journey dimns={{screenWidth:styleProps.availWidth, screenHeight:styleProps.availHeight - topBarHeight}}/>
          </div>
          {/**
          <div className={classes.topRow} >
              <UserProfile profile={user} />
              <QuickLinks links={quickLinks}/>
          </div>
          <div className={classes.lists}>
              <div className={classes.list}>
                <UsersContainer/>
              </div>
              <div className={classes.list}>
                <GroupsContainer/>
              </div>
              <div className={classes.list}>
                <DatasetsContainer/>
              </div>
          </div>
          **/}
          
      </>}
    </div>
  )
}

UserHome.defaultProps = {
}

const QuickLinks = ({links}) =>{
  const classes = useStyles()
  return(
    <div className={classes.quickLinks}>
        {links.map(link =>
          <Link to={link.to} key={"quicklink-"+link.to}>
              <Button color="primary" variant="contained" className={classes.quickLinkBtn}>{link.label}</Button>
          </Link>
        )}
    </div>
  )
}
export default UserHome 
