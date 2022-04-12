import * as d3 from 'd3';
//import "d3-selection-multi";
import { getGoalsData } from '../data/planets'
import barChartLayout from "./barChartLayout";
import barChart from "./barChartComponent";
import { calcChartHeight, findFuturePlanets, findFirstFuturePlanet, findNearestDate, getTransformation } from './helpers';
//import { COLOURS, DIMNS } from "./constants";
import { addWeeks } from "../util/TimeHelpers"
import { ellipse } from "./ellipse";
import { grey10 } from "./constants";
import { findNearestPlanet, distanceBetweenPoints, angleOfRotation } from './geometryHelpers';
import { OPEN_CHANNEL_EXT_WIDTH } from './constants';
import dragEnhancements from './enhancedDragHandler';
import { timeMonth, timeWeek } from "d3-time"
import menuComponent from './menuComponent';
/*

*/
export default function linksComponent() {
    // dimensions
    let barChartSettings = {
        width:100,
        height: 100
    }

    let timeScale = x => 0;
    let yScale = x => 0;
    let strokeWidth = 1;

    let linksData = [];
    let withCompletion = true;

    //functions
    let deleteLink = function (){}
    let onClick = function (){}

    //components
    let barCharts = {};
    let menus = {};
    let menuOptions = [
        { key: "delete", label:"Delete" }
    ];

    function links(selection, options={}) {
        const { transitionEnter, transitionUpdate } = options;

        selection.each(function (data) {
            //console.log("links", data);
            if(data){ linksData = data;}
           
            const linkG = d3.select(this).selectAll("g.link").data(linksData, l => l.id);
            linkG.enter()
                .append("g")
                    .attr("class", "link")
                    .attr("id", d => "link-"+d.id)
                    .attr("opacity", 1)
                    .each(function(d,i){
                        //ENTER
                        //line
                        d3.select(this)
                            .append("line")
                                .attr("class", "main")
                                .attr("stroke", grey10(5))
                                .attr("cursor", "pointer")
                                .attr("x1", d.src.x)
                                .attr("y1", d.src.y)
                                .attr("x2", d.targ.x)
                                .attr("y2", d.targ.y)
                        
                        //completion line
                        d3.select(this)
                            .append("line")
                                .attr("class", "completion")
                                .attr("display", withCompletion ? "inline" : "none")
                                .attr("stroke", "blue")
                                .attr("cursor", "pointer")
                                .attr("x1", d.src.x)
                                .attr("y1", d.src.y)
                                .attr("x2", d.compX)
                                .attr("y2", d.compY)

                        
                        //hitbox
                        d3.select(this)
                            .append("rect")
                            .attr("class", "hitbox")
                            .attr("stroke", "transparent")
                            .attr("fill", "transparent")
                            .style("cursor", "pointer")

                        //bar charts
                        barCharts[d.id] = barChart();

                        d3.select(this)
                            .append("g")
                                .attr("class", "bar-chart")
                                .attr("opacity", 0)
                                .attr("display", "none")
                        
                        //menu component
                        menus[d.id] = menuComponent();
                            
                    })
                    .merge(linkG)
                    .each(function(d){
                        //ENTER AND UPDATE
                        //console.log("centre x", d.centre[0])
                        //lines
                        d3.select(this).select("line.main")
                            .attr("stroke-width", strokeWidth)
                            .on("click", onClick)

                        d3.select(this).select("line.completion")
                            .attr("stroke-width", strokeWidth * 1.3)
                            .on("click", onClick)
                        
                        //hitbox
                        const hitboxWidth = 5;
                        d3.select(this).select("rect.hitbox")
                            .attr("transform", "rotate(" +d.rotation +" " +d.src.x +" " +d.src.y +")")
                            .attr("x", d.src.x)
                            .attr("y", d.src.y - hitboxWidth/2)
                            .attr("width", distanceBetweenPoints(d.src, d.targ))
                            .attr("height", hitboxWidth)
                            .on("click", onClick)

                        //about bar charts
                        //- they appear halfway up the link, so if link covers two channels, it will not be in same pos as a chart for a link covering one of the channels
                        //- if any channel that teh link covers is open, then the link chart show
                        const barChartG = d3.select(this).select("g.bar-chart");
                        barChartG
                            //.attr("display", d.isOpen ? "inline" : "none")
                            .datum(d.barChartData)
                            .call(barCharts[d.id]
                                .width(barChartSettings.width)
                                .height(barChartSettings.height)
                                .labelSettings(barChartSettings.label)
                            )
                            .attr("transform", "translate("+ (d.centre[0] - barChartSettings.width/2)+ "," + (d.centre[1]- barChartSettings.height/2) +")")

                        //fade in and out bar chart
                        if(d.isOpen && barChartG.attr("opacity") === "0"){
                            barChartG
                                .attr("display", "inline")
                                .transition()
                                .delay(100)
                                .duration(400)
                                .attr("opacity", 1)
                        }
                        if(!d.isOpen && barChartG.attr("opacity") === "1"){
                            //@todo - put transition back but mak eit synced with close channel transition so it doesnt jump
                            barChartG
                                //.transition()
                                //.delay(100)
                                //.duration(400)
                                .attr("opacity", 0)
                                .attr("display", "none")
                        }

                        //todo - transition the transform of barChartG when a planet is dragged
                    })
                    .each(function(d){
                        const menuG = d3.select(this).selectAll("g.menu").data(d.isSelected ? [menuOptions] : []);
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
                            .attr("transform", "translate(" +d.centre[0] + "," +(d.centre[1] - menus[d.id].optDimns().height/2) +")")
                            .call(menus[d.id]
                                .onClick((opt) => {
                                    switch(opt.key){
                                        case "delete": { deleteLink(d.id) };
                                        default:{};
                                    }
                                }))
    
                        menuG.exit().each(function(d){
                            //will be multiple exits because of the delay in removing
                            if(d3.select(this).attr("opacity") == 1){
                                d3.select(this)
                                    .transition()
                                        .duration(200)
                                        .attr("opacity", 0)
                                        .on("end", function() { d3.select(this).remove() });
                            }
                        }) 
                    })
                    .on("mousedown", e => { e.stopPropagation(); })

            //update only
            linkG.each(function(d){
                const mainLine = d3.select(this).select("line.main")
                const compLine = d3.select(this).select("line.completion")
                    .attr("display", withCompletion ? "inline" : "none")

                if(transitionUpdate){
                    mainLine
                        .transition()
                        .delay(50)
                        .duration(200)
                            .attr("x1", d.src.x)
                            .attr("y1", d.src.y)
                            .attr("x2", d.targ.x)
                            .attr("y2", d.targ.y)

                    compLine
                        .transition()
                        .delay(50)
                        .duration(200)
                            .attr("x1", d.src.x)
                            .attr("y1", d.src.y)
                            .attr("x2", d.compX)
                            .attr("y2", d.compY)
                }else{
                    mainLine
                        .attr("x1", d.src.x)
                        .attr("y1", d.src.y)
                        .attr("x2", d.targ.x)
                        .attr("y2", d.targ.y)
                    
                    compLine
                        .attr("x1", d.src.x)
                        .attr("y1", d.src.y)
                        .attr("x2", d.compX)
                        .attr("y2", d.compY)
                }
            })

            //EXIT
            linkG.exit().each(function(d){
                //will be multiple exits because of the delay in removing
                if(d3.select(this).attr("opacity") == 1){
                    d3.select(this)
                        .transition()
                            .duration(200)
                            .attr("opacity", 0)
                            .on("end", function() { d3.select(this).remove() });
                }
            }) 
        })

        return selection;
    }
    
    //helpers
    /*
    function updateSelected(id){
        console.log("updateSel", id)
        selected = id;
        menu.onClick((option) => {
            switch(option.key){
                case "delete": { deletePlanet(selected) };
                default:{};
            }
        });
    }
    */

    //api
    links.withCompletion = function (value) {
        if (!arguments.length) { return withCompletion; }
        withCompletion = value;
        return links;
    };
    links.yScale = function (value) {
        if (!arguments.length) { return yScale; }
        yScale = value;
        return links;
    };
    links.timeScale = function (value) {
        if (!arguments.length) { return timeScale; }
        timeScale = value;
        return links;
    };
    links.strokeWidth = function (value) {
        if (!arguments.length) { return strokeWidth; }
        strokeWidth = value;
        return links;
    };
    links.barChartSettings = function (value) {
        if (!arguments.length) { return barChartSettings; }
        barChartSettings = { ...barChartSettings, ...value};
        return links;
    };
    links.deleteLink = function (value) {
        if (!arguments.length) { return deleteLink; }
        if(typeof value === "function"){
            deleteLink = value;
        }
        return links;
    };
    links.onClick = function (value) {
        if (!arguments.length) { return onClick; }
        onClick = value;
        return links;
    };
    /*
    links.onPlanetDrag = function (e, d) {
        //src links
        d3.selectAll("g.link")
            .filter(l => l.src.id === d.id)
            .each(function(l){
                l.src.x = d.x;
                l.src.y = d.y;
                d3.select(this).select("line")
                    .attr("x1", l.src.x)
                    .attr("y1", l.src.y)
                
                 //bar pos
                d3.select(this).select("g.bar-chart")
                    //.attr("transform", )

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
        
        return links;
    }
    */
    return links;
};
