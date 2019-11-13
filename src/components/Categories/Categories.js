import React from 'react'
import Navbar from '../modals/Navbar'
import Shops from '../Shops/Shops'
import database from '../../firebase/firebase'
import store from '../../store/configureStore'

class Categories extends React.Component {
	constructor() {
		super()

		this.fetchCategories = this.fetchCategories.bind(this)
		this.populateCategories = this.populateCategories.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.removeCategoriesElement = this.removeCategoriesElement.bind(this)

		this.state = {
			categories: [],
			categoriesHtml: [],

			subcat: '',
			category: ''
		}
	}

	componentDidMount() {
		console.log('mount')
		this.fetchCategories()
	}

	handleChange(e) {
		this.setState({ [e.target.id]: e.target.value })
	}
	
	removeCategoriesElement(name, cat) {
		if(cat) { // remove subcategory
			if(this.state.categories[cat].length === 1) { // replace with control item (deleting the only subcat)
				database.ref(`${store.getState().uID || localStorage.getItem('uID')}/categories/`).update({
					[cat]: [0]
				})
			} else { //delete
				database.ref(`${store.getState().uID || localStorage.getItem('uID')}/categories/`).update({
					[cat]: [...this.state.categories[cat].filter((el) => el !== name)]
				})
			}
		} else { // remove category
			database.ref(`${store.getState().uID || localStorage.getItem('uID')}/categories/${name}`).remove()
		}

		this.fetchCategories()
	}

	async addCategoriesElement(name, cat) {
		if(cat) { // add new subcategory
			await database.ref(`${store.getState().uID || localStorage.getItem('uID')}/categories/`).set({ 
				...this.state.categories,
				[cat]: [...this.state.categories[cat], name]
			})
			if(this.state.categories[cat][0] === 0) { // remove control item
				this.state.categories[cat].shift()
				await database.ref(`${store.getState().uID || localStorage.getItem('uID')}/categories/`).set({
					...this.state.categories, 
					[cat]: [...this.state.categories[cat]]
				})
			}
		} else { // add new category
			await database.ref(`${store.getState().uID || localStorage.getItem('uID')}/categories`).set({ 
				...this.state.categories,
				[name]: [0]
			})
			this.setState({ errorMessage: '' })
		}

		this.fetchCategories()
	}
	
	fetchCategories() {
		database.ref(`${store.getState().uID || localStorage.getItem('uID')}/categories`).on('value', async (snapshot) => {
			console.log('fetch', snapshot.val())
			if(JSON.stringify(this.state.categories) !== JSON.stringify(snapshot.val())) {
				console.log('state change', snapshot.val())
				await this.setState({ categories: snapshot.val() })
				this.populateCategories()
			}
		})
	}

	populateCategories() {
		this.setState({ categoriesHtml: [] })
		let arr = []
		
		if(this.state.categories) {
			Object.keys(this.state.categories).map((category, i) => { 
				arr = arr.concat( //list of categories
					<ul key={`ul${i}`}>
						{category}
						<button onClick={() => this.removeCategoriesElement(category)}>x</button>
					</ul>
				)
	
				this.state.categories[category].map((subcategory, j) => { //sub-lists of subcategories
					return subcategory !== 0 ? arr = arr.concat(
						<li key={`ul${i}${j}`}>{subcategory}
							<button onClick={() => this.removeCategoriesElement(subcategory, category)}>x</button>
						</li>
					) : undefined
				})
	
				arr = arr.concat( // addSubcat field
					<li key={`li_sub_${i}`}>
						<input type='text' id='subcat' value={this.state.value} onChange={this.handleChange} />
						<button onClick={() => this.addCategoriesElement(this.state.subcat, category)}>ADD</button>
					</li>
				) 
	
				return arr
			})
		}

		arr = arr.concat( // addCategory field
			<ul key={`li_cat`}>
				<input id='category' type='text' value={this.state.value} onChange={this.handleChange} />
				<button onClick={() => this.addCategoriesElement(this.state.category)}>ADD</button>
			</ul>
		)

		this.setState({ categoriesHtml: arr })
	}
	
	render() {
		return (
			<div>
				<div>categories</div>
				{ this.state.categoriesHtml }
				<hr />
				<Shops />
				<hr />
				<Navbar />
			</div>
		)
	}
}

export default Categories