import * as d3 from 'd3';
//import "d3-selection-multi";
import { grey10, COLOURS, DIMNS } from "./constants";
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
    const newMeasureBtnWidth = 20;
    const newMeasureBtnHeight = 10;
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

    //dom
    let containerG;
    let contentsG;
    let titleG;
    let titleText;
    let subtitleG;
    let subtitleText;
    let newMeasureBtnG;
    let measuresG;
    let bgRect;

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
        })

        function update(data, options={}){
            const { measures, title, subtitle } = data;

            bgRect.attr("width", width).attr("height", height);
            measuresG.attr("transform", "translate(0," +titleHeight +")");

            titleG.attr("transform", "translate(0," +titleHeight/2 +")")
            titleText.text(title);
            subtitleG.attr("transform", "translate(" +mainTitleWidth +",0)");
            subtitleText.text(subtitle);

            newMeasureBtnG
                .attr("transform", "translate("+(contentsWidth - newMeasureBtnWidth) +",2.5)")
                .style("cursor", "pointer")

            newMeasureBtnG.select("rect")
                .attr("width", newMeasureBtnWidth)
                .attr("height", newMeasureBtnHeight)

            newMeasureBtnG.select("text")
                .attr("transform", "translate("+newMeasureBtnWidth/2 +"," +newMeasureBtnHeight/2 +")")

            const measureG = measuresG.selectAll("g.measure").data(measures);
            measureG.enter()
                .append("g")
                    .attr("class", "measure")
                    .each(function(d){
                        const measureG = d3.select(this);
                        measureG
                            .append("rect")
                               .attr("class", "bg")
                               .attr("stroke", grey10(5))
                               .attr("stroke-width", 0.2)
                    })
                    .merge(measureG)
                    .attr("transform", (d,i) =>  "translate("+(i * (measureWidth + measureMarginRight)) +",0)")
                    .each(function(d){
                        const measureG = d3.select(this);
                        measureG.select("rect.bg")
                            .attr("width", measureWidth)
                            .attr("height", measureHeight)
                            .attr("fill", d.isHovered ? "aqua" : grey10(2))

                    
                    })

        }

        function init(){
            containerG = d3.select(this);

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

            newMeasureBtnG = contentsG
                .append("g")
                .attr("class", "new-measure-btn")
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

    return measuresBar;
}
