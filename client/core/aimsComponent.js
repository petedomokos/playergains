import * as d3 from 'd3';
//import "d3-selection-multi";
import { calcTrueX, calcAdjX, findPointChannel, findDateChannel, findNearestChannelByEndDate,
    calcChartHeight, findFuturePlanets, findFirstFuturePlanet, findNearestDate, getTransformationFromTrans } from './helpers';
//import { COLOURS, DIMNS } from "./constants";
import { addWeeks } from "../util/TimeHelpers"
import { ellipse } from "./ellipse";
import { grey10, COLOURS, DIMNS } from "./constants";
import { findNearestPlanet, distanceBetweenPoints, channelContainsPoint, channelContainsDate } from './geometryHelpers';
import { OPEN_CHANNEL_EXT_WIDTH } from './constants';
import dragEnhancements from './enhancedDragHandler';
import { timeMonth, timeWeek } from "d3-time";
import menuComponent from './menuComponent';
import planetsComponent from './planetsComponent';
import { pointIsInRect } from "./geometryHelpers";
//import "snapsvg-cjs";
/*

*/
export default function aimsComponent() {
    // dimensions
    let width = 800;
    let height = 600;

    let defaultNameSettings = {
        fontSize: 7,
        width: 100,
        height: 20,
        margin:{ left: 5, right: 5, top:3, bottom: 3 }
    }
    let nameSettings = d => defaultNameSettings;

    let planetFontSize = 6;

    let timeScale = x => 0;
    let yScale = x => 0;

    let selectedAim;
    let selectedGoal;
    let selectedLink;
    let selectedMeasure;

    let prevData = [];
    let linksData = [];
    let channelsData = [];
    //contents to show can be none, nameOnly, "basic", "all".
    let contentsToShow = aim => "basic";
    let goalContentsToShow = goal => "basic";

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
    let onClickName = function(){};
    let onClickGoal = function(){};
    let onDragGoalStart = function() {};
    let onDragGoal = function() {};
    let onDragGoalEnd = function() {};
    let onMouseoverGoal = function(){};
    let onMouseoutGoal = function(){};

    let onResizeDragEnd = function() {};

    let deletePlanet = function(){};
    let updatePlanet = function(){};
    let onAddLink = function(){};
    let startEditPlanet = function(){};
    let convertGoalToAim = function(){};

    let onDeleteAim = function() {};

    let withClick = dragEnhancements();

    //components
    let planets = {};
    let menus = {};
    let menuOptions = (d) => {
        const basicOpts = [
            { key: "delete", label:"Delete" }
        ]
        return basicOpts;
    };

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
            //console.log("aims", data)
            containerG = d3.select(this);
            const aimG = containerG.selectAll("g.aim").data(data, d => d.id);
            aimG.enter()
                .append("g")
                    .attr("class", d => "aim aim-"+d.id)
                    .each(function(d){
                        const titleWidth = 100;
                        const titleHeight = 20;
                        const aimG = d3.select(this);

                        const controlledContentsG = aimG.append("g").attr("class", "controlled-contents");
                        const dragHandlesG = aimG.append("g").attr("class", "drag-handles")

                        controlledContentsG
                            .append("rect")
                                .attr("class", "bg")
                                .attr("rx", 15)
                                .attr("stroke", "none")
                                .attr("display", d.id === "main" ? "none" : null)
                                .attr("fill", d.colour || "transparent")
                                //.attr("pointer-events", d.id === "main" ? "none" : "all")
                                .attr("fill-opacity", 0.15);

                        const titleG = controlledContentsG.append("g").attr("class", "title");
                        titleG.append("rect").attr("class", "bg");
                        titleG
                            .append("text")
                                .attr("class", "main")
                                .attr("dominant-baseline", "central")
                                .attr("stroke", grey10(1))
                                .attr("stroke-width", 0.1);
                        
                        //components        
                        planets[d.id] = planetsComponent();
                        menus[d.id] = menuComponent();
                    })
                    .merge(aimG)
                    .each(function(d){
                        const aimG = d3.select(this);
                        const controlledContentsG = aimG.select("g.controlled-contents")
                            .attr("transform", "translate(" + (d.displayX) +"," + d.y +")")
                            .call(drag);

                        //hide contents if necc eg if aim form open
                        controlledContentsG.select("text.name").attr("display", contentsToShow(d) === "none" ? "none" : null);
                        
                        //drag handlers must not be in controlled components else they will be moved during the drag, causing a flicker
                        const dragHandlesG = aimG.select("g.drag-handles")
                            .attr("transform", "translate(" + (d.displayX) +"," + d.y +")")

                        //bg
                        controlledContentsG.selectAll("rect.bg")
                            .attr("width", d.displayWidth)
                            .attr("height", d.height);
                            
                        //title
                        const name = nameSettings(d);
                        const titleG = controlledContentsG.select("g.title")
                            .attr("transform", "translate(" + name.margin.left + "," +name.margin.top +")")
                            .attr("cursor", "pointer")
                            .call(d3.drag()) //need drag just to prevent canvas receiving the click - dont know why
                            .on("click", onClickName)
                        
                        titleG.select("rect.bg")
                            .attr("width", name.contentsWidth)
                            .attr("height", name.contentsHeight)
                            .attr("fill", "transparent");

                        titleG.select("text.main")
                            .attr("x", 5)
                            .attr("y", name.contentsHeight / 2)
                            .attr("font-size", name.fontSize)
                            .text(d.name || (d.id === "main" ? "unnamed canvas" : "unnamed group"))

                        //resize handle
                        //note - d is aim
                        const resizeDrag = d3.drag()
                            .on("start", function(e, resizeD) { resizeDragStart.call(this.parentNode.parentNode, e, resizeD.loc, d); })
                            .on("drag", function(e, resizeD) { resizeDragged.call(this.parentNode.parentNode, e, resizeD.loc, d); })
                            .on("end", function(e, resizeD) { resizeDragEnd.call(this.parentNode.parentNode, e, d); })

                        const handleWidth = d3.min([d3.max([d.width * 0.1, d.height * 0.1, 12.5]), 25]);
                        const handleHeight = handleWidth;
                        const resizeData = [
                            //{ x: 0, y: 0 },
                            { loc:"top-left", x: -handleWidth * 0.33, y: -handleHeight * 0.33 }, 
                            { loc:"top-right", x: d.displayWidth - handleWidth * 0.66, y: -handleHeight * 0.33 }, 
                            { loc:"bot-right", x: d.displayWidth - handleWidth * 0.66, y: d.height - handleHeight * 0.66 }, 
                            { loc:"bot-left", x: -handleWidth * 0.33, y: d.height - handleHeight * 0.66}
                        ];

                        const resizeG = dragHandlesG.selectAll("g.resize").data(d.id === "main" ? [] : resizeData);
                        resizeG.enter()
                            .append("g")
                                .attr("class", "resize")
                                .each(function(d, i){
                                    d3.select(this)
                                        .append("rect")
                                            .attr("fill", "transparent")
                                            .attr("stroke", grey10(4))
                                            .attr("stroke-width", 0.4)
                                            .attr("stroke-dasharray", 1)
                                            .style("cursor", "pointer")
                                            .attr("opacity", 0)
                                            .on("mouseover", function(){ d3.select(this).attr("opacity", 1); })
                                            .on("mouseout", function(){ d3.select(this).attr("opacity", 0); });
                                })
                                .merge(resizeG)
                                .attr("transform", d => "translate("+d.x +"," +d.y +")")
                                .each(function(){
                                    d3.select(this).select("rect")
                                        .attr("width", handleWidth)
                                        .attr("height", handleHeight)
                                })
                                .call(resizeDrag)
                        
                        function resizeDragStart(e, d){
                            d3.select(this).select("g.drag-handles").attr("opacity", 0)
                        }

                        function resizeDragged(e, loc, aim){
                            if(loc === "top-left"){
                                //reduce width (but dx < 0 this will be an increase) and increase x pos (which is decrease if dx < 0)
                                //aim.displayWidth -= e.dx;
                                aim.displayX += e.dx;
                                //reduce height (but dy < 0 this will be an increase) and increase y pos (which is decrease if dy < 0)
                                //aim.height -= e.dy;
                                aim.y += e.dy;

                            } else if(loc === "top-right"){
                                //increase width only
                                aim.displayWidth += e.dx;
                                //reduce height (but dy < 0 this will be an increase) and increase y pos (which is decrease if dy < 0)
                                aim.height -= e.dy;
                                aim.y += e.dy;

                            } else if(loc === "bot-right"){
                                //increase width and height only
                                aim.displayWidth += e.dx;
                                aim.height += e.dy;

                            } else {
                                //bot-left
                                //reduce width (but dx < 0 this will be an increase) and increase x pos (which is decrease if dx < 0)
                                aim.displayWidth -= e.dx;
                                aim.displayX += e.dx;
                                //increase height only
                                aim.height += e.dy;

                            }

                            //dom
                            // note - we will get flickering if we move the drag handle during the drag.
                            d3.select(this).select("g.controlled-contents")
                                .attr("transform", "translate(" + (aim.displayX) +"," + aim.y +")");

                            d3.select(this).select("g.controlled-contents").select("rect")
                                .attr("width", aim.displayWidth)
                                .attr("height", aim.height);
                            
                            d3.select(this).call(updateAimGoals, aim);
                        }

                        function resizeDragEnd(e, d){
                            d3.select(this).select("g.drag-handles").attr("opacity", 1)
                            //d.planets were not updated in dragged so need to pass the planetDs from dom
                            const planetDs = d3.select(this).selectAll("g.planet").data();
                            onResizeDragEnd.call(this, e, d, planetDs);
                        }

                        //planets
                        //todo - find out why all the d values that were updated in onResizeDragEnd are undefined
                        const planetsG = aimG.selectAll("g.planets").data([d.planets]);
                        planetsG.enter()
                            .append("g") // @todo - chqnge to insert so its before resize and drag handles so they arent blocked
                                .attr("class", "planets planets-"+d.id)
                                .merge(planetsG)
                                .call(planets[d.id]
                                    .colours({ planet: d.colour || COLOURS.planet })
                                    .contentsToShow(goalContentsToShow)
                                    .selected(selectedGoal)
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
                                    .onAddLink(onAddLink)
                                    .updatePlanet(updatePlanet)
                                    .deletePlanet(deletePlanet)
                                    .onAddLink(onAddLink)
                                    .startEditPlanet(startEditPlanet)
                                    .convertToAim(convertGoalToAim), 
                                    options.planets);
                            
                        planetsG.exit().remove();

                        //menu
                        const menuG = controlledContentsG.selectAll("g.menu").data(selectedAim?.id === d.id ? [menuOptions(d)] : [], opt => opt.key);
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
                            .attr("transform", "translate(" +DIMNS.form.single.width/2 +"," + -20 +")")
                            .call(menus[d.id]
                                .onClick((opt) => {
                                    switch(opt.key){
                                        case "delete": { 
                                            onDeleteAim.call(this, d.id);
                                            break;
                                        };
                                        default:{};
                                    }
                                }))
    
                        let removingMenu = false;
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

                    });

            aimG.exit().remove();

            prevData = data;
        })

        function updateAimGoals(containerG, aim){
            containerG.selectAll("g.planet")
                .each(function(planet){
                    if(pointIsInRect(planet, { x: aim.displayX, y:aim.y, width: aim.displayWidth, height:aim.height })){
                        //set the aim id
                        planet.aimId = aim.id;
                    }else if(planet.aimId === aim.id){
                        //remove the aim id
                        planet.aimId = undefined;
                    }

                    //dom - update in this aim or left this aim
                    const coreEllipse = d3.select(this).select("ellipse.core");
                    if(planet.aimId === aim.id){ coreEllipse.attr("fill", aim.colour || COLOURS.planet); }
                    if(!planet.aimId){ coreEllipse.attr("fill", COLOURS.planet); }
                })
        }

        function updateGoalAim(planetG, planet){
            const newAim = prevData
                .filter(a => a.id !== "main")
                .find(a => pointIsInRect(planet, { x: a.displayX, y:a.y, width: a.displayWidth, height:a.height }))
            
            if(newAim?.id !== planet.aimId){
                planet.aimId = newAim?.id;
                //@todo - think about how .colours is used, rather tan doing it manually here again

                //dom
                planetG.select("ellipse.core")
                    .attr("fill", newAim?.colour || COLOURS.planet);
            }
        }

        function dragGoalStart(e , d){
            //const s = Snap(this);
            //console.log("bbox", s.getBBox())
            //works - will use the inner circle
            d3.select(this).raise();
            //note - called on click too - could improve enhancedDrag by preveting dragStart event
            //until a drag event has also been recieved, so stroe it and then release when first drag event comes through
            onDragGoalStart.call(this, e, d)

        }
        function draggedGoal(e , d, shouldUpdateSelected){
            d.x += e.dx;
            d.y += e.dy;

            d3.select(this)
                .attr("transform", "translate("+(d.x) +"," +(d.y) +")")
                .call(updateGoalAim, d);

            //obv need to tidy up teh way trueX is added in planetslayout too
            //but first look at why link line
            //becomes short and what happens to bar charts
            const targetDate = timeScale.invert(d.channel.trueX(d.x))
            const yPC = yScale.invert(d.y)

            onDragGoal.call(this, e, { ...d, targetDate, yPC, unaligned:true }, shouldUpdateSelected)
        }
        function dragGoalEnd(e, d){
            onDragGoalEnd.call(this, e, d);
        }

        function dragStart(e , d){
            //console.log("drag aim start", this)
            d3.select(this.parentNode).raise();

            //onDragStart does nothing
            onDragStart.call(this, e, d)
        }
        function dragged(e , d){
            //rect
            d.displayX += e.dx;
            d.y += e.dy;
            d3.select(this).attr("transform", "translate(" + d.displayX +"," + d.y +")")
            
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
    aims.nameSettings = function (f) {
        if (!arguments.length) { return nameSettings; }
        nameSettings = d => { 
            const settings = { ...defaultNameSettings, ...f(d) };
            return {
                ...settings,
                contentsWidth: settings.width - settings.margin.left - settings.margin.right,
                contentsHeight: settings.height - settings.margin.top - settings.margin.bottom,
            }
        }
        return aims;
    };
    aims.planetFontSize= function (value) {
        if (!arguments.length) { return planetFontSize; }
        planetFontSize = value;
        return aims;
    };
    aims.contentsToShow = function (value) {
        if (!arguments.length) { return contentsToShow; }
        contentsToShow = value;
        return aims;
    };
    aims.goalContentsToShow = function (value) {
        if (!arguments.length) { return goalContentsToShow; }
        goalContentsToShow = value;
        return aims;
    };
    aims.selectedMeasure = function (value) {
        if (!arguments.length) { return selectedMeasure; }
        selectedMeasure = value;
        return aims;
    };
    aims.selected = function (value) {
        if (!arguments.length) { return { selectedAim, selectedGoal }; }
        if(value?.dataType === "aim"){
            selectedAim = value;
            selectedGoal = undefined;
            selectedLink = undefined;
        }else if(value?.dataType === "planet"){
            selectedAim = undefined;
            selectedGoal = value;
            selectedLink = undefined;
        }else if(value?.dataType === "link"){
            selectedAim = undefined;
            selectedGoal = undefined;
            selectedLink = value;
        }else{
            //reset as no value
            selectedAim = undefined;
            selectedGoal = undefined;
            selectedLink = undefined;

        }
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
    aims.onClickName = function (value) {
        if (!arguments.length) { return onClickName; }
        onClickName = value;
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
    aims.onResizeDragEnd = function (value) {
        if (!arguments.length) { return onResizeDragEnd; }
        if(typeof value === "function"){
            onResizeDragEnd = value;
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
    aims.onDeleteAim = function (value) {
        if (!arguments.length) { return onDeleteAim; }
        if(typeof value === "function"){
            onDeleteAim = value;
        }
        return aims;
    };
    aims.onAddLink = function (value) {
        if (!arguments.length) { return onAddLink; }
        if(typeof value === "function"){
            onAddLink = value;
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
    //functions
    aims.showAvailabilityStatus = function (goals, cb) {
        goals.forEach(g => { planets[g.aimId || "main"].showAvailabilityStatus(g, cb); });
        return aims;
    };
    aims.stopShowingAvailabilityStatus = function (goals, cb) {
        goals.forEach(g => { planets[g.aimId || "main"].stopShowingAvailabilityStatus(g, cb); });
        return aims;
    };
    return aims;
}
