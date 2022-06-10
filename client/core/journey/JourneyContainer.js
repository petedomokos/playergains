import { connect } from 'react-redux'
import Journey  from './Journey'
import { saveJourney } from '../../actions/JourneyActions'
import { closeDialog } from '../../actions/CommonActions'

const mapStateToProps = (state, ownProps) => {
	//console.log('JourneyContainer', state)
    //const { journeyId }  = ownProps.match.params;
	return{
		screen:state.system.screen,
        width:state.system.screen.width,
        height:state.system.screen.height - 90,
        //temp put the ? until backend is implemented - will eventually do same as users - we just send a summary at first
		//journey:state.user.journeys?.find(j => j.id === journeyId),
		loading:state.asyncProcesses.loading.journey,
		loadingError:state.asyncProcesses.error.loading.journey,
        //dialogOpen:...???
	}
}
const mapDispatchToProps = dispatch => ({
    save(journey){
		//dispatch(saveJourney(journey))
	},
	closeDialog(path){
		//console.log('closing dialog', path)
		dispatch(closeDialog(path))
	}
})

//wrap all 4 sections in the same container for now.
const JourneyContainer = connect(
	mapStateToProps,
	mapDispatchToProps
	)(Journey)

export default JourneyContainer

