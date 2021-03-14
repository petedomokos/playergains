import { connect } from 'react-redux'
import { fetchDataset, updateDataset } from '../../actions/DatasetActions'
import Dataset  from '../Dataset'
import { findIn } from '../../util/ArrayHelpers'

const mapStateToProps = (state, ownProps) => {
	console.log('state', state)
	//id can be passed through, or else for params (may not be the signed in dataset)
	const datasetId = ownProps.datasetId  || ownProps.match.params.datasetId
	console.log('datasetId', datasetId)
	const _dataset = state.user.loadedDatasets.find(g => g._id === datasetId)
	//Dataset may or may not exist in store, and may be deep or shallow.
	//Dataset component expects a deep dataset, ie it must have dataset.admin, dataset.players, etc
	//it only gets those via fetchDataset which reads the dataset in more fully from database
	//The HOC withRouter will check for existence of the deep properties, 
	//and trigger fetchDataset if necc, We cannot assume at this point that they exist
	//IF DEEP GROUP IS LOADED, WE DO NEED TO LOAD IN THOSE DEEP PROPERTIES FROM LOADEDGROUPS 
	//-> THE DEEP USER ONLY HAS IDS
	const allUsers = [state.user, ...state.user.loadedUsers];

	if(_dataset && _dataset.players){
		//user is deep version so need to replace id-refs with objects
		_dataset.admin = _dataset.admin.map(id => findIn(allUsers, id));
		_dataset.players = _dataset.players.map(id => findIn(allUsers, id));
	}
	return{
		extraLoadArg:datasetId,
		dataset:_dataset,
		loading:state.asyncProcesses.loading.dataset,
		loadingError:state.asyncProcesses.error.loading.dataset,
		playersUpdating:state.asyncProcesses.updating.dataset,
		playerUpdateError:state.asyncProcesses.error.updating.dataset,
		playersUpdated:state.asyncProcesses.success.updating.dataset,
	}
}
const mapDispatchToProps = dispatch => ({
	//2nd load arg is datasetid here
	onLoad(propsToLoad, datasetId){
		//alert('loading dataset')
		dispatch(fetchDataset(datasetId))
	},
	updatePlayers(datasetId, formData){
		dispatch(updateDataset(datasetId, formData))
	}
})

//wrap all 4 sections in the same container for now.
const DatasetContainer = connect(
	mapStateToProps,
	mapDispatchToProps
	)(Dataset)

export default DatasetContainer

