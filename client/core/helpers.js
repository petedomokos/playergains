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

export function getTransformation(transform) {
    // Create a dummy g for calculation purposes only. This will never
    // be appended to the DOM and will be discarded once this function 
    // returns.
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    
    // Set the transform attribute to the provided string value.
    g.setAttributeNS(null, "transform", transform);
    
    // consolidate the SVGTransformList containing all transformations
    // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
    // its SVGMatrix. 
    var matrix = g.transform.baseVal.consolidate().matrix;
    
    // Below calculations are taken and adapted from the private function
    // transform/decompose.js of D3's module d3-interpolate.
    var {a, b, c, d, e, f} = matrix;   // ES6, if this doesn't work, use below assignment
    // var a=matrix.a, b=matrix.b, c=matrix.c, d=matrix.d, e=matrix.e, f=matrix.f; // ES5
    var scaleX, scaleY, skewX;
    if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
    if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
    if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
    if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
    return {
      translateX: e,
      translateY: f,
      rotate: Math.atan2(b, a) * 180 / Math.PI,
      skewX: Math.atan(skewX) * 180 / Math.PI,
      scaleX: scaleX,
      scaleY: scaleY
    };
  }