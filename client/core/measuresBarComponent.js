import * as d3 from 'd3';
//import "d3-selection-multi";
import { grey10, COLOURS, DIMNS } from "./constants";
import measureProfileComponent from "./measureProfileComponent";
/*

*/
export default function measuresBarComponent() {
    // dimensions
    let margin;
    let customMargin;
    let width = 4000;
    let height = 2600;
    let contentsWidth;
    let contentsHeight;

    const mainTitleWidth = 42;
    const titleHeight = 20;
    const btnWidth = 30;
    const btnGap = 5;
    const btnHeight = 10;
    let measuresHeight;
    let measureWidth = 50;
    let measureHeight;
    const measureMarginRight = 10;


    function updateDimns(){
        margin = customMargin || { 
            left: d3.min([width * 0.05, 10]),
            right: d3.min([width * 0.05, 10]),
            top: d3.min([height * 0.05, 10]),
            bottom: d3.min([height * 0.05, 10])
        }
        contentsWidth = width - margin.left - margin.right;
        contentsHeight = height - margin.top - margin.bottom;
        measuresHeight = contentsHeight - titleHeight;
        measureHeight = measuresHeight;
    };

    //handlers
    let openNewMeasureForm = () => {};
    let openImportMeasuresComponent = () => {};
    let onUpdateSelected = () => {};
    let onMeasureDragStart = () => {};
    let onMeasureDrag = () => {};
    let onMeasureDragEnd = () => {};

    //dom
    let containerG;
    let contentsG;
    let titleG;
    let titleText;
    let subtitleG;
    let subtitleText;
    let newMeasureBtnG;
    let importMeasuresBtnG;
    let measuresG;
    let bgRect;

    //components
    let measureProfiles = {};

    //state
    let selected;
    let dragged;
    let clicked;


    let prevData;

    function measuresBar(selection) {
        updateDimns();
        selection.each(function (data) {
            containerG = d3.select(this);
            //console.log("measures bar data", data)
            if(containerG.select("g.measures-bar-contents").empty()){
                //enter
                init.call(this);
                update(data);
            }else{
                //update
                update(data);
            }

            prevData = data;
        })

        function update(data, options={}){
            const { measures, title, subtitle } = data;

            bgRect.attr("width", width).attr("height", height);
            measuresG.attr("transform", "translate(0," +titleHeight +")");

            titleG.attr("transform", "translate(0," +titleHeight/2 +")");
            titleText.text(title);
            subtitleG.attr("transform", "translate(" +mainTitleWidth +",0)");
            subtitleText.text(subtitle);

            //btns
            //@todo - use enter-update with btnsData
            contentsG.selectAll("g.btn").select("rect")
                .attr("width", btnWidth)
                .attr("height", btnHeight);
            
            contentsG.selectAll("g.btn").select("text")
                .attr("transform", "translate("+btnWidth/2 +"," +btnHeight/2 +")");

            newMeasureBtnG
                .attr("transform", "translate("+(contentsWidth - (btnWidth * 2) - btnGap) +",2.5)");
            
            importMeasuresBtnG
                .attr("transform", "translate("+(contentsWidth - btnWidth) +",2.5)");

            const measuresData = measures.map(m => ({
                ...m,
                isSelected:selected === m.id
            }));
            
            const measureG = measuresG.selectAll("g.measure").data(measuresData, m => m.id);
            measureG.enter()
                .append("g")
                    .attr("class", "measure")
                    .attr("pointer-events", "all")
                    .each(function(d){ measureProfiles[d.id] = measureProfileComponent(); })
                    .merge(measureG)
                    .attr("transform", (d,i) =>  "translate("+(i * (measureWidth + measureMarginRight)) +",0)")
                    .each(function(d){
                        d3.select(this)
                            .call(measureProfiles[d.id]
                                .bgSettings({ fill: d.isSelected ? "aqua" : "none" })
                                .width(measureWidth)
                                .height(measureHeight)
                                .onClick(function(e, d){
                                    dragged = undefined;
                                    clicked = d.id;
                                })
                                .onDragStart((e,d) => {
                                    //cant rely on mouseover as may be touch
                                    selected = d.id;
                                    //and if clicked, measure stays selected until anoither measure is clicked,
                                    //or measure bar is closed or measurebackground clicked
                                    dragged = d.id;
                                    onMeasureDragStart.call(this, e, d)
                                })
                                .onDrag(onMeasureDrag)
                                .onDragEnd((e,d) => {
                                    //note - measure stays selected after drag until mouseout or another is clicked
                                    dragged = undefined;
                                    onMeasureDragEnd.call(this, e, d)
                                }));
                    })
                    .on("mouseover", function(e, d){
                        selected = d.id;
                        update(prevData)
                        //pass to journey to update planets
                        onUpdateSelected(d.id)
                    })
                    .on("mouseout", function(e, d){
                        //keep it selected if its being dragged
                        if(dragged === d.id || clicked === d.id) { return; }
                        selected = undefined;
                        update(prevData);
                        //pass to journey to update planets
                        onUpdateSelected(undefined);
                    })

        }

        function init(){
            containerG = d3.select(this)
                //()); //prevents zoom/click being triggered on canvas underneath

            bgRect = containerG
                .append("rect")
                    .attr("class", "bg")
                    .attr("fill",  grey10(2));

            contentsG = containerG
                .append("g")
                    .attr("class", "contents measures-bar-contents")
                    .attr("transform", "translate(" +margin.left +"," +margin.top +")")

            titleG = contentsG.append("g").attr("class", "title");
            subtitleG = titleG.append("g").attr("class", "subtitle");
            titleText = titleG
                .append("text")
                    .attr("class", "main")
                    .attr("font-size", 10);
            
            titleG.selectAll("text").attr("dominant-baseline", "text-bottom")

            subtitleText = subtitleG
                .append("text")
                    .attr("font-size", 5);

            //new btn
            newMeasureBtnG = contentsG
                .append("g")
                .attr("class", "btn new-measure-btn")
                .style("cursor", "pointer")
                .on("click", openNewMeasureForm);

            newMeasureBtnG
                .append("rect")
                    .attr("fill", "transparent")
                    .attr("stroke", grey10(8))
                    .attr("stroke-width", 0.1);

            newMeasureBtnG
                .append("text")
                    .attr("text-anchor", "middle")
                    .attr("dominant-baseline", "central")
                    .attr("font-size", 8)
                    .text("New");

            //import btn
            importMeasuresBtnG = contentsG
                .append("g")
                .attr("class", "btn import-measures-btn")
                .style("cursor", "pointer")
                .on("click", openImportMeasuresComponent);

            importMeasuresBtnG
                .append("rect")
                    .attr("fill", "transparent")
                    .attr("stroke", grey10(8))
                    .attr("stroke-width", 0.1);

            importMeasuresBtnG
                .append("text")
                    .attr("text-anchor", "middle")
                    .attr("dominant-baseline", "central")
                    .attr("font-size", 8)
                    .text("Import");

            measuresG = contentsG.append("g").attr("class", "measures");


        }

        return selection;
    }

    //api
    measuresBar.margin = function (value) {
        if (!arguments.length) { return customMargin || margin; }
        customMargin = { ...customMargin, ...value};
        return measuresBar;
    };
    measuresBar.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        return measuresBar;
    };
    measuresBar.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        return measuresBar;
    };
    measuresBar.openNewMeasureForm = function (value) {
        if (!arguments.length) { return openNewMeasureForm; }
        openNewMeasureForm = value;
        return measuresBar;
    };
    measuresBar.openImportMeasuresComponent = function (value) {
        if (!arguments.length) { return openImportMeasuresComponent; }
        openImportMeasuresComponent = value;
        return measuresBar;
    };
    measuresBar.onMeasureDragStart = function (value) {
        if (!arguments.length) { return onMeasureDragStart; }
        onMeasureDragStart = value;
        return measuresBar;
    };
    measuresBar.onUpdateSelected = function (value) {
        if (!arguments.length) { return onUpdateSelected; }
        onUpdateSelected = value;
        return measuresBar;
    };
    measuresBar.onMeasureDrag = function (value) {
        if (!arguments.length) { return onMeasureDrag; }
        onMeasureDrag = value;
        return measuresBar;
    };
    measuresBar.onMeasureDragEnd = function (value) {
        if (!arguments.length) { return onMeasureDragEnd; }
        onMeasureDragEnd = value;
        return measuresBar;
    };
    measuresBar.selected = function (value) {
        if (!arguments.length) { return selected; }
        selected = value;
        return measuresBar;
    };
    measuresBar.dragged = function () {
        return dragged;
    };

    return measuresBar;
}
