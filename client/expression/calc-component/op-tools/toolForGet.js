import * as d3 from 'd3';
import { getActiveColState } from "../../helpers"

export function toolForGetGenerator(selection){
    //dimensions
    let width = 350;
    let height = 100;
    let margin =  { top: 10, bottom:10, left:10, right:10 };
    let chartHeight = height - margin.bottom;
    let chartWidth = width;
    const updateDimns = () =>{
        chartHeight = height - margin.bottom;
        chartWidth = width;
        //todo - call update
    }

    //dom
    let toolG;
    let filterText;
    let planetText;
    let propertyText;

    //selected

    //components

    function myTool(selection){
        selection.each(function(data){
            const { state } = data;
            const activeColState = getActiveColState(state);
            //ENTER
            if(!toolG){
                toolG = d3.select(this)

                //filter text
                filterText = toolG.append("text")
                    .attr("class", "filter")
                    .attr("transform", "translate(5,10)")
                    //.attr("dominant-baseline", "middle")
                    .attr("text-anchor", "start")
                    .attr("font-size", 12)
                    .attr("fill", "red")

                //planet text
                planetText = toolG.append("text")
                    .attr("class", "planet")
                    .attr("transform", "translate(30,20)")
                    //.attr("dominant-baseline", "hanging")
                    .attr("text-anchor", "start")
                    .attr("font-size", 14)
                    //.attr("fill", )

                //filter text
                propertyText = toolG.append("text")
                    .attr("class", "property")
                    .attr("transform", "translate(90,20)")
                    //.attr("dominant-baseline", "hanging")
                    .attr("text-anchor", "start")
                    .attr("font-size", 12)
                    .attr("fill", "red")

            }

            //UPDATE
            filterText.text(activeColState.selected?.filter?.desc || "")
            //selected, the there must be a planet selected
            planetText.text(activeColState.selected?.planet.name || "Click planet or property")
            //there may be a property
            propertyText.text(activeColState.selected?.property?.name || "")
            
        })
        return selection;
    }

    // api
    myTool.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        //updateDimns();
        return myTool;
        };
    myTool.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        //updateDimns();
        return myTool;
    };
    return myTool;

    }
