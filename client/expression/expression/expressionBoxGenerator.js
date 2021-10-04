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

    function myExpressionBox(selection){
        selection.each(function(d,i){
            //console.log("expBox d",d)
            //console.log("i",i)
            const boxG = d3.select(this);
            //ENTER
            if(boxG.select("*").empty()){
                //background
                boxG
                    .append("rect")
                        .attr("fill", "white")
                        .attr("stroke", "grey")
                //text
                boxG
                    .append("text")
                        .attr("dominant-baseline", "middle")
                        .attr("text-anchor", "start")
                        .attr("font-size", 12)
                        .attr("stroke", "grey")
                        .attr("stroke-width", 0.1)
            }
            //UPDATE
            //background
            boxG.select("rect")
                .attr("width", chartWidth)
                .attr("height", chartHeight)
            //text
            boxG.select("text")
                .attr("transform", "translate(5," + (chartHeight/2) +")")
                .text(boxText(d, i))

        })
        //helper
        function boxText(d, i){
            const opName = d.op?.name || "";
            const planetName = d.selected?.planet.name || "";
            //property will only be defined if planet is defined
            const propertyName = d.selected?.property?.name || "";
            if(opName || planetName){
                return opName + " " + planetName + " " +propertyName;
            }
            //blank defaults
            if(i === 0){
                return "Click planet or property"
            }
            return "Click operation"
        }
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
    }
    
    return myExpressionBox;

    }
