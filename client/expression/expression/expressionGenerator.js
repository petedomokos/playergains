import * as d3 from 'd3';
import { expressionBoxGenerator } from "./expressionBoxGenerator"
import { expressionVisGenerator } from './vis/expressionVisGenerator';

//import { expressionBoxGenerator } from "./expressionBoxGenerator"
import { planetHomeVisGenerator } from './vis/planetHomeVisGenerator';
import { planetGetVisGenerator } from './vis/planetGetVisGenerator';
import { planetEmptyVisGenerator } from './vis/planetEmptyVisGenerator';
import { CompassCalibrationSharp, ShowChart } from '@material-ui/icons';
import { map } from 'lodash';

export function expressionGenerator(){
    //dimns
    let width = 600;
    let height = 500;
    const margin = {};
    let colWidth = 140;
    let colHeight;
    const colMargin = { right: 20 }
    let boxAndVisWidth = 130;
    let boxHeight = 50;
    let visHeight = 200;

    //context
    let context;

    //components
    let componentContext;
    let expressionBox;
    let expressionVis;

    //dom
    let expressionG;

    function updateExpressionComponents(){
        if(context !== componentContext){
            //console.log("rendering new components for context", context)
            if(expressionBox){
                //we don't want to remove the gs themselves, as they are managed via the EUE pattern
                expressionG.selectAll("g.box").selectAll("*").remove();
                expressionG.selectAll("g.vis").selectAll("*").remove();
            }
            const { selected, op, colNr } = activeColState;
            //for now, only vis is different
            expressionBox = context === "Planet" ? expressionBoxGenerator() : expressionBoxGenerator();
            if(context === "Planet"){
                if(colNr === 0){
                    expressionVis = planetHomeVisGenerator();
                }
                else if(op){
                    expressionVis = findOpVisGenerator(op.id)
                }
                else{
                    expressionVis = planetEmptyVisGenerator();
                }
            }
            /*
            todo - decide do we make a separate visGenerator for mapping from homee planet eg 1 to 1 and another for many to many map
            or do we just allow teh generators access to teh wider state and then a map generator can work out what it needs to Show 
            ..so the key decision is, do teh generators haveaccess to prev col state, or is it restricted to that cols state only
            */

            function findOpVisGenerator(opId){
                switch(opId){
                    case "get":{
                        return planetGetVisGenerator();
                    }
                    default:{ return;};
                }
            }
        }
        //set current
        componentContext = context;
    }
    function expression(selection){
        expressionG = selection;
        //console.log("expressoin state", selection.datum())
        selection.each(function(data){
            //components
            updateExpressionComponents();
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

            //EXIT
            colG.exit().remove();

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

