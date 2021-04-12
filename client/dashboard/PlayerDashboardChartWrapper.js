import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
//children
import timeSeries from "../charts/time-series/timeSeries";
//helpers

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2) +"px " +theme.spacing(1) +"px",
    //border:'solid',
    //borderColor:"pink",
    display:"flex",
    flexDirection:"column"
  },
  title:{
    fontSize:"12px"
  },
  svg:{
    [theme.breakpoints.down('md')]: {
      width:'90vw',
      height:'calc(90vw * 0.5)'
    },
    [theme.breakpoints.up('lg')]: {
      width:'600px',
      height:'calc(600px * 0.5)'
    },
    alignSelf:"center",
    //border:'solid',
    //borderColor:"black"
  }
}))

const PlayerDashboardChartWrapper= ({data, settings}) => {
  //console.log("chartwrapper", data)
  const classes = useStyles()
  const [chart, setChart] = useState(null);
  const containerRef = useRef(null);
  //create and render chart
  useEffect(() =>{
      if(!chart){
          setChart(() => timeSeries())
      }else{
          const width = containerRef.current.getBoundingClientRect().width;
          const height = containerRef.current.getBoundingClientRect().height;
          const margin = { left:50, right:25, top:25, bottom:50 };
          const sizes = {
              width,
              height,
              margin,
              chartWidth:width - margin.left - margin.right,
              chartHeight:height - margin.top - margin.bottom
          }
          //console.log("sizes", sizes)
          //update chart settings (note - any === undefined will not be set in chart)
          chart
              .sizes(sizes)
              .timeDomain(settings.timeDomain)
             
          const svg =  d3.select(containerRef.current)
          svg
            .datum(data)
            .call(chart)
      }
  })

  return (
    <div className={classes.root}>
      <Typography variant="h6" className={classes.title}>
          {data.name}
      </Typography>
      <svg ref={containerRef} className={classes.svg}></svg>
    </div>
  )
}

PlayerDashboardChartWrapper.defaultProps = {
}

export default PlayerDashboardChartWrapper;


