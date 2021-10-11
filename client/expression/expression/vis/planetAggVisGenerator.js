import * as d3 from 'd3';
import { COLOURS, DIMNS } from "../../constants"
/*
    note - downside of merging colG before pasing through here is ts a bit trickier to do update only
    but we can still do it using and else() after the if statement
*/
export function planetAggVisGenerator(selection){
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
        selection.each(function(colData){
            console.log("AggVis data", colData)
            const visMargins =  { ...DIMNS.col.vis.margins, ...DIMNS.col.vis.agg.margins }
            //visContentsG 
            const visContentsG = d3.select(this).selectAll("g.contents").data([colData])
            //we call the merged version contents 
            const contentsG = visContentsG.enter()
                .append("g")
                .attr("class", "contents")
                .merge(visContentsG)
                .attr("opacity", d => d.selected || d.op ? 1 : 0)
            
            //arrows
            const arrowsG = contentsG.selectAll("g.arrows").data([colData])
            arrowsG.enter()
                .append("g")
                .attr("class", "arrows")
                .merge(arrowsG)
                //.attr("transform", "translate(0," +(contentsHeight/2) +")")
                .attr("opacity", d => d.op ? 1 : 0)
                .each(function(){
                    const arrowLine = d3.select(this).selectAll("g.arrow").data(["top", "middle", "bottom"])
                    arrowLine.enter()
                        .append("line")
                            .attr("class", d => d + "-arrow arrow")
                            .attr("x1", visMargins.op)
                            .attr("stroke", COLOURS.exp.vis.op)
                            .merge(arrowLine)
                            .attr("y1", (d,i) =>  (i + 2) * contentsHeight/6)
                            .attr("x2", contentsWidth/5)
                            .attr("y2", contentsHeight/2) //todo - remove eslint brackets rule

                })
           
            //result
            const resG = contentsG.selectAll("g.res").data([colData])
            const resGEnter = resG.enter()
                .append("g")
                    .attr("class", "res")
                    .attr("transform", "translate(" +(contentsWidth / 2) +"," +(contentsHeight / 2) +")")
                    .attr("text-anchor", "middle")
            
            resGEnter
                .append("text")
                    .attr("class", "alg-expression")
                    .attr("fill", COLOURS.exp.vis.val)
                    .style("font-size", "12px")
                    .text(d => {
                        const { res:{name, letter, value, algExpression} } = d;
                        const letterStr = letter ? " ("+letter +")" : "";
                        return d.res ? name + letterStr +" = " +(value || algExpression || "") : "";
                    })

            const rectWidth = contentsWidth * 0.7
            const rectHeight = 30;

            resGEnter
                .append("rect")
                    .attr("class", "background")
                    .attr("height", rectHeight +"px")
                    .attr("y", -rectHeight/2)
                    .attr("stroke", "black")
                    .attr("fill", "transparent")

            resG.merge(resGEnter)
                .attr("transform", "translate(" +(contentsWidth / 2) +"," +(contentsHeight / 2) +")")
                .attr("opacity", d => d.res ? 1 : 0)
                .each(function(d,i){
                    d3.select(this).select("rect.background")
                        .attr("width", rectWidth)
                        .attr("x", - rectWidth/2)
                })

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
    };
    myAggVis.applicableContext = "Planet"
    myAggVis.applicableOp = "get"
    
    return myAggVis;

    }
