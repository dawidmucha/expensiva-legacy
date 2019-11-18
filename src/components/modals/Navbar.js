import React from 'react'
import nav1 from '../../resources/nav1.svg'
import nav2 from '../../resources/nav2.svg'
import nav3 from '../../resources/nav3.svg'
import av from '../../resources/av.jpg'
import store from '../../store/configureStore'
import Settings from '../modals/Settings'
import Popup from 'reactjs-popup'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { startLogOutUser } from '../../actions/actions'
import { Redirect } from 'react-router-dom'

class Navbar extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			currently: undefined,
			ready: false
		}

		this.handleLogOut = this.handleLogOut.bind(this)
	}

	componentDidMount() {
		console.log('ready?', this.state.ready)
	}

	componentWillUnmount() {
		this.setState({ ready: false })
		console.log('ready?', this.state.ready)
		console.log('why?', this.state.ready, window.location.href)
	}

	handleLogOut() {
		console.log('logging out ready?', this.state.ready)
		this.setState({ ready: true })
		console.log('ah', this.props.startLogOutUser)
		this.props.startLogOutUser()
	}

	render() {
		if(!store.getState().uID) return(<Redirect to='/' />)
		return (
			<div id='navbar'>
				<Link to='/spendings'><div id='navbar-spendings' style={{display: 'inline-block'}}><img src={nav1} alt='spendings_icon' width='50px' /></div></Link>
				<Link to='/transactions'><div id='navbar-transactions' style={{display: 'inline-block'}}><img src={nav2} alt='transactions_icon' width='50px' /></div></Link>
				<Link to='/categories'><div id='navbar-categories' style={{display: 'inline-block'}}><img src={nav3} alt='categories_icon' width='50px' /></div></Link>
				
				<Popup modal trigger={<img src={av} alt='avatar' width='50px' />}>
					{close => (
							<Settings close={close} />
					)}
				</Popup>
				
				<div id='navbar-profile' style={{display: 'inline-block'}}></div>
				<button onClick={this.handleLogOut}>LOGOUT</button>

				{ (this.state.ready) ? <Redirect to='/' /> : null}
			</div>
		)
	}
}

const mapDispatchToProps = (dispatch) => ({
	startLogOutUser: () => {
		console.log('map dispatch')
		dispatch(startLogOutUser)
	}
}) 

export default connect(undefined, mapDispatchToProps)(Navbar)