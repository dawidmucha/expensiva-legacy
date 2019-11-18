import React from 'react'
import AddReceipt from '../modals/AddReceipt'
import Navbar from '../modals/Navbar'
import database from '../../firebase/firebase'
import Items from '../Items/Items'
import { auth } from '../../firebase/firebase'
import { Redirect } from 'react-router-dom'

class Transactions extends React.Component {
	_isMounted = false

	constructor(props) {
		super(props)

		this.state = {
			transactions: [],
			isLoggedIn: false
		}

		this.updateList = this.updateList.bind(this)
	}

	componentDidMount() {
		this._isMounted = true
		this.updateList()
		
		auth.onAuthStateChanged((user) => {
			if (user) {
				this.setState({ isLoggedIn: true })
			} else {
				this.setState({ isLoggedIn: false })
			}
		})
	}

	componentWillUnmount() {
		this._isMounted = false
	}
	
	updateList() {
		if(this._isMounted) {
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
		}
	}
	
	render() {
		if(this._isMounted) {
			if(!this.state.isLoggedIn && window.location.href.includes('/transactions')) {
				{ console.log('g u y', window.location.href) }
				return (
					<Redirect from='/transactions' to='/' />
				)
			}
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