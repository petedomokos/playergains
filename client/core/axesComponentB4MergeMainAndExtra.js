import * as d3 from 'd3';
//import "d3-selection-multi";
import barChartLayout from "./barChartLayout";
import linksLayout from "./linksLayout";
import planetsLayout from "./planetsLayout";
import linksComponent from "./linksComponent";
import planetsComponent from "./planetsComponent";
import barChart from "./barChartComponent";
import { calcChartHeight, findFuturePlanets, findFirstFuturePlanet, findNearestDate, getTransformationFromTrans } from './helpers';
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

    let channelsData;
    let axisRendered = false;
    let openChannelsData;

    function update(selection) {
        selection.each(function (data) {
            xAxis.scale(scale)
                .ticks(timeMonth)
                .tickSize(tickSize)

            openChannelsData = channelsData.filter(ch => ch.isOpen);

            updateMainAxis.call(this);
            axisRendered = true;

            updateExtraAxes.call(this);
              
        })

        function updateExtraAxes(){
            console.log("channels", channelsData)
            //based on latest channelsData
            //added an axis per open channel
            const extraXAxisG = d3.select(this).selectAll("g.extra-x-axis").data(openChannelsData)
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
                    //note - removed margn.top shift
                    .attr("transform", (d,i) => "translate("+(d.axisRangeShiftWhenOpen) + ",0)")
                    .each(function(ch,i, nodes){
                        //next to do - replace refs to startX, x, y etc with timeScale etc
                        const isLast = !!channelsData.find(c => c.nr > ch.nr && c.isOpen)
                        const lastChannel = channelsData[channelsData.length - 1]
                        const axisEndDate = openChannelsData.find(c => c.nr > ch.nr)?.startDate || lastChannel.endDate;
                        const axisEndX = openChannelsData.find(c => c.nr > ch.nr)?.startX || lastChannel.endX;
                        //note - axis has alreayd been shifted by the open channel widths
                        const domainShift = ch.endX - ch.axisRangeShiftWhenOpen;
                        d3.select(this).select(".domain")
                            //.attr("transform", 'translate(0,' +(contentsHeight - 30) +')')
                            .attr("d", "M" + domainShift + ",0H"+axisEndX +(isLast ? "V394" : ""));
                        
                        //console.log("axis endDate", axisEndDate)
                        //hide all g.tick where transX is less than timeScale(d.date) +d.rangeShift
                        d3.select(this).selectAll("g.tick")
                            .attr("display", d => d < ch.endDate || d > axisEndDate ? "none" : "inline")
                            .each(function(){
                                d3.select(this).each(function(){
                                    const currTrans = d3.select(this).attr("transform")
                                    d3.select(this)
                                        .attr("transform", shiftTranslate(0, -tickSize + DEFAULT_D3_TICK_SIZE, currTrans))
                                })
                            })
                    })
                    .style("opacity", axisRendered ? 0.5 : 0) //note - setitng style op overrides the attr op that axis sets on it
                    .transition()
                    .delay(50)
                    .duration(200)
                        .style("opacity", 0.5);

            extraXAxisG.exit().remove();

        }

        return selection;
    }
    
    function updateMainAxis(){
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
                        if(openChannelsData[0]){
                            d3.select(this).selectAll("g.tick")
                                .attr("display", d => d >= openChannelsData[0].endDate ? "none" : "inline")
                                .each(function(){
                                    const currTrans = d3.select(this).attr("transform")
                                    d3.select(this)
                                        .attr("transform", shiftTranslate(0, -tickSize + DEFAULT_D3_TICK_SIZE, currTrans))
                                })

                            const mainDomainPath = d3.select(this).selectAll(".domain")
                            const startOfD = mainDomainPath.attr("d").split("H")[0];
                            mainDomainPath.attr("d", startOfD + "H" + openChannelsData[0].startX);
                        }
                    })
                    .style("opacity", axisRendered ? 0.5 : 0) //note - setting style op overrides the attr op that axis sets on it
                    .transition()
                    .delay(50)
                    .duration(200)
                        .style("opacity", 0.5);

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
        return update;
    };
    update.tickSize = function (value) {
        if (!arguments.length) { return tickSize; }
        tickSize = value;
        return update;
    };
    return update;
}

