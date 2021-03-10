import { connect } from 'react-redux'
import { createGroup } from '../../actions/GroupActions'
import CreateGroup from '../CreateGroup'

const mapStateToProps = (state, ownProps) => {
	return({
		user:state.user,
		groups:state.storedItems.groups,
		//parent undefined unless user has selected to create subgroup from a group
		parent:ownProps.parent || '',
		creating:state.asyncProcesses.creating.group,
		open:false,
		error:''
	})
}
const mapDispatchToProps = dispatch => ({
	submit(group){
		dispatch(createGroup(group))
	}
})

//wrap all 4 sections in the same container for now.
const CreateGroupContainer = connect(
	mapStateToProps,
	mapDispatchToProps
	)(CreateGroup)

export default CreateGroupContainer

