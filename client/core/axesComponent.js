import * as d3 from 'd3';
//import "d3-selection-multi";
import barChartLayout from "./barChartLayout";
import linksLayout from "./linksLayout";
import planetsLayout from "./planetsLayout";
import linksComponent from "./linksComponent";
import planetsComponent from "./planetsComponent";
import barChart from "./barChartComponent";
import { calcChartHeight, findFuturePlanets, findFirstFuturePlanet, findNearestDate, getTransformation } from './helpers';
//import { COLOURS, DIMNS } from "./constants";
import { addMonths } from "../util/TimeHelpers"
import { ellipse } from "./ellipse";
import { grey10, DEFAULT_D3_TICK_SIZE } from "./constants";
import { findNearestPlanet, distanceBetweenPoints, channelContainsPoint, channelContainsDate } from './geometryHelpers';
import { OPEN_CHANNEL_EXT_WIDTH } from './constants';
import dragEnhancements from './enhancedDragHandler';
import { timeMonth } from "d3-time"
import { parseTransform, shiftTranslate } from './domHelpers';

/*

*/
export default function axesComponent() {
    let scale = (x) => 0;
    //let xAxis = d3.axisBottom();
    let tickSize = DEFAULT_D3_TICK_SIZE;
    let currentZoom = d3.zoomIdentity;
    //todo - allow name to be passed in so can have x and y axis let axisName = "x";
    let data = [];
    let axes = {};

    /*
    todo - axis ticks dont update on zoom - exisitng positions change but new ones arent added
     links - pos dont update on pan
    */
    function update(selection) {
        selection.each(function (axisData) {
            data = axisData;
            //console.log("axes scale domain", scale.domain())

            const axisG = d3.select(this).selectAll("g.axis").data(data, d => d.key)
            axisG.enter()
                .append("g")
                .attr("class", (d) => "axis axis-"+d.key)
                .each(function(d){
                    //init axes
                    axes[d.key] = d3.axisBottom()
                        .ticks(timeMonth)
                        .tickSize(tickSize);

                    d3.select(this)
                        .style("stroke-width", 0.05)
                        .style("stroke", "black")
                        .style("opacity", 0)
                        .transition()
                        .delay(50)
                        .duration(200)
                            .style("opacity", 0.5);

                })
                .merge(axisG)
                .attr("transform", (d,i) => "translate("+d.transX + "," +(i * -20) +")")
                //.attr("transform", (d,i) => "translate("+d.transX + ",0)")
                .each(function(d, i){
                    const isFirstAxis = i === 0;
                    const isLastAxis = i === data.length - 1;
                    d3.select(this).call(axes[d.key].scale(scale))
                    d3.select(this).selectAll("g.tick")
                    .attr("display", tickD => {
                        //if there is another d then go up 
                        //console.log("tick d", d)
                        //if its the last axis, then remove the <= condition
                        if(isFirstAxis){
                            return tickD <= d.endDate ? "inline" : "none";
                        }
                        //if its the first axis, remove the >= conditon
                        if(isLastAxis){
                            return tickD >= d.startDate ? "inline" : "none";
                        }
                        //if its a middle axis, only show the between ticks
                        return tickD >= d.startDate && tickD <= d.endDate ? "inline" : "none";
                    })
                    .each(function(){
                        const currTrans = d3.select(this).attr("transform");
                        d3.select(this)
                            .attr("transform", shiftTranslate(0, -tickSize + DEFAULT_D3_TICK_SIZE, currTrans))
                    })
    
                })

            axisG.exit().remove();
              
        })

    }

    update.margin = function (value) {
        if (!arguments.length) { return margin; }
        margin = { ...margin, ...value};
        return update;
    };
    update.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        return update;
    };
    update.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        return update;
    };
    update.channelsData = function (value) {
        if (!arguments.length) { return channelsData; }
        channelsData = value;
        return update;
    };
    update.scale = function (value) {
        if (!arguments.length) { return scale; }
        scale = value;
        //data.forEach(d => {
            //scales[d.id].range([scale(d.startDate), scale(d.endDate)])
        //});
        return update;
    };
    update.tickSize = function (value) {
        if (!arguments.length) { return tickSize; }
        tickSize = value;
        return update;
    };
    update.currentZoom = function (value) {
        if (!arguments.length) { return currentZoom; }
        currentZoom = value;
        /*
        d3.selectAll("g.axis").each(function(d){
            if(!scales[d.key]) { return; }
            const zoomedScale = currentZoom.rescaleX(scales[d.key])
            if(d.key !== "main"){
                console.log("scale", scales[d.key].domain())
                console.log("zoomedScale", zoomedScale.domain())
            }
            axes[d.key].scale(zoomedScale)
            updateAxis.call(this, d)
        })
        */
        return update;
    };
    return update;
}

