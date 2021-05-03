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
  },
  sectionChart:{
    [theme.breakpoints.down('md')]: {
      height:"250px",
      width:"90vw"
  },
  [theme.breakpoints.up('lg')]: {
      height:"500px",
      width:"300px"
  },
  }
}))

const PlayerDashboardSection = ({sectionType, data, settings}) => {
  //console.log("section---------------------", data)
  const classes = useStyles() 

  //todo - add section specifc settings to settings object
  //could also add chart specific settings to each chartdata

  return (
    <div className={classes.root}>
       <Typography variant="h6" className={classes.title}>
          {sectionType}: {data.name}
        </Typography>
      {data.chartsData.map((chartData,i)=>
        <div className={classes.sectionChart} key={chartData.key}>
            <PlayerDashboardChartWrapper
                chartType="timeSeries"
                data={chartData}
                settings={settings}
                />
        </div>
      )}
    </div>
  )
}

PlayerDashboardSection.defaultProps = {
  settings:{}
}

export default PlayerDashboardSection;


