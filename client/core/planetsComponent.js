import * as d3 from 'd3';
//import "d3-selection-multi";
import { calcTrueX, calcAdjX, findPointChannel, findDateChannel, findNearestChannelByEndDate,
    calcChartHeight, findFuturePlanets, findFirstFuturePlanet, findNearestDate, getTransformationFromTrans } from './helpers';
//import { COLOURS, DIMNS } from "./constants";
import { addWeeks } from "../util/TimeHelpers"
import { ellipse } from "./ellipse";
import { grey10, COLOURS, DIMNS, DEFAULT_PLANET_RX, DEFAULT_PLANET_RY } from "./constants";
import { findNearestPlanet, distanceBetweenPoints, channelContainsPoint, channelContainsDate } from './geometryHelpers';
import { OPEN_CHANNEL_EXT_WIDTH } from './constants';
import dragEnhancements from './enhancedDragHandler';
import { timeMonth, timeWeek } from "d3-time";
import menuComponent from './menuComponent';
/*

*/
export default function planetsComponent() {
    //API SETTINGS
    // dimensions
    let width = DIMNS.planet.width;
    let height = DIMNS.planet.height;

    let fontSize = 9;

    let timeScale = x => 0;
    let yScale = x => 0;

    let selected;
    let selectedMeasure;
    let selectedMeasureIsInGoal = goal => false;

    let prevData = [];
    let linksData = [];
    let channelsData;
    //let trueX = x => x;
    let adjX = x => x;
    let pointChannel = () => {};
    let dateChannel = () => {};
    let nearestChannelByEndDate = () => {};

    let withRing = true;
    let highlighted = [];
    const bgColour = COLOURS.canvas;
    //contents to show can be none, nameOnly, targOnly, "basic", "all"
    let contentsToShow = goal => "basic";

    let colours = {
        planet:COLOURS.planet
    }

    const planetOpacity = {
        normal: 0.7,
        available: 0.3,
        //unavailable: 0.2
    }
    const availablePlanetSizeMultiplier = 1.5;

    //API FUNCTIONS
    let showAvailabilityStatus = function() {};
    let stopShowingAvailabilityStatus = function() {};

    //API CALLBACKS
    let onClick = function(){};
    let onDragStart = function() {};
    let onDrag = function() {};
    let onDragEnd = function() {};
    let onMouseover = function(){};
    let onMouseout = function(){};

    let createPlanet = function(){};
    let updatePlanet = function(){};
    let startEditPlanet = function(){};
    let convertToAim = function(){};
    let deletePlanet = function(){};
    let onAddLink = function(){};

    function updateChannelsData(newChannelsData){
        channelsData = newChannelsData;
        //trueX = calcTrueX(channelsData);
        adjX = calcAdjX(channelsData);
        pointChannel = findPointChannel(channelsData);
        dateChannel = findDateChannel(channelsData);
        nearestChannelByEndDate = findNearestChannelByEndDate(channelsData);
    }

    //api


    let withClick = dragEnhancements();

    //components
    const ring = ellipse().className("ring");
    let menus = {};
    let menuOptions = (d) => {
        const basicOpts = [
            { key: "edit", label:"Edit" },
            { key: "delete", label:"Delete" }
        ]
        return d.aimId ? basicOpts : [ { key: "aim", label:"Make Aim" }, ...basicOpts ];
         //put goals on planet, and only show it in bar chart when it is 
        //also on src planet. BUT it does mean we need to also put it on src. Could have a goals library, or just use the dataset library (1 goal per dataset for now)
    };

    //dom
    let containerG;

    function planets(selection, options={}) {
        const { transitionEnter=true, transitionUpdate=true } = options;
        // expression elements
        selection.each(function (data) {
            // console.log("planets..........", data)
            //plan - dont update dom twice for name form
            //or have a transitionInProgress flag
            containerG = d3.select(this);
            //can use same enhancements object for outer and inner as click is same for both
            withClick.onClick(onClick)
            const planetDrag = d3.drag()
                .on("start", withClick(onDragStart))
                .on("drag", withClick(onDrag))
                .on("end", withClick(function(e,d){
                    if(withClick.isClick()) { 
                        return; }
                    onDragEnd.call(this, e, d);
                }));

            const outerPlanetDrag = d3.drag()
                .on("start", withClick(onRingDragStart))
                .on("drag", withClick(onRingDrag))
                .on("end", withClick(function(e,d){
                    if(withClick.isClick()) { 
                        return; }
                    onRingDragEnd.call(this, e, d);
                }));

            function onOuterDragStart(e,d){
                console.log("outer drag start")
            }
            function onOuterDrag(e,d){
                console.log("outer drag")
            }
            function onOuterDragEnd(e,d){
                console.log("outer drag end")
            }

            const planetG = containerG.selectAll("g.planet").data(data, d => d.id);
            planetG.enter()
                .append("g")
                .attr("class", d => "planet planet-"+d.id)
                .attr("id", d => "planet-"+d.id)
                .each(function(d,i){
                    //ENTER
                    const contentsG = d3.select(this)
                        .append("g")
                        .attr("class", "contents")

                    //bg ellipse (stops elements under it showing through when opacity < 1)
                    contentsG
                        .append("ellipse")
                            .attr("class", "core core-outer bg solid-bg")
                            .attr("fill", bgColour)
                            .attr("stroke", "none")

                    //ellipse
                    contentsG
                        .append("ellipse")
                            .attr("class", "core core-outer visible")
                            .attr("stroke", "none")
                            .attr("cursor", "crosshair");

                    contentsG
                        .append("ellipse")
                            .attr("class", "core core-inner bg solid-bg")
                            .attr("fill", bgColour)
                            .attr("stroke", "none");

                    contentsG
                        .append("ellipse")
                            .attr("class", "core core-inner visible")
                            .attr("stroke", "none")
                            .attr("cursor", "pointer")
                    
                    //title text
                    contentsG
                        .append("text")
                        .attr("class", "title")
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "middle")
                        .style("pointer-events", "none")
                    
                    //menu component
                    menus[d.id] = menuComponent();
                
                })
                //we call both transitions for enter separate to update. This allows us to 
                //specify when we want the entered nodes to transition. We dont want that to 
                //occur when loading a pre-existing canvas. In that case, the first call below
                //will have no effect because transitionEnter=false in the 2nd call
                .call(transform, { x: d => adjX(timeScale(d.targetDate)), y:d => d.y })
                .call(transform, { x: d => d.x, y:d => d.y }, transitionEnter)
                .merge(planetG)
                .attr("opacity", 1)
                .each(function(d){
                    const rx = d.rx(width);
                    const ry =  d.ry(height);
                    const ringRx = d.ringRx(width);
                    const ringRy = d.ringRy(height);
                    const deltaRx = ringRx - rx;
                    const deltaRy = ringRy - ry;
                    //ENTER AND UPDATE
                    const contentsG = d3.select(this).select("g.contents")

                    //for now, we assume all contents are text, and dont btoher with transition.
                    //so to turn off contents, set display to none
                    contentsG.selectAll("text").attr("display", contentsToShow(d) === "none" ? "none" : null);

                    //ellipse sizes
                    contentsG.selectAll("ellipse.core-outer")
                        .attr("rx", rx)
                        .attr("ry", ry)

                    contentsG.selectAll("ellipse.core-inner")
                        .attr("rx", rx - deltaRx)
                        .attr("ry", ry - deltaRy)

                    //ellipse fills and opacities
                    contentsG.select("ellipse.core-outer.visible")
                        //@todo - add transition to this opacity change
                        .attr("opacity", !selectedMeasure || selectedMeasureIsInGoal(d) ? planetOpacity.normal : planetOpacity.available)
                        .attr("fill", colours.planet)
                        .call(outerPlanetDrag);

                    contentsG.select("ellipse.core-inner.visible")
                        //@todo - add transition to this opacity change
                        .attr("opacity", !selectedMeasure || selectedMeasureIsInGoal(d) ? planetOpacity.normal : planetOpacity.available)
                        .attr("fill", colours.planet)
                   
                    //title
                    contentsG.select("text")
                        .attr("opacity", !selectedMeasure || selectedMeasureIsInGoal(d) ? planetOpacity.normal : planetOpacity.available)
                        .attr("font-size", fontSize)
                        .text(d.name || d.id.slice(-1))
                        //.text(d.name || "enter name")

                    //targ
                    let targData = [];
                    //getting error when doing this
                    if(selectedMeasureIsInGoal(d)){
                        const planetMeasureData = d.measures.find(m => m.id === selectedMeasure.id);
                        targData.push({ ...selectedMeasure, ...planetMeasureData });
                    }

                    const targG = contentsG.selectAll("g.targ").data(targData)
                    targG.enter()
                        .append("g")
                            .attr("class", "targ")
                            .each(function(measure){
                                d3.select(this)
                                    .append("text")
                                        .attr("text-anchor", "middle")
                                        .attr("dominant-baseline", "middle")
                                        .style("pointer-events", "none")
                                        .style("font-size", 6)
                            })
                            .merge(targG)
                            .attr("transform", "translate(0, " +ry/2 +")")
                            .each(function(m){
                                d3.select(this).select("text")
                                    .attr("opacity", !selectedMeasure || selectedMeasureIsInGoal(d) ? planetOpacity.normal : planetOpacity.unavailable)
                                    .text("target "+(typeof m.targ === "number" ? m.targ : "not set"))

                            })
                            
                    targG.exit().remove();
                            
                })
                //.call(updateHighlighted)
                .call(planetDrag)
                //note-  could just store the planetId in here when mousedover ie 
                //ie stored as active or something
                //the current approach when measure is  doesnt work
                //becuase it covers up teh pointer-event so mouseover isnt called.
                //how did i resolve this in expression builder?
                /*
                .on("mouseover", function(e,d){
                    d3.select(this).raise();
                    //console.log("mo goal")
                    //const selectedMeasureIsInPlanet = !!d.measures.find(m => m.id === selectedMeasure);
                    //if(measuresBar.selected() && (selectedMeasureIsInPlanet || measuresBar.dragged())){
                    if(selectedMeasure){
                        //in all cases where a measure is selected (eg could be dragged)
                        //then whether or not planet has meaure already, we highlight.
                        //But the two cass are diffrernt.. need to clarify teh behaviour we want when measure
                        //is already in planet compared to when not is when being dragged on
                    //do we need to stored hoveredPlanet anywhere????
                        //hoveredPlanetId = d.id;
                        //planets.highlight(hoveredPlanetId, measuresBar.dragged());
                        highlight(hoveredPlanetId);
                    }
                    //onMouseover.call(this, e,d);
                })
                .on("mouseout", onMouseout)
                */
                //@todo - use mask to make it a donut and put on top
                .call(withRing ? 
                    ring
                        .rx(d => d.ringRx(width))
                        .ry(d => d.ringRy(height))
                        .fill((d, hovered) => hovered ? COLOURS.potentialLinkPlanet : "transparent")
                        .stroke("none")
                        .opacity(planetOpacity.normal)
                        .onDragStart(onRingDragStart)
                        .onDrag(onRingDrag)
                        .onDragEnd(onRingDragEnd)
                        .container("g.contents") 
                    : 
                    function(selection){
                        selection.selectAll("ellipse.ring").remove();
                        return selection; 
                    }
                )
                .each(function(d){
                    //helper
                    //dont show menu if targOnly form open is if planet has the selectedMeasure on it
                    const showContextMenu = d => selected?.id === d.id;// && !d.measures.find(m => m.id === selectedMeasure?.id);
                    const menuG = d3.select(this).selectAll("g.menu").data(showContextMenu(d) ? [menuOptions(d)] : [], d => d.key);
                    const menuGEnter = menuG.enter()
                        .append("g")
                            .attr("class", "menu")
                            .attr("opacity", 1)
                            /*
                            .attr("opacity", 0)
                            .transition()
                                .duration(200)
                                .attr("opacity", 1);*/
                    
                    menuGEnter.merge(menuG)
                        .attr("transform", "translate(0," + (d.rx(width) * 0.8) +")")
                        .call(menus[d.id]
                            .onClick((opt) => {
                                switch(opt.key){
                                    case "delete": { 
                                        deletePlanet.call(this, d.id);
                                        break;
                                    };
                                    //for goals
                                    case "edit": { 
                                        startEditPlanet.call(this, d);
                                        break; 
                                    };
                                    case "aim": { 
                                        convertToAim.call(this, d);
                                        break; 
                                    };
                                    default:{};
                                }
                            }))

                    menuG.exit().each(function(d){
                        //will be multiple exits because of the delay in removing
                        if(!d3.select(this).attr("class").includes("exiting")){
                            d3.select(this)
                                .classed("exiting", true)
                                .transition()
                                    .duration(100)
                                    .attr("opacity", 0)
                                    .on("end", function() { d3.select(this).remove(); });
                        }
                    }) 
                })

            //update only
            planetG.call(transform, { x: d => d.x, y:d => d.y }, transitionUpdate)

            function transform(selection, transform={}, transition){
                const { x = d => 0, y = d => 0, k = d => 1 } = transform;
                selection.each(function(d){
                    const planetG = d3.select(this);
                    const { translateX, translateY } = getTransformationFromTrans(planetG.attr("transform"));
                    //on call from enter, there will be no translate so deltas are 0 so no transition
                    //but then transform is called again on entered planets after merge with update
                    const deltaX = translateX ? Math.abs(translateX - x(d)) : 0;
                    const deltaY = translateY ? Math.abs(translateY - y(d)) : 0;
                    if(transition && (deltaX > 0.1 || deltaY > 0.1)){
                        planetG
                            .transition()
                                .delay(transition.delay || 0)
                                .duration(transition.duration || 200)
                                .attr("transform", "translate("+x(d) +"," +y(d) +") scale("+k(d) +")");

                    }else{
                        planetG.attr("transform", "translate("+x(d) +"," +y(d) +") scale("+k(d) +")");
                    }
                })
            }

            //EXIT
            planetG.exit().each(function(d){
                //will be multiple exits because of the delay in removing
                if(!d3.select(this).attr("class").includes("exiting")){
                    d3.select(this)
                        .classed("exiting", true)
                        .transition()
                            .duration(200)
                            .attr("opacity", 0)
                            .on("end", function() { d3.select(this).remove(); });
                }
            }) 

            //ring
            let linkPlanets = [];
            function onRingDragStart(e,d){
                linkPlanets = [d];
                const planetG = d3.select("g#planet-"+d.id);
                //update ring fill
                ring.fill((d,hovered) => hovered || linkPlanets.includes(d.id) ? COLOURS.potentialLinkPlanet : "transparent");
                
                planetG.select("g.contents")
                    .insert("line", ":first-child")
                        .attr("class", "temp-link")
                        .attr("x1", e.sourceEvent.offsetX - timeScale(d.displayDate))
                        .attr("y1", e.sourceEvent.offsetY - yScale(d.yPC))
                        .attr("x2", e.sourceEvent.offsetX - timeScale(d.displayDate))
                        .attr("y2", e.sourceEvent.offsetY - yScale(d.yPC))
                        .attr("stroke-width", 1)
                        .attr("stroke", COLOURS.potentialLink)
                        .attr("fill", COLOURS.potentialLink);

            }

            function onRingDrag(e,d){
                const planetG = d3.select("g#planet-"+d.id);
                const line = planetG.select("line.temp-link");
                planetG.select("line.temp-link")
                    .attr("x2", +line.attr("x2") + e.dx)
                    .attr("y2", +line.attr("y2") + e.dy);

                //find nearest planet and if dist is below threshold, set planet as target candidate
                const LINK_THRESHOLD = 100;
                //const availablePlanets = data
                //need all planets not just ones in this aim
                const availablePlanets = d3.selectAll("g.planet")
                    .filter(p => p.id !== d.id)
                    .filter(p => !linksData.find(l => l.id.includes(d.id) && l.id.includes(p.id)))
                    .data();

                const nearestPlanet = findNearestPlanet(e, availablePlanets);
                //console.log("near", nearestPlanet)
                const linkPlanet = distanceBetweenPoints(e, nearestPlanet) <= LINK_THRESHOLD ? nearestPlanet : undefined;
                //change fill to same as planetRing
                //@todo - consider using temp clasnames to update dom for highlighting like this eg...
                //d3.selectAll("g.link-planet").classed("link-planet", false);
                //d3.select("g.planet-"+linkPlanet.id).classed("link-planet", true);
                const prevLinkPlanet = linkPlanets[1];
                if(prevLinkPlanet?.id !== linkPlanet?.id){
                    //remove prev highlighting
                    if(prevLinkPlanet){
                        d3.select("g.planet-"+prevLinkPlanet.id).selectAll("ellipse.core.visible")
                            .transition()
                            .duration(200)
                                .attr("fill", colours.planet)
                    }
                    //add new highlighting
                    if(linkPlanet){
                        d3.select("g.planet-"+linkPlanet.id).selectAll("ellipse.core.visible")
                            .transition()
                            .duration(200)
                                .attr("fill", COLOURS.potentialLinkPlanet)
                    }
                }
                //const { x, y, ...rest } = linkPlanet
                //console.log("linkPlanet", linkPlanet)
                linkPlanets = linkPlanet ? [d, linkPlanet] : [d];

                //update ring fill
                ring.fill((d,hovered) => hovered || linkPlanets.map(p => p.id).includes(d.id) ? COLOURS.potentialLinkPlanet : "transparent");

            }
            
            function onRingDragEnd(e, d){
                const planetG = d3.select("g#planet-"+d.id);
                //cleanup dom
                planetG.select("line.temp-link").remove();
                ring.fill((d,hovered) => hovered ? COLOURS.potentialLinkPlanet : "transparent");

                //set x2, y2 to centre of nearest planet
                //...\
                if(linkPlanets.length === 2){
                    //clean up
                    d3.select("g.planet-"+linkPlanets[1].id).selectAll("ellipse.core.visible")
                        .transition()
                        .duration(200)
                            .attr("fill", colours.planet)

                    //save new link
                    const sortedLinks = linkPlanets.sort((a, b) => d3.ascending(a.x, b.x))
                    onAddLink({ src:sortedLinks[0].id, targ:sortedLinks[1].id })
                }
            }

            prevData = data;
        })

        return selection;
    }
    
    //api
    planets.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        return planets;
    };
    planets.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        return planets;
    };
    planets.colours = function (value) {
        if (!arguments.length) { return colours; }
        colours = { ...colours, ...value };
        return planets;
    };
    planets.selected = function (value) {
        if (!arguments.length) { return selected; }
        selected = value;
        return planets;
    };
    planets.selectedMeasure = function (value) {
        if (!arguments.length) { return selectedMeasure; }
        selectedMeasure = value;
        selectedMeasureIsInGoal = goal => selectedMeasure && goal.measures.find(m => m.id === selectedMeasure.id);
        return planets;
    };
    planets.withRing = function (value) {
        if (!arguments.length) { return withRing; }
        withRing = value;
        if(containerG){
            containerG.call(planets);
        }

        return planets;
    };
    planets.channelsData = function (value) {
        if (!arguments.length) { return channelsData; }
        updateChannelsData(value);
        return planets;
    };
    planets.linksData = function (value) {
        if (!arguments.length) { return linksData; }
        linksData = value;
        return planets;
    };
    planets.yScale = function (value) {
        if (!arguments.length) { return yScale; }
        yScale = value;
        return planets;
    };
    planets.fontSize = function (value) {
        if (!arguments.length) { return fontSize; }
        fontSize = value;
        return planets;
    };
    planets.contentsToShow = function (value) {
        if (!arguments.length) { return contentsToShow; }
        contentsToShow = value;
        return planets;
    };
    planets.timeScale = function (value) {
        if (!arguments.length) { return timeScale; }
        timeScale = value;
        return planets;
    };
    planets.onClick = function (value) {
        if (!arguments.length) { return onClick; }
        onClick = value;
        return planets;
    };
    planets.onDragStart = function (value) {
        if (!arguments.length) { return onDragStart; }
        if(typeof value === "function"){
            onDragStart = value;
        }
        return planets;
    };
    planets.onDrag = function (value) {
        if (!arguments.length) { return onDrag; }
        if(typeof value === "function"){
            onDrag = value;
        }
        return planets;
    };
    planets.onDragEnd = function (value) {
        if (!arguments.length) { return onDragEnd; }
        if(typeof value === "function"){
            onDragEnd = value;
        }
        return planets;
    };
    planets.onMouseover = function (value) {
        if (!arguments.length) { return onMouseover; }
        if(typeof value === "function"){
            onMouseover = value;
        }
        return planets;
    };
    planets.onMouseout = function (value) {
        if (!arguments.length) { return onMouseout; }
        if(typeof value === "function"){
            onMouseout = value;
        }
        return planets;
    };
    planets.createPlanet = function (value) {
        if (!arguments.length) { return createPlanet; }
        if(typeof value === "function"){
            createPlanet = value;
        }
        return planets;
    };
    planets.updatePlanet = function (value) {
        if (!arguments.length) { return updatePlanet; }
        if(typeof value === "function"){
            updatePlanet = value;
        }
        return planets;
    };
    planets.startEditPlanet = function (value) {
        if (!arguments.length) { return startEditPlanet; }
        if(typeof value === "function"){
            startEditPlanet = value;
        }
        return planets;
    };
    planets.convertToAim = function (value) {
        if (!arguments.length) { return convertToAim; }
        if(typeof value === "function"){
            convertToAim = value;
        }
        return planets;
    };
    planets.deletePlanet = function (value) {
        if (!arguments.length) { return deletePlanet; }
        if(typeof value === "function"){
            deletePlanet = value;
        }
        return planets;
    };
    planets.onAddLink = function (value) {
        if (!arguments.length) { return onAddLink; }
        if(typeof value === "function"){ onAddLink = value; }
        return planets;
    };
    //functions
    planets.showAvailabilityStatus = function (g, cb = () => {}) {
        //const goal = prevData.find(g => g.id === goalId);
        //todo - find out why if we reference containeG instead of d3 here, it causes a new enter of planetG!
        const rx = g.rx(width);
        const ry =  g.ry(height);
        const ringRx = g.ringRx(width);
        const ringRy = g.ringRy(height);
        const deltaRx = ringRx - rx;
        const deltaRy = ringRy - ry;

        const planetG = d3.select("g.planet-"+g.id);
        const outerEllipses = planetG.selectAll("ellipse.core-outer");
        const innerEllipses = planetG.selectAll("ellipse.core-inner");
        //check - does attr("rx") still return a value when multiple sel?
        const alreadyIncreased = +outerEllipses.attr("rx") !== rx;
        //Math.abs(+coreEllipse.attr("rx") - planetG.datum().rx(width)) > 0.001;
        //console.log("already increased?", alreadyIncreased)
        if(!selectedMeasureIsInGoal(g) && !alreadyIncreased){
            //console.log("increase size", goal.id)
            //increase size to show available
            //ellipses
            outerEllipses
                .transition()
                    .duration(200)
                    .attr("rx", rx * availablePlanetSizeMultiplier)
                    .attr("ry", ry * availablePlanetSizeMultiplier);

            innerEllipses
                .transition()
                    .duration(200)
                    .attr("rx", (rx - deltaRx) * availablePlanetSizeMultiplier)
                    .attr("ry", (ry - deltaRy) * availablePlanetSizeMultiplier)
                        .on("end", () => cb(g.id. measureId));

        }
        
        return planets;
    };
    planets.stopShowingAvailabilityStatus = function (g, cb = () => {}) {
        //const goal = prevData.find(g => g.id === goalId);
        //todo -see above - why cant use containerG instead of d3
        const rx = g.rx(width);
        const ry =  g.ry(height);
        const ringRx = g.ringRx(width);
        const ringRy = g.ringRy(height);
        const deltaRx = ringRx - rx;
        const deltaRy = ringRy - ry;

        const planetG = d3.select("g.planet-"+g.id);
        //ellipses
        const outerEllipses = planetG.selectAll("ellipse.core-outer");
        const innerEllipses = planetG.selectAll("ellipse.core-inner");
        const alreadyReset = +outerEllipses.attr("rx") === rx;
        //Math.abs(+coreEllipse.attr("rx") - planetG.datum().rx(width)) < 0.001;
        //console.log("already reset?", alreadyReset)
        if(!selectedMeasureIsInGoal(g) && !alreadyReset){
            //console.log("reduce size", goal.id)
            //stop showing available
            outerEllipses
                .transition()
                    .duration(200)
                        .attr("rx", rx)
                        .attr("ry", ry)
            innerEllipses
                .transition()
                    .duration(200)
                        .attr("rx", rx - deltaRx)
                        .attr("ry", ry - deltaRy)
                            .on("end", () => cb(g.id. selectedMeasure?.id));
        }
        return planets;
    };
    return planets;
}
