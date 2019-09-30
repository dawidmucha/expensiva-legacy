import React from 'react'
import Popup from 'reactjs-popup'
import database from '../../firebase/firebase'
import uuidv4 from 'uuid/v4'

class AddReceipt extends React.Component {
	constructor(props) {
		super(props)

		this.handleShopChange = this.handleShopChange.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.handleAddReceipt = this.handleAddReceipt.bind(this)

		this.state = {
			shop: 'zabka',
			date: undefined,
			time: undefined,
			id: undefined
		}
	}
	
	componentDidMount() {
		this.setState({ id: uuidv4() })
	}

	handleShopChange(e) {
		this.setState({ shop: e.target.value })
	}

	handleChange(e) {
		this.setState({ [e.target.id]: e.target.value })
	}

	handleAddReceipt() {
		database.ref(`${localStorage.getItem('uID')}/transactions/${this.state.id}`).set({
			shop: this.state.shop,
			date: this.state.date,
			time: this.state.time,
			items: {}
		})
	}

	render() {
		return (
			<Popup trigger={<button>+</button>} modal closeOnDocumentClick>
				{close => (
					<div>
						<label htmlFor='shop'>shop</label>
						<select onChange={this.handleShopChange}>
							<option id='zabka' value='zabka'>zabka</option>
							<option id='lidl' value='lidl'>lidl</option>
							<option id='biedro' value='biedro'>biedro</option>
						</select><br />

						<label htmlFor='date'>date</label>
						<input type='date' id='date' onChange={this.handleChange} value={this.state.value} /><br />

						<label htmlFor='time'>time</label>
						<input type='time' id='time' onChange={this.handleChange} value={this.state.value} /><br />
						
						<button onClick={close}>cancel</button>
						<button onClick={this.handleAddReceipt}>add</button>
					</div>
				)}
			</Popup>
		)
	}
}

export default AddReceipt