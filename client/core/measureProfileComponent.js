import * as d3 from 'd3';
//import "d3-selection-multi";
import { grey10, COLOURS, DIMNS } from "./constants";
import { getTransformation } from './helpers';
import dragEnhancements from './enhancedDragHandler';
/*

*/
export default function measureProfileComponent() {
    // dimensions
    let margin;
    let customMargin;
    let width = 400;
    let height = 400;
    let contentsWidth;
    let contentsHeight;

    const nameHeight = 20;
    const descAndTargetsHeight = contentsHeight - nameHeight;
    const targsHeight = d3.max([10, descAndTargetsHeight * 0.3])
    let descHeight;

    function updateDimns(){
        margin = customMargin || { 
            left: d3.min([width * 0.05, 10]),
            right: d3.min([width * 0.05, 10]),
            top: d3.min([height * 0.05, 10]),
            bottom: d3.min([height * 0.05, 10])
        }
        contentsWidth = width - margin.left - margin.right;
        contentsHeight = height - margin.top - margin.bottom;
        descHeight = contentsHeight - nameHeight - targsHeight;
    };

    let bgSettings = { fill:"none", stroke:grey10(5), strokeWidth:0.2 }

    //handlers
    let onDragStart = function(){};
    let onDrag = function(){};
    let onDragEnd = function(){};
    let onClick = function(){};

    //dom
    let containerG;
    let contentsG;
    let bgRect;
    let nameG;
    let nameText;
    let descG;
    let descText;
    let targsG;
    let targsText;

    let prevData;

    let withClick = dragEnhancements();

    function measureProfile(selection) {
        updateDimns();
        selection.each(function (data) {
            containerG = d3.select(this);
            //console.log("measureProfile data", data)
            if(containerG.select("g.measure-contents").empty()){
                //enter
                init.call(this);
                update(data);
            }else{
                //update
                update(data);
            }

            prevData = data;
        })
        return selection;
    }

    function update(data, options={}){
        const { name="", desc="", targs=[] } = data;

        withClick.onClick(onClick)
        const drag = d3.drag()
            .on("start", withClick(dragStart))
            .on("drag", withClick(dragged))
            .on("end", withClick(dragEnd));


        containerG.call(drag);

        bgRect
            .attr("width", width)
            .attr("height", height)
            .attr("fill",  bgSettings.fill)
            .attr("stroke", bgSettings.stroke)
            .attr("stroke-width", bgSettings.strokeWidth);

            nameText
            .attr("transform", "translate("+contentsWidth/2 +"," +nameHeight/2 +")")
            .text(name);
        
        descText
            .attr("transform", "translate(0," +nameHeight +")")
            .text(desc);

        targsText
            .attr("transform", "translate("+contentsWidth/2 +"," +(contentsHeight - targsHeight)+")")
            .text("targets");

        let cloneG;
        let clonePos;
        //note - dragstart abd dragEnd here are al;ways called, even if its a click
        //@todo - consider changin teh enhanced drag handler so it only calls dragstart
        //after wasMoved is triggered, and dragend is only called if not click
        //change wasMoved to isDrag, and call dragStart when it changes to true, and 
        //only call dragEnd on end event if isDrag=true
        function dragStart(e,d){
            const { translateX, translateY } = getTransformation(d3.select(this))
            clonePos = [translateX, translateY];
            cloneG = d3.select(this)
                .clone(true)
                .classed("clone-"+d.id, true)
                .attr("pointer-events", "none");

            onDragStart.call(this, e, d);
        }

        function dragged(e,d){
            clonePos = [clonePos[0] += e.dx, clonePos[1] += e.dy]
            cloneG.attr("transform", "translate(" +clonePos[0] +"," +clonePos[1] +")");
            onDrag.call(this, e, d)
        }

        function dragEnd(e,d){
            cloneG.remove();
            if(!withClick.isClick()){
                onDragEnd.call(this, e, d);
            }
        }

    }

    function init(){
        bgRect = containerG
            .append("rect")
                .attr("class", "bg")

        contentsG = containerG
            .append("g")
                .attr("class", "contents measure-contents")
                .attr("transform", "translate(" +margin.left +"," +margin.top +")")

        nameG = contentsG.append("g").attr("class", "name");
        nameText = nameG
            .append("text")
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "central")
                .attr("font-size", 7);

        descG = contentsG.append("g").attr("class", "desc");
        descText = descG
            .append("text")
                .attr("text-anchor", "start")
                .attr("dominant-baseline", "hanging")
                .attr("font-size", 5);

        targsG = contentsG.append("g").attr("class", "targs");
        targsText = targsG
            .append("text")
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "central")
                .attr("font-size", 5);

        contentsG.selectAll("g").style("pointer-events", "none")

    }

    //api
    measureProfile.margin = function (value) {
        if (!arguments.length) { return customMargin || margin; }
        customMargin = { ...customMargin, ...value};
        return measureProfile;
    };
    measureProfile.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        return measureProfile;
    };
    measureProfile.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        return measureProfile;
    };
    measureProfile.bgSettings = function (value, withUpdate) {
        if (!arguments.length) { return bgSettings; }
        bgSettings = { ...bgSettings, ...value};
        if(withUpdate) { update(prevData); }
        return measureProfile;
    };
    measureProfile.onDragStart = function (value) {
        if (!arguments.length) { return onDragStart; }
        onDragStart = value;
        return measureProfile;
    };
    measureProfile.onDrag = function (value) {
        if (!arguments.length) { return onDrag; }
        onDrag = value;
        return measureProfile;
    };
    measureProfile.onDragEnd = function (value) {
        if (!arguments.length) { return onDragEnd; }
        onDragEnd = value;
        return measureProfile;
    };
    measureProfile.onClick = function (value) {
        if (!arguments.length) { return onClick; }
        onClick = value;
        return measureProfile;
    };

    return measureProfile;
}
