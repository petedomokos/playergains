import React, { useEffect, useState, useRef, useCallback } from 'react'
import * as d3 from 'd3';
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { getPlanetsData, getGoalsData, getStarData } from '../data/planets'
import { createId, findFirstFuturePlanet, updatedState } from './helpers';
import journeyComponent from "./journeyComponent"
import { addMonths, startOfMonth, idFromDates } from '../util/TimeHelpers';
import { channelContainsDate } from './geometryHelpers';
import NameForm from "./form/NameForm";
import MeasureForm from "./form/MeasureForm";
import TargetForm from './form/TargetForm';
import Form from "./form/Form"
import { DIMNS } from './constants';

const useStyles = makeStyles((theme) => ({
  root: {
    position:"relative"
  },
  svg:{
    //position:"absolute"
  },
  form:{
    position:"absolute",
    left:props => props.form?.left,
    top:props => props.form?.top,
    width:props => props.form?.width, 
    height:props => props.form?.height
  },
  ctrls:{
    display:"flex"
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

const mockMeasures = [
    { id:"mock1", name:"Puts Per Round", desc: "Reduce the nr of puts" },
    { id:"mock2", name:"Drive 1", desc: "Increase D1 to Fairway" },
    { id:"mock3", name:"Drive 2", desc: "Increase D2 to Fairway" }
]

const Journey = ({dimns}) => {
  const [journey, setJourney] = useState(undefined)
  //@todo - put into one state object to avoid multiple updates
  const [planetState, setPlanetState] = useState([]);
  const [linkState, setLinkState] = useState([]);
  const [channelState, setChannelState] = useState(initChannels);
  const [withCompletionPaths, setWithCompletionPath] = useState(false);
  const [formData, setFormData] = useState(undefined);
  const [measures, setMeasures] = useState(mockMeasures);
  const [measuresBarIsOpen, setMeasuresBarIsOpen] = useState(false);
  console.log("planetState", planetState)
  // console.log("formData", formData)

  const { screenWidth, screenHeight } = dimns;
  let styleProps = {}

  if(formData) {
    const { planet, nameOnly, targOnly } = formData;
    const width = nameOnly || targOnly ? DIMNS.planet.width : d3.min([screenWidth * 0.725, 500]); 
    const height = nameOnly || targOnly ? DIMNS.planet.height/4 : d3.min([screenHeight * 0.725, 700]);
    styleProps = {
      form:{
        width,
        height,
        left: (nameOnly || targOnly ? planet.x - width/2 : ((screenWidth - width) / 2)) + "px",
        //@todo - use zoomScale to determine the correct shift down
        top: (nameOnly ? planet.y - height/2 : (targOnly ? planet.y - height/2 + 20 :  ((screenHeight - height) / 2))) + "px"
      }
    }
  };
  const classes = useStyles(styleProps) 
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const formDimnsRef = useRef({ width:500, height:700 });
 
  //const [nrPlanetsCreated, setNrPlanetsCreated] = useState(0);
  //console.log("linkState", linkState)
  //console.log("withcomp?", withCompletionPaths)
  const nrPlanetsCreated = useRef(0);
  //const goals = getGoalsData().map(g => {

  //})

  useEffect(() => {
    const width = d3.min([screenWidth * 0.725, 500]);
    const height = d3.min([screenHeight * 0.725, 700]);
    formDimnsRef.current = { 
      width,
      height,
      left:((screenWidth - width) / 2) + "px",
      top:((screenHeight - height) / 2) + "px"
    }
  }, [screenWidth, screenHeight])

  //init
  useEffect(() => {
    if(!containerRef.current){return; }

    const journey = journeyComponent();
    setJourney(() => journey);
    
  }, [])

  useEffect(() => {
    if(!containerRef.current || !journey){return; }
    journey
        .withCompletionPaths(withCompletionPaths)
        .measuresOpen(measuresBarIsOpen ? measures.filter(m => m.isOpen) : undefined)
        .addPlanet((targetDate, yPC) => {
          const newPlanet = {
              id:"p"+ (nrPlanetsCreated.current + 1),
              targetDate,
              yPC,
              dataType:"planet",
              measures:[]
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
          setFormData(undefined);
          //must delete link first, but when state is put together this wont matter
          setLinkState(prevState => prevState.filter(l => l.src !== id && l.targ !== id));
          setPlanetState(prevState => prevState.filter(p => p.id !== id));
        })
        .addLink(props => {
          const newLink = {
            ...props,
            id:props.src + "-" + props.targ,
            dataType:"link"
          }
          setLinkState(prevState => ([ ...prevState, newLink]))
        })
        .deleteLink(id => {
          setLinkState(prevState => prevState.filter(l => l.id !== id));
        })
        .updateChannel(props => {
          setChannelState(prevState => updatedState(prevState, props, (other, updated) => other.nr < updated.nr))
        })
        .setFormData(setFormData)
        .setZoom(zoom => {
          if(formData){
            //@todo - what is this for. Should it be formdata.planet.x? or styleprops.left + zoom.x?
            d3.select(formRef.current).style("left", (formData.x + zoom.x) +"px").style("top", (formData.y + zoom.y) +"px")
          }
        })

    d3.select(containerRef.current)
      ////.datum(data)
      .datum({ planets: planetState, links: linkState, channels: channelState, measures })
      .call(journey
        ////.margin({left: screenWidth * 0.1, right: screenWidth * 0.1, top: screenHeight * 0.1, bottom:40})
        .width(screenWidth - 20)
        .height(screenHeight - 35))
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

  const toggleCompletion = () => {
      setWithCompletionPath(prevState => !prevState)
  }

  //for now, we just open or close all measures
  const toggleMeasuresOpen = useCallback((planetId) => {
    setMeasuresBarIsOpen(prevState => !prevState);
    //todo - if planetId, only close or open those on that planet
    setMeasures(prevState => {
        const measuresAreOpen = !!prevState.find(m => m.isOpen);
        if(measuresAreOpen){
          return prevState.map(m => ({ ...m, isOpen:false }));
        }else{
          return prevState.map(m => ({ ...m, isOpen:true }));
        }
    })
}, [measures]);

  const onUpdatePlanetForm = formType => (name, value) => {
    const { planet, measure } = formData;
    let props;
    if(formType === "targOnly"){
      //for now, the only planetMeasureData that can  be updated is that targ.  Everything else that is updated is on the measure itself.
      props = { id:planet.id, measures: planet.measures.map(m => m.id === measure.id ? { ...m, targ:value } : m) };
    }else{
      props = { id:planet.id, [name]: value };
    }
    setPlanetState(prevState => updatedState(prevState, props));
  }

  const onSaveMeasureForm = (details, planetId, isNew) => {
    if(isNew){
      //any newly created measure from this form must be open as this form comes from the measures bar
      addNewMeasure({ ...details, isOpen:true }, planetId)
      setMeasuresBarIsOpen(true);
    }else{
      setMeasures(prevState => updatedState(prevState, details))
    }
    onCloseMeasureForm();
  }

  const onClosePlanetForm = () => {
    journey.endEditPlanet();
    setFormData(undefined);
  }

  const onCloseMeasureForm = () => {
    setFormData(undefined);
  }

  const addNewMeasure = (details, planetId) => {
    const { name, desc } = details;
    const newMeasureId = createId(measures.map(m => m.id));
    //name and desc are same for all planets where this measure is used
    const newMeasure = { id: newMeasureId, name, desc, isOpen:true };
    setMeasures(prevState => [...prevState, newMeasure]);
    
    if(planetId){
      //measure is also set on a particular planet
      const planet = planetState.find(p => p.id === planetId);
      const planetMeasureData = { measureId:newMeasureId, targ: details.targ};
      setPlanetState(prevState => {
        const props = { id: planetId, measures:[...planet.measures, planetMeasureData]};
        return updatedState(prevState, props);
      })
    }
  }

  return (
    <div className={classes.root} style={{height: screenHeight, marginTop:10, marginLeft:10 }}>
        <svg className={classes.svg} ref={containerRef}></svg>
        <div className={classes.ctrls}>
            <Button color="primary" variant="contained" onClick={toggleMeasuresOpen} style={{ width:50, height:10, fontSize:7, marginRight:"5px" }}>measures</Button>
            <Button color="primary" variant="contained" onClick={toggleCompletion} style={{ width:50, height:10, fontSize:7 }}>completion</Button>
        </div>
        {formData && 
          <div ref={formRef} className={classes.form}>
            {formData.nameOnly &&
              <NameForm data={formData}
                onUpdate={onUpdatePlanetForm("nameOnly")} onClose={onClosePlanetForm} />}
            {formData.targOnly &&
              <TargetForm data={formData}
                onUpdate={onUpdatePlanetForm("targOnly")} onClose={onClosePlanetForm} />}

            {formData.measureOnly && 
              <MeasureForm data={formData}
              onSave={onSaveMeasureForm} onCancel={onCloseMeasureForm}
              existingMeasures={measures} />}

            {formData && !formData.nameOnly && !formData.measureOnly && !formData.targOnly &&
              <Form 
                  data={formData} 
                  onUpdate={onUpdatePlanetForm("full")} 
                  onClose={onClosePlanetForm}
                  availableMeasures={measures}
                  addNewMeasure={addNewMeasure} />}
          </div>
        }
    </div>
  )
}

Journey.defaultProps = {
}

export default Journey;
