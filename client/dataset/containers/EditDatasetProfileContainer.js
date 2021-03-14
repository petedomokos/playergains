import { connect } from 'react-redux'
import { fetchDataset, updateDataset } from '../../actions/DatasetActions'
import EditDatasetProfile from '../EditDatasetProfile'
import { findShallowDataset } from '../../util/ReduxHelpers'

const mapStateToProps = (state, ownProps) => {
	//id can be passed through, or else for params (may not be the signed in dataset)
	const datasetId = ownProps.datasetId  || ownProps.match.params.datasetId
	return{
		extraLoadArg:datasetId,
		signedInUserId: auth.isAuthenticated().user._id,
		dataset:state.user.loadedDatasets.find(g => g._id === datasetId),
		loading:state.asyncProcesses.loading.dataset,
		loadingError:state.asyncProcesses.error.loading.dataset,
		updating:state.asyncProcesses.updating.dataset,
		updatingError:state.asyncProcesses.error.updating.dataset,
		history:ownProps.history
	}
}
const mapDispatchToProps = dispatch => ({
	//extra load arg is datasetId here
	onLoad(propsToLoad, datasetId){
		alert('loading dataset')
		dispatch(fetchDataset(datasetId))
	},
	onUpdate(datasetId, formData, history){
		dispatch(updateDataset(datasetId, formData, history))
	}
})

//wrap all 4 sections in the same container for now.
const EditDatasetProfileContainer = connect(
	mapStateToProps,
	mapDispatchToProps
	)(EditDatasetProfile)

export default EditDatasetProfileContainer

