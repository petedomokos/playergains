import C from './Constants'
import _ from 'lodash'
import * as cloneDeep from 'lodash/cloneDeep'
import { isIn, isNotIn, isSame, filterUniqueById, filterUniqueByProperty } from './util/ArrayHelpers'
import { InitialState } from './InitialState'
import { GroupOutlined } from '@material-ui/icons'
//HELPERS

//STORE
export const user = (state=InitialState.user, act) =>{
	switch(act.type){
		//SIGNED IN USER
		case C.SIGN_IN:{
			const { admin, administeredUsers, administeredGroups, administeredDatasets, groupsMemberOf, datasetsMemberOf } = act.user;
			//put all users and groups into loadedUsers and loadedGroups
			//and reset those to model state (ie just list of ids)
			return { 
				...state, 
				...act.user,
				admin:admin.map(us => us._id),
				administeredUsers:administeredUsers.map(us => us._id),
				administeredGroups:administeredGroups.map(g => g._id),
				administeredDatasets:administeredDatasets.map(g => g._id),
				groupsMemberOf:groupsMemberOf.map(g => g._id),
				datasetsMemberOf:datasetsMemberOf.map(dset => dset._id),
				//store the deeper objects here in one place
				loadedUsers:filterUniqueById([...admin, ...administeredUsers]), //later iterations will have following etc
				loadedGroups:filterUniqueById([...administeredGroups, ...groupsMemberOf]),
				loadedDatasets:filterUniqueById([...administeredDatasets, ...datasetsMemberOf])
			}
		}
		case C.SIGN_OUT:{
			return InitialState.user;
		}
		case C.UPDATE_SIGNEDIN_USER:{
			//this doesnt update administered users or groups, just basic details eg name, email,...
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
		case C.CREATE_NEW_ADMINISTERED_DATASET:{
			return { 
				...state, 
				administeredDatasets:[...state.administeredDatasets, act.dataset._id],
				loadedDatasets:[...state.loadedDatasets, act.dataset]
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
				loadedUsers:filterUniqueById([updatedUser, ...state.administeredUsers])
			}
		}

		case C.UPDATE_ADMINISTERED_GROUP:{
			//we only update in loadedUsers, as _id doesnt ever change
			const groupToUpdate = state.loadedGroups.find(g => g._id === act.group._id);
			const updatedGroup = { ...groupToUpdate, ...act.group };
			var updatedLoadedUsers = state.loadedUsers;
			//adding and removing players -> add/remove groupId from affected players
			if(!isSame(groupToUpdate.players, updatedGroup.players)){
				const playersAdded = updatedGroup.players.filter(userId => !groupToUpdate.players.includes(userId))
				console.log('playersAdded', playersAdded)
				const playersRemoved = groupToUpdate.players.filter(userId => !updatedGroup.players.includes(userId))
				console.log('playersRemoved', playersRemoved)
				updatedLoadedUsers = state.loadedUsers.map(user =>{
					//only add groupId to user if groupsMemberOf is loaded (ie deep version of user is loaded)
					if(!user.groupsMemberOf){
						return user;
					}
					if(playersAdded.includes(user._id)){
						//add groupId to user
						return { ...user, groupsMemberOf:[...user.groupsMemberOf, act.group._id]}
					}
					if(playersRemoved.includes(user._id)){
						//remove groupId from user
						return { ...user, groupsMemberOf:user.groupsMemberOf.filter(g => g._id !== act.group._id) }
					}
					//no change
					return user
				});
			}
			//use filter to remove old version, and add updated version
			return {
				...state,
				loadedGroups:filterUniqueById([updatedGroup, ...state.administeredGroups]),
				loadedUsers:updatedLoadedUsers
			}
		}

		case C.UPDATE_ADMINISTERED_DATASET:{
			//we only update in loadedUsers, as _id doesnt ever change
			const datasetToUpdate = state.loadedDatasets.find(dset => dset._id === act.dataset._id);
			const updatedDataset = { ...datasetToUpdate, ...act.dataset };
			var updatedLoadedUsers = state.loadedUsers;
			//adding and removing players -> add/remove datasetId from affected players
			//note - anyone can add players they administer to a dataset, its not like group where they need to be in group.admin
			//also a group admin can add/remove all players from their group to a dataset in one go (just by doing add/remove dataset from group page)
			if(!isSame(datasetToUpdate.players, updatedDataset.players)){
				const playersAdded = updatedDataset.players.filter(userId => !datasetToUpdate.players.includes(userId))
				console.log('playersAdded', playersAdded)
				const playersRemoved = datasetToUpdate.players.filter(userId => !updatedDataset.players.includes(userId))
				console.log('playersRemoved', playersRemoved)
				updatedLoadedUsers = state.loadedUsers.map(user =>{
					//only add datasetId to user if datasetsMemberOf is loaded (ie deep version of user is loaded)
					if(!user.datasetsMemberOf){
						return user;
					}
					if(playersAdded.includes(user._id)){
						//add groupId to user
						return { ...user, datasetsMemberOf:[...user.datasetsMemberOf, act.dataset._id]}
					}
					if(playersRemoved.includes(user._id)){
						//remove groupId from user
						return { ...user, datasetsMemberOf:user.datasetsMemberOf.filter(dset => dset._id !== act.dataset._id) }
					}
					//no change
					return user
				});
			}
			//add/remove datapoint
			if(!isSame(datasetToUpdate.datapoints, updatedDataset.datapoints)){
				//todo ....
			}
			//use filter to remove old version, and add updated version
			return {
				...state,
				loadedDatasets:filterUniqueById([updatedDataset, ...state.administeredDatasets]),
				loadedUsers:updatedLoadedUsers
			}
		}
		//DELETE
		//must remove from both administered and loaded arrays
		case C.DELETE_ADMINISTERED_USER:{
			//must also remove the userId from any users administeredGroups
			const updatedLoadedUsers = state.loadedUsers
				.filter(us => us._id !== act.user._id)
				.map(user =>{
					//if deep version of user is loaded and user was in the administered list
					if(user.administeredUsers && user.administeredUsers.includes(act.user._id)){
						//remove groupId from list
						return { 
							...user, 
							administeredUsers:user.administeredUsers.filter(g => g._id !== act.user._id)
						}
					}
					return user;
				})

			return {
				...state,
				administeredUsers:state.administeredUsers.filter(us => us._id !== act.user._id),
				loadedUsers:updatedLoadedUsers
			}
		}
		case C.DELETE_ADMINISTERED_GROUP:{
			//must also remove the groupId from any users administeredGroups
			const updatedLoadedUsers = state.loadedUsers
				.map(user =>{
					//if deep version of user is loaded and group was in the administered list
					if(user.administeredGroups && user.administeredGroups.includes(act.group._id)){
						//remove groupId from list
						return { 
							...user, 
							administeredGroups:user.administeredGroups.filter(g => g._id !== act.group._id)
						}
					}
					return user;
				})

			return {
				...state,
				administeredGroups:state.administeredGroups.filter(g => g._id !== act.group._id),
				loadedGroups:state.loadedGroups.filter(g => g._id !== act.group._id),
				loadedUsers:updatedLoadedUsers

			}
		}

		case C.DELETE_ADMINISTERED_DATASET:{
			//must also remove the datasetId from any users administeredDatasets
			const updatedLoadedUsers = state.loadedUsers
				.map(user =>{
					//if deep version of user is loaded and dataset was in the administered list
					if(user.administeredDatasets && user.administeredDatasets.includes(act.dataset._id)){
						//remove datasetId from list
						return { 
							...user, 
							administeredDatasets:user.administeredDatasets.filter(dset => dset._id !== act.dataset._id)
						}
					}
					return user;
				})

			return {
				...state,
				administeredDatasets:state.administeredDatasets.filter(dset => dset._id !== act.dataset._id),
				loadedDatasets:state.loadedDatasets.filter(dset => dset._id !== act.dataset._id),
				loadedUsers:updatedLoadedUsers

			}
		}

		//LOAD EXISTING FROM SERVER
		
		
		//1. SINGLE DEEP LOADS -------------------------------------------------------------------------------------
		//Note 1 - this cannot be the signed in user - they are always loaded fully
		//Note 2 - this will overwrite/enhance any existing objects rather than replace
		case C.LOAD_USER:{
			const { admin, administeredUsers, administeredGroups, administeredDatasets, groupsMemberOf, datasetsMemberOf } = act.user;
			//find if there is any existing version to update
			const userToUpdate = state.loadedUsers.find(us => us._id === act.user._id) || {};
			const updatedUser = { 
				...userToUpdate, 
				...act.user,
				//these are added here as not in shallow loads (without deep loads, we can still tell which users are administered
				//by the signed on user)
				admin:admin.map(us => us._id),
				administeredUsers:administeredUsers.map(us => us._id),
				administeredGroups:administeredGroups.map(g => g._id),
				administeredDatasets:administeredDatasets.map(g => g._id),
				groupsMemberOf:groupsMemberOf.map(g => g._id),
				datasetsMemberOf:datasetsMemberOf.map(dset => dset._id)
			}
			//All teh following groups come in from server in shallow form, not just flat ids.
			//we save them to teh central group store, to be accessed when required by containers
			const mergedAdmin = admin.map(adminUser => {
				const existingVersion = state.loadedUsers.find(us => us._id === adminUser._id) || {};
				//override any properties in latest version from server, in case of database changes from elsewhere
				//but maintain any properties not sent from server ie deep properties
				return { ...existingVersion, ...adminUser }
			})
			const mergedAdministeredUsers = administeredUsers.map(administeredUser => {
				const existingVersion = state.loadedUsers.find(us => us._id === administeredUser._id) || {};
				//override any properties in latest version from server, in case of database changes from elsewhere
				//but maintain any properties not sent from server ie deep properties
				return { ...existingVersion, ...administeredUser }
			})
			const mergedAdministeredGroups = administeredGroups.map(adminGroup => {
				const existingVersion = state.loadedGroups.find(us => us._id === adminGroup._id) || {};
				//override any properties from server, but maintain any other properties
				return { ...existingVersion, ...adminGroup }
			})
			const mergedAdministeredDatasets = administeredDatasets.map(adminDataset => {
				const existingVersion = state.loadedDatasets.find(us => us._id === adminDataset._id) || {};
				//override any properties from server, but maintain any other properties
				return { ...existingVersion, ...adminDataset }
			})
			const mergedGroupsMemberOf = groupsMemberOf.map(groupMemberOf => {
				const existingVersion = state.loadedGroups.find(us => us._id === groupMemberOf._id) || {};
				//override any properties from server, but maintain any other properties
				return { ...existingVersion, ...groupMemberOf }
			})
			const mergedDatasetssMemberOf = datasetsMemberOf.map(datasetMemberOf => {
				const existingVersion = state.loadedGroups.find(us => us._id === datasetMemberOf._id) || {};
				//override any properties from server, but maintain any other properties
				return { ...existingVersion, ...datasetMemberOf }
			})
			return { 
				...state,
				//user is deep , so we overide any existing version
				loadedUsers:filterUniqueById([...mergedAdmin, ...mergedAdministeredUsers, updatedUser, ...state.loadedUsers]),
				loadedDatasets:filterUniqueById([...mergedAdministeredDatasets, ...mergedDatasetsMemberOf, ...state.loadedDatasets]),
				loadedGroups:filterUniqueById([...mergedAdministeredGroups, ...mergedGroupsMemberOf, ...state.loadedGroups])
			}
		}
		case C.LOAD_GROUP:{
			const { admin, players, datasets } = act.group;
			//find if there is any existing version to update
			const groupToUpdate = state.loadedGroups.find(g => g._id === act.group._id) || {};
			const updatedGroup = { 
				...groupToUpdate, 
				...act.group,
				//these are added here as not in shallow loads (without deep loads, we can still tell which groups are administered
				//by the signed on user)
				admin:admin.map(us => us._id),
				players:players.map(us => us._id),
				datasets:datasets.map(dset => dset._id)
			}
			console.log('updatedgroup being added to loadedgroups', updatedGroup)
			/*const mergedAdmin = admin.map(adminUser => {
				const existingVersion = state.loadedUsers.find(us => us._id === adminUser._id) || {};
				//override any properties in latest version from server, in case of database changes from elsewhere
				//but maintain any properties not sent from server ie deep properties
				return { ...existingVersion, ...adminUser }
			})*/
			const mergedPlayers = players.map(player => {
				const existingVersion = state.loadedUsers.find(us => us._id === player._id) || {};
				//override any properties in latest version from server, in case of database changes from elsewhere
				//but maintain any properties not sent from server ie deep properties
				return { ...existingVersion, ...player }
			})
			return { 
				...state,
				//group is deep, so we will override any existing version
				loadedGroups:filterUniqueById([updatedGroup, ...state.loadedGroups]),
				loadedUsers:filterUniqueById([/*...mergedAdmin, */ ...mergedPlayers, ...state.loadedUsers])
			}
		}

		case C.LOAD_DATASET:{
			const { admin, datapoints } = act.dataset;
			//find if there is any existing version to update
			const datasetToUpdate = state.loadedDatasets.find(dset => dset._id === act.dataset._id) || {};
			const updatedDataset = { 
				...datasetToUpdate, 
				...act.dataset,
				//these are added here as not in shallow loads (without deep loads, we can still tell which datasets are administered
				//by the signed on user)
				admin:admin.map(us => us._id),
				datapoints:datapoints.map(d => d._id)
			}
			console.log('updateddataset being added to loadeddatasets', updatedDataset)
			return { 
				...state,
				//dataset is deep, so we will override any existing version
				loadedDatasets:filterUniqueById([updatedDataset, ...state.loadedDatasets]),
			}
		}
		//2. MULTIPLE SHALLOW LOADS -------------------------------------------------------------------------------------

		//FOR NOW, THIS GETS US ALL USERS, SO WE JUST SET LOADSCOMPLETE=TRUE THE FIRST TIME
		//IN FUTURE, WE WILL NEED TO KNOW HOW MANY USERS ARE AVAILABLE ON SERVER
		case C.LOAD_USERS:{
			//these user objects will be shallow, so we dont overwrite any 
			//existing deeper versions, so if user already exists, then it is not loaded
			const usersNotLoadedBefore = act.users
				.filter(us => us._id !== state._id)
				.filter(us => !state.loadedUsers.find(u => u._id === us._id))
			console.log('USERS NOT LOADED B4', usersNotLoadedBefore)
			//for now, all users are sent first time
			return { 
				...state, 
				loadedUsers:[...state.loadedUsers, ...usersNotLoadedBefore],
				loadsComplete:{ ...state.loadsComplete, users:'complete' }
			}
		}
		//FOR NOW, THIS GETS US ALL GROUPs, SO WE JUST SET LOADSCOMPLETE=TRUE THE FIRST TIME
		//IN FUTURE, WE WILL NEED TO KNOW HOW MANY GROUPS ARE AVAILABLE ON SERVER
		case C.LOAD_GROUPS:{
			//these user objects will be shallow, so we dont overwrite any 
			//existing deeper versions, so if user already exists, then it is not loaded
			const groupsNotLoadedBefore = act.groups
				.filter(grp => !state.loadedGroups.find(g => g._id === grp._id))

			return { 
				...state, 
				loadedGroups:[...state.loadedGroups, ...groupsNotLoadedBefore],
				loadsComplete:{ ...state.loadsComplete, groups:'complete' }
			}
		}
		default:{
			console.log('default returniung state')
			return state
		}

		//FOR NOW, THIS GETS US ALL DATASETs, SO WE JUST SET LOADSCOMPLETE=TRUE THE FIRST TIME
		//IN FUTURE, WE WILL NEED TO KNOW HOW MANY DATASETS ARE AVAILABLE ON SERVER
		case C.LOAD_DATASETS:{
			//these user objects will be shallow, so we dont overwrite any 
			//existing deeper versions, so if user already exists, then it is not loaded
			const datasetsNotLoadedBefore = act.datasets
				.filter(dataset => !state.loadedDatasets.find(dset => dset._id === dataset._id))

			return { 
				...state, 
				loadedDatasets:[...state.loadedDatasets, ...datasetsNotLoadedBefore],
				loadsComplete:{ ...state.loadsComplete, datasets:'complete' }
			}
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
		case C.CREATE_NEW_ADMINISTERED_DATASET:{
			return { ...state, createDataset:true };
		}
		
		//delete - user has confirmed delete and been redirected, so dialog must close
		case C.DELETE_ADMINISTERED_USER:{
			return { ...state, deleteUser:false };
		}
		case C.DELETE_ADMINISTERED_GROUP:{
			return { ...state, deleteGroup:false };
		}
		case C.DELETE_ADMINISTERED_DATASET:{
			return { ...state, deleteDataset:false };
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