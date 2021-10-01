import { SelectAllRounded } from '@material-ui/icons';
import * as d3 from 'd3';
import { planetData, getInstances, returnOptions } from './data';
/*

*/
export default function expressionGenerator() {
    // api vars
    let width = 600;
    let height = 500;
    const fromBoxWidth = 200;
    const getBoxWidth = 100;
    const returnBoxWidth = 200;
    //@todo - make region filter values an array
    let boxesData = [
        {id:"from", label:"From", width:fromBoxWidth, filters:[{propertyName:"Region", value:"UK"}]}, 
        {id:"get", label:"Get", width:getBoxWidth, filters:[]}, 
        {id:"return", label:"Return", width:returnBoxWidth}
    ]

    let selections = {
        from:"sites",
        get:"devices",
        return:"total"
    };


    let instanceData = getInstances("sites");
    instanceData.sort((a, b) => d3.descending(a.propertyValues.devices.length, b.propertyValues.devices.length))

    // set up drag
    const planetDrag = d3.drag()
        .on("start", planetDragStart)
        .on("drag", planetDragged)
        .on("end", planetDragEnd);

    const propertyDrag = d3.drag()
        .on("start", propertyDragStart)
        .on("drag", propertyDragged)
        .on("end", propertyDragEnd);

    function expression(selection) {
        // expression elements
        selection.each(function () {
            //planet dimns
            const planetHeight = 80;
            const planetWidth = 100;
            const planetMarginBottom = 10;
            const planetMarginRight = 10;
            const propertyMarginBottom = 5;
            const planetNameWidth = planetWidth * 0.7;
            const planetNameHeight = 20;
            //property dimns
            const propertyHeight = 15;
            const propertyWidth = 50
            //container
            const svg = d3.select(this)
            const containerG = svg.append("g")
                .attr("transform", "translate(10, 10)")

            //PLANETS
            const planetContainerG = containerG.append("g")
                .attr("class", "planets-container")
                .attr("transform", "translate(0, 50)")

            //bind
            const planetG = planetContainerG.selectAll("g.planet").data(planetData, d => d.id);
            //enter
            const planetGEnter = planetG.enter()
                .append("g")
                    .attr("class", "planet")
                    .attr("transform", (d,i) => "translate(0,"+i*(planetHeight + planetMarginBottom) +")");
            
            planetGEnter
                .append("rect")
                    .attr("width", planetWidth)
                    .attr("height", planetHeight)
                    .attr("fill", "aqua")

            planetGEnter
                .append("text")
                    .attr("transform", "translate(5,5)")
                    .attr("dominant-baseline", "hanging")
                    .attr("font-size", 14)
                    .text(d => d.name)

            //hitbox
            planetGEnter
                .append("rect")
                    .attr("width", planetNameWidth)
                    .attr("height", planetNameHeight)
                    .attr("fill", "transparent")
                    .style("cursor", "pointer")
                    .call(planetDrag);

            //PLANET PROPERTY
            planetGEnter.each(function(planetD, i){
                //bind
                const propertyG = d3.select(this).selectAll("g.property").data(planetD.properties);
                //enter
                const propertyGEnter = propertyG.enter()
                    .append("g")
                    .attr("class", "property")
                    .attr("transform", (d,i) => "translate(10,"+(5 + planetNameHeight + i*(propertyHeight + propertyMarginBottom)) +")");

                propertyGEnter
                    .append("text")
                        .attr("transform", "translate(5,5)")
                        .attr("dominant-baseline", "hanging")
                        .attr("font-size", 12)
                        .attr("fill", "green")
                        .text(d => d.name);

                //hitbox
                propertyGEnter
                    .append("rect")
                        .attr("width", propertyWidth)
                        .attr("height", propertyHeight)
                        .attr("fill", "transparent")
                        .style("cursor", "pointer")
                        .call(propertyDrag);
            })

            //EXPRESSION
            const paddingLeft = 10;
            const paddingTop = 20;
            //expression
            const labelHeight = 30;
            const valueHeight = 25;
            const filtersLabelHeight = 20;
            const filtersValueHeight = 20;
            const filtersHeight = filtersLabelHeight + filtersValueHeight;
            const expressionHeight = labelHeight + valueHeight + filtersHeight;
            //visual
            const instanceRowHeight = 30;
            const topPanelHeight = 0;
            const bottomPanelHeight = 40;
            const visualHeight = instanceRowHeight * 5 + topPanelHeight + bottomPanelHeight;
            //box
            const boxHeight = expressionHeight + visualHeight;

            //BOXES
            const boxesG = containerG.append("g")
                .attr("class", "boxes")
                .attr("transform", "translate(" + (paddingLeft + planetWidth +planetMarginRight) + "," + paddingTop +")")

            const boxG = boxesG.selectAll("g.boxG").data(boxesData)

            const boxGEnter = boxG.enter()
                .append("g")
                .attr("class", "box")
                .attr("transform", d => {
                    const transX = d.label === "From" ? 0 : d.label === "Get" ? fromBoxWidth : (fromBoxWidth + getBoxWidth);
                    return "translate(" + transX + ",0)"
                })
                .call(boxBackground)
                .call(expressionComponent)
                .call(expressionComponentVisual)

            function boxBackground(selection){
                selection.each(function(d,i){
                    d3.select(this)
                        .append("rect")
                            .attr("width", d => d.width)
                            .attr("height", boxHeight)
                            .attr("fill", "white")
                            .attr("stroke", "#A9A9A9")
                            .attr("stroke-width", 1)
                })
                return selection;
            }

            function expressionComponent(selection){
                selection.each(function(d,i){
                    const containerG = d3.select(this).append("g")
                        .attr("class", "expression-component")
                    //label
                    containerG
                        .append("text")
                            .attr("transform", "translate(5," + (labelHeight/2) + ")")
                            .attr("dominant-baseline", "middle")
                            .attr("font-size", 16)
                            .attr("fill", "blue")
                            .text(d.label)

                    //value
                    containerG
                        .append("text")
                            .attr("transform", "translate(" +(d.width/2) +", " +(labelHeight + valueHeight/2) + ")")
                            .attr("dominant-baseline", "middle")
                            .attr("text-anchor", "middle")
                            .attr("font-size", 18)
                            .text(selections[d.id] ? [...planetData,...returnOptions].find(v => v.id === selections[d.id]).name : ".........")
                    console.log("d", d)
                    if(d.filters && d.filters.length != 0){
                        const filtersG = containerG.append("g")
                            .attr("class", "filters")
                            .attr("transform", "translate(5," + (labelHeight +valueHeight) + ")")

                        filtersG
                            .append("text")
                                .attr("transform", "translate(0," + (filtersLabelHeight/2) + ")")
                                .attr("dominant-baseline", "middle")
                                .attr("font-size", 16)
                                .attr("fill", "blue")
                                .text("Where")
                        
                        //@todo - use EU pattern - for now just grab the first
                        const filter1 = d.filters[0]
                        filtersG
                            .append("text")
                                .attr("transform", "translate(20," + (filtersLabelHeight + filtersValueHeight/2) + ")")
                                .attr("dominant-baseline", "middle")
                                .attr("font-size", 10)
                                .attr("fill", "green")
                                .text(filter1.propertyName + " is " +filter1.value)
                    }     
                })

                return selection;
            }

            function expressionComponentVisual(selection){
                selection.each(function(boxD,i){
                    //all box visuals have a container
                    const containerG = d3.select(this).append("g")
                        .attr("class", "expression-component-visual "+boxD.id)
                        .attr("transform", "translate(0, "+expressionHeight +")");

                    if(boxD.id === "return"){
                        //the return box is a completely different visual so it calls another function
                        displayReturnOptions(containerG, boxD, i);
                        return;
                    }
                    const snippedData =  instanceData.length <= 5 ? instanceData : [
                        ...instanceData.slice(0,3), 
                        {id:'placeholder', data:instanceData.slice(3, instanceData.length -2)},
                        ...instanceData.slice(instanceData.length -2, instanceData.length),
                    ]
                    console.log("snipped", snippedData)
                    //the from and get boxes share common code below
                    const instanceG = containerG.selectAll("g.instance").data(snippedData);
                    const instanceGEnter = instanceG.enter()
                        .append("g")
                        .attr("class","instance")
                        .attr("transform", (d,i) => {
                            //console.log("entered") 
                            return "translate(0, " +(i * (topPanelHeight + instanceRowHeight))  + ")";
                        })
                    
                    if(boxD.id === "from"){
                        //'from' visual
                        instanceGEnter
                            .append("rect")
                                .attr("x", boxD.width * 0.1)
                                .attr("y", instanceRowHeight * 0.1)
                                .attr("width", boxD.width * 0.8)
                                .attr("height", instanceRowHeight * 0.8)
                                //todo - no point in redering rect for place holders
                                .attr("display", d => d.id === "placeholder" ? "none" : "inline")
                                .attr("fill", "#A9A9A9")
                        instanceGEnter
                            .append("text")
                            .attr("dominant-baseline", "middle")
                            .attr("text-anchor", "middle")
                            .attr("transform", "translate(" +(boxD.width/2) + ", " +(instanceRowHeight/2)  + ")")
                            //.attr("font-size", d => d.id === "placeholder" ? 24 : 14)
                            .text(d => d.id === "placeholder" ? "..." : d.displayName);
                    }
                    else{
                        //'get' visual
                        instanceGEnter
                            .append("text")
                            .attr("transform", "translate(" + (boxD.width/2) + ", " + (instanceRowHeight/2) + ")")
                            .attr("dominant-baseline", "middle")
                            .attr("text-anchor", "middle")
                            .attr("font-size", 16)
                            .text(d => d.id === "placeholder" ? "..." : " = " + d.propertyValues.devices.length)
                    }
                })

                return selection;
            }

            function displayReturnOptions(containerG, boxD, i){
                //dimns
                //@todo - sort out as not quite in middle
                const optionBoxLength = (boxD.width / 3)*0.8;
                const optionMargin = (boxD.width / 3) * 0.1;
                const optionBoxesTotalHeight = 2 * optionBoxLength + 3 * optionMargin
                //EU pattern
                const optionG = containerG.selectAll("g.return-option").data(returnOptions);
                const optionGEnter = optionG.enter()
                    .append("g")
                    .attr("class", "return-option")
                    .attr("transform", (d,i) => {
                        const transX = optionMargin + (i % 3) * (optionMargin + optionBoxLength)
                        const n = i < 3 ? 0 : i < 6 ? 1 : 2;
                        const transY = optionMargin + n * (optionMargin + optionBoxLength);
                        return "translate("+transX +"," +transY + ")";
                    })

                optionGEnter
                    .append("rect")
                        .attr("width", optionBoxLength)
                        .attr("height", optionBoxLength)
                        .attr("fill", d => d.id === selections.return ? "#A9A9A9" : "#DCDCDC")
                optionGEnter
                    .append("text")
                        .attr("transform", "translate(" + (optionBoxLength/2) + ", " + (optionBoxLength * 0.2) + ")")
                        .attr("dominant-baseline", "middle")
                        .attr("text-anchor", "middle")
                        .attr("font-size", 12)
                        .attr("stroke", d => d.id === selections.return ? "white" : "black")
                        .attr("fill", d => d.id === selections.return ? "white" : "black")
                        .attr("stroke-width", 0.2)
                        .text(d => d.name)
                
                optionGEnter
                    .append("text")
                        .attr("transform", "translate(" + (optionBoxLength/2) + ", " + (optionBoxLength * 0.6) + ")")
                        .attr("dominant-baseline", "middle")
                        .attr("text-anchor", "middle")
                        .attr("font-size", 12)
                        .attr("stroke", d => d.id === selections.return ? "white" : "black")
                        .attr("fill", d => d.id === selections.return ? "white" : "black")
                        .attr("stroke-width", 0.2)
                        .text(d => {
                            const dataArray = instanceData.map(d => d.propertyValues.devices.length)
                            switch(d.id){
                                case "total":{
                                    return d3.sum(dataArray)
                                }
                                case "mean":{
                                    return d3.mean(dataArray).toFixed(1)
                                }
                                case "median":{
                                    return d3.median(dataArray)
                                }
                                case "min":{
                                    return d3.min(dataArray)
                                }
                                case "max":{
                                    return d3.max(dataArray);
                                }
                                case "stdDev":{
                                    return d3.deviation(dataArray).toFixed(1)
                                }
                                default: return "";
                            }
                            return d.name
                        })
                
            }
           
        });

        function update(){


        }

        return selection;
    }

    // click and drag handling
    //let wasMoved = false;
    //let startPoint;

    function planetDragStart(e, d) {
        //startPoint = { x: e.sourceEvent.clientX, y: e.sourceEvent.clientY };
    }

    function planetDragged(e, d) {
        console.log("plan dragged")
        //const currentPoint = { x: e.sourceEvent.clientX, y: e.sourceEvent.clientY };
        //if (distanceBetweenPoints(startPoint, currentPoint) < MIN_DRAG_DISTANCE) {
           // return;
        //}
        //@todo if(drag is in from) instead of this line
        if(!selections.from){
            selections.from = d.id
            
        }

    }

    function planetDragEnd(e, d) {
        //if (!wasMoved) {
           // handleClick(e, d);
           // return;
        //}
        
        // reset flag
        //wasMoved = false;
    }

    function handlePlanetClick(e, d) {
        console.log("planet clicked")
    }

    function propertyDragStart(e, d) {
        console.log("prop dragstart")
        //startPoint = { x: e.sourceEvent.clientX, y: e.sourceEvent.clientY };
    }
    
    function propertyDragged(e, d) {
        console.log("prop dragged")
        //const currentPoint = { x: e.sourceEvent.clientX, y: e.sourceEvent.clientY };
        //if (distanceBetweenPoints(startPoint, currentPoint) < MIN_DRAG_DISTANCE) {
           // return;
        //}
    }
    
    function propertyDragEnd(e, d) {
        //if (!wasMoved) {
           // handleClick(e, d);
           // return;
        //}
        
        // reset flag
        //wasMoved = false;
    }
    
    function handlePropertyClick(e, d) {
        console.log("prop clicked")
    }

    // api
    expression.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        return expression;
    };
    expression.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        return expression;
    };
    return expression;
}
