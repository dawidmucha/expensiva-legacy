import React from 'react'
import AddReceipt from '../modals/AddReceipt'
import Navbar from '../modals/Navbar'
import database from '../../firebase/firebase'
import Items from '../Items/Items'
import store from '../../store/configureStore'

class Transactions extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			transactions: []
		}
	}

	componentDidMount() {
		database.ref(`${localStorage.getItem('uID')}/transactions`).on('value', (snapshot) => {
			this.setState(state => {
				state.transactions = []
			})
			snapshot.forEach(el => {
				this.setState(state => state.transactions.push({
					[el.key]: el.val()
				}))
			})
		})

		database.ref(`${store.getState().uID || localStorage.getItem('uID')}`).update({ 
			categories: {
				bills: ['phone', 'gas', 'electicity', 'water'], 
				groceries: ['food', 'toileteries', 'stuff'], 
				car: ['insurance', 'fuel', 'legal stuff', 'maintainance'], 
				other: []
			}
		})
	}
	
	render() {
		const transactions = this.state.transactions.map((transaction, i) => {
			const transactionEls = transaction[Object.keys(transaction)[0]]
			return (
				<li key={i}>
					{transactionEls.shop} - {transactionEls.date} - {transactionEls.time} <br />
					<Items receiptId={Object.keys(transaction)} />
				</li>
			)
		})

		return (
			<div>
				<h1>u have no money</h1>
				<div>
				<ul>
					{transactions}	
				</ul>
				</div>
				<hr />
				<Navbar />
				<AddReceipt uID={this.props.uID} />
			</div>
		)
	}
}

export default Transactions