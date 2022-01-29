import React, { useEffect, useState, useRef } from 'react'
import * as d3 from 'd3';
import { makeStyles } from '@material-ui/core/styles'
import { getPlanetsData, getGoalsData, getStarData } from '../data/planets'
import { findFirstFuturePlanet } from './helpers';
import journeyGenerator from "./journeyGenerator"
import { addWeeks } from '../util/TimeHelpers';

const useStyles = makeStyles((theme) => ({
  root: {
  },
  svg:{
  }
}))

const Journey = ({dimns}) => {
  const styleProps = { };
  const classes = useStyles(styleProps) 
  const containerRef = useRef(null);
  const { screenWidth, screenHeight } = dimns;
  const [journey, setJourney] = useState(undefined)
  const [data, setData] = useState([]);
  console.log("data", data)

  //const goals = getGoalsData().map(g => {

  //})

  //init
  useEffect(() => {
    if(!containerRef.current){return; }

    const journey = journeyGenerator()
      .addPlanet((targetDate, yPC) => {
            const newPlanet = {
                id:new Date().toString().replaceAll(" ", "-").replaceAll(":", "-").replaceAll("+", "-").replaceAll("(", "-").replaceAll(")", "-"),
                targetDate,
                yPC
                //goals
            }
            setData(data => [...data, newPlanet])
      })
      .updatePlanet(properties => {
        setData(data => {
          const rest = data.filter(p => p.id !== properties.id);
          const updatedPlanet = { ...data.find(p => p.id === planet.id), ...properties };
          return [...rest, updatedPlanet]
        })
      })
      .addLink(properties => {
        console.log("adding link", properties)
        //setLinkData
      })
      
    setJourney(() => journey)
    
  }, [])

  useEffect(() => {
    if(!containerRef.current || !journey){return; }
    /*

    const parsedData = getPlanetsData()
        .map((p,i, planets) => ({
            ...p,
            targetDate:new Date(p.targetDate),
            goals:p.goals.map(g => ({
                ...g,
                datasetMeasures:g.datasetMeasures.map(m => ({
                      ...m,
                      startValue:+m.startValue,
                      targetValue:+m.targetValue,
                      //could order the ds here but seemd to cause probalems later when accessing d[0] the latest d
                      datapoints:m.datapoints
                          .map(d => ({
                              date:new Date(d.date),
                              value:+d.value
                          }))
                }))
            }))
        }))

    const data = parsedData
        .sort((a, b) => d3.ascending(a.targetDate, b.targetDate))
        .map((p,i, planets) => ({
            ...p,
            i,
            //first planet has a manually entered startDate (todo - make it default to first datapoint)
            startDate: i === 0 ? new Date(p.startDate) : new Date(planets[i-1].targetDate),
            //if isOpen has been set, we leave it as it is, otherwise must init
            isOpen:typeof p.isOpen == "boolean" ? p.isOpen : p.id === findFirstFuturePlanet(planets)?.id,
        }))
        */


    d3.select(containerRef.current)
      //.datum(data)
      .datum(data)
      .call(journey
        .width(screenWidth)
        .height(screenHeight))
        //.onSetOpenPlanet(setOpenPlanet))

  })


  return (
    <div className={classes.root}>
        <svg className={classes.svg} ref={containerRef}></svg>
    </div>
  )
}

Journey.defaultProps = {
}

export default Journey;
