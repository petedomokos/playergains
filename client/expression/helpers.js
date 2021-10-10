//active col is last col that has a selection, unless only 1 col
export function getActiveColState(state){
    return { ...state[state.length-1], colNr:state.length - 1}
}

export function getPrevActiveColState(state){
    return state[state.length -2 ] ? 
        { ...state[state.length -2], colNr:state.length - 2 } : undefined;
}

/*
todo - replace with
export function getActiveColState(state){
    return state[state.length-1];
}

export function getPrevActiveColState(state){
    return state[state.length -2 ] ? state[state.length -2] : undefined;
}
*/

export function getActiveChainColState(expBuilderState, chainIndex){
    return getActiveColState(expBuilderState[chainIndex])
}
/*
export function getPrevActiveChainColState(state){
    return state[state.length -2 ] ? 
        { ...state[state.length -2], colNr:state.length - 2 } : undefined;
}
*/

/*

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

*/

export const elementsBefore = (i, arr) => arr.slice(0, i)
export const elementsAfter = (i, arr) => arr.slice(i + 1, arr.length)
