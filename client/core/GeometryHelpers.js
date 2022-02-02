
//import * as d3 from "d3";
//import * as d3R from "d3-regression";

export function findNearestPlanet(pt, planets){
    //todo - measure it from the edge of ellipse
    return findNearestPoint(pt, planets)
}
export function findNearestPoint(pt, ptsToCheck) {
    const checkNext = (remainingPts, nearestSoFar) => {
        const [next, ...rest] = remainingPts;
        // See if any more points left to check
        if (!next) {
            return nearestSoFar;
        }
        // check if next point is nearer than nearest so far
        if (!nearestSoFar || distanceBetweenPoints(next, pt) < distanceBetweenPoints(nearestSoFar, pt)) {
            // nearest point is now next
            return checkNext(rest, next);
        }
        // nearest hasnt changed
        return checkNext(rest, nearestSoFar);
    };
    return checkNext(ptsToCheck);
}

export function distanceToPlanet(pt, planet, timeScale, yScale){
    const x = timeScale(planet.targetDate);
    const y = yScale(planet.yPC);
    return distanceBetweenPoints(pt, [x,y])
}

/**
 *
 * @param {object} p1 - a 2D array or object with x and y values representing a point in 2D space
 * @param {object} p2 - a 2D array or object with x and y values representing a point in 2D space
 * @returns {number} the distance between the two points
 *
 */
export function distanceBetweenPoints(p1, p2) {
    if (!p1 || !p2) { return undefined; }
    if (p1[0] && !p2[0]) {
        // convert p1 to object
        p1.x = p1[0];
        p1.y = p1[1];
    }
    if (!p1[0] && p2[0]) {
        // convert p2 to object
        p2.x = p2[0];
        p2.y = p2[1];
    }
    let deltaX;
    let deltaY;
    if (p1[0] && p2[0]) {
        deltaX = Math.abs(p1[0] - p2[0]);
        deltaY = Math.abs(p1[1] - p2[1]);
    } else {
        deltaX = Math.abs(p1.x - p2.x);
        deltaY = Math.abs(p1.y - p2.y);
    }
    return Math.sqrt(deltaX ** 2 + deltaY ** 2);
}
