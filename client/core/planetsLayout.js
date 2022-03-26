import * as d3 from 'd3';
import { findNearestChannelByEndDate } from "./helpers";

export default function planetsLayout(){
    let timeScale = x => 0;
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
            const { axisRangeShift } = channel;
            //on drag , targetX jumps up
            //targetX should be the same as the d.x in planetDrag, not trueX
            //problem - nrPtrevOpenChannels doesnt include itself when it is open
            //but we have already stored that
            const targetX = timeScale(p.targetDate) + axisRangeShift;
            //const targetX = timeScale(p.targetDate) + nrPrevOpenChannels * scaledExtWidth;
            if(p.id === "planet2"){
                //console.log("channel", channel)
                //console.log("nropen", nrPrevOpenChannels)
                //console.log("scaledextwidth", scaledExtWidth)
                //console.log("layout targetX", targetX)
                //console.log("targetDate........", p.targetDate)
            }
            const rx = (contentsWidth) => currentZoom.k * contentsWidth * 0.8 / 2;
            const ry = (contentsHeight) => currentZoom.k * contentsHeight * 0.8 / 2;
            return {
                ...p,
                channel,
                displayDate:p.unaligned ? p.targetDate : channel.endDate,
                x:p.unaligned ? targetX : channel.endX, //planets positioned on channel end line
                y: yScale(p.yPC),
                targetX,
                rx,
                ry,
                ringRx:contentsWidth => rx(contentsWidth) * 1.3,
                ringRy:contentsHeight => ry(contentsHeight) * 1.3
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
    update.currentZoom = function (value) {
        if (!arguments.length) { return currentZoom; }
        currentZoom = value;
        return update;
    };

    return update;
}