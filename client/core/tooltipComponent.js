import * as d3 from 'd3';
import { grey10 } from './constants';

/*

*/
export default function tooltipComponent() {
    // dimensions
    let margin = {left:5, right:5, top: 5, bottom:5};
    let width = 100;
    let height = 60;
    let contentsWidth;
    let contentsHeight;

    function updateDimns(){
        contentsWidth = width - margin.left - margin.right;
        contentsHeight = height - margin.top - margin.bottom;
    };

    let prevData;
    let entered = false;

    //dom
    let containerG;
    let contentsG;
    let bgG;
    let nameG;
    let startG;
    let currentG;
    let projectedG;

    function tooltip(selection) {
        updateDimns();
        const data = selection.datum();
        if(!data && !entered){ 
            return selection;
        }
        //enter
        if(data && !entered){ 
            containerG = selection;
            enter();
            entered = true;
        }

        if(!data && entered){
            exit();
            entered = false;
            return selection;
        }

        update();

        function enter(){
            containerG
                .attr("opacity", 0)
                .transition()
                    .duration(200)
                    .attr("opacity", 1);

            contentsG = containerG
                .append("g")
                    .attr("class", "contents")
                    .attr("transform", "translate(" +margin.left +"," +margin.top +")")
            
            bgG = contentsG
                .append("rect")
                    .attr("class", "bg")
                    .attr("fill", grey10(2))
            
            nameG = contentsG.append("text").attr("class", "name")
                .attr("text-anchor", "middle")
                .attr("font-size", 5)

            startG = contentsG.append("g").attr("class", "start")
            currentG = contentsG.append("g").attr("class", "curr")
            projectedG = contentsG.append("g").attr("class", "proj")

        }

        function update(){
            bgG
                .attr("width", contentsWidth)
                .attr("height", contentsHeight);

            nameG
                .attr("transform", "translate(" + (contentsWidth/2) + ",10)")
                .text(data?.title)
            //@todo - make it a table
            startG.attr("transform", "translate(10,10)");
            currentG.attr("transform", "translate(10,10)");
            projectedG.attr("transform", "translate(10,10)");
        }

        function exit(){
            //exit
            //@todo - transiton opacity
            containerG
                .transition()
                    .duration(200)
                    .attr("opacity", 1)
                    .on("end", function (){
                        d3.select(this).selectAll("*").remove();
                    });
        }

        return selection;
    }

    //api
    tooltip.margin = function (value) {
        if (!arguments.length) { return margin; }
        margin = { ...margin, ...value};
        return tooltip;
    };
    tooltip.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        return tooltip;
    };
    tooltip.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        return tooltip;
    };

    return tooltip;
}
