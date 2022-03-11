import * as d3 from 'd3';
//import { planetsGenerator } from "./planetsGenerator";
//import {  } from "./helpers";
//import { COLOURS, DIMNS } from "./constants";

/*

*/
export default function barChartComponent() {
    //console.log("creating bar chart")
    // dimensions
    let width = 600;
    let height = 600;
    const margin = {left:10, right:10, top:10, bottom:10}
    let contentsWidth;
    let contentsHeight;

    //let planets = planetsGenerator();

    function updateDimns(){
        contentsWidth = width - margin.left - margin.right;
        contentsHeight = height - margin.top - margin.bottom;
    };

    //functions

    //dom
    let contentsG;
    let backgroundG;

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
                contentsG = d3.select(this)
                    .append("g")
                    .attr("class", "contents")
                
                backgroundG = contentsG
                    .append("rect")
            }

            contentsG
                .attr("transform", "translate("+margin.left +"," +margin.top +")");

            backgroundG
                .attr("width", contentsWidth)
                .attr("height", contentsHeight)
                //.attr("fill", "transparent")
                .attr("fill", "blue")

            //make the chart
            //axis
            const yAxisWidth = 10;
            const xAxisHeight = 20;

            const barsAreaWidth = contentsWidth - yAxisWidth;
            const barsAreaHeight = contentsHeight - xAxisHeight;

            const barWrapperWidth = barsAreaWidth/data.length;
            //left and right margin
            const barHozMargin = barWrapperWidth * 0.2;
            const barWidth = barWrapperWidth * 0.6;
            const barLabelY = barsAreaHeight +10
            const yScale = d3.scaleLinear().domain([0, 100]).range([barsAreaHeight, margin.top]);
            const yAxis = d3.axisLeft().scale(yScale).ticks(5)
            const yAxisG = contentsG.selectAll("g.y-axis").data([1]);
            yAxisG.enter()
                .append("g")
                    .attr("class", "axis y-axis")
                    .attr("transform", "translate(" +yAxisWidth +",0)")
                    .call(yAxis)
                    .merge(yAxisG)
                    .each(function(){
                        d3.select(this)
                            .style("stroke-width", 0.05)
                            .style("stroke", "black")
                            .style("opacity", 0.5);
                        
                        d3.select(this).selectAll("text")
                            .style("font-size", 5)
                            .style("opacity", 0.5);
                    });

            //bars
            const barsAreaG = contentsG.selectAll("g.bars-area").data([1])
            barsAreaG.enter()
                .append("g")
                .attr("class", "bars-area")
                .merge(barsAreaG)
                .attr("transform", "translate("+yAxisWidth +",0)")
                .each(function(){
                    const barG = d3.select(this).selectAll("g.bar").data(data)
                    barG.enter()
                        .append("g")
                        .attr("class", "bar")
                        .attr("id", d => "bar-"+d.key)
                        .attr("transform", (d,i) => "translate("+(barHozMargin +i * barWrapperWidth) +",0)")
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
                                .attr("fill", "transparent")
                                .attr("stroke-width", 0.5)
                                .attr("stroke", "black");
                            
                            g.append("text")
                                .attr("transform", "translate("+barWidth/2 + "," +barLabelY +") rotate(-45)")
                                .attr("text-anchor", "end")
                                .attr("dominant-baseline", "middle")
                                .attr("font-size", 5);

                            g.append("svg:image")
                                .attr("href", "/tick.svg")
                                .attr("class", "tick");
                            
                        })
                        .merge(barG)
                        .each(function(d,i){
                            //console.log("d...", d)
                            //datapoint
                            //for now, assume only 1 datasetMeasure per goal
                            const g = d3.select(this);
                            //actual rect
                            g.select("rect.bar")
                                .attr("y", yScale(d.pcValue))
                                .attr("width", barWidth)
                                .attr("height", 40)//barsAreaHeight - yScale(d.pcValue));

                            //@todo - instead, use axis.clamp(true)
                            const projPCValueToShow = d => d3.max([0, d3.min([d.projPCValue, 100])]);

                            //projected rect
                            g.select("rect.proj-bar")
                                .attr("width", barWidth)
                                .attr("y", yScale(d.pcValue))
                                .attr("height", 0)
                                .transition()
                                .duration(1000)
                                    .attr("y", yScale(projPCValueToShow(d))) //@todo - instead, use axis.clamp(true)
                                    .attr("height", 60)//barsAreaHeight - yScale((projPCValueToShow(d) - d.pcValue)));

                            g.select("text").text("abc")
                                //.text(d.label);

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