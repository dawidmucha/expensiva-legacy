import React from 'react'
import Popup from 'reactjs-popup'
import Select from 'react-select'
import database from '../../firebase/firebase'
import uuidv4 from 'uuid/v4'
import store from '../../store/configureStore'

class AddReceipt extends React.Component {
	_isMounted = false

	constructor(props) {
		super(props)

		this.handleShopChange = this.handleShopChange.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.handleAddReceipt = this.handleAddReceipt.bind(this)

		this.state = {
			shop: undefined,
			date: undefined,
			time: undefined,
			id: undefined,
			shops: [],
			errorMessage: ''
		}
	}

	componentDidMount() {
		this._isMounted = true

		database.ref(`${store.getState().uID || localStorage.getItem('uID')}/shops`).on('value', (snapshot) => {
			this.setState(state => {
				snapshot.val().map(item => {
					return state.shops = state.shops.concat({ value: item, label: item })
				})
			})
		})
	}

	componentWillUnmount() {
		this._isMounted = false
	}

	handleShopChange(e) {
		if(this._isMounted) this.setState({ shop: e.value })
	}

	handleChange(e) {
		if(this._isMounted) this.setState({ [e.target.id]: e.target.value })
	}

	async handleAddReceipt(close) {
		if(this._isMounted) {
			await this.setState({ id: uuidv4() })
			if(this.state.shop && this.state.date && this.state.time) {
				database.ref(`${localStorage.getItem('uID')}/transactions/${this.state.id}`).set({
					shop: this.state.shop,
					date: this.state.date,
					time: this.state.time,
					items: {}
				})
				this.setState(() => ({ 
					errorMessage: '',
					shop: undefined
				}))
				close()
			} else {
				this.setState({ errorMessage: 'please fill in all required fields!'})
			}
		}
	}

	render() {
		return (
			<Popup trigger={<button>+</button>} modal closeOnDocumentClick>
				{close => (
					<div>
						<p>{this.state.errorMessage}</p>
					
						<label htmlFor='shop'>shop</label>
						<Select onChange={this.handleShopChange} options={this.state.shops} /><br />

						<label htmlFor='date'>date</label>
						<input type='date' id='date' onChange={this.handleChange} value={this.state.value} /><br />

						<label htmlFor='time'>time</label>
						<input type='time' id='time' onChange={this.handleChange} value={this.state.value} /><br />
						
						<button onClick={close}>cancel</button>
						<button onClick={() => this.handleAddReceipt(close)}>add</button>
					</div>
				)}
			</Popup>
		)
	}
}

export default AddReceipt