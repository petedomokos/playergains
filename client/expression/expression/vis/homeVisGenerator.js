import * as d3 from 'd3';
import { COLOURS, DIMNS } from "../../constants"

/*
    note - downside of merging blockG before pasing through here is ts a bit trickier to do update only
    but we can still do it using and else() after the if statement
*/
export function homeVisGenerator(selection){
    let width = 130;
    let height = 40;
    let margin =  DIMNS.block.children.margin;
    let contentsWidth;
    let contentsHeight;
    const updateDimns = () =>{
        contentsWidth = width - margin.left - margin.right;
        contentsHeight = height - margin.top - margin.bottom;
    }

    function myHomeVis(selection){        
        selection.each(function(blockData){
            //console.log("home vis", blockData)
            const visMargins =  { ...DIMNS.block.vis.margins, ...DIMNS.block.vis.home.margins }
            //bind
            const contentsG = d3.select(this).selectAll("g.contents").data([blockData])
            //enter contents
            const contentsGEnter = contentsG.enter().append("g").attr("class", "contents")
                .attr("transform", "translate(+"+margin.left +"," + margin.right +")");
            //upate contents
            const contentsGMerged = contentsG.merge(contentsGEnter)
                .attr("opacity", d => d.of ? 1 : 0)
            
            //enter line
            contentsGEnter
                .append("ellipse")
                    .attr("cx", contentsWidth/2)
                    .attr("cy", contentsHeight/2)
                    .attr("rx", contentsWidth/5)
                    .attr("ry", (contentsWidth/5)/5)
                    .attr("stroke", COLOURS.exp.vis.val)
                    .attr("fill", "#C0C0C0")
                    .attr("stroke", "grey")

            //update line  
            contentsGMerged.select("line")
                .attr("y1", contentsHeight/2)
                .attr("x2", contentsWidth - visMargins.val)
                .attr("y2", contentsHeight/2)

        })
        return selection;
    }

    // api
    myHomeVis.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        updateDimns();
        return myHomeVis;
        };
    myHomeVis.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        updateDimns();
        return myHomeVis;
    };
    myHomeVis.applicableContext = "Planet"
    myHomeVis.funcType = "home-sel"
    return myHomeVis;

    }
