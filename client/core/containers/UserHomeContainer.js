import { connect } from 'react-redux'
import { fetchUser, fetchUsers } from '../../actions/UserActions'
import { fetchGroups } from '../../actions/GroupActions'
import UserHome  from '../UserHome'
import { findUser } from '../../util/ReduxHelpers';

const mapStateToProps = (state, ownProps) => {
	console.log('state', state)
	const userId = ownProps.userId;
	const { loading, error } = state.asyncProcesses;
	return{
		extraLoadArg:userId,
		user:findUser(state, userId),
		//loading:state.asyncProcesses.loading.user,
		loading:loading.user,
		loadingError:error.loading.user
	}
}
const mapDispatchToProps = dispatch => ({
	//loadid is userid here
	onLoad(propsToLoad, userId){
		dispatch(fetchUser(userId))
	}
})

//wrap all 4 sections in the same container for now.
const UserHomeContainer = connect(
	mapStateToProps,
	mapDispatchToProps
	)(UserHome)

export default UserHomeContainer

