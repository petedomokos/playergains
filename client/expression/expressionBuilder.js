import * as d3 from 'd3';
import { planetsComponent} from "./planetsComponent";
import { DIMNS } from "./constants";

/*

*/

export default function expressionBuilder() {
    // DIMENSIONS
    let width = 600;
    let height = 600;
    const margin = DIMNS.expBuilder.margin;
    let contentsWidth;
    let contentsHeight;
    const EXTRA_PLANETS_MARGIN_TOP = 50;

    let planetsWidth = DIMNS.planets.width;
    let planetsHeight;

    let expWidth;
    //const expHeight = DIMNS.exp.height; //150

    function updateDimns(){
        contentsWidth = width - margin.left - margin.right;
        contentsHeight = height - margin.top - margin.bottom;

        planetsHeight = contentsHeight;
        expWidth = contentsWidth;
    };

    //COMPONENTS
    let planets = planetsComponent();
    //let links = linksComponent();
    //let nodes = nodesComponent();

    function updateComponents(){
        //planets
        planets
            .width(planetsWidth)
            .height(planetsHeight)
            //.onSelect(function(planet, property){})
        
        //nodes

        //links
    }     

    //data
    let planetsData = [];

    //dom
    let svg;

    //handlers
    let setActiveNode = () => {};
    let addNode = () => {};
    let updateNode = () =>{};
    let deleteNode = () => {};

    //GENERAL UPDATE
    function builder(selection) {
        // expression elements
        selection.each(function (data) {
            svg = d3.select(this);
            //const { nodesData, linksData } = data;
            console.log("expBuilderData...", data)
            
            updateDimns();
            updateComponents();

            //DOM
            //PLANETS
            const planetsG = svg.selectAll("g.planets").data([planetsData])
            planetsG.enter()
                .append("g")
                    .attr("class", "planets")
                    .merge(planetsG)
                    .attr("transform", "translate("+margin.left +"," + (margin.top + EXTRA_PLANETS_MARGIN_TOP) +")")
                    .call(planets)
            //exit
            planetsG.exit().remove();

            //NODES
            /*
            const nodesG = svg.selectAll("g.nodes").data([nodesData])
            nodesG.enter()
                .append("g")
                .attr("class", "nodes")
                .merge(nodesG)
                .call(nodes) 

            //LINKS
            const linksG = svg.selectAll("g.links").data([linksData])
            linksG.enter()
                .append("g")
                .attr("class", "links")
                .merge(linksG)
                .call(links)
            */

       
        })
        return selection;
    }

    // api
    builder.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        //update();
        return builder;
    };
    builder.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        //update();
        return builder;
    };
    builder.planetsData = function (value) {
        if (!arguments.length) { return planetsData; }
        planetsData = value;
        return builder;
    };
    //handlers
    builder.setActiveNode = function (value) {
        if (!arguments.length) { return setActiveNode; }
        setActiveNode = value;
        return builder;
    };
    builder.addNode = function (value) {
        if (!arguments.length) { return addNode; }
        addNode = value;
        return expressionBuilder;
    };
    builder.updateNode = function (value) {
        if (!arguments.length) { return updateNode; }
        updateNode = value;
        return builder;
    };
    builder.deleteNode = function (value) {
        if (!arguments.length) { return deleteNode; }
        deleteNode = value;
        return builder;
    };
    return builder;
}