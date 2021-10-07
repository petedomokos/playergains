import * as d3 from 'd3';
import { planetsGenerator } from "./planetsGenerator";
import { expressionGenerator } from "./expression/expressionGenerator";
import { calcComponentGenerator } from "./calc-component/calcComponentGenerator";
import { colsBefore, colsAfter, getActiveColState } from "./helpers";
import { aggSubtools, getInstances, getPropValueType } from "./data";
import { DIMNS } from "./constants";

/*

*/

export default function expressionBuilderGenerator() {
    //type
    let context;
    // dimensions
    let width = 600;
    let height = 600;
    let margin = { ...DIMNS.margin, left:0 }
    let contentsWidth;
    let contentsHeight;

    let planetsWidth = DIMNS.planets.width;
    let planetsHeight;

    let expWrapperWidth;
    let expWrapperHeight = DIMNS.expWrapper.height;
    const expWrapperMargin = DIMNS.margin;
    let expWrapperContentsWidth;
    let expWrapperContentsHeight;

    let calcWidth;
    let calcHeight;

    let expWidth;
    let expHeight;

    function updateDimns(){
        contentsWidth = width - margin.left - margin.right;
        contentsHeight = height - margin.top - margin.bottom;

        planetsHeight = contentsHeight;

        expWrapperWidth = contentsWidth - planetsWidth;
        expWrapperHeight = height - margin.left - margin.right;
        expWrapperContentsWidth = expWrapperWidth- expWrapperMargin.left - expWrapperMargin.right;
        expWrapperContentsHeight = expWrapperHeight - expWrapperMargin.top - expWrapperMargin.bottom;

        calcWidth = expWrapperContentsWidth;
        calcHeight = 0.3 * (expWrapperContentsHeight)
        expWidth = expWrapperContentsWidth;
        expHeight = 0.7 * (expWrapperContentsHeight)
    };

    //functions
    let planets;
    let calcComponent;
    let expression;

    //dom
    let svg;
    let planetsG;
    let expWrapperG;

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
            const { expBuilderState } = data;
            console.log("expBuilderState", expBuilderState)
            //add the previous col state to each colState
            const amendedExpBuilderState = expBuilderState
                .map(expState => expState
                    .map((col,i) => i === 0 ? col : { ...col, prev:expState[i - 1]}));
            
            //dimensions
            updateDimns()

            //console.log("state", state)
            //INIT
            if(!svg){
                svg = d3.select(this);
                //create child components
                planets = planetsGenerator();
                calcComponent = calcComponentGenerator();
                expression = expressionGenerator();
            }
            //UPDATE CHILD COMPONENTS
            updateComponents()

            //DOM
            //PLANETS
            const planetsG = svg.selectAll("g.planets").data([planetData])
            planetsG.enter()
                .append("g")
                    .attr("class", "planets")
                    .merge(planetsG)
                    .attr("transform", "translate("+margin.left +"," + (margin.top + calcHeight) +")")
                    .call(planets)

            //EXPRESSION-WRAPPERS
            //bind
            expWrapperG = svg.selectAll("g.exp-wrapper").data(amendedExpBuilderState);
            //enter
            expWrapperG.enter()
                .append("g")
                    .attr("class", (d,i) => "exp-wrapper exp-wrapper-"+i)
                    .each(function(){
                        d3.select(this).append("g").attr("class", "calc-component")
                        d3.select(this).append("g").attr("class", "expression")
                    })
            //update
            const expWrapperGMerged = expWrapperG.merge(expWrapperG)
                .attr("transform", d => "translate(" +(margin.left +planetsWidth) +"," +(margin.top +(i *expWrapperHeight)) +")")
            
            expWrapperGMerged.select("g.calc-component")
                .attr("transform", "translate(" +expWrapperMargin.left +"," +expWrapperMargin.top +")")
                .datum(d => ({opsInfo, d}))
                .call(calcComponent)
            
            expWrapperGMerged.select("g.expression")
                .attr("transform", "translate(" +expWrapperMargin.left +"," +(expWrapperMargin.top +calcHeight) +")")
                .datum(d => d)
                .call(expression)
                    
        })
        return selection;
    }

    function updateComponents(){
        //planets
        planets
            .width(planetsWidth)
            .height(planetsHeight)
            .onSelect(function(planet, property){
                //todo - activeCol must also have an exp Number, or a 'run' number
                //todo - change expressoin to expRun, because some users will want teh excel approach
                //ie all in one run, so its not neccesarily one expression per run
                const activeCol = getActiveColState(state);
                const { colNr } = activeCol;
                console.log("onSelect planet...", planet)
                console.log("and property...", property)
                const updatedCol = {
                    ...activeCol, 
                    selected:{planet, property, filter:{desc:"All"} },
                    //op is get if no op selected - home op is in 1st col already
                    op:activeCol.op || opsInfo.find(op => op.id === "get")
                };
                setState([...colsBefore(colNr, state), updatedCol, {} ])
            })

        //calcComponent
        calcComponent
            .width(calcWidth)
            .height(calcHeight)
            .display(state[0].selected ? "inline" : "none")
            //@todo - change op to tool, or subtool to subOp
            .selectOp((op) => {
                console.log("onSelect op..................",op)
                //for now, active col is always the last one
                const activeCol = getActiveColState(state);
                const { colNr, prev } = activeCol;
                //default subtool if op is agg 
                let subtool;
                let res;
                const { planet, property} = prev.selected;
                const valueType = getPropValueType(planet.id, property?.id)
                if(op.id === "agg" && !activeCol.subtool){
                    if(valueType === "number"){
                        subtool = aggSubtools.find(t => t.id === "sum");
                    }
                    else if(activeCol.prev?.selected?.planet){
                        subtool = aggSubtools.find(t => t.id === "count");
                    }else{
                        subtool = activeCol.subtool;
                    }
                    //result
                    let accessor; 
                    if(valueType === "Date"){
                        accessor = x => new Date(x.propertyValues[property.id])
                    }else if(valueType === "Number"){
                        x => +x.propertyValues[property.id]
                    }else if(valueType){
                        x => x.propertyValues[property.id]
                    }
                    const data = getInstances(planet.id);
                    res = createResult(subtool, data, accessor)
                }
                //update state
                const updatedCol = {...activeCol, op, subtool, res};
                setState([...colsBefore(colNr, state), updatedCol, ...colsAfter(colNr, state)])
            })
            .selectSubtool((subtool) => {
                console.log("onSelect subtool",subtool)
                //for now, active col is always the last one
                const activeCol = getActiveColState(state);
                const { colNr, prev } = activeCol;
                //result
                const { planet, property} = prev.selected;
                const valueType = getPropValueType(planet.id, property?.id)
                let accessor; 
                if(valueType === "Date"){
                    accessor = x => new Date(x.propertyValues[property.id])
                }else if(valueType === "Number"){
                    x => +x.propertyValues[property.id]
                }else if(valueType){
                    x => x.propertyValues[property.id]
                }
                const data = getInstances(prev.selected.planet.id);
                const res = createResult(subtool, data, accessor)
                //update state
                const updatedCol = {...activeCol, subtool, res};
                setState([...colsBefore(colNr, state), updatedCol, ...colsAfter(colNr, state)])
            })

        function createResult(tool, data, accessor = x => x){
            const { name="", f } = tool;
            return {
                name,
                //letter: "b", //must have a running track of letters in top react level above all runs
                value:f ? f(data) : "None"
            }
        }

        //expression
        expression
            .context(context)
            .width(expWidth)
            .height(expHeight);
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
