import * as d3 from 'd3';
import { calcBoxGenerator } from './calcBoxGenerator'
import { operationIconsGenerator } from './operationIconsGenerator'
import { getActiveColState } from "../helpers"

export function calcComponentGenerator(selection){
    //dimensions
    let width = 130;
    let height = 40;
    let margin =  { top: 10, bottom:10, left:100, right:10 };
    let chartHeight = height - margin.bottom;
    let chartWidth = width;
    const updateDimns = () =>{
        chartHeight = height - margin.bottom;
        chartWidth = width;
        //todo - call update
    }
    let calcBoxWidth = 400;
    let calcBoxHeight = 100;
    let opIconsWidth = 120;
    let opIconsHeight = 40;

    //components
    let calcBox;
    let opIcons;

    //dom
    let calcComponentG;
    let calcBoxG;
    let opIconsG;

    //other
    let display = "inline";

    //handlers
    let selectOp = () => {};
    let selectSubtool = () => {};

    function myCalcComponent(selection){
        selection.each(function(data){
            const { opsInfo, state } = data;
            //console.log("calccomponent state", state)
            //init
            if(!calcComponentG){
                //dom
                calcComponentG = d3.select(this);
                calcBoxG = calcComponentG.append("g").attr("class", "calc-box")
                    .attr("transform", "translate("+margin.left + "," +margin.top +")")
                opIconsG = calcComponentG.append("g").attr("class", "icon-box")
                    .attr("transform", "translate("+margin.left + "," +(margin.top+calcBoxHeight) +")")

                //functions
                calcBox = calcBoxGenerator().selectSubtool(selectSubtool);
                opIcons = operationIconsGenerator();
            }

            //update
            calcComponentG.attr("display", display)
            //calc box
            calcBox
                .width(calcBoxWidth)
                .height(calcBoxHeight)

            calcBoxG.datum({opsInfo, state}).call(calcBox)

            //opIcons
            opIcons
                .width(opIconsWidth)
                .height(opIconsHeight)
                .selectOp(selectOp);

            const opsData= opsInfo.map(d => ({ ...d, isSelected:getActiveColState(state).op?.id === d.id }))

            opIconsG.datum(opsData).call(opIcons)
        })
        return selection;
    }

    // api
    myCalcComponent.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        //updateDimns();
        return myCalcComponent;
        };
    myCalcComponent.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        //updateDimns();
        return myCalcComponent;
    };
    myCalcComponent.display = function (value) {
        if (!arguments.length) { return display; }
        display = value;
        //updateDimns();
        return myCalcComponent;
    };
    //todo - dispatch event for setop instead so dont have to pass up anddown teh chain all the way to icons
    myCalcComponent.selectOp = function (value) {
        if (!arguments.length) { return selectOp; }
        selectOp = value;
        return myCalcComponent;
    };
    myCalcComponent.selectSubtool = function (value) {
        if (!arguments.length) { return selectSubtool; }
        selectSubtool = value;
        //updateDimns();
        return myCalcComponent;
    };
    return myCalcComponent;

    }
