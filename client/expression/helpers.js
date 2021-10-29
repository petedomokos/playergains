//active block is last block that has a selection, unless only 1 block
export function getActiveBlockState(chainState){
    return { ...chainState[chainState.length-1], blockNr:chainState.length - 1}
}

export function getPrevActiveBlockState(state){
    return state[state.length -2 ] ? 
        { ...state[state.length -2], blockNr:state.length - 2 } : undefined;
}

/*
todo - replace with
export function getActiveBlockState(state){
    return state[state.length-1];
}

export function getPrevActiveBlockState(state){
    return state[state.length -2 ] ? state[state.length -2] : undefined;
}
*/

export function getActiveChainBlockState(expBuilderState, chainIndex){
    return getActiveBlockState(expBuilderState[chainIndex])
}

/*

export function getActiveBlockState(state){
    return [...state] //may not need this ...
            .map((block, i) => ({ ...block, blockNr:i}))
            .reverse()
            .find(block => block.selected || block.op) || state[0];
}

export function getPrevActiveBlockState(state){
    return [...state] //may not need this ...
            .map((block, i) => ({ ...block, blockNr:i}))
            .reverse()
            .slice(0,1) //gets rid of first (which is the last block)
            .find(block => block.selected || block.op); //gets the new first, which is the 2nd last block that is selected
}

*/

export const elementsBefore = (i, arr) => arr.slice(0, i)
export const elementsAfter = (i, arr) => arr.slice(i + 1, arr.length)

export function availableFuncs(funcs, blockData){
    if(!blockData.prev){
        return [];
    }
    //remove home-sel
    return funcs.filter(f => f.id !== "home-sel");
}

//export function calculateResult(f, data, accessor = x => x){
    //return f(data, accessor);
//}


export function isActive(chainData){
    return chainData.filter(b => b.isActive).length !== 0;
}

export function findActiveBlock(expBuilderData){
    return expBuilderData
        .find(chain => isActive(chain))
        .find(block => block.isActive)
}
