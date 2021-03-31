import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
//children
import UserProfile from '../user/UserProfile'
import UsersContainer from '../user/containers/UsersContainer'
import GroupsContainer from '../group/containers/GroupsContainer'
import DatasetsContainer from '../dataset/containers/DatasetsContainer'
import { withLoader } from '../util/HOCs';
//helpers
import { userProfile } from '../util/ReduxHelpers'
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
    display:'flex',
    alignItems:'flex-start', //note - when removing this, it makes item stretch more
    flexDirection:'column'
  },
  topRow: {
    //padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
    width:"100%",
    display:"flex",
    justifyContent:"space-between"
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
    flex: props => props.availWidth <= 500 ? '90vw 0 0' : '500px 0 0',
   // maxWidth:'90vw', //keeps it on small mobile screens
    height:'100%',
  },
  quickLinks:{
    height:"50px"
  },
  quickLinkBtn:{

  }
}))

const UserHome = ({user, loading, loadingError}) => {
  const styleProps = { availWidth: screen.availWidth, availHeight:screen.availHeight };
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
              <Button color="primary" variant="contained" className={classes.quickLinkBtn}>add datapoint</Button>
          </Link>
        )}
    </div>
  )
}
export default UserHome 
