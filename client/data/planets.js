import * as d3 from 'd3';

export function getPlanetsData(userId){
    //for now, same all users
    return planetsData;
}

export function getGoalsData(userId){
    //for now, same all users
    return planetsData[2].goals;
}

export function getStarData(userId){
    //for now, same all users
    return starData;
}

const starData = {
    id:"star",
    title:"Premier League Regular",
    label:"PL Regular",
    desc:"I am a Premier league regular",
    goals:[
        {
            key:"goal-"+1,
            id:"sg1",
            title:"My passes and crosses are good on both feet",
            label:"Both feet",
            desc:"",
            datasetMeasures:[
                //...
                { datasetId:"606b2f653eecde47d886479a", measureKey:undefined} //will use isMain or first 
            ]
        },
        {
            key:"goal-"+2,
            id:"sg2",
            title:"I am strong",
            label:"Strength",
            desc:"",
            datasetMeasures:[
                //pressups 1 min
                { datasetId:"606b6aef720202523cc3589d", measureKey:undefined} //will use isMain or first
            ]
        },
        {
            key:"goal-"+3,
            id:"sg3",
            title:"I am clinical",
            label:"Clinical",
            desc:"I am clinical, ruthless and direct on the ball. End product always happens and is of good quality",
            datasetMeasures:[
                //Bounce Dribble game
                //measure - score-3 (todo - use dervied measure median of score-1, score-2 and score-3)
                { datasetId:"608c6196285a17514c8147d0", measureKey:"score-3"}
            ]
        },
        {
            key:"goal-"+4,
            id:"sg4",
            title:"I am strong",
            label:"",
            desc:"",
            datasetMeasures:[
                //pressups 1 min
                { datasetId:"...", measureKey:"reps"}
            ]
        }
    ]
}

const planetsData = [
    {
        id:"p6",
        title:"Prem Regular",
        label:"Prem Regular",
        desc:"I am a regular starter in the Prem",
        startDate:"2022-10-07",
        targetDate:"2023-05-07", //YYYY-MM-DD
        goals:[]
    },
    {
        id:"p5",
        title:"Played in Prem",
        label:"Played in Prem",
        desc:"I have played in the Prem",
        startDate:"2022-05-03",
        targetDate:"2022-10-07", //YYYY-MM-DD
        goals:[]
    },
    //p1 will be the 'NEXT' planet - ie its date will be the nearest planet in the future
    {
        id:"p4",
        title:"Signed for Prem",
        label:"Signed for PL",
        desc:"I have signed for a Premier League Club",
        startDate:"2021-08-07",
        targetDate:"2022-05-03", //YYYY-MM-DD
        goals:[
            {
                key:"goal-"+1,
                id:"p4g1",
                title:"My passes and crosses are good on both feet",
                label:"Both feet",
                desc:"",
                datasetMeasures:[
                    //for now, one per goal
                    { 
                        datasetId:"606b2f653eecde47d886479a", 
                        measureKey:undefined, //will use isMain or first one
                        startValue:"7",
                        targetValue:"25",
                        //for now, just put in the measure properties as mocks
                        key:"m1",
                        title:"M1",
                        order:"highest is best",
                        unit:"secs",
                        //datapoints will be added here when got from server, embellishing each with a date and value property
                        //for now. put in mock
                        datapoints:[ 
                            {date:"2021-10-09", value:"9"},
                            {date:"2021-10-25", value:"10"},
                            {date:"2021-11-07", value:"10"}
                        ],
                    } 
                ]
            },
            {
                key:"goal-"+2,
                id:"p4g2",
                title:"I am strong",
                label:"Strength",
                desc:"",
                datasetMeasures:[
                    //for now, one per goal
                    { 
                        datasetId:"606b6aef720202523cc3589d", 
                        measureKey:undefined, //will use isMain or first one
                        startValue:"15",
                        targetValue:"48",
                        //for now, just put in the measure properties as mocks
                        key:"m1",
                        title:"M1",
                        order:"highest is best",
                        unit:"secs",
                        //datapoints will be added here when got from server, embellishing each with a date and value property
                        //for now. put in mock
                        datapoints:[ 
                            {date:"2021-10-09", value:"16"},
                            {date:"2021-10-25", value:"17"},
                            {date:"2021-11-07", value:"23"}
                        ],
                    } 
                ]
            },
            {
                key:"goal-"+3,
                id:"p4g3",
                title:"I am clinical",
                label:"Clinical",
                desc:"I am clinical, ruthless and direct on the ball. End product always happens and is of good quality",
                datasetMeasures:[
                    //for now, one per goal
                    { 
                        datasetId:"608c6196285a17514c8147d0", 
                        measureKey:"score-4",//(todo - use dervied measure median of score-1, score-2 and score-3)
                        startValue:"18",
                        targetValue:"40",
                        //for now, just put in the measure properties as mocks
                        key:"m1",
                        title:"M1",
                        order:"highest is best",
                        unit:"secs",
                        //datapoints will be added here when got from server, embellishing each with a date and value property
                        //for now. put in mock
                        datapoints:[ 
                            {date:"2021-10-09", value:"19"},
                            {date:"2021-10-25", value:"21"},
                            {date:"2021-11-07", value:"22"}
                        ],
                    } 
                ]
            },
            {
                key:"goal-"+4,
                id:"p4g4",
                title:"I eat well",
                label:"Eating",
                desc:"",
                datasetMeasures:[
                    //for now, one per goal
                    { 
                        datasetId:"606b6aef720202523cc3589d", 
                        measureKey:undefined, //will use isMain or first one
                        startValue:"8",
                        targetValue:"35",
                        //for now, just put in the measure properties as mocks
                        key:"m1",
                        title:"M1",
                        order:"highest is best",
                        unit:"secs",
                        //datapoints will be added here when got from server, embellishing each with a date and value property
                        //for now. put in mock
                        datapoints:[ 
                            {date:"2021-10-09", value:"8"},
                            {date:"2021-10-25", value:"7"},
                            {date:"2021-11-07", value:"9"}
                        ],
                    } 
                ]
            }
        ]
    },
    //p2 will be the NOW planet - ie its date will me the most recent planet whose targetDate is in the past
    {
        id:"p3",
        title:"Championship top 3",
        label:"Top 3 Champ",
        desc:"I am one of the top 3 strikers in the Championship",
        startDate:"2021-05-07",
        targetDate:"2021-08-07", //YYYY-MM-DD
        goals:[]
    },
    {
        id:"p2",
        title:"Champ Regular",
        label:"Top 3 Champ",
        desc:"I am a regular starter in the Championship",
        startDate:"2020-05-07", //YYYY-MM-DD
        targetDate:"2021-05-07", //YYYY-MM-DD
        goals:[]
    },
    {
        id:"p1",
        title:"Signed for Champ",
        label:"Top 3 Champ",
        desc:"I have signed for a club in the Championship",
        targetDate:"2020-05-07", //YYYY-MM-DD
        goals:[]
    }
]

//todo - change to using datasetKey
const datasetStartDates = {
    //situps
    "606b2f653eecde47d886479a":undefined,
    //pressups
    "606b6aef720202523cc3589d":undefined
}

export const getStartDate = (dataset) => {
    const overideDate = datasetStartDates[dataset._id]
    if(overideDate){
        return overideDate;
    }
    if(dataset.datapoints[0]){
        return d3.min(dataset.datapoints, d => new Date(d.date))
    }
    return new Date().toString();
}

//"2021-04-05T00:00:00";