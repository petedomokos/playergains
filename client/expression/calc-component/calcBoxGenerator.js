import * as d3 from 'd3';

export function calcBoxGenerator(selection){
    //dimensions
    let width = 350;
    let height = 100;
    let margin =  { top: 10, bottom:10, left:10, right:10 };
    let chartHeight = height - margin.bottom;
    let chartWidth = width;
    const updateDimns = () =>{
        chartHeight = height - margin.bottom;
        chartWidth = width;
        //todo - call update
    }

    //dom
    let boxG;
    let backgroundRect;

    function myCalcBox(selection){
        selection.each(function(toolsData){
            if(!boxG){
                boxG = d3.select(this);
                backgroundRect = boxG.append("rect")
                    .attr("class", "background")
                    .attr("fill", "white")
                    .attr("stroke", "grey")
            }

            //update
            backgroundRect
                .attr("width", chartWidth)
                .attr("height", chartHeight)

            
        })
        return selection;
    }

    // api
    myCalcBox.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        //updateDimns();
        return myCalcBox;
        };
    myCalcBox.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        //updateDimns();
        return myCalcBox;
    };
    return myCalcBox;

    }
