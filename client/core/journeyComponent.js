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
import { grey10, DEFAULT_D3_TICK_SIZE, COLOURS } from "./constants";
import { findNearestPlanet, distanceBetweenPoints, channelContainsPoint, channelContainsDate } from './geometryHelpers';
import dragEnhancements from './enhancedDragHandler';
import { timeMonth, timeWeek } from "d3-time"
import { update } from 'lodash';

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

    let withCompletionPaths = false;

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

        planetWrapperWidth = 85;
        //note - planetWrapperHeight depends on whether or not planet is active
        
        planetWidth = planetWrapperWidth;
        planetContentsWidth = planetWidth - planetMargin.left - planetMargin.right;
        planetHeight = 60;//calcPlanetHeight(height);
        planetContentsHeight = planetHeight - planetMargin.top - planetMargin.bottom;

        chartWidth = planetWrapperWidth;
        //we want enough space on screen for two planets and 1 chart
        chartHeight = calcChartHeight(height, planetHeight);
    };

    //api
    let selected;
    let editing;
    let preEditZoom;

    let addPlanet = function(){};
    let updatePlanet = function(){};
    let deletePlanet = function (){};
    let addLink = function(){};
    let deleteLink = function(){};
    let updateChannel = function(){};
    let setForm = function(){};
    let setZoom = function(){};

    //dom
    let svg;
    let contentsG;
    let axesG;
    let canvasG;
    let canvasRect;

    let state;

    let timeScale;
    let yScale;

    let currentZoom = d3.zoomIdentity;
    let channelsData;

    function journey(selection) {
        updateDimns();
        selection.each(function (journeyState) {
            state = journeyState;
            if(!svg){
                //enter
                init.call(this);
                update()
            }else{
                //update
                update({ planets:{ transitionUpdate: true  }, links:{ transitionUpdate: true  } })
            }
        })

        function update(options={}){
            const { k } = currentZoom;
            //console.log("update currentZoom", currentZoom)
            yScale = d3.scaleLinear().domain([0, 100]).range([margin.top, margin.top + contentsHeight])

            //start by showing 5 channels, from channel -1 to channel 3
            const startDisplayedChannelNr = -1;
            const endDisplayedChannelNr = 3;
            const nrDisplayedMonths = endDisplayedChannelNr - startDisplayedChannelNr + 1; //add 1 for channel 0
            const widthPerMonth = contentsWidth / nrDisplayedMonths;

            const domain = [
                addWeeks(-52, state.channels.find(ch => ch.nr === startDisplayedChannelNr).startDate),
                state.channels.find(ch => ch.nr === endDisplayedChannelNr).endDate
            ]
            const range = [
                -widthPerMonth * 12,
                contentsWidth
            ]
            timeScale = d3.scaleTime().domain(domain).range(range)

            const zoomedTimeScale = currentZoom.rescaleX(timeScale);
            const zoomedYScale = currentZoom.rescaleY(yScale);

            myChannelsLayout.scale(zoomedTimeScale).currentZoom(currentZoom).contentsWidth(contentsWidth);
            channelsData = myChannelsLayout(state.channels);

            const axesData = myAxesLayout(channelsData.filter(ch => ch.isDisplayed));
            axes
                .scale(zoomedTimeScale)
                .tickSize(contentsHeight + DEFAULT_D3_TICK_SIZE)

            axesG.datum(axesData).call(axes);

            // Zoom configuration
            const extent = [[0,0],[chartWidth, chartHeight]];
            enhancedZoom
                //.dragThreshold(200) //dont get why this has to be so large
                //.beforeAll(() => { updateSelected(undefined); })
                .onClick((e,d) => {
                    if(editing){
                        onEndEditPlanet();
                    }
                    //note - on start editing, selected is already set to undefined
                    else if(selected){
                        updateSelected(undefined); 
                    }else{
                        addPlanet(zoomedTimeScale.invert(trueX(e.sourceEvent.layerX)), zoomedYScale.invert(e.sourceEvent.layerY))
                    }
                })
                .onLongpressStart(function(e,d){
                    if(!enhancedZoom.wasMoved()){
                        //longpress toggles isOpen
                        const chan = pointChannel({ x:e.sourceEvent.layerX, y:e.sourceEvent.layerY });
                        //console.log("chan", chan)
                        if(!chan){ return; }
                        const { id, isOpen } = chan;
                        //console.log("channel....", chan)
                        //there must be a diff between this code and the udate code above, or the way axis is updwted, because in zoomed state
                        //sometimes the opening of c channel is only corrected on state update
                        updateChannel({ id, isOpen:!isOpen })
                    }
                })

            const zoom = d3.zoom()
                //.scaleExtent([1, 3])
                .extent(extent)
                .scaleExtent([0.125, 8])
                .on("zoom", enhancedZoom(function(e){
                    selected = undefined;
                    currentZoom = e.transform;
                    setZoom(currentZoom);
                    update();
                }))
                .on("end", enhancedZoom())

            svg.call(zoom)
            //.on("wheel.zoom", null)

            //ELEMENTS
            //helpers
            const { trueX, pointChannel } = channelsData;
           
            //layouts
            myPlanetsLayout
                .selected(selected?.id)
                .currentZoom(currentZoom)
                .timeScale(zoomedTimeScale)
                .yScale(zoomedYScale)
                .channelsData(channelsData);
            const planetsData = myPlanetsLayout(state.planets);

            myLinksLayout
                .selected(selected?.id)
                .currentZoom(currentZoom)
                .channelsData(channelsData)
                .planetsData(planetsData);
            const linksData = myLinksLayout(state.links);

            //links
            links
                .withCompletion(withCompletionPaths)
                .yScale(zoomedYScale)
                //.timeScale(timeScale)
                .timeScale(zoomedTimeScale)
                .strokeWidth(k * 0.5)
                .barChartSettings({
                    width:70 * k,
                    height:30 * k
                })
                .deleteLink(id => {
                    selected = undefined;
                    deleteLink(id);
                })
                .onClick((e,d) => { updateSelected(d);})

            canvasG.selectAll("g.links")
                .data([linksData])
                .join("g")
                .attr("class", "links")
                .call(links, options.links)

            //planets

            //helpers
            const applyZoomX = x => (x + currentZoom.x) / currentZoom.k;
            const applyZoomY = y => (y + currentZoom.y) / currentZoom.k;

            planets
                .width(planetWidth)
                .height(planetHeight)
                .channelsData(channelsData)
                .linksData(linksData)
                .timeScale(zoomedTimeScale)
                .yScale(zoomedYScale)
                .fontSize(k * 9)
                .onClick((e,d) => { updateSelected(d);})
                .onDrag(function(e , d){
                    updateSelected(undefined); //warning - may interrupt drag handling with touch
                    //console.log("DRAG.......")
                    //links layout needs updated planet position and targetDate
                    state.planets = state.planets.map(p => { return p.id === d.id ? d : p });
                    const newPlanetsData = myPlanetsLayout(state.planets);
                    myLinksLayout.planetsData(newPlanetsData);
                    const newLinksData = myLinksLayout(state.links);
                    canvasG.selectAll("g.links")
                        .data([newLinksData])
                        .join("g")
                        .attr("class", "links")
                        .call(links) //no transitions

                })
                .onDragEnd(function(e , d){
                    selected = undefined;
                    //targetDate must be based on trueX
                    //updatePlanet({ id:d.id, targetDate:timeScale.invert(trueX(d.x)), yPC:yScale.invert(d.y) });
                    updatePlanet({ id:d.id, targetDate:zoomedTimeScale.invert(trueX(d.x)), yPC:zoomedYScale.invert(d.y) });
                })
                .addLink(addLink)
                .updatePlanet(updatePlanet)
                .deletePlanet(id => {
                    selected = undefined;
                    deletePlanet(id);
                })
                .startEditPlanet(onStartEditPlanet)

            function onStartEditPlanet(d){
                editing = d;
                updateSelected(undefined);
                d3.timeout(() => {
                    preEditZoom = currentZoom;
                    svg.call(
                        zoom.transform, 
                        d3.zoomIdentity.translate(
                            applyZoomX(-d.x + d.rx(contentsWidth)/2), 
                            applyZoomY(-d.y + d.ry(contentsHeight)/2)
                        ))
                    setForm(d)
                }, 100)
            }

            function onEndEditPlanet(){
                editing = undefined;
                d3.timeout(() => {
                    svg.call(
                        zoom.transform, 
                        d3.zoomIdentity
                            .translate(preEditZoom.x, preEditZoom.y)
                            .scale(preEditZoom.k))
                    setForm(undefined)
                }, 100)

            }

            canvasG.selectAll("g.planets")
                .data([planetsData])
                .join("g")
                .attr("class", "planets")
                .call(planets, options.planets)

        }

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
                    .attr("fill", COLOURS?.canvas || "#FAEBD7");

            axesG = contentsG
                .append("g")
                .attr("class", "axes")
                .attr("transform", "translate(0," +contentsHeight +")")
        }

        function updateSelected(d){
            selected = d;
            update();
        }

        return selection;
    }

    //api
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
    journey.selected = function (value) {
        if (!arguments.length) { return selected; }
        selected = value;
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
    journey.withCompletionPaths = function (value) {
        if (!arguments.length) { return withCompletionPaths; }
        withCompletionPaths = value;
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
    journey.deletePlanet = function (value) {
        if (!arguments.length) { return deletePlanet; }
        if(typeof value === "function"){
            deletePlanet = value;
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
    journey.deleteLink = function (value) {
        if (!arguments.length) { return deleteLink; }
        if(typeof value === "function"){
            deleteLink = value;
        }
        return journey;
    };
    journey.setForm = function (value) {
        if (!arguments.length) { return setForm; }
        if(typeof value === "function"){
            setForm = value;
        }
        return journey;
    };
    journey.setZoom = function (value) {
        if (!arguments.length) { return setZoom; }
        if(typeof value === "function"){
            setZoom = value;
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
