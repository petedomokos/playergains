export function channelContainsPoint(pt, channel){
    //console.log("ccp pt", channel)
    //console.log("contains?", channel.startX <= pt.x && pt.x < channel.endX)
    return channel.startX <= pt.x && pt.x < channel.endX;
}
export function channelContainsDate(date, channel){
    return channel.startDate <= date && date < channel.endDate;
}

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
        if (!nearestSoFar || distanceBetweenPoints(pt, next) < distanceBetweenPoints(pt, nearestSoFar)) {
            //not sure why we dont need to use displayX for each point
        //if (!nearestSoFar || distanceBetweenPoints(pt, { ...next, x:next.displayX }) < distanceBetweenPoints(pt, { ...nearestSoFar, x: nearestSoFar.displayX} )) {
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

export const angleOfRotation = (from, to) => {
    //TODO - sort out centre of rotation - make it from src
    //thats why it doesnt show when  0 or 270 as its off teh page
    //console.log("x0", from.x)
    //console.log("x1", to.x)
    //console.log("y0", from.y)
    //console.log("y1", to.y)
    const theta = angleFromTop([from, to]);
    //console.log("theta", theta)
    // note: y is reversed
    let angleOfRotation = 0;
    //cases - quadrants clockwise from the top
    if (to.x >= from.x && to.y <= from.y) {
        //CORRECT
        //console.log("case A")
        // quad 1 from top 0-90 - no need to negate
        angleOfRotation = 270 + theta;
    }
    if (to.x >= from.x && to.y > from.y) {
        //CORRECT
        //console.log("case B")
        // quad2 from top 90-180 must negate
        angleOfRotation = 90 - theta;
    }
    //TEH NEXT TWO ARE UNTESTED AS TO.X IS ALWAYS TO.X ALWAYS GREATER
    //PROBABLY WRONG AS NEDS TO BE ROTATED FROM HORIZONTAL
    /*
    if (to.x < from.x && to.y > from.y) {
        console.log("case C")
        // angle from top is "270-360";
    }
    if (to.x < from.x && to.y <= from.y) {
        console.log("case D")
        // angle from top is "180-270";
    }
    */
    //console.log("angleOfRot", angleOfRotation)
    return angleOfRotation;
}

export function angleFromTop(points) {
    // Must be at least two points
    if (!points[1]) { return undefined; }
    // assume straight line so just take first two points
    const p1 = points[0];
    const p2 = points[1];
    let deltaX;
    let deltaY;
    if (p1[0]) {
        deltaX = Math.abs(p1[0] - p2[0]);
        deltaY = Math.abs(p1[1] - p2[1]);
    } else {
        deltaX = Math.abs(p1.x - p2.x);
        deltaY = Math.abs(p1.y - p2.y);
    }
    const theta = toDegrees(Math.atan(deltaX / deltaY));
    return theta;
}
/*
export function angleOfElevation(pts){
    console.log("x0", pts[0].x)
    console.log("x1", pts[1].x)
    console.log("y0", pts[0].y)
    console.log("y1", pts[1].y)
    // Must be at least two points
    if (!pts[1]) { return undefined; }
    const positiveTheta = 90 - angleFromTop(pts);
    //add sign for negative (quadrant 2 and 3 from the top)
    //WARNING - REMEMBER Y IS REVERSED!!!
    if (pts[1].x >= pts[0].x && pts[1].y <= pts[0].y) {
        console.log("case A")
        // quad 1 from top 0-90 - no need to negate
        return positiveTheta;
    }
    if (pts[1].x >= pts[0].x && pts[1].y >= pts[0].y) {
        console.log("case B")
        // quad 2 from top 90-180 must negate
        //angleOfRotation = 180 + theta;
        return -positiveTheta;
    }
    if (pts[1].x <= pts[0].x && pts[1].y >= pts[0].y) {
        console.log("case C")
        // quad 3 from top is "180-270";
        //angleOfRotation = 180 - theta;
        return -positiveTheta;
    }
    if (pts[1].x <= pts[0].x && pts[1].y <= pts[0].y) {
        console.log("case D")
        // quad 4 from top is "270-360";
        return positiveTheta;
    }
}
*/

export function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

export function toDegrees(radians) {
    return radians * (180 / Math.PI);
}