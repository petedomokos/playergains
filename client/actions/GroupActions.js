import C from '../Constants'
//import { filterUniqueByProperty } from '../util/helpers/ArrayManipulators'
import { status, parseResponse, logError, 
	fetchStart, fetchEnd, fetchThenDispatch, resetStatus} from './CommonActions'

//to fetch a group in full
export const fetchGroup = id => dispatch => {
	fetchThenDispatch(dispatch, 
		'loading.group',
		{
			url: '/api/groups/' +id, 
			requireAuth:true,
			processor: data => {return {type:C.SAVE_GROUP, group:data}}
		})
}
export const fetchGroups = () => dispatch => {
    fetchThenDispatch(dispatch, 
        'loading.groups',
        {
            url: '/api/groups',
            requireAuth:true,
            nextAction: data => {return {type:C.SAVE_OTHER_GROUPS, groups:data}}
        })
}


export const createGroup = group => dispatch => {
	console.log("actions.createGroup()")
	fetchThenDispatch(dispatch, 
		'creating.group',
		{
			url: '/api/groups/',
			method: 'POST',
			headers:{
	        	'Accept': 'application/json'
	      	},
			body:group, //not stringify as its a formidable object
			requireAuth:true,
			processor: data => {return {type:C.SAVE_NEW_GROUP, group:data, connection:'admin'}}
		})
}

export const deleteGroup = (id, history) => dispatch => {
	console.log("actions.deleteGroup() history")
	fetchThenDispatch(dispatch, 
		'deleting.group',
		{
			url: '/api/groups/'+id,
			method: 'DELETE',
			requireAuth:true,
			processor: data => {
				history.push("/")
				return {type:C.DELETE_GROUP, id:id}
			}
		})
}

export const updateGroup = (id, formData, history) => dispatch => {
	fetchThenDispatch(dispatch, 
		'updating.group',
		{
			url: '/api/groups/'+id,
			method: 'PUT',
			headers:{
	        	'Accept': 'application/json'
	      	},
			body:formData, //not stringify as its a formidable object
			requireAuth:true,
			processor: data => {
				history.push("/group/"+id)
				return {type:C.SAVE_GROUP, group:data}
			}
		})
}
/*
export const addPlayer = (player, groupId) => dispatch => {
	//add to group in store first so UI not held up
	//warning - this will only save teh client side details of player, not th eplayer that is returned from server.
	//if later we need more details, we should re-save the player when returned from server too
	dispatch(
		{type:'ADD_PLAYER', groupId:groupId, player:player})
	//todo - error handler must warn and remove again if server error
	fetchThenDispatch(dispatch, 'updating.group.players', 
		{
			url: '/api/group/players/add',
			method:'PUT', 	
		 	requireAuth:true,
		 	body:JSON.stringify({playerId:player._id, groupId:groupId}),
		 	errorHandler:error =>{
				logError(error)
			 	alert("Server error: Player "+player._id+" was not added. Try again.")
			 	//remove player in store as it wasnt added at server
			 	dispatch({type:'REMOVE_PLAYER', groupId:groupId, player:player})
			}
		})
}

export const removePlayer = (player, groupId) => dispatch => {
	//remove from group in store first so UI not held up
	dispatch(
		{type:'REMOVE_PLAYER', groupId:groupId, player:player})
	//todo - error handler must warn and add again if server error
	fetchThenDispatch(dispatch, 'updating.group.players', 
		{
			url: '/api/group/players/remove',
		 	method:'PUT', 	
		 	requireAuth:true,
		 	body:JSON.stringify({playerId:player._id, groupId:groupId}),
			errorHandler:error =>{
				logError(error)
			 	alert("Server error: Player "+player._id+" was not removed. Try again.")
			 	//add player back in store as it wasnt removed at server
			 	dispatch({type:'ADD_PLAYER', groupId:groupId, player:player})
			}
		})
}

export const addDataset = (dataset, groupId) => dispatch => {
	console.log('actions addDataset dataset ', dataset)
	//save to server first. if succ, then save to store
	//for now, whole group is returned and updated in store
	fetchThenDispatch(dispatch, 'updating.group.datasets', 
		{
			url: '/api/group/'+groupId+'/datasets/add',
		 	method:'PUT', 	
		 	requireAuth:true,
		 	processor: data => {
				return {
					type:C.SAVE_GROUP, group:data
				}
			},
		 	body:JSON.stringify(dataset),
			errorHandler:error =>{
				logError(error)
			}
		})
}
export const deleteDataset = (groupId, datasetId) => dispatch => {
	console.log('actions deleteDataset dataset ', datasetId)
	//save to server first. if succ, then save to store
	//for now, whole group is returned and updated in store
	fetchThenDispatch(dispatch, 'updating.group.datasets', 
		{
			url: '/api/group/'+groupId+'/dataset/'+datasetId,
		 	method:'DELETE', 	
		 	requireAuth:true,
		 	processor: data => {
				return {
					type:C.SAVE_GROUP, group:data
				}
			},
			errorHandler:error =>{
				logError(error)
			}
		})
}
export const updateDataset = (groupId, dataset) => dispatch => {
	fetchThenDispatch(dispatch, 
		'updating.dataset',
		{
			url: '/api/group/'+groupId +'/dataset/'+dataset._id,
			method: 'PUT',
			body:JSON.stringify(dataset), //not stringify as its a formidable object
			requireAuth:true,
			processor: data => {
				return {type:C.SAVE_GROUP, group:data}
			}
		})
}
//todo - consider removing this and just use updateDataset to add a point ?
export const addDatapoint = (datapoint, groupId, datasetId) => dispatch => {
	//save to server first. if succ, then save to store
	console.log('actions..addDatapoint datapoint', datapoint)
	fetchThenDispatch(dispatch, 'updating.dataset.datapoints', 
		{
			url: '/api/group/'+groupId+'/dataset/'+datasetId+'/datapoints/add',
		 	method:'PUT', 	
		 	requireAuth:true,
		 	processor: data => {
				return {
					type:C.SAVE_GROUP, group:data
				}
			},
		 	body:JSON.stringify(datapoint),
			errorHandler:error =>{
				logError(error)
			}
		})
}

*/