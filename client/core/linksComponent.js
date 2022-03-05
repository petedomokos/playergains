import * as d3 from 'd3';
//import "d3-selection-multi";
import { getGoalsData } from '../data/planets'
import barChartLayout from "./barChartLayout";
import barChart from "./barChartComponent";
import { calcChartHeight, findFuturePlanets, findFirstFuturePlanet, findNearestDate, getTransformation } from './helpers';
//import { COLOURS, DIMNS } from "./constants";
import { addWeeks } from "../util/TimeHelpers"
import { ellipse } from "./ellipse";
import { grey10 } from "./constants";
import { findNearestPlanet, distanceBetweenPoints, channelContainsPoint, channelContainsDate } from './geometryHelpers';
import { OPEN_CHANNEL_EXT_WIDTH } from './constants';
import dragEnhancements from './enhancedDragHandler';
import { timeMonth, timeWeek } from "d3-time"
/*

*/
export default function linksComponent() {
    // dimensions
    let margin = {left:0, right:0, top: 0, bottom:0};
    let width = 4000;
    let height = 2600;
    let contentsWidth;
    let contentsHeight;


    const barChartWidth = 100;
    const barChartHeight = 100;

    function updateDimns(){
        contentsWidth = width - margin.left - margin.right;
        contentsHeight = height - margin.top - margin.bottom;
    };

    let linksData = [];

    //functions
    let barCharts = {};

    function links(selection) {
        updateDimns();

        selection.each(function (data) {
            //console.log("links", data);
            if(data){ linksData = data;}
           
            const linkG = d3.select(this).selectAll("g.link").data(linksData, l => l.id);
            linkG.enter()
                .append("g")
                    .attr("class", "link")
                    .attr("id", d => "link-"+d.id)
                    .each(function(d,i){
                        d3.select(this)
                            .append("line")
                                .attr("stroke", grey10(5))
                        
                        barCharts[d.id] = barChart();

                        d3.select(this)
                            .append("g")
                                .attr("class", "bar-chart")
                    })
                    .merge(linkG)
                    .each(function(d,i){
                        const line = d3.select(this).select("line")
                        //first time we use src and targ as start aswell as end
                        line
                            .attr("x1", line.attr("x1") || d.src.x)
                            .attr("y1", line.attr("y1") || d.src.y)
                            .attr("x2", line.attr("x2") || d.targ.x)
                            .attr("y2", line.attr("y2") || d.targ.y)
                            .transition()
                            .delay(50)
                            .duration(200)
                                .attr("x1", d.src.x)
                                .attr("y1", d.src.y)
                                .attr("x2", d.targ.x)
                                .attr("y2", d.targ.y)

                    //about bar charts
                    //- they appear halfway up the link, so if link covers two channels, it will not be in same pos as a chart for a link covering one of the channels
                    //- if any channel that teh link covers is open, then the link chart shows

                    d3.select(this).select("g.bar-chart")
                        .attr("display", d.isOpen ? "inline" : "none")
                        .attr("transform", "translate("+d.x + "," +d.y +")")
                        .datum(d.barChartData)
                        .call(barCharts[d.id]
                            .width(barChartWidth)
                            .height(barChartHeight))
                })
        })
        return selection;
    }     
    links.margin = function (value) {
        if (!arguments.length) { return margin; }
        margin = { ...margin, ...value};
        return links;
    };
    links.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        return links;
    };
    links.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        return links;
    };
    links.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        return links;
    };
    links.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        return links;
    };
    links.updatePlanet = function (value) {
        if (!arguments.length) { return updatePlanet; }
        if(typeof value === "function"){
            updatePlanet = value;
        }
        return links;
    };
    links.addLink = function (value) {
        if (!arguments.length) { return addLink; }
        if(typeof value === "function"){
            addLink = value;
        }
        return links;
    };
    links.on = function () {
        if (!dispatch) return links;
        // attach extra arguments
        const value = dispatch.on.apply(dispatch, arguments);
        return value === dispatch ? links : value;
    };
    return links;
}
