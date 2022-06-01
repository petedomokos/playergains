import * as d3 from 'd3';
import { PLANET_RING_MULTIPLIER } from './constants';
import { findNearestChannelByEndDate } from "./helpers";

export default function planetsLayout(){
    let timeScale = x => 0;
    let yScale = x => 0;
    let currentZoom = d3.zoomIdentity;

    let selected;

    let channelsData;
    let aimsData;
    let trueX = x => x;
    let adjX = x => x;
    let pointChannel = () => {};
    let dateChannel = () => {};
    let nearestChannelByEndDate = () => {};

    function updateChannelsData(newChannelsData){
        channelsData = newChannelsData;
        nearestChannelByEndDate = findNearestChannelByEndDate(channelsData);
    }

    //const aimId = g => aimsData
        //.filter(a => a.id !== "main")
        //.find(a => pointIsInRect(g, { x: a.displayX, y:a.y, width: a.displayWidth, height:a.height }))

    function update(data){
        return data.map(p => {
            //todo - findNearestChannel needs to take account of open channels too
            const channel = nearestChannelByEndDate(p.targetDate);
            const { axisRangeShift } = channel;
            //on drag , targetX jumps up
            //targetX should be the same as the d.x in planetDrag, not trueX
            //problem - nrPtrevOpenChannels doesnt include itself when it is open
            //but we have already stored that
            const targetX = timeScale(p.targetDate) + axisRangeShift;
            //const targetX = timeScale(p.targetDate) + nrPrevOpenChannels * scaledExtWidth;
            const rx = width => currentZoom.k * width * 0.8 / 2;
            const ry = height => currentZoom.k * height * 0.8 / 2;

            //only coerce targ if it exists, as we dont want it to become NaN in that case or it will display
            const measures = p.measures.map(m => {
                return { ...m, targ:typeof m.targ === "string" ? +m.targ : undefined }
            })
            return {
                ...p,
                //aimId:aimId(p),
                channel,
                displayDate:p.unaligned ? p.targetDate : channel.endDate,
                x:p.unaligned ? targetX : channel.endX, //planets positioned on channel end line
                y: yScale(p.yPC),
                targetX,
                rx,
                ry,
                ringRx:width => rx(width) * PLANET_RING_MULTIPLIER,
                ringRy:height => ry(height) * PLANET_RING_MULTIPLIER,
                isSelected:selected === p.id,
                measures
            }
        })
    }
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
    update.channelsData = function (value) {
        if (!arguments.length) { return channelsData; }
        updateChannelsData(value);
        return update;
    };
    update.aimsData = function (value) {
        if (!arguments.length) { return aimsData; }
        aimsData = value;
        return update;
    };
    update.currentZoom = function (value) {
        if (!arguments.length) { return currentZoom; }
        currentZoom = value;
        return update;
    };
    update.selected = function (value) {
        if (!arguments.length) { return selected; }
        selected = value;
        return update;
    };

    return update;
}