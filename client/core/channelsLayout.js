import * as d3 from 'd3';
import { OPEN_CHANNEL_EXT_WIDTH } from './constants';

export default function channelsLayout(){
    let scale = x => 0;
    let currentZoom = d3.zoomIdentity;
    let contentsWidth = 700;

    let state;

    function update(data){
        const scaledExtWidth = OPEN_CHANNEL_EXT_WIDTH * currentZoom.k
        //note - although scale pased is the orig scale onot rescaled scale, it still returns correct values
        // I need to check this with new planets etc, bto quite sure why it works, obv axis has had its scale updated
        // but if zoomed in or panned, why would teh transfrom not move it. Just need to think it through
        const channelsData = data.map((ch, i) => {
            const trueStartX = scale(ch.startDate);
            const trueEndX = scale(ch.endDate);
            //the channels open are wrong on axis. when nr 1 is open, it shows as nr 0 being open
            const nrPrevOpenChannels = data.filter((chan, j) => j < i && chan.isOpen).length;
            //const rangeShift = nrPrevOpenChannels * OPEN_CHANNEL_EXT_WIDTH + (ch.isOpen ? OPEN_CHANNEL_EXT_WIDTH : 0);
            const startX = scale(ch.startDate) + nrPrevOpenChannels * scaledExtWidth;
            const closedEndX = scale(ch.endDate) + nrPrevOpenChannels * scaledExtWidth;
            const openEndX = closedEndX + scaledExtWidth;
            const endX = ch.isOpen ? openEndX : closedEndX;
            const axisRangeShiftWhenOpen = (nrPrevOpenChannels + 1) * scaledExtWidth;
            const isDisplayed = trueStartX >= 0 && trueEndX <= contentsWidth;

            return {
                ...ch,
                trueStartX,
                trueEndX,
                nrPrevOpenChannels,
                startX,
                endX,
                closedEndX,
                openEndX,
                closedWidth:closedEndX - startX,
                openWidth:openEndX - startX,
                width:endX - startX,
                scaledExtWidth,
                axisRangeShiftWhenOpen,
                isDisplayed,
            }
        })

        //add helpers
        const _trueX = (adjX) => {
            //console.log("scale.domain", scale.domain())
            //console.log("scale inv 0", scale.invert(0))
            const channel = channelsData.find(ch => ch.endX >= adjX)
            const extraX = adjX - channel.startX;
            //console.log("channel.nrPrevOpenChannels", channel.nrPrevOpenChannels)
            //the fault is with teh first part of the line below, coz even if we comment out the last bit it still 
            //reduces x too much and thinks you are in `mar-Apr when you click apr-may (when mar-apr is open)
            return channel.startX + ((extraX/channel.width) * channel.closedWidth) - (channel.nrPrevOpenChannels * OPEN_CHANNEL_EXT_WIDTH);
        }

        const channelContainsPoint = (pt, chan) => chan.startX <= pt.x && pt.x < chan.endX;
        const channelContainsDate = (date, channel) => channel.startDate <= date && date < channel.endDate;

        const nrOpenChannelsBeforePt = pt => {
            //console.log("nrOpenChans...................pt", pt)
            //console.log("alOpen", channelsData.filter(c => c.isOpen))
            return channelsData
                .filter(ch => ch.isOpen)
                .filter(ch => ch.endDate <= scale.invert(pt.x)) //we use end Date coz we dont want to shift back if its before the extra space
                .length

            //console.log("scale.invert")
            //return channelsData.filter(ch => ch.startDate <= scale.invert(pt.x)).length;
        }

        const nrOpenChannelsBeforeX = x => {
            //if x is in teh last open channel, then DONT SUBTRACT 100 . Instead, subtract channelWidth - delta (ie the bit of the 100 that is before x)
            return channelsData.filter(ch => ch.isOpen).filter(ch => ch.startDate <= scale.invert(x)).length;
        }
        //const openChannelsBeforeX = x => channelsData.filter(ch => ch.isOpen).filter(ch => ch.startDate <= scale.invert(x));
        const openChannelsBeforeX = x => channelsData.filter(ch => ch.isOpen).filter(ch => ch.startX <= x);

        //takes a pt, shifts it to account for open channels, and returns the date
        //this correspondes to teh actual date seen on screen, rather than the date of the scale
        const shiftedPt = pt => {
            const nrOpen = nrOpenChannelsBeforePt(pt)
            //console.log("nrOpenB4", nrOpen)
            return { ...pt, x: pt.x - nrOpen * OPEN_CHANNEL_EXT_WIDTH }
        }
        const shiftedX = x => {
            //console.log("nrOpenB4", nrOpenChannelsBeforeX(x))
            return x - nrOpenChannelsBeforeX(x) * OPEN_CHANNEL_EXT_WIDTH;
        }
        const shiftedDate = x => scale.invert(shiftedX(x));

        //channelsData.pointChannel = (pt) => channelsData.find(ch => channelContainsPoint(pt, ch));
        channelsData.pointChannel = (pt) => {
            const { x } = pt;
            const openChannelsBefore = openChannelsBeforeX(pt.x);
            const lastOpen = openChannelsBefore[openChannelsBefore.length - 1]
            const xChannelIsOpen = lastOpen && lastOpen.startX <= x && lastOpen.endX >= x;
            let trueX;
            if(openChannelsBefore.length === 0){
                //console.log("USING SCALEDX")
                const scaledX = x - currentZoom.k * openChannelsBefore.length;
                trueX = scaledX;
            }
            else if(xChannelIsOpen){
                //console.log("USING DELTA METHOD")
                const ch = lastOpen; //in this case, could just return this ch at this point?
                const delta = x - ch.startX;
                const deltaProp = delta / ch.width;
                const trueDelta = deltaProp * ch.closedWidth;
                trueX = scale(ch.startDate) + trueDelta;
            }else{
                //console.log("USING SUB METHOD")
                const sub = openChannelsBefore.length * 100 * currentZoom.K;
                trueX = x - openChannelsBefore.length * 100 * currentZoom.k;
            }
            return channelsData.find(ch => channelContainsDate(scale.invert(trueX), ch))
        }

        channelsData.trueX = _trueX;
    
        return channelsData;
    }

    //api
    update.scale = function (value) {
        if (!arguments.length) { return scale; }
        scale = value;
        return update;
    };
    update.currentZoom = function (value) {
        if (!arguments.length) { return currentZoom; }
        currentZoom = value;
        return update;
    };
    update.contentsWidth = function (value) {
        if (!arguments.length) { return contentsWidth; }
        contentsWidth = value;
        return update;
    };

    return update;
}