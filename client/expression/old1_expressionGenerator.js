import * as d3 from 'd3';
import { planetData, getInstances } from './data';
/*

*/
export default function expressionGenerator() {
    // api vars
    let width = 600;
    let height = 500;
    let selections = {
        from:"sites",
        get:"devices"
    };

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
                    .attr("stroke", "blue")
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
                        .attr("stroke", "blue")
                        .style("cursor", "pointer")
                        .call(propertyDrag);
            })

            //expression box
            const boxWidth = 500;
            const boxHeight = 200;
            //TITLE LINE
            const boxTitleHeight = 30;
            const paddingLeft = 10;
            const paddingTop = 20;
            //from
            const fromWidth = 50;
            //get
            const getWidth = 30;
            //planet name
            const planetNameMarginTop = 10;

            //INSTANCES
            const instancesMarginTop = 10;
            const instanceHeight = 20;
            const instanceWidth = 100;
            const instanceMarginBottom = 5;
            const instanceMarginRight = 20;
            const instanceMarginLeft = 15;
            const equalSignWidth = 30;
            const equalSignMarginRight = 5;

            const boxG = containerG.append("g")
                .attr("class", "box")
                .attr("transform", "translate(" + (planetWidth +planetMarginRight) + ", 10)")

            boxG
                .append("rect")
                    .attr("width", boxWidth)
                    .attr("height", boxHeight)
                    .attr("fill", "white")

            const boxTitleG = boxG
                .append("g")
                    .attr("class", "box-title-g")
                    .attr("transform", "translate(" + paddingLeft + ", " +paddingTop + ")")
            
            //from 
            boxTitleG
                    .append("text")
                    //.attr("transform", "translate(" + (instanceWidth + instanceMarginRight) + ", " + (0) + ")")
                    .attr("font-size", 16)
                    .attr("fill", "blue")
                    .text("From")
            
            //planet name
            boxTitleG
                .append("text")
                    .attr("transform", "translate(" +fromWidth +", " +planetNameMarginTop + ")")
                    .text(selections.from ? planetData.find(p => p.id === selections.from).name : ".........")

            //planet filters
            /*
            boxTitleG
                .append("text")
                    .attr("transform", "translate(" +fromWidth +", " +planetNameMarginTop + ")")
                    .attr("font-size", 12)
                    .attr("fill", "red")
                    .text(selections.from ? "Count" : "")*/


            //get 
            boxTitleG
                .append("text")
                    .attr("transform", "translate(" + (instanceMarginLeft + instanceWidth) + ", " + (0) + ")")
                    .attr("text-anchor", "middle")
                    .attr("font-size", 16)
                    .attr("fill", "blue")
                    .text("Get")
            //second planet name
            boxTitleG
                .append("text")
                    .attr("transform", "translate(" +(instanceMarginLeft + instanceWidth + getWidth)+", " +planetNameMarginTop + ")")
                    .text(selections.get ? planetData.find(p => p.id === selections.get).name : ".........")

            //return
            boxTitleG
                .append("text")
                    .attr("transform", "translate(" + (instanceMarginLeft + instanceWidth) + ", " + (0) + ")")
                    .attr("text-anchor", "middle")
                    .attr("font-size", 16)
                    .attr("fill", "blue")
                    .text("Return")
            //second planet name
            boxTitleG
                .append("text")
                    .attr("transform", "translate(" +(instanceMarginLeft + instanceWidth + getWidth)+", " +planetNameMarginTop + ")")
                    .text(selections.get ? planetData.find(p => p.id === selections.get).name : ".........")

             //second planet subname
             /*
             boxTitleG
             .append("text")
                 .attr("transform", "translate(" +fromWidth +", " +planetNameMarginTop + ")")
                 .attr("font-size", 12)
                 .attr("fill", "red")
                 .text(selections.from ? "Count" : "")*/

            //instances
            const instancesContainerG = boxG.append("g")
                .attr("class", "instances")
                .attr("transform", "translate(" +(paddingLeft + instanceMarginLeft) + ", " +(paddingLeft + boxTitleHeight +instancesMarginTop)  + ")")

            const instanceG = instancesContainerG.selectAll("g.instance").data(getInstances(selections.from) || []);
            const instanceGEnter = instanceG.enter()
                .append("g")
                .attr("class","instance")
                .attr("transform", (d,i) => {
                    console.log("entered") 
                    return "translate(0, " +(i * (instanceHeight + instanceMarginBottom))  + ")";
                })

            instanceGEnter
                .append("rect")
                    .attr("width", instanceWidth)
                    .attr("height", instanceHeight)
                    .attr("fill", "grey")

            instanceGEnter
                .append("text")
                .attr("transform", "translate(" + (instanceWidth + instanceMarginRight) + ", " + (instanceHeight/2) + ")")
                .attr("font-size", 16)
                .attr("dominant-baseline", "middle")
                .text("=")

            instanceGEnter
                .append("text")
                .attr("transform", "translate(" +(instanceWidth + instanceMarginRight + equalSignWidth + equalSignMarginRight) + ", " +(instanceHeight/2)  + ")")
                .attr("font-size", 16)
                .attr("dominant-baseline", "middle")
                .text( d => d.propertyValues.devices.length)




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
