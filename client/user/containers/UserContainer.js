import { connect } from 'react-redux'
import { fetchUser } from '../../actions/UserActions'
import User  from '../User'

const mapStateToProps = (state, ownProps) => {
	//console.log('state', state)
	//id can be passed through, or else for params (may not be the signed in user)
	const userId = ownProps.userId  || ownProps.match.params.userId
	return{
		extraLoadArg:userId,
		user:state.user._id === userId ? state.user : 
			state.user.loadedUsers.find(us => us._id === userId),
		loading:state.asyncProcesses.loading.user,
		loadingError:state.asyncProcesses.error.loading.user
	}
}
const mapDispatchToProps = dispatch => ({
	//2nd load arg is userid here
	onLoad(propsToLoad, userId){
		//alert('loading user')
		console.log('calling fetchUser dispatch from UserCont...................')
		dispatch(fetchUser(userId))
	}
})

//wrap all 4 sections in the same container for now.
const UserContainer = connect(
	mapStateToProps,
	mapDispatchToProps
	)(User)

export default UserContainer

