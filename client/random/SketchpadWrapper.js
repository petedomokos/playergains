import React, { useEffect } from 'react'
import * as d3 from 'd3'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
//children
import SimpleList from '../util/SimpleList'
import auth from '../auth/auth-helper'
//import sketchpad from './sketchpad'


const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2)
  },
  strapline: {
    padding:`${theme.spacing(1)}px ${theme.spacing(1)}px ${theme.spacing(1)}px`,
    color: theme.palette.openTitle
  }
}))

export default function SketchpadWrapper(){
  const classes = useStyles()

  useEffect(() =>{
        
    const svg = d3.select("#chart-area").append("svg")
    .attr("width", 600)
    .attr("height", 400)
    .style('border', 'solid')


    const drag = d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);

    svg.append('circle')
    .attr("cx", 300)
    .attr("cy", 200)
    .attr("r", 10)
    .style('fill', 'black')
    .style('cursor', 'pointer')
    .call(drag)

    function dragstarted(event, d) {
        console.log('start x', event.x)
    //d3.select(this).raise().attr("stroke", "black");
    const start = "M" +event.x +',' +event.y;
    console.log('start', start)
    const newPath = svg.append("path").attr('class', 'drawing')
    //.attr("d", d="M z")
    //.attr('d', "M 5,1 l -4,8 8,0")
    .attr("d", start)
    .attr("stroke", "blue")
    .attr("stroke-width", 2)
    .attr("fill", "none");

    //next step, create a function for the path d attrs
    }

    function dragged(event) {

    d3.select(this)
    .attr("cx", event.x)
    .attr("cy", event.y);

    console.log('d3.event.x', event.x)
    console.log('d3.event.y', event.y)
    const currentPathD = d3.select('path.drawing').node().getAttribute("d")
    const pathStart = currentPathD//.slice(0, currentPathD.length - 1)
    console.log('currentD', currentPathD)
    //console.log('pathStart', pathStart)

    const currentCoods = event.x + ',' + event.y;
    console.log('currentCoods', currentCoods)
    const nextPathD = pathStart + ' ' +currentCoods// + ' z';
    console.log('nextD', nextPathD) 

    d3.select('path.drawing').attr("d", nextPathD)

    //update the path -> its last pos should be the current pos
    //of circle
    }

    function dragended(event, d) {
    //temp remove so we can see next path added
    //d3.select('path').remove('*')
    }

    //todo
    //1. on click svg, move circle to there

    //2. touch event drag:
  }, [])
  return (
      <div className={classes.root}>
        <Typography className={classes.strapline} type="body1" component="p">
          Sketchpad
        </Typography>
        <div id='chart-area'></div>
      </div>
  )
}
