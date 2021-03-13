import { connect } from 'react-redux'
import { fetchUsers } from '../../actions/UserActions'
import Users  from '../Users'

const mapStateToProps = (state, ownProps) => {
	console.log('state', state)
	//todo - implement it using filter in here, so we just passed through the comparator
	//note: optional filterFunc = (users) => filteredUsers
	const { loadedUsers, /*administeredUsers,*/ loadsComplete } = state.user;
	const { include, exclude } = ownProps;
	return{
		users:include ? loadedUsers.filter(us => include.includes(us._id)) : 
			exclude ? loadedUsers.filter(us => !exclude.includes(us._id)) : 
			loadedUsers,
		/*administeredUsers:administeredUsers,*/
        userLoadsComplete:loadsComplete.users, //for now, we just load all users at this stage
		loading:state.asyncProcesses.loading.users,
		loadingError:state.asyncProcesses.error.loading.users
	}
}
const mapDispatchToProps = dispatch => ({
	onLoad(){
		//alert('loading users')
		dispatch(fetchUsers())
	}
})

//wrap all 4 sections in the same container for now.
const UsersContainer = connect(
	mapStateToProps,
	mapDispatchToProps
	)(Users)

export default UsersContainer

