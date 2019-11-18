import React from 'react'
import Popup from 'reactjs-popup'
import LogIn from '../modals/LogIn'
import Register from '../modals/Register'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { startLogInUser, logOutUser } from '../../actions/actions'
import { auth } from '../../firebase/firebase'

auth.onAuthStateChanged(function(user) {
	if (user) {
		console.log('current user is...', user)
		// User is signed in.
	} else {
		console.log('omg jprdl no user')
		// No user is signed in.
	}
})

class Home extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			isLoggedIn: false,
			user: undefined
		}
	}

	componentDidUpdate() {
		console.log('boo-yah', this.state.user, this.props.user)
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
				
				{ this.props.user && !window.location.href.includes('/transactions') ? <Redirect to='/transactions' /> : null }
			</div>
		)
	}
}

const mapDispatchToProps = dispatch => ({
	startLogInUser: () => dispatch(startLogInUser()),
	logOutUser: () => dispatch(logOutUser())
})

const mapStateToProps = state => {
	console.log('booyah', state)
	return {
		user: state.uID
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)