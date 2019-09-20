import React from 'react'
import { auth } from '../../firebase/firebase'

class Register extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			email: '',
			password: '',
			status: ''
		}

		this.handleChange = this.handleChange.bind(this)
		this.handleRegister = this.handleRegister.bind(this)
	}

	handleChange(e) {
		this.setState({ [e.target.id]: e.target.value })
	}

	handleRegister(e) {
		this.setState(() => ({
			status: ''
		}))

		auth.createUserWithEmailAndPassword(this.state.email, this.state.password).then(() => { //create user
			auth.currentUser.sendEmailVerification().then(() => { //send confirmation email
				this.setState({ status: `Verification email has been sent to ${this.state.email}`})

				//clean form and state
				this.setState(() => ({
					email: '',
				 	password: ''
				}))
			}).catch((err) => console.log(err))
		}).catch(err => {
			this.setState({ status: err.message })
			console.log('error code:', err.code)
		})
	}
	
	render() {
		return (
			<div id='RegisterInContainer' className='prompt'>
				{ this.state.status && <p id='status'>{this.state.status}</p> }
					<label htmlFor='email'>email</label>
					<input type='text' id='email' placeholder='email' onChange={this.handleChange} value={this.state.value} /><br />

					<label htmlFor='password'>password</label>
					<input type='password' id='password' placeholder='password' onChange={this.handleChange} value={this.state.value} /><br />

					<button className='buttonSecondary' onClick={this.props.close}>cancel</button>
					<button className='buttonProceed' onClick={this.handleRegister}>register</button>
			</div>
		)
	}
}

export default Register