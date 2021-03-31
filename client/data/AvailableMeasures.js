/*
some default configurables are put in for some measures. User has option to change when they select measure
//id is namekey-nrkey-sidekey eg time-1-l, time-1-r or time-0-u
number - 1,2,3,... this can be used to have multiple measures for a dataset of same name eg laps (time) or attempts (distance/time/points)
side - left or right or both

MANUAL - WHEN USER SELECTS, THEY ALSO CHOOSE THESE, ALTHOUYGH SOME DEFAULT VALUES ARE SHOW (eg time min = 0)
numberOrder - low-to-high or high-to-low
min
max
*/
export const availableMeasures = [
	{ 
		key:'time', name : 'Time', nr:"", side:"", custom:"", initials: "Time", numberOrder:'high-to-low', min:0,
	  	unit:'seconds', unitOptions:['seconds','minutes', 'hours'] 
	},
	{ 
		key:'distance', name : 'Distance', nr:"", side:"", custom:"", initials: "Dist",  numberOrder:'low-to-high', min:0,
		unit:'metres', unitOptions:['centimetres', 'metres', 'kilometres']
	},
    { 
		key:'score', name : 'Score', nr:"", side:"", custom:"", initials: "Score",  numberOrder:'low-to-high', min:0,
		unit:'points', unitOptions:['points', 'goals', 'laps', 'reps', 'sets']
	},
	{ 
		key:'reps', name : 'Reps', nr:"", side:"", custom:"", initials: "Reps",  numberOrder:'low-to-high', min:0,
		unit:'reps', unitOptions:['reps']
	},
	//pens default unit is '' ie none
	{ 
		key:'penalties', name : 'Penalties', nr:"", side:"",  custom:"", initials: "Pens", numberOrder:'high-to-low', min:0,
	  	unitOptions:['points', 'seconds', 'goals']
	}
]

//todo - think about derived formulae-based measures eg total = points - penalties
	//{ measureType:'derived', name : 'Score', initials: "Score", key:'score-func', unit:'metres' }

export const units = [
	{name:'seconds', initials:'s'},
	{name:'minutes', initials:'min'},
	{name:'hours', initials:'hrs'},
	{name:'centimetres', initials:'cm'},
	{name:'metres', initials:'m'},
	{name:'kilometres', initials:'km'},
	{name: 'points', initials:'pts'},
	{name: 'goals', initials:'gls'}
]

//Name, Number, Side and Custom Label uniquely identifies the measure within any dataset. Thsi combination of 4 cannot be identical for 2
//measures in the same dataset.
//The id is just m1,m2,m3 etc, which combines with datasetId to give a uId throughout the entire app.
//name is displayed as Primary Text = name, Secondary Text = Side Number
// eg Time (Left) would be if nr is "none". also side = "unspecified" shows as "" 
// - so if its number = 0 and side unspecified, the secondary Text = "" ie we just see primary text
//so if user just wants a custom name eg Score Volleys, then it will have id score-U-0-Volleys
//whereas if they want left volleys, then its score-L-0-Volleys
//custome names have spaces replaced with -

//also, each measure is given an id which is datasetId-m1, datasetId-m2, etc and 
//when typing in a formula for a custom measure, we can us the last part of is eg m1 + m2 / 3  [use d for divided by if there are html issues]
//for custom measure, key is name with spaces replaced by _ (not - as user may use that in a name)

//defaults can be overridden in a measure ( see measures object above -> for time, default is set to "lowest is best")
export const measureConfig = {
	nr:{
		name:"Number", options:["none", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"], default:"none"
	},
	side:{
		name:"Side", options:["unspecified", "left", "right"], default:"unspecified"
	},
	custom:{
		name:"Custom Label", valueType:"string", default:""
	},
	unit:{
		name:"Unit", options:[...units.map(unit => unit.name), "none"], default:"none"
	},
	order:{
		name:"Order", options:["highest is best", "lowest is best"], default:"highest is best"
	},
	min:{
		name:"Minimum", valueType:"number", default:"0"
	},
	max:{
		name:"Maximum", valueType:"number", default:""
	}
}