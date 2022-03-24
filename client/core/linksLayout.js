import * as d3 from 'd3';
import barChartLayout from "./barChartLayout";
import { getGoalsData } from '../data/planets';

export default function linkslayout(){
    //const barChartWidth = 100;
    //const barChartHeight = 100; 
    //move bar dimns to linksCompo
    const mockGoalsData = getGoalsData();

    let currentZoom = d3.zoomIdentity;

    let channelsData = [];
    let planetsData = [];
    function update(data){
        return data.map(l => {
            const src = planetsData.find(p => p.id === l.src);
            const targ = planetsData.find(p => p.id === l.targ);
            //we want all visible channels to show, even if actual targetDate is not after, so we use x to get channels not dates
            //include teh src and targ channels, plus any in between
            const channels = channelsData.filter(ch => src.channel.nr === ch.nr || targ.channel.nr === ch.nr || ch.startX >= src.x && ch.endX <= targ.x);
            const isOpen = !!channels.find(ch => ch.isOpen);
            //@todo - bug - centre jumps up when dragging from one channel into another if its open
            const centre = [
                ((src.x + targ.x)/2),// - barChartWidth/2,
                ((src.y + targ.y)/2),// - barChartHeight/2
            ]
            //pass the targ planet, along with mock goals, and the src targetDate as the startDate, to the bar layout
            const barChartData = barChartLayout({ ...targ, startDate:src.targetDate, goals: mockGoalsData})
            return { 
                ...l, 
                src, 
                targ, 
                isOpen, 
                barChartData,
                centre
            }
        });
    }

    update.channelsData = function (value) {
        if (!arguments.length) { return channelsData; }
        channelsData = value;
        return update;
    };
    update.planetsData = function (value) {
        if (!arguments.length) { return planetsData; }
        planetsData = value;
        return update;
    };
    update.currentZoom = function (value) {
        if (!arguments.length) { return currentZoom; }
        currentZoom = value;
        return update;
    };

    return update;

}