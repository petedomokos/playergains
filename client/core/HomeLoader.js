import React, { useEffect, useState }  from 'react'

import Home from './Home'
//helpers
import auth from '../auth/auth-helper'
/**
*
**/
//TODO - THINK ABOUT WHER ETO PUT THIS - WE ALSO NEED THIS FOR ALL OTHER ENTRY POINTS,
//EG IF USER IS LOGGED IN, REFRESHES THE PAGE BUT NO THE HOME PAGE
const HomeLoader = ({user, groups, onLoadUser, onSignin, signingIn, loadingUser, history}) => {
	useEffect(() => {
		//load user if logged in but no user in store
		if(!user._id && auth.isAuthenticated() && !loadingUser &&!signingIn){
			console.log("HomeLoader calling LoadUser user: ", user)
			onLoadUser(auth.isAuthenticated().user._id)
		}
	}, [])
	return (
		<Home user={user} groups={groups} onSignin={onSignin} history={history}/>
		)
}
export default HomeLoader