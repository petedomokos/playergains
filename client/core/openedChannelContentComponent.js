import * as d3 from 'd3';
import barChartComponent from './barChartComponent';
import tooltipComponent from './tooltipComponent';

/*

*/
export default function openedChannelContentComponent() {
    // dimensions
    let width = 600;
    let height = 600;
    let margin = { left:0, right:0, top:0, bottom:0 }
    let contentsWidth;
    let contentsHeight;

    function updateDimns(){
        contentsWidth = width - margin.left - margin.right;
        contentsHeight = height - margin.top - margin.bottom;
    };

    let labelSettings = {};
    let hovered;
    let mouseoutTimer;

    //dom
    let containerG;
    let contentsG;
    let barChartG;
    let tooltipG;

    //components
    const barChart = barChartComponent();
    const tooltip = tooltipComponent();

    function openedChannelContent(selection) {
        updateDimns();
        const data = selection.datum();
        const { barChartData } = data;

        if(!contentsG || contentsG.empty()){ init();}
        update();            

        function init(){
            containerG = selection;
            contentsG = containerG.append("g").attr("class", "contents");
            //bar
            barChartG = containerG
                .append("g")
                    .attr("class", "bar-chart")
                    .attr("opacity", 0)
                    .attr("display", "none");
            
            //tooltip
            tooltipG = containerG
                .append("g")
                    .attr("class", "tooltip");
        }

        function update(){
            contentsG.attr("transform", "translate("+margin.left +"," +margin.top +")");
            //bar chart
            containerG.select("g.bar-chart")
                //.attr("display", d.isOpen ? "inline" : "none")
                .datum(barChartData)
                .call(barChart
                    .width(contentsWidth)
                    .height(contentsHeight)
                    .labelSettings(labelSettings)
                    .onMouseover((e,d) => { 
                        if(mouseoutTimer) { mouseoutTimer.stop();}
                        hovered = d;
                        update();
                    })
                    .onMouseout(() => {
                        mouseoutTimer = d3.timeout(() => {
                            hovered = undefined;
                            update();
                        }, 500)
                    }))
            //fade in and out bar chart
            if(data.isOpen && barChartG.attr("opacity") === "0"){
                barChartG
                    .attr("display", "inline")
                    .transition()
                        .delay(100)
                        .duration(400)
                        .attr("opacity", 1)
            }
            if(!data.isOpen && barChartG.attr("opacity") === "1"){
                //@todo - put transition back but mak eit synced with close channel transition so it doesnt jump
                barChartG
                    //.transition()
                        //.delay(100)
                        //.duration(400)
                        .attr("opacity", 0)
                        .attr("display", "none")
            }

            //tooltip
            tooltipG
                .attr("transform", "translate(0," +(contentsHeight * 1.1) +")")
                //.attr("display", hovered ? "inline" : "none")
                //.attr("opacity", hovered ? 1 : 0)
                .datum(hovered)
                .call(tooltip
                    .width(contentsWidth)
                    .height(60)) 
            //@todo fade in /out
        }

        return selection;
    }     

    openedChannelContent.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        return openedChannelContent;
    };
    openedChannelContent.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        return openedChannelContent;
    };
    openedChannelContent.margin = function (value) {
        if (!arguments.length) { return margin; }
        margin = { ...margin, ...value };
        if(containerG)
        return openedChannelContent;
    };
    openedChannelContent.labelSettings = function (value) {
        if (!arguments.length) { return labelSettings; }
        labelSettings = { ...labelSettings, value };
        return openedChannelContent;
    };
    return openedChannelContent;
}