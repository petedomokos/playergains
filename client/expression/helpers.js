//active col is last col that has a selection, unless only 1 col
export function getActiveColState(state){
    return [...state] //may not need this ...
            .map((col, i) => ({ ...col, colNr:i}))
            .reverse()
            .find(col => col.selected || col.op) || state[0];
}

export function getPrevActiveColState(state){
    return [...state] //may not need this ...
            .map((col, i) => ({ ...col, colNr:i}))
            .reverse()
            .slice(0,1) //gets rid of first (which is the last col)
            .find(col => col.selected || col.op); //gets the new first, which is the 2nd last col that is selected
}

export const colsBefore = (i, arr) => arr.slice(0, i)
export const colsAfter = (i, arr) => arr.slice(i + 1, arr.length)