import { connect } from 'react-redux'
import { fetchGroups } from '../../actions/GroupActions'
import Groups  from '../Groups'

const mapStateToProps = (state, ownProps) => {
	console.log('state', state)
	return{
		user:state.user,
        groups:state.other.groups,
		loading:state.asyncProcesses.loading.groups,
		loadingError:state.asyncProcesses.error.loading.groups
	}
}
const mapDispatchToProps = dispatch => ({
	onLoad(){
		//alert('loading groups')
		dispatch(fetchGroups())
	}
})

//wrap all 4 sections in the same container for now.
const GroupsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
	)(Groups)

export default GroupsContainer

