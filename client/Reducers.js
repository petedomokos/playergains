import C from './Constants'
import _ from 'lodash'
import * as cloneDeep from 'lodash/cloneDeep'
import { filterUniqueByProperty } from './util/ArrayHelpers'

//HELPERS
const filterUniqueById = items => filterUniqueByProperty('_id', items)

//STORE
export const user = (state={}, action) =>{
	switch(action.type){
		case C.SIGN_IN:{
			return action.user
		}
		case C.SIGN_OUT:{
			return null;
		}
		/*
		case C.SAVE_NEW_GROUP:{
			//saves a newly created group into adminGroups
			//ADD_GROUP will add an existing groupId into a specific location eg groupsFollowing
			return {
				...state, 
				adminGroups:[...state.adminGroups, action.group._id]}
		}
		case C.DELETE_GROUP:{
			//deletes the group from every location 
			//(note - REMOVE_GROUP will remove from only one location)
			return {
				...state, 
				adminGroups:state.adminGroups.filter(groupId  => groupId !== action.id),
				groupsFollowing:state.groupsFollowing.filter(groupId  => groupId !== action.id),
				groupsViewed:state.groupsViewed.filter(groupId  => groupId !== action.id),
				playerInfo:{
					...state.playerInfo, 
					groups:state.playerInfo.groups.filter(groupId  => groupId !== action.id)
				},
				coachInfo:{
					...state.coachInfo, 
					groups:state.coachInfo.groups.filter(groupId  => groupId !== action.id)
				}
			}
		}
		case C.ADD_PLAYER:{
			if(action.player._id === state._id){
				//add group to users playerInfo
				const _playerInfo = {
					...state.playerInfo, 
					groups:[...state.playerInfo.groups, action.groupId]
				}
				return {...state, playerInfo:_playerInfo}
			}
			return state
		}
		case C.REMOVE_PLAYER:{
			if(action.player._id === state._id){
				//remove group from users playerInfo
				const _playerInfo = {
					...state.playerInfo, 
					groups:state.playerInfo.groups.filter(g => g._id === action.groupId)
				}
				return {...state, playerInfo:_playerInfo}
			}
			return state
		}
		*/
		default:{
			return state
		}
	}
}

const groups = (state={}, action) =>{
	switch(action.type){
		case C.SAVE_GROUP:{
			//removes any old version and adds new version of group
			const otherGroups = state.filter(g => g._id !== action.group._id)
			return [...otherGroups, action.group]
		}
		case C.SAVE_GROUPS:{
			//removes any old version and adds new version of group
			const otherGroups = state.filter(group => 
				!action.groups.find(g => g._id === group._id))
			return [...otherGroups, ...action.groups]
		}
		case C.SAVE_NEW_GROUP:{
			return [...state, action.group]
		}
		case C.UPDATE_GROUP:{
			//updates any existing version of group, or adds if new
			const groupToUpdate = state.find(g => g._id === action.group._id) || {}
			const otherGroups = state.filter(g => g._id !== action.group._id)
			return [...otherGroups, {...groupToUpdate, ...action.group}]
		}
		case C.DELETE_GROUP:{
			return state.filter(g => g._id !== action.id)
		}
		case C.ADD_PLAYER:{
			const groupToUpdate = state.find(g => g._id === action.groupId)
			const otherGroups = state.filter(g => g._id !== action.groupId)
			return [...otherGroups, group(groupToUpdate, action)]
		}
		case C.REMOVE_PLAYER:{
			const groupToUpdate = state.find(g => g._id === action.groupId)
			const otherGroups = state.filter(g => g._id !== action.groupId)
			return [...otherGroups, group(groupToUpdate, action)]
		}
		default:
			return state
	}

}
const group = (state={}, action) =>{
	switch(action.type){
		//todo - change to update group
		//note - no need to check group as it was done in groups reducer above
		case C.SAVE_ELIGIBLE_PLAYERS:{
			if(action.groupId !== state._id)
				return state 
			return {...state, eligiblePlayers:action.players}
		}
		case C.ADD_PLAYER:{
			const otherPlayers = state.players.filter(p => p._id !== action.player._id)
			return {...state, players:[...otherPlayers, action.player]}
		}
		case C.REMOVE_PLAYER:{
			const otherPlayers = state.players.filter(p => p._id !== action.player._id)
			return {...state, players:otherPlayers}
		}
		default:
			return state
	}

}

//todo - clear available when component that needs it is finished


export const asyncProcesses= (state={}, action) =>{
	const { type, path, value } = action
	switch(type){
		case C.ERROR:{
			let _state = cloneDeep(state)
			_.set(_state, path, {error:value})
			return _state
		}
		/*
		case C.SIGN_OUT:{
			//todo - impl this return to init state
			return InitialState.asyncProcesses
		}
		*/
		case C.START:{
			let _state = cloneDeep(state)
			_.set(_state, path, {pending:true})
			return _state
		}
		case C.END:{
			let _state = cloneDeep(state)
			if(path.includes('updating')){
				_.set(_state, path, {complete:true})
			}
			else
				_.set(_state, path, false)
			return _state			
		}
		/*
		case C.RESET_STATUS:{
			let _state = cloneDeep(state)
			_.set(_state, path, false)
			return _state
		}
		*/
		default:
			return state
	}
}

export const dialogs = (state={}, action) =>{
	const { type, path, value } = action
	switch(type){
		case C.ERROR:{
		}
		/*
		case C.SIGN_OUT:{
			//todo - impl this return to init state
			return InitialState.dialogs
		}
		*/
		case C.OPEN_DIALOG:{
			let _state = cloneDeep(state)
			_.set(_state, path, true)
			return _state
		}
		case C.CLOSE_DIALOG:{
			let _state = cloneDeep(state)
			_.set(_state, path, false)
			return _state			
		}
		//automatically close dialog upon deletion
		/*
		case C.DELETE_GROUP:{
			let _state = cloneDeep(state)
			_.set(_state, "deleteGroup", false)
			return _state			
		}
		*/
		default:
			return state
	}
}