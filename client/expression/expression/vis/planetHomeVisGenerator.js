import * as d3 from 'd3';
import { COLOURS, DIMNS } from "../../constants"

/*
    note - downside of merging colG before pasing through here is ts a bit trickier to do update only
    but we can still do it using and else() after the if statement
*/
export function planetHomeVisGenerator(selection){
    let width = 130;
    let height = 40;
    let margin =  DIMNS.col.children.margin;
    let contentsWidth;
    let contentsHeight;
    const updateDimns = () =>{
        contentsWidth = width - margin.left - margin.right;
        contentsHeight = height - margin.top - margin.bottom;
    }

    //dom
    //store contents on a separate g that can be removed if op or context changes without affecting the EUE pattern
    let visContentsG;
    function myHomeVis(selection){        
        selection.each(function(d,i){
            const visG = d3.select(this);
            const visMargins =  { ...DIMNS.col.vis.margins, ...DIMNS.col.vis.home.margins }
            //enter
            if(visG.select("*").empty()){
                visContentsG = visG.append("g").attr("class", "contents");
                visContentsG
                    .append("ellipse")
                        .attr("cx", contentsWidth/2)
                        .attr("cy", contentsHeight/2)
                        .attr("rx", contentsWidth/5)
                        .attr("ry", (contentsWidth/5)/5)
                        .attr("stroke", COLOURS.exp.vis.val)
                        .attr("fill", "#C0C0C0")
                        .attr("stroke", "grey")

            }

            //update
            //note - we dontcheck for d.op because this is set from the start on home col
            visContentsG
                .attr("transform", "translate(+"+margin.left +"," + margin.right +")")
                .attr("opacity", d.selected ? 1 : 0)  

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
    myHomeVis.applicableOp = "home"
    return myHomeVis;

    }
