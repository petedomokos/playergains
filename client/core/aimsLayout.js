import * as d3 from 'd3';

export default function aimsLayout(){
    let timeScale = x => 0;
    let yScale = x => 0;
    let currentZoom = d3.zoomIdentity;
    let channelsData;
    let planetsData = [];
    let canvasDimns = { width:800, height:600 };

    function update(data){
        const aims = data.map(aim => {
            return {
               ...aim,
               //note - planets have alreayd been configured for the visual
               planets:planetsData.filter(p => p.aimId === aim.id)
            }
        })
        const mainAim = {
            id:"main",
            planets:planetsData.filter(p => !p.aimId),
            x:0,
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