import { connect } from 'react-redux'
import { fetchGroup } from '../../actions/GroupActions'
import Group  from '../Group'

const mapStateToProps = (state, ownProps) => {
	console.log('state', state)
	//id can be passed through, or else for params (may not be the signed in group)
	const groupId = ownProps.groupId  || ownProps.match.params.groupId
	return{
		extraLoadArg:groupId,
		group:state.user.loadedGroups.find(g => g._id === groupId),
		loading:state.asyncProcesses.loading.group,
		loadingError:state.asyncProcesses.error.loading.group
	}
}
const mapDispatchToProps = dispatch => ({
	//2nd load arg is groupid here
	onLoad(propsToLoad, groupId){
		alert('loading group')
		dispatch(fetchGroup(groupId))
	}
})

//wrap all 4 sections in the same container for now.
const GroupContainer = connect(
	mapStateToProps,
	mapDispatchToProps
	)(Group)

export default GroupContainer

