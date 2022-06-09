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
const Journey = ({ screen, width, height, save, closeDialog }) => {
  console.log("Journey", screen)
  const [journey, setJourney] = useState(undefined)
  //@todo - put into one state object to avoid multiple updates
  const [canvas, setCanvas] = useState({});
  const [aims, setAims] = useState([]);
  const [planets, setPlanets] =  useState([]);
  const [links, setLinks] = useState([]);
  const [channels, setChannels] = useState(initChannels);
  const [withCompletionPaths, setWithCompletionPath] = useState(false);
  const [modalData, setModalData] = useState(undefined);
  const [measures, setMeasures] = useState(mockMeasures);
  const [measuresBarIsOpen, setMeasuresBarIsOpen] = useState(false);
  const shouldD3UpdateRef = useRef(true);

  // console.log("aims", aims)
  // console.log("planets", planets)
  // console.log("links", links)
  // console.log("modalData", modalData)

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
 
  //const [nrPlanetsCreated, setNrPlanetsCreated] = useState(0);
  //console.log("links", links)
  //console.log("withcomp?", withCompletionPaths)
  const nrPlanetsCreated = useRef(0);
  //const goals = getGoalsData().map(g => {

  //})

  const saveJourney = useCallback(() => {
    //could do some front-end checks here
    const journey = { ...canvas, aims, goals:planets, links, measures };
    save(journey);
  }, [canvas, aims, planets, links, measures])

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
        .createAim(function(aim, planetIds){
          const id = createId(aims.map(a => a.id));
          const colour = createColour(aims.length);
          setAims(prevState => ([ ...prevState, { id , colour, dataType:"aim", ...aim }]))
          setPlanets(prevState => prevState.map(p => planetIds.includes(p.id) ? { ...p, aimId: id } : p))
          saveJourney();
        })
        .createPlanet((targetDate, yPC, aimId) => {
          const newPlanet = {
              id:"p"+ (nrPlanetsCreated.current + 1),
              aimId,
              targetDate,
              yPC,
              dataType:"planet",
              measures:[]
              //goals
          }
          //useStateWithCallback doesnt work as this is called before journeyComponent is updated in the new call to this useEffect
          setPlanets(prevState => [...prevState, newPlanet]);
          journey.selected(newPlanet.id);
          //setNrPlanetsCreated(prevState => prevState + 1);
          nrPlanetsCreated.current = nrPlanetsCreated.current + 1;
          //todo -0 consider just setting it as selected in state, and handling this in journey ie
          //ie if a planet is selected, then updateSelected if not set as selected
          //the below approach may cause an issue if planets hasnt updated yet from the setPlanets call above
          saveJourney();
        })
        .updatePlanet((props, shouldD3Update=true) => {
          if(!shouldD3Update){ shouldD3UpdateRef.current = shouldD3Update; }
          setPlanets(prevState => updatedState(prevState, props))
          saveJourney();
        })
        .updatePlanets((planetsToUpdate, shouldD3Update=true) => {
          if(!shouldD3Update){ shouldD3UpdateRef.current = shouldD3Update; }
          setPlanets(prevState => prevState.map(p => {
              const propsToUpdate = planetsToUpdate.find(planet => planet.id === p.id) || {};
              return { ...p, ...propsToUpdate }
          }));
          saveJourney();
        })
        .updateAim((props, shouldD3Update=true) => {
          if(!shouldD3Update){ shouldD3UpdateRef.current = shouldD3Update; }
          setAims(prevState => updatedState(prevState, props));
          saveJourney();
        })
        /*
        done in journeyComp instead
        .addMeasureToPlanet((planetId, measureId) => {
            const planetToUpdate = planets.find(p => p.id === planetId);
            //console.log("addMeasureToPlanet", planetToUpdate)
            //@todo - create a transFormForState fuciton which always runs in reducers 9or before going into useState in this
            //case, to make sure eg targ is a string. Because theoretically, a calc could update a targ and so it copuld be a number
            const measures = [ ...planetToUpdate.measures, { id: measureId }]
            setPlanets(prevState => updatedState(prevState, { id: planetId, measures }))
            //after this is done, show form for measure
            //setModalData(form stuff)
        })
        */
       .onDeleteAim(aimId => {
          //this doesnt work - it deltes a planet instead!
          //@todo - create a Dialog to see if user wants goals deleted too (if aiim has goals), or to cancel
          setModalData(undefined);
          setAims(prevState => prevState.filter(a => a.id !== aimId));
          setPlanets(prevState => prevState.map(p => ({ ...p, aimId: p.aimId === aimId ? undefined : p.aimId })));
          saveJourney();
       })
        .deletePlanet(id => {
          setModalData(undefined);
          //must delete link first, but when state is put together this wont matter
          setLinks(prevState => prevState.filter(l => l.src !== id && l.targ !== id));
          setPlanets(prevState => prevState.filter(p => p.id !== id));
          saveJourney();
        })
        .onAddLink(props => {
          const newLink = {
            ...props,
            id:props.src + "-" + props.targ,
            dataType:"link"
          }
          setLinks(prevState => ([ ...prevState, newLink]));
          saveJourney();
        })
        .deleteLink(id => {
          setLinks(prevState => prevState.filter(l => l.id !== id));
          saveJourney();
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
      .datum({ canvas, aims, planets, links, channels, measures })
      .call(journey)

  }, [journey, canvas, aims, planets, links, withCompletionPaths, measures, measuresBarIsOpen, modalData, width, height, screen ])

  /*
  //todo - consider this approach of separate useEffects
  useEffect(() => {
      journey.modalData(modalData).... could even have a 2nd option to all these settings, which is false by default, which is to update dom 
      //so journey.modalData(modalData, true) would be all we have to do here, instead of call the update again as we do below

      d3.select(containerRef.current)
        .datum({ canvas, aims, planets, links, channels, measures })
        .call(journey)

  }, [modalData])
  */

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
    console.log("updatePlanetForm")
    const { d , measure } = modalData;
    const planet = planets.find(p => p.id === d.id);
    let props;
    if(modalType === "targOnly"){
      //for now, the only planetMeasureData that can  be updated is that targ.  Everything else that is updated is on the measure itself.
      props = { id:d.id, measures: planet.measures.map(m => m.id === measure.id ? { ...m, targ:value } : m) };
    }else{
      props = { id:d.id, [name]: value };
    }
    setPlanets(prevState => updatedState(prevState, props));
  }

  const onUpdateAimForm = (name, value) => {
    console.log("update aim form")
    const { d } = modalData;
    if(d.id === "main"){
      setCanvas(prevState => ({ ...prevState, [name]: value }))
    }else{
      const props = { id:d.id, [name]: value };
      setAims(prevState => updatedState(prevState, props));
    }
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

  const onCloseAimForm = () => {
    console.log("close aim form")
    //@todo - journey.endEditAim();
    setModalData(undefined);
    saveJourney();
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
              <NameForm data={{ ...modalData, planet:planets.find(p => p.id === modalData.d?.id) }}
                onUpdate={onUpdatePlanetForm("nameOnly")} onClose={onClosePlanetForm} />}

            {modalData.nameAndTargOnly &&
              <div className={classes.targModal}>
                <TargetForm data={{ ...modalData, planet:planets.find(p => p.id === modalData.d?.id) }}
                  onUpdate={onUpdatePlanetForm("targOnly")} onClose={onClosePlanetForm} />
              </div>}

            {modalData.importing &&
              <ImportMeasures data={modalData} existing={measures} available={[]}
                onSave={importMeasures} onClose={() => setModalData(undefined)} />}

            {modalData.measureOnly && 
              <MeasureForm data={{ ...modalData, planet:planets.find(p => p.id === modalData.d?.id) }}
              onSave={onSaveMeasureForm} onCancel={() => setModalData(undefined)}
              existingMeasures={measures} />}

            {modalData && !modalData.nameOnly && !modalData.measureOnly && !modalData.nameAndTargOnly && !modalData.importing &&
              <Form 
                  data={{ ...modalData, planet:planets.find(p => p.id === modalData.d?.id) }} 
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
  screen: {},
  width: 0,
  height: 0,
  save:() => {}
}

export default Journey;
