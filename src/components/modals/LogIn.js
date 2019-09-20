import React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { auth } from '../../firebase/firebase'
import { logInUser } from '../../actions/actions'

class LogIn extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			email: '',
			password: '',
			status: '',
			isLoggedIn: false
		}

		this.handleLogIn = this.handleLogIn.bind(this)
		this.handleChange = this.handleChange.bind(this)
	}

	handleChange(e) {
		this.setState({ [e.target.id]: e.target.value })
	}

	handleLogIn() {
		auth.signInWithEmailAndPassword(this.state.email, this.state.password).then(() => {
			const user = auth.currentUser
			this.props.dispatch(logInUser(user.uid))
			localStorage.setItem('uID', user.uid)
			this.setState({ isLoggedIn: true })
			console.log('logged in')
		}).catch(err => {
			console.log(this.state.status)
			console.log(err.message)
			console.log("error code", err.code)
		})
	}

	render() {
		return (
			<div id='LogInContainer' className='prompt'>
				<label htmlFor='login'>email</label>
				<input type='text' id='email' placeholder='email' onChange={this.handleChange} /><br />

				<label htmlFor='password'>password</label>
				<input type='password' id='password' placeholder='password' onChange={this.handleChange} /><br />

				<button className='buttonSecondary' onClick={this.props.close}>cancel</button>
				<button className='buttonProceed' onClick={this.handleLogIn}>log in</button>

				{ this.state.isLoggedIn ? <Redirect to='/transactions' /> : null }
			</div>
		)
	}
}

export default connect()(LogIn)