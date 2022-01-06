import { ContactsOutlined } from '@material-ui/icons';
import * as d3 from 'd3';
import barChartGenerator from "./barChartGenerator";
import { calcPlanetHeight, calcChartHeight, findFuturePlanets, findFirstFuturePlanet, linearProjValue } from './helpers';
//import { COLOURS, DIMNS } from "./constants";

/*

*/
export default function journeyGenerator() {

    // dimensions
    let margin = {
        svg:{left:0, right:0, top: 0, bottom:0},
        planet:{left:5, right:5, top: 5, bottom:5},
    }
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
        contentsWidth = width - margin.svg.left - margin.svg.right;
        contentsHeight = height - margin.svg.top - margin.svg.bottom;
        canvasWidth = contentsWidth// * 5;
        canvasHeight = contentsHeight * 5; //this should be lrge enough for all planets, and rest can be accesed via pan

        planetWrapperWidth = contentsWidth - TIME_AXIS_WIDTH;
        //note - planetWrapperHeight depends on whether or not planet is active
        
        planetWidth = planetWrapperWidth;
        planetContentsWidth = planetWidth - margin.planet.left - margin.planet.right;
        planetHeight = calcPlanetHeight(height);
        planetContentsHeight = planetHeight - margin.planet.top - margin.planet.bottom;

        chartWidth = planetWrapperWidth;
        //we want enough space on screen for two planets and 1 chart
        chartHeight = calcChartHeight(height, planetHeight);
    };

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
                        console.log("e", e)
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
                        .attr("transform", "translate(" +margin.svg.left +"," +margin.svg.top +")")
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

            const planetsG = canvasG.selectAll("g.planets").data([1])
            planetsG.enter()
                .append("g")
                .attr("class", "planets")
                .merge(planetsG)
                //.attr("transform", "translate("+(canvasWidth/2) +",0)")
                //.attr("transform", "translate("+(width/2) +"," +margin.top +")")
                .each(function(){;
                    const planetWrapperG = d3.select(this).selectAll("g.planet-wrapper").data(data);
                    planetWrapperG.enter()
                        .append("g")
                        .attr("class", "planet-wrapper")
                        .each(function(d,i){
                            d3.select(this).append("rect")
                                .attr("width", planetWrapperWidth)
                                .attr("height", d => planetWrapperHeight(d.isOpen))
                                .attr("fill", "blue")
                                .attr("opacity", 0.5)

                            const wrapperContentsG = d3.select(this)
                                .append("g")
                                    .attr("class", "contents")

                            const ellipseWidth = planetContentsWidth * 0.8;
                            const ellipseHeight = planetContentsHeight * 0.8;

                            const planetG = wrapperContentsG
                                .append("g")
                                .attr("class", "planet")
                            
                            const planetContentsG = planetG
                                .append("g")
                                .attr("class", "contents")
                                .attr("transform", "translate("+margin.planet.left +"," +margin.planet.top +")");

                            //ellipse
                            planetContentsG
                                .append("ellipse")
                                    .attr("cx", planetContentsWidth/2)
                                    .attr("cy", planetContentsHeight/2)
                                    .attr("rx", ellipseWidth/2)
                                    .attr("ry", ellipseHeight/2)
                                    .attr("stroke", "black")
                                    .attr("fill", "#C0C0C0")
                                    .attr("stroke", "grey")
                            
                            //text
                            planetContentsG
                                .append("text")
                                .attr("class", "title")
                                .attr("transform", "translate(" +(planetContentsWidth/2) +"," +(planetContentsHeight/2) +")")
                                .attr("text-anchor", "middle")
                                .attr("dominant-baseline", "middle");
                                

                            //chart
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
                        
                        })
                        .merge(planetWrapperG)
                        .attr("transform", (d,i) => {
                            const isBelowOpenPlanet = (data.find(p => p.isOpen))?.i < i;
                            const heightOfPlanetsAbove = i*planetHeight;
                            const heightAbove = isBelowOpenPlanet ? heightOfPlanetsAbove + chartHeight : heightOfPlanetsAbove;
                            return "translate(0," +heightAbove +")"
                        })
                        .each(function(p,i){
                            const wrapperContentsG = d3.select(this).select("g.contents")
                            const planetContentsG = wrapperContentsG.select("g.planet").select("g.contents")
                            //planet text
                            planetContentsG.select("text").text(p => p.title)

                            //call active bar chart
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
                        });
                })
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
    journey.on = function () {
        if (!dispatch) return journey;
        // attach extra arguments
        const value = dispatch.on.apply(dispatch, arguments);
        return value === dispatch ? journey : value;
    };
    return journey;
}