import C from './Constants'
import _ from 'lodash'
import * as cloneDeep from 'lodash/cloneDeep'
import { filterUniqueById, filterUniqueByProperty } from './util/ArrayHelpers'
import { InitialState } from './InitialState'
import { GroupOutlined } from '@material-ui/icons'
//HELPERS


//STORE
export const user = (state=InitialState.user, act) =>{
	switch(act.type){
		//SIGNED IN USER
		case C.SIGN_IN:{
			const { administeredUsers, administeredGroups, groupsMemberOf } = act.user;
			//put all users and groups into loadedUsers and loadedGroups
			//and reset those to model state (ie just list of ids)
			return { 
				...state, 
				...act.user,
				administeredUsers:administeredUsers.map(us => us._id),
				administeredGroups:administeredGroups.map(g => g._id),
				groupsMemberOf:groupsMemberOf.map(g => g._id),
				//store the deeper objects here in one place
				loadedUsers:[...administeredUsers], //later iterations will have following etc
				loadedGroups:[...administeredGroups, ...groupsMemberOf]
			}
		}
		case C.SIGN_OUT:{
			return InitialState.user;
		}
		case C.UPDATE_SIGNEDIN_USER:{
			return { ...state, ...act.user };
		}
		//OTHER USERS AND GROUPS
		//CREATE
		case C.CREATE_NEW_ADMINISTERED_USER:{
			return { 
				...state, 
				administeredUsers:[...state.administeredUsers, act.user._id],
				loadedUsers:[...state.loadedUsers, act.user]
			}
		}
		case C.CREATE_NEW_ADMINISTERED_GROUP:{
			return { 
				...state, 
				administeredGroups:[...state.administeredGroups, act.group._id],
				loadedGroups:[...state.loadedGroups, act.group]
			}
		}
		//UPDATE (overwrite properties with any updated or new ones)
		case C.UPDATE_ADMINISTERED_USER:{
			//we only update in loadedUsers, as _id doesnt ever change
			const userToUpdate = state.loadedUsers.find(us => us._id === act.user._id);
			const updatedUser = { ...userToUpdate, ...act.user }
			//use filter to remove old version, and add updated version
			return {
				...state,
				loadedUsers:filterUniqueById([...state.administeredUsers, updatedUser])
			}
		}
		case C.UPDATE_ADMINISTERED_GROUP:{
			//we only update in loadedUsers, as _id doesnt ever change
			const groupToUpdate = state.loadedGroups.find(g => g._id === act.group._id);
			const updatedGroup = { ...groupToUpdate, ...act.group };
			//use filter to remove old version, and add updated version
			return {
				...state,
				loadedGroups:filterUniqueById([...state.administeredGroups, updatedGroup])
			}
		}
		//DELETE
		//must remove from both administered and loaded arrays
		case C.DELETE_ADMINISTERED_USER:{
			return {
				...state,
				administeredUsers:state.administeredUsers.filter(us => us._id !== act.user._id),
				loadedUsers:state.loadedUsers.filter(us => us._id !== act.user._id)
			}
		}
		case C.DELETE_ADMINISTERED_GROUP:{
			return {
				...state,
				administeredGroups:state.administeredGroups.filter(g => g._id !== act.group._id),
				loadedGroups:state.loadedGroups.filter(g => g._id !== act.group._id)
			}
		}
		//LOAD EXISTING FROM SERVER 
		//Note 1 - this cannot be the signed in user - they are always loaded fully
		//Note 2 - this will overwrite/enhance any existing objects rather than replace
		case C.LOAD_USER:{
			//find if there is any existing version to update
			const userToUpdate = state.loadedUsers.find(us => us._id === act.user._id) || {};
			const updatedUser = { ...userToUpdate, ...act.user }
			return { 
				...state, 
				loadedUsers:[...state.loadedUsers, updatedUser]
			}
		}
		case C.LOAD_GROUP:{
			//find if there is any existing version to update
			const groupToUpdate = state.loadedGroups.find(g => g._id === act.group._id) || {};
			const updatedGroup = { ...groupToUpdate, ...act.group }
			return { 
				...state, 
				loadedGroups:[...state.loadedGroups, updatedGroup]
			}
		}
		case C.LOAD_USERS:{
			//these user objects will be shallow, so we dont overwrite any 
			//existing deeper versions, so if user already exists, then it is not loaded
			const usersNotLoadedBefore = act.users
				.filter(us => us._id !== state._id)
				.filter(us => !state.loadedUsers.find(u => u._id === us._id))
			

			//for now, all users are sent first time
			return { 
				...state, 
				loadedUsers:[...state.loadedUsers, ...usersNotLoadedBefore],
				loadsComplete:{ ...state.loadsComplete, users:true }
			}
		}
		
		case C.LOAD_GROUPS:{
			//these user objects will be shallow, so we dont overwrite any 
			//existing deeper versions, so if user already exists, then it is not loaded
			const groupsNotLoadedBefore = act.groups
				.filter(grp => !state.loadedGroups.find(g => g._id === grp._id))

			return { 
				...state, 
				loadedGroups:[...state.loadedGroups, ...groupsNotLoadedBefore],
				loadsComplete:{ ...state.loadsComplete, groups:true }
			}
		}
		default:{
			console.log('default returniung state')
			return state
		}

	}
}
/*
//CANNOT CALL THIS USER
const otherUser = (state, act) =>{
	switch(act.type){
		case C.UPDATE_ADMINISTERED_USER:{
			
		}
		case C.LOAD_USER:{
			return {...state, ...act.user}
		}
		default:
			return state;
	}
}
*/
/*
const group = (state, act) =>{
	switch(act.type){
		case C.ADD_PLAYER:{
			
		}
		case C.REMOVE_PLAYER:{
			return {...state, ...act.group}
		}
		default:
			return state
	}
}
*/
/*
Need to remove during main actions, not fetchEnd
*/

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
			return _state
		}
		case C.END:{
			let _state = cloneDeep(state)
			_.set(_state, path, false)
			return _state			
		}
		case C.SIGN_OUT:{
			return InitialState.asyncProcesses;
		}
		default:
			return state
	}
}

export const dialogs = (state={}, act) =>{
	const { type, path, value } = act
	switch(type){
		case C.SIGN_UP:{
			return { ...state, signup:true };
		}
		//create - user has created, so dialog must open for next steps
		case C.CREATE_NEW_ADMINISTERED_USER:{
			return { ...state, createUser:true };
		}
		case C.CREATE_NEW_ADMINISTERED_GROUP:{
			return { ...state, createGroup:true };
		}
		//delete - user has confirmed delete and been redirected, so dialog must close
		case C.DELETE_ADMINISTERED_USER:{
			return { ...state, deleteUser:false };
		}
		case C.DELETE_ADMINISTERED_GROUP:{
			return { ...state, deleteGroup:false };
		}
		case C.ERROR:{
		}
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
		case C.SIGN_OUT:{
			return InitialState.dialogs;
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