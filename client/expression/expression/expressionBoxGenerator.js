import * as d3 from 'd3';
import { COLOURS } from "../constants"

/*
We call a diffrent boxGenerator for each boxG

*/
export function expressionBoxGenerator(selection){
    //todo - work out why heights and widths are not dynamically being upated
    let width = 130;
    let height = 50;
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
    let contentsG;
    let textContentsG;

    //Note: We call a different boxGenerator for each boxG, so i is always 0
    function myExpressionBox(selection){
        //selection is a single boxG so i always 0
        selection.each(function(d){
            console.log("expBox d",d)
            const boxG = d3.select(this);
            //ENTER
            if(boxG.select("*").empty()){
                contentsG = boxG.append("g").attr("class", "contents");
                //background
                contentsG
                    .append("rect")
                        .attr("fill", COLOURS.exp.box.bg)
                //text
                //todo - use EUE as text requirements may change -may need other items eg formula for profit
                
                contentsG
                    .append("text")
                        .attr("class", "instruction")
                        .attr("fill", COLOURS.instruction)
                        .attr("font-size", 10)
                        .attr("stroke-width", 0.1)
                        .attr("dominant-baseline", "middle")
                        .attr("text-anchor", "middle")

                contentsG
                    .append("text")
                        .attr("class", "op")
                        .attr("transform", "translate(5,5)")
                        .attr("fill", COLOURS.calc.op.nonSelected)
                        .attr("font-size", 9)
                        .attr("stroke-width", 0.1)
                        .attr("dominant-baseline", "hanging")
                contentsG
                    .append("text")
                        .attr("class", "selection")
                        .attr("fill", COLOURS.exp.box.sel)
                        .attr("font-size", 12)
                        .attr("stroke-width", 0.1)
                        .attr("dominant-baseline", "text-bottom")
                        .attr("text-anchor", "middle")
                    
            }
            //UPDATE
            //background
            contentsG.select("rect").attr("width", chartWidth).attr("height", chartHeight)
            //text
            console.log("d",d)
            contentsG.select("text.instruction")
                .attr("transform", "translate(+"+(chartWidth/2) +"," + (chartHeight/2) +")")
                .attr("display", (d.selected || (d.op && d.op.id !== "home") ? "none" : "inline"))
                .text("Click tool, planet or property")

            contentsG.select("text.op")
                .attr("display", d.op?.id === "home" && !d.selected ? "none" : "inline")
                .text(d.op?.name || "")

            contentsG.select("text.selection")
                .attr("transform", "translate(+"+(chartWidth/2) +"," + (chartHeight - 10) +")")
                .text(selectionText(d));

        })
        //helpers
        function selectionText(d){
            const planetName = d.selected?.planet.name || "";
            //property will only be defined if planet is defined
            const propertyName = d.selected?.property?.name || "";
            return planetName + " " +propertyName;
        }

        return selection;
    }

    // api
    myExpressionBox.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        //updateDimns();
        return myExpressionBox;
        };
    myExpressionBox.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        //updateDimns();
        return myExpressionBox;
    }
    myExpressionBox.applicableContext = "Planet"
    myExpressionBox.applicableOp = "get"
    
    return myExpressionBox;

    }
