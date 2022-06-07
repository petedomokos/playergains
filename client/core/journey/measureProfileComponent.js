import * as d3 from 'd3';
//import "d3-selection-multi";
import { grey10, COLOURS, DIMNS, FONTSIZES } from "./constants";
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

    let textMargin = DIMNS.measure.text.margin;
    let textContentsWidth;
    let textContentsHeight;

    const nameHeight = DIMNS.measure.name.height;
    const descAndTargetsHeight = contentsHeight - nameHeight;
    const targsHeight = d3.max([descAndTargetsHeight * 0.3, DIMNS.measure.targs.minHeight])
    let descHeight;

    function updateDimns(){
        margin = customMargin || { 
            left: d3.min([width * 0.05, DIMNS.measure.maxMargin.left]),
            right: d3.min([width * 0.05, DIMNS.measure.maxMargin.right]),
            top: d3.min([height * 0.05, DIMNS.measure.maxMargin.top]),
            bottom: d3.min([height * 0.05, DIMNS.measure.maxMargin.bottom])
        }
        contentsWidth = width - margin.left - margin.right;
        contentsHeight = height - margin.top - margin.bottom;

        textContentsWidth = contentsWidth - textMargin.left - textMargin.right;
        textContentsHeight = contentsHeight - textMargin.top - textMargin.bottom;

        descHeight = textContentsHeight - nameHeight - targsHeight;
    };
    let outerBgSettings = { fill: "none", stroke:"none", strokeWidth:0 }
    let bgSettings = { fill:"none", stroke:grey10(5), strokeWidth:0.2 }

    //handlers
    let onDragStart = function(){};
    let onDrag = function(){};
    let onDragEnd = function(){};
    let onClick = function(){};

    //dom
    let containerG;
    let outerBgRect;
    let contentsG;
    let bgRect;
    let textContentsG;
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
        contentsG.attr("transform", "translate(" +margin.left +"," +margin.top +")")
        textContentsG.attr("transform", "translate(" +textMargin.left +"," +textMargin.top +")")

        const { name="", desc="", targs=[] } = data;

        withClick.onClick(onClick)
        const drag = d3.drag()
            .on("start", withClick(dragStart))
            .on("drag", withClick(dragged))
            .on("end", withClick(dragEnd));

        contentsG.call(drag);

        outerBgRect
        .attr("width", width)
        .attr("height", height)
        .attr("fill",  outerBgSettings.fill)
        .attr("stroke", outerBgSettings.stroke)
        .attr("stroke-width", outerBgSettings.strokeWidth);

        bgRect
            .attr("width", contentsWidth)
            .attr("height", contentsHeight)
            .attr("fill",  bgSettings.fill)
            .attr("stroke", bgSettings.stroke)
            .attr("stroke-width", bgSettings.strokeWidth);

        nameText
            .attr("transform", "translate("+textContentsWidth/2 +"," +nameHeight/2 +")")
            .text(name);
        
        descText
            .attr("transform", "translate(0," +nameHeight +")")
            .text(desc);

        targsText
            .attr("transform", "translate("+textContentsWidth/2 +"," +(textContentsHeight - targsHeight)+")")
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

            cloneG.select("rect.bg")
                .attr("fill", COLOURS.selectedMeasure) //need this as bgSettings havnt been changed yet at this point

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

        contentsG = containerG.append("g").attr("class", "contents measure-contents")
        //use a hidden outerBg so mouseover works in gaops between measures
        outerBgRect = contentsG.append("rect").attr("class", "outer-bg")
        bgRect = contentsG.append("rect").attr("class", "bg")
        textContentsG = contentsG.append("g").attr("class", "contents text-contents")

        nameG = textContentsG.append("g").attr("class", "name");
        nameText = nameG
            .append("text")
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "central")
                .attr("font-size", FONTSIZES.measure.name);

        descG = textContentsG.append("g").attr("class", "desc");
        descText = descG
            .append("text")
                .attr("text-anchor", "start")
                .attr("dominant-baseline", "hanging")
                .attr("font-size", FONTSIZES.measure.desc);

        targsG = textContentsG.append("g").attr("class", "targs");
        targsText = targsG
            .append("text")
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "central")
                .attr("font-size", FONTSIZES.measure.targs);

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
