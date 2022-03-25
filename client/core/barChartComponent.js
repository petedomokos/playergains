import * as d3 from 'd3';
//import { planetsGenerator } from "./planetsGenerator";
//import {  } from "./helpers";
import { FILLS } from "./constants";

/*

*/
export default function barChartComponent() {
    //console.log("creating bar chart")
    let showValAxis = false;
    // dimensions
    let width = 600;
    let height = 600;
    const valAxisExtraEndSpaceRequired = showValAxis ? 5 : 0;
    let margin;

    let contentsWidth;
    let contentsHeight;

    //let planets = planetsGenerator();

    function updateDimns(){
        margin = margin = {
            left:width * 0.05, 
            right:d3.max([valAxisExtraEndSpaceRequired, width * 0.05]), 
            top:height * 0.05, 
            bottom:height * 0.05
        }
        contentsWidth = width - margin.left - margin.right;
        contentsHeight = height - margin.top - margin.bottom;
    };

    //functions

    //dom
    let contentsG;
    let backgroundRect;
    let contentsBackgroundRect;

    function barChart(selection) {
        //note - container g is positioned in the middle of where the chart needs to be, so need to base coods off that
        updateDimns();
        // expression elements
        selection.each(function (data) {
            if(d3.select(this).select("g").empty()){
                init.call(this);
            }
            //console.log("barChart.....", data);
            function init(){
                //console.log("barChart init", this);

                backgroundRect = d3.select(this)
                    .append("rect")
                        .attr("class", "border")
                        .attr("width", width)
                        .attr("height", height)
                        .attr("fill", FILLS?.canvas || "white")
                        .attr("stroke", "none")// "red")
                        .attr("stroke-width", 0.3)
                
                contentsG = d3.select(this)
                    .append("g")
                    .attr("class", "contents")
                
                contentsBackgroundRect = contentsG
                    .append("rect")
                        .attr("fill", "transparent")
                        .attr("stroke", "blue")
                        .attr("stroke-width", 0.3)
                        .attr("display", "none")

            }

            backgroundRect.attr("width", width).attr("height", height)
            contentsG.attr("transform", "translate("+margin.left +"," +margin.top +")");
            contentsBackgroundRect.attr("width", contentsWidth).attr("height", contentsHeight)

            //make the chart
            //axis
            const valAxisHeight = showValAxis ? 15 : 0;
            const catAxisWidth = 10;

            const barsAreaWidth = contentsWidth - catAxisWidth;
            const barsAreaHeight = contentsHeight - valAxisHeight;

            //flipped coz horizonatl bar chart
            const barWrapperWidth = barsAreaHeight/data.length;
            const barSpacing = barWrapperWidth * 0.4;
            const barWidth = barWrapperWidth - barSpacing; 
            //const barTextX = barsAreaWidth+10
            const valScale = d3.scaleLinear().domain([0, 100]).range([margin.left, barsAreaWidth]);

            const valAxis = d3.axisBottom().scale(valScale).ticks(5)
            const valAxisG = contentsG.selectAll("g.val-axis").data(showValAxis ? [1] : []);
            valAxisG.enter()
                .append("g")
                    .attr("class", "axis val-axis")
                    .attr("transform", "translate("+(margin.left +catAxisWidth) +"," +(contentsHeight - valAxisHeight)+")")
                    .call(valAxis)
                    .merge(valAxisG)
                    .each(function(){
                        d3.select(this)
                            .style("stroke-width", 0.05)
                            .style("stroke", "black")
                            .style("opacity", 0.5);
                        
                        d3.select(this).selectAll("text")
                            .style("font-size", 5)
                            .style("opacity", 0.5);
                    });
            valAxisG.exit().remove();

            //bars
            const barsAreaG = contentsG.selectAll("g.bars-area").data([1])
            barsAreaG.enter()
                .append("g")
                .attr("class", "bars-area")
                .each(function(){
                    d3.select(this)
                        .append("rect")
                            .attr("class", "bars-border")
                            .attr("fill", "transparent")
                            .attr("stroke", "grey")
                            .attr("stroke-width", 0.1)
                            .attr("opacity", 0.6)
                })
                .merge(barsAreaG)
                .attr("transform", "translate("+catAxisWidth +",0)")
                .each(function(){
                    d3.select(this).select("rect.bars-border")
                        .attr("width", barsAreaWidth)
                        .attr("height", barsAreaHeight)

                    const barG = d3.select(this).selectAll("g.bar").data(data)
                    barG.enter()
                        .append("g")
                        .attr("class", "bar")
                        .attr("id", d => "bar-"+d.key)
                        .each(function(d,i){
                            //console.log("d...", d)
                            //datapoint
                            //for now, assume only 1 datasetMeasure per goal
                            const g = d3.select(this);
                            //actual rect
                            g.append("rect")
                                .attr("class", "bar")
                                .attr("fill", "blue");

                            //projected rect
                            g.append("rect")
                                .attr("class", "proj-bar")
                                .attr("fill", "blue")
                                .attr("opacity", 0.1);
                            /*
                            g.append("text")
                                .attr("transform", "translate("+barTextX  +"," +barWidth/2 +") rotate(-45)")
                                .attr("text-anchor", "end")
                                .attr("dominant-baseline", "middle")
                                .attr("font-size", 5)
                                .attr("display", "none");
                            */

                            /*
                            g.append("svg:image")
                                .attr("href", "/tick.svg")
                                .attr("class", "tick");
                            */
                            
                        })
                        .merge(barG)
                        .attr("transform", (d,i) => "translate(0, "+((barSpacing/2) +i * barWrapperWidth) +")")
                        .each(function(d,i){
                            //console.log("d...", d)
                            //datapoint
                            //for now, assume only 1 datasetMeasure per goal
                            const g = d3.select(this);
                            //actual rect
                            g.select("rect.bar")
                                //.attr("y", valScale(d.pcValue))
                                .attr("width", valScale(d.pcValue))
                                .attr("height", barWidth)

                            //@todo - instead, use axis.clamp(true)
                            const clamp = projValue => d3.max([0, d3.min([projValue, 100])]);

                            //projected rect
                            g.select("rect.proj-bar")
                                .attr("height", barWidth)
                                .attr("x", valScale(d.pcValue))
                                .attr("width", 0)
                                .transition()
                                .duration(1000)
                                    //.attr("x", valScale(projPCValueToShow(d))) //@todo - instead, use axis.clamp(true)
                                    .attr("width", d3.max([valScale(clamp(d.projPCValue)) - valScale(d.pcValue), 0]));

                            //g.select("text").text("abc")
                                //.text(d.label);

                            /*
                            
                            const tickWidth = barWidth * 0.33;
                            const tickHeight = tickWidth;
                            g.select(".tick")
                                .attr("display", d.projPCValue < 100 ?  "none" : "inline")
                                .attr("width", tickWidth)
                                .attr("height", tickHeight)
                                .attr("x", barWidth/2 - tickWidth/2)
                                .attr("y",-tickHeight)
                                .attr("opacity", 0)
                                .transition()
                                .delay(1000)
                                .duration(300)
                                    .attr("opacity", 1);

                                    */
                            
                        })
                })

        })
        return selection;
    }     

    barChart.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        return barChart;
    };
    barChart.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        return barChart;
    };
    barChart.on = function () {
        if (!dispatch) return barChart;
        // attach extra arguments
        const value = dispatch.on.apply(dispatch, arguments);
        return value === dispatch ? barChart : value;
    };
    return barChart;
}