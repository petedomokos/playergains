export const InitialState = {
	user:null,
	asyncProcesses:{
		signingIn:false,
		signingOut:false,
		loading:{
			user:false,
			users:false,
			group:false,
			groups:false
		},
		updating:{
		},
		deleting:{
		},
		creating:{
		}
	},
	dialogs:{
	}
}