import React from 'react'
import Popup from 'reactjs-popup'
import LogIn from '../modals/LogIn'
import Register from '../modals/Register'

import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { startLogInUser } from '../../actions/actions'

class Home extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			isLoggedIn: false,
			user: undefined
		}
		
		this.handleLogIn = this.handleLogIn.bind(this)
	}
	
	handleLogIn() {
		
	}

	render() {
		return (
			<div id='HomeContainer'>
				<h1>EXPENSIVA</h1>
				<button onClick={this.props.startLogInUser}>log in with google</button>

				<Popup trigger={<button>register</button>} modal closeOnDocumentClick>
					{close => (
						<Register close={close} />
					)}
				</Popup>
				
				<Popup trigger={<button>log in</button>} modal closeOnDocumentClick>
					{close => (
						<LogIn close={close} />
					)}
				</Popup>
				
				{ this.state.isLoggedIn ? <Redirect to='/transactions' /> : null }
			</div>
		)
	}
}

const mapDispatchToProps = dispatch => ({
	startLogInUser: () => dispatch(startLogInUser())
})

export default connect(undefined, mapDispatchToProps)(Home)