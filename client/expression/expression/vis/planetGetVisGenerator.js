import * as d3 from 'd3';
import { COLOURS } from "../../constants";

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
        selection.each(function(colData){
            //console.log("getViz data", colData)
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
                //.attr("transform", "translate(0," +(chartHeight/2) +")")
                .attr("opacity", d => d.op ? 1 : 0)
                .each(function(){
                    const arrowLine = d3.select(this).selectAll("g.arrow").data(["top", "middle", "bottom"])
                    arrowLine.enter()
                        .append("line")
                            .attr("class", d => d + "-arrow arrow")
                            .attr("x1", 0)
                            .attr("stroke", COLOURS.exp.vis.op)
                            .merge(arrowLine)
                            .attr("y1", chartHeight/2)
                            .attr("x2", chartWidth/5)
                            .attr("y2", (d,i) =>  (i + 2) * chartHeight/6) //todo - remove eslint brackets rule

                })
           
            //instances
            //const instancesData = ["a1", "a2", "a3", "...", "...", "...", "...", "..."]
            const instancesData = ["val 1", "val 2", "val 3", "...", "...", "...", "...", "..."]
            const instancesG = contentsG.selectAll("g.instances").data([colData])
            instancesG.enter()
                .append("g")
                .attr("class", "instances")
                .attr("fill", COLOURS.exp.vis.val)
                .merge(instancesG)
                .attr("transform", "translate(" +(chartWidth * 2/5) +", 20)")
                .attr("opacity", d => d.selected ? 1 : 0)
                .each(function(){
                    const instanceG = d3.select(this).selectAll("g.instance").data(instancesData)
                    const instanceGEnter = instanceG.enter()
                        .append("g")
                            .attr("class", "instance")
                            .attr("transform", (d,i) => "translate(0, " +(i * 22.5) + ")")
                    
                    instanceGEnter
                        .append("text")
                            .style("font-size", d => d === "..." ? "16px" : "12px")
                            .text(d => d)

                })

            //count
            const countText = contentsG.selectAll("text.count").data([colData])
            countText.enter()
                 .append("text")
                 .attr("class", "count")
                 .attr("text-anchor", "end")
                 .attr("dominant-baseline", "hanging")
                 .attr("fill", COLOURS.exp.vis.count)
                 .merge(countText)
                 .attr("transform", "translate("+(chartWidth - 5) +"," + (chartHeight + 5) +")")
                 .attr("opacity", d => d.selected ? 1 : 0)
                 .text(d => "Count:" +(d.selected?.planet ? d.selected.planet.instances.length : 0))

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
    myGetVis.applicableContext = "Planet"
    myGetVis.applicableOp = "get"
    
    return myGetVis;

    }
