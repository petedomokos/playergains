import * as d3 from 'd3';

/*
    note - downside of merging colG before pasing through here is ts a bit trickier to do update only
    but we can still do it using and else() after the if statement
*/
export function planetGetVisGenerator(selection){
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
    function myGetVis(selection){        
        selection.each(function(d,i){
            console.log("expVis d",d)
            console.log("i",i)
            const visG = d3.select(this);
            //enter
            if(visG.select("*").empty()){
                visG
                    .append("line")
                        .attr("x1", 0)
                        .attr("y1", chartHeight/2)
                        .attr("x2", chartWidth)
                        .attr("y2", chartHeight/2)
                        .attr("stroke", "white")
                        //.attr("fill", "#C0C0C0")
                        //.attr("stroke", "grey")

                visG
                    .append("text")
                        .attr("class", "count")
                        .attr("transform", "translate("+(chartWidth - 5) +"," + (chartHeight + 5) +")")
                        .attr("text-anchor", "end")
                        .attr("dominant-baseline", "hanging")
                        .text("Count:") 
            }

            //update
            visG.attr("opacity", d.selected? 1 : 0)  
            visG.select("text.count")
                .text("Count:" +(d.selected?.planet ? d.selected.planet.instances.length : 0))

        })
        return selection;
    }

    // api
    myGetVis.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        updateDimns();
        return myGetVis;
        };
    myGetVis.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        updateDimns();
        return myGetVis;
    };
    return myGetVis;

    }
