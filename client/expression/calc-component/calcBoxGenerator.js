import * as d3 from 'd3';
import { toolForGetGenerator } from "./op-tools/toolForGet"
import { toolForAggGenerator } from "./op-tools/toolForAgg"
import { getActiveColState } from "../helpers"
import { COLOURS, DIMNS } from "../constants"

export function calcBoxGenerator(selection){
    //dimensions
    let width = 350;
    let height = 100;
    let margin = DIMNS.margin;
    let contentsWidth = width;
    let contentsHeight = height - margin.bottom;
    const updateDimns = () =>{
        contentsWidth = width - margin.left - margin.bottom;
        contentsHeight = height - margin.top - margin.bottom;
    }

    //dom
    let boxG;
    let backgroundRect;
    let opText;
    let opToolG;

    //selected
    let selectedOp;

    //components
    let opToolId;
    let opTool = () => {};
    let selectSubtool = () => {};

    function updateOpTool(){
        if(selectedOp?.id !== opToolId){
            //console.log("rendering new components for context", context)
            if(opTool){
                //remove everything from calcG, because there is no EUE pattern attached to the g
                opToolG.selectAll("*").remove();
            }
            //for now, only vis is different
            switch(selectedOp?.id){
                case "get":{
                    opTool = toolForGetGenerator();
                    break;
                }
                case "agg":{
                    opTool = toolForAggGenerator()
                        .selectSubtool(selectSubtool);
                    break;
                }
                /*
                case "filter":{
                    opTool = toolForFilter();
                    break;
                }
                case "get":{
                    opTool = toolForAgg();
                    break;
                }
                case "get":{
                    opTool = toolForMap();
                    break;
                }
                */
                //if no selectedTool
                default:{
                    opTool = () => {}
                }
            }

        }
        //set current
        opToolId = selectedOp?.id;
    }

    function myCalcBox(selection){
        selection.each(function(data){
            const { opsInfo, state} = data;
            const activeColState = getActiveColState(state);
            selectedOp = activeColState.op;
            //ENTER
            if(!boxG){
                boxG = d3.select(this);
                backgroundRect = boxG.append("rect")
                    .attr("class", "background")
                    .attr("fill", COLOURS.calc.bg)

                //add the op text in middle far-left
                opText = boxG.append("text")
                    .attr("class", "op")
                    .attr("transform", "translate(5,5)")
                    .attr("dominant-baseline", "hanging")
                    .attr("font-size", "12px")
                    .attr("fill", COLOURS.calc.op.selected)
                
                opToolG = boxG.append("g")
                    .attr("class", "calc")
                    .attr("transform", "translate(20,30)")

                //add the filter signifier (eg ALL) in top left

                //add the planet text middle left in caps

                //add the property text middle left
            }

            //UPDATE
            //calc component
            updateOpTool();

            //background
            backgroundRect
                .attr("width", contentsWidth)
                .attr("height", contentsHeight)
            //op text
            opText
                .text(selectedOp?.name || "")

            //calc
            //we pass all state through as some tools may need it - todo-  check maybe only need activeCol
            opToolG.datum({state}).call(opTool)
            
        })
        return selection;
    }

    // api
    myCalcBox.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        //updateDimns();
        return myCalcBox;
        };
    myCalcBox.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        //updateDimns();
        return myCalcBox;
    };
    myCalcBox.selectSubtool = function (value) {
        if (!arguments.length) { return selectSubtool; }
        selectSubtool = value;
        //updateDimns();
        return myCalcBox;
    };
    return myCalcBox;

}
