import React, { useEffect, useState, useRef } from 'react'
import * as d3 from 'd3';
import { makeStyles } from '@material-ui/core/styles'
import { getPlanetsData, getGoalsData, getStarData } from '../data/planets'
import { findFirstFuturePlanet, updatedState } from './helpers';
import journeyComponent from "./journeyComponent"
import { addMonths, startOfMonth, idFromDates } from '../util/TimeHelpers';
import { channelContainsDate } from './geometryHelpers';

const useStyles = makeStyles((theme) => ({
  root: {
  },
  svg:{
  }
}))

const now = new Date();
const startOfCurrentMonth = startOfMonth(now)
const prevMonths = 12;
const futureMonths = 36;

const numberMonths = prevMonths + futureMonths;
const initChannels = d3.range(numberMonths)
  .map(n => n - prevMonths)
  .map(nr => {
    const startDate = addMonths(nr, startOfCurrentMonth);
    const endDate = addMonths(nr + 1, startOfCurrentMonth);
    return {
      nr,
      startDate,
      endDate,
      isOpen:false,
      id:idFromDates([startDate, endDate])
    }
  })

const Journey = ({dimns}) => {
  const styleProps = { };
  const classes = useStyles(styleProps) 
  const containerRef = useRef(null);
  const { screenWidth, screenHeight } = dimns;
  const [journey, setJourney] = useState(undefined)
  //@todo - put into one state object to avoid multiple updates
  const [planetState, setPlanetState] = useState([]);
  const [linkState, setLinkState] = useState([]);
  const [channelState, setChannelState] = useState(initChannels);
  //const [nrPlanetsCreated, setNrPlanetsCreated] = useState(0);
  //console.log("planetState", planetState)
  //console.log("linkState", linkState)
  const nrPlanetsCreated = useRef(0);
  //const goals = getGoalsData().map(g => {

  //})

  //init
  useEffect(() => {
    if(!containerRef.current){return; }

    const journey = journeyComponent()
    setJourney(() => journey)
    
  }, [])

  useEffect(() => {
    if(!containerRef.current || !journey){return; }
    journey
        .addPlanet((targetDate, yPC) => {
          const newPlanet = {
              id:"p"+ (nrPlanetsCreated.current + 1),
              targetDate,
              yPC
              //goals
          }
          setPlanetState(prevState => [...prevState, newPlanet]);
          //setNrPlanetsCreated(prevState => prevState + 1);
          nrPlanetsCreated.current = nrPlanetsCreated.current + 1;
        })
        .updatePlanet(props => {
          setPlanetState(prevState => updatedState(prevState, props))
        })
        .deletePlanet(id => {
          //must delete link first, but when state is put together this wont matter
          setLinkState(prevState => prevState.filter(l => l.src !== id && l.targ !== id));
          setPlanetState(prevState => prevState.filter(p => p.id !== id));
        })
        .addLink(props => {
          const newLink = {
            ...props,
            id:props.src + "-" + props.targ
          }
          setLinkState(prevState => ([ ...prevState, newLink]))
        })
        .deleteLink(id => {
          setLinkState(prevState => prevState.filter(l => l.id !== id));
        })
        .updateChannel(props => {
          setChannelState(prevState => updatedState(prevState, props, (other, updated) => other.nr < updated.nr))
        })

    d3.select(containerRef.current)
      ////.datum(data)
      .datum({ planets: planetState, links: linkState, channels: channelState })
      .call(journey
        ////.margin({left: screenWidth * 0.1, right: screenWidth * 0.1, top: screenHeight * 0.1, bottom:40})
        .width(screenWidth - 20)
        .height(screenHeight - 20))
        ////.onSetOpenPlanet(setOpenPlanet))

        /*
      if(d3.select(containerRef.current).select("*").empty()){
        const svg = d3.select(containerRef.current)
          .attr("stroke", "black")
          .attr("width", 300)
          .attr("height", 300)

        const outerRect = svg
          .append("rect")
            .attr("class", "outer")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 300)
            .attr("height", 300)
            .attr("fill", "red")

          //.attr("transform", "translate(50,50)");
        const innerRect = svg
          .append("rect")
            .attr("class", "inner")
            .attr("transform", "translate(50,50)")
            .attr("x", 0)
            .attr("y", 100)
            .attr("width", 100)
            .attr("height", 100)
            .attr("fill", "yellow")

        console.log("outer rect bBox", outerRect.node().getBBox())
        console.log("inner rect bBox", innerRect.node().getBBox())
      }
      */
      


  })


  return (
    <div className={classes.root} style={{height: screenHeight, marginTop:10, marginLeft:10 }}>
        <svg className={classes.svg} ref={containerRef}></svg>
    </div>
  )
}

Journey.defaultProps = {
}

export default Journey;
