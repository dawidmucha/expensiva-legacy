import React from 'react'
import Popup from 'reactjs-popup'
import Select from 'react-select'
import database from '../../firebase/firebase'
import store from '../../store/configureStore'

class Items extends React.Component {
	constructor(props) {
		super(props)

		this.handleChange = this.handleChange.bind(this)
		this.handleSelectChange = this.handleSelectChange.bind(this)
		this.handleAddItem = this.handleAddItem.bind(this)
		this.fetchItems = this.fetchItems.bind(this)
		this.removeItem = this.removeItem.bind(this)
		this.updateCategories = this.updateCategories.bind(this)
		this.removeReceipt = this.removeReceipt.bind(this)

		this.state = {
			name: undefined,
			amount: undefined,
			volume: undefined,
			volSfx: true,
			price: undefined,
			isDiscount: undefined,
			category: undefined,
			categoryNumber: undefined,
			subcat: undefined,

			wholePrice: 0,

			items: [],
			categories: [],
			subcats: [],

			errorMessage: '',
			justDeleted: false,

			addModalState: false,
			receiptModalState: false
		}
	}

	
	async refreshData() {
		await this.fetchItems()
		this.calculateWholePrice()	
		if(this.state.selectedCategory) this.updateCategories()
	}
	
	componentDidMount() {
		this.refreshData()
		this.updateCategories()
	}

	async removeItem(id) {
		await database.ref(`${store.getState().uID || localStorage.getItem('uID')}/transactions/${this.props.receiptId}/items/${id}`).remove()
		this.refreshData()
	}

	fetchItems() {
		let arr = []
		database.ref(`${store.getState().uID || localStorage.getItem('uID')}/transactions/${this.props.receiptId}/items`).orderByChild('date').on('child_added', (snapshot) => {
			arr = arr.concat(Object.assign({}, snapshot.val(), { id: snapshot.key }))
		})
		this.setState({ items: arr })
	}

	calculateWholePrice() {
		this.setState({wholePrice: 0})
		this.state.items.map((item) => {
			return this.setState(state => ({
				wholePrice: state.wholePrice + parseInt(item.price, 10)
			}))
		})
	}

	async updateCategories(e) {
		let catsSnapshot = undefined
		let categories = []
		let subcats = []
		
		await database.ref(`${store.getState().uID || localStorage.getItem('uID')}/categories`).once('value').then(snapshot => {
			catsSnapshot = snapshot.val()
		})
		
		
		Object.keys(catsSnapshot).map((category) => {
			return categories = categories.concat({ value: 'category', label: category })
		})
		
		if(this.state.category) {
			catsSnapshot[this.state.category].map((subcat) => {
				return subcats = subcats.concat({ value: 'subcat', label: subcat })
			})
		}

		this.setState(state => ({
			categories,
			subcats
		}))
	}

	handleChange(e) {
		this.setState({ [e.target.id]: e.target.value })
	}

	handleSelectChange(e) {
		console.log(e)
		this.updateCategories(e)

		this.setState({ [e.value]: e.label })
	}

	handleAddItem(close) {
		if(this.state.name && this.state.price && this.state.category && this.state.subcat) {
			database.ref(`${store.getState().uID || localStorage.getItem('uID')}/transactions/${this.props.receiptId}/items`).push({ 
				name: this.state.name,
				amount: this.state.amount || 1,
				volume: this.state.volume || 1,
				volSfx: this.state.volSfx,
				price: this.state.price,
				isDiscount: this.state.isDiscount || false,
				category: this.state.category,
				subcat: this.state.subcat,
			}).once('child_added', () => {
				this.refreshData()
			})
			this.setState({ errorMessage: '' })
			close()
		} else this.setState({ errorMessage: 'Fill all required fields!' })
	}

	async removeReceipt(close, receiptClose) {
		await database.ref(`${store.getState().uID || localStorage.getItem('uID')}/transactions/${this.props.receiptId}`).remove()
		this.refreshData()
		this.setState({ justDeleted: true })
		close()
		receiptClose()
	}

	render() {
		const items = this.state.items.map((item, i) => {
			return (
				<li key={i}>
					{item.name} ({item.amount}x{item.volume}kg)<br />
					{item.price}zł {item.isDiscount}<br />
					{item.category} {item.subcat} 
					<button onClick={() => this.removeItem(item.id)}>X</button><br />
				</li>
			)
		})

		const itemsSummary = this.state.items.map((item, i) => {
			return (
				<span key={i}>
					<span>{item.name}</span>
					{ this.state.items.length !== i + 1 ? <span>, </span> : '' }
				</span>
			)
		})

		return (
			<div>
				<Popup modal trigger={<button>EDIT</button>}>
					{receiptClose => (
						<div>	
							<Popup modal trigger={<button>ADD</button>} onChange={this.escapeReceiptPhantom}>
								{close => (
									<div>
										<p>{this.state.errorMessage}</p>
	
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
										<Select options={this.state.categories} onChange={this.handleSelectChange} value={this.props.value} />
		
										<label htmlFor='subcat'>subcat.</label>
										<Select options={this.state.subcats} onChange={this.handleSelectChange} value={this.props.value} />
		
										<button onClick={() => this.handleAddItem(close)}>add</button>
									</div>
								)}
							</Popup>
	
							<Popup modal trigger={<button>DELETE</button>}>
									{close => (
										<div>
											<h1>Are you sure</h1>
											<h6>this action will delete the entire receipt</h6>
											<button onClick={close}>no</button>
											<button onClick={() => this.removeReceipt(close, receiptClose)}>yes</button>
										</div>
									)}
							</Popup>
								
							<ul>
								{items}
							</ul>	
						</div>
					)}
				</Popup>

				<span>{this.state.wholePrice}</span>
				<ul>
					{itemsSummary}
				</ul>
			</div>
		)
	}
}

export default Items