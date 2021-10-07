import * as d3 from 'd3';
import { COLOURS, DIMNS } from "../constants"

export function operationIconsGenerator(selection){
    //dimensions
    let width = 130;
    let height = 40;
    let margin = { left:5, right:5, top:5, bottom:5 };
    let contentsWidth = width - margin.left - margin.right;
    let contentsHeight = height - margin.top - margin.bottom;
    const updateDimns = () =>{
        contentsWidth = width - margin.left - margin.right
        contentsHeight = height - margin.top - margin.bottom;
    }

    //handlers
    let selectOp = () => {}

    //dom
    let opIconsG;

    function myOpIcons(selection){
        selection.each(function(opsData){
            //console.log("opsData", opsData)
            if(!opIconsG){
                opIconsG = d3.select(this)
            }
            //Bind
            const iconG = opIconsG.selectAll("g.icon").data(opsData, op => op.id)
            //Enter
            const iconGEnter = iconG.enter()
                .append("g")
                    .attr("class", "icon")
                    .attr("transform", (d,i) =>"translate(" +(i * 50) + ",0)")
                    .on("click", (e,d) => selectOp({...d, isSelected:undefined})) //donet send isSelected

            //note - this will become the full name and show on hover just below icon
            iconGEnter.append("text")
                .attr("dominant-baseline", "hanging")
                .attr("font-size", 12)

            iconGEnter.append("rect")
                .attr("class", "hitbox")
                .attr("width", 30)
                .attr("height", 15)
                .style("cursor", "pointer")
                .attr("fill", "transparent")

            //Update
            iconG.merge(iconGEnter).select("text")
                .attr("fill", d => d.isSelected ? COLOURS.calc.op.selected : COLOURS.calc.op.nonSelected)
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
