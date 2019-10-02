import React from 'react'
import AddReceipt from '../modals/AddReceipt'
import Navbar from '../modals/Navbar'
import database from '../../firebase/firebase'
import Items from '../Items/Items'
import store from '../../store/configureStore'

class Transactions extends React.Component {
	_isMounted = false

	constructor(props) {
		super(props)

		this.state = {
			transactions: []
		}

		this.updateList = this.updateList.bind(this)
	}

	componentDidMount() {
		this._isMounted = true
		this.updateList()
	}

	componentWillUnmount() {
		this._isMounted = false
	}
	
	updateList() {
		database.ref(`${localStorage.getItem('uID')}/transactions`).orderByChild('date').on('value', (snapshot) => {
			this.setState(state => {
				state.transactions = []
			})
			if(snapshot.val()) {
				snapshot.forEach(el => {
					this.setState(state => state.transactions.unshift({ //unshift - descentind order
						[el.key]: el.val()
					}))
				})
			} else {
				this.setState({ transactions: [] })
			}
		})

		database.ref(`${store.getState().uID || localStorage.getItem('uID')}`).update({ 
			categories: {
				bills: ['phone', 'gas', 'electicity', 'water'], 
				groceries: ['food', 'toileteries', 'stuff'], 
				car: ['insurance', 'fuel', 'legal stuff', 'maintainance'], 
				other: []
			}
		})

		console.log('list updated')
	}

	render() {
		if(this._isMounted) {
			const transactions = this.state.transactions.map((transaction, i) => {
				const transactionEls = transaction[Object.keys(transaction)[0]]
	
				return (
					<li key={i}>
						{transactionEls.shop} - {transactionEls.date} - {transactionEls.time} <br />
						<Items receiptId={Object.keys(transaction)} updateList={this.updateList} />
					</li>
				)
			})
			return (
				<div>
					<h1>u have no money</h1>
					<div>
					<ul>
						{transactions.length ? transactions : <div>dupa</div>}	
					</ul>
					</div>
					<hr />
					<Navbar />
					<AddReceipt uID={this.props.uID} />
				</div>
			)
		} else {
			return (
				<div>
					<h1>u have no money</h1>
					<div>
					<ul>
						{<div>no shit</div>}	
					</ul>
					</div>
					<hr />
					<Navbar />
					<AddReceipt uID={this.props.uID} />
				</div>
			)
		}
	}
}

export default Transactions