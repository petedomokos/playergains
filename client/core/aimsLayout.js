import * as d3 from 'd3';
import { getStartDate } from '../data/planets';
import { DIMNS } from './constants';

export default function aimsLayout(){
    let timeScale = x => 0;
    let yScale = x => 0;
    let currentZoom = d3.zoomIdentity;
    let channelsData;
    let planetsData = [];
    let canvasDimns = { width:800, height:600 };

    const aimMargin = DIMNS.aim.margin;

    function update(data){
        const aims = data.map(aim => {
            const { startDate, endDate, startYPC, endYPC } = aim;
            //console.log("aimlayout", aim)
            /*
            note - if all channels are closed, then planet s will all slide together (because distances are the same)
            so in that case, we dont need to use max and min, we can just apply the same slide
            But if a channel is open this could mean some planets slide and others dont.
            Need to keep it simple, esp for now.
            so for now, we just extend the space if necc, and user can reduce it 
            */

            //assume all planets same size
            let planetRX = planetsData[0]?.rx(DIMNS.planet.width) || 0;
            let planetRY = planetsData[0]?.ry(DIMNS.planet.height) || 0;

            const planets = planetsData.filter(p => p.aimId === aim.id);
            //console.log("planets", planets)
            const planetExtent = d3.extent(planets, p => p.x);
            //console.log("ext", planetExtent)
            const planetBounds = [
                planetExtent[0] - planetRX - aimMargin.left, 
                planetExtent[1] + planetRX + aimMargin.right
            ];
            const actualX = timeScale(startDate);
            const y = yScale(startYPC);
            const width = timeScale(endDate) - actualX;
            const height = yScale(endYPC) - y;
            //console.log("aimBounds", aimBounds)
            //increase aim size if planets dont fit in when displayed
            const displayX = d3.min([actualX, planetBounds[0]]);
            const displayWidth = d3.max([width, planetBounds[1] - displayX])
            //console.log("displayX", displayX)
            //console.log("displayWidth", displayWidth)
            return {
               ...aim,
               actualX,
               y,
               width,
               height,
               displayX,//:planetBounds[0],
               displayWidth,//: planetBounds[1] - planetBounds[0],
               //note - planets have alreayd been configured for the visual
               planets,
            }
        })
        //todo - check it works to render the aim
         //amend the dragEnd handlers that update aim, so they send the inverted values to state
        const mainAim = {
            id:"main",
            planets:planetsData.filter(p => !p.aimId || p.aimId === "main"),
            actualX:0,
            displayX:0,
            y:0,
            width:canvasDimns.width,
            height:canvasDimns.height
        }

        return [ mainAim, ...aims ];
    }
    update.planetsData = function (value) {
        if (!arguments.length) { return planetsData; }
        planetsData = value;
        return update;
    };
    update.channelsData = function (value) {
        if (!arguments.length) { return channelsData; }
        //updateChannelsData(value);
        return update;
    };
    update.timeScale = function (value) {
        if (!arguments.length) { return timeScale; }
        timeScale = value;
        return update;
    };
    update.yScale = function (value) {
        if (!arguments.length) { return yScale; }
        yScale = value;
        return update;
    };
    update.currentZoom = function (value) {
        if (!arguments.length) { return currentZoom; }
        currentZoom = value;
        return update;
    };
    update.canvasDimns = function (value) {
        if (!arguments.length) { return canvasDimns; }
        canvasDimns = { ...canvasDimns, ...value };
        return update;
    };

    return update;
}