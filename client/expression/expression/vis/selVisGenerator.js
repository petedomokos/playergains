import * as d3 from 'd3';
import { COLOURS, DIMNS } from "../../constants";

/*
    note - downside of merging blockG before pasing through here is ts a bit trickier to do update only
    but we can still do it using and else() after the if statement
*/
export function selVisGenerator(selection){
    let width = 130;
    let height = 40;
    let margin =  DIMNS.block.children.margin;
    let contentsWidth;
    let contentsHeight;
    //children
    const updateDimns = () =>{
        contentsWidth = width - margin.left - margin.right;
        contentsHeight = height - margin.top - margin.bottom;
    }
    function mySelVis(selection){        
        selection.each(function(blockData){
            const visMargins =  { ...DIMNS.block.vis.margins, ...DIMNS.block.vis.get.margins }
            //console.log("selViz data", blockData)
            //visContentsG 
            const contentsG = d3.select(this).selectAll("g.vis-contents").data([blockData])
            //we call the merged version contents 
            const contentsGEnter = contentsG.enter()
                .append("g")
                .attr("class", "vis-contents")

            const contentsGMerged = contentsG.merge(contentsGEnter)
           
            //instances
            //@todo - could give each instancesDatum a uniqueId (not index) that doesnt change
            //even if previous ones are deleted. This would be 2nd arg of .data
            const instancesData = blockData.res || [];
            const instancesG = contentsGMerged.selectAll("g.instances").data([blockData])
            instancesG.enter()
                .append("g")
                .attr("class", "instances")
                .attr("fill", COLOURS.exp.vis.val)
                .merge(instancesG)
                //we need this coz user may delete the planet that is selected, 
                //and in that case we still want sel icons to stay, unless they delete whole block
                .attr("opacity", d => d.of.planet ? 1 : 0) 
                .each(function(){
                    const ellipseHeight = 0.8 * contentsHeight/instancesData.length;
                    const ellipseGap = 0.2 * contentsHeight/instancesData.length;
                    const instanceG = d3.select(this).selectAll("g.instance").data(instancesData)
                    const instanceGEnter = instanceG.enter()
                        .append("g")
                            .attr("class", "instance")
                            .attr("transform", (d,i) => "translate(0, " +(i * (ellipseHeight + ellipseGap)) + ")")

                    instanceGEnter
                        .append("ellipse")
                            .attr("cx", contentsWidth/2)
                            .attr("cy", ellipseHeight/2)
                            .attr("rx", contentsWidth/5)
                            .attr("ry", (d,i, nodes) => (0.5 * ellipseHeight))
                            .attr("stroke", COLOURS.exp.vis.val)
                            .attr("fill", "#C0C0C0")
                            .attr("stroke", "grey")

                })
    
        })
        return selection;
    }

    // api
    mySelVis.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        updateDimns();
        return mySelVis;
        };
    mySelVis.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        updateDimns();
        return mySelVis;
    };
    mySelVis.applicableContext = "Planet"
    mySelVis.funcType = "sel"
    
    return mySelVis;

    }
