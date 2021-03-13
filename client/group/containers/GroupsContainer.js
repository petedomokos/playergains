import { connect } from 'react-redux'
import { fetchGroups } from '../../actions/GroupActions'
import Groups  from '../Groups'
import { findDeepGroup } from '../../util/ReduxHelpers';

const mapStateToProps = (state, ownProps) => { 
	const { loadedGroups, loadsComplete, groupsMemberOf, administeredGroups } = state.user;
	const { include, exclude } = ownProps;
	return{
		groups:include ? loadedGroups.filter(g => include.includes(g._id)) : 
		exclude ? loadedGroups.filter(g => !exclude.includes(g._id)) : 
		loadedGroups,
		/*administeredGroups:administeredGroups,
		groupsMemberOf:groupsMemberOf,*/
		groupLoadsComplete:loadsComplete.groups,
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

