import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
//children
import PlayerDashboardChartWrapper from "./PlayerDashboardChartWrapper"
//helpers

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2) + "px 0px",
    //border:'solid',
    //borderColor:"blue"
  },
  title:{
    fontSize:"14px"
  }
}))

const PlayerDashboardSection = ({data, settings}) => {
  //console.log("section---------------------", data)
  const classes = useStyles() 

  //todo - add section specifc settings to settings object
  //could also add chart specific settings to each chartdata

  return (
    <div className={classes.root}>
       <Typography variant="h6" className={classes.title}>
          {data.name}
        </Typography>
      {data.chartsData.map((chartData,i)=>
        <PlayerDashboardChartWrapper data={chartData} key={chartData.key} settings={settings} />
      )}
    </div>
  )
}

PlayerDashboardSection.defaultProps = {
  settings:{}
}

export default PlayerDashboardSection;


