import { filterPathD, groupByPathD, trianglePolygonPoints, arrowPathD, equalsPathD } from "./icons";

export const planetData = [
    {
        name:"Sites", 
        id:"sites",
        properties:[
            {
                name:"Region", id:"region", valueType:"enum", options:["UK", "EU", "USA"]
            },
            {
                name:"Type", id:"type", valueType:"enum", options:["Primary", "Secondary", "Tertiary"]
            }
        ]
    },
    {
        name:"Devices", 
        id:"devices",
        properties:[
            {
                name:"Creation Date", id:"creationDate", valueType:"Date"
            },
            {
                name:"LDOS", id:"ldos", valueType:"Date"
            }
        ]
    }
]

export const returnOptions = [
    {id:"total", name:"Total"},
    {id:"min", name:"Min"},
    {id:"max", name:"Max"},
    {id:"mean", name:"Mean"},
    {id:"median", name:"Median"},
    {id:"stdDev", name:"Std Dev"},
    {id:"if", name:"if..."},
    {id:"?1", name:"?"},
    {id:"?2", name:"?"}
]

export const toolsInfo = [
    { id:"filter", name:"Filter", icon:{ nodeType:"path", d:filterPathD } },
    { id:"groupBy", name:"Group", icon:{ nodeType:"path", d:groupByPathD } },
    { id:"agg", name:"Agg", icon:{ nodeType:"polygon", points:trianglePolygonPoints } },
    { id:"map", name:"Map", icon:{ nodeType:"path", d:arrowPathD } },
]

export function getInstances(planetId){
    switch(planetId){
        case "sites": return siteInstances;
        case "devices": return deviceInstances;
        default:return undefined;
    }

}

const siteInstances = [
    {
        displayName:"site1", 
        propertyValues:{
            "region":"UK",
            "type":"Primary",
            "devices":["dev1", "dev3", "dev4"] //q how is this in the actual app?
        }
    },
    {
        displayName:"site2", 
        propertyValues:{
            "region":"USA",
            "type":"Primary",
            "devices":["dev1", "dev2", "dev4", "dev5"]
        }
    },
    {
        displayName:"site3", 
        propertyValues:{
            "region":"UK",
            "type":"Secondary",
            "devices":["dev1", "dev3", "dev4", "dev5"]
        }
    },
    {
        displayName:"site4", 
        propertyValues:{
            "region":"UK",
            "type":"Secondary",
            "devices":["dev1", "dev1", "dev2", "dev1", "dev1", "dev1", "dev2", "dev1"]
        }
    },
    {
        displayName:"site5", 
        propertyValues:{
            "region":"UK",
            "type":"Secondary",
            "devices":["dev5", "dev3", "dev4", "dev5", "dev4", "dev5", "dev5", "dev5", "dev4", "dev5"]
        }
    },
    {
        displayName:"site6", 
        propertyValues:{
            "region":"USA",
            "type":"Primary",
            "devices":["dev1", "dev3"]
        }
    },
    {
        displayName:"site7", 
        propertyValues:{
            "region":"UK",
            "type":"Primary",
            "devices":["dev4", "dev5"]
        }
    },
    {
        displayName:"site8", 
        propertyValues:{
            "region":"UK",
            "type":"Primary",
            "devices":["dev3", "dev3", "dev3", "dev3", "dev3", "dev3", "dev3",]
        }
    },


]

const deviceInstances = [
    {
        displayName:"dev1", 
        propertyValues:{
            "creationDate":"02/12/2018",
            "ldos":"27/05/2021"
        }
    },
    {
        displayName:"dev2", 
        propertyValues:{
            "creationDate":"21/09/2018",
            "ldos":"27/09/2021"
        }
    },
    {
        displayName:"dev3", 
        propertyValues:{
            "creationDate":"16/01/2018",
            "ldos":"10/05/2021"
        }
    },
    {
        displayName:"dev4", 
        propertyValues:{
            "creationDate":"01/05/2019",
            "ldos":"16/09/2022"
        }
    },
    {
        displayName:"dev5", 
        propertyValues:{
            "creationDate":"14/11/2019",
            "ldos":"20/12/2022"
        }
    },
    
]