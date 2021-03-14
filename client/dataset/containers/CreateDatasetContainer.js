import { connect } from 'react-redux'
import { fetchUser } from '../../actions/UserActions'
import { createDataset } from '../../actions/DatasetActions'
import { closeDialog } from '../../actions/CommonActions'
import CreateDataset from '../CreateDataset'
import auth from '../../auth/auth-helper'

const mapStateToProps = (state, ownProps) => {
	return({
		extraLoadArg:auth.isAuthenticated().user._id, //under a private route so user will be signed in
		user:state.user,
		//may need to load user first if page refreshed
		loading:state.asyncProcesses.loading.user,
		loadingError:state.asyncProcesses.error.loading.user,
		creating:state.asyncProcesses.creating.dataset,
		error:state.asyncProcesses.error.creating.dataset,
		open:state.dialogs.createDataset
	})
}
const mapDispatchToProps = dispatch => ({
	//extraLoadAreg here is userId
	onLoad(propsToLoad, userId){
		dispatch(fetchUser(userId))
	},
	submit(dataset){
		dispatch(createDataset(dataset))
	},
	closeDialog(){
		dispatch(closeDialog('createDataset'))
	}
})

//wrap all 4 sections in the same container for now.
const CreateDatasetContainer = connect(
	mapStateToProps,
	mapDispatchToProps
	)(CreateDataset)

export default CreateDatasetContainer
