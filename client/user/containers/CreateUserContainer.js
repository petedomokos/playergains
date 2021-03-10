import { connect } from 'react-redux'
import { createUser } from '../../actions/UserActions'
import { closeDialog } from '../../actions/CommonActions'
import CreateUser from '../CreateUser'

const mapStateToProps = (state, ownProps) => {
	return({
		creating:state.asyncProcesses.creating.group,
		error:state.asyncProcesses.error.creating.group,
		open:state.dialogs.createUser,
	})
}
const mapDispatchToProps = dispatch => ({
	submit(user){
		dispatch(createUser(user))
	},
	closeDialog(){
		dispatch(closeDialog('createUser'))
	}
})

//wrap all 4 sections in the same container for now.
const CreateUserContainer = connect(
	mapStateToProps,
	mapDispatchToProps
	)(CreateUser)

export default CreateUserContainer

