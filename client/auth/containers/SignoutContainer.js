import{ Component } from "react";
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Redirect } from 'react-router'

import { signout } from '../../actions/Auth'
import Signout from '../Signout'

const mapStateToProps = state => ({
	//todo - remove container and pass signout and signingOut through to Menu from PageTemplateContainer
	signingOut:state.asyncProcesses.signingOut
})
const mapDispatchToProps = dispatch => ({
	onSignout(history){
		dispatch(signout(history))
	}
})

const SignoutContainer = connect(
	mapStateToProps,
	mapDispatchToProps
	)(Signout)

export default withRouter(SignoutContainer)