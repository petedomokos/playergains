import C from '../Constants'
import { status, parseResponse, logError, 
	fetchStart, fetchEnd, fetchThenDispatch} from './CommonActions'
import auth from '../auth/auth-helper'
import { signout } from './Auth.Actions.js'

export const fetchUser = id => dispatch => {
	fetchThenDispatch(dispatch, 
		'loading.user',
		{
			url: '/api/user/'+id, 
			requireAuth:true,
			nextAction: data => {
				const jwt = auth.isAuthenticated()
				//may be reloading the signed in user
				const userIsSignedIn = jwt ? jwt.user._id === data._id : false
				return {
					type:C.SAVE_USER, user:data, userIsSignedIn:userIsSignedIn
				}
			}
		}) 
}



















export const fetchUsers = id => dispatch => {
	fetchThenDispatch(dispatch, 
		'loading.user',
		{
			url: '/api/users/', 
			requireAuth:true,
			nextAction: data => {
				return { type:C.SAVE_USERS, users:data }
			}
		}) 
}

//returns the action to be dispatched that will save the user
/*
export const saveUser = user =>{
	//gather all groups and players  into one array for client-side manipulation
	//Any temporary saving and retrieving of data on client side happens in here
	//with specific group and player arrays within user used as references only
	TODO - make this a helper method accessible from anywhere in app
	const groups = [
		...user.adminGroups, 
		...user.groupsFollowing,
		...user.groupsViewed, 
		...user.playerInfo.groups,
		...user.coachInfo.groups]
	const filteredGroups = filterUniqueByProperty('_id', groups)
	const players = [
	//todo - add playersFollowing and playersViewed properties to user.model
		...user.adminGroups.map(g => g.players),   
		...user.playerInfo.groups.map(g => g.players), 
		...user.coachInfo.groups.map(g => g.players)]
	const filteredPlayers = filterUniqueByProperty('_id', players)
	const userWithGroupsAndPlayers = {...user, groups:filteredGroups, players:filteredPlayers}
	//return {
		//type:C.SAVE_USER, user:userWithGroupsAndPlayers
	//}

}
*/

export const updateUser = (id, formData, history) => dispatch => {
	fetchThenDispatch(dispatch, 
		'updating.user',
		{
			url: '/api/user/'+id,
			method: 'PUT',
			headers:{
	        	'Accept': 'application/json'
	      	},
			body:formData, //not stringify as its a formidable object
			requireAuth:true,
			nextAction: data => {
				history.push("/")
				const jwt = auth.isAuthenticated()
				const userIsSignedIn = jwt ? jwt.user._id === data._id : false
				return {
					type:C.SAVE_USER, user:data, userIsSignedIn:userIsSignedIn
				}
			}
		})
}
export const deleteUser = (id, history) => dispatch => {
	//console.log("actions.deleteUser()")
	//deleting ok, but DELETE_USER action not impl in reducer
	//and also need to clear session storage 
	fetchThenDispatch(dispatch, 
		'deleting.user',
		{
			url: '/api/user/'+id,
			method: 'DELETE',
			requireAuth:true,
			nextAction: data => signout(history)
		})
}