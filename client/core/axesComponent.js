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
    let xAxis = d3.axisBottom();
    let tickSize = DEFAULT_D3_TICK_SIZE;

    let axisRendered = false;

    function update(selection) {
        selection.each(function (data) {
            xAxis.scale(scale)
                .ticks(timeMonth)
                .tickSize(tickSize)

            const xAxisG = d3.select(this).selectAll("g.x-axis").data([1])
            xAxisG
                .enter()
                .append("g")
                    .attr("class", "x-axis x-axis-0")
                    .each(function(){
                        d3.select(this)
                            .style("stroke-width", 0.05)
                            .style("stroke", "black")
                            .style("opacity", 0.5);
                    })
                    .merge(xAxisG)
                    .call(xAxis)
                    .each(function(){
                        d3.select(this).selectAll("g.tick").each(function(){
                            const currTrans = d3.select(this).attr("transform")
                            d3.select(this)
                                .attr("transform", shiftTranslate(0, -tickSize + DEFAULT_D3_TICK_SIZE, currTrans))
                        })
                    })
                    .style("opacity", axisRendered ? 0.5 : 0) //note - setting style op overrides the attr op that axis sets on it
                    .transition()
                    .delay(50)
                    .duration(200)
                        .style("opacity", 0.5);
            
            axisRendered = true;
              
        })

        /*
        function updateExtraAxes(){
            //based on latest channelData
            //added an axis per open channel
            const extraXAxisG = svg.selectAll("g.extra-x-axis").data(channelData.filter(ch => ch.isOpen))
            extraXAxisG.enter()
                .append("g")
                    .attr("class", (d,i) => "x-axis extra-x-axis extra-x-axis-"+i)
                    .each(function(){
                        d3.select(this)
                            .style("stroke-width", 0.05)
                            .style("stroke", "black")
                            .style("opacity", 0.5);
                    })
                    .call(xAxis)
                    .merge(extraXAxisG)
                    //must shoft axis by all the prev open channel extensions, plus this one
                    .attr("transform", (d,i) => 'translate('+(d.axisRangeShiftWhenOpen) + "," +margin.top +')')
                    .each(function(ch,i, nodes){
                        const isLast = !!channelData.find(c => c.nr > ch.nr && c.isOpen)
                        const lastChannel = channelData[channelData.length - 1]
                        const axisEndDate = channelData.find(c => c.nr > ch.nr && c.isOpen)?.startDate || lastChannel.endDate;
                        const axisEndX = channelData.find(c => c.nr > ch.nr && c.isOpen)?.startX || lastChannel.endX;
                        //note - axis has alreayd been shifted by the open channel widths
                        const domainShift = ch.endX - ch.axisRangeShiftWhenOpen;
                        d3.select(this).select(".domain")
                            .attr("transform", 'translate(0,' +(contentsHeight - 30) +')')
                            .attr("d", "M" + domainShift + ",0H"+axisEndX +(isLast ? "V394" : ""));
                        
                        //console.log("axis endDate", axisEndDate)
                        //hide all g.tick where transX is less than timeScale(d.date) +d.rangeShift
                        d3.select(this).selectAll("g.tick")
                            .attr("display", d => d < ch.endDate || d > axisEndDate ? "none" : "inline")

                        if(i == 0){
                            //if there is a future open channel, this domain runs to far
                            //it should have openChanelExt width removed, and it shouldnt drop vertically 
                            //d3.select(this).select(".domain").style("stroke-width", 3).style("stroke", "black")
                        }
                            

                        //if first open channel, hide main x-axis ticks
                        if(i === 0){
                            //console.log("ch", ch)
                            d3.select("g.x-axis-0").selectAll("g.tick")
                                .attr("display", d => d >= ch.endDate? "none" : "inline")

                            const mainDomainPath = d3.select("g.x-axis-0").selectAll(".domain")
                            const startOfD = mainDomainPath.attr("d").split("H")[0];
                            mainDomainPath.attr("d", startOfD + "H" + ch.startX);
                        }
                    })
                    .style("opacity", initAxisRenderDone ? 0.5 : 0) //note - setitng style op overrides the attr op that axis sets on it
                    .transition()
                    .delay(50)
                    .duration(200)
                        .style("opacity", 0.5);

        }
        */

        return selection;
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
    update.scale = function (value) {
        if (!arguments.length) { return scale; }
        scale = value;
        return update;
    };
    update.tickSize = function (value) {
        if (!arguments.length) { return tickSize; }
        tickSize = value;
        return update;
    };
    return update;
}

