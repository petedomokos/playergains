import * as d3 from 'd3';
//import "d3-selection-multi";
import { calcTrueX, calcAdjX, findPointChannel, findDateChannel, findNearestChannelByEndDate,
    calcChartHeight, findFuturePlanets, findFirstFuturePlanet, findNearestDate, getTransformation } from './helpers';
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
    let addLink = function(){};
    
    const ring = ellipse().className("ring");

    function planets(selection, options={}) {
        const { transitionEnter, transitionUpdate } = options;
        updateDimns();
        // expression elements
        selection.each(function (data) {
            //console.log("planets", data)
            if(data){ planetsData = data;}

            //3. PLANETS
            const planetDrag = d3.drag()
                .on("start", onPlanetDragStart)
                .on("drag", onPlanetDrag)
                .on("end", onPlanetDragEnd);

            const planetG = d3.select(this).selectAll("g.planet").data(planetsData, p => p.id);
            planetG.enter()
                .append("g")
                .attr("class", "planet")
                .attr("id", d => "planet-"+d.id)
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
                    
                    //text
                    contentsG
                        .append("text")
                        .attr("class", "title")
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "middle")
                        .style("pointer-events", "none")
                
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
                        .text(d.title || "enter name...")
                })
                .call(planetDrag)
                //@todo - use mask to make it a donut and put on top
                .call(ring
                        .rx(d => d.rx(contentsWidth) * 1.3)
                        .ry(d => d.ry(contentsWidth) * 1.3)
                        .fill("transparent")
                        .stroke("none")
                        .onDragStart(onRingDragStart)
                        .onDrag(onRingDrag)
                        .onDragEnd(onRingDragEnd)
                        .container("g.contents"));
            
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
            

            let planetWasMoved = true; //for now, always true
            function onPlanetDragStart(e , d){
                onDragStart.call(this, e, d)
            }
            function onPlanetDrag(e , d){
                if(!planetWasMoved) { return; }
                d.x += e.dx;
                d.y += e.dy;

                //obv need to tidy up teh way trueX is added in planetslayout too
                //but first look at why link line
                //becomes short and what happens to bar charts

                //const targetDateNonAdj= timeScale.invert(d.x) //todo - incl adjX
                //console.log("targNonAdj", targetDateNonAdj)
                //this seems wrong, it suddenly jumps up, causing channel to switch up etc
                //const targetDate = timeScale.invert(adjX(d.x))
                //console.log("DRAG targetDate", targetDate)
                const targetDate = timeScale.invert(d.channel.trueX(d.x))
                //console.log("trueX", d.channel.trueX(d.x))
                //console.log("targ", targetDate)
                const yPC = yScale.invert(d.y)

                //UPDATE DOM
                //planet
                d3.select(this).attr("transform", "translate("+(d.x) +"," +(d.y) +")");

                onDrag.call(this, e, { ...d, targetDate, yPC, unaligned:true })

            }

            //note: newX and Y should be stored as d.x and d.y
            function onPlanetDragEnd(e, d){
                //if(!wasMoved){
                    //onPlanetClick.call(planetG.node(), e, d)
                    //return;
                //}

                onDragEnd.call(this, e, d);
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
                        .attr("x1", e.sourceEvent.offsetX - timeScale(d.displayDate))
                        .attr("y1", e.sourceEvent.offsetY - yScale(d.yPC))
                        .attr("x2", e.sourceEvent.offsetX - timeScale(d.displayDate))
                        .attr("y2", e.sourceEvent.offsetY - yScale(d.yPC))
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
                const availablePlanets = planetsData
                    .filter(p => p.id !== d.id)
                    .filter(p => !linksData.find(l => l.id.includes(d.id) && l.id.includes(p.id)))
                    .map(p => ({ ...p, x:timeScale(p.displayDate), y:yScale(p.yPC)}))

                const nearestPlanet = findNearestPlanet(e, availablePlanets);
                //console.log("near", nearestPlanet)
                const linkPlanet = distanceBetweenPoints(e, nearestPlanet) <= LINK_THRESHOLD ? nearestPlanet : undefined;
                //const { x, y, ...rest } = linkPlanet
                //console.log("link", rest)
                linkPlanets = linkPlanet ? [d, linkPlanet] : [];

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
    planets.addLink = function (value) {
        if (!arguments.length) { return addLink; }
        if(typeof value === "function"){
            addLink = value;
        }
        return planets;
    };
    return planets;
}
