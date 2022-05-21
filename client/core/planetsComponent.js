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
        available: 1,
        unavailable: 0.2
    }
    const availablePlanetSizeMultiplier = 1.3;

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

    //local state
    let removingGoal = false;
    let removingMenu = false;

    function planets(selection, options={}) {
        const { transitionEnter, transitionUpdate } = options;
        // expression elements
        selection.each(function (data) {
            containerG = d3.select(this);
            withClick.onClick(onClick)
            const planetDrag = d3.drag()
                .on("start", withClick(onDragStart))
                .on("drag", withClick(onDrag))
                .on("end", withClick(function(e,d){
                    if(withClick.isClick()) { return; }
                    onDragEnd.call(this, e, d);
                }));;

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
                            .attr("class", "bg core-goal")
                            .attr("fill", bgColour)
                            .attr("cursor", "pointer")

                    //ellipse
                    contentsG
                        .append("ellipse")
                            .attr("class", "core core-goal")
                            .attr("fill", colours.planet)
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
                .each(function(d,i){
                    //ENTER - transition position
                    d3.select(this)
                        .attr("transform", d => "translate("+adjX(timeScale(d.targetDate)) +"," +d.y +")")
                        //.attr("transform", d => "translate("+adjX(timeScale(d.targetDate)) +"," +yScale(d.yPC) +")")
                        .transition()
                            .delay(50)
                            .duration(200)
                            .attr("transform", "translate("+d.x +"," +d.y +")");
                            //.attr("transform", "translate("+timeScale(d.displayDate) +"," +yScale(d.yPC) +")");

                })
                .merge(planetG)
                .attr("opacity", 1)
                .each(function(d){
                    const rx = d.rx ? d.rx(width) : DEFAULT_PLANET_RX;
                    const ry =  d.ry ? d.ry(height) : DEFAULT_PLANET_RY; 
                    //ENTER AND UPDATE
                    const contentsG = d3.select(this).select("g.contents")

                    //for now, we assume all contents are text, and dont btoher with transition.
                    //so to turn off contents, set display to none
                    contentsG.selectAll("text").attr("display", contentsToShow(d) === "none" ? "none" : null);

                    //bg ellipse
                    contentsG.select("ellipse.bg")
                        .attr("rx", rx)
                        .attr("ry", ry)
                    //ellipse
                    contentsG.select("ellipse.core")
                    //@todo - add transition to this opacity change
                        .attr("opacity", !selectedMeasure || selectedMeasureIsInGoal(d) ? planetOpacity.normal : planetOpacity.unavailable)
                        .attr("rx", rx)
                        .attr("ry", ry)
                    //title
                    contentsG.select("text")
                        .attr("opacity", !selectedMeasure || selectedMeasureIsInGoal(d) ? planetOpacity.normal : planetOpacity.unavailable)
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
                    const showContextMenu = d => d.isSelected && !d.measures.find(m => m.id === selectedMeasure?.id);
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
                        if(!removingMenu){
                            removingMenu = true;
                            d3.select(this)
                                .transition()
                                    .duration(100)
                                    .attr("opacity", 0)
                                    .on("end", function() { 
                                        d3.select(this).remove();
                                        removingMenu = false; 
                                    });
                        }
                    }) 
                })
            
            
            
            //UPDATE ONLY - transition position
            planetG.each(function(d){
                const planetG = d3.select(this);
                if(transitionUpdate){
                    const { translateX } = getTransformationFromTrans(planetG.attr("transform"));
                    planetG
                        .attr("transform", d => "translate("+translateX +"," +d.y +")")
                        .transition()
                            .delay(50)
                            .duration(200)
                            .attr("transform", "translate("+d.x +"," +d.y +")");
                }else{
                    planetG
                        .attr("transform", "translate("+d.x +"," +d.y +")");
                }
            })

            //EXIT
            planetG.exit().each(function(d){
                //will be multiple exits because of the delay in removing
                if(!removingGoal){
                    removingGoal = true;
                    d3.select(this)
                        .transition()
                            .duration(200)
                            .attr("opacity", 0)
                            .on("end", function() { 
                                d3.select(this).remove();
                                removingGoal = false; 
                            });
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
                    const sortedLinks = linkPlanets.sort((a, b) => d3.ascending(a.x, b.x))
                    //save link
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
    /*
    planets.highlight = function (value, shouldIncreaseSize) {
        if (!arguments.length) { return yScale; }
        const ids = Array.isArray(value) ? value : [value];
        highlighted = [...highlighted, ...ids];
        containerG.selectAll("g.planet")
            .filter(d => ids.includes(d.id))
            .call(updateHighlighted, shouldIncreaseSize, true);

        return planets;
    };
    planets.unhighlight = function (value) {
        if (!arguments.length) { return planets; }
        const ids = Array.isArray(value) ? value : [value];
        highlighted = highlighted.filter(id => !ids.includes(id));
        //why not filtering back to 0?, could always pass it through
        containerG.selectAll("g.planet")
            .filter(d => ids.includes(d.id))
            .call(updateHighlighted, false, true);

        return planets;
    };
    */
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
    planets.showAvailabilityStatus = function (goal, measureId, cb = () => {}) {
        //const goal = prevData.find(g => g.id === goalId);
        //todo - find out why if we reference containeG instead of d3 here, it causes a new enter of planetG!
        const planetG = d3.select("g.planet-"+goal.id);
        const bgEllipse = planetG.select("ellipse.bg");
        const coreEllipse = planetG.select("ellipse.core");
        console.log("planetG", planetG.node())
        console.log("bg", bgEllipse.node())
        //const name = d3.select("g.planet-"+goal.id).select("ellipse.core");

        if(!goal.measures.find(m => m.id === measureId)){
            //show available
            //text
            console.log("a")
            planetG.selectAll("text")
                .transition()
                    .duration(200)
                    .attr("opacity", planetOpacity.available);
            console.log("b")
            //ellipses
            bgEllipse
                .transition()
                    .duration(200)
                    .attr("rx", +bgEllipse.attr("rx") * availablePlanetSizeMultiplier)
                    .attr("ry", +bgEllipse.attr("ry") * availablePlanetSizeMultiplier);
                    console.log("c")
            coreEllipse
                .transition()
                    .duration(200)
                    .attr("opacity", planetOpacity.available)
                    .attr("rx", +coreEllipse.attr("rx") * availablePlanetSizeMultiplier)
                    .attr("ry", +coreEllipse.attr("ry") * availablePlanetSizeMultiplier)
                        .on("end", () => cb(goal.id. measureId));

        }else{
            //text
            console.log("A")
            planetG.selectAll("text")
                .transition()
                    .duration(200)
                    .attr("opacity", planetOpacity.unavailable);

            //ellipses
            //show unavailable
            console.log("B")
            coreEllipse
                .transition()
                    .duration(200)
                    .attr("opacity", planetOpacity.unavailable)
                        .on("end", () => cb(goal.id. measureId));
        }
        
        return planets;
    };
    planets.stopShowingAvailabilityStatus = function (goal, measureId, cb = () => {}) {
        //const goal = prevData.find(g => g.id === goalId);
        //todo -see above - why cant use containerG instead of d3
        const planetG = d3.select("g.planet-"+goal.id);
        //text
        planetG.selectAll("text")
            .transition()
                .duration(200)
                .attr("opacity", planetOpacity.normal);

        //ellipses
        const bgEllipse = planetG.select("ellipse.bg");
        const coreEllipse = planetG.select("ellipse.core");
        if(!goal.measures.find(m => m.id === measureId)){
            //stop showing available
            bgEllipse
                .transition()
                    .duration(200)
                        .attr("rx", +bgEllipse.attr("rx") / availablePlanetSizeMultiplier)
                        .attr("ry", +bgEllipse.attr("ry") / availablePlanetSizeMultiplier)
            coreEllipse
                .transition()
                    .duration(200)
                        .attr("opacity", planetOpacity.normal)
                        .attr("rx", +coreEllipse.attr("rx") / availablePlanetSizeMultiplier)
                        .attr("ry", +coreEllipse.attr("ry") / availablePlanetSizeMultiplier)
                            .on("end", () => cb(goal.id. measureId));
        }else{
            //stop showing unavailable
            coreEllipse
                .transition()
                    .duration(200)
                    .attr("opacity", planetOpacity.normal)
                        .on("end", () => cb(goal.id. measureId));
        }


        
        return planets;
    };
    return planets;
}
