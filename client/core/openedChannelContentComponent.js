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

    let tooltipWidth = 150;
    let tooltipHeight = 60;

    function updateDimns(){
        contentsWidth = width - margin.left - margin.right;
        contentsHeight = height - margin.top - margin.bottom;
    };

    let labelSettings = {};
    let hoveredGoalId;
    let mouseoutTimer;

    //dom
    let containerG;
    let contentsG;
    let barChartG;

    //components
    const barChart = barChartComponent();
    const tooltip = tooltipComponent();

    function openedChannelContent(selection) {
        updateDimns();
        const data = selection.datum();
        //console.log("occ data", data)
        const { id, goalsData: { barChartData, tooltipData } } = data;

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
                        //@todo - bug - if going out then back in before timer ends, it sometimes errors - "transition 60 not found"
                        if(mouseoutTimer) { 
                            //console.log("stop timer!!!!!!!!!!")
                            mouseoutTimer.stop();}
                        //parentNode is the linkG
                        d3.select(containerG.node().parentNode).raise();
                        hoveredGoalId = d.id;
                        update();
                    })
                    .onMouseout(() => {
                        mouseoutTimer = d3.timeout(() => {
                            hoveredGoalId = undefined;
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
            //shift to right but not so far that it goes under a planet
            //@todo - raise links layer or do soemthing to avoid planet clashes without the links showing above planets
            const tooltipG = contentsG.selectAll("g.tooltip").data(tooltipData.filter(g => g.goalId === hoveredGoalId))
            tooltipG.enter()
                .append("g")
                    .attr("class", "tooltip")
                    .merge(tooltipG)
                    .attr("transform", "translate("+(contentsWidth * 0.5) +"," +(contentsHeight * 1.1) +")")
                    .call(tooltip
                        .width(tooltipWidth)
                        .height(tooltipHeight)) 

            tooltipG.exit().remove();
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