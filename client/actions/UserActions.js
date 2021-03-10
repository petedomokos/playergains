import C from '../Constants'
import { status, parseResponse, logError, 
	fetchStart, fetchEnd, fetchThenDispatch} from './CommonActions'
import auth from '../auth/auth-helper'
import { signout } from './AuthActions.js';


export const createUser = user => dispatch => {
	console.log("actions.createUser()", user)
	fetchThenDispatch(dispatch, 
		'creating.user',
		{
			url: '/api/users/',
			method: 'POST',
			body:JSON.stringify(user),
			requireAuth:true,
			//this action will also set dialog.createUser = true
			nextAction: data => {
				console.log('next act save new user')
				return {type:C.SAVE_NEW_USER, user:data }
			}
		})
}

//to fetch a user in full
export const fetchUser = id => dispatch => {
	console.log('fetching user...', id)
	fetchThenDispatch(dispatch, 
		'loading.user',
		{
			url: '/api/users/'+id, 
			requireAuth:true,
			nextAction: data => {
				const jwt = auth.isAuthenticated();
				//may be reloading the signed in user
				if(jwt.user._id === data._id){
					return { type:C.SIGN_IN, user:data };
				}
				return { type:C.SAVE_OTHER_USER, user:data };
			}
		}) 
}


export const fetchUsers = () => dispatch => {
	console.log('url is /api/users')
	fetchThenDispatch(dispatch, 
		'loading.users',
		{
			url: '/api/users', 
			requireAuth:true,
			nextAction: data => { return { type:C.SAVE_OTHER_USERS, users:data } }
		}) 
}

export const updateUser = (id, formData, history) => dispatch => {
	console.log('formdata', formData)
	fetchThenDispatch(dispatch, 
		'updating.user',
		{
			url: '/api/users/'+id,
			method: 'PUT',
			headers:{
	        	'Accept': 'application/json'
	      	},
			body:formData, //not stringify as its a formidable object
			requireAuth:true,
			nextAction: data => {
				history.push("/")
				const signedInUserWasUpdated = auth.isAuthenticated().user._id === data._id;
				if(signedInUserWasUpdated){
					return {
						type:C.UPDATE_SIGNED_IN_USER, user:data
					}
				}else{
					return {
						type:C.UPDATE_ADMINISTERED_USER, user:data
					}
				}
			}
		})
}
export const deleteUserAccount = (id, history) => dispatch => {
	console.log('deleting...')
	fetchThenDispatch(dispatch, 
		'deleting.user',
		{
			url: '/api/users/'+id,
			method: 'DELETE',
			requireAuth:true,
			//todo - only signout if user being deleted was signed in
			nextAction: data => {
				const signedInUserWasDeleted = auth.isAuthenticated().user._id === data._id;
				if(signedInUserWasDeleted){
					return signout(history)
				}else{
					history.push('/')
					return {
						type:C.DELETE_USER, userId:data._id
					}

				}
			}
		})
}