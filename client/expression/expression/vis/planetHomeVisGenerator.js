import * as d3 from 'd3';
import { COLOURS } from "../../constants"

/*
    note - downside of merging colG before pasing through here is ts a bit trickier to do update only
    but we can still do it using and else() after the if statement
*/
export function planetHomeVisGenerator(selection){
    let width = 130;
    let height = 40;
    let margin =  { bottom:10 };
    let chartHeight = height - margin.bottom;
    let chartWidth = width;
    const updateDimns = () =>{
        chartHeight = height - margin.bottom;
        chartWidth = width;
        //todo - call update
    }

    //dom
    //store contents on a separate g that can be removed if op or context changes without affecting the EUE pattern
    let visContentsG;
    function myHomeVis(selection){        
        selection.each(function(d,i){
            const visG = d3.select(this);
            //enter
            if(visG.select("*").empty()){
                visContentsG = visG.append("g").attr("class", "contents");
                visContentsG
                    .append("line")
                        .attr("x1", 0)
                        .attr("y1", chartHeight/2)
                        .attr("x2", chartWidth)
                        .attr("y2", chartHeight/2)
                        .attr("stroke", COLOURS.exp.vis.val)
                        //.attr("fill", "#C0C0C0")
                        //.attr("stroke", "grey")

                visContentsG
                    .append("text")
                        .attr("class", "count")
                        .attr("transform", "translate("+(chartWidth - 5) +"," + (chartHeight + 5) +")")
                        .attr("text-anchor", "end")
                        .attr("dominant-baseline", "hanging")
                        .attr("fill", COLOURS.exp.vis.count)
                        .text("Count:") 
            }

            //update
            //note - we dontcheck for d.op because this is set from the start on home col
            visContentsG.attr("opacity", d.selected ? 1 : 0)  
            visContentsG.select("text.count")
                .text("Count:" +(d.selected?.planet ? d.selected.planet.instances.length : 0))

        })
        return selection;
    }

    // api
    myHomeVis.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        updateDimns();
        return myHomeVis;
        };
    myHomeVis.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        updateDimns();
        return myHomeVis;
    };
    myHomeVis.applicableContext = "Planet"
    myHomeVis.applicableOp = "home"
    return myHomeVis;

    }
