import * as d3 from 'd3';
import { calcBoxGenerator } from './calcBoxGenerator'
import { operationIconsGenerator } from './operationIconsGenerator'

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

    //functions
    let calcBox;
    let opIcons;

    //dom
    let calcComponentG;
    let calcBoxG;
    let opIconsG;

    //other
    let display = "inline";

    //handlers
    let setOp = () => {};

    const dispatch = d3.dispatch("setState");

    function myCalcComponent(selection){
        selection.each(function(toolsData){
            //init
            if(!calcComponentG){
                //dom
                calcComponentG = d3.select(this);
                calcBoxG = calcComponentG.append("g").attr("class", "calc-box")
                    .attr("transform", "translate("+margin.left + "," +margin.top +")")
                opIconsG = calcComponentG.append("g").attr("class", "icon-box")
                    .attr("transform", "translate("+margin.left + "," +(margin.top+calcBoxHeight) +")")

                //functions
                calcBox = calcBoxGenerator();
                opIcons = operationIconsGenerator()
                    .selectOp(function(d){
                        console.log("this", this)
                        //const d = d3.select(this).attr(id) //how to get nr? could i be passed through from click too?
                        //console.log("colNr", colNr)
                        //add colNr and dispatch setState
                        const updatedCol = {...d, opId};
                        //const updatedCol = {...state[colNr], opId};
                        const updatedState = [...colsBefore(colNr, state), updatedCol, colsAfter(colNr, state)];
                        dispatch.call("setState", this, updatedState)
                    });
            }

            //update
            calcComponentG.attr("display", display)
            //calc box
            calcBox.width(calcBoxWidth).height(calcBoxHeight)
            calcBoxG.datum(toolsData).call(calcBox)

            //opIcons
            opIcons.width(opIconsWidth).height(opIconsHeight)
            opIconsG.datum(toolsData).call(opIcons)
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
    myCalcComponent.setOp = function (value) {
        if (!arguments.length) { return setOp; }
        setOp = value;
        return myCalcComponent;
    };
    return myCalcComponent;

    }
