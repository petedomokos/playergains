import * as d3 from 'd3';
//import "d3-selection-multi";
import channelsLayout from "./channelsLayout";
import axesLayout from "./axesLayout";
import linksLayout from "./linksLayout";
import planetsLayout from "./planetsLayout";
import axesComponent from "./axesComponent";
import linksComponent from "./linksComponent";
import planetsComponent from "./planetsComponent";
import { calcChartHeight, findFuturePlanets, findFirstFuturePlanet, findNearestDate, getTransformation,
    calcTrueX, calcAdjX, findPointChannel, findDateChannel, findNearestChannelByEndDate } from './helpers';
//import { COLOURS, DIMNS } from "./constants";
import { addMonths, addWeeks } from "../util/TimeHelpers"
import { ellipse } from "./ellipse";
import { grey10, DEFAULT_D3_TICK_SIZE } from "./constants";
import { findNearestPlanet, distanceBetweenPoints, channelContainsPoint, channelContainsDate } from './geometryHelpers';
import dragEnhancements from './enhancedDragHandler';
import { timeMonth, timeWeek } from "d3-time"

/*

*/
export default function journeyComponent() {
    // dimensions
    let margin = {left:0, right:0, top: 0, bottom:30};
    let planetMargin = {left:5, right:5, top: 5, bottom:5};
    let width = 4000;
    let height = 2600;
    let contentsWidth;
    let contentsHeight;
    //canvas will be a lot bigger than the contentsWidth and contentsHeight
    // of svg container, and can be panned/zoomed
    let canvasWidth;
    let canvasHeight;

    let planetWidth;
    let planetHeight;
    let planetContentsWidth;
    let planetContentsHeight;

    let chartWidth;
    let chartHeight;
    const planetWrapperHeight = isOpen => isOpen ? planetHeight + chartHeight : planetHeight;
    
    const TIME_AXIS_WIDTH = 50;
    let planetWrapperWidth;

    let enhancedZoom = dragEnhancements();

    const myChannelsLayout = channelsLayout();
    const myAxesLayout = axesLayout();
    const myLinksLayout = linksLayout();
    const myPlanetsLayout = planetsLayout();

    const axes = axesComponent();
    const links = linksComponent();
    const planets = planetsComponent();

    function updateDimns(){
        contentsWidth = width - margin.left - margin.right;
        contentsHeight = height - margin.top - margin.bottom;
        canvasWidth = contentsWidth// * 5;
        canvasHeight = contentsHeight * 5; //this should be lrge enough for all planets, and rest can be accesed via pan

        planetWrapperWidth = 120;
        //note - planetWrapperHeight depends on whether or not planet is active
        
        planetWidth = planetWrapperWidth;
        planetContentsWidth = planetWidth - planetMargin.left - planetMargin.right;
        planetHeight = 80;//calcPlanetHeight(height);
        planetContentsHeight = planetHeight - planetMargin.top - planetMargin.bottom;

        chartWidth = planetWrapperWidth;
        //we want enough space on screen for two planets and 1 chart
        chartHeight = calcChartHeight(height, planetHeight);
    };

    //api
    let addPlanet = function(){};
    let updatePlanet = function(){};
    let addLink = function(){};
    let updateChannel = function(){};

    //functions
    let barCharts = {};

    //dom
    let svg;
    let contentsG;
    let axesG;
    let canvasG;
    let canvasRect;

    let initAxisRenderDone = false;

    let timeScale;
    let xAxisG;
    let yScale;
    let yAxisG;

    let xAxis;

    let currentZoom = d3.zoomIdentity;

    const now = new Date();
    
    const ring = ellipse().className("ring");

    function journey(selection) {
        updateDimns();
        selection.each(function (state) {
            console.log("openChannels state", state.channels.filter(ch => ch.isOpen))
            //init svg, contentsG, canvasG, canvasRect, axesG
            if(!svg){ init.call(this);}

            yScale = d3.scaleLinear().domain([0, 100]).range([margin.top, margin.top + contentsHeight])

            const displayedChannels = state.channels.filter(ch => ch.nr >= -1 && ch.nr <= 3)
            const firstDisplayedChannel = displayedChannels[0];
            const lastDisplayedChannel = displayedChannels[displayedChannels.length -1];
            
            const nrDisplayedMonths = displayedChannels.length;
            const widthPerMonth = contentsWidth / nrDisplayedMonths;
            const domain = [
                addWeeks(-52, firstDisplayedChannel.startDate),
                lastDisplayedChannel.endDate
            ]
            const range = [
                -widthPerMonth * 12,
                contentsWidth
            ]
            timeScale = d3.scaleTime()
                .domain(domain)
                .range(range)
                //.domain([firstDisplayedChannel.startDate, lastDisplayedChannel.endDate])
                //.range([0, contentsWidth])

            const channelsData = myChannelsLayout.scale(timeScale)(displayedChannels)
            //console.log("channelsData...", channelsData);
            const axesData = myAxesLayout(channelsData);

            axes
                .scale(timeScale)
                .tickSize(contentsHeight + DEFAULT_D3_TICK_SIZE)
                //.currentZoom(currentZoom);

            axesG.datum(axesData).call(axes);

            //helpers
            const trueX = calcTrueX(channelsData);
            const pointChannel = findPointChannel(channelsData);
            /*
            const adjX = calcAdjX(channelsData);
            const dateChannel = findDateChannel(channelsData);
            const nearestChannelByEndDate = findNearestChannelByEndDate(channelsData);
            */
            // Zoom configuration
            const extent = [[0,0],[chartWidth, chartHeight]];
            let wasMoved = false;

            enhancedZoom
                .onClick(handleClick)
                .onLongpressStart(function(e,d){
                    if(!enhancedZoom.wasMoved()){
                        //longpress toggles isOpen
                        const { id, isOpen } = pointChannel({ x:e.sourceEvent.layerX, y:e.sourceEvent.layerY });
                        updateChannel({ id, isOpen:!isOpen })
                        //remove all x-axes, inc the initial one so it's domain is reset
                        //d3.selectAll("g.x-axis").remove();
                        //initAxisRenderDone = false;
                        //update local channel state
                        //channelState = channelState.map(ch => ({
                           // ...ch,
                            //isOpen:ch.nr === nr ? !isOpen : ch.isOpen
                        //}))
                        //update();
                    }
                })

            const zoom = d3.zoom()
                //.scaleExtent([1, 3])
                .extent(extent)
                .scaleExtent([0.125, 8])
                .on("start", enhancedZoom())
                .on("zoom", enhancedZoom(function(e){
                    if(!wasMoved) { wasMoved = true ;}
                    // calculate new zoom transform
                    currentZoom = e.transform
                    // rescale 
                    const zoomedScale = currentZoom.rescaleX(timeScale);
                    axesG.call(axes.scale(zoomedScale))
                    //console.log("zoomedScale", zoomedScale.domain())
                    //update axis data and component
                    //axes.currentZoom(currentZoom);
                    //update planets data and component
                    planets.timeScale(zoomedScale)
                    canvasG.selectAll("g.planets").call(planets, { transitionUpdate: false })
                    //update links component
                    canvasG.selectAll("g.links").call(links, { transitionUpdate: false })
                }))
                .on("end", enhancedZoom())
                
            //e is not from d3.drag here so use layerX and layerY
            function handleClick(e){
                addPlanet(timeScale.invert(trueX(e.sourceEvent.layerX)), yScale.invert(e.sourceEvent.layerY))
            }

            svg.call(zoom)
            //.on("wheel.zoom", null)

            myPlanetsLayout
                .yScale(yScale)
                .channelsData(channelsData);
            const planetsData = myPlanetsLayout(state.planets);

            myLinksLayout
                .channelsData(channelsData)
                .planetsData(planetsData);
            const linksData = myLinksLayout(state.links);

            //for now use this let but shuld use enter/update here
            //update links component
            links
                .yScale(yScale)
                .timeScale(timeScale)
            //call links component
            canvasG.selectAll("g.links")
                .data([linksData])
                .join("g")
                .attr("class", "links")
                .join(
                    enter => enter.append("g")
                        .attr("class", "links")
                        //first time links component renders, we want entered links to transition
                        .call(links, { transitionEnter:true }),
                    update => update
                        .call(links) //we dont want any newly entered links to transition
                );

            canvasG.selectAll("g.planets")
                .data([planetsData])
                .join("g")
                .attr("class", "planets")
                .call(planets
                    .channelsData(channelsData)
                    .linksData(linksData)
                    .yScale(yScale)
                    .timeScale(timeScale)
                    .addLink(addLink)
                    .updatePlanet(updatePlanet))

        })

        function init(){
            svg = d3.select(this)
                .attr("width", width)
                .attr("height", height)
                .style("border", "solid")

            contentsG = svg
                .append("g")
                    .attr("class", "contents")
                    .attr("transform", "translate(" +margin.left +"," +margin.top +")")

            canvasG = contentsG
                .append("g")
                    .attr("class", "canvas")

            canvasRect = canvasG
                .append("rect")
                    .attr("width", canvasWidth)
                    .attr("height", canvasHeight)
                    .attr("fill", "#FAEBD7");

            axesG = contentsG
                .append("g")
                .attr("class", "axes")
                .attr("transform", "translate(0," +contentsHeight +")")
        }


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
    journey.addPlanet = function (value) {
        if (!arguments.length) { return addPlanet; }
        if(typeof value === "function"){
            addPlanet = value;
        }
        return journey;
    };
    journey.updatePlanet = function (value) {
        if (!arguments.length) { return updatePlanet; }
        if(typeof value === "function"){
            updatePlanet = value;
        }
        return journey;
    };
    journey.addLink = function (value) {
        if (!arguments.length) { return addLink; }
        if(typeof value === "function"){
            addLink = value;
        }
        return journey;
    };
    journey.updateChannel = function (value) {
        if (!arguments.length) { return updateChannel; }
        if(typeof value === "function"){
            updateChannel = value;
        }
        return journey;
    };
    return journey;
}
