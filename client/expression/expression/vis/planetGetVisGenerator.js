import * as d3 from 'd3';
import { COLOURS, DIMNS } from "../../constants";

/*
    note - downside of merging colG before pasing through here is ts a bit trickier to do update only
    but we can still do it using and else() after the if statement
*/
export function planetGetVisGenerator(selection){
    let width = 130;
    let height = 40;
    let margin =  DIMNS.col.children.margin;
    let contentsWidth;
    let contentsHeight;
    const updateDimns = () =>{
        contentsWidth = width - margin.left - margin.right;
        contentsHeight = height - margin.top - margin.bottom;
    }
    function myGetVis(selection){        
        selection.each(function(colData){
            const visMargins =  { ...DIMNS.col.vis.margins, ...DIMNS.col.vis.get.margins }
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
                            .attr("y1", contentsHeight/2)
                            .attr("x2", contentsWidth/5)
                            .attr("y2", (d,i) =>  (i + 2) * contentsHeight/6) //todo - remove eslint brackets rule

                })
           
            //instances
            //const instancesData = ["a1", "a2", "a3", "...", "...", "..."]
            const instancesData = ["val 1", "val 2", "val 3", "...", "..."]
            const instancesG = contentsG.selectAll("g.instances").data([colData])
            instancesG.enter()
                .append("g")
                .attr("class", "instances")
                .attr("fill", COLOURS.exp.vis.val)
                .merge(instancesG)
                .attr("transform", "translate(" +(contentsWidth * 2/5) +", 20)")
                .attr("opacity", d => d.selected ? 1 : 0)
                .each(function(){
                    const instanceG = d3.select(this).selectAll("g.instance").data(instancesData)
                    const instanceGEnter = instanceG.enter()
                        .append("g")
                            .attr("class", "instance")
                            .attr("transform", (d,i) => "translate(0, " +(i * 17.5) + ")")
                    
                    instanceGEnter
                        .append("text")
                            .style("font-size", d => d === "..." ? "16px" : "10px")
                            .text(d => d)

                })

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
