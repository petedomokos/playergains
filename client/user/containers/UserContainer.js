import { connect } from 'react-redux'
import { fetchUser } from '../../actions/UserActions'
import { user } from '../../Reducers'
import User  from '../User'
import { findIn } from '../../util/ArrayHelpers'

const mapStateToProps = (state, ownProps) => {
	//console.log('state', state)
	//id can be passed through, or else for params (may not be the signed in user)
	const userId = ownProps.userId  || ownProps.match.params.userId;
	const _user = state.user._id === userId ? state.user : 
		state.user.loadedUsers.find(us => us._id === userId);
	//User may or may not exist in store, and may be deep or shallow.
	//User component expects a deep user, ie it must have user.admin, user.groupsMemberOf, etc
	//it only gets those via fetchUser which reads the user in more fully from database
	//The HOC withRouter will check fro existence of the deep properties, 
	//and trigger fetchUser if necc, We cannot assume at this point that they exist
	//IF DEEP USER IS LOADED, WE DO NEED TO LOAD IN THOSE GROUPS FROM LOADEDGROUPS 
	//-> THE DEEP USER ONLY HAS IDS
	const allUsers = [state.user, ...state.user.loadedUsers];
	const { loadedGroups, loadedDatasets } = state.user;

	if(_user && _user.groupsMemberOf){
		//user is deep version so need to replace id-refs with objects
		_user.admin = _user.admin.map(id => findIn(allUsers, id));
		_user.administeredUsers = _user.administeredUsers.map(id => findIn(allUsers, id));
		_user.administeredGroups = _user.administeredGroups.map(id => findIn(loadedGroups, id));
		_user.administeredDatasets = _user.administeredDatasets.map(id => findIn(loadedDatasets, id));
		_user.groupsMemberOf = _user.groupsMemberOf.map(id => findIn(loadedGroups, id));
		_user.datasetsMemberOf = _user.datasetsMemberOf.map(id => findIn(loadedDatasets, id));
	}

	return{
		extraLoadArg:userId,
		user:_user,
		loading:state.asyncProcesses.loading.user,
		loadingError:state.asyncProcesses.error.loading.user
	}
}
const mapDispatchToProps = dispatch => ({
	//2nd load arg is userid here
	onLoad(propsToLoad, userId){
		//alert('loading user')
		dispatch(fetchUser(userId))
	}
})

//wrap all 4 sections in the same container for now.
const UserContainer = connect(
	mapStateToProps,
	mapDispatchToProps
	)(User)

export default UserContainer

