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

    let timeScale = x => 0;
    let yScale = x => 0;

    let prevData = [];

    //handlers
    let onDragStart = function() {};
    let onDrag = function() {};
    let onDragEnd = function() {};
    let onMouseover = function(){};
    let onMouseout = function(){};

    //api
    let addLink = function(){};
    let onClick = function(){};

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
            console.log("update aims", data)
            containerG = d3.select(this);
            const aimG = containerG.selectAll("g.aim").data(data);
            aimG.enter()
                .append("g")
                    .attr("class", "aim")
                    .each(function(d){
                        const aimG = d3.select(this);

                        aimG.append("rect")
                            .attr("stroke", "grey")
                            .attr("fill", "transparent");
                        
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

                        //todo - find out why planets are being rendered too big - 
                        //it must be todo with zoom scale or scale or something


                        const planetsG = aimG.selectAll("g.planets").data([d.planets]);
                        planetsG.enter()
                            .append("g")
                                .attr("class", "planets planets-"+d.id)
                                .merge(planetsG)
                                .call(planets[d.id], options.planets)

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
    aims.addLink = function (value) {
        if (!arguments.length) { return addLink; }
        if(typeof value === "function"){
            addLink = value;
        }
        return aims;
    };
    return aims;
}
