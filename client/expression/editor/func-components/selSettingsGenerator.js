import * as d3 from 'd3';
import { COLOURS } from "../../constants"

export function selSettingsGenerator(selection){
    //dimensions
    let width = 350;
    let height = 100;
    let margin =  { top: 10, bottom:10, left:10, right:10 };
    let contentsWidth;
    let contentsHeight;
    const updateDimns = () =>{
        contentsWidth = width - margin.left - margin.right;
        contentsHeight = height - margin.top - margin.bottom;
    }

    //dom
    let settingsG;
    let instructionText;
    let filterText;
    let planetText;
    let propertyText;

    //selected

    //components

    function mySelSettings(selection){
        selection.each(function(blockData){
            console.log("sel settings ", blockData)
            updateDimns();
            //ENTER
            if(!settingsG){
                settingsG = d3.select(this)

                instructionText = settingsG.append("text")
                    .attr("class", "instruction")
                    .attr("transform", "translate(30,20)")
                    //.attr("dominant-baseline", "hanging")
                    .attr("text-anchor", "start")
                    .attr("font-size", 10)
                    .attr("fill", COLOURS.instruction)

                //filter text
                filterText = settingsG.append("text")
                    .attr("class", "filter")
                    .attr("transform", "translate(5,10)")
                    //.attr("dominant-baseline", "middle")
                    .attr("text-anchor", "start")
                    .attr("font-size", 12)
                    .attr("fill", "red")

                //planet text
                planetText = settingsG.append("text")
                    .attr("class", "planet")
                    .attr("transform", "translate(30,20)")
                    //.attr("dominant-baseline", "hanging")
                    .attr("text-anchor", "start")
                    .attr("font-size", 14)
                    //.attr("fill", )
                

                //filter text
                propertyText = settingsG.append("text")
                    .attr("class", "property")
                    .attr("transform", "translate(90,20)")
                    //.attr("dominant-baseline", "hanging")
                    .attr("text-anchor", "start")
                    .attr("font-size", 12)
                    .attr("fill", "red")

            }

            //UPDATE
            const { of={} } = blockData;
            //@todo - deconstruct const { of:{ planet, property, filter } } = blockData
            console.log("planet", planet)
            //ins text will become dynamic so we put it here
            instructionText.text("Click planet or property")
            filterText.text(of.filter?.desc || "All")
            planetText.text(of.planet?.name || "")
            propertyText.text(of.property?.name || "")
            
        })
        return selection;
    }

    // api
    mySelSettings.width = function (value) {
        if (!arguments.length) { return width; }
        width = value;
        //updateDimns();
        return mySelSettings;
        };
    mySelSettings.height = function (value) {
        if (!arguments.length) { return height; }
        height = value;
        //updateDimns();
        return mySelSettings;
    };
    myAgg.funcType = "sel"
    return mySelSettings;

    }
