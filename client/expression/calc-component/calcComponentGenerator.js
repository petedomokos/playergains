import * as d3 from 'd3';
import { calcBoxGenerator } from './calcBoxGenerator'
import { operationIconsGenerator } from './operationIconsGenerator'
import { getActiveColState } from "../helpers"
import { DIMNS } from "../constants";

export function calcComponentGenerator(){
    //dimensions
    let width = 130;
    let height = 150;
    let margin =  DIMNS.margin;
    let contentsHeight;
    let contentsWidth;

    let opIconsWidth;
    //icons height is fixed
    const opIconsHeight = DIMNS.calc.icons.height;
    //calc box width is fixed
    const calcBoxWidth = DIMNS.calc.width;
    let calcBoxHeight;
    const updateDimns = () =>{
        contentsHeight = height - margin.top - margin.bottom;
        contentsWidth = width - margin.left - margin.right;
        calcBoxHeight = height - margin.top - margin.bottom - opIconsHeight;
        opIconsWidth = width - margin.left - margin.right;
    }

    //components
    let calcBox;
    let opIcons;

    //dom
    let calcComponentG;
    let calcBoxG;
    let opIconsG;

    //other

    //handlers
    let selectOp = () => {};
    let selectSubtool = () => {};

    function myCalcComponent(selection){
        selection.each(function(data){
            //@todo - remove opsInfo from data make it api so dat ais just state
            const { opsInfo, state } = data;
            //console.log("calc state", state)
            //dimensions
            updateDimns()
            //init
            if(!calcComponentG){
                //dom
                calcComponentG = d3.select(this);
                const deltaX = width/2 - calcBoxWidth/2
                calcBoxG = calcComponentG.append("g").attr("class", "calc-box")
                opIconsG = calcComponentG.append("g").attr("class", "icon-box")
                //functions
                calcBox = calcBoxGenerator().selectSubtool(selectSubtool);
                opIcons = operationIconsGenerator();
            }

            //update
            calcComponentG.attr("transform", "translate("+(width/2 - calcBoxWidth/2) + "," +margin.top +")")
            //calc box
            calcBox.width(calcBoxWidth).height(calcBoxHeight)
            calcBoxG.datum({opsInfo, state}).call(calcBox)

            //opIcons
            opIcons.width(opIconsWidth).height(opIconsHeight).selectOp(selectOp);

            const opsData= opsInfo.map(d => ({ ...d, isSelected:getActiveColState(state).op?.id === d.id }))

            opIconsG
            .attr("transform", "translate(0," +calcBoxHeight +")")
            .datum(opsData)
            .call(opIcons)
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
