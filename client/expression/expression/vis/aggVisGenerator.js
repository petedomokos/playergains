import * as d3 from 'd3';
import { COLOURS, DIMNS } from "../../constants"
//import { calculateResult } from "../../helpers"
/*
    note - downside of merging blockG before pasing through here is ts a bit trickier to do update only
    but we can still do it using and else() after the if statement
*/
export function aggVisGenerator(selection){
    let width = 130;
    let height = 40;
    let margin =  { bottom:10 };
    let contentsHeight = height - margin.bottom;
    let contentsWidth = width;
    const updateDimns = () =>{
        contentsHeight = height - margin.bottom;
        contentsWidth = width;
        //todo - call update
    }
    function myAggVis(selection){      
        selection.each(function(blockData){
            //console.log("AggVis data", blockData)
            const visMargins =  { ...DIMNS.block.vis.margins, ...DIMNS.block.vis.agg.margins }
            //visContentsG 
            const visContentsG = d3.select(this).selectAll("g.contents").data([blockData])
            //we call the merged version contents 
            const contentsG = visContentsG.enter()
                .append("g")
                .attr("class", "contents")
                .merge(visContentsG)
                //.attr("opacity", d => d.selected || d.op ? 1 : 0)
            
            //arrows
            const arrowsG = contentsG.selectAll("g.arrows").data([blockData])
            arrowsG.enter()
                .append("g")
                .attr("class", "arrows")
                .merge(arrowsG)
                //.attr("transform", "translate(0," +(contentsHeight/2) +")")
                //.attr("opacity", d => d.op ? 1 : 0)
                .each(function(){
                    const arrowLine = d3.select(this).selectAll("g.arrow").data(["top", "middle", "bottom"])
                    arrowLine.enter()
                        .append("line")
                            .attr("class", d => d + "-arrow arrow")
                            .attr("x1", visMargins.preIcon)
                            .attr("stroke", COLOURS.exp.vis.preIcon)
                            .merge(arrowLine)
                            .attr("y1", (d,i) =>  (i + 2) * contentsHeight/6)
                            .attr("x2", contentsWidth * 0.2)
                            .attr("y2", contentsHeight * 0.5) //todo - remove eslint brackets rule

                })
           
            //result
            const resG = contentsG.selectAll("g.res").data([blockData])
            const resGEnter = resG.enter()
                .append("g")
                    .attr("class", "res")
                    .attr("transform", "translate(" +(contentsWidth * 0.3) +"," +(contentsHeight * 0.5) +")")
                    .attr("text-anchor", "middle")
                    .attr("dominant-baseline", "middle")
            
            resGEnter
                .append("text")
                    .attr("class", "result")
                    .attr("fill", COLOURS.exp.vis.val)
                    .style("font-size", "12px")
                    .text(d => {
                        //console.log("d", d)
                        const res = d.subFunc.f(d.prev.of, x => x.value);
                        //console.log("res", res)
                        return "= "+(res || "")
                    })

            //resG.merge(resGEnter)
            //.attr("transform", "translate(" +(contentsWidth / 2) +"," +(contentsHeight / 2) +")")
                //.attr("opacity", d => d.res ? 1 : 0)

        })
        return selection;
    }

    // api
    myAggVis.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        updateDimns();
        return myAggVis;
        };
    myAggVis.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        updateDimns();
        return myAggVis;
    }
    myAggVis.applicableContext = "Planet"
    myAggVis.funcType = "agg"

    return myAggVis;

}
