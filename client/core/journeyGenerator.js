import { ContactsOutlined } from '@material-ui/icons';
import * as d3 from 'd3';
import barChartGenerator from "./barChartGenerator";
import { calcPlanetHeight, calcChartHeight, findFuturePlanets, findFirstFuturePlanet, linearProjValue, getTransformation } from './helpers';
//import { COLOURS, DIMNS } from "./constants";
import { addWeeks, addYear } from "../util/TimeHelpers"
import { times } from 'lodash';

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

    //functions
    let barCharts = {};

    //dom
    let svg;
    let contentsG;
    let canvasG;
    let canvasRect;

    function journey(selection) {
        updateDimns();
        // expression elements
        selection.each(function (data) {
            console.log("journey", data);
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
                const initDY = -d3.sum(findFuturePlanets(data)
                    .filter(p => p.id !== findFirstFuturePlanet(data)?.id)
                    .map(p => p.isOpen ? planetHeight + chartHeight : planetHeight))

                const initT = d3.zoomIdentity.translate(initDX, initDY);
                //@todo - need to understand why we need to apply this to contentsG,
                // and why if its canvasG then it jumps back to top when user first scrolls
                contentsG.call(zoom.transform, initT)

                canvasRect = canvasG
                    .append("rect")
                        .attr("width", canvasWidth)
                        .attr("height", canvasHeight)
                        .attr("fill", "#FAEBD7");
                
            }
            //scale
            const now = new Date();
            const xExtent = [d3.min(data, d => d.targetDate), d3.max(data, d => d.targetDate)]
            const timeScale = d3.scaleTime()
                .domain([addWeeks(-4, now), d3.max([xExtent[1], addYear(1, now)])])
                .range([0, contentsWidth])
            //axis
            const axis = d3.axisBottom()
                .scale(timeScale)
                .tickSize(contentsHeight + 6)
                .tickSize(contentsHeight - 25)
                //.tickPadding(3);
            const axisG = svg.selectAll("g.xAxisG").data([1])

            //yscale
            //no need to invert as y position in this case is distance from top of screen
            //@todo - add anti-collision force or function
            const yScale = d3.scaleLinear().domain([0, 100]).range([margin.top, margin.top + contentsHeight])


            axisG
                .enter()
                .append("g")
                    .attr("class", "axisG xAxisG")
                    .each(function(){
                        d3.select(this)
                            .style("stroke-width", 0.05)
                            .style("stroke", "black")
                            .style("opacity", 0.5);
                        
                        d3.select(this).selectAll('text')
                            .attr('transform', 'translate(15,15) rotate(45) ');
                    })
                    .call(axis)
                    .merge(axisG)
                    .attr("transform", 'translate(0,' +margin.top +')')
                    .each(function(){
                        d3.select(this).select(".domain")
                            .attr("transform", 'translate(0,' +(contentsHeight - 30) +')')
                        
                        //d3.select(this).selectAll("text")
                            //.attr("transform", 'translate(0,' +(contentsHeight - 30) +')')
                    });

            //update click listener
            contentsG.on("click", function(e){
                console.log("click") this shouldnt be called if planet clicked
                addPlanet(timeScale.invert(e.clientX - margin.left), yScale.invert(e.clientY - margin.top))
            })

            const planetDrag = d3.drag()
                .on("start", planetDragStart)
                .on("drag", planetDragged)
                .on("end", planetDragEnd);
            
            const planetsG = canvasG.selectAll("g.planets").data([1])
            planetsG.enter()
                .append("g")
                .attr("class", "planets")
                .merge(planetsG)
                //.attr("transform", "translate("+(canvasWidth/2) +",0)")
                //.attr("transform", "translate("+(width/2) +"," +margin.top +")")
                .each(function(){;
                    const planetG = d3.select(this).selectAll("g.planet").data(data);
                    planetG.enter()
                        .append("g")
                        .attr("class", "planet")
                        .attr("transform", d => "translate(" +timeScale(d.targetDate) +"," +yScale(d.yPC) +")")
                        .each(function(d,i){

                            const ellipseWidth = planetContentsWidth * 0.8;
                            const ellipseHeight = planetContentsHeight * 0.8;
                            const planetContentsG = d3.select(this)
                                .append("g")
                                .attr("class", "contents")
                                //.attr("transform", "translate("+planetMargin.left +"," +planetMargin.top +")");

                            //ellipse
                            planetContentsG
                                .append("ellipse")
                                    .attr("rx", ellipseWidth/2)
                                    .attr("ry", ellipseHeight/2)
                                    .attr("stroke", "black")
                                    .attr("fill", "#C0C0C0")
                                    .attr("stroke", "grey")
                            
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
                            const planetContentsG = d3.select(this).select("g.contents")
                            //planet text
                            planetContentsG.select("text").text(d.title || "enter name...")

                        })
                        .call(planetDrag);
                })

                let wasMoved = false;
                function planetDragStart(e,d){

                }
                function planetDragged(e,d){
                    const { translateX, translateY }= getTransformation(d3.select(this).attr("transform"))
                    d3.select(this).attr("transform", "translate("+(translateX +e.dx) +"," +(translateY +e.dy) +")")
                }
                function planetDragEnd(e, d){
                    if(!wasMoved){
                        handlePlanetClick.call(this, e, d)
                        return;
                    }
                    //update state
                    const { translateX, translateY }= getTransformation(d3.select(this).attr("transform"))
                    updatePlanet({ ...d, targetDate:timeScale.invert(translateX), yPC:yScale.invert(translateY) });
                }

                function handlePlanetClick(e,d){
                    console.log("opening planet form ", d)
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