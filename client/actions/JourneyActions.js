import C from '../Constants'
import { status, parseResponse, logError, 
	fetchStart, fetchEnd, fetchThenDispatch} from './CommonActions'
import auth from '../auth/auth-helper'

const transformJourneyForServer = journey => {
	//console.log("tJFS", journey)
	//dont think we need to store anything on channels, or could just be the setting "monthly"
	//if we want to persist the users last zoom level. Or maybe just preserve the zoom level then?
	//for now, we dont anyway
	//completion paths are off for now, so again we dont persist 
	const aims = journey.aims.map(a => ({
		id:a.id,
		name:a.name,
		startDate:a.startDate,
		endDate:a.endDate,
		startYPC:a.startYPC,
		endYPC:a.endYPC,
		colour:a.colour,
		updated:Date.now
	}));
	const goals = journey.goals.map(g => ({
		id:g.id,
		aimId:g.aimId,
		name:g.name,
		targetDate:g.targetDate,
		yPC:g.yPC,
		measures:g.measures
	}));
	const links = journey.links.map(l => ({
		src:l.src,
		targ:l.targ
	}));

	//may be best to add measure info to measure instead of storing on goals
	const measures = journey.measures/*.map(m => {
		const targs = {};
		goals.forEach(g => {
			const goalMeasureInfo = g.measures.find(meas => meas.id === m.id);
			if(goalMeasureInfo){
				targs[g.id] = goalMeasureInfo.targ;
			}
		})
		return {
			...m,
			//targs
		}
	});
	*/

	return { 
		_id: journey._id, 
		name: journey.name || "",
		desc: journey.desc || "",
		aims,
		goals,
		links,
		measures,
		updated:Date.now
	}
}

const transformJourneyForClient = journey => {
	//add channels
	return journey;

}

//higher-order action
export const saveJourneyToStore = journey => (
	{
		type: C.SAVE_JOURNEY,
		journey
	}
)

export const saveJourney = journey => dispatch => {
	console.log("saveJourney", journey)
	//1. save to store
	dispatch(saveJourneyToStore(journey));
    //2. save to server
    //3. on response, undo if errors, add id (if new) or anything else from server to store
	/*
	const serverJourney = transformJourneyForServer(journey);
	console.log("serverJourney", serverJourney);
	const jwt = auth.isAuthenticated();
	if(!jwt.user) { return; }
	fetchThenDispatch(dispatch, 
		'saving.journey',
		{
			//journey has id if its already been saved
			url: '/api/users/'+jwt.user._id+'/journey' +(journey._id ? "/"+journey._id : ""),
			method: 'POST',
			body:JSON.stringify(journey),
			requireAuth:true,
			//this action will also set dialog.createUser = true
			nextAction: data => {
				console.log("saveJourney response", data)
				if(auth.isAuthenticated()){
					//in this case, we need the new user and the sign up mesg
					if(!journey._id){
						return { type:C.SAVE_NEW_JOURNEY_ID, mesg:data.mesg, userId:data.userId, _id:data.journey._id }
					}
					//@todo - do we need to process naything else?
				}
			}
		})
	*/
}

//to fetch a user in full
export const fetchJourney = (userId, journeyId) => dispatch => {
	fetchThenDispatch(dispatch, 
		'loading.journey',
		{
			url: '/api/users/'+userId +'/journey/'+journeyId, 
			requireAuth:true,
			nextAction: data => {
                //@TODO - allow users to share journeys, but these are stored elsewhere and read-only
				//const jwt = auth.isAuthenticated();
				if(auth.isAuthenticated()){
                    //if(jwt.user._id === data._id){
                        //return { type:C.SAVE_OTHER_USERS_JOURNEY, mesg:data.mesg, userId:data.userID, journey:data.journey }
                    //}
					return { type:C.SAVE_JOURNEY, mesg:data.mesg, userId:data.userID, journey:data.journey }
				}
			}
		}) 
}

export const fetchUsers = () => dispatch => {
	fetchThenDispatch(dispatch, 
		'loading.users',
		{
			url: '/api/users', 
			requireAuth:true,
			nextAction: data => { return { type:C.LOAD_USERS, users:data } }
		}) 
}

export const updateUser = (id, formData, history) => dispatch => {
	fetchThenDispatch(dispatch, 
		'updating.user',
		{
			url: '/api/users/'+id,
			method: 'PUT',
			headers:{
	        	'Accept': 'application/json'
	      	},
			body:formData, //not stringify as its a formidable object
			requireAuth:true,
			nextAction: data => {
				history.push("/")
				const jwt = auth.isAuthenticated();
				if(jwt.user._id === data._id){
					return { type:C.UPDATE_SIGNEDIN_USER, user:data };
				}
				return { type:C.UPDATE_ADMINISTERED_USER, user:data }
			}
		})
}
export const deleteUserAccount = (id, history) => dispatch => {
	fetchThenDispatch(dispatch, 
		'deleting.user',
		{
			url: '/api/users/'+id,
			method: 'DELETE',
			requireAuth:true,
			//todo - only signout if user being deleted was signed in
			nextAction: data => {
				history.push('/')
				const jwt = auth.isAuthenticated();
				if(jwt.user._id === data._id){
					return { type:C.SIGN_OUT };
				}
				return { type:C.DELETE_ADMINISTERED_USER, user:data }
			}
		})
}