export const findUser = (state, id) =>{
	//first search the signed in user and their administeredusers
	if(state.user){
		if(state.user._id === id){
			return state.user;
		}
		const administeredUser = state.user.administeredUsers.find(user => user._id === id)
		if(administeredUser){
			return administeredUser;
		}
	}
	//default return user from other.users, or undefined
	return state.other.users ? state.other.users.find(user => user._id === id) : undefined;
}

export const userProfile = user =>({ 
	 _id:user._id, username:user.username, firstname:user.firstname, 
	surname:user.surname, email:user.email, created:user.created 
})
