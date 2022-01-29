import * as d3 from 'd3';
//import 'd3-selection-multi'; doesnt work, see https://github.com/d3/d3-selection-multi/issues/6
/*
Renders a ring around each planet, which has drag behaviour on it for creating a line between planets for relationship creation
*/
export function ellipse(selection, dispatch) {
    // vars
    let relationship = {};
    let relationshipGestureLine;
    // drag handling
    let wasMoved = false;

    let className = "";
    let rx = 50;
    let ry = 50;
    let fill = "#000000";
    let stroke = "#000000";
    let opacity = 1;
    let attrs = {};
    let container;

    //handlers
    let onDragStart = function () {};
    let onDrag = function () {};
    let onDragEnd = function () {};
    let onClick = function () {};

    function update(selection){
        const drag = d3.drag()
            .on("start", onDragStart)
            .on("drag", onDrag)
            .on("end", onDragEnd)
            .container(container); //todo - handle no container passed through ie default case could be function(){ return this.parentNode }

        selection.each(function (d) {
            const g = d3.select(this);
            //enter
            if(g.select("ellipse" +(className ? "."+className : ".")).empty()){
                g.append("ellipse")
                    .attr("class", className)
                    .attr("id", className + "-" + d.id)
            }
            //update
            g.select("ellipse" +(className ? "."+className : "."))
                .attr("rx", rx)
                .attr("ry", ry)
                .attr("fill", fill)
                .attr("stroke", stroke)
                .attr("opacity", opacity)
                //.call(drag)
                //.attrs(attrs); see top - doesnt work
        
        })

        selection.selectAll("ellipse" +(className ? "."+className : "."))
            .call(drag)

    };


    update.className = function (value) {
        if (!arguments.length) { return className; }
        if(typeof value === "string") { className = value;}
        return update;
    };
    update.rx = function (value) {
        if (!arguments.length) { return rx; }
        if(typeof value === "number") { rx = value;}
        return update;
    };
    update.ry = function (value) {
        if (!arguments.length) { return ry; }
        if(typeof value === "number") { ry = value;}
        return update;
    };
    update.fill = function (value) {
        if (!arguments.length) { return fill; }
        if(typeof value === "string") { fill = value;}
        return update;
    };
    update.stroke = function (value) {
        if (!arguments.length) { return stroke; }
        if(typeof value === "string") { stroke = value;}
        return update;
    };
    update.opacity = function (value) {
        if (!arguments.length) { return opacity; }
        if(typeof value === "number") { opacity = value;}
        return update;
    };
    update.onDragStart = function (value) {
        if (!arguments.length) { return onDragStart; }
        if (typeof value === "function") { onDragStart = value; }
        return update;
    };
    update.onDrag = function (value) {
        if (!arguments.length) { return onDrag; }
        if (typeof value === "function") { onDrag = value; }
        return update;
    };
    update.onDragEnd = function (value) {
        if (!arguments.length) { return onDragEnd; }
        if (typeof value === "function") { onDragEnd = value; }
        return update;
    };
    update.onClick = function (value) {
        if (!arguments.length) { return onClick; }
        if (typeof value === "function") { onClick = value; }
        return update;
    };
    update.container = function (value) {
        if (!arguments.length) { return container; }
        container = value;
        return update;
    };

    return update;
}
