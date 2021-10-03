import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles';
import expressionBuilderGenerator from "./expressionBuilderGenerator";
import { getInstances, planetData, opsInfo } from './data';

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
      border:"solid",
      background:"grey",
      width:"840px",
      height:"420px",
      padding:"20px" 
  }
}));

const Expression = ({}) => {
  const initExpState = [{}]
  const styleProps = { };
  const classes = useStyles();
  const availableContexts = ["Planet", "Landscape"]
  const [context, setContext] = useState(availableContexts[0])
  const [expressionBuilder, setExpressionBuilder] = useState(undefined)
  const [expressionState, setExpressionState] = useState(initExpState)
  //console.log("state", expressionState)

  const containerRef = useRef(null);

  const onContextUpdate = (context) =>{
    setExpressionState(initExpState)
    setContext(context)
  }
  //init
  useEffect(() => {
    if(!containerRef.current){return; }
    setExpressionBuilder(() => expressionBuilderGenerator()
      .setState(setExpressionState));
  }, [])

  //update data
  useEffect(() => {
     // console.log("2nd uE")
      if(!containerRef.current || !expressionBuilder){return; }
      //console.log("2nd useEff runniung")
      const data = {
        planets:planetData.map(p => ({ ...p, instances:getInstances(p.id) })),
        opsInfo,
        expressionState
      }

      expressionBuilder
        .context(context)
        .width(800)
        .height(400);

      d3.select(containerRef.current).datum(data).call(expressionBuilder)

  }, [expressionState, expressionBuilder, context])

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
        <svg className={classes.svg} id="exp1" ref={containerRef}></svg>
    </div>
  )
}

Expression.defaultProps = {
}

export default Expression
