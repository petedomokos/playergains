import { connect } from 'react-redux'
import { fetchUsers } from '../../actions/UserActions'
import Users  from '../Users'

const mapStateToProps = (state, ownProps) => {
	//console.log('state', state)
	return{
		user:state.user,
        users:state.other.users,
		loading:state.asyncProcesses.loading.users,
		loadingError:state.asyncProcesses.error.loading.users
	}
}
const mapDispatchToProps = dispatch => ({
	onLoad(){
		alert('loading users')
		dispatch(fetchUsers())
	}
})

//wrap all 4 sections in the same container for now.
const UsersContainer = connect(
	mapStateToProps,
	mapDispatchToProps
	)(Users)

export default UsersContainer

