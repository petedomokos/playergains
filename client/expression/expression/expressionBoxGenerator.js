import * as d3 from 'd3';

export function expressionBoxGenerator(selection){
    let width = 130;
    let height = 40;
    let margin =  { bottom:10 };
    let chartHeight = height - margin.bottom;
    let chartWidth = width;
    const updateDimns = () =>{
        chartHeight = height - margin.bottom;
        chartWidth = width;
        //todo - call update
    }

    let backgroundRect;
    let boxText;
    function myExpressionBox(selection){
        selection.each(function(d,i){
            const boxG = d3.select(this);
            //enter
            if(boxG.select("*").empty()){
                backgroundRect = boxG
                    .append("rect")
                        .attr("fill", "white")
                        .attr("stroke", "grey")
    
                boxText = boxG
                    .append("text")
                        .attr("dominant-baseline", "middle")
                        .attr("text-anchor", "start")
                        .attr("font-size", 12)
                        .attr("stroke", "grey")
                        .attr("stroke-width", 0.1)
            }
            //update
            backgroundRect
                .attr("width", chartWidth)
                .attr("height", chartHeight)

            boxText
                .attr("transform", "translate(5," + (chartHeight/2) +")")
                .text(d.selected?.name || (i === 0 ? "Click planet" : "Click op"))

        })
        return selection;
    }

    // api
    myExpressionBox.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        //updateDimns();
        return myExpressionBox;
        };
    myExpressionBox.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        //updateDimns();
        return myExpressionBox;
    };
    return myExpressionBox;

    }
