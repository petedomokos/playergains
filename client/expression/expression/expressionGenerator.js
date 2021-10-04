import * as d3 from 'd3';
import { expressionBoxGenerator } from "./expressionBoxGenerator"
import { expressionVisGenerator } from './vis/expressionVisGenerator';

//import { expressionBoxGenerator } from "./expressionBoxGenerator"
import { planetHomeVisGenerator } from './vis/planetHomeVisGenerator';
import { planetGetVisGenerator } from './vis/planetGetVisGenerator';
import { planetEmptyVisGenerator } from './vis/planetEmptyVisGenerator';

import { getActiveColState } from '../helpers';

export function expressionGenerator(){
    //dimns
    let width = 600;
    let height = 500;
    const margin = {};
    let colWidth = 140;
    let colHeight;
    const colMargin = { right: 20 }
    let boxAndVisWidth = 130;
    let boxHeight = 50;
    let visHeight = 200;

    //context
    let context;

    //components
    let componentContext;
    //let expressionBox; - mut be a sep genertor for each col!
    //let expressionVis;

    //state
    let state;

    //dom
    let expressionG;

    function updateExpressionComponents(){
        console.log("context", context)
        console.log("componentContext", componentContext)
        if(context !== componentContext){
            //console.log("rendering new components for context", context)
            if(expressionBox){
                //we don't want to remove the gs themselves, as they are managed via the EUE pattern
                expressionG.selectAll("g.box").selectAll("*").remove();
                expressionG.selectAll("g.vis").selectAll("*").remove();
            }
            const { selected, op, colNr } = getActiveColState(state);
            //for now, only vis is different
            expressionBox = context === "Planet" ? expressionBoxGenerator() : expressionBoxGenerator();
            if(context === "Planet"){
                if(colNr === 0){
                    expressionVis = planetHomeVisGenerator();
                }
                else if(op){
                    expressionVis = findOpVisGenerator(op.id);
                }
                else{
                    expressionVis = planetEmptyVisGenerator();
                }
            }

            function findOpVisGenerator(opId){
                switch(opId){
                    case "get":{
                        return planetGetVisGenerator();
                    }
                    default:{ return;};
                }
            }

            console.log("expVis is", expressionVis)
        }
        //set current
        componentContext = context;
    }
    function expression(selection){
        expressionG = selection;
        //console.log("expressoin state", selection.datum())
        selection.each(function(stateData){
            state = stateData;
            console.log("exp state", state)
            //add the previous col state to each colState
            const colStateWithPrev = state.map((col,i) => i === 0 ? col : { ...col, prev:state[i - 1]});
            //BIND
            const colG = selection.selectAll("g.col").data(colStateWithPrev)

            //ENTER
            //here we append the g, but after this point .enter will still refer to the pre-entered placeholder nodes
            const colGEnter = colG.enter()
               .append("g")
               .attr("class", "col")
               .attr("transform", (d,i) => {
                    console.log("enter", d)
                    return "translate(" +(i * (colWidth + colMargin.right))+",0)"
               })

            colGEnter.append("g").attr("class", "box")
            colGEnter.append("g").attr("class", "vis").attr("transform", "translate(0," + (boxHeight) +")")
            //note - if we merge, the indexes will stay as they are from orig sel and sel.enter()
            //os need to select again
            const colGMerged = colG.merge(colGEnter);
            colGMerged
                .each(function(d,i){
                    updateExpressionBoxComponent(i);
                    d3.select(this).select("g.box").call(expressionBox.width(boxAndVisWidth).height(boxHeight))
                })
            colGMerged
                .each(function(d,i){
                    updateExpressionVisComponent(i);
                    d3.select(this).select("g.vis").call(expressionVis.width(boxAndVisWidth).height(visHeight))
                })

            //EXIT
            colG.exit().remove();

        })
    }
    // api
    expression.context = function (value) {
        if (!arguments.length) { return context; }
        context = value;
        return expression;
    };
    expression.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        return expression;
    };
    expression.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        return expression;
    };
    return expression;
}

