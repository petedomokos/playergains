import { OPEN_CHANNEL_EXT_WIDTH } from './constants';

export default function channelsLayout(){
    let scale = x => 0;

    let state;
    function update(data){
        //note - although scale pased is the orig scale onot rescaled scale, it still returns correct values
        // I need to check this with new planets etc, bto quite sure why it works, obv axis has had its scale updated
        // but if zoomed in or panned, why would teh transfrom not move it. Just need to think it through
        return data.map((ch, i, chArray) => {
            const trueStartX = scale(ch.startDate);
            const trueEndX = scale(ch.endDate);
            //the channels open are wrong on axis. when nr 1 is open, it shows as nr 0 being open
            const nrPrevOpenChannels = chArray.filter((chan, j) => j < i && chan.isOpen).length;
            //const rangeShift = nrPrevOpenChannels * OPEN_CHANNEL_EXT_WIDTH + (ch.isOpen ? OPEN_CHANNEL_EXT_WIDTH : 0);
            const startX = scale(ch.startDate) + nrPrevOpenChannels * OPEN_CHANNEL_EXT_WIDTH;
            const closedEndX = scale(ch.endDate) + nrPrevOpenChannels * OPEN_CHANNEL_EXT_WIDTH;
            const openEndX = closedEndX + OPEN_CHANNEL_EXT_WIDTH;
            const endX = ch.isOpen ? openEndX : closedEndX;
            const axisRangeShiftWhenOpen = (nrPrevOpenChannels + 1) * OPEN_CHANNEL_EXT_WIDTH;
            //const isDisplayed = ch.nr >= -1 && ch.nr <= 3;

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
                axisRangeShiftWhenOpen,
                //isDisplayed
            }
        })
    }

    //api
    update.scale = function (value) {
        if (!arguments.length) { return scale; }
        scale = value;
        return update;
    };

    return update;
}