import * as d3 from 'd3';
import { expressionBoxGenerator } from "./expressionBoxGenerator"

//import { expressionBoxGenerator } from "./expressionBoxGenerator"
import { planetHomeVisGenerator } from './vis/planetHomeVisGenerator';
import { planetGetVisGenerator } from './vis/planetGetVisGenerator';
import { planetAggVisGenerator } from './vis/planetAggVisGenerator';
import { planetEmptyVisGenerator } from './vis/planetEmptyVisGenerator';
import { COLOURS } from "../constants"

export function expressionGenerator(){
    //dimns
    let width = 600;
    let height = 500;
    const margin = {};
    let colWidth = 140;
    let colHeight = height;
    const colMargin = { right: 20 }
    let boxAndVisWidth = 130;
    let boxHeight = 50;
    let visHeight = 200;

    //context
    let context;

    //components
    // must be a sep generator for each col
    let expressionBoxComponents = {};
    let expressionVisComponents = {};

    //state
    let state;

    //dom
    let expressionG;

    function updateExpressionComponents(i){
        //remove previous
        if(expressionBoxComponents[i]){
            //we don't want to remove the gs themselves, as they are managed via the EUE pattern
            d3.select(this).select("g.box").selectAll("g.contents").remove();
            d3.select(this).select("g.vis").selectAll("g.contents").remove();
        }
        const { op } = state[i];
        if(context === "Planet"){
            switch(op?.id){
                case "home":{
                    expressionBoxComponents[i] = expressionBoxGenerator(); //for now, boxes are same
                    expressionVisComponents[i] = planetHomeVisGenerator();
                    break;
                }
                case "get":{
                    expressionBoxComponents[i] = expressionBoxGenerator(); //for now, boxes are same
                    expressionVisComponents[i] = planetGetVisGenerator();
                    break;
                }
                case "agg":{
                    expressionBoxComponents[i] = expressionBoxGenerator(); //for now, boxes are same
                    expressionVisComponents[i] = planetAggVisGenerator();
                    break;
                }
                //default when no op ie col will be empty
                default:{
                    expressionBoxComponents[i] = expressionBoxGenerator(); //for now, boxes are same
                    expressionVisComponents[i] = planetEmptyVisGenerator();
                }
            }
        }else{
            //for now its the saem, but this will be the landscape context
            switch(op?.id){
                case "home":{
                    expressionBoxComponents[i] = expressionBoxGenerator(); //for now, boxes are same
                    expressionVisComponents[i] = planetHomeVisGenerator();
                    break;
                }
                case "get":{
                    expressionBoxComponents[i] = expressionBoxGenerator(); //for now, boxes are same
                    expressionVisComponents[i] = planetGetVisGenerator();
                    break;
                }
                //default when no op ie col will be empty
                default:{
                    expressionBoxComponents[i] = expressionBoxGenerator(); //for now, boxes are same
                    expressionVisComponents[i] = planetEmptyVisGenerator();
                }
            }
        }
    }
    function expression(selection){
        expressionG = selection;

        const backgroundRect = expressionG.selectAll("rect.background").data([{width,height}])
        backgroundRect.enter()
            .append("rect")
            .attr("class", "background")
            .merge(backgroundRect)
            .attr("width", d => d.width)
            .attr("height", d => d.height)
            .attr("fill", COLOURS.exp.bg)

        //console.log("expressoin state", selection.datum())
        selection.each(function(stateData){
            state = stateData;
            //console.log("exp state", state)
            //BIND
            const colG = selection.selectAll("g.col").data(state)

            //ENTER
            //here we append the g, but after this point .enter will still refer to the pre-entered placeholder nodes
            const colGEnter = colG.enter()
               .append("g")
               .attr("class", (d,i) => "col col-"+i)
               .attr("transform", (d,i) => "translate(" +(i * (colWidth + colMargin.right))+",0)")

            
            colGEnter.append("rect")
                .attr("class", "background")
                .attr("width", colWidth - colMargin.right)
                .attr("height", colHeight)
                .attr("fill", COLOURS.exp.col.bg)

            colGEnter.append("g").attr("class", "box")
            colGEnter.append("g").attr("class", "vis").attr("transform", "translate(0," + (boxHeight) +")")
            //note - if we merge, the indexes will stay as they are from orig sel and sel.enter()
            //os need to select again
            colG.merge(colGEnter)
                .each(function(d,i){
                    //update components
                    //expressionBox and expressionVis are both updated in sync with each other
                    //@todo - the box will always be rendered, so use that to check for updates instead of vis
                    //but to do this, we need a different expBox for each context and op
                    const contextHasChanged = expressionVisComponents[i]?.applicableContext !== context;
                    const opHasChanged = expressionVisComponents[i]?.applicableOp !== d.op?.id;
                    if(contextHasChanged || opHasChanged){
                        updateExpressionComponents.call(this, i)
                    }
                    //call components
                     //todo - height not being passed thru successfully
                    d3.select(this).select("g.box")
                        .call(expressionBoxComponents[i].width(boxAndVisWidth).height(boxHeight))
                    d3.select(this).select("g.vis")
                        .call(expressionVisComponents[i].width(boxAndVisWidth).height(visHeight))
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

