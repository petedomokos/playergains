import { connect } from 'react-redux'
import { fetchUser, updateUser } from '../../actions/UserActions'
import EditUserProfile from '../EditUserProfile'
import { findUser } from '../../util/ReduxHelpers'

const mapStateToProps = (state, ownProps) => {
	console.log('ownprops', ownProps)
	//id can be passed through, or else for params (may not be the signed in user)
	const userId = ownProps.userId  || ownProps.match.params.userId
	return{
		extraLoadArg:userId,
		user:findUser(state, userId),
		loading:state.asyncProcesses.loading.user,
		loadingError:state.asyncProcesses.error.loading.user,
		updating:state.asyncProcesses.updating.user,
		updatingError:state.asyncProcesses.error.updating.user,
		history:ownProps.history
	}
}
const mapDispatchToProps = dispatch => ({
	//extra load arg is userId here
	onLoad(propsToLoad, userId){
		alert('loading user')
		dispatch(fetchUser(userId))
	},
	onUpdate(userId, formData, history){
		dispatch(updateUser(userId, formData, history))
	}
})

//wrap all 4 sections in the same container for now.
const EditUserProfileContainer = connect(
	mapStateToProps,
	mapDispatchToProps
	)(EditUserProfile)

export default EditUserProfileContainer

