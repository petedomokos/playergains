import React, { useEffect, useState, useRef, useCallback } from 'react'
import * as d3 from 'd3';
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { getPlanetsData, getGoalsData, getStarData } from '../data/planets'
import { createId, createColour, findFirstFuturePlanet, updatedState } from './helpers';
import journeyComponent from "./journeyComponent"
import { addMonths, startOfMonth, idFromDates } from '../util/TimeHelpers';
import { channelContainsDate } from './geometryHelpers';
import NameForm from "./form/NameForm";
import MeasureForm from "./form/MeasureForm";
import TargetForm from './form/TargetForm';
import Form from "./form/Form";
import ImportMeasures from './ImportMeasures';
import { DIMNS } from './constants';
import EditMeasureFields from './form/EditMeasureFields';

const useStyles = makeStyles((theme) => ({
  root: {
    position:"relative"
  },
  svg:{
    //position:"absolute"
  },
  modal:{
    position:"absolute",
    left:props => props.modal?.left,
    top:props => props.modal?.top,
    width:props => props.modal?.width, 
    height:props => props.modal?.height
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
    { id:"mock1", name:"Puts Per Round", desc: "nr of puts in a round" },
    { id:"mock2", name:"Drive 1", desc: "nr D1s to Fairway" },
    { id:"mock3", name:"Drive 2", desc: "nr D2s to Fairway" }
]

const Journey = ({dimns}) => {
  const [journey, setJourney] = useState(undefined)
  //@todo - put into one state object to avoid multiple updates
  const [aims, setAims] = useState([]);
  const [planets, setPlanets] = useState([]);
  const [links, setLinks] = useState([]);
  const [channels, setChannels] = useState(initChannels);
  const [withCompletionPaths, setWithCompletionPath] = useState(false);
  const [modalData, setModalData] = useState(undefined);
  const [measures, setMeasures] = useState(mockMeasures);
  const [measuresBarIsOpen, setMeasuresBarIsOpen] = useState(false);
  console.log("planets", planets)
  //console.log("links", links)
  //console.log("modalData", modalData)
  // console.log("aims", aims)

  const { screenWidth, screenHeight } = dimns;
  let styleProps = {}

  if(modalData) {
    const { nameOnly, targOnly, planetD } = modalData;
    const width = nameOnly || targOnly ? DIMNS.planet.width : d3.min([screenWidth * 0.725, 500]); 
    const height = nameOnly || targOnly ? DIMNS.planet.height/4 : d3.min([screenHeight * 0.725, 700]);
    styleProps = {
      modal:{
        width,
        height,
        left: (nameOnly || targOnly ? planetD.x - width/2 : ((screenWidth - width) / 2)) + "px",
        //@todo - use zoomScale to determine the correct shift down
        top: (nameOnly ? planetD.y - height/2 : (targOnly ? planetD.y - height/2 + 20 :  ((screenHeight - height) / 2))) + "px"
      }
    }
  };
  const classes = useStyles(styleProps) 
  const containerRef = useRef(null);
  const modalRef = useRef(null);
  const modalDimnsRef = useRef({ width:500, height:700 });
 
  //const [nrPlanetsCreated, setNrPlanetsCreated] = useState(0);
  //console.log("links", links)
  //console.log("withcomp?", withCompletionPaths)
  const nrPlanetsCreated = useRef(0);
  //const goals = getGoalsData().map(g => {

  //})

  useEffect(() => {
    const width = d3.min([screenWidth * 0.725, 500]);
    const height = d3.min([screenHeight * 0.725, 700]);
    modalDimnsRef.current = { 
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
        //@todo - make createId handle prefixes so all ids are unique
        .createAim(function(aim, initPlanetsTargetDate, initPlanetsYPCs){
          const id = createId(aims.map(a => a.id));
          const colour = createColour(aims.length);
          setAims(prevState => ([ ...prevState, { id , colour, ...aim }]))
          
          //create 3 planets with aimId = id
          const newPlanets = [1,2,3].map((nr,i) => ({
            id:"p"+ (nrPlanetsCreated.current + nr),
            aimId:id,
            targetDate:initPlanetsTargetDate,
            yPC:initPlanetsYPCs[i],
            dataType:"planet",
            measures:[]

          }));

          setPlanets(prevState => [...prevState, ...newPlanets]);
          //setNrPlanetsCreated(prevState => prevState + 1);
          nrPlanetsCreated.current = nrPlanetsCreated.current + 3;
        })
        .createPlanet((targetDate, yPC) => {
          const newPlanet = {
              id:"p"+ (nrPlanetsCreated.current + 1),
              targetDate,
              yPC,
              dataType:"planet",
              measures:[]
              //goals
          }
          setPlanets(prevState => [...prevState, newPlanet]);
          //setNrPlanetsCreated(prevState => prevState + 1);
          nrPlanetsCreated.current = nrPlanetsCreated.current + 1;
        })
        .updatePlanet(props => {
          setPlanets(prevState => updatedState(prevState, props))
        })
        .updatePlanets(planetsToUpdate => {
          //console.log("Journey updatePlanets", planetsToUpdate)
          setPlanets(prevState => prevState.map(p => {
              const propsToUpdate = planetsToUpdate.find(planet => planet.id === p.id) || {};
              return { ...p, ...propsToUpdate }
          }));
        })
        .updateAim(props => {
          setAims(prevState => updatedState(prevState, props))
        })
        .addMeasureToPlanet((planetId, measureId) => {
            const planetToUpdate = planets.find(p => p.id === planetId);
            //console.log("addMeasureToPlanet", planetToUpdate)
            //@todo - create a transFormForState fuciton which always runs in reducers 9or before going into useState in this
            //case, to make sure eg targ is a string. Because theoretically, a calc could update a targ and so it copuld be a number
            const measures = [ ...planetToUpdate.measures, { id: measureId }]
            setPlanets(prevState => updatedState(prevState, { id: planetId, measures }))
        })
        .deletePlanet(id => {
          setModalData(undefined);
          //must delete link first, but when state is put together this wont matter
          setLinks(prevState => prevState.filter(l => l.src !== id && l.targ !== id));
          setPlanets(prevState => prevState.filter(p => p.id !== id));
        })
        .onAddLink(props => {
          const newLink = {
            ...props,
            id:props.src + "-" + props.targ,
            dataType:"link"
          }
          setLinks(prevState => ([ ...prevState, newLink]))
        })
        .deleteLink(id => {
          setLinks(prevState => prevState.filter(l => l.id !== id));
        })
        .updateChannel(props => {
          setChannels(prevState => updatedState(prevState, props, (other, updated) => other.nr < updated.nr))
        })
        .setModalData(setModalData)
        .setZoom(zoom => {
          if(modalData){
            //@todo - what is this for. Should it be formdata.planet.x? or styleprops.left + zoom.x?
            d3.select(modalRef.current).style("left", (modalData.x + zoom.x) +"px").style("top", (modalData.y + zoom.y) +"px")
          }
        })

    d3.select(containerRef.current)
      ////.datum(data)
      .datum({ aims, planets, links , channels, measures })
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

  const onUpdatePlanetForm = modalType => (name, value) => {
    const { planetD, measure } = modalData;
    const planet = planets.find(p => p.id === planetD.id);
    let props;
    if(modalType === "targOnly"){
      //for now, the only planetMeasureData that can  be updated is that targ.  Everything else that is updated is on the measure itself.
      props = { id:planetD.id, measures: planet.measures.map(m => m.id === measure.id ? { ...m, targ:value } : m) };
    }else{
      props = { id:planetD.id, [name]: value };
    }
    setPlanets(prevState => updatedState(prevState, props));
  }

  const onSaveMeasureForm = (details, planetId, isNew) => {
    if(isNew){
      //any newly created measure from this form must be open as this form comes from the measures bar
      addNewMeasure({ ...details, isOpen:true }, planetId)
      setMeasuresBarIsOpen(true);
    }else{
      setMeasures(prevState => updatedState(prevState, details))
    }
    () => setModalData(undefined);
  }

  const onClosePlanetForm = () => {
    journey.endEditPlanet();
    setModalData(undefined);
  }

  const addNewMeasure = (details, planetId) => {
    const { name, desc } = details;
    const newMeasureId = createId(measures.map(m => m.id));
    //name and desc are same for all planets where this measure is used
    const newMeasure = { id: newMeasureId, name, desc, isOpen:true };
    setMeasures(prevState => [...prevState, newMeasure]);
    
    if(planetId){
      //measure is also set on a particular planet
      const planet = planets.find(p => p.id === planetId);
      const planetMeasureData = { measureId:newMeasureId, targ: details.targ};
      setPlanets(prevState => {
        const props = { id: planetId, measures:[...planet.measures, planetMeasureData]};
        return updatedState(prevState, props);
      })
    }
  }

  const importMeasures = measureIds => {
    setMeasures(prevState => [...measureIds, ...prevState]);
    setModalData(undefined);
  }

  return (
    <div className={classes.root} style={{height: screenHeight, marginTop:10, marginLeft:10 }}>
        <svg className={classes.svg} ref={containerRef}></svg>
        <div className={classes.ctrls}>
            <Button color="primary" variant="contained" onClick={toggleMeasuresOpen} style={{ width:50, height:10, fontSize:7, marginRight:"5px" }}>measures</Button>
            <Button color="primary" variant="contained" onClick={toggleCompletion} style={{ width:50, height:10, fontSize:7 }}>completion</Button>
        </div>
        {modalData && 
          <div ref={modalRef} className={classes.modal}>
            {modalData.nameOnly &&
              <NameForm data={{ ...modalData, planet:planets.find(p => p.id === modalData.planetD?.id) }}
                onUpdate={onUpdatePlanetForm("nameOnly")} onClose={onClosePlanetForm} />}
            {modalData.targOnly &&
              <TargetForm data={{ ...modalData, planet:planets.find(p => p.id === modalData.planetD?.id) }}
                onUpdate={onUpdatePlanetForm("targOnly")} onClose={onClosePlanetForm} />}
              
            {modalData.importing &&
              <ImportMeasures data={modalData} existing={measures} available={[]}
                onSave={importMeasures} onClose={() => setModalData(undefined)} />}

            {modalData.measureOnly && 
              <MeasureForm data={{ ...modalData, planet:planets.find(p => p.id === modalData.planetD?.id) }}
              onSave={onSaveMeasureForm} onCancel={() => setModalData(undefined)}
              existingMeasures={measures} />}

            {modalData && !modalData.nameOnly && !modalData.measureOnly && !modalData.targOnly && !modalData.importing &&
              <Form 
                  data={{ ...modalData, planet:planets.find(p => p.id === modalData.planetD?.id) }} 
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
