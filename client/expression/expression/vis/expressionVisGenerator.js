import * as d3 from 'd3';

/*
    note - downside of merging colG before pasing through here is ts a bit trickier to do update only
    but we can still do it using and else() after the if statement
*/
export function expressionVisGenerator(selection){
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
    function myExpressionVis(selection){        
        selection.each(function(d,i){
            const visG = d3.select(this);
            //ENTER
            if(visG.select("*").empty()){
                //block
                visG
                    .append("rect")
                        .attr("width", chartWidth)
                        .attr("height", chartHeight)
                        .attr("fill", "#C0C0C0")
                        .attr("stroke", "grey")
                //count
                visG
                    .append("text")
                        .attr("class", "count")
                        .attr("transform", "translate("+(chartWidth - 5) +"," + (chartHeight + 5) +")")
                        .attr("text-anchor", "end")
                        .attr("dominant-baseline", "hanging")
                        .text("Count:") 
            }

            //UPDATE
            visG.attr("opacity", d.selected? 1 : 0)
            //count
            visG.select("text.count")
                .text("Count:" +(d.selected?.planet ? d.selected.planet.instances.length : 0))

        })
        return selection;
    }

    // api
    myExpressionVis.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        updateDimns();
        return myExpressionVis;
        };
    myExpressionVis.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        updateDimns();
        return myExpressionVis;
    };
    return myExpressionVis;

    }
