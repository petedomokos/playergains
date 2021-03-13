export const InitialState = {
	//note - users could be in multiple arrays, including other (simplest not to filter)
	//so all of them will need to receive the update actions, not just adminUsers/adminGroups
	//but when creating a new user or group, they dont need to go into other.
	user:{
		administeredUsers:[],
		administeredGroups:[],
		groupsMemberOf:[],
		loadedUsers:[],
		loadedGroups:[],
		loadsComplete:{
			users:false,
			groups:false
		}
	},
	asyncProcesses:{
		error:{
			loading:{},
			updating:{},
			deleting:{},
			creating:{}
		},
		loading:{
			user:false,
			users:false,
			group:false,
			groups:false
		},
		updating:{
			user:false,
			group:false,
		},
		deleting:{
			user:false,
			group:false,
		},
		creating:{
			user:false,
			group:false,
		}
	},
	dialogs:{
		createUser:false,
		deleteUser:false,
		createGroup:false,
		deleteGroup:false,
	}
}