import * as d3 from 'd3';
import { getActiveColState } from "../../helpers"
import { aggSubtools, getPropValueType } from "../../data"
import { COLOURS } from "../../constants"

export function toolForAggGenerator(selection){
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

    //functions
    let selectSubtool = () => {};

    //dom
    let toolG;
    let filterText;
    let planetText;
    let propertyText;

    //selected
    let selectedSubtool

    //components

    function myAggTool(selection){
        selection.each(function(data){
            //todo - dont need to pass all of state?
            const { state } = data;
            const activeColState = getActiveColState(state);
            console.log("myAggToolForAgg", activeColState);
            const { planet, property} = activeColState.prev.selected;
            const valueType = getPropValueType(planet.id, property?.id)
            const applicableSubtools = aggSubtools
                .filter(t => t.applicableTo.includes(valueType) || t.applicableTo.includes("all"))
            //if prev.selected.property, then we default to sum and build result object
            //else if only planet, we default to count
            toolG = d3.select(this);
        
            const btnWidth = 40;
            const btnHeight = 30;

            const subtoolsG = toolG.selectAll("g.subtools").data([activeColState])
            subtoolsG.enter()
                .append("g")
                .attr("class", "subtools")
                .merge(subtoolsG)
                //.attr("transform", "translate(40,40)")
                .each(function(){
                    const subtoolG = d3.select(this).selectAll("g.subtool").data(applicableSubtools, d => d.id)
                    const subtoolGMerged = subtoolG.enter()
                        .append("g")
                            .attr("class", d => d.id + "-btn-g btn-g")
                            .attr("transform", (d,i) => "translate(" +(i *(btnWidth + 10)) +",0)")
                            .each(function(d,i){
                                const buttonG = d3.select(this)
                                    .style("cursor", "pointer")
                                    .on("click", (e,d) => selectSubtool(d));
                                buttonG.append("rect")
                                    .attr("width", btnWidth)
                                    .attr("height", btnHeight);
                                
                                buttonG.append("text")
                                    .attr("transform", (d,i) => "translate(" +(btnWidth/2) +"," +(btnHeight/2) +")")
                                    .attr("dominant-baseline", "middle")
                                    .attr("text-anchor", "middle")
                                    .style("font-size", "10px")
                                    .attr("pointer-events", "none")
                                    .text(d => d.name)

                            })
                            .merge(subtoolG)

                    subtoolGMerged.select("rect")
                            .attr("fill", d => d.id === activeColState.subtool?.id ? COLOURS.calc.btn.selected.bg : COLOURS.calc.btn.nonSelected.bg);
                    subtoolGMerged.select("text")
                            .attr("fill", d => d.id === activeColState.subtool?.id ? COLOURS.calc.btn.selected.col : COLOURS.calc.btn.nonSelected.col)

                    
                    
                    

                    
                })
        })
        return selection;
    }

    // api
    myAggTool.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        //updateDimns();
        return myAggTool;
        };
    myAggTool.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        //updateDimns();
        return myAggTool;
    };
    myAggTool.selectSubtool = function (value) {
        if (!arguments.length) { return selectSubtool; }
        selectSubtool = value;
        //updateDimns();
        return myAggTool;
    };
    return myAggTool;

    }
