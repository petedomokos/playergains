import * as d3 from 'd3';

export function calcPlanetHeight(svgHeight){
    return d3.min([svgHeight * 0.2, 100]);
}

export function calcChartHeight(svgHeight, planetHeight){
    //svg must contain 2 planets plus one chart, up to a certain point
    return d3.min([svgHeight - 2 * planetHeight, 400]);
}

export function planetsAfterDate(planetData, date){
    return planetData.filter(p => p.targetDate > date);
}

export function findFuturePlanets(planetData){
    return planetsAfterDate(planetData, new Date());
}

//assumes planets in ascending order by date
export function findFirstFuturePlanet(planetData){
    const now = new Date();
    return findFuturePlanets(planetData)[0];
}

export function msToMonths(ms){
    return ms / 2629746000;
}

export function linearProjValue(x0MS, y0, x1MS, y1, xProjMS, dps){
    const x0 = msToMonths(x0MS);
    const x1 = msToMonths(x1MS);
    const xProj = msToMonths(xProjMS);
    const m = (y1 - y0) / (x1 - x0);
    //the eqn of line must also be shifted so its deltaX not x
    const y = (deltaX) => m * deltaX + y0;
    const deltaX = xProj - x0;
    return dps ? +y(deltaX).toFixed(dps) : y(deltaX);
}