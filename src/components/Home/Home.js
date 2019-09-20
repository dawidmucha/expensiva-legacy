import React from 'react'
import Popup from 'reactjs-popup'
import LogIn from '../modals/LogIn'
import Register from '../modals/Register'

class Home extends React.Component {
	render() {
		return (
			<div id='HomeContainer'>
				<h1>EXPENSIVA</h1>
				<button to ='/transactions/'>log in with google</button>
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
			</div>
		)
	}
}

export default Home