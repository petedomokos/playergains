import * as d3 from 'd3';
import { update } from 'lodash';
import { planetsGenerator } from "./planetsGenerator";
import { expressionGenerator } from "./expression/expressionGenerator";
import { calcComponentGenerator } from "./calc-component/calcComponentGenerator";
import { colsBefore, colsAfter } from "./helpers"

/*

*/

export default function expressionBuilderGenerator() {
    //type
    let context;
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
    //Q - DO WE NEED TO STORE DATA AND STATE HERE??
    let planetData;
    let opsInfo;

    //state
    let state = [{}]
    let setState = () =>{}

    const dispatch = d3.dispatch("setState");

    //updates
    //atm , this doesnt update when context changes, so we rely on parent to re-render
    //which is fine because we are starting again anyway. But no reason why this comp cant auto-update
    //here just like teh chilren do
    function expressionBuilder(selection) {
        //console.log("expressionBuilder...")
        // expression elements
        selection.each(function (data) {
            planetData = data.planets;
            opsInfo = data.opsInfo;
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
            .onSelect(function(planet, property){
                console.log("onSelect planet...", planet)
                console.log("onSelect property...", property)
                //for now, active col is always the last one
                const colNr = state.length - 1;
                const updatedCol = {...state[colNr], selected:{planet, property, filter:{desc:"All"} } };
                setState([...colsBefore(colNr, state), updatedCol, {} ])
            })

        planetsG.datum(planetData).call(planets)

        //calcComponent
        calcComponent
            .width(calcComponentWidth)
            .height(calcComponentHeight)
            .display(state[0].selected ? "inline" : "none")
            .selectOp((op) => {
                //console.log("onSelect op",op)
                //for now, active col is always the last one
                const colNr = state.length - 1;
                const updatedCol = {...state[colNr], op};
                setState([...colsBefore(colNr, state), updatedCol, ...colsAfter(colNr, state)])
            })
        calcComponentG.datum({opsInfo, state}).call(calcComponent)

        //expression
        expression
            .context(context)
            .width(expressionWidth)
            .height(expressionHeight)

        expressionG.datum(state).call(expression)

    }     

    // api
    expressionBuilder.context = function (value) {
        if (!arguments.length) { return context; }
        context = value;
        return expressionBuilder;
    };
    expressionBuilder.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        //update();
        return expressionBuilder;
    };
    expressionBuilder.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        //update();
        return expressionBuilder;
    };
    //handlers
    expressionBuilder.setState = function (value) {
        if (!arguments.length) { return setState; }
        setState = value;
        return expressionBuilder;
    };
    expressionBuilder.on = function () {
        if (!dispatch) return expressionBuilder;
        // attach extra arguments
        const value = dispatch.on.apply(dispatch, arguments);
        return value === dispatch ? expressionBuilder : value;
    };
    return expressionBuilder;
}
