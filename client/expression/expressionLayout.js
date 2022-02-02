/* eslint-disable prefer-arrow-callback */
/* eslint-disable prefer-spread */
/* eslint-disable prefer-rest-params */
/* eslint-disable func-names */
/* eslint-disable prefer-const */

import * as d3 from 'd3';

/*
A higher-order function which returns data ready for the expression
*/
export default function expressionLayout() {
    //api
    let nodes = [];
    let links = [];
    //data returned
    let data = [];

    function update(expressionData = {}) {
        console.log("update", expressionData)
        if(expressionData.nodes) { nodes = expressionData.nodes }
        if(expressionData.links) { links = expressionData.links }

        const nodesData = nodes.map(n => {
            const children = links
                .filter(l => l.src === n.id)
                .map(l => nodes.find(node => node.id === l.targ));
            const parentsArray = links
                .filter(l => l.targ === n.id)
                .map(l => nodes.find(node => node.id === l.src));
            const parents = parentsArray.length === 0 ? null : parentsArray;
            
            //const level1Parents = () => ... does this help us get colnr?

            const nodeType = typeof n.data === "number" ? "value" : typeof n.data === "array" ? "dataset" : "func";

            return { ...n, children, parents, nodeType }

        })
        .map((n,i, nodesArray) => {
            //must add depths, height etc to parent and children references
            const children = n.children?.map(ch => nodesArray.find(n => n.id === ch.id));
            const parents = n.parents?.map(pa => nodesArray.find(n => n.id === pa.id));

            const depth = calcNodeDepth({ ...n, parents });
            const height = 0//calcNodeHeight({ ...n, children });

            //note - need depth of all parents to calc colnr so needs to be in next map after depth
            const colNr = 0// calcNodeColNr({ ...n, children, parents});

            const descendants = () => getDescendants({ ...n, children});
            const ancestors = () => getAncestors({ ...n, parents}, n => n.parents);
            const leaves = () => getLeaves({ ...n, children})

            return { ...n, children, parents, colNr, depth, height, descendants, ancestors, leaves }
        })

        const linksData = links.map(l => ({
            ...l,
            src:nodesData.find(n => n.id === l.src),
            targ:nodesData.find(n => n.id === l.targ)
        }))

        const root = nodesData.find(n => !n.parents)

        return { nodes: nodesData, links: linksData, root }
    }

    function getDescendants(node, childrenFunc = (n) => n.children){
        const getChildren = (node, accumulated) => {
            const children = childrenFunc(node);
            if(!children || children.length === 0){
                return accumulated;
            }else{
                const newAccumulated = [ ...accumulatedDescendants, ...children ];
                return node.children.reduce((a, b) => [...getChildren(a, newAccumulated), ...getChildren(b, newAccumulated)], []);
            }
        }
        return getChildren(node, []);
    }

    function getAncestors(node){
        return getDescendants(node, n => n.parents)
    }

    function getLeaves(node){
        return getDescendants(node).filter(n => !n.children || n.children.length === 0);
    }

    function calcNodeHeight(node, childrenFunc = (n) => n.children){
        console.log("calcNH", node)
        const checkChildren = (node, heightSoFar) => {
            if(!childrenFunc(node) || childrenFunc(node).length === 0){
                return heightSoFar;
            }else{
                const newHeight = heightSoFar + 1;
                return node.children.reduce((a, b) => d3.max([checkChildren(a, newHeight), checkChildren(b, newHeight)]), 0)
            }
        }
        return checkChildren(node, 0);
    }

    function calcNodeDepth(node){
        return calcNodeHeight(node, n => n.parent)
    }

    //may not be a whole number
    function calcNodeColNr(node){
        console.log("caclNCN", node)
        if(node.depth === 0){
            return node.colNr || 0; //root node may have been dragged out of col 0
        }
        if(node.depth === 1){
            //depth 1 nodes are each placed in new column by the order they appear in
            //if dragged, the order of them in state is changed
            const nodesIdsAtThisDepth = nodes.filter(n => n.depth === node.depth).map(n => n.id);
            return nodesIdsAtThisDepth.indexOf(node.id);
        }
        //rest of nodes are given an avg of their parent colNrs (unless they have been dragged to a particular spot)
        return node.colNr || d3.mean(node.parents.map(p => calcNodeColNr(p)))
    }

    // api
    update.nodes = function (value) {
        if (!arguments.length) { return nodes; }
        nodes = value;
        return update;
    };
    update.links = function (value) {
        if (!arguments.length) { return links; }
        links = value;
        return update;
    };
    return update;
}