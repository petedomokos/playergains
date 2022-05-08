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
        // expression elements
        selection.each(function (data) {
            //console.log("aims", data)
            containerG = d3.select(this);
            const aimG = containerG.selectAll("g.aim").data(data);
            aimG.enter()
                .append("g")
                    .attr("class", d => "aim aim-"+d.id)
                    .each(function(d){
                        const aimG = d3.select(this);

                        aimG.append("rect")
                            .attr("stroke", grey10(9))
                            //.attr("fill", "transparent")
                            .attr("fill", d.id === "main" ? "transparent" : grey10(2));
                        
                        planets[d.id] = planetsComponent();

                    })
                    .merge(aimG)
                    .each(function(d){
                        const aimG = d3.select(this);

                        aimG.select("rect")
                            .attr("x", d.x)
                            .attr("y", d.y)
                            .attr("width", d.width)
                            .attr("height", d.height)

                        const planetsG = aimG.selectAll("g.planets").data([d.planets]);
                        planetsG.enter()
                            .append("g")
                                .attr("class", "planets planets-"+d.id)
                                .merge(planetsG)
                                .call(planets[d.id]
                                    .selectedMeasure(selectedMeasure)
                                    .channelsData(channelsData) 
                                    .linksData(linksData) 
                                    .timeScale(timeScale)
                                    .yScale(yScale)
                                    .fontSize(planetFontSize)
                                    .onClick(onClickGoal)
                                    .onDrag(onDragGoal)
                                    .onDragEnd(onDragGoalEnd)
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

                    })

            aimG.exit().remove();



            prevData = data;
        })

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
