import * as d3 from 'd3';
//import "d3-selection-multi";
import { calcTrueX, calcAdjX, findPointChannel, findDateChannel, findNearestChannelByEndDate,
    calcChartHeight, findFuturePlanets, findFirstFuturePlanet, findNearestDate, getTransformation } from './helpers';
//import { COLOURS, DIMNS } from "./constants";
import { addWeeks } from "../util/TimeHelpers"
import { ellipse } from "./ellipse";
import { grey10, COLOURS } from "./constants";
import { findNearestPlanet, distanceBetweenPoints, channelContainsPoint, channelContainsDate } from './geometryHelpers';
import { OPEN_CHANNEL_EXT_WIDTH } from './constants';
import dragEnhancements from './enhancedDragHandler';
import { timeMonth, timeWeek } from "d3-time";
import menuComponent from './menuComponent';
/*

*/
export default function planetsComponent() {
    // dimensions
    let margin = {left:5, right:5, top: 5, bottom:5};
    let width = 60;
    let height = 60;
    let contentsWidth;
    let contentsHeight;
    let fontSize = 9;

    function updateDimns(){
        contentsWidth = width - margin.left - margin.right;
        contentsHeight = height - margin.top - margin.bottom;
    };

    let timeScale = x => 0;
    let yScale = x => 0;

    let planetsData = [];
    let linksData = [];
    let channelsData;
    //let trueX = x => x;
    let adjX = x => x;
    let pointChannel = () => {};
    let dateChannel = () => {};
    let nearestChannelByEndDate = () => {};

    //handlers
    let onDragStart = function() {};
    let onDrag = function() {};
    let onDragEnd = function() {};

    function updateChannelsData(newChannelsData){
        channelsData = newChannelsData;
        //trueX = calcTrueX(channelsData);
        adjX = calcAdjX(channelsData);
        pointChannel = findPointChannel(channelsData);
        dateChannel = findDateChannel(channelsData);
        nearestChannelByEndDate = findNearestChannelByEndDate(channelsData);
    }

    //api
    let addPlanet = function(){};
    let updatePlanet = function(){};
    let startEditPlanet = function(){};
    let deletePlanet = function(){};
    let addLink = function(){};
    let onClick = function(){};

    let withClick = dragEnhancements();

    //components
    const ring = ellipse().className("ring");
    let menus = {};
    let menuOptions = [
        { key: "edit", label:"Edit" },
        { key: "delete", label:"Delete" },
         //put goals on planet, and only show it in bar chart when it is 
        //also on src planet. BUT it does mean we need to also put it on src. Could have a goals library, or just use the dataset library (1 goal per dataset for now)
    ];

    function planets(selection, options={}) {
        const { transitionEnter, transitionUpdate } = options;
        updateDimns();
        // expression elements
        selection.each(function (data) {
            //console.log("planets", data)
            if(data){ planetsData = data;}

            withClick.onClick(onClick)
            const planetDrag = d3.drag()
                .on("start", withClick(onPlanetDragStart))
                .on("drag", withClick(onPlanetDrag))
                .on("end", withClick(onPlanetDragEnd));

            const planetG = d3.select(this).selectAll("g.planet").data(planetsData, p => p.id);
            planetG.enter()
                .append("g")
                .attr("class", "planet")
                .attr("id", d => "planet-"+d.id)
                .attr("opacity", 1) //for now, just transition out not in
                .call(ring)
                .each(function(d,i){
                    //ENTER
                    const contentsG = d3.select(this)
                        .append("g")
                        .attr("class", "contents")

                    //ellipse
                    contentsG
                        .append("ellipse")
                            .attr("class", "core")
                            .attr("fill", grey10(5))
                            .attr("cursor", "pointer")
                    
                    //text
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
                .each(function(d){
                    //ENTER AND UPDATE
                    const contentsG = d3.select(this).select("g.contents")
                    //ellipse
                    contentsG.select("ellipse.core")
                        .attr("rx", d.rx(contentsWidth) || 50)
                        .attr("ry", d.ry(contentsHeight) || 50)
                    //text
                    contentsG.select("text")
                        .attr("font-size", fontSize)
                        .text(d.name || d.id)
                        //.text(d.name || "enter name")
                })
                .call(planetDrag)
                //@todo - use mask to make it a donut and put on top
                .call(ring
                    .rx(d => d.ringRx(contentsWidth))
                    .ry(d => d.ringRy(contentsHeight))
                    .fill((d, hovered) => hovered ? COLOURS.potentialLinkPlanet : "transparent")
                    .stroke("none")
                    .onDragStart(onRingDragStart)
                    .onDrag(onRingDrag)
                    .onDragEnd(onRingDragEnd)
                    .container("g.contents"))
                .each(function(d){
                    const menuG = d3.select(this).selectAll("g.menu").data(d.isSelected ? [menuOptions] : [], d => d.key);
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
                        .attr("transform", "translate(0," + (d.rx(contentsWidth) * 0.8) +")")
                        .call(menus[d.id]
                            .onClick((opt) => {
                                switch(opt.key){
                                    case "delete": { deletePlanet(d.id) };
                                    //for goals
                                    case "edit": { startEditPlanet(d) };
                                    default:{};
                                }
                            }))

                    menuG.exit().each(function(d){
                        //will be multiple exits because of the delay in removing
                        if(d3.select(this).attr("opacity") == 1){
                            d3.select(this)
                                .transition()
                                    .duration(100)
                                    .attr("opacity", 0)
                                    .on("end", function() { d3.select(this).remove() });
                        }
                    }) 
                })
            
            
            
            //UPDATE ONLY - transition position
            planetG.each(function(d){
                const planetG = d3.select(this);
                if(transitionUpdate){
                    const { translateX } = getTransformation(planetG.attr("transform"));
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
                if(d3.select(this).attr("opacity") == 1){
                    d3.select(this)
                        .transition()
                            .duration(200)
                            .attr("opacity", 0)
                            .on("end", function() { d3.select(this).remove() });
                }
            }) 
     
            function onPlanetDragStart(e , d){
                //note - called on click too - could improve enhancedDrag by preveting dragStart event
                //until a drag event has also been recieved, so stroe it and then release when first drag event comes through
                onDragStart.call(this, e, d)
            }
            function onPlanetDrag(e , d){
                d.x += e.dx;
                d.y += e.dy;

                //obv need to tidy up teh way trueX is added in planetslayout too
                //but first look at why link line
                //becomes short and what happens to bar charts
                const targetDate = timeScale.invert(d.channel.trueX(d.x))
                const yPC = yScale.invert(d.y)

                //UPDATE DOM
                //planet
                d3.select(this).attr("transform", "translate("+(d.x) +"," +(d.y) +")");

                onDrag.call(this, e, { ...d, targetDate, yPC, unaligned:true })

            }

            //note: newX and Y should be stored as d.x and d.y
            function onPlanetDragEnd(e, d){
                if(withClick.isClick()) { return; }
                onDragEnd.call(this, e, d);
            }

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
                const availablePlanets = planetsData
                    .filter(p => p.id !== d.id)
                    .filter(p => !linksData.find(l => l.id.includes(d.id) && l.id.includes(p.id)))
                    .map(p => ({ ...p, x:timeScale(p.displayDate), y:yScale(p.yPC)}))

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
                    addLink({ src:sortedLinks[0].id, targ:sortedLinks[1].id })
                }
            }
        })
        return selection;
    }
    
    //api
    planets.margin = function (value) {
        if (!arguments.length) { return margin; }
        margin = { ...margin, ...value};
        return planets;
    };
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

    planets.addPlanet = function (value) {
        if (!arguments.length) { return addPlanet; }
        if(typeof value === "function"){
            addPlanet = value;
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
        if (!arguments.length) { return Planet; }
        if(typeof value === "function"){
            startEditPlanet = value;
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
    planets.addLink = function (value) {
        if (!arguments.length) { return addLink; }
        if(typeof value === "function"){
            addLink = value;
        }
        return planets;
    };
    return planets;
}
