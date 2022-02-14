import * as d3 from 'd3';
//import "d3-selection-multi";
import barChartGenerator from "./barChartGenerator";
import { calcChartHeight, findFuturePlanets, findFirstFuturePlanet, findNearestDate, getTransformation } from './helpers';
//import { COLOURS, DIMNS } from "./constants";
import { addWeeks } from "../util/TimeHelpers"
import { ellipse } from "./ellipse";
import { grey10 } from "./constants";
import { findNearestPlanet, distanceBetweenPoints, channelContainsPoint, channelContainsDate } from './geometryHelpers';
import { OPEN_CHANNEL_EXT_WIDTH } from './constants';
import dragEnhancements from './enhancedDragHandler';

/*

*/
export default function journeyGenerator() {
    // dimensions
    let margin = {left:0, right:0, top: 0, bottom:0};
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

    let enhancedDrag = dragEnhancements();

    //let planets = planetsGenerator();

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

    //non-persisted non-React state
    let channelState;

    //functions
    let barCharts = {};

    //dom
    let svg;
    let contentsG;
    let canvasG;
    let canvasRect;

    let initAxisRenderDone = false;
    
    const ring = ellipse().className("ring");

    function journey(selection) {
        updateDimns();
        // expression elements
        selection.each(function (data) {
            const { planetData, linkData } = data
            //console.log("journey", data);
            //init
            if(!svg){
                //const nrFuturePlanets = data.filter(p => p.targetDate > new Date()).length;
                //const initDY = -(nrFuturePlanets - 1) * PLANET_WRAPPER_HEIGHT;
                function zoomed(e){
                    //only works until a wheel event happens
                    //if(e.transform.k === 1){
                        canvasG.attr("transform", e.transform)
            
                    //}
                }
                
                const zoom = d3.zoom()
                    .translateExtent([[0, 0], [canvasWidth, canvasHeight]])
                    .scaleExtent([0.125, 8])
                    .filter((e,d) => {
                        return true//false;
                    })
                    .on("zoom", zoomed)

                svg = d3.select(this)
                    .attr("width", width)
                    .attr("height", height)
                    .style("border", "solid")

                contentsG = svg
                    .append("g")
                        .attr("class", "contents")
                        .attr("transform", "translate(" +margin.left +"," +margin.top +")")
                        .call(zoom)
                        .on("wheel.zoom", null)

                canvasG = contentsG
                    .append("g")
                    .attr("class", "canvas")
                
                const initDX = 0//-canvasWidth/2 +width/2;
                const initDY = -d3.sum(findFuturePlanets(planetData)
                    .filter(p => p.id !== findFirstFuturePlanet(planetData)?.id)
                    .map(p => p.isOpen ? planetHeight + chartHeight : planetHeight))

                const initT = d3.zoomIdentity.translate(initDX, initDY);
                // @todo - need to understand why we need to apply this to contentsG,
                // and why if its canvasG then it jumps back to top when user first scrolls
                contentsG.call(zoom.transform, initT)

                canvasRect = canvasG
                    .append("rect")
                        .attr("width", canvasWidth)
                        .attr("height", canvasHeight)
                        .attr("fill", "#FAEBD7");
                
            }

            //init upate call
            update();
            //update
            function update(){
                //scale
                const now = new Date();
                const xExtent = [d3.min(planetData, d => d.targetDate), d3.max(planetData, d => d.targetDate)]
                const timeScale = d3.scaleTime()
                    .domain([addWeeks(-2, now), d3.max([xExtent[1], addWeeks(16, now)])])
                    .range([0, contentsWidth])

                //yscale
                const yScale = d3.scaleLinear().domain([0, 100]).range([margin.top, margin.top + contentsHeight])

                //DISPLAY
                //1. axis
                const xAxis = d3.axisBottom()
                    .scale(timeScale)
                    .ticks(5)
                    //.tickSize(contentsHeight + 6)
                    .tickSize(contentsHeight - 25)
                    //.tickPadding(3);

                const xAxisG = svg.selectAll("g.x-axis").data([1])
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
                        .call(xAxis)
                        .merge(xAxisG)
                        .attr("transform", 'translate(0,' +margin.top +')')
                        .each(function(){
                            d3.select(this).select(".domain")
                                .attr("transform", 'translate(0,' +(contentsHeight - 30) +')')
                        })
                        .style("opacity", initAxisRenderDone ? 0.5 : 0) //note - setting style op overrides the attr op that axis sets on it
                        .transition()
                        .delay(50)
                        .duration(200)
                            .style("opacity", 0.5);;

                //init set channelState
                if(!channelState){
                    const channelDates = d3.select("g.x-axis").selectAll("g.tick").data()
                    //update axis scales
                    channelState = channelDates.slice(1).map((date, i) => ({
                        nr:i,
                        isOpen:false,
                        //starts from the previous tick
                        startDate:channelDates[i],
                        endDate:date
                    }))
                }
                //channelData layout
                const channelData = channelState.map((ch, i, chArray) => {
                    const trueStartX = timeScale(ch.startDate);
                    const trueEndX = timeScale(ch.endDate);
                    //the channels open are wrong on axis. when nr 1 is open, it shows as nr 0 being open
                    const nrPrevOpenChannels = chArray.filter((chan, j) => j < i && chan.isOpen).length;
                    //const rangeShift = nrPrevOpenChannels * OPEN_CHANNEL_EXT_WIDTH + (ch.isOpen ? OPEN_CHANNEL_EXT_WIDTH : 0);
                    const startX = timeScale(ch.startDate) + nrPrevOpenChannels * OPEN_CHANNEL_EXT_WIDTH;
                    const closedEndX = timeScale(ch.endDate) + nrPrevOpenChannels * OPEN_CHANNEL_EXT_WIDTH;
                    const openEndX = closedEndX + OPEN_CHANNEL_EXT_WIDTH;
                    const endX = ch.isOpen ? openEndX : closedEndX;
                    const axisRangeShiftWhenOpen = (nrPrevOpenChannels + 1) * OPEN_CHANNEL_EXT_WIDTH;

                    return {
                        ...ch,
                        trueStartX,
                        trueEndX,
                        nrPrevOpenChannels,
                        startX,
                        endX,
                        closedEndX,
                        openEndX,
                        closedWidth:closedEndX - startX,
                        openWidth:openEndX - startX,
                        width:endX - startX,
                        axisRangeShiftWhenOpen
                    }
                })
                console.log("channelData", channelData)

                const trueX = (adjX) => {
                    const channel = channelData.find(ch => ch.endX >= adjX)
                    const extraX = adjX - channel.startX;
                    return channel.startX + ((extraX/channel.width) * channel.closedWidth) - (channel.nrPrevOpenChannels * OPEN_CHANNEL_EXT_WIDTH);
                }
                const adjX = (trueX) => {
                    const channel = channelData.find(ch => ch.trueEndX >= trueX);
                    //startX already includes any previous shifts for open channels, so we need trueStartX
                    const trueExtraX = trueX - channel.trueStartX;
                    const extraXProp = trueExtraX / channel.closedWidth; //channels are closed for ture values
                    const adjExtraX = extraXProp * channel.width; //cancels out if channel is closed
                    //we return startX + extra not trueStartX, because we want to incude prev open channel widths
                    return channel.startX + adjExtraX;
                }

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
                                //console.log("ch", ch)
                                //console.log("isLast", isLast)
                                //if there is a future open channel, this domain runs to far
                                //it should have openChanelExt width removed, and it shouldnt drop vertically 
                                //d3.select(this).select(".domain")
                                    //.style("stroke-width", 3)
                                    //.style("stroke", "black")
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

                initAxisRenderDone = true;

                
                const pointChannel = (pt) => channelData.find(ch => channelContainsPoint(pt, ch))
                const dateChannel = (date) => channelData.find(ch => channelContainsDate(date, ch))
                const findNearestChannelByEndDate = date => {
                    const nearestDate = findNearestDate(date, channelData.map(d => d.endDate))
                    return channelData.find(ch => ch.endDate === nearestDate)
                }

                //add x and y to each planet
                const planetLayoutData = planetData.map(p => {
                    //console.log("p targ", p.targetDate)
                    //todo - findNearestChannel needs to take account of open channels too
                    const channel = findNearestChannelByEndDate(p.targetDate);
                    //console.log("nearest", channel)
                    return {
                        ...p,
                        channel,
                        x:channel.endX, //planets positioned on channel end line
                        y: yScale(p.yPC)
                    }
                })
                //console.log("planetLData", planetLayoutData)

                const linkLayoutData = linkData.map(l => ({
                    ...l,
                    src:planetLayoutData.find(p => p.id === l.src),
                    targ:planetLayoutData.find(p => p.id === l.targ)
                }));

                //background drag

                enhancedDrag
                    .onClick(function(e,d){
                        addPlanet(timeScale.invert(trueX(e.x)), yScale.invert(e.y))
                    })
                    .onLongpressStart(function(e,d){
                        if(!enhancedDrag.wasMoved()){
                            //longpress toggles isOpen
                            const { nr, isOpen } = pointChannel(e);
                            //remove all x-axes, inc the initial one so it's domain is reset
                            d3.selectAll("g.x-axis").remove();
                            initAxisRenderDone = false;
                            //update local channel state
                            channelState = channelState.map(ch => ({
                                ...ch,
                                isOpen:ch.nr === nr ? !isOpen : ch.isOpen
                            }))
                            update();
                        }
                    })

                const drag = d3.drag()
                    .on("start", enhancedDrag(dragStart))
                    .on("drag", enhancedDrag(dragged))
                    .on("end", enhancedDrag(dragEnd));

                function dragStart(e,d){
                    //console.log("dS")
                }
                function dragged(e,d){
                    //console.log("drgd")
                }
                function dragEnd(e,d){
                    //console.log("dE")
                }
                canvasG.call(drag);

                //2. LINKS
                const linksG = canvasG.selectAll("g.links").data([1])
                linksG.enter()
                    .append("g")
                    .attr("class", "links")
                    .merge(linksG)
                    .each(function(){;
                        const linkG = d3.select(this).selectAll("g.link").data(linkLayoutData, l => l.id);
                        linkG.enter()
                            .append("g")
                            .attr("class", "link")
                            .attr("id", d => "link-"+d.id)
                            .each(function(d,i){
                                d3.select(this)
                                    .append("line")
                                    .attr("stroke", grey10(5))
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

                            })
                    })

                //3. PLANETS
                const planetDrag = d3.drag()
                    .on("start", onPlanetDragStart)
                    .on("drag", onPlanetDrag)
                    .on("end", onPlanetDragEnd);

                const rx = planetContentsWidth * 0.8 / 2;
                const ry = planetContentsHeight * 0.8 / 2;

                const planetsG = canvasG.selectAll("g.planets").data([1])
                planetsG.enter()
                    .append("g")
                    .attr("class", "planets")
                    .merge(planetsG)
                    .each(function(){;
                        const planetG = d3.select(this).selectAll("g.planet").data(planetLayoutData, p => p.id);
                        planetG.enter()
                            .append("g")
                            .attr("class", "planet")
                            .attr("id", d => "planet-"+d.id)
                            .call(ring)
                            .each(function(d,i){
                                const planetContentsG = d3.select(this)
                                    .append("g")
                                    .attr("class", "contents")

                                //ellipse
                                planetContentsG
                                    .append("ellipse")
                                        .attr("rx", rx)
                                        .attr("ry", ry)
                                        .attr("fill", grey10(5))
                                
                                //text
                                planetContentsG
                                    .append("text")
                                    .attr("class", "title")
                                    .attr("text-anchor", "middle")
                                    .attr("dominant-baseline", "middle")
                                    .attr("font-size", 9)
                                    .style("pointer-events", "none")
                            
                            })
                            .merge(planetG)
                            .each(function(d,i){
                                const planetG = d3.select(this);
                                //transition x from actual to display pos. if it has changed
                                const { translateX } = getTransformation(planetG.attr("transform"))
                                //if planet entered, it woont have a current pos so must calculate it
                                const startXPos = translateX || adjX(timeScale(d.targetDate));
                                planetG
                                    .attr("transform", d => "translate("+startXPos +"," +(d.y) +")")
                                    .transition()
                                        .delay(50)
                                        .duration(200)
                                        .attr("transform", "translate("+d.x +"," +(d.y) +")");
                                const planetContentsG = planetG.select("g.contents")
                                //planet text
                                planetContentsG.select("text").text(d.title || "enter name...")

                            })
                            .call(planetDrag)
                            //@todo - use mask to make it a donut and put on top
                            .call(ring
                                    .rx(rx * 1.3)
                                    .ry(ry * 1.3)
                                    .fill("transparent")
                                    .stroke("none")
                                    .onDragStart(onRingDragStart)
                                    .onDrag(onRingDrag)
                                    .onDragEnd(onRingDragEnd)
                                    .container("g.contents"));
                    })
            

                let planetWasMoved = true; //for now, always true
                function onPlanetDragStart(e,d){
                    //console.log("p dS d", d)
                }
                function onPlanetDrag(e,d){
                    if(!planetWasMoved) { return; }

                    d.x += e.dx;
                    d.y += e.dy;

                    //UPDATE DOM
                    //planet
                    d3.select(this).attr("transform", "translate("+(d.x) +"," +(d.y) +")")

                    //src links
                    d3.selectAll("g.link")
                        .filter(l => l.src.id === d.id)
                        .each(function(l){
                            l.src.x = d.x;
                            l.src.y = d.y;
                            d3.select(this).select("line")
                                .attr("x1", l.src.x)
                                .attr("y1", l.src.y)
                        })

                    //targ links
                    d3.selectAll("g.link")
                        .filter(l => l.targ.id === d.id)
                        .each(function(l){
                            l.targ.x = d.x;
                            l.targ.y = d.y;
                            d3.select(this).select("line")
                                .attr("x2", l.targ.x)
                                .attr("y2", l.targ.y)
                        })
                }

                function onPlanetDragEnd(e, d){
                    /*
                    if(!wasMoved){
                        onPlanetClick.call(planetG.node(), e, d)
                        return;
                    }
                    */
                    //update state
                    //targetDate must be based on trueX
                    updatePlanet({ id:d.id, targetDate:timeScale.invert(trueX(d.x)), yPC:yScale.invert(d.y) });
                }

                //ring
                let linkPlanets = [];
                function onRingDragStart(e,d){
                    linkPlanets = [d];
                    const planetG = d3.select("g#planet-"+d.id);
                    planetG.select("g.contents").select("ellipse")
                        .attr("stroke", grey10(3))
                        .attr("stroke-width", 5)
                    
                    planetG.select("g.contents")
                        .insert("line", ":first-child")
                            .attr("class", "temp-link")
                            .attr("x1", e.sourceEvent.offsetX - d.x)
                            .attr("y1", e.sourceEvent.offsetY - d.y)
                            .attr("x2", e.sourceEvent.offsetX - d.x)
                            .attr("y2", e.sourceEvent.offsetY - d.y)
                            .attr("stroke-width", 1)
                            .attr("stroke", grey10(3))
                            .attr("fill", grey10(3));

                }

                function onRingDrag(e,d){
                    const planetG = d3.select("g#planet-"+d.id);
                    const line = planetG.select("line.temp-link");
                    planetG.select("line.temp-link")
                        .attr("x2", +line.attr("x2") + e.dx)
                        .attr("y2", +line.attr("y2") + e.dy);

                    //find nearest planet and if dist is below threshold, set planet as target candidate
                    const LINK_THRESHOLD = 100;
                    const availablePlanets = planetLayoutData
                        .filter(p => p.id !== d.id)
                        .filter(p => !linkLayoutData.find(l => l.id.includes(d.id) && l.id.includes(p.id)))

                    const nearestPlanet = findNearestPlanet(e, availablePlanets.filter(p => p.id !== d.id));
                    const linkPlanet = distanceBetweenPoints(e, nearestPlanet) <= LINK_THRESHOLD ? nearestPlanet : undefined;
                    linkPlanets = linkPlanet ? [d, linkPlanet] : [];
                    //console.log("linkPlanets", linkPlanets)

                    d3.selectAll("g.planet").selectAll("g.contents").selectAll("ellipse")
                        .attr("stroke", p => p.id === d.id || p.id === linkPlanet?.id ? grey10(3) : grey10(5))
                        .attr("stroke-width", p => p.id === d.id || p.id === linkPlanet?.id ? 5 : 1);
                }
                
                function onRingDragEnd(e, d){
                    const planetG = d3.select("g#planet-"+d.id);
                    //const ringNr = planetG.selectAll("line").size() - 1;
                    //cleanup dom
                    planetG.select("line.temp-link").remove();
                    d3.selectAll("g.planet").select("g.contents").select("ellipse")
                        .attr("stroke", grey10(5))

                    //set x2, y2 to centre of nearest planet
                    //...
                    if(linkPlanets.length === 2){
                        const sortedLinks = linkPlanets.sort((a, b) => d3.ascending(a.x, b.x))
                        //save link
                        addLink({ src:sortedLinks[0].id, targ:sortedLinks[1].id })
                    }
                }
            }
        })

        return selection;
    }     

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
    journey.on = function () {
        if (!dispatch) return journey;
        // attach extra arguments
        const value = dispatch.on.apply(dispatch, arguments);
        return value === dispatch ? journey : value;
    };
    return journey;
}


//bar enter
//chart
/*
if(d.isOpen){
    wrapperContentsG
        .append("g")
            .attr("class", "chart")
            .attr("transform", "translate(0," +planetHeight +")");

    //set up bar chart
    //note - barChart has its own contentsG and margins
    barCharts[d.id] = barChartGenerator()
        .width(chartWidth)
        .height(chartHeight);
}
*/

//bar update
//call active bar chart
/*
if(p.isOpen){
    //format data
    //console.log("d", d)
    const barData = p.goals.map(g => {
        //ofr now, assue 1 datasetmeasure per goal
        const measure = g.datasetMeasures[0];
        //for now projValue is hardcoded
        const { startDate, targetDate } = p;
        const { startValue, targetValue } = measure;
        const latestDate = d3.max(measure.datapoints, d => d.date)
        const latestD = measure.datapoints.find(d => d.date === latestDate)
        const { date, value } = latestD;
        const actualchange = value - startValue;
        const targetChange = targetValue - startValue;
        const pcValue = targetChange === 0 ? 100 : +((actualchange / targetChange) * 100).toFixed(2);
        const projValue = linearProjValue(startDate.getTime(), startValue, date.getTime(), value, targetDate.getTime(), 2)
        const projPCChange = projValue - startValue;
        const projPCValue = targetChange === 0 ? 100 : +((projPCChange / targetChange) * 100).toFixed(2);
        return {
            ...g,
            date,
            value,
            pcValue,
            //a linear projection for targetDate value, using a line from start to current
            projValue,
            projPCValue
        }
    })
    console.log("barData", barData)
    wrapperContentsG.select("g.chart").datum(barData).call(barCharts[p.id]);
}
*/