import * as d3 from 'd3';
import { COLOURS } from "../../constants";

export function selConnectorGenerator(selection){
    let width;
    let height;

    function myConnector(selection){        
        selection.each(function(data){
            //console.log("sel connector", data)
            const contentsHeight = height * 0.6;

            const arrowLine = d3.select(this).selectAll("g.arrow").data(["top", "middle", "bottom"])
            arrowLine.enter()
                .append("line")
                    .attr("class", d => d + "-arrow arrow")
                    .attr("x1", 0)
                    .attr("stroke", COLOURS.exp.connector)
                    .merge(arrowLine)
                    .attr("y1", 0)
                    .attr("x2", width)
                    .attr("y2", (d,i) =>  (i - 1) * contentsHeight/6) //todo - remove eslint brackets rule
    
        })
        return selection;
    }

    // api
    myConnector.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        return myConnector;
        };
    myConnector.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        return myConnector;
    };
    myConnector.funcType = "agg"

    return myConnector;
}
