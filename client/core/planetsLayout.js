import * as d3 from 'd3';
import { findNearestChannelByEndDate } from "./helpers";

export default function planetsLayout(){
    let yScale = x => 0;
    let currentZoom = d3.zoomIdentity;

    let channelsData;
    let trueX = x => x;
    let adjX = x => x;
    let pointChannel = () => {};
    let dateChannel = () => {};
    let nearestChannelByEndDate = () => {};

    function updateChannelsData(newChannelsData){
        channelsData = newChannelsData;
        nearestChannelByEndDate = findNearestChannelByEndDate(channelsData);
    }

    function update(data){
        return data.map(p => {
            //todo - findNearestChannel needs to take account of open channels too
            const channel = nearestChannelByEndDate(p.targetDate);
            return {
                ...p,
                channel,
                displayDate:channel.endDate,
                x:channel.endX, //planets positioned on channel end line
                y: yScale(p.yPC),
                rx:(contentsWidth) => currentZoom.k * contentsWidth * 0.8 / 2,
                ry:(contentsHeight) => currentZoom.k * contentsHeight * 0.8 / 2
            }
        })
    }

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
    update.currentZoom = function (value) {
        if (!arguments.length) { return currentZoom; }
        currentZoom = value;
        return update;
    };

    return update;
}