import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { fetchUser } from '../../actions/User'
import { signin } from '../../actions/Auth'

import HomeLoader from '../HomeLoader'


const mapStateToProps = (state, ownProps) => {
	console.log('HomeContainer state', state)
	return({
		user:state.user,
		groups:state.storedItems.groups,
		signingIn:state.asyncProcesses.signingIn,
		loadingUser:state.asyncProcesses.loading.user,
		history:ownProps.history
	})
}
const mapDispatchToProps = dispatch => ({
	onLoadUser(userId){
		dispatch(fetchUser(userId))
	},
	onSignin(user, history, redirectTo){
		dispatch(signin(user, history, redirectTo))
	}
})

//wrap all 4 sections in the same container for now.
const HomeContainer = connect(
	mapStateToProps,
	mapDispatchToProps
	)(HomeLoader)

export default HomeContainer

