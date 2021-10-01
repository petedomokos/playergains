import * as d3 from 'd3';

export function operationIconsGenerator(selection){
    //dimensions
    let width = 130;
    let height = 40;
    let margin =  { top: 10, bottom:10, left:0, right:10 };
    let chartHeight = height - margin.bottom;
    let chartWidth = width;
    const updateDimns = () =>{
        chartHeight = height - margin.bottom;
        chartWidth = width;
        //todo - call update
    }

    //handlers
    let selectOp = () => {}

    //dom
    let opIconsG;

    function myOpIcons(selection){
        selection.each(function(toolsData){
            //console.log("calcIcons", toolsData)
            if(!opIconsG){
                opIconsG = d3.select(this)
            }
            //Bind
            const iconG = opIconsG.selectAll("g.iconG").data(toolsData)
            //Enter
            const iconGEnter = iconG.enter()
                .append("g")
                    .attr("class", "icon")
                    .attr("transform", (d,i) => "translate(" +(i * 50) + ",0)")
                    .on("click", (e,d) => selectOp(d))

            //note - this will become the full name and show on hover just below icon
            iconGEnter.append("text")
                .attr("dominant-baseline", "hanging")
                .attr("fill", d.isSelected ? "blue" : "black")
                .attr("font-size", 12)

            iconGEnter.append("rect")
                .attr("class", "hitbox")
                .attr("width", 30)
                .attr("height", 15)
                .style("cursor", "pointer")
                .attr("fill", "transparent")

            //Update
            iconG.merge(iconGEnter).select("text")
                .text(d => d.name)
            
        })
        return selection;
    }

    // api
    myOpIcons.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        //updateDimns();
        return myOpIcons;
        };
    myOpIcons.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        //updateDimns();
        return myOpIcons;
    };
    myOpIcons.selectOp = function (value) {
        if (!arguments.length) { return selectOp; }
        selectOp = value;
        return myOpIcons;
    };
    return myOpIcons;

    }
