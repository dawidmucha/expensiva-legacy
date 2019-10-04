import React from 'react'
import Navbar from '../modals/Navbar'
import database from '../../firebase/firebase'
import store from '../../store/configureStore'

class Categories extends React.Component {
	constructor() {
		super()

		this.fetchCategories = this.fetchCategories.bind(this)
		this.populateCategories = this.populateCategories.bind(this)

		this.state = {
			categories: [],
			categoriesHtml: ['3', '4']
		}
	}
	
	componentDidMount() {
		this.fetchCategories()
	}
	
	async fetchCategories() {
		await database.ref(`${store.getState().uID || localStorage.getItem('uID')}/categories`).on('value', (snapshot) => {
			this.setState({ categories: snapshot.val() })
			this.populateCategories()
		})
	}

	populateCategories() {
		this.setState({ categoriesHtml: [] })
		let arr = []
		console.log(this.state.categories)
		console.log(Object.keys(this.state.categories))
		
		Object.keys(this.state.categories).map((category, i) => {
			arr = arr.concat(<ul key={`ul${i}`}>{category}</ul>)
			this.state.categories[Object.keys(this.state.categories)[i]].map((subcategory, j) => {
				return arr = arr.concat(<li key={`ul${i}${j}`}>{subcategory}</li>)
			})
			return arr
		})

		this.setState({ categoriesHtml: arr })
	}
	
	render() {

		return (
			<div>
				<div>categories</div>
				{ this.state.categoriesHtml }
				<hr />
				<Navbar />
			</div>
		)
	}
}

export default Categories