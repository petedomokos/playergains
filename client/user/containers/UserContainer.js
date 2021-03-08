import { connect } from 'react-redux'
import { fetchUser } from '../../actions/UserActions'
import User  from '../User'
import { findUser } from '../../util/ReduxHelpers';

const mapStateToProps = (state, ownProps) => {
	console.log('state', state)
	//id can be passed through, or else for params (may not be the signed in user)
	const userId = ownProps.userId  || ownProps.match.params.userId
	return{
		//pass id too for onLoad cb in case user is not loaded
		userId:userId,
		user:findUser(state, userId),
		loading:state.asyncProcesses.loading.user,
		error:state.asyncProcesses.error.loading.user
	}
}
const mapDispatchToProps = dispatch => ({
	onLoad(userId){
		dispatch(fetchUser(userId))
	}
})

//wrap all 4 sections in the same container for now.
const UserContainer = connect(
	mapStateToProps,
	mapDispatchToProps
	)(User)

export default UserContainer

