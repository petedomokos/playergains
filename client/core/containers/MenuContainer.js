import { connect } from 'react-redux'
import { signout } from '../../actions/AuthActions'
import Menu from '../Menu'

const mapStateToProps = state => ({
	//pass signout and signingOut through to Menu from PageTemplateContainer
	signingOut:state.asyncProcesses.signingOut
})
const mapDispatchToProps = dispatch => ({
	onSignout(history){
		dispatch(signout(history))
	}
})

const MenuContainer = connect(
	mapStateToProps,
	mapDispatchToProps
	)(Menu)

export default MenuContainer