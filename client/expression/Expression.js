import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles';
import expressionBuilderGenerator from "./expressionBuilderGenerator";
import { getInstances, planetData, opsInfo } from './data';
import { COLOURS, DIMNS } from "./constants";

const useStyles = makeStyles((theme) => ({
  root: {
      margin:"10px"
  },
  contextMenu:{
    margin:"10px"
  },
  contextBtn:{
    margin:"5px",
  },
  svg:{
      background:COLOURS.svg.bg,
      //width:"840px",
      //height:"420px",
      //margin:"20px" 
  }
}));

const Expression = ({}) => {
  //each expression starts with 1 block
  const initExpState = [{op:{id:"home",name:"For Each" }}];
  //starts with 1 expression
  const initState = [initExpState]
  const styleProps = { };
  const classes = useStyles();
  const availableContexts = ["Planet", "Landscape"]
  //change context
  const [context, setContext] = useState(availableContexts[0])
  //should be ref as not changing
  const [expBuilder, setExpBuilder] = useState(undefined)
  const [expBuilderState, setExpBuilderState] = useState(initState)
  //console.log("ExpBuilder state", expBuilderState)
  //embellish the state with the latest updates
  //const fullState = state.map(colState =>({
    //...colState,
    //op:opsInfo.find()
  //}))

  const containerRef = useRef(null);

  //dimns
  const { width } = DIMNS.svg;
  const height = expBuilderState.length * DIMNS.expWrapper.height;
  const { margin } = DIMNS;

  const onContextUpdate = (context) =>{
    setExpBuilderState(initState)
    setContext(context)
  }
  //init
  useEffect(() => {
    if(!containerRef.current){return; }
    setExpBuilder(() => expressionBuilderGenerator().setState(setExpBuilderState));
  }, [])

  //update data
  useEffect(() => {
     // console.log("2nd uE")
      if(!containerRef.current || !expBuilder){return; }
      //console.log("2nd useEff runniung")
      const data = {
        planets:planetData.map(p => ({ ...p, instances:getInstances(p.id) })),
        opsInfo,
        expBuilderState
      }


      expBuilder
        .context(context)
        .width(width - margin.left - margin.right)
        .height(height - margin.left - margin.right);

      d3.select(containerRef.current).datum(data).call(expBuilder)

  }, [expBuilderState, expBuilder, context])

  return (
    <div className={classes.root} >
      <div className={classes.contextMenu} >
        {availableContexts.map(option => 
          <Button 
              value="Landscape" 
              color={context === option ? "primary" : "inherit"} 
              variant="contained" 
              className={classes.contextBtn} 
              onClick={() => onContextUpdate(option)} key={option}>{option}
          </Button>
        )}
      </div>
        <svg 
          className={classes.svg} 
          width={width} 
          height={height} 
          id="exp1" ref={containerRef}></svg>
    </div>
  )
}

Expression.defaultProps = {
}

export default Expression
