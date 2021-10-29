import * as d3 from 'd3';
import { COLOURS, DIMNS } from "../constants"

/*
We call a diffrent boxGenerator for each boxG

*/
export function expressionBoxGenerator(selection){
    //todo - work out why heights and widths are not dynamically being upated
    let width = 130;
    let height = 50;
    let margin =  DIMNS.block.children.margin;
    let contentsHeight;
    let contentsWidth;
    const updateDimns = () =>{
        contentsWidth = width - margin.left - margin.right;
        contentsHeight = height - margin.top - margin.bottom;
    }

    //dom
    //store contents on a separate g that can be removed if op or context changes without affecting the EUE pattern
    let contentsG;
    let textContentsG;

    //Note: We call a different boxGenerator for each boxG, so i is always 0
    function myExpressionBox(selection){
        //selection is a single boxG so i always 0
        selection.each(function(blockData){
            const { func, subFunc, of, isActive } = blockData;

            updateDimns();
            //console.log("expBox",blockData)
            const boxG = d3.select(this);
            //ENTER
            if(boxG.select("*").empty()){
                contentsG = boxG.append("g").attr("class", "contents");
                //background
                contentsG
                    .append("rect")
                    .attr("class", "background");

                //text
                contentsG
                    .append("text")
                        .attr("class", "pre")
                        .attr("stroke-width", 0.1)
                        .attr("transform", "translate(5,5)")
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "hanging")
                        .attr("font-size", 10)
                        .attr("fill", COLOURS.exp.box.pre)

                contentsG
                    .append("text")
                        .attr("class", "primary")
                        .attr("stroke-width", 0.1)

                contentsG
                    .append("text")
                        .attr("class", "secondary")
                        .attr("stroke-width", 0.1)
                        .attr("font-size", 10)
                        //.attr("dominant-baseline", "text-bottom")
                    
            }
            //UPDATE
            //@todo - have another g which translates the left and right margin
            //background
            contentsG.select("rect.background")
                .attr("transform", "translate(+"+margin.left +"," + margin.right +")")
                .attr("width", contentsWidth).attr("height", contentsHeight)
                .attr("fill", isActive ? COLOURS.exp.box.bg.active : COLOURS.exp.box.bg.inactive)
            //text
            //note - if func not defined, then planet/prop is also not defined becuse it would at least be 'sel'
            if(func){
                if(func.id === "home-sel"){
                    //show planet in middle
                    contentsG.select("text.primary")
                        .attr("transform", "translate(" +(width * 0.5) +"," +(height * 0.5) +")")
                        .attr("text-anchor", "middle")
                        .attr("font-size", 12)
                        .attr("fill", COLOURS.exp.box.planet)
                        .text(of.planet.name.slice(0, of.planet.name.length-1))
                    
                    contentsG.select("text.secondary").attr("opacity", 0)
                }
                else if(func.id === "sel" && !of.property){
                    //show planet in middle
                    contentsG.select("text.primary")
                        .attr("transform", "translate(" +(width * 0.5) +"," +(height * 0.5) +")")
                        .attr("text-anchor", "middle")
                        .attr("font-size", 12)
                        .attr("fill", COLOURS.exp.box.planet)
                        .text(of.planet.name)
                    
                    contentsG.select("text.secondary").attr("opacity", 0)
                }
                else if(func.id === "sel"){
                    //show planet and property (case of no prop is handled above)
                    contentsG.select("text.primary")
                        .attr("transform", "translate(20," +(height * 0.5) +")")
                        .attr("text-anchor", "start")
                        .attr("font-size", 14)
                        .attr("fill", COLOURS.exp.box.planet)
                        .text(of.planet.name)
                    
                    contentsG.select("text.secondary")
                        .attr("transform", "translate(75," +(height * 0.5) +")")
                        .attr("text-anchor", "start")
                        .attr("fill", COLOURS.exp.box.property)
                        .text(of.property.name)
                }
                else{
                    //show func (and no secondary)
                    contentsG.select("text.primary")
                        .attr("transform", "translate(" +(width * 0.5) +"," +(height * 0.5) +")")
                        .attr("text-anchor", "middle")
                        .attr("font-size", 12)
                        .attr("fill", isActive ? COLOURS.editor.func.selected : COLOURS.exp.box.func)
                        .text(subFunc?.name || func.name) //only show func name if no subFunc
                    
                    contentsG.select("text.secondary").attr("opacity", 0)
                }
            }
            else{
                //show instruction
                contentsG.select("text.primary")
                    .attr("transform", "translate(" +(width * 0.5) +"," +(height * 0.5) +")")
                    .attr("text-anchor", "middle")
                    .attr("font-size", 12)
                    .attr("fill", COLOURS.instruction)
                    .text("Click something...")
                
                contentsG.select("text.secondary").attr("opacity", 0)
            }

            //pre-text
            if(func?.id === 'home-sel'){
                contentsG.select("text.pre")
                    .attr("transform", "translate(5,5)")
                    .attr("display", "inline")
                    .attr("text-anchor", "start")
                    .attr("dominant-baseline", "hanging")
                    .attr("font-size", 10)
                    .attr("fill", COLOURS.instruction)
                    .text("For each")
            }else{
                contentsG.select("text.pre").attr("display", "none")
            }

        })

        return selection;
    }

    // api
    myExpressionBox.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        //updateDimns();
        return myExpressionBox;
        };
    myExpressionBox.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        //updateDimns();
        return myExpressionBox;
    }
    myExpressionBox.applicableContext = "Planet"
    myExpressionBox.funcType = "get"
    
    return myExpressionBox;

    }
