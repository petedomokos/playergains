import React, { useEffect, useState, useRef, useCallback } from 'react'
//import { useStateWithCallbackLazy } from 'use-state-with-callback';
import * as d3 from 'd3';
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { createId, createColour, findFirstFuturePlanet, updatedState } from './helpers';
import journeyComponent from "./journeyComponent"
import { addMonths, startOfMonth, idFromDates } from '../../util/TimeHelpers';
import NameForm from "./form/NameForm";
import MeasureForm from "./form/MeasureForm";
import TargetForm from './form/TargetForm';
import Form from "./form/Form";
import ImportMeasures from './ImportMeasures';
import { DIMNS, FONTSIZES } from './constants';

const useStyles = makeStyles((theme) => ({
  root: {
    position:"relative",
    marginLeft:DIMNS.journey.margin.left, 
    marginRight:DIMNS.journey.margin.right,
    marginTop:DIMNS.journey.margin.top, 
    marginBottom:DIMNS.journey.margin.bottom
  },
  svg:{
    //position:"absolute"
  },
  btn:{
    width:DIMNS.ctrls.btnWidth,
    height:DIMNS.ctrls.btnHeight,
    marginRight:"5px",
    fontSize:FONTSIZES.ctrls.btn,
  },
  modal:{
      position:"absolute",
      left:props => props.modal?.left,
      top:props => props.modal?.top,
      width:props => props.modal?.width, 
      height:props => props.modal?.height
  },
  targModal:{
    position:"absolute",
    left:0,
    top:props => props.modal?.targTop,
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

//width and height may be full screen, but may not be
const Journey = ({ journeyData, screen, width, height, save, closeDialog }) => {
  const { aims, goals, links, measures } = journeyData;
  console.log("Journey", journeyData)
  const [journey, setJourney] = useState(null);
  const [channels, setChannels] = useState(initChannels);
  const [withCompletionPaths, setWithCompletionPath] = useState(false);
  const [modalData, setModalData] = useState(undefined);
  //const [measures, setMeasures] = useState(mockMeasures);
  const [measuresBarIsOpen, setMeasuresBarIsOpen] = useState(false);
  const shouldD3UpdateRef = useRef(true);

  const ctrlsHeight = 10;
  const journeyWidth = width - DIMNS.journey.margin.left - DIMNS.journey.margin.right
  const journeyHeight = height - DIMNS.journey.margin.top - DIMNS.journey.margin.bottom - ctrlsHeight;
  let styleProps = {}

  if(modalData) {
      //todo - handle aim nameOnly case
      const { nameOnly, nameAndTargOnly, d } = modalData;

      if(nameOnly || nameAndTargOnly){
            //could be aim or planet, but use planet width and height as a guide for both
            //@todo - have more rigorous dimns
            const { width, height } = DIMNS.form.single;
            const goalNameX = d => d.x - width/2;
            const goalNameY = d => d.y - height/2;
            const aimNameX = d => d.displayX + DIMNS.aim.name.margin.left;
            const aimNameY = d => d.y + DIMNS.aim.name.margin.top;

            styleProps = {
                modal:{
                  width,
                  height,
                  //@todo - sort this out...for now, planet has x whereas aim has displayX
                  left:(d.dataType === "planet" ? goalNameX(d) : (d.id === "main" ? 20: aimNameX(d))) + "px",
                  top:(d.dataType === "planet" ? goalNameY(d) : (d.id === "main" ? 15 : aimNameY(d))) + "px",
                  targTop:"20px"
                }
            }
      }else{
            //full form
            const width = d3.min([journeyWidth * 0.725, 500]); 
            const height = d3.min([journeyHeight * 0.725, 700]);
            styleProps = {
                modal:{
                  width,
                  height,
                  left:((journeyWidth - width) / 2) + "px",
                  top:((journeyHeight - height) / 2) +"px",
                }
            }
      }
  };

  //console.log("styleProps", styleProps)
  const classes = useStyles(styleProps) 
  const containerRef = useRef(null);
  const modalRef = useRef(null);
  const modalDimnsRef = useRef({ width:500, height:700 });


  //@todo - make a more robust id function - see my exp builder code
  const nrGoalsCreated = useRef(journeyData.goals.length);

  useEffect(() => {
    const width = d3.min([journeyWidth * 0.725, 500]);
    const height = d3.min([journeyHeight * 0.725, 700]);
    modalDimnsRef.current = { 
      width,
      height,
      left:((journeyWidth - width) / 2) + "px",
      top:((journeyHeight - height) / 2) + "px"
    }
  }, [journeyWidth, journeyHeight])

  //init
  useEffect(() => {
    if(!containerRef.current){return; }
    const journey = journeyComponent();
    setJourney(() => journey);
  }, [])

  useEffect(() => {
    if(!containerRef.current || !journey){return; }
    if(!shouldD3UpdateRef.current){
      //reset so always true by default on next state update
      shouldD3UpdateRef.current = true;
      return;
    }

    journey
        .width(journeyWidth)
        .height(journeyHeight)
        .screen(screen)
        .withCompletionPaths(withCompletionPaths)
        .measuresOpen(measuresBarIsOpen ? measures.filter(m => m.isOpen) : undefined)
        .modalData(modalData)
        //@todo - make createId handle prefixes so all ids are unique
        .handleCreateAim(function(aim, planetIds){
          todo - decide what to do about eg aims - do we call journyData just data and dont destrucutre at all?
          const id = createId(aims.map(a => a.id));
          const colour = createColour(aims.length);
          //updates
          const aims = [ ...journeyData.aims, { id , colour, dataType:"aim", ...aim }];
          const goals = journeyData.goals.map(p => planetIds.includes(p.id) ? { ...p, aimId: id } : p);
          //setAims(prevState => ([ ...prevState, { id , colour, dataType:"aim", ...aim }]))
          //setPlanets(prevState => prevState.map(p => planetIds.includes(p.id) ? { ...p, aimId: id } : p))
          save({ ...journeyData, aims, goals });
        })
        .createPlanet((targetDate, yPC, aimId) => {
          const newGoal = {
              id:"p"+ (nrGoalsCreated.current + 1),
              aimId,
              targetDate,
              yPC,
              dataType:"planet",
              measures:[]
              //goals
          }
          //useStateWithCallback doesnt work as this is called before journeyComponent is updated in the new call to this useEffect
        
          //todo -0 consider just setting it as selected in state, and handling this in journey ie
          //ie if a planet is selected, then updateSelected if not set as selected
          //the below approach may cause an issue if planets hasnt updated yet from the setPlanets call above
          //updates
          const goals = [ ...journeyData.goals,  newGoal];
          save({ ...journeyData, goals });

          journey.selected(newGoal.id);
          //setNrPlanetsCreated(prevState => prevState + 1);
          nrGoalsCreated.current = nrGoalsCreated.current + 1;
        })
        .updatePlanet((props, shouldD3Update=true) => {
          if(!shouldD3Update){ shouldD3UpdateRef.current = shouldD3Update; }
          //updates
          const goals = updatedState(journeyData.goals, props);
          save({ ...journeyData, goals });
        })
        .updatePlanets((planetsToUpdate, shouldD3Update=true) => {
          if(!shouldD3Update){ shouldD3UpdateRef.current = shouldD3Update; }
          //updates
          const goals = journeyData.goals.map(p => {
              const propsToUpdate = planetsToUpdate.find(planet => planet.id === p.id) || {};
              return { ...p, ...propsToUpdate }
          });
          save({ ...journeyData, goals });
        })
        .updateAim((props, shouldD3Update=true) => {
          if(!shouldD3Update){ shouldD3UpdateRef.current = shouldD3Update; }
          //updates
          const aims = updatedState(journeyData.aims, props);
          save({ ...journeyData, aims });
        })
       .onDeleteAim(aimId => {
          //this doesnt work - it deltes a planet instead!
          //@todo - create a Dialog to see if user wants goals deleted too (if aiim has goals), or to cancel
          setModalData(undefined);
          const aims = journeyData.aims.filter(a => a.id !== aimId);
          const goals = journeyData.goals.map(p => ({ ...p, aimId: p.aimId === aimId ? undefined : p.aimId }));
          save({ ...journeyData, aims, goals });
       })
        .deletePlanet(id => {
          setModalData(undefined);
          //must delete link first, but when state is put together this wont matter
          const links = journeyData.links.filter(l => l.src !== id && l.targ !== id);
          const goals = journeyData.goals.filter(p => p.id !== id);
          save({ ...journeyData, links, goals });
        })
        .onAddLink(props => {
          const newLink = {
            ...props,
            id:props.src + "-" + props.targ,
            dataType:"link"
          }
          const links = [ ...journeyData.links, newLink];
          save({ ...journeyData, links });
        })
        .deleteLink(id => {
          const links = journeyData.links.filter(l => l.id !== id);
          save({ journeyData, links });
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
      .datum({ journeyData, channels })
      //.datum({ canvas, aims, planets, links, channels, measures })
      .call(journey)

  }, [JSON.stringify(journeyData), journey, withCompletionPaths, measuresBarIsOpen, modalData, width, height, screen ])

  const toggleCompletion = () => {
      setWithCompletionPath(prevState => !prevState)
  }

  //for now, we just open or close all measures
  const toggleMeasuresOpen = useCallback((planetId) => {
      setMeasuresBarIsOpen(prevState => !prevState);
      //todo - if planetId, only close or open those on that planet
      let measures;
      const measuresAreOpen = !!prevState.find(m => m.isOpen);
      if(measuresAreOpen){
          measures = journeyData.measures.map(m => ({ ...m, isOpen:false }));
      }else{
          measures = journeyData.measures.map(m => ({ ...m, isOpen:true }));
      }
      save({ ...journey, measures })
}, [JSON.stringify(journeyData.measures)]);

  const onUpdatePlanetForm = modalType => (name, value) => {
    //console.log("updatePlanetForm")
    const { d , measure } = modalData;
    const planet = goals.find(p => p.id === d.id);
    let props;
    if(modalType === "targOnly"){
      //for now, the only planetMeasureData that can  be updated is that targ.  Everything else that is updated is on the measure itself.
      props = { id:d.id, measures: planet.measures.map(m => m.id === measure.id ? { ...m, targ:value } : m) };
    }else{
      props = { id:d.id, [name]: value };
    }
    const goals = updatedState(journeyData.goals, props);
    //dont persist yet until closed
    save({ ...journey, goals }, false);
  }

  const onUpdateAimForm = (name, value) => {
    //console.log("update aim form")
    const { d } = modalData;
    if(d.id === "main"){
      //dont want to persist name change to db yet
      save({ ...journey, [name]: value }, false)
    }else{
      const props = { id:d.id, [name]: value };
      const aims = updatedState(prevState, props)
      save({ ...journey, aims }, false);
    }
  }

  const onSaveMeasureForm = (details, planetId, isNew) => {
    if(isNew){
      //any newly created measure from this form must be open as this form comes from the measures bar
      addNewMeasure({ ...details, isOpen:true }, planetId)
      setMeasuresBarIsOpen(true);
    }else{
      const measures = updatedState(journeyData.measures, details)
      save({ ...journey, measures })
    }
    () => setModalData(undefined);
  }

  const onClosePlanetForm = () => {
    journey.endEditPlanet();
    setModalData(undefined);
    //now we want it to persist the changes that have been made
    save(journey);
  }

  const onCloseAimForm = () => {
    console.log("close aim form")
    //@todo - journey.endEditAim();
    setModalData(undefined);
    //now we want it to persist the changes that have been made
    save(journey);
  }

  const addNewMeasure = (details, /*planetId*/) => {
    const { name, desc } = details;
    const newMeasureId = createId(measures.map(m => m.id));
    //name and desc are same for all planets where this measure is used
    const measures = [ ...journey.measures, { id: newMeasureId, name, desc, isOpen:true }]
    save({ ...journey, measures })
    /*
    //@todo - use this
    if(planetId){
      //measure is also set on a particular planet
      const planet = planets.find(p => p.id === planetId);
      const planetMeasureData = { measureId:newMeasureId, targ: details.targ};
      setPlanets(prevState => {
        const props = { id: planetId, measures:[...planet.measures, planetMeasureData]};
        return updatedState(prevState, props);
      })
    }
    */
  }

  const importMeasures = measureIds => {
    setMeasures(prevState => [...measureIds, ...prevState]);
    setModalData(undefined);
  }

  return (
    <div className={classes.root}>
        <svg className={classes.svg} ref={containerRef}></svg>
        <div className={classes.ctrls}>
            <Button className={classes.btn} color="primary" variant="contained" onClick={toggleMeasuresOpen} >
              {( measuresBarIsOpen ?"Close " : "Open ") +"measures"}</Button>
            {/**<Button className={classes.btn} color="primary" variant="contained" onClick={toggleCompletion} >completion</Button>**/}
        </div>
        {modalData && 
          <div ref={modalRef} className={classes.modal}>
             {modalData.d.dataType === "aim" && modalData.nameOnly && 
              <NameForm data={{ ...modalData, aim:aims.find(a => a.id === modalData.d.id) }}
                onUpdate={onUpdateAimForm} onClose={onCloseAimForm} />}

            {modalData.d.dataType === "planet" && (modalData.nameOnly || modalData.nameAndTargOnly) &&
              <NameForm data={{ ...modalData, planet:goals.find(p => p.id === modalData.d?.id) }}
                onUpdate={onUpdatePlanetForm("nameOnly")} onClose={onClosePlanetForm} />}

            {modalData.nameAndTargOnly &&
              <div className={classes.targModal}>
                <TargetForm data={{ ...modalData, planet:goals.find(p => p.id === modalData.d?.id) }}
                  onUpdate={onUpdatePlanetForm("targOnly")} onClose={onClosePlanetForm} />
              </div>}

            {modalData.importing &&
              <ImportMeasures data={modalData} existing={measures} available={[]}
                onSave={importMeasures} onClose={() => setModalData(undefined)} />}

            {modalData.measureOnly && 
              <MeasureForm data={{ ...modalData, planet:goals.find(p => p.id === modalData.d?.id) }}
              onSave={onSaveMeasureForm} onCancel={() => setModalData(undefined)}
              existingMeasures={measures} />}

            {modalData && !modalData.nameOnly && !modalData.measureOnly && !modalData.nameAndTargOnly && !modalData.importing &&
              <Form 
                  data={{ ...modalData, planet:goals.find(p => p.id === modalData.d?.id) }} 
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
  journeyData:{
    _id:"temp",
    aims:[],
    goals:[],
    links:[],
    measures:[]
  },
  screen: {},
  width: 0,
  height: 0,
  save:() => {}
}

export default Journey;
