import * as d3 from 'd3';
import { expressionBoxGenerator } from "./expressionBoxGenerator"
import { expressionVisGenerator } from './expressionVisGenerator';

export function expressionGenerator(){
    //api vars
    let width = 600;
    let height = 500;
    const margin = {};
    let colWidth = 140;
    let colHeight;
    const colMargin = { right: 20 }
    let boxAndVisWidth = 130;
    let boxHeight = 50;
    let visHeight = 200;

    //functions
    let expressionBox;
    let expressionVis;
    function expression(selection){
        selection.each(function(data){
            //init
           if(!expressionBox){
               expressionBox = expressionBoxGenerator();
               expressionVis = expressionVisGenerator();
            }
            //BIND
            const colG = selection.selectAll("g.col").data(data)

            //ENTER
            //here we append the g, but after this point .enter will still refer to the pre-entered placeholder nodes
            const colGEnter = colG.enter()
               .append("g")
               .attr("class", "col")
               .attr("transform", (d,i) => "translate(" +(i * (colWidth + colMargin.right))+",0)")

            colGEnter.append("g").attr("class", "box")
            colGEnter.append("g").attr("class", "vis").attr("transform", "translate(0," + (boxHeight) +")")
            //note - if we merge, the indexes will stay as they are from orig sel and sel.enter()
            //os need to select again
            const colGMerged = colG.merge(colGEnter);
            colGMerged.select("g.box").call(expressionBox.width(boxAndVisWidth).height(boxHeight))
            colGMerged.select("g.vis").call(expressionVis.width(boxAndVisWidth).height(visHeight))

        })
    }
    // api
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

