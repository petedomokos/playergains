import * as d3 from 'd3';
//import "d3-selection-multi";
import { calcTrueX, calcAdjX, findPointChannel, findDateChannel, findNearestChannelByEndDate,
    calcChartHeight, findFuturePlanets, findFirstFuturePlanet, findNearestDate, getTransformationFromTrans } from './helpers';
//import { COLOURS, DIMNS } from "./constants";
import { addWeeks } from "../util/TimeHelpers"
import { ellipse } from "./ellipse";
import { grey10, COLOURS } from "./constants";
import { findNearestPlanet, distanceBetweenPoints, channelContainsPoint, channelContainsDate } from './geometryHelpers';
import { OPEN_CHANNEL_EXT_WIDTH } from './constants';
import dragEnhancements from './enhancedDragHandler';
import { timeMonth, timeWeek } from "d3-time";
import menuComponent from './menuComponent';
import planetsComponent from './planetsComponent';
/*

*/
export default function aimsComponent() {
    // dimensions
    let width = 800;
    let height = 600;

    let aimMargin = { left: 5, right:5, top: 5, bottom: 5 };
    let planetFontSize = 6;

    let timeScale = x => 0;
    let yScale = x => 0;
    let selectedMeasure;

    let prevData = [];
    let linksData = [];
    let channelsData = [];

    //handlers
    let onClick = function(){};
    let onDragStart = function() {};
    let onDrag = function() {};
    let onDragEnd = function() {};
    let onMouseover = function(){};
    let onMouseout = function(){};
    let onClickGoal = function(){};
    let onDragGoalStart = function() {};
    let onDragGoal = function() {};
    let onDragGoalEnd = function() {};
    let onMouseoverGoal = function(){};
    let onMouseoutGoal = function(){};

    let deletePlanet = function(){};
    let updatePlanet = function(){};
    let addLink = function(){};
    let startEditPlanet = function(){};
    let convertGoalToAim = function(){};

    let withClick = dragEnhancements();

    //components
    let planets = {};
    let menus = {};
    let menuOptions = [
        { key: "edit", label:"Edit" },
        { key: "delete", label:"Delete" }
    ];

    //dom
    let containerG;

    function aims(selection, options={}) {
        withClick.onClick(onClick)
        const drag = d3.drag()
            .filter((e,d) => d.id !== "main")
            .on("start", withClick(dragStart))
            .on("drag", withClick(dragged))
            .on("end", withClick(dragEnd));
        // expression elements
        selection.each(function (data) {
            console.log("aims", data)
            containerG = d3.select(this);
            const aimG = containerG.selectAll("g.aim").data(data);
            aimG.enter()
                .append("g")
                    .attr("class", d => "aim aim-"+d.id)
                    .each(function(d){
                        const aimG = d3.select(this);

                        const controlledContentsG = aimG.append("g").attr("class", "controlled-contents");
                        controlledContentsG
                            .append("rect")
                                .attr("stroke", "none")
                                .attr("fill", d.colour || "transparent")
                                .attr("fill-opacity", 0.3);

                        const titleG = controlledContentsG.append("g").attr("class", "title");
                        titleG
                            .append("text")
                                .attr("class", "main")
                                .attr("font-size", d.id === "main" ? 8 : 6)
                                .attr("stroke", grey10(2))
                                .attr("stroke-width", 0.1)
                        
                        planets[d.id] = planetsComponent();

                    })
                    .merge(aimG)
                    .each(function(d){
                        const aimG = d3.select(this);
                        const controlledContentsG = aimG.select("g.controlled-contents")
                            .attr("transform", "translate(" + d.x +"," + d.y +")")
                            .call(drag);

                        //bg
                        aimG.select("rect")
                            .attr("width", d.width)
                            .attr("height", d.height)

                        //title
                        const titleG = controlledContentsG.select("g.title")
                            .attr("transform", "translate(" + (d.id === "main" ? 40 : 5) + "," + (d.id === "main" ? 15 : 7.5) +")")
                        
                        titleG.select("text.main")
                            .text(d.name || (d.id === "main" ? "unnamed canvas" : "unnamed group"))

                        const planetsG = aimG.selectAll("g.planets").data([d.planets]);
                        planetsG.enter()
                            .append("g")
                                .attr("class", "planets planets-"+d.id)
                                .merge(planetsG)
                                .call(planets[d.id]
                                    .colours({ planet: d.colour || COLOURS.planet })
                                    .selectedMeasure(selectedMeasure)
                                    .channelsData(channelsData) 
                                    .linksData(linksData) 
                                    .timeScale(timeScale)
                                    .yScale(yScale)
                                    .fontSize(planetFontSize)

                                    .onClick(onClickGoal)
                                    .onDragStart(dragGoalStart)
                                    .onDrag(draggedGoal)
                                    .onDragEnd(dragGoalEnd)

                                    .onMouseover(onMouseoverGoal)
                                    .onMouseout(onMouseoutGoal)
                                    .addLink(addLink)
                                    .updatePlanet(updatePlanet)
                                    .deletePlanet(deletePlanet)
                                    .addLink(addLink)
                                    .startEditPlanet(startEditPlanet)
                                    .convertToAim(convertGoalToAim), 
                                    options.planets)
                            
                        planetsG.exit().remove();

                    });

            aimG.exit().remove();

            prevData = data;
        })

        function dragGoalStart(e , d){
            d3.select(this).raise();
            //note - called on click too - could improve enhancedDrag by preveting dragStart event
            //until a drag event has also been recieved, so stroe it and then release when first drag event comes through
            onDragGoalStart.call(this, e, d)

        }
        function draggedGoal(e , d, shouldUpdateSelected){
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

            onDragGoal.call(this, e, { ...d, targetDate, yPC, unaligned:true }, shouldUpdateSelected)
        }
        function dragGoalEnd(e, d){
            onDragGoalEnd.call(this, e, d);
        }

        function dragStart(e , d){
            d3.select(this).raise();

            //onDragStart does nothing
            onDragStart.call(this, e, d)
        }
        function dragged(e , d){
            //rect
            d.x += e.dx;
            d.y += e.dy;
            d3.select(this).attr("transform", "translate(" + d.x +"," + d.y +")")
            
            //goals

            d3.select(this.parentNode).selectAll("g.planet")
                .each(function(planetD){
                    planetD.x += e.dx;
                    planetD.y += e.dy;
                    d3.select(this).attr("transform", "translate(" + planetD.x +"," + planetD.y +")")

                })
    
            //onDrag does nothing
            onDrag.call(this, e, d)
        }

        //note: newX and Y should be stored as d.x and d.y
        function dragEnd(e, d){
            if(withClick.isClick()) { return; }

            onDragEnd.call(this, e, d);
        }

        return selection;
    }

    //api
    aims.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        return aims;
    };
    aims.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        return aims;
    };
    aims.aimMargin = function (value) {
        if (!arguments.length) { return aimMargin; }
        aimMargin = { ...aimMargin, ...value};
        return aims;
    };
    aims.planetFontSize= function (value) {
        if (!arguments.length) { return planetFontSize; }
        planetFontSize = value;
        return aims;
    };
    aims.selectedMeasure = function (value) {
        if (!arguments.length) { return selectedMeasure; }
        selectedMeasure = value;
        return aims;
    };
    aims.withRing = function (value) {
        if (!arguments.length) { return withRing; }
        withRing = value;
        containerG.call(aims);
    
        return aims;
    };
    aims.channelsData = function (value) {
        if (!arguments.length) { return channelsData; }
        channelsData = value;
        //updateChannelsData(value); for helper fuctins that use channels eg adjX in planetsComponent
        //@todo - probably makes more sense to update these funciton sonce in journeyComponent
        return aims;
    };
    aims.linksData = function (value) {
        if (!arguments.length) { return linksData; }
        linksData = value;
        return aims;
    };
    aims.yScale = function (value) {
        if (!arguments.length) { return yScale; }
        yScale = value;
        return aims;
    };
    aims.timeScale = function (value) {
        if (!arguments.length) { return timeScale; }
        timeScale = value;
        return aims;
    };
    aims.onClick = function (value) {
        if (!arguments.length) { return onClick; }
        onClick = value;
        return aims;
    };
    aims.onDragStart = function (value) {
        if (!arguments.length) { return onDragStart; }
        if(typeof value === "function"){
            onDragStart = value;
        }
        return aims;
    };
    aims.onDrag = function (value) {
        if (!arguments.length) { return onDrag; }
        if(typeof value === "function"){
            onDrag = value;
        }
        return aims;
    };
    aims.onDragEnd = function (value) {
        if (!arguments.length) { return onDragEnd; }
        if(typeof value === "function"){
            onDragEnd = value;
        }
        return aims;
    };
    aims.onMouseover = function (value) {
        if (!arguments.length) { return onMouseover; }
        if(typeof value === "function"){
            onMouseover = value;
        }
        return aims;
    };
    aims.onMouseout = function (value) {
        if (!arguments.length) { return onMouseout; }
        if(typeof value === "function"){
            onMouseout = value;
        }
        return aims;
    };
    aims.onClickGoal = function (value) {
        if (!arguments.length) { return onClickGoal; }
        onClickGoal = value;
        return aims;
    };
    aims.onDragGoalStart = function (value) {
        if (!arguments.length) { return onDragGoalStart; }
        if(typeof value === "function"){
            onDragGoalStart = value;
        }
        return aims;
    };
    aims.onDragGoal = function (value) {
        if (!arguments.length) { return onDragGoal; }
        if(typeof value === "function"){
            onDragGoal = value;
        }
        return aims;
    };
    aims.onDragGoalEnd = function (value) {
        if (!arguments.length) { return onDragGoalEnd; }
        if(typeof value === "function"){
            onDragGoalEnd = value;
        }
        return aims;
    };
    aims.onMouseoverGoal = function (value) {
        if (!arguments.length) { return onMouseoverGoal; }
        if(typeof value === "function"){
            onMouseover = value;
        }
        return aims;
    };
    aims.onMouseoutGoal = function (value) {
        if (!arguments.length) { return onMouseoutGoal; }
        if(typeof value === "function"){
            onMouseoutGoal = value;
        }
        return aims;
    };
    aims.deletePlanet = function (value) {
        if (!arguments.length) { return deletePlanet; }
        if(typeof value === "function"){
            deletePlanet = value;
        }
        return aims;
    };
    aims.updatePlanet = function (value) {
        if (!arguments.length) { return updatePlanet; }
        if(typeof value === "function"){
            updatePlanet = value;
        }
        return aims;
    };
    aims.addLink = function (value) {
        if (!arguments.length) { return addLink; }
        if(typeof value === "function"){
            addLink = value;
        }
        return aims;
    };
    aims.startEditPlanet = function (value) {
        if (!arguments.length) { return startEditPlanet; }
        if(typeof value === "function"){
            startEditPlanet = value;
        }
        return aims;
    };
    aims.convertGoalToAim = function (value) {
        if (!arguments.length) { return convertGoalToAim; }
        if(typeof value === "function"){
            convertGoalToAim = value;
        }
        return aims;
    };
    return aims;
}
