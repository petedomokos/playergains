import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { makeStyles } from '@material-ui/core/styles';
import expressionBuilderGenerator from "./expressionBuilderGenerator";
import { getInstances, planetData, toolsInfo } from './data';

const useStyles = makeStyles((theme) => ({
  root: {
      margin:"10px"
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
  const styleProps = { };
  const classes = useStyles();
  const [expressionBuilder, setExpressionBuilder] = useState(undefined)
  const [expressionState, setExpressionState] = useState([{}])
  //console.log("state", expressionState)

  const containerRef = useRef(null);
  //init
  useEffect(() => {
    if(!containerRef.current){return; }
    setExpressionBuilder(() => expressionBuilderGenerator().setState(setExpressionState));
  }, [])
  //update
  useEffect(() => {
      //console.log("2nd uE")
      if(!containerRef.current || !expressionBuilder){
        return; 
      }
      const data = {
        planets:planetData.map(p => ({ ...p, instances:getInstances(p.id) })),
        toolsInfo,
        expressionState
      }

      expressionBuilder.width(800).height(400);

      d3.select(containerRef.current).datum(data).call(expressionBuilder)
      
  }, [expressionState, expressionBuilder])

  return (
    <div className={classes.root} >
        <svg className={classes.svg} id="exp1" ref={containerRef}></svg>
    </div>
  )
}

Expression.defaultProps = {
}

export default Expression
