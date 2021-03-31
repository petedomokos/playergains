import { connect } from 'react-redux'
import { fetchUser } from '../../../actions/UserActions'
//import { createDatapoint } from '../../../actions/DatapointActions'
import { closeDialog } from '../../../actions/CommonActions'
import CreateDatapoint from '../CreateDatapoint'
import auth from '../../../auth/auth-helper'

const mapStateToProps = (state, ownProps) => {
	console.log("create datapoint cont------------------")
	
	return({
		extraLoadArg:auth.isAuthenticated().user._id, //under a private route so user will be signed in
		userId:auth.isAuthenticated().user._id,
		datasets:state.user.loadedDatasets,
		//may need to load user first if page refreshed
		loading:state.asyncProcesses.loading.user,
		loadingError:state.asyncProcesses.error.loading.user,
		creating:state.asyncProcesses.creating.datapoint,
		error:state.asyncProcesses.error.creating.datapoint,
		open:state.dialogs.createDatapoint
	})
}
const mapDispatchToProps = dispatch => ({
	//extraLoadAreg here is userId
	onLoad(propsToLoad, userId){
		if(propsToLoad.includes('datasets')){
			dispatch(fetchUser(userId))
		}
	},
	submit(datapoint){
		//dispatch(createDatapoint(datapoint))
	},
	closeDialog(){
		dispatch(closeDialog('createDatapoint'))
	}
})

//wrap all 4 sections in the same container for now.
const CreateDatapointContainer = connect(
	mapStateToProps,
	mapDispatchToProps
	)(CreateDatapoint)

export default CreateDatapointContainer
