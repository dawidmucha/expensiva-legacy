import React from 'react'
import Popup from 'reactjs-popup'
import database from '../../firebase/firebase'
import store from '../../store/configureStore'

class Items extends React.Component {
	constructor(props) {
		super(props)

		this.handleChange = this.handleChange.bind(this)
		this.handleCategoryChange = this.handleCategoryChange.bind(this)
		this.handleSubcatChange = this.handleSubcatChange.bind(this)
		this.handleAddItem = this.handleAddItem.bind(this)
		this.fetchItems = this.fetchItems.bind(this)
		this.openModal = this.openModal.bind(this)
		this.closeModal = this.closeModal.bind(this)

		this.state = {
			name: undefined,
			amount: undefined,
			volume: undefined,
			price: undefined,
			isDiscount: undefined,
			category: undefined,
			subcat: undefined,

			items: [],
			modalState: false
		}
	}

	componentDidMount() {
		this.fetchItems()
	}

	openModal() {
		this.setState({modalState: true})
	}

	closeModal() {
		this.setState({modalState: false})
	}



	fetchItems() {
		let arr = []
		database.ref(`${store.getState().uID || localStorage.getItem('uID')}/transactions/${this.props.receiptId}/items`).on('child_added', snapshot => {
			arr = arr.concat(snapshot.val())
		})
		this.setState({ items: arr })
	}

	handleChange(e) {
		this.setState({ [e.target.id]: e.target.value })
	}

	handleCategoryChange(e) {
		this.setState({ category: e.target.value })
	}

	handleSubcatChange(e) {
		this.setState({ subcat: e.target.value })
	}

	handleAddItem() {
		database.ref(`${store.getState().uID || localStorage.getItem('uID')}/transactions/${this.props.receiptId}/items`).push({ 
			name: this.state.name,
			amount: this.state.amount,
			volume: this.state.volume,
			price: this.state.price,
			isDiscount: this.state.isDiscount,
			category: this.state.category,
			subcat: this.state.subcat,
		}).once('child_added', data => {
			this.fetchItems()
		})
		this.closeModal()
	}

	render() {
		const items = this.state.items.map((item, i) => {
			return (
				<li key={i}>
					{item.name} {item.amount} {item.category} {item.subcat}
				</li>
			)
		})

		return (
			<ul>
				{items}
				<li>
					<Popup trigger={<button>ADD</button>} modal open={this.state.modalState}>
						<div>
							<label htmlFor='name'>name</label>
							<input type='text' id='name' onChange={this.handleChange} value={this.state.value} /> <br />

							<label htmlFor='amount'>amount</label>
							<input type='number' id='amount' onChange={this.handleChange} value={this.state.value} /> <br />

							<label htmlFor='volume'>volume</label>
							<input type='number' id='volume' onChange={this.handleChange} value={this.state.value} /> <br />

							<label htmlFor='price'>price</label>
							<input type='number' id='price' onChange={this.handleChange} value={this.state.value} /> <br />

							<label htmlFor='isDiscount'>discount?</label>
							<input type='checkbox' id='isDiscount' onChange={this.handleChange} value={this.state.value} /> <br />

							<label htmlFor='category'>category</label>
							<select onChange={this.handleCategoryChange}>
								<option id='one' value='one'>one</option>
								<option id='two' value='two'>two</option>
								<option id='three' value='three'>three</option>
							</select><br />

							<label htmlFor='subcat'>subcat.</label>
							<select onChange={this.handleSubcatChange}>
								<option id='four' value='four'>four</option>
								<option id='five' value='five'>five</option>
								<option id='six' value='six'>six</option>
							</select><br />

							<button onClick={this.closeModal}>cancel</button>
							<button onClick={this.handleAddItem}>add</button>
						</div>
					</Popup>
				</li>
			</ul>
		)
	}
}

export default Items