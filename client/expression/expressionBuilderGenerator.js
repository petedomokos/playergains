import * as d3 from 'd3';
import { update } from 'lodash';
import { planetsGenerator } from "./planetsGenerator";
import { expressionGenerator } from "./expression/expressionGenerator";
import { calcComponentGenerator } from "./calc-component/calcComponentGenerator";

/*

step1 (start):
 - it lays out the planets and their properties down the side
 - it opens an entrance box 
 - if user clicks a planet, it fills the box with the planet name, and loads a bar representing the instances, with the count, below.

 step 2 (when a planet is in first box):
  - a second box is rendered
  - the function names show above
  - if a func name is clicked, it appears in the new box, and also the calcComponent opens up above the icons

*/

//helpers
const colsBefore = (i, arr) => arr.slice(0, i)
const colsAfter = (i, arr) => arr.slice(i + 1, arr.length)
export default function expressionBuilderGenerator() {
    // dimensions
    let width = 600;
    let height = 500;
    let margin = { left:10, right:10, top:10, bottom:10}
    let planetsHeight;
    let planetsWidth = 100;
    let expressionHeight;
    let expressionWidth;
    let expressionMargin = {left:50, right:20, top:10, bottom:10}
    let calcComponentHeight = 150;
    let calcComponentWidth;
    //todo - wire margins etc up to height and width with an update functino
    function updateDimns(){
        planetsHeight = height - margin.top - margin.bottom;
        expressionHeight = height - margin.top - margin.bottom;
        expressionWidth = width - planetsWidth;
    };

    //functions
    let planets;
    let calcComponent;
    let expression;

    //dom
    let svg;
    let planetsG;
    let calcComponentG;
    let expressionG;

    //data
    let planetData;
    let toolsInfo;

    //state
    let state = [{}]
    let setState = () =>{}

    function expressionBuilder(selection) {
        //console.log("expressionBuilder...")
        // expression elements
        selection.each(function (data) {
            planetData = data.planets;
            toolsInfo = data.toolsInfo;
            state = data.expressionState;
            //INIT
            if(!svg){
                svg = d3.select(this);
                planetsG = svg.append("g").attr("class", "planets")
                    .attr("transform", "translate(0" +"," + calcComponentHeight +")")

                calcComponentG = svg.append("g").attr("class", "calc-component")
                    .attr("transform", "translate(" +(planetsWidth +expressionMargin.left) +",0)")

                expressionG = svg.append("g").attr("class", "expression")
                    .attr("transform", "translate(" +(planetsWidth +expressionMargin.left) +"," + calcComponentHeight +")")
                    
                //functions
                planets = planetsGenerator();
                calcComponent = calcComponentGenerator();
                expression = expressionGenerator();
            }

            //UPDATE
            update()
        })
        return selection;
    }

    function update(){
        //console.log("expBuilder update...")
        if(!svg){ return ;}

        updateDimns()

        //planets
        planets
            .width(planetsWidth)
            .height(planetsHeight)
            .onSelect(function(nodeType, id){
                //for now assume planet
                //create next column - setting react state triggers an update
                setState([
                    {...state[0], selected:planetData.find(p => p.id === id)}, 
                    {}
                ])
            })

        planetsG.datum(planetData).call(planets)

        //calcComponent
        calcComponent
            .width(calcComponentWidth)
            .height(calcComponentHeight)
            .display(state[0].selected ? "inline" : "none")
            .setOp((colNr, opId) => {
                const updatedCol = {...state[colNr], opId};
                setState([...colsBefore(colNr, state), updatedCol, colsAfter(colNr, state)])
            })
        
        calcComponentG.datum(toolsInfo).call(calcComponent)

        //expression
        expression
            .width(expressionWidth)
            .height(expressionHeight)

        expressionG.datum(state).call(expression)

    }     

    // api
    expressionBuilder.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        update();
        return expressionBuilder;
    };
    expressionBuilder.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        update();
        return expressionBuilder;
    };
    //handlers
    expressionBuilder.setState = function (value) {
        if (!arguments.length) { return setState; }
        setState = value;
        return expressionBuilder;
    };
    return expressionBuilder;
}
