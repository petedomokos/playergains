import * as d3 from 'd3';
import { planetsGenerator } from "./planetsGenerator";
import { expressionGenerator } from "./expression/expressionGenerator";
import { editorGenerator } from "./editor/editorGenerator";
import { elementsBefore, elementsAfter, getActiveBlockState } from "./helpers";
import { funcs, getInstances, getPropValueType } from "./data";
import { COLOURS, DIMNS, INIT_CHAIN_STATE } from "./constants";

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
    let editorWidth;
    let expWidth;
    let buttonsWidth;

    //let chainWrapperFullHeight;
    //let chainWrapperFullContentsHeight;
    const editorHeight = DIMNS.editor.height; //100
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
        editorWidth = chainWrapperContentsWidth;
        expWidth = chainWrapperContentsWidth;
        buttonsWidth = chainWrapperContentsWidth;
    };

    //functions
    let planets;
    let editors = [];
    let expressions = [];

    //dom
    let svg;
    let chainWrapperG;

    //data
    //Q - DO WE NEED TO STORE DATA AND STATE HERE??
    let planetData;
    const buttonsInfo = ["New", "Copy", "Del"];

    //state
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
            const { expBuilderState, activeChainIndex } = data;
            //@todo - make this editable  - for now its the last one in the chain
            const activeBlockIndex = expBuilderState[activeChainIndex].length - 1;
            //add the previous block state to each blockState
            const amendedExpBuilderState = expBuilderState
                .map((chainState, i) => chainState
                    .map((block, j) => ({
                            ...block,
                            prev: j !== 0 ? chainState[j - 1] : undefined,
                            isActive:activeChainIndex === i && activeBlockIndex === j,
                            chainNr:i,
                            blockNr:j
                    }))
                );
            
            console.log("amendedExpBuilderState...", amendedExpBuilderState)
            
            //dimensions
            updateDimns(expBuilderState.length)
            
            //INIT COMPONENTS
            if(!planets) { planets = planetsGenerator(); }
            expBuilderState.forEach((chainState,i) => {
                //create child components
                if(!editors[i]) { editors[i] = editorGenerator(); }
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
                    .attr("transform", "translate("+margin.left +"," + (margin.top + editorHeight) +")")
                    .call(planets)
            //exit
            planetsG.exit().remove();

            //EXPRESSION-WRAPPERS
            const chainWrappersContG = svg.selectAll("g.chain-wrappers-cont").data([amendedExpBuilderState])
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
                        d3.select(this).append("g").attr("class", "editor")
                        d3.select(this).append("g").attr("class", "expression")
                        const g = d3.select(this).append("g").attr("class", "buttons")
                    })
            //update
            const chainWrapperGMerged = chainWrapperG.merge(chainWrapperGEnter)
                .attr("transform", (d,i) => {
                     //if active chain is before, then the calc box will also be above it, as well as the margins, exp and buttons
                     const chainHeightsAbove = i * (chainWrapperMargin.top +expAndButtonsHeight +chainWrapperMargin.bottom) + (i > activeChainIndex ? editorHeight : 0)
                    return "translate("+chainWrapperMargin.left +"," +chainHeightsAbove +")"
                })

            chainWrapperGMerged.select("g.editor")
                .attr("transform", "translate(0,0)")
                .attr("display", (d,i) => (activeChainIndex === i) ? "inline" : "none")
                .each(function(chainData,i){
                    //@todo - remove funcs from data make it api so we just pass d here as data
                    d3.select(this).datum(chainData.find(d => d.isActive)).call(editors[i])
                })

            //shift exp down below the calc box if it is active
            chainWrapperGMerged.select("g.expression")
                .attr("transform", (d,i) => "translate(0," +(i === activeChainIndex ? editorHeight : 0) +")")
                .each(function(d,i){
                    d3.select(this).datum(d).call(expressions[i])
                })

            //buttons
            chainWrapperGMerged.select("g.buttons")
                .attr("transform", (d,i) => "translate(0," +(expHeight + (i === activeChainIndex ? editorHeight : 0)) +")")
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
                        .attr("fill", COLOURS.chainWrapper.btn.block)
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
                also what is blockNr when is it set and how is it used
                */
                if(d === "New"){
                    addChain(i);
                }else if(d === "Copy"){
                    copyChain(i)
                }else{
                    deleteChain(i)
                    editors = [...elementsBefore(i, editors), ...elementsAfter(i, editors)];
                    expressions = [...elementsBefore(i, expressions), ...elementsAfter(i, expressions)];
                }
            }
                    
        })
        return selection;
    }

    function updateComponents(activeChainIndex, amendedExpBuilderState){
        const activeChainState = amendedExpBuilderState[activeChainIndex]
        const activeBlock = activeChainState.find(block => block.isActive)
        //planets
        planets
            .width(planetsWidth)
            .height(planetsHeight)
            .onSelect(function(planet, property){
                const { blockNr, func } = activeBlock;
                let updatedBlockState;
                if(blockNr === 0){
                    //its the home block
                    updatedBlockState = {
                        ...activeBlock,
                        func:funcs.find(func => func.id === "home-sel"),
                        //we just take the first instance as it is for the home planet
                        //@todo - allow user to change which instance is used
                        of:getInstances(planet.id)[0]
                    }
                }else{
                    //its not the home block
                    const valueType = getPropValueType(planet.id, property?.id);
                    //helper to get the right value for each instance based on property selected
                    const calculateValue = (instance, propertyId, valueType) => {
                        const rawValue = instance.propertyValues[propertyId];
                        if(valueType === "date"){
                            return new Date(rawValue)
                        }
                        if(valueType === "number"){
                            return +rawValue
                        }
                        return rawValue
                    }

                    const dataset = getInstances(planet.id).map(inst => ({
                        ...inst,
                        //add the appropriate value if property has been specified.
                        value:property ? calculateValue(inst, property.id, valueType) : undefined
                    }))
                    //attach the planet and property selected to the dataset for reference purposes
                    dataset.planet = planet;
                    dataset.property = property;
                    dataset.valueType = valueType;
                    //add the dataset to block state as the of property 
                    //(note - of can be a dataset (as here) or a function (with its own 'of') that returns a dataset)
                    updatedBlockState = {
                        ...activeBlock,
                        //if func is alrady chosem use that, otherwise its a sel
                        func:func || funcs.find(func => func.id === "sel"),
                        of:dataset
                    };
                }
                //update state
                setState([...elementsBefore(blockNr, activeChainState), updatedBlockState, {} ])
            })

        //editor
        editors.forEach((editor,i) => {
            const chainState = amendedExpBuilderState[i]
            const activeBlockInChain = chainState.find(block => block.isActive)
            if(!activeBlockInChain){ return; }

            editor
                .width(editorWidth)
                .height(editorHeight)
                .funcs(funcs)
                //@todo - change op to tool, or subF to subOp
                .selectFunc((func) => {
                    console.log("onSelect func..................",func)
                    const { blockNr, prev } = activeBlockInChain;
                    if(!prev?.of?.planet){
                        //todo - go into func-first mode
                        return;
                    }
                    /*
                        if prev col has a dataset as its return value, then if op is agg and no dataset selected, we sum the prev block
                        if prev col has no dataset as its value, we assume its functionFirst, so do f() eg sum()
                        But before all that, user must choose sum
                    */
                    //set the default subFunc in some cases
                    let subFunc;
                    const { planet, valueType } = prev.of;
                    if(func.id === "agg" && valueType === "number"){
                        subFunc = func.subFuncs.find(f => f.id === "sum");
                    }
                    else if(func.id === "agg" && planet){
                        console.log("func", func)
                        subFunc = func.subFuncs.find(f => f.id === "count");
                    }
                    //update state
                    const updatedBlock = {...activeBlockInChain, func, subFunc};
                    setState([...elementsBefore(blockNr, chainState), updatedBlock, ...elementsAfter(blockNr, chainState)])
                })
                .selectSubFunc((subFunc) => {
                    console.log("onSelect subFunc",subFunc)
                    const updatedBlock = {...activeBlockInChain, subFunc};
                    setState([...elementsBefore(blockNr, chainState), updatedBlock, ...elementsAfter(blockNr, chainState)])
                })
        })

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