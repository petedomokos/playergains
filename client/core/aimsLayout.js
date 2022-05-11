import * as d3 from 'd3';
import { DEFAULT_PLANET_RX, DEFAULT_PLANET_RY, DIMNS } from './constants';

export default function aimsLayout(){
    let timeScale = x => 0;
    let yScale = x => 0;
    let currentZoom = d3.zoomIdentity;
    let channelsData;
    let planetsData = [];
    let canvasDimns = { width:800, height:600 };

    const aimMargin = DIMNS.aim.margin;
    const planetRX = DEFAULT_PLANET_RX;
    const planetRY = DEFAULT_PLANET_RY
    const defaultAimWidth = 2 * planetRX + aimMargin.left + aimMargin.right;
    const defaultAimHeight = 2 * planetRY + aimMargin.top + aimMargin.bottom;


    function update(data){
        const aims = data.map(aim => {
            //console.log("aimlayout", aim)
            /*
            note - if all channels are closed, then planet s will all slide together (because distances are the same)
            so in that case, we dont need to use max and min, we can just apply the same slide
            But if a channel is open this could mean some planets slide and others dont.
            Need to keep it simple, esp for now.
            so for now, we just extend the space if necc, and user can reduce it 
            */

            const planets = planetsData.filter(p => p.aimId === aim.id);
            //console.log("planets", planets)
            const planetExtent = d3.extent(planets, p => p.x);
            //console.log("ext", planetExtent)
            const aimBounds = [
                planetExtent[0] - planetRX - aimMargin.left, 
                planetExtent[1] + planetRX + aimMargin.right
            ];
            //console.log("aimBounds", aimBounds)

            //increase aim size if planets dont fit in when displayed
            const displayX = d3.min([aim.actualX, aimBounds[0]]);
            const displayWidth = d3.max([aim.width, aimBounds[1] - displayX])
            //console.log("displayX", displayX)
            //console.log("displayWidth", displayWidth)


            return {
               ...aim,
               displayX,//:aimBounds[0],
               displayWidth,//: aimBounds[1] - aimBounds[0],
               //note - planets have alreayd been configured for the visual
               planets,
            }
        })
        const mainAim = {
            id:"main",
            planets:planetsData.filter(p => !p.aimId),
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