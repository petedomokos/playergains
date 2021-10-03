//active col is last col that has a selection, unless only 1 col
export function getActiveColState(state){
    return [...state] //may not need this ...
            .map((col, i) => ({ ...col, colNr:i}))
            .reverse()
            .find(col => col.selected || col.op) || state[0];
}

export const colsBefore = (i, arr) => arr.slice(0, i)
export const colsAfter = (i, arr) => arr.slice(i + 1, arr.length)