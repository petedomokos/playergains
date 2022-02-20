import { greatest } from 'd3';
import { linearProjValue } from "./helpers";

export default function barChartLayout(planet){
    const { startDate, targetDate } = planet;
    return planet.goals.map(g => {
        //ofr now, assue 1 datasetmeasure per goal
        const measure = g.datasetMeasures[0];
        //for now projValue is hardcoded
        const { startValue, targetValue } = measure;
        const { date, value } = greatest(measure.datapoints, d => d.date)
        const latestDate = new Date(date);
        const actualchange = value - startValue;
        const targetChange = targetValue - startValue;
        const pcValue = targetChange === 0 ? 100 : +((actualchange / targetChange) * 100).toFixed(2);
        const projValue = linearProjValue(startDate.getTime(), startValue, latestDate.getTime(), value, targetDate.getTime(), 2)
        const projPCChange = projValue - startValue;
        const projPCValue = targetChange === 0 ? 100 : +((projPCChange / targetChange) * 100).toFixed(2);
        return {
            ...g,
            date,
            value,
            pcValue,
            //a linear projection for targetDate value, using a line from start to current
            projValue,
            projPCValue
        }
    })
}