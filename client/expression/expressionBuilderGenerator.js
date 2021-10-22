import * as d3 from 'd3';
import { planetsGenerator } from "./planetsGenerator";
import { expressionGenerator } from "./expression/expressionGenerator";
import { calcComponentGenerator } from "./calc-component/calcComponentGenerator";
import { elementsBefore, elementsAfter, getActiveColState } from "./helpers";
import { aggSubtools, getInstances, getPropValueType } from "./data";
import { COLOURS, DIMNS, INIT_CHAIN_STATE } from "./constants";
import { Work } from '@material-ui/icons';

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
    let calcComponents = [];
    let expressions = [];

    //dom
    let svg;
    let chainWrapperG;

    //data
    //Q - DO WE NEED TO STORE DATA AND STATE HERE??
    let planetData;
    let opsInfo;
    const buttonsInfo = ["New", "Copy", "Del"];

    //state
    let state;
    let setState = () =>{};
    let addChain = () => {};
    let copyChain = () => {};
    let deleteChain = () => {};

    const dispatch = d3.dispatch("setState");

    //updates
    //atm , this doesnt update when context changes, so we rely on parent to re-render
    //which is fine because we are starting again anyway. But no reason why this comp cant auto-update
    //here just like teh chilren do
    function expressionBuilder(selection) {
        // expression elements
        selection.each(function (data) {
            svg = d3.select(this);
            planetData = data.planets;
            opsInfo = data.opsInfo;
            const { expBuilderState, activeChainIndex} = data;
            //@todo - make this editable  - for now its the last one in the chain
            const activeColIndex = expBuilderState[activeChainIndex].length - 1;
            //add the previous col state to each colState
            const amendedExpBuilderState = expBuilderState
                .map((chainState, i) => chainState
                    .map((col, j) => ({
                        ...col,
                        prev: j === 0 ? chainState[j - 1] : undefined,
                        isActive:activeChainIndex === i && activeColIndex === j

                    }))
                );

            //set state to be the active chain
            state = amendedExpBuilderState[activeChainIndex];
            
            //console.log("amendedExpBuilderState", amendedExpBuilderState)
            
            //dimensions
            updateDimns(expBuilderState.length)

            //console.log("state", state)
            //INIT COMPONENTS
            if(!planets) { planets = planetsGenerator(); }
            expBuilderState.forEach((chainState,i) => {
                //create child components
                if(!calcComponents[i]) { calcComponents[i] = calcComponentGenerator(); }
                if(!expressions[i]) {  expressions[i] = expressionGenerator(); }
            })
            //UPDATE CHILD COMPONENTS
            //todo - remove this and do as part of teh selectAll update chain
            updateComponents(activeChainIndex, amendedExpBuilderState)

            //DOM
            //PLANETS
            const planetsG = svg.selectAll("g.planets").data([planetData])
            planetsG.enter()
                .append("g")
                    .attr("class", "planets")
                    .merge(planetsG)
                    .attr("transform", "translate("+margin.left +"," + (margin.top + calcHeight) +")")
                    .call(planets)
            //exit
            planetsG.exit().remove();

            //EXPRESSION-WRAPPERS
            const chainWrappersContG = svg.selectAll("g.chain-wrappers-cont").data([expBuilderState])
            const chainWrappersContGEnter= chainWrappersContG.enter()
                .append("g")
                .attr("class", "chain-wrappers-cont")
                .attr("transform", "translate(" + (margin.left +planetsWidth) + ", " +margin.top  + ")")
            
            const chainWrappersContGMerged = chainWrappersContG.merge(chainWrappersContGEnter)
            
            //exit
            chainWrappersContG.exit().remove();

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
                        /*
                        d3.select(this)
                            .append("rect")
                            .attr("width", chainWrapperWidth)
                            .attr("height", activeChainIndex === i ? (calcHeight + expAndButtonsHeight): (expAndButtonsHeight))
                            .attr("stroke", "black")
                            .attr("fill", "none")
                            .attr("opacity", 0.7)
                            */
                    })
            //update
            const chainWrapperGMerged = chainWrapperG.merge(chainWrapperGEnter)
                .attr("transform", (d,i) => {
                     //if active chain is before, then the calc box will also be above it, as well as the margins, exp and buttons
                     const chainHeightsAbove = i * (chainWrapperMargin.top +expAndButtonsHeight +chainWrapperMargin.bottom) + (i > activeChainIndex ? calcHeight : 0)
                    return "translate("+chainWrapperMargin.left +"," +chainHeightsAbove +")"
                })

            chainWrapperGMerged.select("g.calc-component")
                .attr("transform", "translate(0,0)")
                .attr("display", (d,i) => (activeChainIndex === i) ? "inline" : "none")
                .each(function(d,i){
                    //@todo - remove opsInfo from data make it api so we just pass d here as data
                    d3.select(this).datum({opsInfo, state:d}).call(calcComponents[i])
                })

           //shift exp down below the calc box if it is active
            chainWrapperGMerged.select("g.expression")
                .attr("transform", (d,i) => "translate(0," +(i === activeChainIndex ? calcHeight : 0) +")")
                .each(function(d,i){
                    d3.select(this).datum(d).call(expressions[i])
                })

            //buttons
            chainWrapperGMerged.select("g.buttons")
                .attr("transform", (d,i) => "translate(0," +(expHeight + (i === activeChainIndex ? calcHeight : 0)) +")")
                .each(function(chainState, i){
                    const buttonsHeight = DIMNS.chainButtons.height;
                    const buttonWidth = 30;
                    const buttonHeight = buttonsHeight * 0.8;
                    const buttonMargin = { left:0, right:5, top:buttonsHeight * 0.1, bottom:buttonsHeight * 0.1}
                    const buttonG = d3.select(this).selectAll("g.button").data(buttonsInfo, d => d);
                    const buttonGEnter = buttonG.enter()
                        .append("g")
                            .attr("class", "button")
                            .attr("transform", (d,j) => "translate(" +(j * (buttonWidth + buttonMargin.right)) + "," +buttonMargin.top +")")
                            .style("cursor", "pointer")
                            .on("click", (e,d) => onChainButtonClick(d, i))

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
            
            //exit - this removes everything to do with this chain
            chainWrapperG.exit().remove();

            function onChainButtonClick(d, i){
                //check index usages throughout - if a chain is added,
                /*
                the ones after it will have new index numbers
                so need to check that they will Work...do they 
                use indeax numbers anywhere otehr than EUE pattern?
                also must make sure 2nd param of .data() is set in all EUE usages
                so not bound by index
                also what is colNr when is it set and how is it used
                */
                if(d === "New"){
                    addChain(i);
                }else if(d === "Copy"){
                    copyChain(i)
                }else{
                    deleteChain(i)
                    calcComponents = [...elementsBefore(i, calcComponents), ...elementsAfter(i, calcComponents)];
                    expressions = [...elementsBefore(i, expressions), ...elementsAfter(i, expressions)];
                }
            }
                    
        })
        return selection;
    }

    function updateComponents(activeChainIndex, expBuilderState){
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
                //console.log("state", state)
                //console.log("activeCol", activeCol)
                const updatedCol = {
                    ...activeCol, 
                    selected:{planet, property, filter:{desc:"All"} },
                    //op is get if no op selected - home op is in 1st col already
                    op:activeCol.op || opsInfo.find(op => op.id === "get")
                };
                setState([...elementsBefore(colNr, state), updatedCol, {} ])
            })

        //calcComponent
        calcComponents.forEach((calcComponent,i) => {
            const chainState = expBuilderState[i]
            calcComponent
                .width(calcWidth)
                .height(calcHeight)
                //@todo - change op to tool, or subtool to subOp
                .selectOp((op) => {
                    console.log("onSelect op..................",op)
                    //for now, active col is always the last one
                    const activeCol = getActiveColState(state);
                    console.log("activeCol", activeCol)
                    const { colNr, prev } = activeCol;
                    //default subtool if op is agg 
                    let subtool;
                    let res;
                    console.log("prev", prev)
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
                        accessor = x => +x.propertyValues[property.id]
                    }else if(valueType){
                        accessor = x => x.propertyValues[property.id]
                    }
                    const data = getInstances(prev.selected.planet.id);
                    const res = createResult(subtool, data, accessor)
                    //update state
                    const updatedCol = {...activeCol, subtool, res};
                    setState([...elementsBefore(colNr, state), updatedCol, ...elementsAfter(colNr, state)])
                })
        })

        function createResult(tool, data, accessor = x => x){
            const { name="", f } = tool;
            return {
                name,
                //letter: "b", //must have a running track of letters in top react level above all runs
                value:f ? f(data, accessor) : "None"
            }
        }

        //expression
        expressions.forEach((expression,i) => {
            expression
                .context(context)
                .width(expWidth)
                .height(expHeight);
        })
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
    expressionBuilder.addChain = function (value) {
        if (!arguments.length) { return addChain; }
        addChain = value;
        return expressionBuilder;
    };
    expressionBuilder.copyChain = function (value) {
        if (!arguments.length) { return copyChain; }
        copyChain = value;
        return expressionBuilder;
    };
    expressionBuilder.deleteChain = function (value) {
        if (!arguments.length) { return deleteChain; }
        deleteChain = value;
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