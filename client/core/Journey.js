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
  const [planetData, setPlanetData] = useState([]);
  const [linkData, setLinkData] = useState([])
  const [nrPlanetsCreated, setNrPlanetsCreated] = useState(0);
  //console.log("planetData", planetData.find(p => p.id === "planet1"))

  //const goals = getGoalsData().map(g => {

  //})

  //init
  useEffect(() => {
    if(!containerRef.current){return; }

    const journey = journeyGenerator()
    setJourney(() => journey)
    
  }, [])

  useEffect(() => {
    if(!containerRef.current || !journey){return; }

    journey
        .addPlanet((targetDate, yPC) => {
          const newPlanet = {
              id:"planet"+ (nrPlanetsCreated + 1),
              targetDate,
              yPC
              //goals
          }
          setPlanetData(prevState => [...prevState, newPlanet]);
          setNrPlanetsCreated(prevState => prevState + 1);
        })
        .updatePlanet(props => {
          setPlanetData(prevState => {
            const rest = prevState.filter(p => p.id !== props.id);
            const updatedPlanet = { ...prevState.find(p => p.id === props.id), ...props };
            return [...rest, updatedPlanet]
          })
        })
        .addLink(props => {
          console.log("adding link", props)
          const newLink = {
            ...props,
            id:props.src + "-" + props.targ
          }
          setLinkData(prevState => ([ ...prevState, newLink]))
        })

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
      .datum({ planetData, linkData })
      .call(journey
        //.margin({left: screenWidth * 0.1, right: screenWidth * 0.1, top: screenHeight * 0.1, bottom:40})
        .width(screenWidth - 20)
        .height(screenHeight - 20))
        //.onSetOpenPlanet(setOpenPlanet))

  })


  return (
    <div className={classes.root} style={{height: screenHeight, marginTop:10, marginLeft:10}}>
        <svg className={classes.svg} ref={containerRef}></svg>
    </div>
  )
}

Journey.defaultProps = {
}

export default Journey;
