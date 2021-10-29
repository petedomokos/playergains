import * as d3 from 'd3';
import { expressionBoxGenerator } from "./expressionBoxGenerator"

//import { expressionBoxGenerator } from "./expressionBoxGenerator"
import { homeVisGenerator } from './vis/homeVisGenerator';
import { selVisGenerator } from './vis/selVisGenerator';
import { aggVisGenerator } from './vis/aggVisGenerator';
import { emptyVisGenerator } from './vis/emptyVisGenerator';
import { COLOURS, DIMNS } from "../constants"

export function expressionGenerator(){
    //dimns
    let width = 600;
    let { height } = DIMNS.exp
    //we take of the bottom margin as we already have one from a higher level
    const margin = { ...DIMNS.margin, bottom:0};
    let contentsWidth;
    let contentsHeight;
    let blockWidth = DIMNS.block.width;
    let blockHeight;
    const blockMargin = { ...DIMNS.noMargin, top:10, bottom:10};
    const initLeftMargin = 10;
    const blockContentsWidth = blockWidth - blockMargin.left - blockMargin.right
    let blockContentsHeight;

    const boxHeight = DIMNS.block.box.height;
    const countHeight = DIMNS.block.count.height;
    let visHeight;

    function updateDimns(){
        contentsWidth = width - margin.left - margin.right;
        contentsHeight = height - margin.top - margin.bottom;
        blockHeight = contentsHeight;
        blockContentsHeight = blockHeight - blockMargin.top - blockMargin.bottom;
        visHeight = blockContentsHeight - boxHeight - countHeight;
 };

    //context
    let context;

    //components
    // must be a sep generator for each col
    let expressionBoxComponents = {};
    let visComponents = {};

    //dom
    let expressionG;

    function updateExpressionComponents(d, i){
        //remove previous
        if(expressionBoxComponents[i]){
            //we don't want to remove the gs themselves, as they are managed via the EUE pattern
            d3.select(this).select("g.box").selectAll("g.contents").remove();
            d3.select(this).select("g.vis").selectAll("g.contents").remove();
        }
        switch(d.func?.id){
            case "home-sel":{
                expressionBoxComponents[i] = expressionBoxGenerator(); //for now, boxes are same
                visComponents[i] = homeVisGenerator();
                break;
            }
            case "sel":{
                expressionBoxComponents[i] = expressionBoxGenerator(); //for now, boxes are same
                visComponents[i] = selVisGenerator();
                break;
            }
            case "agg":{
                expressionBoxComponents[i] = expressionBoxGenerator(); //for now, boxes are same
                visComponents[i] = aggVisGenerator();
                break;
            }
            //default when no op ie col will be empty
            default:{
                expressionBoxComponents[i] = expressionBoxGenerator(); //for now, boxes are same
                visComponents[i] = emptyVisGenerator();
            }
        }
    }
    function expression(selection){
        expressionG = selection;

        updateDimns()

        const backgroundRect = expressionG.selectAll("rect.background").data([{width,height}])
        backgroundRect.enter()
            .append("rect")
            .attr("class", "background")
            .merge(backgroundRect)
            .attr("width", d => d.width)
            .attr("height", d => d.height)
            .attr("fill", COLOURS.exp.bg)

        selection.each(function(chainData){
            //BIND
            const blockG = selection.selectAll("g.block").data(chainData)

            //ENTER
            //here we append the g, but after this point .enter will still refer to the pre-entered placeholder nodes
            const blockGEnter = blockG.enter()
               .append("g")
               .attr("class", (d,i) => "block block-"+i)
               .attr("transform", (d,i) => {
                   //shift the initial margin left, then a complete set for each prev col
                   const deltaX = initLeftMargin +i * (blockWidth + blockMargin.right + blockMargin.left);
                   return "translate(" +deltaX +"," + blockMargin.top+")"
               })

            //@todo - move to vis
            blockGEnter.append("rect")
                .attr("class", "block-background")
                .attr("fill", COLOURS.exp.block.bg)

            blockGEnter.append("g").attr("class", "box")
            blockGEnter.append("g").attr("class", "vis").attr("transform", "translate(0," + (boxHeight) +")")

            //@todo - put count into a bottom section of the expression, so you have box then viz then bottom section
            blockGEnter
                .append("text")
                    .attr("class", "count")
                    .attr("transform", "translate("+(blockContentsWidth * 0.5) +"," + (boxHeight +visHeight +5) +")")
                    .attr("text-anchor", "middle")
                    .attr("dominant-baseline", "hanging")
                    .style("font-size", 12)
                    .attr("fill", COLOURS.exp.vis.count)

            //note - if we merge, the indexes will stay as they are from orig sel and sel.enter()
            //os need to select again
            blockG.merge(blockGEnter)
                .each(function(d,i){
                    //update components
                    //expressionBox and vis are both updated in sync with each other
                    //@todo - the box will always be rendered, so use that to check for updates instead of vis
                    //but to do this, we need a different expBox for each context and op
                    const contextHasChanged = visComponents[i]?.applicableContext !== context;
                    const functionHasChanged = visComponents[i]?.funcType !== d.func?.id;
                    if(contextHasChanged || functionHasChanged){
                        updateExpressionComponents.call(this, d, i)
                    }
                    //components
                    //todo - move to vis
                    d3.select(this).select("rect.block-background")
                        .attr("x",0)
                        .attr("y",boxHeight)
                        .attr("width", blockContentsWidth)
                        .attr("height", visHeight)

                     //todo - height not being passed thru successfully
                    d3.select(this).select("g.box")
                        .call(expressionBoxComponents[i].width(blockContentsWidth).height(boxHeight))
                    d3.select(this).select("g.vis")
                       .call(visComponents[i].width(blockContentsWidth).height(visHeight))

                    d3.select(this).select("text.count")
                        .attr("display", d.func?.id === "sel" ? "inline" : "none")
                        .text("Count:" +(d.of?.planet?.instances.length || 0))
                })

            //overlay (rendered last so on top)
            /*
            blockGEnter.append("rect")
                .attr("class", "overlay")
                .attr("width", blockWidth)
                .attr("height", blockHeight)
                .attr("fill", "red")
                //.on("click", () => { console.log("overlay clicked")})
                .merge(blockG)
                .attr("display", d => {
                    return d.isActive ? "none" : "inline";
                   // why not rendering when not active???????????
                })
                */

            //EXIT
            blockG.exit().remove();

        })
    }
    // api
    expression.context = function (value) {
        if (!arguments.length) { return context; }
        context = value;
        return expression;
    };
    expression.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        return expression;
    };
    expression.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        return expression;
    };
    return expression;
}

