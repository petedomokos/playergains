import * as d3 from 'd3';
import { planetsGenerator } from "./planetsGenerator";
import { expressionGenerator } from "./expression/expressionGenerator";
import { calcComponentGenerator } from "./calc-component/calcComponentGenerator";
import { elementsBefore, elementsAfter, getActiveColState } from "./helpers";
import { aggSubtools, getInstances, getPropValueType } from "./data";
import { COLOURS, DIMNS } from "./constants";

/*

*/

export default function expressionBuilderGenerator() {
    //type
    let context;
    // dimensions
    let width = 600;
    let height = 600;
    const margin = DIMNS.expBuilder.margin;
    let contentsWidth;
    let contentsHeight;

    let planetsWidth = DIMNS.planets.width;
    let planetsHeight;

    let chainWrapperWidth;
    let chainWrapperContentsWidth;
    let calcWidth;
    let expWidth;
    let buttonsWidth;

    //let chainWrapperFullHeight;
    //let chainWrapperFullContentsHeight;
    const calcHeight = DIMNS.calc.height; //100
    const expHeight = DIMNS.exp.height; //150
    const buttonsHeight = DIMNS.chainButtons.height; //40
    const expAndButtonsHeight = expHeight + buttonsHeight;

    const chainWrapperMargin = DIMNS.chainWrapper.margin;

    function updateDimns(nrOfChains){
        contentsWidth = width - margin.left - margin.right;
        contentsHeight = height - margin.top - margin.bottom;

        planetsHeight = contentsHeight;

        chainWrapperWidth = contentsWidth - planetsWidth;
        chainWrapperContentsWidth = chainWrapperWidth- chainWrapperMargin.left - chainWrapperMargin.right;
        calcWidth = chainWrapperContentsWidth;
        expWidth = chainWrapperContentsWidth;
        buttonsWidth = chainWrapperContentsWidth;
    };

    //functions
    let planets;
    let calcComponent;
    let expression;

    //dom
    let svg;
    let chainWrapperG;

    //data
    //Q - DO WE NEED TO STORE DATA AND STATE HERE??
    let planetData;
    let opsInfo;
    const buttonsInfo = ["New", "Copy", "Del"];

    //state
    let state = [{}]
    let setState = () =>{}

    const dispatch = d3.dispatch("setState");

    //updates
    //atm , this doesnt update when context changes, so we rely on parent to re-render
    //which is fine because we are starting again anyway. But no reason why this comp cant auto-update
    //here just like teh chilren do
    function expressionBuilder(selection) {
        // expression elements
        selection.each(function (data) {
            planetData = data.planets;
            opsInfo = data.opsInfo;
            const { expBuilderState, activeChainIndex} = data;
            console.log("expBuilderState", expBuilderState)
            //add the previous col state to each colState
            const amendedExpBuilderState = expBuilderState
                .map(expState => expState
                    .map((col,i) => i === 0 ? col : { ...col, prev:expState[i - 1]}));
            
            //dimensions
            updateDimns(expBuilderState.length)

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
            const chainWrappersContG = svg.selectAll("g.chain-wrappers-cont").data([expBuilderState])
            const chainWrappersContGEnter= chainWrappersContG.enter()
                .append("g")
                .attr("class", "chain-wrappers-cont")
                .attr("transform", "translate(" + (margin.left +planetsWidth) + ", " +margin.top  + ")")
            
            const chainWrappersContGMerged = chainWrappersContG.merge(chainWrappersContGEnter)

            //bind
            chainWrapperG = chainWrappersContGMerged.selectAll("g.chain-wrapper").data(amendedExpBuilderState);
            //enter
            const chainWrapperGEnter = chainWrapperG.enter()
                .append("g")
                    .attr("class", (d,i) => "chain-wrapper chain-wrapper-"+i)
                    .each(function(d,i){
                        d3.select(this).append("g").attr("class", "calc-component")
                        d3.select(this).append("g").attr("class", "expression")
                        const g = d3.select(this).append("g").attr("class", "buttons")

                        //temp
                        d3.select(this)
                            .append("rect")
                            .attr("width", chainWrapperWidth)
                            .attr("height", activeChainIndex === i ? (calcHeight + expAndButtonsHeight): (expAndButtonsHeight))
                            .attr("stroke", "black")
                            .attr("fill", "none")
                            .attr("opacity", 0.7)
                    })
            //update
            const chainWrapperGMerged = chainWrapperG.merge(chainWrapperGEnter)
                .attr("transform", (d,i) => {
                     //if active chain is before, then the calc box will also be above it, as well as the margins, exp and buttons
                     const chainHeightsAbove = i * (chainWrapperMargin.top +expAndButtonsHeight +chainWrapperMargin.bottom) + (i > activeChainIndex ? calcHeight : 0)
                    return "translate("+chainWrapperMargin.left +"," +chainHeightsAbove +")"
                })
            /*
            chainWrapperGMerged.select("g.calc-component")
                //.attr("transform", "translate(0,0)")
                .datum(d => ({opsInfo, d}))
                .call(calcComponent)
            */
           //shift exp down below the calc box if it is active
            chainWrapperGMerged.select("g.expression")
                .attr("transform", (d,i) => "translate(0," +(i === activeChainIndex ? calcHeight : 0) +")")
                .datum(d => d)
                .call(expression)

            //buttons
            chainWrapperGMerged.select("g.buttons")
                .attr("transform", (d,i) => "translate(0," +(expHeight + (i === activeChainIndex ? calcHeight : 0)) +")")
                .each(function(){
                    const buttonsHeight = DIMNS.chainButtons.height;
                    const buttonWidth = 50;
                    const buttonHeight = buttonsHeight * 0.8;
                    const buttonMargin = { left:0, right:5, top:buttonsHeight * 0.1, bottom:buttonsHeight * 0.1}
                    const buttonG = d3.select(this).selectAll("g.button").data(buttonsInfo, d => d);
                    const buttonGEnter = buttonG.enter()
                        .append("g")
                            .attr("class", "button")
                            .attr("transform", (d,j) => "translate(" +(j * (buttonWidth + buttonMargin.right)) + "," +buttonMargin.top +")")
                            .style("cursor", "pointer")
                            .on("click", (e,d) => onChainButtonClick(d))

                    //note - this will become the full name and show on hover just below icon

                    buttonGEnter.append("rect")
                        .attr("class", "background")
                        .attr("width", buttonWidth)
                        .attr("height", buttonHeight)
                        .attr("fill", COLOURS.chainWrapper.btn.bg)

                       // why when we put buttonsHeight down do they no longer stay in the chainWrapper?

                    buttonGEnter.append("text")
                        .attr("transform", "translate("+(buttonWidth/2) + "," +(buttonsHeight/2) +")")
                        .attr("dominant-baseline", "middle")
                        .attr("text-anchor", "middle")
                        .attr("font-size", 12)
                        .attr("fill", COLOURS.chainWrapper.btn.col)
                        .text(d => d)

                })

            function onChainButtonClick(d){
                console.log("clicked", d)
            }
                    
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
                setState([...elementsBefore(colNr, state), updatedCol, {} ])
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
                setState([...elementsBefore(colNr, state), updatedCol, ...elementsAfter(colNr, state)])
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
                setState([...elementsBefore(colNr, state), updatedCol, ...elementsAfter(colNr, state)])
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