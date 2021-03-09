import C from './Constants'
import _ from 'lodash'
import * as cloneDeep from 'lodash/cloneDeep'
import { filterUniqueById, filterUniqueByProperty } from './util/ArrayHelpers'

//HELPERS


//STORE
export const user = (state={}, act) =>{
	switch(act.type){
		case C.SIGN_IN:{
			return act.user
		}
		case C.SIGN_OUT:{
			return null;
		}
		case C.UPDATE_USER:{
			return {...state, ...act.user};
		}
		default:{
			return state
		}
	}
}
//helper
const groups = (state, act) =>{
	switch(act.type){
		case C.SAVE_GROUP:{
			//removes any old version and adds new version of group
			const otherGroups = state.filter(g => g._id !== act.group._id)
			return [...otherGroups, act.group]
		}
		case C.SAVE_GROUPS:{
			//removes any old version and adds new version of group
			const otherGroups = state.filter(group => 
				!act.groups.find(g => g._id === group._id))
			return [...otherGroups, ...act.groups]
		}
		case C.SAVE_OTHER_GROUPS:{
			console.log('saving other users>>>>>>>', state)
			if(!state){
				return act.groups;
			}
			return filterUniqueById([...state, ...act.groups]);
		}
		case C.SAVE_NEW_GROUP:{
			return [...state, act.group]
		}
		case C.UPDATE_GROUP:{
			//updates any existing version of group, or adds if new
			const groupToUpdate = state.find(g => g._id === act.group._id) || {}
			const otherGroups = state.filter(g => g._id !== act.group._id)
			return [...otherGroups, {...groupToUpdate, ...act.group}]
		}
		case C.DELETE_GROUP:{
			return state.filter(g => g._id !== act.id)
		}
		case C.ADD_PLAYER:{
			const groupToUpdate = state.find(g => g._id === act.groupId)
			const otherGroups = state.filter(g => g._id !== act.groupId)
			return [...otherGroups, group(groupToUpdate, act)]
		}
		case C.REMOVE_PLAYER:{
			const groupToUpdate = state.find(g => g._id === act.groupId)
			const otherGroups = state.filter(g => g._id !== act.groupId)
			return [...otherGroups, group(groupToUpdate, act)]
		}
		default:
			return state
	}

}
const group = (state={}, act) =>{
	switch(act.type){
		//todo - change to update group
		//note - no need to check group as it was done in groups reducer above
		case C.SAVE_ELIGIBLE_PLAYERS:{
			if(act.groupId !== state._id)
				return state 
			return {...state, eligiblePlayers:act.players}
		}
		case C.ADD_PLAYER:{
			const otherPlayers = state.players.filter(p => p._id !== act.player._id)
			return {...state, players:[...otherPlayers, act.player]}
		}
		case C.REMOVE_PLAYER:{
			const otherPlayers = state.players.filter(p => p._id !== act.player._id)
			return {...state, players:otherPlayers}
		}
		default:
			return state
	}

}

export const other = (state={}, act) =>{
	switch(act.type){
		//should maybe remove first case fro now, so all we do is load all users
		case C.SAVE_OTHER_USER:{
			console.log('saving other user>>>>>>>')
			return { ...state, users: users(state.users, act) }
		}
		case C.SAVE_OTHER_USERS:{
			console.log('saving other users>>>>>>>')
			return { ...state, users:users(state.users, act) }
		}
		case C.SAVE_OTHER_GROUPS:{
			console.log('saving other users>>>>>>>')
			return { ...state, groups:groups(state.groups, act) }
		}
		default:
			return state;
	}
}

const users = (state, act) =>{
	switch(act.type){
		//remove first case for, as all users are just loaded
		case C.SAVE_OTHER_USER:{
			console.log('saving other user>>>>>>>', state)
			//if user already stored, we amend existing user, so we dont overwrite any other properties
			//that have already been loaded that are not part of this load
			if(!state){
				return [act.user]
			}
			const userToAmend = state.find(user => user._id === act.user._id) || {};
			const otherUsers = state.filter(user => user._id !== act.user.id);
			return [otherUsers, {...userToAmend, ...act.user}];
		}
		//unlike case 1, this overwrites, not amends, users that are already saved, if the same user is being saved again
		case C.SAVE_OTHER_USERS:{
			console.log('saving other users>>>>>>>', state)
			if(!state){
				return act.users;
			}
			return filterUniqueById([...state, ...act.users]);
		}
		default:
			return state;
	}
}

export const asyncProcesses = (state={}, act) =>{
	const { type, path, value } = act
	switch(type){
		case C.ERROR:{
			let _state = cloneDeep(state)
			const errorPath = 'error.'+path
			_.set(_state, errorPath, value)
			return _state
		}
		case C.START:{
			let _state = cloneDeep(state)
			_.set(_state, path, true)
			console.log('_state', _state)
			return _state
		}
		case C.END:{
			let _state = cloneDeep(state)
			_.set(_state, path, false)
			return _state			
		}
		default:
			return state
	}
}

export const dialogs = (state={}, act) =>{
	const { type, path, value } = act
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