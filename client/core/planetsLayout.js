import { findNearestChannelByEndDate } from "./helpers";

export default function planetsLayout(){
    let yScale = x => 0;

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
                displayDate:channel.endDate
                //x:channel.endX, //planets positioned on channel end line
                //y: yScale(p.yPC)
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

    return update;
}