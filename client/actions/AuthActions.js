import C from '../Constants'
import { status, parseResponse, logError, fetchStart, fetchEnd, fetchThenDispatch} from './CommonActions'
import auth from '../auth/auth-helper'

export const signin = (user, history, redirectTo) => dispatch =>{
	fetchThenDispatch(dispatch, 
		'signingIn',
		{
			url: '/auth/signin/',
			method:'POST',
			body: JSON.stringify(user),
			nextAction: data => {
				//save to session storage
				console.log("actions signin data", data)
				const userCredentials = {email:data.user.email, _id:data.user._id, isSystemAdmin:data.user.isSystemAdmin}
				const jwt = {...data, user:userCredentials}
				auth.authenticate(jwt, () => {
					console.log('history', history)
				  	history.push(redirectTo || "/")
		        })
		        //save to store
		        return {
					type:C.SIGN_IN, user:data.user
				}
			}
		})
}

export const signout = history => dispatch =>{
	fetchThenDispatch(dispatch, 
		'signingOut',
		{
			url: '/auth/signout/',
			headers:{},
			nextAction: data => {
				//clear sessionStorage and cookies
				if (typeof window !== "undefined")
      				sessionStorage.removeItem('jwt')
      			document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      			//return to home
				history.push("/")
				//clear user in store
				return {type:C.SIGN_OUT}
			}
		})
}