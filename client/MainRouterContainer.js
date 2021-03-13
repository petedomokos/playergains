import { connect } from 'react-redux'
import { fetchUser } from './actions/UserActions'
import MainRouter  from './MainRouter'
import auth from './auth/auth-helper'

const mapStateToProps = (state, ownProps) => {
	return{
        jwt:auth.isAuthenticated(),
		user:state.user,
		loadingUser:state.asyncProcesses.loading.user,
		loadingError:state.asyncProcesses.error.loading.user
	}
}
const mapDispatchToProps = dispatch => ({
	loadUser(userId){
		console.log('calling fetchUser signin in again..............')
		dispatch(fetchUser(userId))
	}
})

//wrap all 4 sections in the same container for now.
const MainRouterContainer = connect(
	mapStateToProps,
	mapDispatchToProps
	)(MainRouter)

export default MainRouterContainer

