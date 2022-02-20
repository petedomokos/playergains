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
import { ContactsOutlined } from '@material-ui/icons';
/*

*/
export default function journeyGenerator() {
    // dimensions
    let margin = {left:0, right:0, top: 0, bottom:0};
    let width = 400;
    let height = 300;
    let chartWidth;
    let chartHeight;

    function updateDimns(){
        chartWidth = width - margin.left - margin.right;
        chartHeight = height - margin.top - margin.bottom;
    };

    //dom
    let svg;
    let chartG;
    let viewG;

    let x;
    let xAxis;

    let currentTransform;

    function journey(selection) {
        const data = [10,20,30,40, 80, 90];
        const radius = 5;
        updateDimns();
        svg = selection.style("border", "solid");
        svg.append("defs")
                .append("clipPath").attr("id", "chart")
                    .append("rect")
                        .attr("x", margin.left)
                        .attr("y", margin.top)
                        .attr("width", chartWidth)
                        .attr("height", chartHeight)
                        .attr("stroke", "blue")
                        .attr("fill", "blue");

        if(!chartG){
            // All elements are added to this object
            chartG = svg.append("g").attr("class", "chart")
                .attr("transform",`translate(${[margin.left,margin.top]})`)
             // The zoomable parts are added to this object
            viewG = chartG
                .append("g") // the unclipped zoomable object
                    .attr("class", "view")
                    .attr("clip-path", "url(#chart)")
                        .append("g") // the clipped zoomable object

            //init scale and axis
            x = d3.scaleLinear()
                .domain([0,100])
                .range([margin.left, margin.left + chartWidth]);

            xAxis = d3.axisBottom(x)
        }

        updateAxis()

        function updateAxis(){
            //update axis
            const xAxisG = chartG.selectAll("g.x-axis").data([1])
            xAxisG
                .enter()
                .append("g")
                    .attr("class", "x-axis")
                    .attr("transform", 'translate(0,' +chartHeight +')')
                    .merge(xAxisG)
                    .call(xAxis) //call after merge so it is called each time updateAxis is called
                    .each(function(){
                        d3.select(this).selectAll("text").attr("font-size", 6)
                    })
        }

        drawDatapoints();
        

        // Zoom configuration
        let currentZoom = d3.zoomIdentity;
        const extent = [[0,0],[chartWidth, chartHeight]];

        const zoom = d3.zoom()
            .scaleExtent([1, 3])
            .extent(extent)
            .translateExtent(extent)
            .on('zoom', function(event) {
                // calculate new zoom transform
                currentZoom = event.transform

                // rescale positions and dots
                viewG.attr("transform", currentZoom);
                d3.selectAll("circle.dot")
                        .attr("r", radius/currentZoom.k)

                // rescale scales and axes
                xAxis.scale(currentZoom.rescaleX(x));
                updateAxis();

            })

        svg.call(zoom);

        // Draw data visualization
        function drawDatapoints() {
            viewG.selectAll("circle.dot")
                .data(data)
                .enter()
                .append("circle").attr("class", "dot")
                    .attr("r", radius)
                    .attr("cx", d => x(d))
                    .attr("cy", chartHeight/2)
                    .style("fill", "red");
        }


        // expression elements
        /*
        selection.each(function (data) { 
            if(!svg){
                svg = d3.select(this).style("border", "solid");
                chartG = svg.append("g").attr("class", "chart")
            } 
            svg.attr("width", width).attr("height", height)
            chartG.attr("transform", "translate("+ margin.left + "," + margin.top + ")")

            x = d3.scaleLinear()
                .domain([0, 100])
                .range([0, chartWidth]);

            updateAxis();

            function updateAxis(){
                console.log("x.domain", x.domain())

                const xAxis = d3.axisBottom().scale(x)

                const xAxisG = chartG.selectAll("g.x-axis").data([1])
                xAxisG
                    .enter()
                    .append("g")
                        .attr("class", "x-axis")
                        .attr("transform", 'translate(0,' +chartHeight +')')
                        .merge(xAxisG)
                        .call(xAxis) //call after merge so it is called each time updateAxis is called
                        .each(function(){
                            d3.select(this).selectAll("text").attr("font-size", 6)
                        })
            }

            const backgroundRect = chartG.selectAll("rect.background").data([1])
            backgroundRect.enter()
                .append("rect")
                    .attr("class", "background")
                    .attr("width", chartWidth)
                    .attr("height", chartHeight)
                    .attr("fill", "aqua")

            //circles
            const circlesData = d3.range(0, 100, 10)
            const circle = chartG.selectAll("circle").data(circlesData)
            circle.enter()
                .append("circle")
                    .attr("fill", "red")
                    .attr("r", 5)
                    .attr('cx', d => x(d))
                    .attr("cy", chartWidth/2)

            function zoomed(e){
                console.log("t", e.transform)
                console.log("svg", d3.zoomTransform(svg.node()))
                console.log("chartG", d3.zoomTransform(chartG.node()))
                //make a copy of the scales -no need I dont thnk
                //const copyX = x.copy();  
                //console.log("zoomed transform", e.transform)
                //currentTransform = e.transform;
                x = e.transform.rexScale(x);
                console.log("new domain", x.domain())
                updateAxis();

                //d3.select("g.x-axis").call(d3.axisBottom().scale(x));
            }
    
            function myDelta(e) {
                return -e.deltaY * (e.deltaMode ? 120 : 1) / 10000;
            }
            
            const zoom = d3.zoom()
                //.extent([[0, 0], [chartWidth, chartHeight]])
                //.translateExtent([[0, 0], [chartWidth * 100, chartHeight * 2]])
                .scaleExtent([0.125, 8])
                //.wheelDelta(myDelta)
                .on("zoom", zoomed)

            svg.call(zoom)
        })
        */

        return selection;
    }     
    journey.margin = function (value) {
        if (!arguments.length) { return margin; }
        margin = { ...margin, ...value};
        return journey;
    };
    journey.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        return journey;
    };
    journey.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        return journey;
    };

    return journey;
}


