import * as d3 from 'd3';
//import "d3-selection-multi";
import channelsLayout from "./channelsLayout";
import axesLayout from "./axesLayout";
import linksLayout from "./linksLayout";
import planetsLayout from "./planetsLayout";
import axesComponent from "./axesComponent";
import linksComponent from "./linksComponent";
import planetsComponent from "./planetsComponent";
import measuresBarComponent from './measuresBarComponent';
import { calcChartHeight, findFuturePlanets, findFirstFuturePlanet, findNearestDate, getTransformationFromTrans,
    calcTrueX, calcAdjX, findPointChannel, findDateChannel, findNearestChannelByEndDate } from './helpers';
//import { COLOURS, DIMNS } from "./constants";
import { addMonths, addWeeks } from "../util/TimeHelpers"
import { ellipse } from "./ellipse";
import { grey10, DEFAULT_D3_TICK_SIZE, COLOURS, DIMNS } from "./constants";
import { findNearestPlanet, distanceBetweenPoints, channelContainsPoint, channelContainsDate } from './geometryHelpers';
import dragEnhancements from './enhancedDragHandler';
import { timeMonth, timeWeek } from "d3-time";
import openedLinkComponent from './openedLinkComponent';


/*

*/
export default function journeyComponent() {
    // dimensions
    let margin = {left:0, right:0, top: 0, bottom:0};
    let planetMargin = {left:5, right:5, top: 5, bottom:5};
    let width = 4000;
    let height = 2600;
    let contentsWidth;
    let contentsHeight;

    let xAxisHeight = 30;

    //canvas will be a lot bigger than the contentsWidth and contentsHeight
    // of svg container, and can be panned/zoomed
    let canvasWidth;
    let canvasHeight;

    let planetWidth = DIMNS.planet.width;
    let planetHeight = DIMNS.planet.height;
    let planetContentsWidth;
    let planetContentsHeight;

    let chartWidth;
    let chartHeight;
    const planetWrapperHeight = isOpen => isOpen ? planetHeight + chartHeight : planetHeight;
    
    const TIME_AXIS_WIDTH = 50;

    let measuresOpen;
    let measuresBarHeight;
    let modalData;

    function updateDimns(){
        contentsWidth = width - margin.left - margin.right;
        contentsHeight = height - margin.top - margin.bottom;
        canvasWidth = contentsWidth;// * 5;
        measuresBarHeight = measuresOpen ? 70 : 0
        //note- for some reason, reducing canvasHeight doesnt seem to move axis properly, so instead just subtract measuresBarHeight for axis translateY
        canvasHeight = contentsHeight;// - measuresBarHeight; //this should be lrge enough for all planets, and rest can be accesed via pan


        
        planetContentsWidth = planetWidth - planetMargin.left - planetMargin.right;
        planetContentsHeight = planetHeight - planetMargin.top - planetMargin.bottom;

        chartWidth = planetWidth;
        //we want enough space on screen for two planets and 1 chart
        chartHeight = calcChartHeight(height, planetHeight);
    };

    let withCompletionPaths = false;

    let enhancedZoom = dragEnhancements();

    const myChannelsLayout = channelsLayout();
    const myAxesLayout = axesLayout();
    const myLinksLayout = linksLayout();
    const myPlanetsLayout = planetsLayout();

    const axes = axesComponent();
    const links = linksComponent();
    const planets = planetsComponent();
    const openedLinks = {};
    const measuresBar = measuresBarComponent();

    //api
    let selected;
    let editing;
    let preEditZoom;

    let addPlanet = function(){};
    //@todo - change name to updatePlanetState and so on to distinguish from dom changes eg updateplanets could be either
    let updatePlanet = function(){};
    let addMeasureToPlanet = function(){};
    let deletePlanet = function (){};
    let addLink = function(){};
    let deleteLink = function(){};
    let updateChannel = function(){};
    let setModalData = function(){};
    let setImportingMeasures= function(){};
    let setZoom = function(){};
    let onStartEditPlanet = function (){};
    let onEndEditPlanet = function (){};
    let convertPlanetToAim = function (){};

    //dom
    let svg;
    let contentsG;
    let axesG;
    let canvasG;
    let canvasRect;

    let state;

    let timeScale;
    let yScale;

    let zoom;
    let applyZoomX;
    let applyZoomY;
    let currentZoom = d3.zoomIdentity;
    let channelsData;

    //state
    let hoveredPlanetId;

    function journey(selection) {
        updateDimns();
        selection.each(function (journeyState) {
            state = journeyState;
            //console.log("state", state)
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
            //console.log("measuresbarh", measuresBarHeight)
            //Journey.log("canvash", canvasHeight)
            svg
                .attr("width", width)
                .attr("height", height)

            const { k } = currentZoom;
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
                .tickSize(canvasHeight + DEFAULT_D3_TICK_SIZE)

            //note- for some reason, reducing canvasHeight doesnt seem to move teh xis properly, so instead just subtract measuresBarHeight
            axesG
                .attr("transform", "translate(0," +(contentsHeight-xAxisHeight - measuresBarHeight) +")")
                .datum(axesData)
                .call(axes);

            // Zoom configuration
            const extent = [[0,0],[chartWidth, chartHeight]];
            enhancedZoom
                //.dragThreshold(200) //dont get why this has to be so large
                //.beforeAll(() => { updateSelected(undefined); })
                .onClick((e,d) => {
                    if(editing){
                        onEndEditPlanet(d);
                    }
                    //note - on start editing, selected is already set to undefined
                    else if(selected){
                        updateSelected(undefined);
                    //if measuresBar open, we dont want the click to propagate through
                    }else{
                        addPlanet(zoomedTimeScale.invert(trueX(e.sourceEvent.layerX)), zoomedYScale.invert(e.sourceEvent.layerY))
                    }
                })
                .onLongpressStart(function(e,d){
                    if(!enhancedZoom.wasMoved()){
                        //longpress toggles isOpen
                        const chan = pointChannel({ x:e.sourceEvent.layerX, y:e.sourceEvent.layerY });
                        if(!chan){ return; }
                        const { id, isOpen } = chan;
                        //there must be a diff between this code and the udate code above, or the way axis is updwted, because in zoomed state
                        //sometimes the opening of c channel is only corrected on state update
                        updateChannel({ id, isOpen:!isOpen })
                    }
                })

            zoom = d3.zoom()
                //.scaleExtent([1, 3])
                .extent(extent)
                .scaleExtent([0.125, 8])
                .on("start", enhancedZoom())
                .on("zoom", enhancedZoom(function(e){
                    if(e.sourceEvent){
                        //user has manually zoomed so close selected/editing
                        //selected = undefined;
                        if(editing){
                            onEndEditPlanet(undefined);
                        }
                        if(selected){
                            updateSelected(undefined);
                        }
                        //editing = undefined;
                        //setModalData(undefined);
                    }
                    currentZoom = e.transform;
                    setZoom(currentZoom);
                    update();
                }))
                .on("end", enhancedZoom())

            //svg.call(zoom)
            contentsG.call(zoom)
            //.on("wheel.zoom", null)

            //ELEMENTS
            //helpers
            const { trueX, pointChannel } = channelsData;

            let planetsData;
            let linksData;
            updatePlanetsData();
            updateLinksData();

            updatePlanets();
            updateLinks();

            function updatePlanetsData(){
                myPlanetsLayout
                    .selected(selected?.id)
                    .currentZoom(currentZoom)
                    .timeScale(zoomedTimeScale)
                    .yScale(zoomedYScale)
                    .channelsData(channelsData);

                planetsData = myPlanetsLayout(state.planets);

            }

            function updateLinksData(){
                //data
                myLinksLayout
                    .selected(selected?.id)
                    .currentZoom(currentZoom)
                    .channelsData(channelsData)
                    .planetsData(planetsData);

                linksData = myLinksLayout(state.links);

            }
           
            function updatePlanets(){
                //component
                planets
                    .width(planetWidth)
                    .height(planetHeight)
                    .selectedMeasure(measuresOpen?.find(m => m.id === measuresBar.selected()))
                    .channelsData(channelsData)
                    .linksData(linksData)
                    .timeScale(zoomedTimeScale)
                    .yScale(zoomedYScale)
                    .fontSize(k * 9)
                    .onClick((e,d) => { updateSelected(d);})
                    .onDrag(function(e , d){
                        updateSelected(undefined); //warning - may interrupt drag handling with touch
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
                    .onMouseover(function(e,d){
                        const selectedMeasureIsInPlanet = !!d.measures.find(m => m.id === measuresBar.selected());
                        if(measuresBar.selected() && (selectedMeasureIsInPlanet || measuresBar.dragged())){
                            hoveredPlanetId = d.id;
                            planets.highlight(hoveredPlanetId, measuresBar.dragged());
                        }
                    })
                    .onMouseout(function(e,d){
                        if(hoveredPlanetId){
                            hoveredPlanetId = undefined;
                            planets.unhighlight(d.id);
                        }
                    })
                    .addLink(addLink)
                    .updatePlanet(updatePlanet)
                    .deletePlanet(id => {
                        selected = undefined;
                        editing = undefined;
                        deletePlanet(id);
                    })
                    .startEditPlanet(onStartEditPlanet)
                    .convertToAim(convertPlanetToAim)

                //render
                const planetsG = canvasG.selectAll("g.planets").data([planetsData]);
                planetsG.enter()
                    .append("g")
                    .attr("class", "planets")
                    .merge(planetsG)
                    .call(planets, options.planets)
            }

            function updateLinks(){
                //component
                links
                    .withCompletion(withCompletionPaths)
                    .selectedMeasure(measuresOpen?.find(m => m.id === measuresBar.selected()))
                    .yScale(zoomedYScale)
                    //.timeScale(timeScale)
                    .timeScale(zoomedTimeScale)
                    .strokeWidth(k * 0.5)
                    .deleteLink(id => {
                        selected = undefined;
                        deleteLink(id);
                    })
                    .onClick((e,d) => { updateSelected(d);})

                //render
                const linksG = canvasG.selectAll("g.links").data([linksData])
                linksG.enter()
                    .insert("g", "g.planets")
                        .attr("class", "links")
                        .merge(linksG)
                        .call(links, options.links)
            }
            
            //openedLink
            const openedLinkWidth = 80 * k;
            const openedLinkHeight = 30 * k;
            const openedLinkG = canvasG.selectAll("g.opened-link").data(linksData.filter(l => l.isOpen), l => l.id)
            openedLinkG.enter()
                .append("g")
                .attr("class", "opened-link")
                .attr("opacity", 0)
                .each(function(d) { 
                    openedLinks[d.id] = openedLinkComponent();
                    d3.select(this)
                        .transition()
                            .delay(200)
                            .duration(200)
                            .attr("opacity", 1)
                 })
                .merge(openedLinkG)
                .attr("transform", d => "translate("+ (d.centre[0])+ "," + (d.centre[1]- openedLinkHeight/2) +")")
                .each(function(d) {
                    d3.select(this)
                        .call(openedLinks[d.id]
                            .width(openedLinkWidth)
                            .height(openedLinkHeight)
                            .barChartSettings({
                                labels : { fontSize:5 * k, width:30 * k },
                                axis: { show:false }
                                //{ show: true, ticks: { fontSize: 8 * (k ** 2) } }
                            })
                            .onMouseover(function(linkId, goalId){
                                //@todo - make this same goal highlighted in othe rlinks that it is in too
                                for (const [id, openedLink] of Object.entries(openedLinks)) {
                                //Object.entries(openedLinks).forEach((id, openedLink) => {
                                    if(id !== linkId && openedLink.activeGoalId()){
                                        openedLink.activeGoalId(undefined);
                                    }
                                }
                            }))
                })

            openedLinkG.exit()
                .transition()
                    .duration(200)
                    .attr("opacity", 0)
                    .on("end", function(){ d3.select(this).remove() });

            //todo - enter measuresG here with measures component.
            //transition it in and out with data([measuresOpen]) or soemthing like that so its empty
            //and removes if no measuresOpen. Note, could be all measuires open or just one goals' measures

            const measuresData = {
                title:"Measures",
                subtitle:"All", //this will show the goal or path etc if restricted
                measures:measuresOpen
            }
            const measuresBarG = contentsG.selectAll("g.measures-bar").data(measuresOpen ? [measuresData] : [])
            measuresBarG.enter()
                .append("g")
                    .attr("class", "measures-bar")
                    .merge(measuresBarG)
                    //.attr("transform", "translate(0," + contentsHeight +")")
                    //note - in journey component, margin bottom is used for the axis. 
                    .attr("transform", "translate(0," +(contentsHeight - measuresBarHeight) +")")
                    .call(measuresBar
                        .width(contentsWidth)
                        .height(measuresBarHeight)
                        .openNewMeasureForm(() => { 
                            setModalData({ measureOnly: true });
                        })
                        .openImportMeasuresComponent(() => {
                            //note - eventually will have option to pass in filter settings eg tags like fitness, or groupId
                            setModalData({ importing: true, filters:[] })
                        })
                        .onUpdateSelected(selectedMeasure => {
                            updatePlanets();
                        })
                        .onMeasureDragStart(() => {
                            planets.withRing(false);
                        })
                        .onMeasureDragEnd(m => {
                            //todo - lookinti what m is  -and follow teh updateProcess to see why measures stays as []
                            planets.withRing(true);
                            if(hoveredPlanetId){
                                //add measure to goal
                                // keep measure selected so targets show on goal for each planet that has it
                                // the goal that has just been added to has target form open over it
                                const hoveredPlanet = planetsData.find(p => p.id === hoveredPlanetId);
                                if(hoveredPlanet.measures.find(me => me.id === m.id)){
                                    alert("This measure is already added to this planet")
                                }else{
                                    addMeasureToPlanet(hoveredPlanetId, m.id);
                                    //@todo - tidy up how we save selected, but for nowwe dd the measure manuaklly to that here too
                                    const measures = [...hoveredPlanet.measures, { id: m.id }];
                                    updateSelected({ ...hoveredPlanet, measures })
                                }
                            }
                        }))
            
            measuresBarG.exit().remove();

        
        }

        function init(){
            svg = d3.select(this).style("border", "solid")

            contentsG = svg
                .append("g")
                    .attr("class", "contents")
                    .attr("transform", "translate(" +margin.left +"," +margin.top +")")

            canvasG = contentsG.append("g").attr("class", "canvas")

            canvasRect = canvasG 
                .append("rect")
                    .attr("width", canvasWidth)
                    .attr("height", canvasHeight * 5)
                    .attr("fill", COLOURS?.canvas || "#FAEBD7");

            axesG = contentsG.append("g").attr("class", "axes")
        }

        function updateSelected(d){
            selected = d;
            if(d?.dataType === "planet"){
                //open name form too, but as selected rather than editing
                const measureIsOnPlanet = d.measures.find(d => d.id === measuresBar.selected());
                const measure = measureIsOnPlanet && measuresOpen?.find(m => m.id === measuresBar.selected());
                const modalData = measure ? { planetD:d, measure, targOnly: true } : { planetD: d, nameOnly:true };
                setModalData(modalData)
            }else{
                setModalData(undefined);
            }
            update();
        }

        //helpers
        applyZoomX = x => (x + currentZoom.x) / currentZoom.k;
        applyZoomY = y => (y + currentZoom.y) / currentZoom.k;
        onStartEditPlanet = (d) => {
            //hide nameform immediately
            setModalData(undefined)
            editing = d;
            updateSelected(undefined);
            preEditZoom = currentZoom;

            svg.selectAll("g.planet")
                .filter(p => p.id !== d.id)
                .transition()
                    .duration(200)
                    .attr("opacity", 0)

            svg.selectAll("g.link")
                .transition()
                    .duration(200)
                    .attr("opacity", 0)
            
            svg.selectAll("g.opened-link")
                .transition()
                    .duration(200)
                    .attr("opacity", 0)

            svg.transition().duration(750).call(
                zoom.transform, 
                d3.zoomIdentity.translate(
                    applyZoomX(-d.x + d.rx(contentsWidth)/3), 
                    applyZoomY(-d.y + d.ry(contentsHeight)/3)
                ))
                .on("end", () => {
                    //error - this now uses currentZoom instead of the new position
                    setModalData({ planetD:d })
                })
        }

        onEndEditPlanet = (d) => {
            setModalData(undefined)
            editing = undefined;
            //zoom is only applied for full edit, not if its nameOnly
            if(preEditZoom){
                svg.transition().duration(750).call(
                    zoom.transform, 
                    d3.zoomIdentity
                        .translate(preEditZoom.x, preEditZoom.y)
                        .scale(preEditZoom.k))
                        .on("end", function(){
                            if(d){
                                svg.selectAll("g.planet")
                                    .filter(p => p.id !== d.id)
                                    .transition()
                                        .duration(300)
                                        .attr("opacity", 1)
                                
                                svg.selectAll("g.link")
                                    .transition()
                                        .duration(200)
                                        .attr("opacity", 1)
                                    
                                svg.selectAll("g.opened-link")
                                    .transition()
                                        .duration(200)
                                        .attr("opacity", 1)
                            }
                        })
            }
            updateSelected(undefined);
            //reset
            preEditZoom = undefined;
        }

        convertPlanetToAim = function(d){
            console.log("conv to aim", this)
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
    journey.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        return journey;
    };
    journey.selected = function (value) {
        if (!arguments.length) { return selected; }
        selected = value;
        return journey;
    };
    journey.measuresOpen = function (value) {
        if (!arguments.length) { return measuresOpen; }
        measuresOpen = value;
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
    journey.addMeasureToPlanet = function (value) {
        if (!arguments.length) { return addMeasureToPlanet; }
        if(typeof value === "function"){
            addMeasureToPlanet = value;
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
    journey.setModalData = function (value) {
        if (!arguments.length) { return setModalData; }
        if(typeof value === "function"){
            setModalData = value;
        }
        return journey;
    };
    journey.setImportingMeasures = function (value) {
        if (!arguments.length) { return setImportingMeasures; }
        if(typeof value === "function"){
            setImportingMeasures = value;
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
    journey.endEditPlanet = function(){ onEndEditPlanet() }
    return journey;
}
